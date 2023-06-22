import './App.module.css'
import { ChakraProvider } from '@chakra-ui/react'
import { Home } from './components/pages'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { theme } from './theme'
import { MainLayout } from './components/layouts'

const queryClient = new QueryClient()

export function App() {
    return (
        <ChakraProvider
            theme={theme}
            toastOptions={{
                defaultOptions: {
                    position: 'top',
                    isClosable: true,
                },
            }}
        >
            <QueryClientProvider client={queryClient}>
                <MainLayout>
                    <Home />
                </MainLayout>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </ChakraProvider>
    )
}
