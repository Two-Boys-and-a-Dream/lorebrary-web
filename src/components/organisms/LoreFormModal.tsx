import { useState, type ChangeEvent } from 'react'
import { App, Button, Modal, Input, Flex, Typography } from 'antd'
import { loreFieldsArr } from '../../utils/constants'
import type { FormData } from '../../utils/utils'
import type { UseMutationResult } from '@tanstack/react-query'
import type { Lore, NewLore } from '../../types/data'

const { TextArea } = Input
const { Text } = Typography

interface LoreFormModalProps {
  isOpen: boolean
  onClose: () => void
  initialFormData: FormData
  mutation:
    | UseMutationResult<Lore, unknown, Lore, unknown>
    | UseMutationResult<Lore, unknown, NewLore, unknown>
  id?: string
  onOpen?: () => void
}

function LoreFormModal({
  isOpen,
  onClose,
  initialFormData,
  mutation,
  id,
}: LoreFormModalProps) {
  const [formData, setFormData] = useState(initialFormData)
  const { message } = App.useApp()

  /**
   * Updates state value for specific field
   */
  function onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { value, name } = e.target

    setFormData({
      ...formData,
      [name]: {
        ...formData[name],
        value,
        error: ['subtitle', 'game'].includes(name)
          ? false
          : validateString(value),
      },
    })
  }

  /**
   * Validates all formData. First implementation just checks
   * That each field has __something__ in the string.
   */
  function validateForm(): boolean {
    const clonedFormData = { ...formData }
    let valid = true

    // Check each object in formData to determine if any fields
    // are invalid.
    for (const v of Object.values(clonedFormData)) {
      // Check for validation error
      if (['subtitle', 'game'].includes(v.name)) continue // some can be empty
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
   * Validates form,
   * then creates new lore.
   */
  async function onSubmit() {
    // First validate form,
    // if invalid set error states for inputs and bail early.
    if (!validateForm()) {
      message.error('Please fill out all required fields.')
      return
    }

    // Flatten the formData back into a simple object
    // with the relevant fields and hit mutation.
    const newLore = loreFieldsArr.reduce(
      (o, key) => ({
        ...o,
        ...(id && { id }),
        [key]: formData[key].value,
      }),
      {} as Lore | NewLore
    )
    try {
      // Type assertion is safe here because we know the mutation type matches
      // whether we have an id (update) or not (create)
      await mutation.mutateAsync(newLore as never)
      // As long as the mutation succeeds, clear the form data
      setFormData(initialFormData)
    } catch {
      // Do nothing here, errors are handled in parent
    }
  }

  /**
   * Returns true for error, false otherwise
   */
  function validateString(value: string): boolean {
    return !value
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
      open={isOpen}
      onCancel={handleClose}
      centered
      maskClosable={false}
      width={800}
      title={`${id ? 'Update' : 'Create'} Lore`}
      destroyOnHidden
      footer={[
        <Button key="cancel" onClick={handleClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={onSubmit}
          loading={mutation.isPending}
        >
          {id ? 'Update' : 'Create'}
        </Button>,
      ]}
    >
      <Flex vertical gap={20}>
        <Text style={{ fontSize: '18px' }}>
          Let&apos;s hear about that juicy new new
        </Text>
        {loreFieldsArr.map((field) => {
          // Assign component depending on field.
          // They all share same props anyways.
          const Component = field === 'text' ? TextArea : Input
          const label = field.charAt(0).toUpperCase() + field.slice(1)
          return (
            <Flex key={field} vertical>
              <Text style={{ marginBottom: 4 }}>{label}</Text>
              <Component
                name={field}
                value={formData[field].value}
                onChange={onChange}
                placeholder={
                  ['subtitle', 'game'].includes(field)
                    ? '(Optional)'
                    : '(Required)'
                }
                status={formData[field].error ? 'error' : ''}
                rows={field === 'text' ? 4 : undefined}
              />
            </Flex>
          )
        })}
      </Flex>
    </Modal>
  )
}

export default LoreFormModal
