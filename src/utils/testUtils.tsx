import { render, type RenderOptions } from '@testing-library/react'
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

// Re-export everything from testing-library
export * from '@testing-library/react'
