/* eslint-disable */
import { Input, InputField, InputIcon, InputSlot, View, ScrollView, SafeAreaView } from "@gluestack-ui/themed";
import { Text } from "@gluestack-ui/themed";
import { Search } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, NativeSyntheticEvent, RefreshControl, StyleSheet, TextInputSubmitEditingEventData, TextInputTextInputEventData } from "react-native";
import { apiKey, default_domain, getPressReleaseList, getPublication } from "../utils/api";
import { PublikasiCardPure } from "../components/PressReleaseCard";
import { FlatList } from "react-native";
import { colorPrimary } from "../utils/color";
import PdfViewModal, { PdfViewModalPure } from "../components/PdfViewModal";
import { PublikasiList, PublikasiResponse } from "./PublikasiView";
import { PressReleaseSkeleton } from "../components/SkeletonCard";
import AlerModal from "../components/AlertModal";

export default function PressReleaseView(){
    const [pdfUri, setPdfUri] = useState('')
    const [keyword, setKeyword] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [msgAlert, setMsgAlert] = useState('')
    const [msgHeaderAlert, setMsgHeaderAlert] = useState('')
    const [titlePdf, setTitlePdf]  = useState('')


    function changeKeyword(e:NativeSyntheticEvent<TextInputSubmitEditingEventData>){
        setKeyword(e.nativeEvent.text)
        // console.log('native event', e.nativeEvent.text)
    }

    useEffect(()=>{
        // console.log('pdfUri', pdfUri)
       if(pdfUri) if(pdfUri != '') {
            setShowModal(true)
        }
    },[pdfUri])

    const errorPdf = (e:any)=>{
        if(pdfUri !== ''){
            console.log('error PressRelease', e)
            setMsgHeaderAlert('Berita Tidak terbuka')
            setMsgAlert('Silahkan periksa kembali jaringan anda atau usap kebawah kembali untuk menyegarkan')
            setShowAlert(true)
            setShowModal(false)
        }
    }

    function closeAlert(){
        setShowAlert(false)
    }

    function closePdfModal(){
        setShowModal(false)
    }

    function openPdf(e:any){setShowModal(true);setPdfUri(String(e.uri));setTitlePdf(e.title)}

    return (
        <View style={styles.content}>
            <Input margin={'$2'} backgroundColor="white">
                <InputSlot paddingHorizontal={'$3'}>
                    <InputIcon as={Search} color={colorPrimary}/>
                </InputSlot>
                <InputField placeholder="Ketik judul berita resmi statistik ..." onSubmitEditing={changeKeyword} />
            </Input>
            <AlerModal showModal={showAlert} onClose={closeAlert} msg={msgAlert} headerMsg={msgHeaderAlert}/>
            <PressReleaseLists openPdf={openPdf} keyword={keyword}/>
            <PdfViewModal title={titlePdf} onError={errorPdf} showModal={showModal} onClose={closePdfModal} url={pdfUri} />
        </View>
    )
}

const initPressRelease:any = []

