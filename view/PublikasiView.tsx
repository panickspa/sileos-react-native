/* eslint-disable eqeqeq */
import { Text } from '@/components/ui/text';
import { ScrollView } from '@/components/ui/scroll-view';
import { View } from '@/components/ui/view';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Search } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { NativeSyntheticEvent, RefreshControl, StyleSheet, TextInputSubmitEditingEventData } from 'react-native';
import { apiKey, default_domain, getPublication } from '../utils/api';
import { PublikasiCardPure } from '../components/PublikasiCard';
import { FlatList } from 'react-native';
import { colorPrimary } from '../utils/color';
import PdfViewModal from '../components/PdfViewModal';
import { PublikasiSkeleton } from '../components/SkeletonCard';
import AlerModal from '../components/AlertModal';


export interface PublikasiResponse {
    status: Number|number|String|string,
    'data-availability': Number|number|String|string,
    data?: any
}

export type PublikasiRequest = Array<Array<Publikasi>> | Array<Publikasi>

export interface PublikasiRequestPages {
    page: Number|number|String|string,
    pages: Number|number|String|string,
    per_page: Number|number|String|string,
    count: Number|number|String|string,
    total: Number|number|String|string,
    pub_id?: string|String,
    title?: string|String,
    abstract?: string|String,
    issn?: string|String,
    sch_date?: string|String|null,
    rl_date?: string|String|null,
    updt_date?: null|string|String,
    cover?: string|String,
    pdf?: string|String,
    size?: string|String,
}

export interface Publikasi {
    pub_id?: string|String,
    title?: string|String,
    abstract?: string|String,
    issn?: string|String,
    sch_date?: string|String|null,
    rl_date?: string|String|null,
    updt_date?: null|string|String,
    cover?: string|String|undefined,
    pdf?: string|String,
    size?: string|String,
    page?: Number|number|String|string,
    pages?: Number|number|String|string,
    per_page?: Number|number|String|string,
    count?: Number|number|String|string,
    total?: Number|number|String|string,
    thumbnail?: string|String,
    openPdf: Function
}

