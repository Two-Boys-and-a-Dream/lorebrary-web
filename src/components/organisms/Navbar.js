import {
  Flex,
  IconButton,
  theme,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { ThemeButton } from '../atoms'
import LoreFormModal from './LoreFormModal'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { API } from '../../api'
import { AddIcon } from '@chakra-ui/icons'
import { buildInitialFormData } from '../../utils/utils'

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const queryClient = useQueryClient()

  /**
   * Mutation for lore form submission
   */
  const mutation = useMutation({
    mutationFn: async (newLore) => API.createLore(newLore),
    onError: (error) =>
      toast({
        title: 'Network error',
        description: error,
        status: 'error',
      }),
    onSuccess: async () => {
      toast({
        title: 'Success',
        description: 'Lore created!',
        status: 'success',
      })
      await queryClient.invalidateQueries({
        queryKey: ['lore'],
        exact: true,
      })
      onClose()
    },
  })

  const borderColor = useColorModeValue(
    theme.colors.gray[200],
    theme.colors.gray[500]
  )
  const bgColor = useColorModeValue(theme.colors.white, theme.colors.gray[800])
  const initialFormData = buildInitialFormData()

  return (
    <>
      <Flex
        p={theme.space[5]}
        borderBottom={theme.borders['1px']}
        borderBottomColor={borderColor}
        justify="flex-end"
        gap={theme.space[5]}
        position="sticky"
        bgColor={bgColor}
        zIndex={2}
        top={0}
      >
        <IconButton onClick={onOpen} icon={<AddIcon />} />
        <ThemeButton />
      </Flex>
      <LoreFormModal
        key={isOpen ? 'create-open' : 'create-closed'}
        initialFormData={initialFormData}
        mutation={mutation}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  )
}
