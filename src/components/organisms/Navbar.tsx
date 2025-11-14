import { Flex, Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ThemeButton } from '../atoms'
import LoreFormModal from './LoreFormModal'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { API, type NewLore } from '../../api'
import { buildInitialFormData } from '../../utils/utils'
import { useState } from 'react'

interface NavbarProps {
  darkMode: boolean
  // eslint-disable-next-line no-unused-vars
  setDarkMode: (darkMode: boolean) => void
}

export default function Navbar({ darkMode, setDarkMode }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)

  /**
   * Mutation for lore form submission
   */
  const mutation = useMutation({
    mutationFn: async (newLore: NewLore) => API.createLore(newLore),
    onError: (error: unknown) => {
      message.error(typeof error === 'string' ? error : 'An error occurred')
    },
    onSuccess: async () => {
      message.success('Lore created!')
      await queryClient.invalidateQueries({
        queryKey: ['lore'],
        exact: true,
      })
      onClose()
    },
  })

  const initialFormData = buildInitialFormData()

  return (
    <>
      <Flex
        style={{
          padding: '20px',
          borderBottom: '1px solid rgba(128, 128, 128, 0.3)',
          justifyContent: 'flex-end',
          gap: '20px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backgroundColor: darkMode ? '#141414' : '#ffffff',
        }}
      >
        <Button
          onClick={onOpen}
          icon={<PlusOutlined />}
          aria-label="Add lore"
        />
        <ThemeButton
          darkMode={darkMode}
          toggleTheme={() => setDarkMode(!darkMode)}
        />
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
