import { render, type RenderOptions, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider, App as AntApp } from 'antd'
import { theme } from '../theme'
import type { ReactElement } from 'react'

/**
 * Custom render function that wraps components with necessary providers
 * (QueryClient, ConfigProvider, App) for testing
 */
export const renderWithProviders = (
  ui: ReactElement,
  options?: RenderOptions
) => {
  // Create a new QueryClient for each render to ensure test isolation
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries in tests for faster failures
      },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={theme}>
        <AntApp>{ui}</AntApp>
      </ConfigProvider>
    </QueryClientProvider>,
    options
  )
}

/**
 * Cleanup function to close all Ant Design toasts and modals between tests
 * Call this in afterEach to ensure UI elements don't persist between tests
 */
export const cleanupToasts = () => {
  act(() => {
    try {
      // Close all modal close buttons
      const modalCloseButtons = document.querySelectorAll(
        '.ant-modal-close, .ant-modal-close-x'
      )
      modalCloseButtons.forEach((button) => {
        if (button instanceof HTMLElement) {
          button.click()
        }
      })

      // Remove all Ant Design message/notification elements from the DOM
      const messages = document.querySelectorAll(
        '.ant-message, .ant-notification, [role="alert"]'
      )
      messages.forEach((message) => {
        try {
          if (message.parentNode) {
            message.parentNode.removeChild(message)
          }
        } catch {
          // Ignore removal errors
        }
      })

      // Also remove any message/notification containers from the DOM
      const containers = document.querySelectorAll(
        '.ant-message-notice, .ant-notification-notice'
      )
      containers.forEach((container) => {
        try {
          if (container.parentNode) {
            container.parentNode.removeChild(container)
          }
        } catch {
          // Ignore removal errors
        }
      })
    } catch {
      // Ignore any cleanup errors
    }
  })
}

// Re-export everything from testing-library
export * from '@testing-library/react'
