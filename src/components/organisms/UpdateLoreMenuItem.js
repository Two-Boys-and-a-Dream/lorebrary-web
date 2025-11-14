import { MenuItem, useDisclosure, useToast } from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { API } from '../../api'
import LoreFormModal from './LoreFormModal'
import { buildInitialFormData } from '../../utils/utils'

export default function UpdateLoreMenuItem({ _id }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data } = useQuery({
    queryKey: ['lore', _id],
    queryFn: () => API.getLoreById(_id),
    enabled: Boolean(_id),
  })

  /**
   * Query/Mutation stuff
   */
  const toast = useToast()
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async (newLore) => API.updateLore(newLore),
    onError: (error) =>
      toast({
        title: 'Network error',
        description: error,
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
