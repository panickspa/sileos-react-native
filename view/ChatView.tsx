/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
/* eslint-disable react/react-in-jsx-scope */
import {
  Text,
  Input,
  InputField,
  SafeAreaView,
  Modal,
  ModalContent,
  View,
} from '@gluestack-ui/themed';
import {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native';
import {
  Chain,
  DataResponse,
  analyzeDataFromHTML,
  clearMessages,
  getAllMessage,
  getDBConnection,
  insertMessages,
  tableApiStyle,
  transformApi,
  variable,
  getPublication,
} from '../utils/llmChain';
import WebView from 'react-native-webview';
import {apiKey, getDynData} from '../utils/api';
import showdown from 'showdown';
import Markdown from 'react-native-markdown-display';
import {config as defaultConfig} from '@gluestack-ui/config';
import {colorPrimary} from '../utils/color';
import {Publikasi} from './PublikasiView';
import PdfViewModal from '../components/PdfViewModal';
import AlerModal from '../components/AlertModal';
import ChatStyles from '../styles/ChatStyles';
import MessageAI from '../components/MessageAI';
import MessageUser from '../components/MessageUser';

const converter = new showdown.Converter();
interface Message {
  type: 'AI' | 'user';
  message: string | object;
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

export function toTitleCase(str: string) {
  return str.toLocaleLowerCase().replace(/\b\w/g, function (char: string) {
    return char.toUpperCase();
  });
}

const initTable: DataResponse | any = {};

interface MessageSkeletonProps {
  generatingText: boolean;
  attempt: number;
}
function dotRender(i: number) {
  if (i === 1) {
    return '.';
  }
  let d = '';
  for (let dot = 0; dot < i; dot++) {
    d = d + '.';
  }
  return d;
}
interface MessageSkeletonProps {
  generatingText: boolean;
  attempt: number;
}

const MessageSkeleton = (props: MessageSkeletonProps) => {
  if (props.generatingText) {
    return (
      <View flex={1}>
        <View style={styles.messageBoxAi} flex={1}>
          <View
            minHeight={20}
            minWidth={20}
            backgroundColor="$blue200"
            style={styles.messageBoxChatAI}>
            <View
              flexDirection="row"
              justifyContent="center"
              alignItems="center">
              <Markdown
                style={{
                  text: {
                    color: defaultConfig.tokens.colors.warmGray700,
                    fontSize: defaultConfig.tokens.fontSizes.md,
                  },
                }}>
                Sebentar, Pegasus sedang menggali informasi
              </Markdown>
              <Text>{`  ${dotRender(props.attempt)}`}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  } else {
    return <View />;
  }
};

// interface SyncFooter {
//   domain: DomainSync;
// }
// const SyncFooter = (props: DomainSync) => {
//   return props.sync ? (
//     <View minHeight={'$10'} style={styles.messageBoxAi} flex={1}>
//       <View style={styles.messageBoxChatAI} backgroundColor="$blue200">
//         <View paddingVertical={'$2'}>
//           <Text>Pegasus sedang sinkronisasi data {props.domain}</Text>
//         </View>
//       </View>
//     </View>
//   ) : (
//     <View />
//   );
// };

async function clearMessages_() {
  try {
    let db = await getDBConnection();
    if (db) {
      let c = await clearMessages(db);
      return c;
    }
  } catch (error) {
    console.log(error);
  }
}
let ChainRequestInit = new Chain('');

// interface DomainSync {
//   domain: string | String;
//   sync: boolean;
// }

export default function ChatView() {
  const [messages, setMessages] = useState(initMessage);
  const [message, setMessage] = useState('');
  const [generatingText, setGeneratingText] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [table, setTable] = useState(initTable);
  const [analyzeData, setAnalyzeData] = useState('');
  const messagesRef = useRef<FlatList>(null);
  const [ChainRequest] = useState(ChainRequestInit);
  const [a, setAttempt] = useState(0);
  const [pubModal, setPubModal] = useState(false);
  const [pdfUri, setPdfUri] = useState('');
  const [titlePdf, setTitlePdf] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [msgAlert, setMsgAlert] = useState('');
  const [msgHeaderAlert, setMsgHeaderAlert] = useState('');
  useEffect(() => {
    if (pdfUri != '') {
      setPubModal(true);
    } else {
      setPubModal(false);
    }
  }, [pdfUri]);

  useEffect(() => {
    if (pubModal) {
      if (pdfUri != '') {
        setShowAlert(false);
      }
    }
  }, [pubModal]);
  useEffect(() => {
    getAllMessage().then((message_: any) => {
      if (message_[0].rows.length) {
        setMessages([
          ...messages,
          ...message_[0].rows.raw(),
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
      }
    });
  }, []);

  useEffect(() => {
    ChainRequest.onAttempt(({attempt}) => {
      setAttempt(attempt);
    });
    return () => {
      ChainRequest.onAttempt(() => {});
    };
  }, []);

  async function getAIResponse(msg: string) {
    try {
      ChainRequest.setPertanyaan(msg);
      const db = await getDBConnection();
      if (db) {
        const ai_answer = await ChainRequest.doubleChain();
        const asnwer = {
          message: ai_answer,
          type: typeof ai_answer,
          q: msg,
        };
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
      }
    } catch (error) {
      console.log(error);
    } finally {
      setGeneratingText(false);
    }
  }
  function addMessage() {
    try {
      if (
        message.toLowerCase() == 'hapus pesan' ||
        message.toLowerCase() == 'clear messages'
      ) {
        setMessages([...initMessage]);
        clearMessages_();
        setMessage('');
      } else {
        setMessages([
          ...messages,
          {
            type: 'user',
            message: message,
          },
        ]);
        setMessage('');
        setGeneratingText(true);
        getAIResponse(message.substring(0, 250));
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  }
  async function requestTable(e: variable) {
    setModalOpen(true);
    setAnalyzeData('Pegasus sedang menganalisa data ...');
    let d: DataResponse = await getDynData({
      var: e.var_id,
      domain: e.domain,
      apiKey: apiKey,
    });
    setTable(d);
    let a_ = await analyzeDataFromHTML(
      `<h1>${d.var[0].val} di ${e.wilayah}</h1>` + transformApi(d),
    );
    setAnalyzeData(a_.natural_response);
  }

  function changeMessage(
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) {
    setMessage(e.nativeEvent.text);
  }
  function openPdf(e: any) {
    setPdfUri(String(e.uri));
    setTitlePdf(e.title);
  }
  async function requestPublication(e: Publikasi) {
    // console.log('Publikasi', e);
    setMsgHeaderAlert('Menggambil informasi PDF');
    setMsgAlert('Pegasus sedang mengambil informasi');
    setShowAlert(true);
    // setPubModal(true);
    try {
      let pubs = await getPublication(
        `https://webapi.bps.go.id/v1/api/list/model/publication/keyword/${encodeURI(
          String(e.title),
        )}/domain/7106/key/23b53e3e77445b3e54c11c60604350bf/`,
      );
      console.log('pubs', pubs);
      // setPubModal(true);
      // setPubModal(false);
      if (pubs) {
        openPdf({
          uri: pubs.pdf,
          title: pubs.title,
        });
      }
    } catch (error) {}
  }

  function closePdfModal() {
    setPubModal(false);
  }

  function loadedPdf(e: any) {
    console.log('pdf loaded', e);
    setShowAlert(false);
  }

  function onError(e: any) {
    console.log(e);
    if (pdfUri !== '') {
      setMsgHeaderAlert('Publikasi Tidak terbuka');
      setMsgAlert('Silahkan periksa kembali jaringan anda');
      setShowAlert(true);
      setPubModal(false);
    }
  }

  function closeAlert() {
    setShowAlert(false);
  }

  return (
    <View style={styles.content}>
      <SafeAreaView flex={1}>
        <FlatList
          inverted
          ref={messagesRef}
          initialNumToRender={10}
          renderItem={({item}: any) =>
            item.type == 'user' ? (
              MessageUser(String(item.message))
            ) : (
              <MessageAI
                text={item.message}
                onClick={requestTable}
                onShowPublication={requestPublication}
              />
            )
          }
          keyExtractor={(item, index) => `messages-${index}`}
          data={[...messages].reverse()}
          ListHeaderComponent={
            <MessageSkeleton generatingText={generatingText} attempt={a} />
          }
        />
      </SafeAreaView>
      <PdfViewModal
        title={titlePdf}
        onError={onError}
        showModal={pubModal}
        onClose={closePdfModal}
        url={pdfUri}
        onLoaded={loadedPdf}
      />
      <AlerModal
        showModal={showAlert}
        onClose={closeAlert}
        msg={msgAlert}
        headerMsg={msgHeaderAlert}
      />
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
            style={styles.tableWebviews}
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
              ${converter.makeHtml(analyzeData)}
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
        paddingVertical={5}
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

const styles = ChatStyles;
