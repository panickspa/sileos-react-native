import { Box, VStack, Text, Pressable } from "@gluestack-ui/themed"
import { View } from "lucide-react-native"
import { Publikasi } from "../view/PublikasiView"
import {Dimensions, Image} from 'react-native'
import { useState } from "react"
import { colorPrimary } from "../utils/color"

export default function PublikasiCard(props:Publikasi){
    const [loadedCover, setLoadedCover] = useState(false)

    function loaded(e:boolean){
        setLoadedCover(e)
    }

    return (
        <Pressable onPress={() => console.log(props.title)}>
            <Box backgroundColor={colorPrimary}>
                {loadedCover ? "" : <Image source={require('../assets/ico_default.png')} style={{
                    height: Dimensions.get('screen').width/1.4,
                    width: Dimensions.get('screen').width/2
                }}/>}
                <Image src={String(props.cover)} onLoadEnd={()=>setLoadedCover(true)} style={{
                    height: Dimensions.get('screen').width/1.4,
                    width: Dimensions.get('screen').width/2
                }}/>
            </Box>
        </Pressable>
    )
}