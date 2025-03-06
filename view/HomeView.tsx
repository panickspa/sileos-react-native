/* eslint-disable */
import { Accordion, AccordionHeader, AccordionItem, Avatar, Button, Icon, View, AccordionTrigger, AccordionTitleText, AccordionIcon, AccordionContent, AccordionContentText, Divider } from "@gluestack-ui/themed";
import { Text,ScrollView } from "@gluestack-ui/themed";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { Dimensions, GestureResponderEvent, Image, Pressable, StyleSheet, TouchableNativeFeedback, RefreshControl, Linking, } from "react-native";
import { colorPrimary, white } from "../utils/color";
import { bpsKabUrl } from "../utils/url";
import { useCallback, useEffect, useState } from "react";
import WebViewModal from "../components/WebViewModal";
import { dataIndicator, getAll, itemdata, turvar } from "../utils/indicator";
import { LineChart } from "react-native-chart-kit";
import { IndicatorSkeleton } from "../components/SkeletonCard";
import { waNumber } from "..";


const dataInit:Array<itemdata> = []

export default function HomeView(){
    const [webViewModal, setWebWiewModal] = useState(false)
    const [url, setUrl] = useState('')
    const [indicators, setIndicators] = useState(dataInit)
    const [errLoadIndicators, setErrLoadIndicators] = useState(false)
    const [loadingIndicators, setLoadingIndicators] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    // const [urlWa, setUrlWa] = useState(`https://wa.me/${waNumber}`)
    
    function goToBpsKab(){
        setWebWiewModal(true)
        setUrl(bpsKabUrl)
    }


    function gotoRomantik(){
        setWebWiewModal(true)
        setUrl('https://romantik.web.bps.go.id/')
    }

    function gotoSilastik(){
        setWebWiewModal(true)
        setUrl('https://silastik.bps.go.id/v3/index.php/site')
    }

    async function gotoWhatsapp(){
        let url = `https://api.whatsapp.com/send/?phone=${waNumber}&text&type=phone_number&app_absent=0`
        try{
            const supported = await Linking.canOpenURL(url);
            console.log("supported", supported)
            if(supported){
                await Linking.openURL(url)
            }
        }catch(error){
            console.log(error)
        }
    }

    function closeModal(e:false){
        setWebWiewModal(e)
    }
    
    useEffect(()=>{
        setRefreshing(true)
        setLoadingIndicators(true)
        getAll().then((e:Array<any>) => {
            if(e[0])
            if(e[0].data){
                setIndicators(e)
                setRefreshing(false)
            }else{
                setRefreshing(false)
                // e.forEach(err => console.log(err))
            }
        })
        .catch(err => {
            console.log(err)
            setErrLoadIndicators(true)
            setLoadingIndicators(false)
            setRefreshing(false)
        }).finally(()=>{
            setRefreshing(false)
        })
    },[])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setIndicators([])
        setLoadingIndicators(true)
        getAll().then((e:Array<any>) => {
            if(e[0].data)
            setIndicators(e)
        })
        .catch(err => {
            setErrLoadIndicators(true)
            setLoadingIndicators(false)
        }).finally(()=>{
          setRefreshing(false);
        })
      }, []);


    return (
        <View style={styles.content}>
            <View style={styles.headerMenu}>
                <Pressable onPress={goToBpsKab}>
                    <TouchableNativeFeedback onPress={goToBpsKab}>
                        <Avatar borderRadius={'$xs'} marginHorizontal={5} backgroundColor={colorPrimary}>
                            <Image style={{
                                    height: 24,
                                    width: 24,
                                }} source={require('../assets/bps_logo.png')}
                            />
                        </Avatar>
                    </TouchableNativeFeedback>
                </Pressable>
                <Pressable onPress={gotoRomantik}>
                    <TouchableNativeFeedback onPress={gotoRomantik}>
                        <Avatar borderRadius={'$xs'} marginRight={5} backgroundColor={colorPrimary}>
                            <Image style={{
                                    height: 24,
                                    width: 24,
                                }} source={require('../assets/logo-romantik.png')}
                            />
                        </Avatar>
                    </TouchableNativeFeedback>
                </Pressable>
                <Pressable onPress={gotoSilastik}>
                    <TouchableNativeFeedback onPress={gotoSilastik}>
                        <Avatar borderRadius={'$xs'} marginRight={5} backgroundColor={colorPrimary}>
                            <Image style={{
                                    height: 24,
                                    width: 24,
                                }} source={require('../assets/header_pdo_new.png')}
                            />
                        </Avatar>
                    </TouchableNativeFeedback>
                </Pressable>
                <Pressable onPress={gotoSilastik}>
                    <TouchableNativeFeedback onPress={gotoWhatsapp}>
                        <Avatar borderRadius={'$xs'} backgroundColor={colorPrimary}>
                            <Image style={{
                                    height: 24,
                                    width: 24,
                                }} source={require('../assets/whatsapp.png')}
                            />
                        </Avatar>
                    </TouchableNativeFeedback>
                </Pressable>
            </View>
            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            } flexDirection="column" flex={1}>
                {!refreshing && indicators.length < 1 ? <Text size="lg">Kesalahan Jaringan Silahkan Coba Usap Kebawah Kembali</Text> : <></> }
                {refreshing ? <IndicatorSkeleton /> : <></>}
                <Accordion type="multiple" backgroundColor={colorPrimary}>
                    {
                        indicators.map((e:itemdata) =>{
                            if(e.data)
                            return (
                                <AccordionItem backgroundColor={colorPrimary} value={`${e.data[0].indicator_id}`} key={`indikator-id-${e.data[0].indicator_id}`}>
                                    <AccordionHeader>
                                        <AccordionTrigger>
                                            {({ isExpanded }) => {
                                                return (
                                                    <>
                                                    <View style={{flexDirection:'column', justifyContent:'space-between'}}>
                                                        <AccordionTitleText color={white} fontSize={"$sm"}>{e.data[0].title} {String(e.data[e.data.length-1].tahun)}  {e.data[0].unit ? `( ${e.data[0].unit} )` : ''}</AccordionTitleText>
                                                        <View flexDirection="row">
                                                            <Text size="xs" fontWeight="bold" rounded={'$lg'} paddingHorizontal={10} backgroundColor={white} color={colorPrimary} marginTop={5}>{e.data[e.data.length-1].value.toLocaleString('id')}</Text>
                                                        </View>
                                                    </View>
                                                    {isExpanded ? (
                                                        <AccordionIcon color={white} as={ChevronUp} ml="$3" />
                                                    ) : (
                                                        <AccordionIcon color={white} as={ChevronDown} ml="$3" />
                                                    )}
                                                    </>
                                                )
                                            }}
                                        </AccordionTrigger>
                                        <AccordionContent backgroundColor={white} paddingTop={10} paddingLeft={10}>
                                            <IndikatorChart data={e.data} turvar={e.turvar} />
                                        </AccordionContent>
                                    </AccordionHeader>
                                </AccordionItem>
                            )
                        }).filter(e => e)
                    }
                </Accordion>
            </ScrollView>
            <WebViewModal showModal={webViewModal} url={url} onClose={closeModal}/>
        </View>
    )
}

