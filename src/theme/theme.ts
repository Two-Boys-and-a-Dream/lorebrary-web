import type { ThemeConfig } from 'antd'

export const purpleTheme: ThemeConfig = {
  token: {
    // Seed Token - Primary Colors
    colorPrimary: '#9333ea', // Purple-600
    colorSuccess: '#10b981', // Emerald-500
    colorWarning: '#f59e0b', // Amber-500
    colorError: '#ef4444', // Red-500
    colorInfo: '#8b5cf6', // Violet-500

    // Font
    fontSize: 16,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",

    // Border
    borderRadius: 6,

    // Line
    lineWidth: 1,
    lineType: 'solid',

    // Motion
    motionUnit: 0.1,
    motionBase: 0,
    motionEaseOutCirc: 'cubic-bezier(0.08, 0.82, 0.17, 1)',
    motionEaseInOutCirc: 'cubic-bezier(0.78, 0.14, 0.15, 0.86)',
  },

  components: {
    // Menu
    Menu: {
      colorItemBgSelected: '#7c3aed', // Violet-600 for dark
      colorItemTextSelected: '#ffffff',
    },

    // Button
    Button: {
      colorPrimary: '#9333ea', // Purple-600
      colorPrimaryHover: '#a855f7', // Purple-500
      colorPrimaryActive: '#7e22ce', // Purple-700
    },

    // Input
    Input: {
      colorPrimaryHover: '#a855f7', // Purple-500
    },

    // Switch
    Switch: {
      colorPrimary: '#9333ea', // Purple-600
      colorPrimaryHover: '#a855f7', // Purple-500
    },

    // Slider
    Slider: {
      colorPrimaryBorder: '#9333ea', // Purple-600
      colorPrimaryBorderHover: '#a855f7', // Purple-500
    },

    // Progress
    Progress: {
      colorInfo: '#9333ea', // Purple-600
    },

    // Tabs
    Tabs: {
      colorPrimary: '#9333ea', // Purple-600
    },
  },
}
