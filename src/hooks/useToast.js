import { createContext, useContext } from 'react'

// Toast context
export const ToastContext = createContext()

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
