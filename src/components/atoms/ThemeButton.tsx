import { IconButton, useColorMode } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'

export default function ThemeButton() {
  const { colorMode, toggleColorMode } = useColorMode()
  const props = {
    onClick: toggleColorMode,
    icon: colorMode === 'light' ? <MoonIcon /> : <SunIcon />,
    'aria-label': 'Toggle color mode',
  }

  return <IconButton {...props} />
}
