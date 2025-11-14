import { render, type RenderOptions, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '../theme'
import type { ReactElement } from 'react'

/**
 * Custom render function that wraps components with necessary providers
 * (QueryClient, ChakraProvider) for testing
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
      <ChakraProvider theme={theme}>{ui}</ChakraProvider>
    </QueryClientProvider>,
    options
  )
}

/**
 * Cleanup function to close all Chakra UI toasts between tests
 * Call this in afterEach to ensure toasts don't persist between tests
 */
export const cleanupToasts = () => {
  act(() => {
    // Close all Chakra UI toasts by clicking their close buttons
    const closeButtons = document.querySelectorAll(
      '[aria-label="Close"], .chakra-toast__close-button'
    )
    closeButtons.forEach((button) => {
      if (button instanceof HTMLElement) {
        button.click()
      }
    })

    // Also remove any toast containers from the DOM
    const toastContainers = document.querySelectorAll(
      '.chakra-toast__container'
    )
    toastContainers.forEach((container) => {
      container.remove()
    })
  })
}

// Re-export everything from testing-library
export * from '@testing-library/react'
