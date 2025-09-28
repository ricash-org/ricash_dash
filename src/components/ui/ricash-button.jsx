import React, { forwardRef, useCallback, useRef, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'

// Hook pour créer une référence stable
const useStableRef = (initialValue) => {
  const ref = useRef(initialValue)
  return ref
}

// Hook pour gérer les erreurs DOM de manière ultra-robuste
const useDOMErrorHandler = (elementRef) => {
  useEffect(() => {
    const element = elementRef?.current
    if (!element) return

    const handleError = (event) => {
      event.preventDefault()
      event.stopPropagation()
      return false
    }

    const handleUnhandledRejection = (event) => {
      event.preventDefault()
      return false
    }

    // Ajouter des listeners pour tous les types d'erreurs DOM
    element.addEventListener('error', handleError, true)
    element.addEventListener('unhandledrejection', handleUnhandledRejection, true)
    
    // Protection ultra-robuste pour les opérations DOM
    const originalRemoveChild = element.removeChild
    const originalAppendChild = element.appendChild
    const originalInsertBefore = element.insertBefore
    
    element.removeChild = function(child) {
      try {
        if (child && child.parentNode === this) {
          return originalRemoveChild.call(this, child)
        }
        return child
      } catch (error) {
        console.warn('Erreur removeChild interceptée:', error)
        return child
      }
    }
    
    element.appendChild = function(child) {
      try {
        return originalAppendChild.call(this, child)
      } catch (error) {
        console.warn('Erreur appendChild interceptée:', error)
        return child
      }
    }

    element.insertBefore = function(newNode, referenceNode) {
      try {
        return originalInsertBefore.call(this, newNode, referenceNode)
      } catch (error) {
        console.warn('Erreur insertBefore interceptée:', error)
        return newNode
      }
    }

    return () => {
      element.removeEventListener('error', handleError, true)
      element.removeEventListener('unhandledrejection', handleUnhandledRejection, true)
      
      // Restaurer les méthodes originales
      element.removeChild = originalRemoveChild
      element.appendChild = originalAppendChild
      element.insertBefore = originalInsertBefore
    }
  }, [elementRef])
}

export const RicashButton = forwardRef(({
  variant = 'primary',
  size = 'md',
  children,
  className,
  loading = false,
  loadingText = 'Chargement...',
  onClick,
  disabled = false,
  type = 'button',
  ...props
}, ref) => {
  const internalRef = useStableRef(null)
  const buttonRef = ref || internalRef

  // Gestion ultra-robuste des erreurs DOM
  useDOMErrorHandler(buttonRef)

  const buttonStyles = useMemo(() => {
    const variants = {
      primary: "bg-[#2B8286] text-white hover:bg-[#2B8286]/90 focus:ring-[#2B8286]/20 shadow-sm hover:shadow-md",
      secondary: "bg-[#F4F2EE] text-[#29475B] border border-[#376470]/20 hover:bg-[#F4F2EE]/80 focus:ring-[#376470]/20",
      accent: "bg-[#B19068] text-white hover:bg-[#B19068]/90 focus:ring-[#B19068]/20 shadow-sm hover:shadow-md",
      outline: "bg-transparent text-[#2B8286] border border-[#2B8286] hover:bg-[#2B8286]/10 focus:ring-[#2B8286]/20",
      ghost: "bg-transparent text-[#376470] hover:bg-[#F4F2EE] focus:ring-[#376470]/20",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/20 shadow-sm hover:shadow-md"
    }

    const sizes = {
      sm: "px-3 py-1.5 text-sm h-8",
      md: "px-4 py-2 text-sm h-10",
      lg: "px-6 py-3 text-base h-12",
      xl: "px-8 py-4 text-lg h-14"
    }

    const base = "inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

    return cn(
      base,
      variants[variant] || variants.primary,
      sizes[size] || sizes.md,
      className
    )
  }, [variant, size, className])

  const handleClick = useCallback((event) => {
    try {
      if (loading || disabled) {
        event?.preventDefault?.()
        event?.stopPropagation?.()
        return
      }

      if (onClick && typeof onClick === 'function') {
        // Protection supplémentaire pour l'exécution du onClick
        setTimeout(() => {
          try {
            onClick(event)
          } catch (error) {
            console.warn('Erreur dans onClick:', error)
          }
        }, 0)
      }
    } catch (error) {
      console.warn('Erreur dans handleClick:', error)
      event?.preventDefault?.()
      event?.stopPropagation?.()
    }
  }, [loading, disabled, onClick])

  const content = loading ? loadingText : children
  const isDisabled = loading || disabled

  return (
    <button
      ref={buttonRef}
      type={type}
      className={buttonStyles}
      disabled={isDisabled}
      onClick={handleClick}
      {...props}
    >
      {content}
    </button>
  )
})

RicashButton.displayName = 'RicashButton'

export const RicashIconButton = forwardRef(({
  variant = 'ghost',
  size = 'md',
  children,
  className,
  onClick,
  disabled = false,
  type = 'button',
  ...props
}, ref) => {
  const internalRef = useStableRef(null)
  const buttonRef = ref || internalRef

  // Gestion ultra-robuste des erreurs DOM
  useDOMErrorHandler(buttonRef)

  const buttonStyles = useMemo(() => {
    const variants = {
      primary: "bg-[#2B8286] text-white hover:bg-[#2B8286]/90 focus:ring-[#2B8286]/20 shadow-sm hover:shadow-md",
      secondary: "bg-[#F4F2EE] text-[#29475B] border border-[#376470]/20 hover:bg-[#F4F2EE]/80 focus:ring-[#376470]/20",
      accent: "bg-[#B19068] text-white hover:bg-[#B19068]/90 focus:ring-[#B19068]/20 shadow-sm hover:shadow-md",
      outline: "bg-transparent text-[#2B8286] border border-[#2B8286] hover:bg-[#2B8286]/10 focus:ring-[#2B8286]/20",
      ghost: "bg-transparent text-[#376470] hover:bg-[#F4F2EE] focus:ring-[#376470]/20",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/20 shadow-sm hover:shadow-md"
    }

    const sizes = {
      sm: "w-8 h-8",
      md: "w-10 h-10",
      lg: "w-12 h-12",
      xl: "w-14 h-14"
    }

    const base = "inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

    return cn(
      base,
      variants[variant] || variants.ghost,
      sizes[size] || sizes.md,
      className
    )
  }, [variant, size, className])

  const handleClick = useCallback((event) => {
    try {
      if (disabled) {
        event?.preventDefault?.()
        event?.stopPropagation?.()
        return
      }

      if (onClick && typeof onClick === 'function') {
        // Protection supplémentaire pour l'exécution du onClick
        setTimeout(() => {
          try {
            onClick(event)
          } catch (error) {
            console.warn('Erreur dans onClick:', error)
          }
        }, 0)
      }
    } catch (error) {
      console.warn('Erreur dans handleClick:', error)
      event?.preventDefault?.()
      event?.stopPropagation?.()
    }
  }, [disabled, onClick])

  return (
    <button
      ref={buttonRef}
      type={type}
      className={buttonStyles}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
})

RicashIconButton.displayName = 'RicashIconButton'

export const RicashActionButton = forwardRef(({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}, ref) => {
  return (
    <RicashButton
      ref={ref}
      variant={variant}
      size={size}
      className={cn("font-semibold", className)}
      {...props}
    >
      {children}
    </RicashButton>
  )
})

RicashActionButton.displayName = 'RicashActionButton'