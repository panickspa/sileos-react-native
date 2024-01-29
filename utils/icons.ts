import { Book, Home } from 'lucide-react-native';

export function iconNameTabs(tabsName:String){
    return tabsName == 'Home' ? Home : tabsName == 'Publikasi' ? Book : 'Circle'
}