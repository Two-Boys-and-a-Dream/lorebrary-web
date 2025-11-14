import { Modal, Button } from 'antd'

interface AlertPopupProps {
  onConfirm: () => void
  isOpen: boolean
  onClose: () => void
  headerText: string
  bodyText: string
  actionText: string
}

/**
 * Styled Alert popup. Use useState in parent component
 * to manage the open/close state
 */
export default function AlertPopup({
  onConfirm,
  isOpen,
  onClose,
  headerText,
  bodyText,
  actionText,
}: AlertPopupProps) {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      title={headerText}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="confirm" danger type="primary" onClick={onConfirm}>
          {actionText}
        </Button>,
      ]}
    >
      {bodyText}
    </Modal>
  )
}
