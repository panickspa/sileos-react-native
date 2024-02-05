/* eslint-disable */
import { Icon, View, Spinner, Modal, ModalContent, Text, ModalHeader, ModalCloseButton, Heading} from '@gluestack-ui/themed';
import { PureComponent, ReactNode, useCallback, useState } from 'react';
import { Dimensions, Platform, Pressable, StyleSheet } from 'react-native';
import { bpsKabUrl } from '../utils/url';
import Pdf from 'react-native-pdf';
import { Download, XCircleIcon } from 'lucide-react-native';
import { colorPrimary, white } from '../utils/color';
import ReactNativeBlobUtil from 'react-native-blob-util';

interface propsWebViewModal {
    showModal: boolean,
    url: string,
    title: string,
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
    title: '',
    onClose:()=>{return false},
    onError:(e:any)=>{console.log('error modal pdf',e) 
    return e}
}){
    const [showModal, setShowModal] = useState(props.showModal)
    const [loaded, setLoaded] = useState(false)

    const downloadPdf = useCallback(()=>{
        if(Platform.OS == 'android') {
            let downloadDir = ReactNativeBlobUtil.fs.dirs.DownloadDir
            console.log('download dir',downloadDir)
            if(downloadDir) ReactNativeBlobUtil.config({
                path: downloadDir,
                addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: false,
                    mime: 'x-pdf',
                    description: `File PDF dari ${props.title} telah terdownload`
                }
            })
            .fetch('GET',props.url)
            .then(res => {
                res.path()
            })
        }
    },[])

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
                <ModalHeader margin={0} padding={0} backgroundColor={colorPrimary}>
                    <Heading color='white' size='sm' flex={1}>{props.title}</Heading>
                    <Pressable onPress={downloadPdf}>
                        <View rounded={'$lg'} padding={5} backgroundColor={white}>
                            <Icon color={colorPrimary} as={Download} />
                        </View>
                    </Pressable>
                </ModalHeader>
                <Pdf source={{
                        uri: props.url,
                        cache: false
                    }}
                    style={
                        styles.webview
                    }
                    onLoadComplete={() => setLoaded(true)}
                    onError={(e)=>props.onError(e)}
                    onLoadProgress={(e)=>console.log(e)}
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