/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App, {providerTask} from './App';
import {name as appName} from './app.json';

// const providerTask = () => require('./SyncDBService.js');

AppRegistry.registerComponent(appName, () => App);
// AppRegistry.registerHeadlessTask('SyncDBService', providerTask);
// AppRegistry.registerHeadlessTask('SyncDBService', providerTask);
