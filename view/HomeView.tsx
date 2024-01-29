import { Avatar, Button, Icon, View } from "@gluestack-ui/themed";
import { Text } from "@gluestack-ui/themed";
import { Globe } from "lucide-react-native";
import { GestureResponderEvent, Pressable, StyleSheet, TouchableNativeFeedback } from "react-native";
import { colorPrimary, white } from "../utils/color";
import { bpsKabUrl } from "../utils/url";
import { GestureEvent } from "react-native-gesture-handler";
import { useState } from "react";

export default function HomeView(){
    function goToBpsKab(e:GestureResponderEvent){
        setUrl(bpsKabUrl)
        setWebWiewModal(true)
    }
    const [webViewModal, setWebWiewModal] = useState(false)
    const [url, setUrl] = useState(bpsKabUrl)

    return (
        <View style={styles.content}>
            <Pressable onPress={goToBpsKab}>
                <TouchableNativeFeedback>
                    <Avatar borderRadius={'$xs'} backgroundColor={colorPrimary}>
                        <Icon as={Globe} color={white}/>
                    </Avatar>
                </TouchableNativeFeedback>
            </Pressable>
            <Text>{String(webViewModal)}</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    content:{
        flex: 1,
        justifyContent: 'flex-start',
        alignContent: 'center'
    }
})