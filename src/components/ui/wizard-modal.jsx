import React, { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { BaseModal } from './base-modal'
import { Button } from './button'
import { Progress } from './progress'
import { Badge } from './badge'
import { cn } from '@/lib/utils'

// Animation variants for step transitions
const stepVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0
  })
}

// Step indicator component
const StepIndicator = ({ steps, currentStep, completedSteps }) => (
  <div className="flex items-center justify-between mb-6">
    {steps.map((step, index) => {
      const stepNumber = index + 1
      const isActive = currentStep === stepNumber
      const isCompleted = completedSteps.includes(stepNumber)
      const isNext = stepNumber === currentStep + 1
      
      return (
        <div key={step.id} className="flex items-center">
          <div
            className={cn(
              "relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200",
              {
                "bg-primary border-primary text-primary-foreground": isActive,
                "bg-green-500 border-green-500 text-white": isCompleted,
                "border-gray-300 bg-white text-gray-500": !isActive && !isCompleted,
                "border-primary/50 bg-primary/5": isNext
              }
            )}
          >
            {isCompleted ? (
              <Check className="w-4 h-4" />
            ) : (
              <span className="text-xs font-medium">{stepNumber}</span>
            )}
          </div>
          
          <div className="ml-2 hidden sm:block">
            <p className={cn(
              "text-sm font-medium transition-colors",
              {
                "text-primary": isActive,
                "text-green-600": isCompleted,
                "text-gray-500": !isActive && !isCompleted
              }
            )}>
              {step.title}
            </p>
            {step.description && (
              <p className="text-xs text-muted-foreground">{step.description}</p>
            )}
          </div>
          
          {index < steps.length - 1 && (
            <div className={cn(
              "flex-1 h-0.5 mx-4 transition-colors",
              isCompleted ? "bg-green-500" : "bg-gray-200"
            )} />
          )}
        </div>
      )
    })}
  </div>
)

// Main wizard modal component
export const WizardModal = ({
  isOpen,
  onClose,
  title,
  steps = [],
  onComplete,
  onStepChange,
  className,
  ...props
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState([])
  const [stepData, setStepData] = useState({})
  const [loading, setLoading] = useState(false)
  const [direction, setDirection] = useState(0)

  const totalSteps = steps.length
  const progress = (currentStep / totalSteps) * 100
  const currentStepConfig = steps[currentStep - 1]

  const updateStepData = useCallback((stepId, data) => {
    setStepData(prev => ({
      ...prev,
      [stepId]: { ...prev[stepId], ...data }
    }))
  }, [])

  const validateStep = useCallback(async (stepConfig) => {
    if (stepConfig.validate) {
      const stepDataForValidation = stepData[stepConfig.id] || {}
      return await stepConfig.validate(stepDataForValidation)
    }
    return { isValid: true }
  }, [stepData])

  const goToStep = useCallback(async (targetStep) => {
    if (targetStep === currentStep) return

    // Validate current step before moving forward
    if (targetStep > currentStep) {
      const validation = await validateStep(currentStepConfig)
      if (!validation.isValid) {
        return { success: false, errors: validation.errors }
      }
      
      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep])
      }
    }

    setDirection(targetStep > currentStep ? 1 : -1)
    setCurrentStep(targetStep)
    onStepChange?.(targetStep, stepData)
    
    return { success: true }
  }, [currentStep, currentStepConfig, completedSteps, validateStep, onStepChange, stepData])

  const handleNext = useCallback(async () => {
    if (currentStep < totalSteps) {
      await goToStep(currentStep + 1)
    }
  }, [currentStep, totalSteps, goToStep])

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      goToStep(currentStep - 1)
    }
  }, [currentStep, goToStep])

  const handleComplete = useCallback(async () => {
    setLoading(true)
    try {
      // Validate final step
      const validation = await validateStep(currentStepConfig)
      if (!validation.isValid) {
        return
      }

      // Mark final step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep])
      }

      // Call completion handler with all step data
      await onComplete?.(stepData)
      onClose()
      
      // Reset wizard state
      setCurrentStep(1)
      setCompletedSteps([])
      setStepData({})
    } catch (error) {
      console.error('Wizard completion error:', error)
    } finally {
      setLoading(false)
    }
  }, [currentStepConfig, validateStep, completedSteps, currentStep, onComplete, stepData, onClose])

  const actions = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-2">
        <Badge variant="outline">
          Étape {currentStep} sur {totalSteps}
        </Badge>
      </div>
      
      <div className="flex items-center space-x-2">
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={loading}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Précédent
          </Button>
        )}
        
        {currentStep < totalSteps ? (
          <Button onClick={handleNext} disabled={loading}>
            Suivant
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={handleComplete} disabled={loading}>
            {loading ? 'Création...' : 'Terminer'}
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
      loading={loading}
      actions={actions}
      className={cn("wizard-modal", className)}
      closeOnOverlayClick={false}
      {...props}
    >
      <div className="space-y-6">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Progression</span>
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step indicator */}
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />

        {/* Step content with animation */}
        <div className="relative min-h-[300px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute inset-0"
            >
              {currentStepConfig && (
                <currentStepConfig.component
                  data={stepData[currentStepConfig.id] || {}}
                  updateData={(data) => updateStepData(currentStepConfig.id, data)}
                  goToStep={goToStep}
                  allData={stepData}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </BaseModal>
  )
}

export default WizardModal
