/* eslint-disable */
import { Box, VStack, Text, Pressable, View, Icon } from "@gluestack-ui/themed"
// import { View } from "lucide-react-native"
import { Publikasi } from "../view/PublikasiView"
import {Dimensions, Image} from 'react-native'
import { PureComponent, ReactNode, useState } from "react"
import { colorPrimary, white } from "../utils/color"
import { Eye } from "lucide-react-native"

export class PublikasiCardPure extends PureComponent<Publikasi>{
    constructor(props:Publikasi) {
        super(props);
        this.openPdf = this.openPdf.bind(this);
    }

    public state = {
        loadedCover: false,
        height: 50,
    }

    public openPdf(e:string|String|undefined|any){
        this.props.openPdf(e)
    }

    public setLoadedCover(e:boolean){
        this.setState({
            loadedCover: e
        })
    }

    render() : ReactNode{
        return <Pressable onPress={() => this.openPdf(this.props.pdf)} style={{
            padding: 5
        }}>
                <Box padding={5} rounded={'$lg'} backgroundColor={colorPrimary} margin={5} flexDirection="row">
                    <View flex={1} justifyContent="center" padding={8} height={this.state.height}>
                        <Text size="sm" fontWeight='$bold' textAlign="justify" flexWrap="wrap" color={white}>{this.props.title}</Text>
                    </View>
                    <View width={50} height={50} marginRight={3} justifyContent="center" alignItems="center">
                        <Box rounded={'$lg'} backgroundColor={white} width={50} height={50} justifyContent="center" alignItems="center">
                            <Icon color={colorPrimary} as={Eye} size={'md'}/>
                            <Text color={colorPrimary} marginTop={5}>Lihat</Text>
                        </Box>
                    </View>
                </Box>
            </Pressable>
    }
}

export default function PublikasiCard(props:Publikasi){
    const [loadedCover, setLoadedCover] = useState(false)

    function loaded(e:boolean){
        setLoadedCover(e)
    }

    function openPdf(){
        props.openPdf(props.pdf)
    }

    return (
        <Pressable onPress={() => openPdf()}>
            <Box backgroundColor={colorPrimary} margin={5}>
                {loadedCover ? "" : <Image source={require('../assets/ico_default.png')} style={{
                    height: Dimensions.get('screen').height/3,
                    width: (Dimensions.get('screen').width/2)-10
                }}/>}
                <Image src={String(props.cover)} onLoadEnd={()=>setLoadedCover(true)} style={{
                    height: Dimensions.get('screen').height/3,
                    width: Dimensions.get('screen').width/2-10
                }}/>
                <View padding={3}  backgroundColor="white" width={Dimensions.get('screen').width/2-10} height={100}>
                    <Text size="sm" fontWeight='$bold' textAlign="center" flexWrap="wrap" color={colorPrimary}>{props.title}</Text>
                </View>
            </Box>
        </Pressable>
    )
}