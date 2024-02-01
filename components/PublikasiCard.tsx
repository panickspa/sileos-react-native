/* eslint-disable */
import { Box, VStack, Text, Pressable, View } from "@gluestack-ui/themed"
// import { View } from "lucide-react-native"
import { Publikasi } from "../view/PublikasiView"
import {Dimensions, Image} from 'react-native'
import { PureComponent, ReactNode, useState } from "react"
import { colorPrimary, white } from "../utils/color"

export class PublikasiCardPure extends PureComponent<Publikasi>{
    constructor(props:Publikasi) {
        super(props);
        this.openPdf = this.openPdf.bind(this);
    }

    public state = {
        loadedCover: false,
        height: Dimensions.get('screen').height/3,
        width: (Dimensions.get('screen').width/2)-10,
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
        return <Pressable onPress={() => this.openPdf(this.props.pdf)}>
                <Box backgroundColor={colorPrimary} margin={5}>
                    {this.state.loadedCover ? "" : <Image source={require('../assets/ico_default.png')} style={{
                        height: this.state.height,
                        width: this.state.width
                    }}/>}
                    <Image src={String(this.props.cover)} onLoadEnd={()=>this.setLoadedCover(true)} style={{
                        height: this.state.height,
                        width: this.state.width
                    }}/>
                    <View padding={3}  backgroundColor="white" width={Dimensions.get('screen').width/2-10} height={100}>
                        <Text size="sm" fontWeight='$bold' textAlign="center" flexWrap="wrap" color={colorPrimary}>{this.props.title}</Text>
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