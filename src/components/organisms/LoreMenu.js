import { HamburgerIcon } from '@chakra-ui/icons'
import { Menu, MenuButton, IconButton, MenuList } from '@chakra-ui/react'
import DeleteLoreMenuItem from './DeleteLoreMenuItem'
import UpdateLoreMenuItem from './UpdateLoreMenuItem'

/**
 * Hamburger menu on each LoreItem that gives
 * Update/Delete functionality
 */
function LoreMenu({ _id }) {
    return (
        <Menu>
            <MenuButton
                as={IconButton}
                icon={<HamburgerIcon />}
                aria-label="Options"
                variant="ghost"
            />
            <MenuList>
                <UpdateLoreMenuItem _id={_id} />
                <DeleteLoreMenuItem _id={_id} />
            </MenuList>
        </Menu>
    )
}

export default LoreMenu
