import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { theme } from './theme'
import { ColorModeScript } from '@chakra-ui/react'

const container = document.getElementById('app')
if (!container) throw new Error('Root element not found')

const root = createRoot(container)

root.render(
  <StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </StrictMode>
)
