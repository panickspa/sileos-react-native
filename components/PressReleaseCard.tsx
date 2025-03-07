import { Icon } from '@/components/ui/icon';
import { View } from '@/components/ui/view';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
// import { View } from "lucide-react-native"
import { Publikasi } from '../view/PublikasiView';
import {Dimensions, Image} from 'react-native';
import { PureComponent, ReactNode, useState } from 'react';
import { colorPrimary, white } from '../utils/color';
import { Eye } from 'lucide-react-native';

export class PublikasiCardPure extends PureComponent<Publikasi>{
    constructor(props:Publikasi) {
        super(props);
        this.openPdf = this.openPdf.bind(this);
    }

    public state = {
        loadedCover: false,
        height: 50,
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
            // eslint-disable-next-line react-native/no-inline-styles
            <Pressable onPress={() => this.openPdf(this.props.pdf)} style={{
                padding: 5,
            }}>
                    <Box
                        className={` bg-primary-0 p-[5px] rounded-lg m-[5px] flex-row `}>
                        <View
                            className={` minHeight-${this.state.height} flex-1 justify-center p-[8px] `}>
                            <Text size="sm" className={` color-secondary-0 font-bold text-justify flex-wrap `}>{this.props.title}</Text>
                        </View>
                        <View className="w-[50px] h-[50px] mr-[3px] justify-center items-center">
                            <Box
                                className={` bg-primary-0 rounded-lg w-[50px] min-h-[50px] justify-center items-center `}>
                                <Icon as={Eye} size={'md'} className={` color-secondary-0`}/>
                                <Text className={` color-secondary-0 mt-[5px] `}>Lihat</Text>
                            </Box>
                        </View>
                    </Box>
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
            <Box className={` bg-primary-0 m-[5px] `}>
                {loadedCover ? '' : <Image source={require('../assets/ico_default.png')} style={{
                    height: Dimensions.get('screen').height / 3,
                    width: (Dimensions.get('screen').width / 2) - 10,
                }}/>}
                <Image src={String(props.cover)} onLoadEnd={()=>setLoadedCover(true)} style={{
                    height: Dimensions.get('screen').height / 3,
                    width: Dimensions.get('screen').width / 2 - 10,
                }}/>
                <View
                    className={` width-${Dimensions.get('screen').width / 2 - 10} p-[3px] bg-white min-h-[100px] `}>
                    <Text
                        size="sm"
                        className={` color-${colorPrimary} font-bold text-center flex-wrap `}>{props.title}</Text>
                </View>
            </Box>
        </Pressable>
    );
}
