import { EditOutlined } from '@ant-design/icons'
import { message } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API, type Lore } from '../../api'
import LoreFormModal from './LoreFormModal'
import { buildInitialFormData } from '../../utils/utils'
import { useState } from 'react'

interface UpdateLoreMenuItemProps {
  _id?: string
}

export default function UpdateLoreMenuItem({ _id }: UpdateLoreMenuItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const data = queryClient.getQueryData<Lore>(['lore', _id])

  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)

  /**
   * Query/Mutation stuff
   */
  const mutation = useMutation({
    mutationFn: async (newLore: Lore) => API.updateLore(newLore),
    onError: (error: unknown) => {
      message.error(typeof error === 'string' ? error : 'An error occurred')
    },
    onSuccess: async () => {
      message.success('Lore updated!')
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
      <span
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onOpen()
          }
        }}
        role="button"
        tabIndex={0}
        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <EditOutlined />
        Update
      </span>
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