function formatYLabel(e:string|String){
    let num = Number(e)
    if(num > 1000){
        if(num > 1000000){
            return `${String((Math.round((num)/100000)/10).toLocaleString('id'))} juta`
        }else{
            return `${String((Math.round((num)/100)/100).toLocaleString('id'))} ribu`
        }
    }else{
        return `${String((Math.round(num*100)/100).toLocaleString('id'))}`
    }
}

function IndikatorChartVervar(props:{
    turvar: turvar,
    data: Array<dataIndicator>
}){
    return (
        <View>
            <Divider key={`divider-1-${props.turvar.val}-${props.data[0].indicator_id}`}
                style={{
                marginVertical: 10,
                }}
            />
            <Text key={`title-graph-${props.turvar.val}-${props.data[0].indicator_id}`}>{String(props.turvar.label)}</Text>
            <Divider key={`divider-2-${props.turvar.val}-${props.data[0].indicator_id}`}
                style={{
                marginVertical: 10,
                }}
            />
        </View>
    )
       
}

function IndikatorChart(props:{
    data: any,
    turvar: any,
}){
    return props.turvar.map((turvar:turvar,i:number) => {
        let data = props.data.filter((d:{
            val: string|number|String|Number,
            label: string|String,
            turvar: {
                val: string|number|String|Number,
                label: string|String,
            }
        } )=> d.turvar.val == turvar.val)
            return <View key={`view-graph-1-${turvar.val}-${props.data[0].indicator_id}`}>
                {props.turvar.length > 1 ? <IndikatorChartVervar turvar={turvar} data={props.data} /> : '' }
                <LineChart
                    key={`graph-${turvar.val}-${props.data[0].indicator_id}`}
                    data={{
                        labels: data.map((e:any) => e.turtahun == 'Tahun' ? e.tahun ? String(e.tahun) : '-' : e.turtahun),
                        datasets: [
                            {
                            data: data.map((e:any) => e.value ? Number(e.value) : '-'),
                            },
                        ],
                    }}
                    withVerticalLabels={true}
                    withHorizontalLabels={false}
                    width={Dimensions.get('window').width - 20}
                    height={Dimensions.get('window').height / 4}
                    xLabelsOffset={3}
                    yLabelsOffset={10}
                    withHorizontalLines={false}
                    withVerticalLines={false}
                    chartConfig={{
                        backgroundGradientFrom: 'rgb(220,220,240)',
                        backgroundGradientFromOpacity: 1,
                        backgroundGradientTo: 'rgb(220,220,240)',
                        backgroundGradientToOpacity: 1,
                        color: (opacity = 1) => `rgba(0, 77, 145, ${opacity})`,
                        decimalPlaces: 2,
                    }}
                    formatXLabel={f => {
                        let d = props.data;
                        if(d[0].turtahun != 'Tahun'){ 
                            return f == d[0].turtahun || f == d[d.length-1].turtahun || f == d[Number(Math.ceil(d.length/2))-1].turtahun ? f : ' '
                        }
                        return f == d[0].tahun || f == d[d.length - 1].tahun
                        ? f
                        : ' ';
                    }}
                    renderDotContent={({x,y,index,indexData}) => <Text
                    style={{
                        position: 'absolute', 
                        top: y, 
                        left: index == 2 ? x-30 : x+10,
                    }}
                    key={`i-${index}-${indexData}-${y}-${x}`}
                    >{indexData.toLocaleString('id')}</Text>}
                ></LineChart>
            </View>
    })
}

const styles = StyleSheet.create({
    content:{
        flex: 1,
        justifyContent: 'flex-start',
        alignContent: 'center'
    },
    headerMenu:{
        flexDirection: 'row',
        margin: 15,
        justifyContent: 'center'
    }
})