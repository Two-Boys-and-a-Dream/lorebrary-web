import { MenuItem, useDisclosure, useToast } from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { API, Lore } from '../../api'
import LoreFormModal from './LoreFormModal'
import { buildInitialFormData } from '../../utils/utils'

interface UpdateLoreMenuItemProps {
  _id?: string
}

export default function UpdateLoreMenuItem({ _id }: UpdateLoreMenuItemProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data } = useQuery({
    queryKey: ['lore', _id],
    queryFn: () => API.getLoreById(_id!),
    enabled: Boolean(_id),
  })

  /**
   * Query/Mutation stuff
   */
  const toast = useToast()
  const queryClient = useQueryClient()
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
