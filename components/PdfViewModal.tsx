/* eslint-disable */
import { Icon, View, Spinner, Modal, ModalContent, Text, ModalHeader, ModalCloseButton, Heading, ModalFooter} from '@gluestack-ui/themed';
import { PureComponent, ReactNode, useCallback, useEffect, useState } from 'react';
import { Dimensions, PermissionsAndroid, Platform, Pressable, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { bpsKabUrl } from '../utils/url';
import Pdf from 'react-native-pdf';
import { ArrowLeft, Download, XCircleIcon } from 'lucide-react-native';
import { colorPrimary, white } from '../utils/color';
import ReactNativeBlobUtil from 'react-native-blob-util';

interface propsWebViewModal {
    showModal: boolean,
    url: string,
    title: string,
    onClose: Function,
    onError: Function,
    onLoaded: Function,
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

    public onLoadCompleted(e:any){
        this.setState({
            loaded: false
        })
        this.props.onLoaded(e)
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

function androidPdfDownloader(props:{
    url:string,
    filename:string,
}){
    return new Promise((result, reject) => {
        let path = `${ReactNativeBlobUtil.fs.dirs.DownloadDir}/${props.filename}`
        ReactNativeBlobUtil.fs.exists(`${path}.pdf`)
        .then(
            (e) => {
                if(e){
                    reject({
                        fileExist: e
                    })
                }else{
                    result(
                        ReactNativeBlobUtil.config({
                            path: path,
                            transformFile: true,
                            fileCache: true,
                            trusty: true,
                            appendExt: '.pdf',
                            followRedirect: true,
                            timeout: 5*60*1000,
                            addAndroidDownloads:{
                                useDownloadManager: true,
                                notification: true,
                                mime: 'application/pdf',
                                description: `Mengunduh ${props.filename}`,
                                title: `${props.filename}`,
                                // storeInDownloads: true,
                                path: path
                            },
                        }).fetch('get', props.url)
                    )
                }
            }
        ).catch(e => reject(e))
    })
}

var t: string | number | NodeJS.Timeout | undefined;
export default function PdfViewModal(props:propsWebViewModal={
    showModal: false,
    url: bpsKabUrl,
    title: '',
    onClose:()=>{return false},
    onError:(e:any)=>{
        console.log('error modal pdf',e) 
        return e
    },
    onLoaded:()=>{}
}){
    const [loaded, setLoaded] = useState(false)
    const [downloadModal, setDownloadModal] = useState(false);

    const downloadPdf = () => {
        let d = Date()
        setDownloadModal(true)
        if(Platform.OS == 'android') {
            // let downloadDir = `${ReactNativeBlobUtil.fs.dirs.DownloadDir}/${props.title}-${d}.pdf`
            androidPdfDownloader({
                url: props.url,
                filename: `${props.title}-${d}.pdf`
            })
            .catch(err => console.log(err))
        }
    }

    useEffect(()=>{
        if(t){
            clearTimeout(t)
        }
        t = setTimeout(function(){
            setDownloadModal(false)
        }, 2000)
    }, [downloadModal])

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
                    <Pressable onPress={()=> props.onClose()}>
                        <View width={25} height={25} marginRight={5}>
                            <Icon color={white} as={ArrowLeft} />
                        </View>
                    </Pressable>
                    <Heading color='white' size='sm' flex={1}>{props.title}</Heading>
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
                    trustAllCerts={false}
                    renderActivityIndicator={() => 
                        <View flexDirection='row'>
                            <Spinner size={'small'}/>
                            <Text marginLeft={8}>Loading ...</Text>
                        </View>
                    }                    
                />
                <Modal isOpen={downloadModal} rounded={'$xl'}>
                    <ModalContent rounded={'$xl'}>
                        <View backgroundColor='$backgroundDark300' padding={10} rounded={'$xl'}>
                            <Text color='$textLight950'>{'Mengunduh '}{props.title}</Text>
                        </View>
                    </ModalContent>
                </Modal>
                <ModalFooter backgroundColor={'none'}>
                    <Pressable  onPress={downloadPdf}>
                        <View alignItems='center' rounded={'$xl'} flexDirection='row' padding={5} backgroundColor={colorPrimary}>
                            <Text color={white} marginLeft={10}>{'Download'}</Text>
                            <Icon size='sm' color={white} as={Download}  marginHorizontal={10}/>
                        </View>
                    </Pressable>
                </ModalFooter>
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
    },
})