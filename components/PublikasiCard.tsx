import { Box, VStack, Text, Pressable, View } from "@gluestack-ui/themed"
// import { View } from "lucide-react-native"
import { Publikasi } from "../view/PublikasiView"
import {Dimensions, Image} from 'react-native'
import { useState } from "react"
import { colorPrimary, white } from "../utils/color"

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
                    height: Dimensions.get('screen').width/1.4-10,
                    width: (Dimensions.get('screen').width/2)-10
                }}/>}
                <Image src={String(props.cover)} onLoadEnd={()=>setLoadedCover(true)} style={{
                    height: Dimensions.get('screen').width/1.4-10,
                    width: Dimensions.get('screen').width/2-10
                }}/>
                <View padding={3}  backgroundColor="white" width={Dimensions.get('screen').width/2-10} height={100}>
                    <Text size="sm" fontWeight='$bold' textAlign="center" flexWrap="wrap" color={colorPrimary}>{props.title}</Text>
                </View>
            </Box>
        </Pressable>
    )
}