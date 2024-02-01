import {Book, Home, Rss, Circle} from 'lucide-react-native';

export function iconNameTabs(tabsName: String) {
  return tabsName == 'Home'
    ? Home
    : tabsName == 'Publikasi'
    ? Book
    : tabsName == 'PressRelease'
    ? Rss
    : Circle;
}
