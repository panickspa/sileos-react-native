import { View } from "@gluestack-ui/themed";
import { Text } from "@gluestack-ui/themed";
import { StyleSheet } from "react-native";

export default function PublikasiView(){
    return (
        <View style={styles.content}>
            <Text>Publikasi World</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    content:{
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    }
})