
import { CloseIcon, Icon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, Text, View } from '@gluestack-ui/themed';
import { useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview'
import { bpsKabUrl } from '../utils/url';

interface propsWebViewModal {
    showModal: boolean,
    url: string,
    onClose: Function
}

export default function WebViewModal(props:propsWebViewModal={
    showModal: false,
    url: bpsKabUrl,
    onClose:()=>{return false}
}){
    const [showModal, setShowModal] = useState(props.showModal)
    const [loaded, setLoaded] = useState(false)


    return (
        <Modal useRNModal={false} padding={0} margin={0} borderRadius={0} flex={1} size='full' height={'$full'} isOpen={props.showModal} onClose={() => props.onClose()}>
            <ModalContent flex={1} width={Dimensions.get('screen').width} borderRadius={0} padding={0} margin={0}>
                {/* <ModalHeader margin={0} padding={0}>
                    <ModalCloseButton>
                        <Icon as={CloseIcon} />
                    </ModalCloseButton>
                </ModalHeader> */}
                <WebView source={{
                        uri: props.url
                    }}
                    style={
                        styles.webview
                    }
                    onLoadEnd={() => setLoaded(true)}
                />
            </ModalContent>
        </Modal>
    );
}

const styles = StyleSheet.create({
    webview: {
        flex: 1,
        height: Dimensions.get('window').height,
        width: Dimensions.get("screen").width,
        padding: 0,
        margin: 0
    }
})