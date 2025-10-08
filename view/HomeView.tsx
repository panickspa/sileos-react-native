/* eslint-disable eslint-comments/no-unused-disable */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { Divider } from '@/components/ui/divider';
import { View } from '@/components/ui/view';
import { Avatar } from '@/components/ui/avatar';

import {
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionTrigger,
    AccordionTitleText,
    // AccordionIcon,
    AccordionContent,
    AccordionIcon,
    // AccordionContentText,
} from '@/components/ui/accordion';
import {Icon} from '@/components/ui/icon';
// import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { Dimensions, Image, Pressable, StyleSheet, TouchableNativeFeedback, RefreshControl, Linking, Platform } from 'react-native';
import { bpsKabUrl } from '../utils/url';
import { useCallback, useEffect, useState } from 'react';
import WebViewModal from '../components/WebViewModal';
import { dataIndicator, getIndicator, indStratList, itemdata, turvar } from '../utils/indicator';
import { LineChart } from 'react-native-chart-kit';
import { IndicatorSkeleton } from '../components/SkeletonCard';
import { waNumber } from '../index';
import { ChevronDownIcon, ChevronUpIcon, Info } from 'lucide-react-native';


const dataInit:Array<itemdata> = [];

export default function HomeView(){
    const [webViewModal, setWebWiewModal] = useState(false);
    const [url, setUrl] = useState('');
    const [indicators, setIndicators] = useState(dataInit);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [errLoadIndicators, setErrLoadIndicators] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loadingIndicators, setLoadingIndicators] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    // const [urlWa, setUrlWa] = useState(`https://wa.me/${waNumber}`)

    async function goToBpsKab(){
        if(Platform.OS == 'ios'){
            const supported = await Linking.canOpenURL(bpsKabUrl)
            if(supported){
                await Linking.openURL(bpsKabUrl)
            }
        }else{
            setWebWiewModal(true);
            setUrl(bpsKabUrl);
        }
    }


    async function gotoRomantik(){
        if(Platform.OS == 'ios'){
            const supported = await Linking.canOpenURL('https://romantik.web.bps.go.id/');
            if(supported){
                await Linking.openURL('https://romantik.web.bps.go.id/');
            }
        }else{
            setWebWiewModal(true);
            setUrl('https://romantik.web.bps.go.id/');
        }
    }

    async function gotoSilastik(){
        const u = 'https://silastik.bps.go.id/v3/index.php/site';
        if(Platform.OS == 'ios'){
            const supported = await Linking.canOpenURL(u);
            if(supported){
                await Linking.openURL(u);
            }
        }else{
            setWebWiewModal(true);
            setUrl(u);
        }
    }

    async function openInfoModal(){
        const u = 'https://ppid.bps.go.id/app/konten/7106/Standar-Layanan-Informasi-Publik.html';
        if(Platform.OS == 'ios'){
            const supported = await Linking.canOpenURL(u);
            if(supported){
                await Linking.openURL(u);
            }
        }else{
            setWebWiewModal(true);
            setUrl(u);
        }
    }

    async function gotoWhatsapp(){
        let url_ = `https://api.whatsapp.com/send/?phone=${waNumber}&text&type=phone_number&app_absent=0`;
        try{
            const supported = await Linking.canOpenURL(url_);
            if(supported){
                await Linking.openURL(url_);
            }
        }catch(error){
            console.log(error);
        }
    }

    function closeModal(e:false){
        setWebWiewModal(e);
    }

    useEffect(()=>{
        setRefreshing(true);
        setLoadingIndicators(true);
        setIndicators([]);
        const fetchIndicator = async () => {
            const list_indicator = Object.keys(indStratList);
            try {
                // const data_list = [];
                for(let i in list_indicator){
                    const e = list_indicator[i];
                    const data = await getIndicator(e);
                    setIndicators((prevItems:Array<any>) => [...prevItems, data]);
                    setRefreshing(false);
                    // setLoadingIndicators(false);
                    // data_list.push(data);
                    // await delay(250)
                }
            } catch (error) {
                console.log(error);
            } finally {
                setRefreshing(false);
                setLoadingIndicators(false);
            }
        };
        fetchIndicator();
        // getAll2().then((e:Array<any>) => {
        //     if(e[0])
        //     {if(e[0].data){
        //         setIndicators(e);
        //         setRefreshing(false);
        //     }else{
        //         setRefreshing(false);
        //         // e.forEach(err => console.log(err))
        //     }}
        // })
        // .catch(err => {
        //     console.log(err);
        //     setErrLoadIndicators(true);
        //     setLoadingIndicators(false);
        //     setRefreshing(false);
        // }).finally(()=>{
        //     setRefreshing(false);
        // });
    },[]);

    const onRefresh = useCallback(() => {
        if(!refreshing || !loadingIndicators){
            setRefreshing(true);
            setIndicators([]);
            setLoadingIndicators(true);
            const fetchIndicator = async () => {
                const list_indicator = Object.keys(indStratList);
                try {
                    // const data_list = [];
                    for(let i in list_indicator){
                        const e = list_indicator[i];
                        const data = await getIndicator(e);
                        setIndicators((prevItems:Array<any>) => [...prevItems, data]);
                        setRefreshing(false);
                        // setLoadingIndicators(false);
                        // data_list.push(data);
                        // await delay(250)
                    }
                } catch (error) {
                    console.log(error);
                } finally {
                    setRefreshing(false);
                    setLoadingIndicators(false);
                }
            };
            fetchIndicator();
        }
      }, [refreshing, loadingIndicators]);


    return (
        <View style={styles.content}>
            <View style={styles.headerMenu}>
                <Pressable onPress={goToBpsKab}>
                    <TouchableNativeFeedback onPress={goToBpsKab}>
                        <Avatar className={'bg-primary-0 rounded-xs mr-2 '}>
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
                        <Avatar className={'bg-primary-0 rounded-xs mr-2 '}>
                            <Image style={{
                                    height: 24,
                                    width: 24,
                                }} source={require('../assets/logo-romantik.png')}
                            />
                        </Avatar>
                    </TouchableNativeFeedback>
                </Pressable>
                <Pressable onPress={()=>{}}>
                    <TouchableNativeFeedback onPress={gotoSilastik}>
                        <Avatar className={'bg-primary-0 rounded-xs mr-2 '}>
                            <Image style={{
                                    height: 24,
                                    width: 24,
                                }} source={require('../assets/header_pdo_new.png')}
                            />
                        </Avatar>
                    </TouchableNativeFeedback>
                </Pressable>
                <Pressable onPress={gotoWhatsapp}>
                    <TouchableNativeFeedback onPress={gotoWhatsapp}>
                        <Avatar className={'bg-primary-0 rounded-xs mr-2'}>
                            <Image style={{
                                    height: 24,
                                    width: 24,
                                }} source={require('../assets/whatsapp.png')}
                            />
                        </Avatar>
                    </TouchableNativeFeedback>
                </Pressable>
                <Pressable onPress={openInfoModal}>
                    <TouchableNativeFeedback onPress={openInfoModal}>
                            <Avatar size="md" className={' bg-primary-0 rounded-xs '}>
                                <Icon as={Info} size="xl" className={'bg-primary-0 color-secondary-0'} />
                            </Avatar>
                    </TouchableNativeFeedback>
                </Pressable>
            </View>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={loadingIndicators} onRefresh={onRefresh} />
                }
                className="flex-column flex-1">
                {!refreshing && indicators.length < 1 ? <View style={{
                    padding: 10,
                }}>
                    <Text size="lg" >Kesalahan Jaringan Silahkan Coba Usap Kebawah Kembali</Text>
                </View> : <></> }
                {
                    refreshing ? <IndicatorSkeleton /> :
                    <Accordion isCollapsible  type="multiple">
                        {
                            indicators.map((e:itemdata,i:number) =>{
                                if(e.data)
                                {return (
                                    <AccordionItem value={`${e.data[0].indicator_id}`} key={`indikator-id-${e.data[0].var}-${e.data[0].indicator_id}-${i}`} className={' bg-primary-0 '}>
                                        <AccordionHeader>
                                            <AccordionTrigger>
                                                {(props:{
                                                    isExpanded: boolean
                                                }) => {
                                                    return (
                                                        <>
                                                            <View style={{flexDirection:'column', justifyContent:'space-between'}}>
                                                                <AccordionTitleText className={' color-secondary-0 text-sm '}>
                                                                    <Text className="color-secondary-0 text-sm" isTruncated>
                                                                        {e.data[0].title} {String(e.data[e.data.length - 1].tahun)}  {e.data[0].unit ? `( ${e.data[0].unit} )` : ''}
                                                                    </Text>
                                                                    {props.isExpanded ? (
                                                                        <AccordionIcon as={ChevronUpIcon} className="ml-3 color-secondary-0" />
                                                                    ) : (
                                                                        <AccordionIcon as={ChevronDownIcon} className="ml-3 color-secondary-0" />
                                                                    )}
                                                                </AccordionTitleText>
                                                                <View className="flex-row mt-3">
                                                                    <Text
                                                                        size="xs"
                                                                        className={' color-primary-50 bg-secondary-0 font-bold rounded-lg px-2 mt-[5px] '}>{`${e.data[e.data.length - 1].turtahun == 'Tahun' ? '' : `${e.data[e.data.length - 1].turtahun} : `}`}{e.data[e.data.length - 1].value.toLocaleString('id')}</Text>
                                                                </View>
                                                            </View>
                                                        </>
                                                    );
                                                }}
                                            </AccordionTrigger>
                                            <AccordionContent className={' bg-secondary-0 pt-[10px] pl-[10px] '}>
                                                <IndikatorChart
                                                    data={e.data} 
                                                    turvar={e.turvar}
                                                    idComponent={`indikator-id-${e.data[0].var}-${e.data[0].indicator_id}-chart-${i}`}
                                                    key={`indikator-id-${e.data[0].var}-${e.data[0].indicator_id}-chart-${i}`}
                                                />
                                            </AccordionContent>
                                        </AccordionHeader>
                                    </AccordionItem>
                                );}
                            }).filter(e => e)
                        }
                        {
                            loadingIndicators ? <AccordionItem value="loading-item-accordion" key={'loading-item-accrodion-indstratlist'}>
                                <AccordionHeader>
                                    <AccordionTrigger>
                                        <AccordionTitleText className={' color-secondary-0 text-sm '}>
                                            <Text className="color-secondary-0 text-sm" isTruncated>Loading</Text>
                                        </AccordionTitleText>
                                    </AccordionTrigger>
                                </AccordionHeader>
                            </AccordionItem>
                            : <></>
                        }
                    </Accordion>
                }
            </ScrollView>
            <WebViewModal showModal={webViewModal} url={url} onClose={closeModal}/>
        </View>
    );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function formatYLabel(e:string|String){
    let num = Number(e);
    if(num > 1000){
        if(num > 1000000){
            return `${String((Math.round((num) / 100000) / 10).toLocaleString('id'))} juta`;
        }else{
            return `${String((Math.round((num) / 100) / 100).toLocaleString('id'))} ribu`;
        }
    }else{
        return `${String((Math.round(num * 100) / 100).toLocaleString('id'))}`;
    }
}

