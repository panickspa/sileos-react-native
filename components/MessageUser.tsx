import { View } from '@/components/ui/view';
import Markdown from 'react-native-markdown-display';
import {config as defaultConfig} from '@gluestack-ui/config';
import React from 'react';
import {white} from '../utils/color';
import ChatStyles from '../styles/ChatStyles';

export const MessageUser = (text: string) => {
  return (
    <View style={styles.messageBoxUser} className="flex-row flex-1">
      <View style={styles.messageBoxChatUser} className="bg-primary-600">
        <Markdown
          style={{
            text: {
              color: white,
              fontSize: defaultConfig.tokens.fontSizes.md,
            },
          }}>
          {String(text)}
        </Markdown>
      </View>
    </View>
  );
};
const styles = ChatStyles;
export default MessageUser;
