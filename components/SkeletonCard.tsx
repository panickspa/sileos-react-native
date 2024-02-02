import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  Box,
  ScrollView,
  View,
} from '@gluestack-ui/themed';
import {Dimensions} from 'react-native';

const backgroundColor = '#B0B0B0';

export function IndicatorSkeleton() {
  return (
    <Accordion type="multiple">
      <AccordionItem
        value={'skeleton-1'}
        marginBottom={3}
        backgroundColor={backgroundColor}>
        <AccordionHeader>
          <Box height={65} width={Dimensions.get('window').width - 10} />
        </AccordionHeader>
      </AccordionItem>
      <AccordionItem
        marginBottom={3}
        value={'skeleton-2'}
        backgroundColor={backgroundColor}>
        <AccordionHeader>
          <Box height={65} width={Dimensions.get('window').width - 10} />
        </AccordionHeader>
      </AccordionItem>
      <AccordionItem
        marginBottom={3}
        value={'skeleton-3'}
        backgroundColor={backgroundColor}>
        <AccordionHeader>
          <Box height={65} width={Dimensions.get('window').width - 10} />
        </AccordionHeader>
      </AccordionItem>
      <AccordionItem
        marginBottom={3}
        value={'skeleton-4'}
        backgroundColor={backgroundColor}>
        <AccordionHeader>
          <Box height={65} width={Dimensions.get('window').width - 10} />
        </AccordionHeader>
      </AccordionItem>
      <AccordionItem
        marginBottom={3}
        value={'skeleton-11'}
        backgroundColor={backgroundColor}>
        <AccordionHeader>
          <Box height={65} width={Dimensions.get('window').width - 10} />
        </AccordionHeader>
      </AccordionItem>
      <AccordionItem
        marginBottom={3}
        value={'skeleton-5'}
        backgroundColor={backgroundColor}>
        <AccordionHeader>
          <Box height={65} width={Dimensions.get('window').width - 10} />
        </AccordionHeader>
      </AccordionItem>
      <AccordionItem
        marginBottom={3}
        value={'skeleton-6'}
        backgroundColor={backgroundColor}>
        <AccordionHeader>
          <Box height={65} width={Dimensions.get('window').width - 10} />
        </AccordionHeader>
      </AccordionItem>
      <AccordionItem
        marginBottom={3}
        value={'skeleton-7'}
        backgroundColor={backgroundColor}>
        <AccordionHeader>
          <Box height={65} width={Dimensions.get('window').width - 10} />
        </AccordionHeader>
      </AccordionItem>
      <AccordionItem
        marginBottom={3}
        value={'skeleton-8'}
        backgroundColor={backgroundColor}>
        <AccordionHeader>
          <Box height={65} width={Dimensions.get('window').width - 10} />
        </AccordionHeader>
      </AccordionItem>
    </Accordion>
  );
}
export function PressReleaseSkeleton() {
  return (
    <View flex={1} width={Dimensions.get('window').width} padding={5}>
      <Box
        borderRadius={'$xl'}
        backgroundColor={backgroundColor}
        margin={5}
        padding={3}
        width={Dimensions.get('window').width - 15}
        height={65}
      />
      <Box
        borderRadius={'$xl'}
        backgroundColor={backgroundColor}
        margin={5}
        padding={3}
        width={Dimensions.get('window').width - 15}
        height={65}
      />
      <Box
        borderRadius={'$xl'}
        backgroundColor={backgroundColor}
        margin={5}
        padding={3}
        width={Dimensions.get('window').width - 15}
        height={65}
      />
      <Box
        borderRadius={'$xl'}
        backgroundColor={backgroundColor}
        margin={5}
        padding={3}
        width={Dimensions.get('window').width - 15}
        height={65}
      />
      <Box
        borderRadius={'$xl'}
        backgroundColor={backgroundColor}
        margin={5}
        padding={3}
        width={Dimensions.get('window').width - 15}
        height={65}
      />
      <Box
        borderRadius={'$xl'}
        backgroundColor={backgroundColor}
        margin={5}
        padding={3}
        width={Dimensions.get('window').width - 15}
        height={65}
      />
      <Box
        borderRadius={'$xl'}
        backgroundColor={backgroundColor}
        margin={5}
        padding={3}
        width={Dimensions.get('window').width - 15}
        height={65}
      />
      <Box
        borderRadius={'$xl'}
        backgroundColor={backgroundColor}
        margin={5}
        padding={3}
        width={Dimensions.get('window').width - 15}
        height={65}
      />
      <Box
        borderRadius={'$xl'}
        backgroundColor={backgroundColor}
        margin={5}
        padding={3}
        width={Dimensions.get('window').width - 15}
        height={65}
      />
      <Box
        borderRadius={'$xl'}
        backgroundColor={backgroundColor}
        margin={5}
        padding={3}
        width={Dimensions.get('window').width - 15}
        height={65}
      />
    </View>
  );
}

export function PublikasiSkeleton() {
  return (
    <ScrollView
      scrollEnabled={false}
      width={Dimensions.get('window').width}
      height={Dimensions.get('window').height}>
      <View flexDirection="row">
        <Box
          backgroundColor={backgroundColor}
          margin={5}
          padding={3}
          width={Dimensions.get('screen').width / 2 - 10}
          height={300}
        />
        <Box
          backgroundColor={backgroundColor}
          margin={5}
          padding={3}
          width={Dimensions.get('screen').width / 2 - 10}
          height={300}
        />
      </View>
      <View flexDirection="row">
        <Box
          backgroundColor={backgroundColor}
          margin={5}
          padding={3}
          width={Dimensions.get('screen').width / 2 - 10}
          height={300}
        />
        <Box
          backgroundColor={backgroundColor}
          margin={5}
          padding={3}
          width={Dimensions.get('screen').width / 2 - 10}
          height={300}
        />
      </View>
      <View flexDirection="row">
        <Box
          backgroundColor={backgroundColor}
          margin={5}
          padding={3}
          width={Dimensions.get('screen').width / 2 - 10}
          height={300}
        />
        <Box
          backgroundColor={backgroundColor}
          margin={5}
          padding={3}
          width={Dimensions.get('screen').width / 2 - 10}
          height={300}
        />
      </View>
    </ScrollView>
  );
}
