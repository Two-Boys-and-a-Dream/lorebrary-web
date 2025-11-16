import { Layout } from 'antd'
import Navbar from '../organisms/Navbar'
import type { ReactNode } from 'react'

interface MainLayoutProps {
  children: ReactNode
  darkMode: boolean
  setDarkMode: (_darkMode: boolean) => void
}

export default function MainLayout({
  children,
  darkMode,
  setDarkMode,
}: MainLayoutProps) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div style={{ padding: '40px', flexGrow: 1 }}>{children}</div>
    </Layout>
  )
}
