import {Icon} from '@/components/ui/icon';
import {Text} from '@/components/ui/text';
import {Avatar} from '@/components/ui/avatar';
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback} from 'react';
import './global.css';
import {GluestackUIProvider} from './components/ui/gluestack-ui-provider';
import {View, Image, Pressable, StyleSheet} from 'react-native';
import 'react-native-gesture-handler';

// import {config} from '@gluestack-ui/config';

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
import {colorPrimary, white} from './utils/color';
import {Info} from 'lucide-react-native';
import AboutView from './view/AboutView';
import PressReleaseView from './view/PressReleaseView';
// import ChatView from './view/ChatView';
// import {
//   // clearMessages,
//   // createLastUpdateTable,
//   createMessagesHistoryTable,
//   getDBConnection,
//   getDBReadOnlyConnection,
// } from './utils/llmChain';
import {Provider} from 'react-redux';
import store from './store';
import '@/global.css';
// import { Image } from 'react-native-svg';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

interface tabBarIconProps {
  route: RouteProp<ParamListBase, string>;
  focused: boolean;
}

function TabBarIcon(props: tabBarIconProps) {
  let icon = iconNameTabs(props.route.name);
  let f = () => (props.focused ? 'primary-0' : 'secondary-0');
  if (props.focused) {
    return (
      <Avatar size="sm" className={' bg-secondary-0 rounded-sm '}>
        <Icon as={icon} size="md" className={` color-${f()} `} />
      </Avatar>
    );
  } else {
    return <Icon as={icon} size="md" className={` color-${f()} `} />;
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
          alignItems:  'center',
          justifyContent: 'center',
        },
      })}>
      <Tab.Screen name="Home" component={HomeView} />
      <Tab.Screen name="Publikasi" component={PublikasiView} />
      <Tab.Screen name="PressRelease" component={PressReleaseView} />
    </Tab.Navigator>
  );
};

// export async function checkDB() {
//   var db = await getDBConnection();
//   var dbRead = await getDBReadOnlyConnection();
//   try {
//     // db = await getDBConnection();
//     if (db) {
//       if (dbRead) {
//         await createMessagesHistoryTable(db);
//       }
//     }
//   } catch (error) {
//     console.log('cant open db', error);
//   } finally {
//   }
// }

export class AppClass extends React.Component {
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = {
      events: [],
    };
  }
  componentDidMount() {}

  async initBackgroundDatabaseUpdate() {}

  HeaderTitleComponent() {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerWrapper}>
          <Image
            style={styles.imageHeader}
            source={require('./assets/ico_default.png')}
          />
          <Text className={' color-secondary-0 '}>SI Leos Minut</Text>
        </View>
      </View>
    );
  }

  HeaderRightComponent(props: {navigation: any; route: any}) {
    if (props.route.name === 'About') {
      return <></>;
    } else {
      return (
        <Pressable onPress={() => props.navigation.push('About')}>
          <Icon as={Info} size="lg" className={'color-secondary-0'} />
        </Pressable>
      );
    }
  }
  render(): React.ReactNode {
    return (
      <Provider store={store}>
        <GluestackUIProvider mode="light">
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={({navigation, route}) => ({
                headerTitle: () => this.HeaderTitleComponent(),
                headerStyle: {
                  backgroundColor: colorPrimary,
                },
                headerBackButtonMenuEnabled: false,
                headerBackTitleVisible: false,
                headerRight: () => {
                  return this.HeaderRightComponent({
                    navigation: navigation,
                    route: route,
                  });
                },
                // eslint-disable-next-line react/no-unstable-nested-components
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
}

function App(): React.JSX.Element {
  const HeaderTitleComponent = useCallback(() => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerWrapper}>
          <Image
            style={styles.imageHeader}
            source={require('./assets/ico_default.png')}
          />
          <Text className={'color-secondary-0'}>SI Leos Minut</Text>
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
            <Icon as={Info} size="lg" className={' color-secondary-0 '} />
          </Pressable>
        );
      }
    },
    [],
  );
  return (
    <Provider store={store}>
      <GluestackUIProvider mode="light">
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={({navigation, route}) => ({
              headerTitle: () => HeaderTitleComponent(),
              headerStyle: {
                backgroundColor: colorPrimary,
                color: white,
              },
              headerTitleStyle:{
                color: white,
              },
              headerBackButtonMenuEnabled: false,
              headerBackTitleVisible: false,
              headerRight: () => {
                return HeaderRightComponent({
                  navigation: navigation,
                  route: route,
                });
              },
              // eslint-disable-next-line react/no-unstable-nested-components
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

// const task: Task = async function (taskData) {
//   console.log('Headless Sync DB Running', taskData);
//   let db_ = await getDBConnection();
//   let dbRead_ = await getDBReadOnlyConnection();
//   if (db_) {
//     if (dbRead_) {
//       await createMessagesHistoryTable(db_);
//       await createVariablesTable(db_);
//       await createLastUpdateTable(db_);
//       let var_dataset: [ResultSet] = await dbRead_.executeSql(
//         'SELECT * FROM variables_76',
//       );
//       console.log(var_dataset[0].rows.raw());
//       await updateDataSet(var_dataset[0], db_, dbRead_);
//     }
//   }
//   // updateDataSet()
// };
// export const providerTask: TaskProvider = () => task;

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
