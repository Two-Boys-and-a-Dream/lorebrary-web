import React from 'react'
import { DeleteIcon, EditIcon, HamburgerIcon } from '@chakra-ui/icons'
import {
    Menu,
    MenuButton,
    IconButton,
    MenuList,
    MenuItem,
    useDisclosure,
    useToast,
} from '@chakra-ui/react'
import { AlertPopup } from '../molecules'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API } from '../../api'

function LoreMenu({ _id }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()
    const toast = useToast({
        position: 'top',
        isClosable: true,
    })
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: () => API.deleteLore(_id),
        onError: (error) => {
            toast({
                title: 'Network error',
                description: error,
                status: 'error',
            })
            onClose()
        },
        onSuccess: async () => {
            toast({
                title: 'Success',
                description: 'Lore deleted!',
                status: 'success',
            })
            await queryClient.invalidateQueries({
                queryKey: ['lore'],
                exact: true,
            })
            onClose()
        },
    })

    return (
        <>
            <Menu>
                <MenuButton
                    as={IconButton}
                    icon={<HamburgerIcon />}
                    aria-label="Options"
                    variant="ghost"
                />
                <MenuList>
                    <MenuItem
                        icon={<EditIcon />}
                        onClick={() => console.log('update pressed')}
                    >
                        Update
                    </MenuItem>
                    <MenuItem icon={<DeleteIcon />} onClick={onOpen}>
                        Delete
                    </MenuItem>
                </MenuList>
            </Menu>
            <AlertPopup
                headerText="Delete Lore"
                bodyText="Are you sure? You can't undo this action afterwards."
                onConfirm={mutation.mutate}
                isOpen={isOpen}
                onClose={onClose}
                cancelRef={cancelRef}
            />
        </>
    )
}

export default LoreMenu
