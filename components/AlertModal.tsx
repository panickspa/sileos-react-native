import {
  AlertDialogBody,
  AlertDialogContent,
  Heading,
} from '@gluestack-ui/themed';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogHeader,
  Text,
} from '@gluestack-ui/themed';

interface AlertProps {
  showModal: boolean;
  onClose: Function;
  headerMsg: string;
  msg: string;
}

export function AlerModal(props: AlertProps) {
  return (
    <AlertDialog onClose={() => props.onClose()} isOpen={props.showModal}>
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Heading>{props.headerMsg}</Heading>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text size={'sm'} marginBottom={10}>
            {props.msg}
          </Text>
        </AlertDialogBody>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AlerModal;
