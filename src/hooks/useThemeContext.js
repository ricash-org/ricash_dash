import { useContext, createContext } from 'react'

const ThemeContext = createContext()

export { ThemeContext }

export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }
  return context
}
