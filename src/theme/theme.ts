import { extendTheme } from '@chakra-ui/react'

const config = {
  initialColorMode: 'dark' as const,
  useSystemColorMode: false,
}

const theme = extendTheme({ config })

export default theme