export default function PublikasiView(){
    const [pdfUri, setPdfUri] = useState('');
    const [keyword, setKeyword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [msgAlert, setMsgAlert] = useState('');
    const [msgHeaderAlert, setMsgHeaderAlert] = useState('');
    const [titlePdf, setTitlePdf]  = useState('');

    function changeKeyword(e:NativeSyntheticEvent<TextInputSubmitEditingEventData>){
        setKeyword(e.nativeEvent.text);
        // console.log('native event', e.nativeEvent.text)
    }

    useEffect(()=>{
        // console.log('pdfUri', pdfUri)
       if(pdfUri) {if(pdfUri != '') {
            setShowModal(true);
        }}
    },[pdfUri]);

    function onError(){
        if(pdfUri !== ''){
            setMsgHeaderAlert('Publikasi Tidak terbuka');
            setMsgAlert('Silahkan periksa kembali jaringan anda atau usap kebawah kembali untuk menyegarkan');
            setShowAlert(true);
            setShowModal(false);
        }
    }

    function closeAlert(){
        setShowAlert(false);
    }

    function closePdfModal(){
        setShowModal(false);
    }

    function openPdf (e:any){setShowModal(true); setPdfUri(String(e.uri)); setTitlePdf(e.title);}

    return (
        <View style={styles.content}>
            <Input className="m-2 bg-white rounded-5">
                <InputSlot className="px-3 rounded-5">
                    <InputIcon as={Search} className={` color-${colorPrimary} `}/>
                </InputSlot>
                <InputField placeholder="Ketik judul publikasi ..." onSubmitEditing={changeKeyword} />
            </Input>
            <AlerModal showModal={showAlert} onClose={closeAlert} msg={msgAlert} headerMsg={msgHeaderAlert}/>
            <PublikasiList openPdf={openPdf} keyword={keyword}/>
            <PdfViewModal onLoaded={()=>{}} title={titlePdf} onError={onError} showModal={showModal} onClose={closePdfModal} url={pdfUri} />
        </View>
    );
}

export interface PublikasiList{
    keyword: string,
    openPdf: Function,
}

const initPublikasi:any = [];

function PublikasiList(props:PublikasiList){

    const [publikasiList, setPublikasiList] = useState(initPublikasi);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(0);
    const [pageAll, setPageAll] = useState(0);

    useEffect(()=>{
        setRefreshing(true);
        setPublikasiList([]);
        getPublication({
            domain: default_domain,
            lang: 'ind',
            page: 0,
            apiKey: apiKey,
            keyword: props.keyword,
        }).then(
            (e:PublikasiResponse) => {
                if(e.data)
                    {if(e.data.length)
                        {if(e.data.length > 1){
                            setPublikasiList(e.data[1]);
                            if(e.data[0])
                                {if(e.data[0].page){
                                    setPage(e.data[0].page);
                                }}
                                if(e.data[0].pages){
                                    setPageAll(e.data[0].pages);
                                }
                        }}}
                setRefreshing(false);
            }
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(()=>{
        setRefreshing(true);
        setPublikasiList([]);
        getPublication({
            domain: default_domain,
            lang: 'ind',
            page: 0,
            apiKey: apiKey,
            keyword: props.keyword,
        }).then(
            (e:PublikasiResponse) => {
                if(e.data)
                {if(e.data.length)
                {if(e.data.length > 0){
                    setPublikasiList(e.data[1]);
                    if(e.data[0].page) {setPage(e.data[0].page);}
                    if(e.data[0].pages) {setPageAll(e.data[0].pages);}
                }}}
            }
        ).finally(()=>setRefreshing(false));
    }, [props.keyword]);

    const refreshPublikasi = () => {
        setRefreshing(true);
        setPublikasiList([]);
        getPublication({
            domain: default_domain,
            lang: 'ind',
            page: 0,
            apiKey: apiKey,
            keyword: props.keyword,
        }).then(
            (e:PublikasiResponse) => {
                // console.log(e)
                if(e.data)
                {if(e.data.length)
                    {if(e.data.length > 0)
                        {if(e.data[1]){
                            setPublikasiList(e.data[1]);
                            if(e.data[0])
                                {if(e.data[0].page)
                                    {setPage(e.data[0].page);}}
                            setPageAll(e.data[0].pages);
                        }}}}
                setRefreshing(false);
            }
        );
    };

    const nextPage = ()=>{
        // console.log('next page')
        setRefreshing(true);
        let p = page;
        p = p + 1;
        // console.log('nexpage', p, p>pageAll)
        if(p <= pageAll){
            getPublication({
                domain: default_domain,
                lang: 'ind',
                page: p,
                apiKey: apiKey,
                keyword: props.keyword,
            }).then(
                (e:PublikasiResponse) => {
                    if(e.data)
                    {if(e.data.length)
                        {if(e.data.length > 0)
                            {if(e.data[1])
                                {
                                    setPublikasiList([...publikasiList, ...e.data[1]]);
                                    setPage(p);
                                }}}}
                }
            )
            .catch(err => console.log(err))
            .finally(() => {
                setRefreshing(false);
            });
        }else{
            setRefreshing(false);
        }
    };

    function openPdf(e:{uri:string | String, title:string | String}){
        props.openPdf(e);
    }

    if(publikasiList)
        {if(publikasiList.length)
            {return (
                <>
                    {!refreshing && publikasiList.length < 1 ? <ScrollView refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={() => refreshPublikasi()} />
                    }
                    className="flex-1">
                        <View style={{
                            padding: 10,
                        }}>
                            <Text>Kesalahan Jaringan Silahkan Coba Usap Kebawah Kembali</Text>
                        </View>
                    </ScrollView> : <></> }
                    <FlatList
                        data={publikasiList}
                        numColumns={2}
                        renderItem={({item}) => {
                            return <PublikasiCardPure openPdf={(e:any) => openPdf({uri:e, title:item.title})} title={item.title} cover={item.cover} pdf={item.pdf} />;
                        }}
                        keyExtractor={({pub_id},i) => {return `publikasi-card-${pub_id}-${i}`;}}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={() => refreshPublikasi()} />
                        }
                        onEndReached={() => nextPage()}

                    />
                    {refreshing && publikasiList.length < 1 ? <PublikasiSkeleton /> : <></>}
                </>
            );}
        else {return (
            <>
                {!refreshing && publikasiList.length < 1 ? <ScrollView refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => refreshPublikasi()} />
                }
                    className="flex-1">
                        <View style={{
                            padding: 10,
                        }}>
                            <Text>Kesalahan Jaringan Silahkan Coba Usap Kebawah Kembali</Text>
                        </View>
                    </ScrollView> : <></> }
                    {refreshing ? <PublikasiSkeleton /> : <></>}
            </>
        );}}
    else {return (
        <>
            {!refreshing && publikasiList.length < 1 ? <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={() => refreshPublikasi()} />
            }
                    className="flex-1">
                        <View style={{
                            padding: 10,
                        }}>
                            <Text>Kesalahan Jaringan Silahkan Coba Usap Kebawah Kembali</Text>
                        </View>
                    </ScrollView> : <></> }
                    {refreshing ? <PublikasiSkeleton /> : <></>}
        </>
    );}
}

const styles = StyleSheet.create({
    content:{
        flex: 1,
        justifyContent: 'flex-start',
        alignContent: 'center',
    },
});
