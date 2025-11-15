import { render, type RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App, ConfigProvider } from 'antd'
import { purpleTheme } from '../theme/theme'
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
      <ConfigProvider theme={purpleTheme}>
        <App>{ui}</App>
      </ConfigProvider>
    </QueryClientProvider>,
    options
  )
}

// Re-export everything from testing-library
export * from '@testing-library/react'
