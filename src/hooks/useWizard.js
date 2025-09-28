import { useState, useCallback } from 'react'

// Hook for managing wizard state
export const useWizard = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [stepData, setStepData] = useState({})

  const openWizard = useCallback(() => setIsOpen(true), [])
  const closeWizard = useCallback(() => {
    setIsOpen(false)
    setStepData({})
  }, [])

  const resetWizard = useCallback(() => {
    setStepData({})
  }, [])

  return {
    isOpen,
    openWizard,
    closeWizard,
    resetWizard,
    stepData,
    setStepData
  }
}
