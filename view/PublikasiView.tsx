import { Input, InputField, InputIcon, InputSlot, View, ScrollView, SafeAreaView } from "@gluestack-ui/themed";
import { Text } from "@gluestack-ui/themed";
import { Search } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { RefreshControl, StyleSheet } from "react-native";
import { apiKey, default_domain, getPublication } from "../utils/api";
import PublikasiCard from "../components/PublikasiCard";
import { FlatList } from "react-native";


interface PublikasiResponse {
    status: Number|number|String|string,
    'data-availability': Number|number|String|string,
    data?: PublikasiRequest
}

type PublikasiRequest = Array<Array<Publikasi>>

interface PublikasiRequestPages {
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
    total?: Number|number|String|string
}

export default function PublikasiView(){
    return (
        <View style={styles.content}>
            <Input margin={'$2'}>
                <InputSlot paddingLeft={'$3'}>
                    <InputIcon as={Search} />
                </InputSlot>
                <InputField placeholder="Ketik judul publikasi ..." />
            </Input>
            <PublikasiList/>
        </View>
    )
}

interface PublikasiList{
    data: PublikasiRequest|undefined,
    onRefresh: Function,
    refreshing: boolean,
    nextPage: Function
}

const initPublikasi:Array<Publikasi> = []

function PublikasiList(){

    const [publikasiList, setPublikasiList] = useState(initPublikasi)
    const [refreshing, setRefreshing] = useState(false);
    const [keyword, setKeyword] = useState('')
    const [page, setPage] = useState(0)
    const [pageAll, setPageAll] = useState(0)

    useEffect(()=>{
        getPublication({
            domain: default_domain,
            lang: 'ind',
            page: 0,
            apiKey: apiKey,
            keyword: ''
        }).then(
            (e:PublikasiResponse) => {
                setPublikasiList(e.data[1])
                setPage(e.data[0].page)
                setPageAll(e.data[0].pages)
            }
        )
    }, [])

    const refreshPublikasi = () => {
        setRefreshing(true);
        setPublikasiList([])
        getPublication({
            domain: default_domain,
            lang: 'ind',
            page: 0,
            apiKey: apiKey,
            keyword: ''
        }).then(
            (e:PublikasiResponse) => {
                console.log(e.data, 'refresh')
                setPublikasiList(e.data)
                setPage(e.data[0].page)
                setPageAll(e.data[0].pages)
                setRefreshing(false)
            }
        )
    }

    const nextPage = ()=>{
        console.log('reach end')
        let p = page
        if(p != pageAll){
            p = p+1
            console.log('next page', p)
            setPage(p)
            getPublication({
                domain: default_domain,
                lang: 'ind',
                page: p,
                apiKey: apiKey,
                keyword: ''
            }).then(
                (e:PublikasiResponse) => {
                    console.log(typeof e.data)
                    setPublikasiList([...publikasiList, ...e.data[1]])
                }
            ).finally(() => {
                setRefreshing(false)
            })
        }
    }
        if(publikasiList)
            if(publikasiList.length) 
                return (
                    <FlatList 
                        data={publikasiList}
                        numColumns={2}
                        renderItem={({item}) => {
                            return <PublikasiCard title={item.title} cover={item.cover} pdf={item.pdf} />
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