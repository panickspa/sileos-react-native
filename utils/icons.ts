/* eslint-disable eqeqeq */
import {Book, Home, Rss, Circle, MessageSquare} from 'lucide-react-native';

export function iconNameTabs(tabsName: String) {
  return tabsName == 'Home'
    ? Home
    : tabsName == 'Publikasi'
    ? Book
    : tabsName == 'PressRelease'
    ? Rss
    : tabsName == 'ChatAI'
    ? MessageSquare
    : Circle;
}
