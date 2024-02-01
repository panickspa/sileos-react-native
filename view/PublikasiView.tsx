/* eslint-disable */
import { Input, InputField, InputIcon, InputSlot, View, ScrollView, SafeAreaView } from "@gluestack-ui/themed";
import { Text } from "@gluestack-ui/themed";
import { Search } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { NativeSyntheticEvent, RefreshControl, StyleSheet, TextInputSubmitEditingEventData, TextInputTextInputEventData } from "react-native";
import { apiKey, default_domain, getPublication } from "../utils/api";
import PublikasiCard, { PublikasiCardPure } from "../components/PublikasiCard";
import { FlatList } from "react-native";
import { colorPrimary } from "../utils/color";
import PdfViewModal, { PdfViewModalPure } from "../components/PdfViewModal";


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
                <InputField placeholder="Ketik judul publikasi ..." onSubmitEditing={changeKeyword} />
            </Input>
            <PublikasiList openPdf={(e:string)=>setPdfUri(String(e))} keyword={keyword}/>
            <PdfViewModal showModal={showModal} onClose={() =>  setShowModal(false)} url={pdfUri} />
        </View>
    )
}

export interface PublikasiList{
    keyword: string,
    openPdf: Function,
}

const initPublikasi:any = []

function PublikasiList(props:PublikasiList){

    const [publikasiList, setPublikasiList] = useState(initPublikasi)
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(0)
    const [pageAll, setPageAll] = useState(0)

    useEffect(()=>{
        setRefreshing(true)
        getPublication({
            domain: default_domain,
            lang: 'ind',
            page: 0,
            apiKey: apiKey,
            keyword: props.keyword
        }).then(
            (e:PublikasiResponse) => {
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
        getPublication({
            domain: default_domain,
            lang: 'ind',
            page: 0,
            apiKey: apiKey,
            keyword: props.keyword
        }).then(
            (e:PublikasiResponse) => {
                if(e.data)
                if(e.data.length)
                if(e.data.length > 2){
                    setPublikasiList(e.data[1])
                    if(e.data[0].page) setPage(e.data[0].page)
                    if(e.data[0].pages) setPageAll(e.data[0].pages)
                }
            }
        ).finally(()=>setRefreshing(false))
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
                setRefreshing(false)
            }
        )
    }

    const nextPage = ()=>{
        // console.log('next page')
        let p = page
        if(p != pageAll){
            p = p+1
            setPage(p)
            getPublication({
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
                    numColumns={2}
                    renderItem={({item}) => {
                        return <PublikasiCardPure openPdf={(e:string) => openPdf(e)} title={item.title} cover={item.cover} pdf={item.pdf} />
                    }}
                    keyExtractor={({pub_id},i) => {return `publikasi-card-${pub_id}-${i}`}}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={() => refreshPublikasi()} />
                    }
                    onEndReached={() => nextPage()}

                />
            )
        else return <></>
    else return  <></>
}

const styles = StyleSheet.create({
    content:{
        flex: 1,
        justifyContent: 'flex-start',
        alignContent: 'center'
    }
})