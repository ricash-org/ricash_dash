import React, { useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Modal size variants
const modalSizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  'xl-wide': 'max-w-[900px]', // Largeur optimale pour les formulaires complexes
  full: 'max-w-6xl'
}

// Loading skeleton component
const ModalSkeleton = () => (
  <div className="space-y-4 p-6">
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-32 bg-gray-200 rounded mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  </div>
)

export const BaseModal = React.forwardRef(({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  children,
  actions,
  loading = false,
  className,
  showCloseButton = true,
  closeOnOverlayClick = true,
  ...props
}, ref) => {
  const focusRef = useRef()
  
  // Focus management
  useEffect(() => {
    if (isOpen && focusRef.current) {
      const timer = setTimeout(() => {
        focusRef.current?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen && onClose) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        ref={ref}
        className={cn(
          'sm:max-w-[425px]',
          modalSizes[size],
          'bg-white border border-gray-200 shadow-xl',
          className
        )}
        onPointerDownOutside={closeOnOverlayClick ? undefined : (e) => e.preventDefault()}
        onEscapeKeyDown={onClose}
        {...props}
      >
        {/* Header */}
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              {title && (
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  {title}
                </DialogTitle>
              )}
              {description && (
                <DialogDescription className="text-sm text-gray-600">
                  {description}
                </DialogDescription>
              )}
            </div>
            {showCloseButton && (
              <Button
                ref={focusRef}
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-gray-100"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="py-4">
          {loading ? <ModalSkeleton /> : children}
        </div>

        {/* Footer */}
        {actions && (
          <DialogFooter className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-100">
            {actions}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
})

BaseModal.displayName = 'BaseModal'