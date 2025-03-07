/**
 * @format
 */
// import {DEFAULT_DOMAIN} from '@env';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {
  GEMINI_APP_KEY,
  BPS_API_KEY,
  API_VERSION,
  DEFAULT_DOMAIN,
  WA_NUMBER,
} from '@env';
export const geminiAppKey = GEMINI_APP_KEY;
export const bpsApiKey = BPS_API_KEY;
export const apiVersion = API_VERSION;
export const defaultDomain = DEFAULT_DOMAIN;
export const waNumber = WA_NUMBER;
console.log('default domain', defaultDomain);
// import {config} from 'dotenv';
// config();
// const providerTask = () => require('./SyncDBService.js');

AppRegistry.registerComponent(appName, () => App);
// AppRegistry.registerHeadlessTask('SyncDBService', providerTask);
// AppRegistry.registerHeadlessTask('SyncDBService', providerTask);
