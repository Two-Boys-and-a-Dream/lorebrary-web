import { Flex, theme } from '@chakra-ui/react'
import { Navbar } from '../organisms'
import type { ReactNode } from 'react'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <Flex direction="column">
      <Navbar />
      <Flex direction="column" p={theme.space[10]}>
        {children}
      </Flex>
    </Flex>
  )
}
