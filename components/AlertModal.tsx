import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';

import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';

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
          <Text size={'sm'} className="mb-[10px]">
            {props.msg}
          </Text>
        </AlertDialogBody>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AlerModal;
