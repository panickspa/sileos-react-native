/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useEffect} from 'react';
// eslint-disable-next-line
import {View, Image, Pressable, Dimensions, StyleSheet} from 'react-native';

import {Avatar, Text} from '@gluestack-ui/themed';

import {config} from '@gluestack-ui/config';

import {
  NavigationContainer,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeView from './view/HomeView';
import PublikasiView from './view/PublikasiView';
import {iconNameTabs} from './utils/icons';
import {GluestackUIProvider, Icon} from '@gluestack-ui/themed';
import {colorPrimary, white} from './utils/color';
import {Info} from 'lucide-react-native';
import AboutView from './view/AboutView';
import PressReleaseView from './view/PressReleaseView';
import ChatView from './view/ChatView';
import {
  // clearMessages,
  // createLastUpdateTable,
  createMessagesHistoryTable,
  createVariablesTable,
  getDBConnection,
  // ifExistLastUpdateTable,
  // ifExistVariablesTable,
  updateDataSet,
} from './utils/llmChain';
import {ResultSet} from 'react-native-sqlite-storage';
import {Provider} from 'react-redux';
import store from './store';
// import { Image } from 'react-native-svg';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

interface tabBarIconProps {
  route: RouteProp<ParamListBase, string>;
  focused: boolean;
}

function TabBarIcon(props: tabBarIconProps) {
  let icon = iconNameTabs(props.route.name);
  let f = () => (props.focused ? colorPrimary : white);
  if (props.focused) {
    return (
      <Avatar size="sm" borderRadius="$sm" bgColor={white}>
        <Icon as={icon} size="md" color={f()} />
      </Avatar>
    );
  } else {
    return <Icon as={icon} size="md" color={f()} />;
  }
}

const TabScreens = (): React.JSX.Element => {
  const TabBarIconComponent = useCallback((props: tabBarIconProps) => {
    return <TabBarIcon route={props.route} focused={props.focused} />;
  }, []);
  // const HomeViewComponent = useCallback(() => <HomeView />, []);
  // const PublikasiViewComponent = useCallback(() => <PublikasiView />, []);
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused}) =>
          TabBarIconComponent({
            route: route,
            focused: focused,
          }),
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colorPrimary,
          paddingTop: 5,
          paddingBottom: 5,
        },
      })}>
      <Tab.Screen name="Home" component={HomeView} />
      <Tab.Screen name="Publikasi" component={PublikasiView} />
      <Tab.Screen name="PressRelease" component={PressReleaseView} />
      <Tab.Screen name="ChatAI" component={ChatView} />
    </Tab.Navigator>
  );
};

async function checkDB() {
  var db = await getDBConnection();
  try {
    await createMessagesHistoryTable(db);
    await createVariablesTable(db);
    // await clearMessages(db);
    // console.log(messages, 'mesages');
    // console.log(variables, 'variables');
    // await createLastUpdateTable(db);
    let var_dataset: [ResultSet] = await db.executeSql(
      'SELECT * FROM variables',
    );
    await updateDataSet(var_dataset[0]);
    await db.close();
  } catch (error) {
    console.log('cant open db', error);
    await db.close();
    return error;
  }
}

function App(): React.JSX.Element {
  useEffect(() => {
    checkDB();
  }, []);
  const HeaderTitleComponent = useCallback(() => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerWrapper}>
          <Image
            style={styles.imageHeader}
            source={require('./assets/ico_default.png')}
          />
          <Text color={white}>SI Leos Minut</Text>
        </View>
      </View>
    );
  }, []);
  const HeaderRightComponent = useCallback(
    (props: {navigation: any; route: any}) => {
      if (props.route.name === 'About') {
        return <></>;
      } else {
        return (
          <Pressable onPress={() => props.navigation.push('About')}>
            <Icon as={Info} color={white} size="lg" />
          </Pressable>
        );
      }
    },
    [],
  );
  return (
    <Provider store={store}>
      <GluestackUIProvider config={config}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={({navigation, route}) => ({
              headerTitle: () => HeaderTitleComponent(),
              headerStyle: {
                backgroundColor: colorPrimary,
              },
              headerBackButtonMenuEnabled: false,
              headerBackTitleVisible: false,
              headerRight: () => {
                return HeaderRightComponent({
                  navigation: navigation,
                  route: route,
                });
              },
              headerLeft: () => <></>,
            })}>
            <Stack.Screen name="Default" component={TabScreens} />
            <Stack.Screen name="About" component={AboutView} />
          </Stack.Navigator>
        </NavigationContainer>
      </GluestackUIProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  headerWrapper: {
    flexDirection: 'row',
  },
  imageHeader: {
    height: 24,
    width: 24,
    marginRight: 10,
  },
});

export default App;
