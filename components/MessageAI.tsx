import {
  FlatList,
  Pressable,
  SectionList,
  Text,
  View,
} from '@gluestack-ui/themed';
import Markdown from 'react-native-markdown-display';
import {Publikasi, variable} from '../utils/llmChain';
import {config as defaultConfig} from '@gluestack-ui/config';
import React from 'react';
import {toTitleCase} from '../view/ChatView';
import ChatStyles from '../styles/ChatStyles';
import {blue, colorPrimary, white} from '../utils/color';

interface MessageAIProps {
  text: string;
  onClick: Function;
  onShowPublication: Function;
}
interface AIMessage {
  type: string | 'string';
  message: string | [Array<Publikasi>, Array<variable>];
  q: string;
}

const MessageAI = (props: MessageAIProps) => {
  let m: AIMessage = JSON.parse(props.text);
  if (m.type === 'string') {
    return (
      <View flexDirection="row" style={styles.messageBoxAi} flex={1}>
        <View
          backgroundColor={blue}
          style={styles.messageBoxChatAI}
          flexWrap="wrap"
          flexDirection="row"
          flex={1}>
          <Markdown
            style={{
              text: {
                color: white,
                fontSize: defaultConfig.tokens.fontSizes.md,
              },
            }}>
            {String(m.message)}
          </Markdown>
        </View>
      </View>
    );
  } else {
    if (typeof m.message !== 'string') {
      if (m.message[1]) {
        const domain_unique = [...new Set(m.message[1].map(e => e.domain))];
        const list_section = domain_unique.reduce(
          (prev: Array<{title: string; data: Array<variable>}>, curr) => {
            if (typeof m.message[1] !== 'string') {
              let title =
                m.message[1][
                  m.message[1].findIndex((e: variable) => e.domain === curr)
                ].wilayah;
              let item = m.message[1].filter(
                (e: variable) => e.domain === curr,
              );
              prev.push({
                title: `${
                  curr === '0000'
                    ? ''
                    : curr.charAt(2) === '0' && curr.charAt(3) === '0'
                    ? 'Provinsi'
                    : curr.charAt(2) === '7'
                    ? 'Kota'
                    : 'Kabupaten'
                } ${title}`,
                data: item,
              });
            }
            return prev;
          },
          [],
        ) as Array<{title: string; data: Array<variable>}>;
        return (
          <View flexDirection="row" style={styles.messageBoxAi} flex={1}>
            <View
              flexDirection="column"
              style={styles.messageBoxChatAI}
              backgroundColor={blue}>
              <Text
                color={white}
                marginBottom={'$3'}
                marginLeft={'$3'}
                marginTop={'$2'}>
                Berikut beberapa data-data yang ditemukan silahkan ketuk judul
                data dibawah ini jika ingin menampilkannya
              </Text>
              <SectionList
                sections={list_section}
                keyExtractor={(item: variable | any, index) =>
                  `${item.var_id_domain}-${index}`
                }
                renderItem={(e: {item?: variable | any}) => (
                  <Pressable
                    onPress={() => props.onClick(e.item)}
                    marginBottom={10}>
                    <View
                      backgroundColor={colorPrimary}
                      padding={'$2'}
                      style={styles.messageBoxChatAI}>
                      <Text color="white">{e.item.judul}</Text>
                    </View>
                  </Pressable>
                )}
                renderSectionHeader={(e: {
                  section:
                    | {
                        title?: string;
                      }
                    | any;
                }) => (
                  <View style={styles.messageBoxChatAI} marginVertical={'$2'}>
                    <Text fontWeight={'$bold'} size={'xl'} color={white}>
                      {toTitleCase(e.section.title)}
                    </Text>
                  </View>
                )}
              />
              <Text
                color={white}
                marginBottom={'$3'}
                marginLeft={'$3'}
                marginTop={'$2'}
                fontWeight={'$bold'}
                size={'xl'}>
                Publikasi BPS Kabupaten Minahasa Utara
              </Text>
              <FlatList
                scrollEnabled={false}
                data={m.message[0]}
                keyExtractor={(item: variable | any, index) => {
                  let now = new Date().toISOString();
                  return `${item.title}-${index}-${now}`;
                }}
                renderItem={(e: {item: variable | any}) => {
                  return (
                    <Pressable
                      onPress={() => props.onShowPublication(e.item)}
                      marginBottom={10}>
                      <View
                        backgroundColor={colorPrimary}
                        padding={'$2'}
                        style={styles.messageBoxChatAI}>
                        <Text color="white">{e.item.title}</Text>
                      </View>
                    </Pressable>
                  );
                }}
              />
            </View>
          </View>
        );
      } else {
        return (
          <View flexDirection="row" style={styles.messageBoxAi} flex={1}>
            <View
              flexDirection="column"
              style={styles.messageBoxChatAI}
              backgroundColor={white}>
              <Text
                color={white}
                marginBottom={'$3'}
                marginLeft={'$3'}
                marginTop={'$2'}>
                Atau anda dapat melihat pada publikasi berikut :
              </Text>
              <FlatList
                scrollEnabled={false}
                data={m.message[0]}
                keyExtractor={(item: variable | any, index) => {
                  let now = new Date().toISOString();
                  return `${item.title}-${index}-${now}`;
                }}
                renderItem={(e: {item: variable | any}) => {
                  return (
                    <Pressable
                      onPress={() => props.onShowPublication(e.item)}
                      style={styles.messageBoxChatAI}
                      backgroundColor="white"
                      marginBottom={10}>
                      <View backgroundColor="white">
                        <Text color="black">{e.item.title}</Text>
                      </View>
                    </Pressable>
                  );
                }}
              />
            </View>
          </View>
        );
      }
    } else {
      return (
        <View flexDirection="row" style={styles.messageBoxAi} flex={1}>
          <View backgroundColor={white} style={styles.messageBoxChatAI}>
            <Markdown
              style={{
                text: {
                  color: 'black',
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

const styles = ChatStyles;

export default MessageAI;
