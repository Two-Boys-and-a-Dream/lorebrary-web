import { Button } from 'antd'
import { SunOutlined, MoonOutlined } from '@ant-design/icons'

interface ThemeButtonProps {
  darkMode: boolean
  toggleTheme: () => void
}

export default function ThemeButton({ darkMode, toggleTheme }: ThemeButtonProps) {
  return (
    <Button
      onClick={toggleTheme}
      icon={darkMode ? <SunOutlined /> : <MoonOutlined />}
      aria-label="Toggle color mode"
    />
  )
}
