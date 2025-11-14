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
    // Layout
    // Layout: {
    //   headerBg: undefined, // Let algorithm decide
    //   bodyBg: undefined, // Let algorithm decide
    // },

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
// export const darkPurpleTheme: ThemeConfig = {
//   token: {
//     // Seed Token - Primary Colors
//     colorPrimary: '#9333ea', // Purple-600
//     colorSuccess: '#10b981', // Emerald-500
//     colorWarning: '#f59e0b', // Amber-500
//     colorError: '#ef4444', // Red-500
//     colorInfo: '#8b5cf6', // Violet-500
//     colorTextBase: '#e5e7eb', // Gray-200
//     colorBgBase: '#0f172a', // Slate-900

//     // Font
//     fontSize: 14,
//     fontFamily:
//       "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",

//     // Border
//     borderRadius: 6,

//     // Line
//     lineWidth: 1,
//     lineType: 'solid',

//     // Motion
//     motionUnit: 0.1,
//     motionBase: 0,
//     motionEaseOutCirc: 'cubic-bezier(0.08, 0.82, 0.17, 1)',
//     motionEaseInOutCirc: 'cubic-bezier(0.78, 0.14, 0.15, 0.86)',
//   },

//   algorithm: 'dark', // Use Ant Design's dark algorithm

//   components: {
//     // Layout
//     Layout: {
//       colorBgHeader: '#1e293b', // Slate-800
//       colorBgBody: '#0f172a', // Slate-900
//       colorBgTrigger: '#334155', // Slate-700
//     },

//     // Menu
//     Menu: {
//       colorItemBg: '#1e293b', // Slate-800
//       colorItemBgHover: '#334155', // Slate-700
//       colorItemBgSelected: '#7c3aed', // Violet-600
//       colorItemTextSelected: '#ffffff',
//       colorItemText: '#cbd5e1', // Slate-300
//     },

//     // Button
//     Button: {
//       colorPrimary: '#9333ea', // Purple-600
//       colorPrimaryHover: '#a855f7', // Purple-500
//       colorPrimaryActive: '#7e22ce', // Purple-700
//       colorBgContainer: '#1e293b', // Slate-800
//       colorBorder: '#475569', // Slate-600
//     },

//     // Input
//     Input: {
//       colorBgContainer: '#1e293b', // Slate-800
//       colorBorder: '#475569', // Slate-600
//       colorTextPlaceholder: '#64748b', // Slate-500
//       colorText: '#e5e7eb', // Gray-200
//       colorPrimaryHover: '#a855f7', // Purple-500
//     },

//     // Select
//     Select: {
//       colorBgContainer: '#1e293b', // Slate-800
//       colorBgElevated: '#334155', // Slate-700
//       colorBorder: '#475569', // Slate-600
//       colorText: '#e5e7eb', // Gray-200
//     },

//     // Card
//     Card: {
//       colorBgContainer: '#1e293b', // Slate-800
//       colorBorderSecondary: '#334155', // Slate-700
//     },

//     // Modal
//     Modal: {
//       colorBgElevated: '#1e293b', // Slate-800
//       colorBgMask: 'rgba(0, 0, 0, 0.7)',
//     },

//     // Table
//     Table: {
//       colorBgContainer: '#1e293b', // Slate-800
//       colorBorderSecondary: '#334155', // Slate-700
//       colorTextHeading: '#f1f5f9', // Slate-100
//     },

//     // Tabs
//     Tabs: {
//       colorBorderSecondary: '#334155', // Slate-700
//       colorPrimary: '#9333ea', // Purple-600
//     },

//     // Notification
//     Notification: {
//       colorBgElevated: '#1e293b', // Slate-800
//     },

//     // Message
//     Message: {
//       colorBgElevated: '#1e293b', // Slate-800
//     },

//     // Dropdown
//     Dropdown: {
//       colorBgElevated: '#334155', // Slate-700
//       colorText: '#e5e7eb', // Gray-200
//     },

//     // Tooltip
//     Tooltip: {
//       colorBgSpotlight: '#334155', // Slate-700
//     },

//     // Switch
//     Switch: {
//       colorPrimary: '#9333ea', // Purple-600
//       colorPrimaryHover: '#a855f7', // Purple-500
//     },

//     // Slider
//     Slider: {
//       colorPrimaryBorder: '#9333ea', // Purple-600
//       colorPrimaryBorderHover: '#a855f7', // Purple-500
//     },

//     // Progress
//     Progress: {
//       colorInfo: '#9333ea', // Purple-600
//     },
//   },
// }
