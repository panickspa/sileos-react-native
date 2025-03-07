import { View } from '@/components/ui/view';
import { ScrollView } from '@/components/ui/scroll-view';
import { Box } from '@/components/ui/box';
import { Accordion, AccordionHeader, AccordionItem } from '@/components/ui/accordion';
import {Dimensions} from 'react-native';

const backgroundColor = '#B0B0B0';

export function IndicatorSkeleton() {
  return (
    <Accordion type="multiple">
      <AccordionItem
        value={'skeleton-1'}
        className={` backgroundColor-${backgroundColor} mb-[3px] `}>
        <AccordionHeader>
          <Box className={` width-${Dimensions.get('window').width - 10} h-[65px] `} />
        </AccordionHeader>
      </AccordionItem>
      <AccordionItem
        value={'skeleton-2'}
        className={` backgroundColor-${backgroundColor} mb-[3px] `}>
        <AccordionHeader>
          <Box className={` width-${Dimensions.get('window').width - 10} h-[65px] `} />
        </AccordionHeader>
      </AccordionItem>
      <AccordionItem
        value={'skeleton-3'}
        className={` backgroundColor-${backgroundColor} mb-[3px] `}>
        <AccordionHeader>
          <Box className={` width-${Dimensions.get('window').width - 10} h-[65px] `} />
        </AccordionHeader>
      </AccordionItem>
      <AccordionItem
        value={'skeleton-4'}
        className={` backgroundColor-${backgroundColor} mb-[3px] `}>
        <AccordionHeader>
          <Box className={` width-${Dimensions.get('window').width - 10} h-[65px] `} />
        </AccordionHeader>
      </AccordionItem>
      <AccordionItem
        value={'skeleton-11'}
        className={` backgroundColor-${backgroundColor} mb-[3px] `}>
        <AccordionHeader>
          <Box className={` width-${Dimensions.get('window').width - 10} h-[65px] `} />
        </AccordionHeader>
      </AccordionItem>
      <AccordionItem
        value={'skeleton-5'}
        className={` backgroundColor-${backgroundColor} mb-[3px] `}>
        <AccordionHeader>
          <Box className={` width-${Dimensions.get('window').width - 10} h-[65px] `} />
        </AccordionHeader>
      </AccordionItem>
      <AccordionItem
        value={'skeleton-6'}
        className={` backgroundColor-${backgroundColor} mb-[3px] `}>
        <AccordionHeader>
          <Box className={` width-${Dimensions.get('window').width - 10} h-[65px] `} />
        </AccordionHeader>
      </AccordionItem>
      <AccordionItem
        value={'skeleton-7'}
        className={` backgroundColor-${backgroundColor} mb-[3px] `}>
        <AccordionHeader>
          <Box className={` width-${Dimensions.get('window').width - 10} h-[65px] `} />
        </AccordionHeader>
      </AccordionItem>
      <AccordionItem
        value={'skeleton-8'}
        className={` backgroundColor-${backgroundColor} mb-[3px] `}>
        <AccordionHeader>
          <Box className={` width-${Dimensions.get('window').width - 10} h-[65px] `} />
        </AccordionHeader>
      </AccordionItem>
    </Accordion>
  );
}
export function PressReleaseSkeleton() {
  return (
    <View className={` width-${Dimensions.get('window').width} flex-1 p-[5px] `}>
      <Box
        className={` width-${Dimensions.get('window').width - 15} backgroundColor-${backgroundColor} rounded-xl m-[5px] p-[3px] h-[65px] `} />
      <Box
        className={` width-${Dimensions.get('window').width - 15} backgroundColor-${backgroundColor} rounded-xl m-[5px] p-[3px] h-[65px] `} />
      <Box
        className={` width-${Dimensions.get('window').width - 15} backgroundColor-${backgroundColor} rounded-xl m-[5px] p-[3px] h-[65px] `} />
      <Box
        className={` width-${Dimensions.get('window').width - 15} backgroundColor-${backgroundColor} rounded-xl m-[5px] p-[3px] h-[65px] `} />
      <Box
        className={` width-${Dimensions.get('window').width - 15} backgroundColor-${backgroundColor} rounded-xl m-[5px] p-[3px] h-[65px] `} />
      <Box
        className={` width-${Dimensions.get('window').width - 15} backgroundColor-${backgroundColor} rounded-xl m-[5px] p-[3px] h-[65px] `} />
      <Box
        className={` width-${Dimensions.get('window').width - 15} backgroundColor-${backgroundColor} rounded-xl m-[5px] p-[3px] h-[65px] `} />
      <Box
        className={` width-${Dimensions.get('window').width - 15} backgroundColor-${backgroundColor} rounded-xl m-[5px] p-[3px] h-[65px] `} />
      <Box
        className={` width-${Dimensions.get('window').width - 15} backgroundColor-${backgroundColor} rounded-xl m-[5px] p-[3px] h-[65px] `} />
      <Box
        className={` width-${Dimensions.get('window').width - 15} backgroundColor-${backgroundColor} rounded-xl m-[5px] p-[3px] h-[65px] `} />
    </View>
  );
}

export function PublikasiSkeleton() {
  return (
    <ScrollView
      scrollEnabled={false}
      className={` height-${Dimensions.get('window').height} width-${Dimensions.get('window').width} `}>
      <View className="flex-row">
        <Box
          className={` width-${Dimensions.get('screen').width / 2 - 10} backgroundColor-${backgroundColor} m-[5px] p-[3px] h-[300px] `} />
        <Box
          className={` width-${Dimensions.get('screen').width / 2 - 10} backgroundColor-${backgroundColor} m-[5px] p-[3px] h-[300px] `} />
      </View>
      <View className="flex-row">
        <Box
          className={` width-${Dimensions.get('screen').width / 2 - 10} backgroundColor-${backgroundColor} m-[5px] p-[3px] h-[300px] `} />
        <Box
          className={` width-${Dimensions.get('screen').width / 2 - 10} backgroundColor-${backgroundColor} m-[5px] p-[3px] h-[300px] `} />
      </View>
      <View className="flex-row">
        <Box
          className={` width-${Dimensions.get('screen').width / 2 - 10} backgroundColor-${backgroundColor} m-[5px] p-[3px] h-[300px] `} />
        <Box
          className={` width-${Dimensions.get('screen').width / 2 - 10} backgroundColor-${backgroundColor} m-[5px] p-[3px] h-[300px] `} />
      </View>
    </ScrollView>
  );
}
