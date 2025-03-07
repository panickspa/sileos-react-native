import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { SectionList } from '@/components/ui/section-list';
import { Pressable } from '@/components/ui/pressable';
import { FlatList } from '@/components/ui/flat-list';
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
      <View style={styles.messageBoxAi} className="flex-row flex-1">
        <View
          style={styles.messageBoxChatAI}
          className={` backgroundColor-${blue} flex-wrap flex-row flex-1 `}>
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
          <View style={styles.messageBoxAi} className="flex-row flex-1">
            <View
              style={styles.messageBoxChatAI}
              className={` backgroundColor-${blue} flex-column `}>
              <Text className={` color-secondary-0 mb-3 ml-3 mt-2 `}>
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
                    className="mb-[10px]">
                    <View
                      style={styles.messageBoxChatAI}
                      className={` bg-primary-0 p-2 `}>
                      <Text className="text-white">{e.item.judul}</Text>
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
                  <View style={styles.messageBoxChatAI} className="my-2">
                    <Text size={'xl'} className={` color-secondary-0 font-bold `}>
                      {toTitleCase(e.section.title)}
                    </Text>
                  </View>
                )}
              />
              <Text size={'xl'} className={` color-secondary-0 mb-3 ml-3 mt-2 font-bold `}>
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
                      className="mb-[10px]">
                      <View
                        style={styles.messageBoxChatAI}
                        className={` bg-primary-0 p-2 `}>
                        <Text className="text-white">{e.item.title}</Text>
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
          <View style={styles.messageBoxAi} className="flex-row flex-1">
            <View
              style={styles.messageBoxChatAI}
              className={` bg-primary-0 flex-column `}>
              <Text className={` color-secondary-0 mb-3 ml-3 mt-2 `}>
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
                      className="bg-white mb-[10px]">
                      <View className="bg-white">
                        <Text className="text-black">{e.item.title}</Text>
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
        <View style={styles.messageBoxAi} className="flex-row flex-1">
          <View style={styles.messageBoxChatAI} className={` bg-primary-0 `}>
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
