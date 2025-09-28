import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const AccessibleButton = React.forwardRef(({ 
  children,
  onClick,
  disabled = false,
  loading = false,
  ariaLabel,
  ariaDescribedBy,
  variant = "default",
  size = "default",
  className,
  ...props
}, ref) => {
  
  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault()
      return
    }
    
    // Feedback haptic sur mobile
    if (navigator.vibrate) {
      navigator.vibrate(10)
    }
    
    onClick?.(e)
  }

  const handleKeyDown = (e) => {
    // Support pour Enter et Space
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick(e)
    }
  }

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        // Focus visible amélioré
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
        // Transitions fluides
        "transition-all duration-200 ease-out",
        // État loading
        loading && "cursor-wait opacity-70",
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      role="button"
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      {children}
    </Button>
  )
})

AccessibleButton.displayName = "AccessibleButton"
