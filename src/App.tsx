import './App.module.css'
import { ConfigProvider, theme as antdTheme } from 'antd'
import { HomePage } from './components/pages'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { purpleTheme } from './theme/theme'
import { MainLayout } from './components/layouts'
import { useState } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Disable retries for faster error handling in tests
    },
  },
})

export function App() {
  const [darkMode, setDarkMode] = useState(true)

  return (
    <ConfigProvider
      theme={{
        ...purpleTheme,
        algorithm: darkMode
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <MainLayout darkMode={darkMode} setDarkMode={setDarkMode}>
          <HomePage />
        </MainLayout>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ConfigProvider>
  )
}
