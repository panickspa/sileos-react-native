/* eslint-disable eqeqeq */
/* eslint-disable react/react-in-jsx-scope */
import {
  // Button,
  // Icon,
  Text,
  Input,
  InputField,
  // InputSlot,
  SafeAreaView,
  Pressable,
  Modal,
  ModalContent,
  View,
} from '@gluestack-ui/themed';
// import {Send} from 'lucide-react-native';
import {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  StyleSheet,
  TextInputSubmitEditingEventData,
} from 'react-native';
// import {SafeAreaView} from 'react-native';
import {
  DataResponse,
  analyzeDataFromHTML,
  clearMessages,
  getAllMessage,
  getDBConnection,
  insertMessages,
  tableApiStyle,
  transformApi,
  variable,
} from '../utils/llmChain';
import {chain} from '../utils/llmChain';
import WebView from 'react-native-webview';
import {apiKey, default_domain, getDynData} from '../utils/api';
import showdown from 'showdown';
import Markdown from 'react-native-markdown-display';
import {config as defaultConfig} from '@gluestack-ui/config';
import {colorPrimary} from '../utils/color';

const converter = new showdown.Converter();
// import {SafeAreaView} from 'react-native';
// import {ScrollView} from 'react-native-gesture-handler';
interface Message {
  type: 'AI' | 'user';
  message: string | object;
}
interface AIMessage {
  type: string | 'string';
  message: string | Array<variable>;
  q: string;
}

const initMessage: Array<Message> = [
  {
    type: 'AI',
    message: JSON.stringify({
      type: 'string',
      message:
        'Halo Saya Pegasus Assistant, berikan saja pertanyaan apapun kepada saya',
      q: '',
    }),
  },
];

const initTable: DataResponse | any = {};

interface MessageSkeletonProps {
  generatingText: boolean;
}

const MessageSkeleton = (props: MessageSkeletonProps) => {
  if (props.generatingText) {
    return (
      <View style={styles.messageBoxAi} flex={1}>
        <View
          minHeight={20}
          minWidth={20}
          backgroundColor="$blue200"
          style={styles.messageBoxChatAI}>
          <Text>Sebentar, Pegasus sedang menggali informasi ...</Text>
        </View>
      </View>
    );
  } else {
    return <View />;
  }
};

async function clearMessages_() {
  try {
    let db = await getDBConnection();
    let c = await clearMessages(db);
    db.close();
    return c;
  } catch (error) {
    console.log(error);
  }
}