function PressReleaseLists(props:PublikasiList){
    const [pressReleaseList, setPressReleaseList] = useState(initPressRelease)
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(0)
    const [pageAll, setPageAll] = useState(0)

    useEffect(()=>{
        setRefreshing(true)
        setPressReleaseList([])
        // console.log(props.keyword)
        getPressReleaseList({
            domain: default_domain,
            lang: 'ind',
            page: 0,
            apiKey: apiKey,
            keyword: props.keyword
        }).then(
            (e:PublikasiResponse) => {
                // console.log(e)
                if(e.data)
                    if(e.data.length)
                        if(e.data.length > 1){
                            setPressReleaseList(e.data[1])
                            if(e.data[0])
                                if(e.data[0].page){
                                    setPage(e.data[0].page)
                                }
                                if(e.data[0].pages){
                                    setPageAll(e.data[0].pages)
                                }
                        }
                setRefreshing(false)
            }
        ).catch(err => {
            console.log(err)
        })
        .finally(() => {
            setRefreshing(false)
        })
    }, [])

    useEffect(()=>{
        setRefreshing(true)
        setPressReleaseList([])
        getPressReleaseList({
            domain: default_domain,
            lang: 'ind',
            page: 0,
            apiKey: apiKey,
            keyword: props.keyword
        }).then(
            (e:PublikasiResponse) => {
                // console.log(e)
                if(e.data)
                if(e.data.length)
                if(e.data.length > 0){
                    setPressReleaseList(e.data[1])
                    if(e.data[0].page) setPage(e.data[0].page)
                    if(e.data[0].pages) setPageAll(e.data[0].pages)
                }
            }
        ).catch(err =>{
            console.log(err)
        })
        .finally(()=>setRefreshing(false))
    }, [props.keyword])

    const refreshPublikasi = () => {
        setRefreshing(true);
        setPage(1)
        setPressReleaseList([])
        getPublication({
            domain: default_domain,
            lang: 'ind',
            page: 0,
            apiKey: apiKey,
            keyword: props.keyword
        }).then(
            (e:PublikasiResponse) => {
                if(e.data?.length)
                    if(e.data.length > 1)
                        if(e.data[1]){
                            setPressReleaseList(e.data[1])
                            if(e.data[0])
                                if(e.data[0].page)
                                    setPage(e.data[0].page)
                            setPageAll(e.data[0].pages)
                        }
                // setRefreshing(false)
            }
        )
        .catch(err => {
            console.log(err)
            setRefreshing(false)
        })
        .finally(()=>setRefreshing(false))
    }

    const nextPage = ()=>{
        // console.log('next page')
        setRefreshing(true)
        let p = page
        p = p+1
        if(p <= pageAll){
            getPressReleaseList({
                domain: default_domain,
                lang: 'ind',
                page: p,
                apiKey: apiKey,
                keyword: props.keyword
            }).then(
                (e:PublikasiResponse) => {
                    if(e.data)
                    if(e.data.length)
                        if(e.data.length > 1)
                            if(e.data[1])
                                {
                                    setPressReleaseList([...pressReleaseList, ...e.data[1]])
                                    setPage(p)
                                }
                }
            )
            .catch(err => console.log(err))
            .finally(() => {
                setRefreshing(false)
            })
        } else{
            setRefreshing(false)
        }
    }

    function openPdf(e:{uri:string | String, title:string | String}){
        props.openPdf(e)
    }

    if(pressReleaseList)
        if(pressReleaseList.length) 
            return (
                <>
                    <FlatList 
                        data={pressReleaseList}
                        numColumns={1}
                        renderItem={({item}) => {
                            return <PublikasiCardPure openPdf={(e:string) => openPdf({uri:e, title:item.title})} title={item.title} cover={item.thumbnail} pdf={item.pdf} />
                        }}
                        keyExtractor={({pub_id},i) => {return `pressrelease-card-${pub_id}-${i}`}}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={() => refreshPublikasi()} />
                        }
                        onEndReached={() => nextPage()}

                    />
                    {refreshing && pressReleaseList.length < 1 ? <PressReleaseSkeleton /> : <></>}
                </>
            )
        else return <>
        {!refreshing && pressReleaseList.length < 1 ? <ScrollView flex={1}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => refreshPublikasi()} />
                }>
                    <Text>Kesalahan Jaringan Silahkan Coba Usap Kebawah Kembali</Text> 
                </ScrollView>: <></> }
            {refreshing ? <PressReleaseSkeleton /> : <></>}
        </>
    else return  <>
    {!refreshing && pressReleaseList.length < 1 ? <ScrollView flex={1}
                height={Dimensions.get('screen').height}
                width={Dimensions.get('screen').width}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => refreshPublikasi()} />
                }>
                    <Text>Kesalahan Jaringan Silahkan Coba Usap Kebawah Kembali</Text> 
                </ScrollView>: <></> }
        {refreshing ? <PressReleaseSkeleton /> : <></>}
    </>
}
const styles = StyleSheet.create({
    content:{
        flex: 1,
        justifyContent: 'flex-start',
        alignContent: 'center'
    }
})