function IndikatorChartVervar(props:{
    turvar: turvar,
    data: Array<dataIndicator>,
    key?:string;
}){
    return (
        <View>
            <Divider key={`divider-1-${props.turvar.val}-${props.data[0].indicator_id}`}
                style={{
                marginVertical: 10,
                }}
            />
            <Text key={`title-graph-${props.turvar.val}-${props.data[0].indicator_id}`} className="color-primary-0">{String(props.turvar.label)}</Text>
            <Divider key={`divider-2-${props.turvar.val}-${props.data[0].indicator_id}`}
                style={{
                marginVertical: 10,
                }}
            />
        </View>
    );

}

function IndikatorChart(props:{
    data: any,
    turvar: any,
    idComponent: string,
    key?: string,
}){
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-shadow
    return props.turvar.map((turvar:turvar,i:number) => {
        let data = props.data
        .filter((
            d:{
                val: string|number|String|Number,
                label: string|String,
                turvar: {
                    val: string|number|String|Number,
                    label: string|String,
                }
            }
        ) => {
            return d.turvar.val == turvar.val;
        })
        // .sort((a:{turtahun_val:number}, b:{turtahun_val:number}) => (Number(a.turtahun_val) - Number(b.turtahun_val)))
        // .splice(0, 3)
        .sort((a:{turtahun_val:number}, b:{turtahun_val:number}) => (b.turtahun_val - a.turtahun_val));
        if(props.data[0].var == 186 || props.data[0].var == 187 || props.data[0].var == 189 || props.data[0].var == 190 || props.data[0].var == 191)
            {data = data.filter((e:{turtahun:string}) => (String(e.turtahun).toLowerCase() != 'jumlah'));}
        data = data.splice( 0,
            props.data[0].var == 2 || props.data[0].var == 160 || props.data[0].var == 161 ||  props.data[0].var == 162 ? 6 :
            props.data[0].var == 186 || props.data[0].var == 187 || props.data[0].var == 189 || props.data[0].var == 190 || props.data[0].var == 191 ? 4 :
            3);
        data = data.sort((a:{turtahun_val:number}, b:{turtahun_val:number}) => (Number(a.turtahun_val) - Number(b.turtahun_val)));
        const d = new Date();
        return data.length < 1 ? <></> : <View key={`view-graph-1-${turvar.val}-${props.data[0].indicator_id}-${i}-${d.getTime()}-${props.idComponent}`}>
                {
                    props.turvar.length > 1 ? <IndikatorChartVervar turvar={turvar} data={props.data} key={`vervar-graph-${data[0].var}-${turvar.val}-${props.data[0].indicator_id}-${i}-${d.getTime()}-${props.idComponent}`} /> : ''
                }
                <LineChart
                    key={`graph-${turvar.val}-${props.data[0].indicator_id}-${i}-${data[0].var}-${d.getTime()}-${props.idComponent}`}
                    data={{
                        labels: data.map((e:any) => {
                            return e.turtahun == 'Tahun' ?
                                (e.tahun ? String(e.tahun) : '-') :
                                (
                                    (e.var == 186 || e.var == 187 || e.var == 189 || e.var == 190 || e.var == 191) ?
                                    (
                                        String(e.turtahun).toLowerCase() == 'jumlah' ? String(e.tahun) : `${String(e.turtahun).replaceAll('Triwulan', 'TW')} ${e.tahun}`
                                    ) :
                                    e.turtahun
                                );
                        }),
                        datasets: [
                            {
                                data: data.map((e:any) => {
                                    return e.value ? parseFloat(e.value) : 0;
                                }),
                            },
                        ],
                    }}
                    withVerticalLabels={true}
                    withHorizontalLabels={false}
                    width={Dimensions.get('window').width - 20}
                    height={Dimensions.get('window').height / 3}
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
                        let d = data;
                        if(d[0].turtahun != 'Tahun'){
                            return d[0].var == 186 || d[0].var == 187 || d[0].var == 189 || d[0].var == 190 || d[0].var == 191 ?
                                f :
                                f == d[0].turtahun || f == d[d.length - 1].turtahun || f == d[Number(Math.ceil(d.length / 2)) - 1].turtahun ? f : ' ';
                        }
                        return f == d[0].tahun || f == d[d.length - 1].tahun
                        ? f
                        : ' ';
                    }}
                    renderDotContent={
                        ({x,y,index,indexData}) =>
                            <Text
                                style={{
                                    position: 'absolute',
                                    top: y,
                                    left: index == 2 ? x - 30 : x + 10,
                                }}
                                key={`i-${index}-${indexData}-${y}-${x}-${props.idComponent}`}
                            >{indexData.toLocaleString('id')}</Text>
                        }
                 />
            </View>;
    });
}
const styles = StyleSheet.create({
    content:{
        flex: 1,
        justifyContent: 'flex-start',
        alignContent: 'center',
    },
    headerMenu:{
        flexDirection: 'row',
        margin: 15,
        justifyContent: 'center',
    },
});
