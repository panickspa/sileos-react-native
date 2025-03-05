/**
 * @format
 */
// import {DEFAULT_DOMAIN} from '@env';
import {AppRegistry} from 'react-native';
import App, {providerTask} from './App';
import {name as appName} from './app.json';
import Config from 'react-native-config';
console.log('default domain', process);
// import {config} from 'dotenv';
// config();
// const providerTask = () => require('./SyncDBService.js');

AppRegistry.registerComponent(appName, () => App);
// AppRegistry.registerHeadlessTask('SyncDBService', providerTask);
// AppRegistry.registerHeadlessTask('SyncDBService', providerTask);
