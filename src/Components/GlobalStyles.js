export const theme = {
  colors: {
    primary: {
      main: "#2563eb",
      light: "#60a5fa",
      dark: "#1d4ed8",
      gradient: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    },
    secondary: {
      main: "#7c3aed",
      light: "#a78bfa",
      dark: "#5b21b6",
      gradient: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
    },
    success: {
      main: "#059669",
      light: "#34d399",
      dark: "#047857",
      gradient: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    },
    warning: {
      main: "#d97706",
      light: "#fbbf24",
      dark: "#b45309",
      gradient: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
    },
    error: {
      main: "#dc2626",
      light: "#f87171",
      dark: "#b91c1c",
      gradient: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
    },
    info: {
      main: "#0891b2",
      light: "#22d3ee",
      dark: "#0e7490",
      gradient: "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)",
    },
    neutral: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
    },
    background: {
      main: "#f8fafc",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
    lineHeight: {
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.625",
    },
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    "2xl": "2rem",
    "3xl": "3rem",
  },
  borderRadius: {
    sm: "0.125rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  transitions: {
    fast: "0.15s ease-in-out",
    normal: "0.3s ease-in-out",
    slow: "0.5s ease-in-out",
  },
}

export const GlobalStyle = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${theme.typography.fontFamily.primary};
    background-color: ${theme.colors.background.main};
    color: ${theme.colors.neutral[800]};
    line-height: ${theme.typography.lineHeight.normal};
  }

  button {
    border: none;
    cursor: pointer;
    font-family: inherit;
  }

  input, select, textarea {
    font-family: inherit;
    border: none;
    outline: none;
  }

  table {
    border-spacing: 0;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`
