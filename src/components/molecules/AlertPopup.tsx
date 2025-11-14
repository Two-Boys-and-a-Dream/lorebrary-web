import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogFooter,
  Button,
} from '@chakra-ui/react'
import type { RefObject } from 'react'

interface AlertPopupProps {
  onConfirm: () => void
  isOpen: boolean
  onClose: () => void
  cancelRef: RefObject<HTMLButtonElement>
  headerText: string
  bodyText: string
  actionText?: string
}

/**
 * Styled Alert popup. Use `useDisclosure` in parent component
 * to manage the open/close state
 */
export default function AlertPopup({
  onConfirm,
  isOpen,
  onClose,
  cancelRef,
  headerText,
  bodyText,
  actionText = 'Delete',
}: AlertPopupProps) {
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {headerText}
          </AlertDialogHeader>

          <AlertDialogBody>{bodyText}</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={onConfirm} ml={3}>
              {actionText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
