import { useState } from 'react'
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
  Input,
  Flex,
  Textarea,
  useToast,
} from '@chakra-ui/react'
import { loreFieldsArr } from '../../utils/constants'

function LoreFormModal({ isOpen, onClose, initialFormData, mutation, _id }) {
  const [formData, setFormData] = useState(initialFormData)
  const toast = useToast()

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
  async function onSubmit() {
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
    const newLore = loreFieldsArr.reduce(
      (o, key) => ({
        ...o,
        _id,
        [key]: formData[key].value,
      }),
      {}
    )
    try {
      await mutation.mutateAsync(newLore)
      // As long as the mutation succeeds, clear the form data
      setFormData(initialFormData)
    } catch (_error) {
      // Do nothing here, errors are handled in parent
    }
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
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      isCentered
      closeOnOverlayClick={false}
      size="2xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{_id ? 'Update' : 'Create'} Lore</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" gap={5}>
            <Text fontSize="lg">Let&apos;s hear about that juicy new new</Text>
            {loreFieldsArr.map((field) => {
              // Assign component depending on field.
              // They all share same props anyways.
              const Component = field === 'text' ? Textarea : Input
              const label = field.charAt(0).toUpperCase() + field.slice(1)
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
            loadingText={_id ? 'Updating' : 'Creating'}
          >
            {_id ? 'Update' : 'Create'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default LoreFormModal
