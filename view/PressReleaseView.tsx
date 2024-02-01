/* eslint-disable */
import { Input, InputField, InputIcon, InputSlot, View, ScrollView, SafeAreaView } from "@gluestack-ui/themed";
import { Text } from "@gluestack-ui/themed";
import { Search } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { NativeSyntheticEvent, RefreshControl, StyleSheet, TextInputSubmitEditingEventData, TextInputTextInputEventData } from "react-native";
import { apiKey, default_domain, getPressReleaseList, getPublication } from "../utils/api";
import { PublikasiCardPure } from "../components/PressReleaseCard";
import { FlatList } from "react-native";
import { colorPrimary } from "../utils/color";
import PdfViewModal, { PdfViewModalPure } from "../components/PdfViewModal";
import { PublikasiList, PublikasiResponse } from "./PublikasiView";

export default function PressReleaseView(){
    const [pdfUri, setPdfUri] = useState('')
    const [keyword, setKeyword] = useState('')
    const [showModal, setShowModal] = useState(false)

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

    return (
        <View style={styles.content}>
            <Input margin={'$2'} backgroundColor="white">
                <InputSlot paddingLeft={'$3'}>
                    <InputIcon as={Search} color={colorPrimary}/>
                </InputSlot>
                <InputField placeholder="Ketik judul berita resmi statistik ..." onSubmitEditing={changeKeyword} />
            </Input>
            <PressReleaseLists openPdf={(e:string)=>setPdfUri(String(e))} keyword={keyword}/>
            <PdfViewModal showModal={showModal} onClose={() =>  setShowModal(false)} url={pdfUri} />
        </View>
    )
}

const initPressRelease:any = []

function PressReleaseLists(props:PublikasiList){
    const [publikasiList, setPublikasiList] = useState(initPressRelease)
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(0)
    const [pageAll, setPageAll] = useState(0)

    useEffect(()=>{
        setRefreshing(true)
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
                            setPublikasiList(e.data[1])
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
        )
    }, [])

    useEffect(()=>{
        setRefreshing(true)
        setPublikasiList([])
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
                if(e.data.length > 2){
                    setPublikasiList(e.data[1])
                    if(e.data[0].page) setPage(e.data[0].page)
                    if(e.data[0].pages) setPageAll(e.data[0].pages)
                }
            }
        )
        .finally(()=>setRefreshing(false))
    }, [props.keyword])

    const refreshPublikasi = () => {
        setRefreshing(true);
        setPublikasiList([])
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
                            setPublikasiList(e.data[1])
                            if(e.data[0])
                                if(e.data[0].page)
                                    setPage(e.data[0].page)
                            setPageAll(e.data[0].pages)
                        }
                // setRefreshing(false)
            }
        ).finally(()=>setRefreshing(false))
    }

    const nextPage = ()=>{
        // console.log('next page')
        let p = page
        if(p != pageAll){
            p = p+1
            setPage(p)
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
                                setPublikasiList([...publikasiList, ...e.data[1]])
                }
            ).finally(() => {
                setRefreshing(false)
            })
        }
    }

    function openPdf(e:string | String){
        props.openPdf(e)
    }

    if(publikasiList)
        if(publikasiList.length) 
            return (
                <FlatList 
                    data={publikasiList}
                    numColumns={1}
                    renderItem={({item}) => {
                        return <PublikasiCardPure openPdf={(e:string) => openPdf(e)} title={item.title} cover={item.thumbnail} pdf={item.pdf} />
                    }}
                    keyExtractor={({pub_id},i) => {return `pressrelease-card-${pub_id}-${i}`}}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={() => refreshPublikasi()} />
                    }
                    onEndReached={() => nextPage()}

                />
            )
        else return <></>
    else return  <></>

    return (
        <View></View>
    )
}
const styles = StyleSheet.create({
    content:{
        flex: 1,
        justifyContent: 'flex-start',
        alignContent: 'center'
    }
})