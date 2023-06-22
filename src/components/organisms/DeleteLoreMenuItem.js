import React from 'react'
import { MenuItem, useDisclosure, useToast } from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import { AlertPopup } from '../molecules'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API } from '../../api'

export default function DeleteLoreMenuItem({ _id }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()

    /**
     * Query/Mutation stuff
     */
    const toast = useToast()
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: () => API.deleteLore(_id),
        onError: (error) => {
            toast({
                title: 'Network error',
                description: error,
                status: 'error',
            })
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
        },
        onSettled: () => {
            onClose()
        },
    })

    return (
        <>
            <MenuItem icon={<DeleteIcon />} onClick={onOpen}>
                Delete
            </MenuItem>
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
