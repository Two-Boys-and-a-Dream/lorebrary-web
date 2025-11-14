import { Flex } from 'antd'
import { Navbar } from '../organisms'
import type { ReactNode } from 'react'

interface MainLayoutProps {
  children: ReactNode
  darkMode: boolean
  // eslint-disable-next-line no-unused-vars
  setDarkMode: (darkMode: boolean) => void
}

export default function MainLayout({
  children,
  darkMode,
  setDarkMode,
}: MainLayoutProps) {
  return (
    <Flex vertical style={{ minHeight: '100vh' }}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div style={{ padding: '40px', flexGrow: 1 }}>{children}</div>
    </Flex>
  )
}
