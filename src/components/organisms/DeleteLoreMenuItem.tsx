import { DeleteOutlined } from '@ant-design/icons'
import { App as AntApp } from 'antd'
import { AlertPopup } from '../molecules'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API } from '../../api'
import { useState } from 'react'

interface DeleteLoreMenuItemProps {
  _id?: string
}

export default function DeleteLoreMenuItem({ _id }: DeleteLoreMenuItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { message } = AntApp.useApp()

  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)

  /**
   * Query/Mutation stuff
   */
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: () => API.deleteLore(_id!),
    onError: (error: unknown) => {
      message.error({
        content: typeof error === 'string' ? error : 'An error occurred',
        duration: 3,
      })
    },
    onSuccess: async () => {
      message.success({
        content: 'Lore deleted!',
        duration: 3,
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
        <DeleteOutlined />
        Delete
      </span>
      <AlertPopup
        headerText="Delete Lore"
        bodyText="Are you sure? You can't undo this action afterwards."
        actionText="Delete"
        onConfirm={mutation.mutate}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  )
}
