import {Modal, ModalContent} from '@gluestack-ui/themed';
import {Dimensions, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import {bpsKabUrl} from '../utils/url';
import {PureComponent, ReactNode} from 'react';

interface propsWebViewModal {
  showModal: boolean;
  url: string;
  onClose: Function;
}

export class WebViewModalPure extends PureComponent<propsWebViewModal> {
  constructor(props: propsWebViewModal) {
    props.showModal = false;
    props.url = bpsKabUrl;
    props.onClose = () => false;
    super(props);
  }
  onClose() {
    this.props.onClose();
  }
  public state = {
    width: Dimensions.get('screen').width,
  };
  render(): ReactNode {
    return (
      <Modal
        useRNModal={false}
        padding={0}
        margin={0}
        borderRadius={0}
        flex={1}
        size="full"
        height={'$full'}
        isOpen={this.props.showModal}
        onClose={this.onClose}>
        <ModalContent
          flex={1}
          width={this.state.width}
          borderRadius={0}
          padding={0}
          margin={0}>
          <WebView
            source={{
              uri: this.props.url,
            }}
            style={styles.webview}
          />
        </ModalContent>
      </Modal>
    );
  }
}

export default function WebViewModal(
  props: propsWebViewModal = {
    showModal: false,
    url: bpsKabUrl,
    onClose: () => {
      return false;
    },
  },
) {
  return (
    <Modal
      useRNModal={false}
      padding={0}
      margin={0}
      borderRadius={0}
      flex={1}
      size="full"
      height={'$full'}
      isOpen={props.showModal}
      onClose={() => props.onClose()}>
      <ModalContent
        flex={1}
        width={Dimensions.get('screen').width}
        borderRadius={0}
        padding={0}
        margin={0}>
        <WebView
          source={{
            uri: props.url,
          }}
          style={styles.webview}
        />
      </ModalContent>
    </Modal>
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    height: Dimensions.get('window').height,
    width: Dimensions.get('screen').width,
    padding: 0,
    margin: 0,
  },
});
