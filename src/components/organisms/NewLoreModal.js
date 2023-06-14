import { useState } from 'react'
import { AddIcon } from '@chakra-ui/icons'
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
    IconButton,
    Input,
    Flex,
    Textarea,
    useToast,
} from '@chakra-ui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API } from '../../api'

// Creates form data for each field
const fieldsArr = ['title', 'subtitle', 'game', 'text']
const initialFormData = fieldsArr.reduce(
    (o, key) => ({
        ...o,
        [key]: {
            name: key,
            value: '',
            error: false,
        },
    }),
    {}
)

function NewLoreModal() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [formData, setFormData] = useState(initialFormData)
    const toast = useToast({
        position: 'top',
        isClosable: true,
    })
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: (newLore) => API.createLore(newLore),
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
            handleClose()
        },
    })

    /**
     * Updates state value for specific field
     */
    function onChange(e) {
        const { value, name } = e.target

        setFormData({
            ...formData,
            [name]: {
                ...formData[name],
                value,
                error: validateString(value),
            },
        })
    }

    /**
     * Validates form,
     * then creates new lore.
     */
    function onSubmit() {
        // First validate form,
        // if invalid set error states for inputs and bail early.
        if (!validateForm()) {
            toast({
                title: 'Errors in form',
                description: 'Please fill out all fields.',
                status: 'error',
            })
            return
        }

        // Flatten the formData back into a simple object
        // with the relevant fields and hit mutation.
        const newLore = fieldsArr.reduce(
            (o, key) => ({
                ...o,
                [key]: formData[key].value,
            }),
            {}
        )
        mutation.mutate(newLore)
    }

    /**
     * Returns true for error, false otherwise
     * @returns {Boolean}
     */
    function validateString(value) {
        return !value
    }

    /**
     * Validates all formData. First implementation just checks
     * That each field has __something__ in the string.
     * @returns {Boolean}
     */
    function validateForm() {
        const clonedFormData = { ...formData }
        let valid = true

        // Check each object in formData to determine if any fields
        // are invalid.
        // eslint-disable-next-line no-unused-vars
        for (const [_key, v] of Object.entries(clonedFormData)) {
            // Check for validation error
            const isError = validateString(v.value)
            // Set error to boolean
            v.error = isError
            if (v.error) valid = false
        }

        // Update state formData, return out boolean
        setFormData(clonedFormData)
        return valid
    }

    /**
     * Resets form state, closes modal.
     */
    function handleClose() {
        setFormData(initialFormData)
        onClose()
    }

    return (
        <>
            <IconButton onClick={onOpen} icon={<AddIcon />}>
                Open Modal
            </IconButton>

            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                isCentered
                closeOnOverlayClick={false}
                size="2xl"
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>New Lore</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex direction="column" gap={5}>
                            <Text fontSize="lg">
                                Let&apos;s hear about that juicy new new
                            </Text>
                            {fieldsArr.map((field) => {
                                // Assign component depending on field.
                                // They all share same props anyways.
                                const Component =
                                    field === 'text' ? Textarea : Input
                                const label =
                                    field.charAt(0).toUpperCase() +
                                    field.slice(1)
                                return (
                                    <Flex key={field} direction="column">
                                        <Text mb={1}>{label}</Text>
                                        <Component
                                            name={field}
                                            value={formData[field].value}
                                            onChange={onChange}
                                            isInvalid={formData[field].error}
                                            variant="filled"
                                        />
                                    </Flex>
                                )
                            })}
                        </Flex>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="green"
                            onClick={onSubmit}
                            isLoading={mutation.isLoading}
                            loadingText="Creating"
                        >
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default NewLoreModal
