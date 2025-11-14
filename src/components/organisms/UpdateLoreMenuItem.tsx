import { MenuItem, useDisclosure, useToast } from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API, type Lore } from '../../api'
import LoreFormModal from './LoreFormModal'
import { buildInitialFormData } from '../../utils/utils'

interface UpdateLoreMenuItemProps {
  _id?: string
}

export default function UpdateLoreMenuItem({ _id }: UpdateLoreMenuItemProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const queryClient = useQueryClient()
  const data = queryClient.getQueryData<Lore>(['lore', _id])

  /**
   * Query/Mutation stuff
   */
  const toast = useToast()
  const mutation = useMutation({
    mutationFn: async (newLore: Lore) => API.updateLore(newLore),
    onError: (error: unknown) =>
      toast({
        title: 'Network error',
        description: typeof error === 'string' ? error : 'An error occurred',
        status: 'error',
      }),
    onSuccess: async () => {
      toast({
        title: 'Success',
        description: 'Lore updated!',
        status: 'success',
      })
      await queryClient.invalidateQueries({
        queryKey: ['lore', _id],
        exact: true,
      })
      onClose()
    },
  })

  const existingData = buildInitialFormData(data)

  return (
    <>
      <MenuItem icon={<EditIcon />} onClick={onOpen}>
        Update
      </MenuItem>
      <LoreFormModal
        key={isOpen ? _id : 'closed'}
        _id={_id}
        initialFormData={existingData}
        mutation={mutation}
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
      />
    </>
  )
}
