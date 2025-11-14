import { MenuOutlined } from '@ant-design/icons'
import { Dropdown, Button } from 'antd'
import type { MenuProps } from 'antd'
import DeleteLoreMenuItem from './DeleteLoreMenuItem'
import UpdateLoreMenuItem from './UpdateLoreMenuItem'

interface LoreMenuProps {
  _id?: string
}

/**
 * Hamburger menu on each LoreItem that gives
 * Update/Delete functionality
 */
function LoreMenu({ _id }: LoreMenuProps) {
  const items: MenuProps['items'] = [
    {
      key: 'update',
      label: <UpdateLoreMenuItem _id={_id} />,
    },
    {
      key: 'delete',
      label: <DeleteLoreMenuItem _id={_id} />,
    },
  ]

  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <Button icon={<MenuOutlined />} type="text" aria-label="Options" />
    </Dropdown>
  )
}

export default LoreMenu
