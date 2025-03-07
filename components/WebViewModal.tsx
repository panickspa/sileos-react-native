import { Modal, ModalContent } from '@/components/ui/modal';
import {Dimensions, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import {bpsKabUrl} from '../utils/url';
import {PureComponent, ReactNode, useEffect, useState} from 'react';
import {colorPrimary} from '../utils/color';

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
        size="full"
        isOpen={this.props.showModal}
        onClose={this.onClose}
        className="p-[0px] m-[0px] rounded-[0px] flex-1 h-full">
        <ModalContent
          className={` bg-primary-0 width-${this.state.width} flex-1 rounded-[0px] p-[0px] m-[0px] `}>
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
  const [showWeb, setShowWeb] = useState(false);
  useEffect(() => {
    if (props.showModal) {
      setTimeout(() => setShowWeb(true), 2000);
    }
  }, [props.showModal, props.url]);
  return (
    <Modal
      useRNModal={false}
      size="full"
      isOpen={props.showModal}
      onClose={() => {
        setShowWeb(false);
        props.onClose();
      }}
      style={styles.modalSize}
      className="p-[0px] m-[0px] rounded-[0px] flex-1 h-full">
      <ModalContent
        style={styles.modalSize}
        className={` bg-primary-0 width-${Dimensions.get('screen').width} flex-1 rounded-[0px] p-[0px] m-[0px] `}>
        {showWeb ? (
          <WebView
            source={{
              uri: props.url,
            }}
            style={styles.webview}
          />
        ) : (
          <></>
        )}
      </ModalContent>
    </Modal>
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    padding: 0,
    margin: 0,
  },
  modalSize: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: colorPrimary,
  },
});
