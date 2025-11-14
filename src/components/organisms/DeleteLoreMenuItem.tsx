import { MenuItem, useDisclosure, useToast } from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import { AlertPopup } from '../molecules'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API } from '../../api'

interface DeleteLoreMenuItemProps {
  _id?: string
}

export default function DeleteLoreMenuItem({ _id }: DeleteLoreMenuItemProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  /**
   * Query/Mutation stuff
   */
  const toast = useToast()
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: () => API.deleteLore(_id!),
    onError: (error: unknown) => {
      toast({
        title: 'Network error',
        description: typeof error === 'string' ? error : 'An error occurred',
        status: 'error',
      })
    },
    onSuccess: async () => {
      toast({
        title: 'Success',
        description: 'Lore deleted!',
        status: 'success',
      })
      await queryClient.invalidateQueries({
        queryKey: ['lore'],
        exact: true,
      })
    },
    onSettled: () => {
      onClose()
    },
  })

  return (
    <>
      <MenuItem icon={<DeleteIcon />} onClick={onOpen}>
        Delete
      </MenuItem>
      <AlertPopup
        headerText="Delete Lore"
        bodyText="Are you sure? You can't undo this action afterwards."
        onConfirm={mutation.mutate}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  )
}
