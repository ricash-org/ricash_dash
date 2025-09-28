import { useState, useCallback } from 'react'

// Custom hook for modal state management
export const useModal = (initialLoading = false) => {
  const [loading, setLoading] = useState(initialLoading)

  const withLoading = useCallback(async (asyncFn) => {
    setLoading(true)
    try {
      const result = await asyncFn()
      return result
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    setLoading,
    withLoading
  }
}
