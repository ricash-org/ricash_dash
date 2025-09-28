import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import { ThemeContext } from '@/hooks/useThemeContext'

export const ThemeProvider = ({ children }) => {
  const themeUtils = useTheme()

  return (
    <ThemeContext.Provider value={themeUtils}>
      {children}
    </ThemeContext.Provider>
  )
}
