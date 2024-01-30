import { Accordion, AccordionHeader, AccordionItem, Avatar, Button, Icon, View, AccordionTrigger, AccordionTitleText, AccordionIcon, AccordionContent, AccordionContentText, Divider } from "@gluestack-ui/themed";
import { Text,ScrollView } from "@gluestack-ui/themed";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { Dimensions, GestureResponderEvent, Image, Pressable, StyleSheet, TouchableNativeFeedback, RefreshControl, } from "react-native";
import { colorPrimary, white } from "../utils/color";
import { bpsKabUrl } from "../utils/url";
import { useCallback, useEffect, useState } from "react";
import WebViewModal from "../components/WebViewModal";
import { dataIndicator, getAll, itemdata, turvar } from "../utils/indicator";
import { LineChart } from "react-native-chart-kit";


const dataInit:Array<itemdata> = []

export default function HomeView(){
    const [webViewModal, setWebWiewModal] = useState(false)
    const [url, setUrl] = useState('')
    const [indicators, setIndicators] = useState(dataInit)
    const [errLoadIndicators, setErrLoadIndicators] = useState(false)
    const [loadingIndicators, setLoadingIndicators] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    
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
        setUrl('https://silastik.bps.go.id')
    }

    function closeModal(e:false){
        setWebWiewModal(e)
    }
    
    useEffect(()=>{
        setLoadingIndicators(true)
        getAll().then((e:Array<itemdata>) => {
            setIndicators(e)
        })
        .catch(err => {
            setErrLoadIndicators(true)
            setLoadingIndicators(false)
        })
    },[])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setLoadingIndicators(true)
        getAll().then((e:Array<itemdata>) => {
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
                        <Avatar borderRadius={'$xs'} backgroundColor={colorPrimary}>
                            <Image style={{
                                    height: 24,
                                    width: 24,
                                }} source={require('../assets/header_pdo_new.png')}
                            />
                        </Avatar>
                    </TouchableNativeFeedback>
                </Pressable>
            </View>
            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            } flexDirection="column" h={200}>
                <Accordion type="multiple" backgroundColor={colorPrimary}>
                    {
                        indicators.map((e:itemdata) =>{
                            return (
                                <AccordionItem backgroundColor={colorPrimary} value={`${e.data[0].indicator_id}`} key={`indikator-id-${e.data[0].indicator_id}`}>
                                    <AccordionHeader>
                                        <AccordionTrigger>
                                            {({ isExpanded }) => {
                                                return (
                                                    <>
                                                    <View style={{flexDirection:'column', justifyContent:'space-between'}}>
                                                        <AccordionTitleText color={white} fontSize={"$sm"}>{e.data[0].title}  {e.data[0].unit ? `( ${e.data[0].unit} )` : ''}</AccordionTitleText>
                                                        <AccordionTitleText color={white} fontSize={"$sm"}>{e.data[e.data.length-1].value.toLocaleString('id')}</AccordionTitleText>
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
                        })
                    }
                </Accordion>
            </ScrollView>
            <WebViewModal showModal={webViewModal} url={url} onClose={closeModal}/>
        </View>
    )
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

function IndikatorChart(props:itemdata){
    return props.turvar.map((turvar:turvar,i:number) => {
        let data = props.data.filter(d => d.turvar.val == turvar.val)
            return <View key={`view-graph-1-${turvar.val}-${props.data[0].indicator_id}`}>
                {props.turvar.length > 1 ? <IndikatorChartVervar turvar={turvar} data={props.data} /> : '' }
                <LineChart
                    key={`graph-${turvar.val}-${props.data[0].indicator_id}`}
                    data={{
                        labels: data.map(e => String(e.tahun)),
                        datasets: [
                            {
                            data: data.map(e => Number(e.value)),
                            },
                        ],
                    }}
                    width={Dimensions.get('window').width - 20}
                    height={Dimensions.get('window').height / 4}
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
                        return f == d[0].tahun || f == d[d.length - 1].tahun
                        ? f
                        : ' ';
                    }}
                    horizontalLabelRotation={-45}
                    renderDotContent={({x,y,index,indexData}) => <Text
                    style={{
                        position: 'absolute', 
                        top: y+3, 
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