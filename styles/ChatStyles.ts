import {StyleSheet} from 'react-native';

const ChatStyles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignContent: 'center',
  },
  messageBoxChatAI: {
    padding: 10,
    borderRadius: 25,
    color: 'white',
    marginLeft: 5,
    marginTop: 5,
    marginRight: 50,
    height: 'auto',
  },
  messageBoxChatUser: {
    padding: 10,
    borderRadius: 25,
    marginRight: 5,
    marginTop: 5,
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
  tableWebviews: {
    backgroundColor: '#004282',
  },
});
export default ChatStyles;
