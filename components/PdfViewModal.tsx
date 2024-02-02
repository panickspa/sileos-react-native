/* eslint-disable */
import { Icon, View, Spinner, Modal, ModalContent, Text} from '@gluestack-ui/themed';
import { PureComponent, ReactNode, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { bpsKabUrl } from '../utils/url';
import Pdf from 'react-native-pdf';

interface propsWebViewModal {
    showModal: boolean,
    url: string,
    onClose: Function,
    onError: Function,
}

export class PdfViewModalPure extends PureComponent<propsWebViewModal>{
    constructor(props:propsWebViewModal){
        props.url = bpsKabUrl
        props.showModal = false
        props.onClose = () => false
        super(props);

    }
    public state = {
        showModal: false,
        loaded: false,
    }

    public onLoadCompleted(){
        this.setState({
            loaded: false
        })
    }

    public onError(e:any){
        console.log(e)
        this.props.onError(e)
    }

    onClose(){
        this.props.onClose()
    }

    render(): ReactNode {
        return (
            <Modal useRNModal={false} padding={0} margin={0} borderRadius={0} flex={1} size='full' height={'$full'} isOpen={this.props.showModal} onClose={this.onClose}>
                <ModalContent flex={1} width={Dimensions.get('screen').width} borderRadius={0} padding={0} margin={0}>
                    {/* <ModalHeader margin={0} padding={0}>
                        <ModalCloseButton>
                            <Icon as={CloseIcon} />
                        </ModalCloseButton>
                    </ModalHeader> */}
                    <Pdf source={{
                            uri: this.props.url,
                            cache: true
                        }}
                        style={
                            styles.webview
                        }
                        onLoadComplete={this.onLoadCompleted}
                        onError={this.onError}
                        trustAllCerts={false}
                        renderActivityIndicator={() => 
                            <View flexDirection='row'>
                                <Spinner size={'small'}/>
                                <Text marginRight={8}>Loading ...</Text>
                            </View>
                        }                    
                    />
                </ModalContent>
            </Modal>
        );
    }
}

export default function PdfViewModal(props:propsWebViewModal={
    showModal: false,
    url: bpsKabUrl,
    onClose:()=>{return false},
    onError:(e:any)=>{return e}
}){
    const [showModal, setShowModal] = useState(props.showModal)
    const [loaded, setLoaded] = useState(false)


    return (
        <Modal 
            useRNModal={false} 
            padding={0} 
            margin={0} 
            borderRadius={0} 
            flex={1} 
            size='full' 
            height={'$full'} 
            isOpen={props.showModal} 
            onClose={() => props.onClose()}
            >
            <ModalContent flex={1} width={Dimensions.get('screen').width} borderRadius={0} padding={0} margin={0}>
                {/* <ModalHeader margin={0} padding={0}>
                    <ModalCloseButton>
                        <Icon as={CloseIcon} />
                    </ModalCloseButton>
                </ModalHeader> */}
                <Pdf source={{
                        uri: props.url,
                        cache: true
                    }}
                    style={
                        styles.webview
                    }
                    onLoadComplete={() => setLoaded(true)}
                    onError={(e)=>console.log(e)}
                    trustAllCerts={false}
                    renderActivityIndicator={() => 
                        <View flexDirection='row'>
                            <Spinner size={'small'}/>
                            <Text marginRight={8}>Loading ...</Text>
                        </View>
                    }                    
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