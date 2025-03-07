import { View } from '@/components/ui/view';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
// import { View } from "lucide-react-native"
import { Publikasi } from '../view/PublikasiView';
import {Dimensions, Image} from 'react-native';
import { PureComponent, ReactNode, useState } from 'react';
import { colorPrimary } from '../utils/color';
import { Center } from './ui/center';

export class PublikasiCardPure extends PureComponent<Publikasi>{
    constructor(props:Publikasi) {
        super(props);
        this.openPdf = this.openPdf.bind(this);
    }

    public state = {
        loadedCover: false,
        height: (Dimensions.get('window').height / 4),
        // width: 'auto',
        width: (Dimensions.get('window').width / 2) - 15,
    };

    public openPdf(e:string|String|undefined|any){
        this.props.openPdf(e);
    }

    public setLoadedCover(e:boolean){
        this.setState({
            loadedCover: e,
        });
    }

    render() : ReactNode{
        return (
            <Pressable onPress={() => this.openPdf(this.props.pdf)}>
                    <View className={' bg-primary-0 m-2 rounded-b-sm'}  style={{width: this.state.width}}>
                        {/* {this.state.loadedCover ? "" : <Image source={require('../assets/ico_default.png')} style={{
                            height: this.state.height,
                            width: this.state.width
                        }}/>} */}
                        <Image src={String(this.props.cover)} onLoadEnd={()=>this.setLoadedCover(true)} style={{
                            height: this.state.height + 40,
                            // maxHeight: this.state.height,
                            width: 'auto',
                            // width: 'auto'
                        }}/>
                        {/* <Box>
                            <Text
                                    size="sm"
                                    className={` color-primary-0 font-bold text-center flex-wrap `}>{this.props.title}</Text>
                        </Box> */}
                        <View
                            className={`width-50 p-1 bg-primary-0 min-h-[50px] rounded-b-sm`}>
                             <Text
                                    size="sm"
                                    className={` color-secondary-0 font-bold text-center flex-wrap `}>{this.props.title}</Text>
                        </View>
                    </View>
                </Pressable>
        );
    }
}

export default function PublikasiCard(props:Publikasi){
    const [loadedCover, setLoadedCover] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function loaded(e:boolean){
        setLoadedCover(e);
    }

    function openPdf(){
        props.openPdf(props.pdf);
    }

    return (
        <Pressable onPress={() => openPdf()}>
            <Box className={' bg-primary-0 m-[5px] '}>
                {loadedCover ? '' : <Image source={require('../assets/ico_default.png')} style={{
                    height: ((Dimensions.get('window').width / 2) * 1.5) - 10,
                    width: (Dimensions.get('window').width / 2) - 10,
                }}/>}
                <Image src={String(props.cover)} onLoadEnd={()=>setLoadedCover(true)} style={{
                    height: (Dimensions.get('window').height / 2) * 1.5,
                    width: (Dimensions.get('window').width / 2) - 10,
                }}/>
                <View
                    className={` width-${Dimensions.get('screen').width / 2 - 10} p-[3px] bg-white h-[100px] `}>
                    <Text
                        size="sm"
                        className={` color-${colorPrimary} font-bold text-center flex-wrap `}>{props.title}</Text>
                </View>
            </Box>
        </Pressable>
    );
}
