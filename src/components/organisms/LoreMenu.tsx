import { MenuOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { App, Dropdown, Button, type MenuProps } from 'antd'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API, type Lore } from '../../api'
import LoreFormModal from './LoreFormModal'
import { AlertPopup } from '../molecules'
import { buildInitialFormData } from '../../utils/utils'

const items: MenuProps['items'] = [
  {
    key: 'update',
    label: 'Update',
    icon: <EditOutlined />,
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: <DeleteOutlined />,
  },
]

interface LoreMenuProps {
  _id?: string
}

/**
 * Hamburger menu on each LoreItem that gives
 * Update/Delete functionality
 */
function LoreMenu({ _id }: LoreMenuProps) {
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  const data = queryClient.getQueryData<Lore>(['lore', _id])

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (newLore: Lore) => API.updateLore(newLore),
    onError: (error) => {
      message.error(error.message)
    },
    onSuccess: async () => {
      message.success('Lore updated!')
      await queryClient.invalidateQueries({
        queryKey: ['lore'],
        exact: true,
      })
      setUpdateModalOpen(false)
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => API.deleteLore(_id!),
    onError: (error) => {
      message.error(error.message)
    },
    onSuccess: async () => {
      message.success('Lore deleted!')
      await queryClient.invalidateQueries({
        queryKey: ['lore'],
        exact: true,
      })
    },
    onSettled: () => {
      setDeleteModalOpen(false)
    },
  })

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'update') setUpdateModalOpen(true)
    else setDeleteModalOpen(true)
  }

  const existingData = buildInitialFormData(data)

  return (
    <>
      <Dropdown menu={{ items, onClick: handleMenuClick }} trigger={['click']}>
        <Button icon={<MenuOutlined />} type="text" aria-label="Options" />
      </Dropdown>
      <LoreFormModal
        key={updateModalOpen ? _id : 'closed'}
        _id={_id}
        initialFormData={existingData}
        mutation={updateMutation}
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
      />
      <AlertPopup
        headerText="Delete Lore"
        bodyText="Are you sure? You can't undo this action afterwards."
        actionText="Delete"
        onConfirm={deleteMutation.mutate}
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      />
    </>
  )
}

export default LoreMenu
