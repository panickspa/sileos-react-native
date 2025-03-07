/* eslint-disable eqeqeq */
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Modal, ModalContent, ModalHeader, ModalFooter, ModalCloseButton } from '@/components/ui/modal';
import { Spinner } from '@/components/ui/spinner';
import { View } from '@/components/ui/view';
import { Icon } from '@/components/ui/icon';
import { PureComponent, ReactNode, useEffect, useState } from 'react';
import { Dimensions, Platform, Pressable, StyleSheet } from 'react-native';
import { bpsKabUrl } from '../utils/url';
import Pdf from 'react-native-pdf';
import { ArrowLeft, Download } from 'lucide-react-native';
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
        props.url = bpsKabUrl;
        props.showModal = false;
        props.onClose = () => false;
        super(props);

    }
    public state = {
        showModal: false,
        loaded: false,
    };

    public onLoadCompleted(e:any){
        this.setState({
            loaded: false,
        });
        this.props.onLoaded(e);
    }

    public onError(e:any){
        console.log(e);
        this.props.onError(e);
    }

    onClose(){
        this.props.onClose();
    }

    render(): ReactNode {
        return (
            <Modal
                useRNModal={false}
                size="full"
                isOpen={this.props.showModal}
                onClose={this.onClose}
                className="p-[0px] m-[0px] rounded-[0px] flex-1 h-full">
                <ModalContent
                    className={` width-${Dimensions.get('screen').width} flex-1 rounded-[0px] p-[0px] m-[0px] `}>
                    {/* <ModalHeader margin={0} padding={0}>
                        <ModalCloseButton>
                            <Icon as={CloseIcon} />
                        </ModalCloseButton>
                    </ModalHeader> */}
                    <Pdf source={{
                            uri: this.props.url,
                            cache: true,
                        }}
                        style={
                            styles.webview
                        }
                        onLoadComplete={this.onLoadCompleted}
                        onError={this.onError}
                        trustAllCerts={false}
                        renderActivityIndicator={() =>
                            <View className="flex-row">
                                <Spinner size={'small'}/>
                                <Text className="mr-4 color-secondary-0">Loading ...</Text>
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
        let path = `${ReactNativeBlobUtil.fs.dirs.DownloadDir}/${props.filename}`;
        ReactNativeBlobUtil.fs.exists(`${path}.pdf`)
        .then(
            (e) => {
                if(e){
                    reject({
                        fileExist: e,
                    });
                }else{
                    result(
                        ReactNativeBlobUtil.config({
                            path: path,
                            transformFile: true,
                            fileCache: true,
                            trusty: true,
                            appendExt: '.pdf',
                            followRedirect: true,
                            timeout: 5 * 60 * 1000,
                            addAndroidDownloads:{
                                useDownloadManager: true,
                                notification: true,
                                mime: 'application/pdf',
                                description: `Mengunduh ${props.filename}`,
                                title: `${props.filename}`,
                                // storeInDownloads: true,
                                path: path,
                            },
                        }).fetch('get', props.url)
                    );
                }
            }
        ).catch(e => reject(e));
    });
}

var t: string | number | NodeJS.Timeout | undefined;
export default function PdfViewModal(props:propsWebViewModal = {
    showModal: false,
    url: bpsKabUrl,
    title: '',
    onClose:()=>{return false;},
    onError:(e:any)=>{
        console.log('error modal pdf',e);
        return e;
    },
    onLoaded:()=>{},
}){
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loaded, setLoaded] = useState(false);
    const [downloadModal, setDownloadModal] = useState(false);

    const downloadPdf = () => {
        let d = Date();
        setDownloadModal(true);
        if(Platform.OS == 'android') {
            // let downloadDir = `${ReactNativeBlobUtil.fs.dirs.DownloadDir}/${props.title}-${d}.pdf`
            androidPdfDownloader({
                url: props.url,
                filename: `${props.title}-${d}.pdf`,
            })
            .catch(err => console.log(err));
        }
    };

    useEffect(()=>{
        if(t){
            clearTimeout(t);
        }
        t = setTimeout(function(){
            setDownloadModal(false);
        }, 2000);
    }, [downloadModal]);

    return (
        <Modal
            useRNModal={false}
            size="full"
            isOpen={props.showModal}
            onClose={() => props.onClose()}
            className="rounded-[0px] flex-1 h-full">
            <ModalContent
                className={` width-${Dimensions.get('screen').width} flex-1 rounded-[0px] px-[0px] mx-[0px] `}>
                <ModalHeader className={' bg-primary-0 mb-3 mt-8 ml-2 mr-2'}>
                    <ModalCloseButton>
                        <Pressable onPress={()=> props.onClose()}>
                            <View className="w-[25px] h-[25px] mr-2 ml-2">
                                <Icon as={ArrowLeft} className={' color-secondary-0 '} />
                            </View>
                        </Pressable>
                    </ModalCloseButton>
                    <Heading size="sm" className="text-white flex-1">{props.title}</Heading>
                </ModalHeader>
                <Pdf source={{
                        uri: props.url,
                        cache: false,
                    }}
                    style={
                        styles.webview
                    }
                    onLoadComplete={() => setLoaded(true)}
                    onError={(e)=>props.onError(e)}
                    trustAllCerts={false}
                    renderActivityIndicator={() =>
                        <View className="flex-row">
                            <Spinner size={'small'}/>
                            <Text className="ml-2 color-secondary-0">Loading ...</Text>
                        </View>
                    }
                />
                <Modal isOpen={downloadModal} className="rounded-xl">
                    <ModalContent className="rounded-xl">
                        <View className="bg-primary-0/80 p-2 rounded-xl">
                            <Text className="color-secondary-0">{'Mengunduh '}{props.title}</Text>
                        </View>
                    </ModalContent>
                </Modal>
                <ModalFooter className="bg-none pt-4 pr-6">
                    <Pressable  onPress={downloadPdf}>
                        <View
                            className={' bg-secondary-0 items-center rounded-xl flex-row p-2'}>
                            <Text className={' color-primary-0 ml-4 mr-4'}>{'Download'}</Text>
                            <Icon size="sm" as={Download} className={' color-primary-0 '} />
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
        width: Dimensions.get('screen').width,
        padding: 0,
        margin: 0,
    },
});
