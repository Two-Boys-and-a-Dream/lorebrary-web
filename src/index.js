import { createRoot } from 'react-dom/client'
import { App } from './App'
import { theme } from './theme'
import { ColorModeScript } from '@chakra-ui/react'

const container = document.getElementById('app')
const root = createRoot(container)

root.render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </>
)
