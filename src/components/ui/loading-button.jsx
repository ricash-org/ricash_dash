import React from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export const LoadingButton = React.forwardRef(({ 
  className,
  children,
  loading = false,
  loadingText = "Chargement...",
  disabled,
  onClick,
  ...props 
}, ref) => {
  // Utiliser useMemo pour éviter les re-renders inutiles avec des clés uniques
  const buttonContent = React.useMemo(() => {
    if (loading) {
      return (
        <div key="loading-content" className="flex items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>{loadingText}</span>
        </div>
      )
    }
    return <div key="normal-content">{children}</div>
  }, [loading, loadingText, children])

  const handleClick = React.useCallback((e) => {
    if (loading || disabled) {
      e.preventDefault()
      e.stopPropagation()
      return
    }
    if (onClick) onClick(e)
  }, [loading, disabled, onClick])

  // Éviter les re-renders inutiles en mémorisant les props
  const buttonProps = React.useMemo(() => ({
    ref,
    className: cn(
      "relative transition-all duration-200",
      loading && "cursor-not-allowed",
      className
    ),
    disabled: disabled || loading,
    onClick: handleClick,
    type: "button", // Éviter les soumissions de formulaire accidentelles
    ...props
  }), [ref, className, loading, disabled, handleClick, props])

  return (
    <Button {...buttonProps}>
      {buttonContent}
    </Button>
  )
})

LoadingButton.displayName = "LoadingButton"

// Variante avec effet de pulsation
export const PulseButton = React.forwardRef(({ 
  className,
  children,
  pulse = false,
  ...props 
}, ref) => {
  return (
    <Button
      ref={ref}
      className={cn(
        "transition-all duration-200",
        pulse && "animate-pulse",
        className
      )}
      type="button"
      {...props}
    >
      {children}
    </Button>
  )
})

PulseButton.displayName = "PulseButton"
