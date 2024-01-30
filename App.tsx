/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  TouchableNativeFeedback,
  Image,
  Pressable,
  Dimensions
} from 'react-native';

import { Avatar, Text, } from '@gluestack-ui/themed'

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import { config } from "@gluestack-ui/config";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeView from './view/HomeView';
import PublikasiView from './view/PublikasiView';
import { iconNameTabs } from './utils/icons';
import { GluestackUIProvider, Icon } from '@gluestack-ui/themed';
import { colorPrimary, white } from './utils/color';
import { Info } from 'lucide-react-native';
import AboutView from './view/AboutView';
// import { Image } from 'react-native-svg';


function HomeScreen(){
  return (
    <HomeView/>
  );
}

const Stack = createNativeStackNavigator()

type SectionProps = PropsWithChildren<{
  title: string;
}>;

const Tab = createBottomTabNavigator()

const TabScreens = () => (
  <Tab.Navigator screenOptions={({route}) => ({
    headerShown: false,
    tabBarIcon: (({focused, color, size}) => {
      let icon = iconNameTabs(route.name)
      let f = () => focused ? colorPrimary : white;
      return focused ? <Avatar size='sm' borderRadius='$sm' bgColor={white}>
        <Icon as={icon} size='md' color={f()}/>
      </Avatar> : <View style={{
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Icon as={icon} size='md' color={f()}/>
        <Text color={white} size='sm'>{route.name}</Text>
      </View>
    }),
    tabBarShowLabel: false,
    tabBarStyle: {
      backgroundColor: colorPrimary,
      paddingTop: 5,
      paddingBottom: 5
    },
    
  })}>
    <Tab.Screen name='Home' component={HomeView}></Tab.Screen>
    <Tab.Screen name='Publikasi' component={PublikasiView}></Tab.Screen>
  </Tab.Navigator>
)

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <GluestackUIProvider config={config}>
    
    <NavigationContainer>
      <Stack.Navigator screenOptions={({navigation})=>({
        headerTitle: () => (<View style={{
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
          <View style={{
            flexDirection: 'row',
            width: Dimensions.get('window').width-60
          }}>
            <Image style={{
              height: 24,
              width: 24,
              marginRight: 10,
            }} source={require('./assets/ico_default.png')}/>
            <Text color={white}>SI Leos Minut</Text>
          </View>
          <Pressable onPress={()=> navigation.push('About')}>
            <Icon as={Info} color={white} size='lg' />
          </Pressable>
        </View>),
        headerStyle:{
          backgroundColor: colorPrimary,
        }
      })}>
        <Stack.Screen name='Default' component={TabScreens}/>
        <Stack.Screen name='About' component={AboutView} />
      </Stack.Navigator>
    </NavigationContainer>
    </GluestackUIProvider>

  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