export default function ChatView() {
  const [messages, setMessages] = useState(initMessage);
  const [message, setMessage] = useState('');
  const [generatingText, setGeneratingText] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [table, setTable] = useState(initTable);
  const [analyzeData, setAnalyzeData] = useState('');
  const messagesRef = useRef<FlatList>(null);

  useEffect(() => messagesRef.current?.scrollToEnd(), [messages]);

  useEffect(() => {
    getDBConnection()
      .then(db => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        getAllMessage(db).then((message: any) => {
          // console.log('message', message);
          if (message[0].rows.length) {
            setMessages([
              ...messages,
              ...message[0].rows.raw(),
              {
                type: 'AI',
                message: JSON.stringify({
                  type: 'string',
                  message:
                    'Hai selamat datang kembali, berikan saja pertanyaan apapun kepada saya, jika ingin menghapus pesan silahkan untuk memberikan pertanyaan **hapus pesan** atau **clear messages**',
                  q: '',
                }),
              },
            ]);
            messagesRef.current?.scrollToEnd();
          }
          messagesRef.current?.scrollToEnd();
        });
      })
      .catch(err => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getAIResponse(msg: string) {
    const db = await getDBConnection();
    const ai_answer = await chain(msg, 7, db);
    const asnwer = {
      message: ai_answer,
      type: typeof ai_answer,
      q: msg,
    };
    setGeneratingText(false);
    setMessages([
      ...messages,
      {
        type: 'user',
        message: message,
      },
      {
        type: 'AI',
        message: JSON.stringify(asnwer),
      },
    ]);
    await insertMessages(db, [
      {
        type: 'user',
        message: message,
      },
      {
        type: 'AI',
        message: JSON.stringify(asnwer),
      },
    ]);
    // console.log(insert);
    await db.close();
    // messagesRef.current?.scrollToEnd();
  }
  function addMessage() {
    if (
      message.toLowerCase() == 'hapus pesan' ||
      message.toLowerCase() == 'clear messages'
    ) {
      setMessages([...initMessage]);
      clearMessages_();
    } else {
      setMessages([
        ...messages,
        {
          type: 'user',
          message: message,
        },
      ]);
      // messagesRef.current?.scrollToEnd();
      setMessage('');
      setGeneratingText(true);
      getAIResponse(message.substring(0, 250));
    }
  }

  async function requestTable(e: variable) {
    setModalOpen(true);
    // console.log(e);
    setAnalyzeData('Pegasus sedang menganalisa data ...');
    // setTable({});
    // setAnalyzeData('');
    let d: DataResponse = await getDynData({
      var: e.var_id,
      domain: default_domain,
      apiKey: apiKey,
    });
    setTable(d);
    let a = await analyzeDataFromHTML(
      `<h1>${d.var[0].val} di Minahasa Utara</h1>` + transformApi(d),
    );
    setAnalyzeData(a.natural_response);
  }

  function changeMessage(
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) {
    setMessage(e.nativeEvent.text);
  }

  return (
    <View style={styles.content}>
      <SafeAreaView flex={1}>
        <FlatList
          ref={messagesRef}
          initialNumToRender={10}
          renderItem={
            ({item}: any) =>
              item.type == 'user' ? (
                MessageUser(String(item.message))
              ) : item.type == 'skeleton' ? (
                <MessageSkeleton generatingText={generatingText} />
              ) : (
                <MessageAI text={item.message} onClick={requestTable} />
              )
            // : MessageAI(String(item.message))
          }
          keyExtractor={(item, index) => `messages-${index}`}
          data={messages}
          // extraData={[{type: 'skeleton', message: ''}]}
          ListFooterComponent={
            <MessageSkeleton generatingText={generatingText} />
          }
        />
      </SafeAreaView>
      <Modal
        size="full"
        height={'$full'}
        isOpen={modalOpen}
        onClose={() => {
          setAnalyzeData('');
          setTable({});
          setModalOpen(false);
        }}
        borderRadius={0}
        padding={0}>
        <ModalContent
          width={Dimensions.get('screen').width}
          paddingRight={0}
          borderRadius={0}
          flex={1}>
          <WebView
            style={{
              backgroundColor: '#004282',
            }}
            source={{
              html: `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Document</title>
          </head>
          <body>
              <style>
              ${tableApiStyle}
              </style>
              <div style="width: 100%; overflow-x: auto;" class="table">
              ${table.status ? transformApi(table) : ''}
              </div>
              <div class="card">
              ${
                converter.makeHtml(analyzeData)
                // analyzeData.replaceAll(/\s\*\s/g, '<br>').replaceAll(/\:\s/g, '<br>')
                // .replaceAll(/:\*\*/g, "</b>")
                // .replaceAll(/\*\*/g, "<b>")
              }
              </div>
          </body>
          </html>`,
            }}
          />
        </ModalContent>
      </Modal>
      <Input
        borderWidth={0}
        borderRadius={0}
        // marginBottom={5}
        paddingVertical={5}
        // minWidth={'$5'}
        // marginHorizontal={5}
        minHeight={'$12'}
        padding={'$2'}
        backgroundColor={colorPrimary}>
        <InputField
          returnKeyType="send"
          paddingLeft={15}
          marginRight={5}
          opacity={100}
          flex={1}
          backgroundColor="$blueGray300"
          borderRadius={100}
          placeholder="Tanyakan sesuatu ..."
          onChange={changeMessage}
          value={message}
          onSubmitEditing={addMessage}
        />
      </Input>
    </View>
  );
}

interface MessageAIProps {
  text: string;
  onClick: Function;
}

const MessageAI = (props: MessageAIProps) => {
  // console.log(props.text);
  let m: AIMessage = JSON.parse(props.text);
  if (m.type === 'string') {
    return (
      <View flexDirection="row" style={styles.messageBoxAi} flex={1}>
        <View
          backgroundColor="$blue500"
          style={styles.messageBoxChatAI}
          flexWrap="wrap"
          flexDirection="row"
          flex={1}>
          <Markdown
            style={{
              text: {
                color: 'white',
                fontSize: defaultConfig.tokens.fontSizes.md,
              },
            }}>
            {String(m.message)}
          </Markdown>
          {/* <Text color="white">{converter.makeHtml(String(m.message))}</Text> */}
        </View>
      </View>
    );
  } else {
    if (typeof m.message != 'string') {
      return (
        <View flexDirection="row" style={styles.messageBoxAi} flex={1}>
          <View
            flexDirection="column"
            style={styles.messageBoxChatAI}
            backgroundColor="$blue500">
            <Text
              color="white"
              marginBottom={'$3'}
              marginLeft={'$3'}
              marginTop={'$2'}>
              Berikut data-data yang ditemukan silahkan ketuk judul data dibawah
              ini jika ingin menampilkannya
            </Text>
            {m.message.map((e: variable, i: number) => (
              <Pressable
                key={`answer-${i}-of ${m.q}`}
                onPress={() => props.onClick(e)}
                style={styles.messageBoxChatAI}
                backgroundColor="white"
                marginBottom={10}>
                <View backgroundColor="white">
                  <Text color="black">{e.judul}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      );
    } else {
      return (
        <View flexDirection="row" style={styles.messageBoxAi} flex={1}>
          <View backgroundColor="$blue500" style={styles.messageBoxChatAI}>
            <Markdown
              style={{
                text: {
                  color: 'white',
                  fontSize: defaultConfig.tokens.fontSizes.md,
                },
              }}>
              {m.message}
            </Markdown>
          </View>
        </View>
      );
    }
  }
};

const MessageUser = (text: string) => {
  return (
    <View flexDirection="row" style={styles.messageBoxUser} flex={1}>
      <View style={styles.messageBoxChatUser} backgroundColor="$primary600">
        {/* <Text color="white">{text}</Text> */}
        <Markdown
          style={{
            text: {
              color: 'white',
              fontSize: defaultConfig.tokens.fontSizes.md,
            },
          }}>
          {String(text)}
        </Markdown>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignContent: 'center',
  },
  messageBoxChatAI: {
    padding: 10,
    borderRadius: 25,
    // backgroundColor: '$blue500',
    color: 'white',
    marginLeft: 5,
    marginTop: 5,
    marginRight: 50,
    height: 'auto',
    // width: 'auto',
  },
  messageBoxChatUser: {
    padding: 10,
    borderRadius: 25,
    marginRight: 5,
    marginTop: 5,
    // backgroundColor: 'blue',
    color: 'white',
    marginLeft: 50,
  },
  messageBoxAi: {
    justifyContent: 'flex-start',
    marginBottom: 6,
  },
  messageBoxUser: {
    justifyContent: 'flex-end',
    marginBottom: 6,
  },
});
