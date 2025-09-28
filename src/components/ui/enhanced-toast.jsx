import React, { useState, useRef, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ToastContext } from '@/hooks/useToast'

// Toast types and their configs
const toastTypes = {
  success: {
    icon: CheckCircle,
    className: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/10 dark:border-green-900/20 dark:text-green-400',
    iconClassName: 'text-green-500 dark:text-green-400'
  },
  error: {
    icon: XCircle,
    className: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/10 dark:border-red-900/20 dark:text-red-400',
    iconClassName: 'text-red-500 dark:text-red-400'
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/10 dark:border-yellow-900/20 dark:text-yellow-400',
    iconClassName: 'text-yellow-500 dark:text-yellow-400'
  },
  info: {
    icon: Info,
    className: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/10 dark:border-blue-900/20 dark:text-blue-400',
    iconClassName: 'text-blue-500 dark:text-blue-400'
  },
  loading: {
    icon: Loader2,
    className: 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900/10 dark:border-gray-900/20 dark:text-gray-400',
    iconClassName: 'text-gray-500 dark:text-gray-400 animate-spin'
  }
}

// Individual toast component
const Toast = ({ toast, onRemove }) => {
  const [isRemoving, setIsRemoving] = useState(false)
  const timeoutRef = useRef()
  const config = toastTypes[toast.type] || toastTypes.info
  const Icon = config.icon

  // Auto-dismiss functionality
  useEffect(() => {
    if (toast.duration !== 0 && !isRemoving) {
      timeoutRef.current = setTimeout(() => {
        handleRemove()
      }, toast.duration || 5000)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [toast.duration, isRemoving, handleRemove])

  const handleRemove = useCallback(() => {
    setIsRemoving(true)
    setTimeout(() => onRemove(toast.id), 150)
  }, [toast.id, onRemove])

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const handleMouseLeave = () => {
    if (toast.duration !== 0 && !isRemoving) {
      timeoutRef.current = setTimeout(handleRemove, toast.duration || 5000)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ 
        opacity: isRemoving ? 0 : 1, 
        y: isRemoving ? -20 : 0, 
        scale: isRemoving ? 0.95 : 1 
      }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "relative flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-md w-full",
        "backdrop-blur-sm bg-opacity-95",
        config.className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="alert"
      aria-live="polite"
    >
      {/* Progress bar for auto-dismiss */}
      {toast.duration !== 0 && !isRemoving && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-current opacity-30 rounded-b-lg"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: (toast.duration || 5000) / 1000, ease: 'linear' }}
        />
      )}

      {/* Icon */}
      <div className="flex-shrink-0">
        <Icon className={cn("h-5 w-5", config.iconClassName)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <h4 className="font-semibold text-sm mb-1">
            {toast.title}
          </h4>
        )}
        <p className="text-sm leading-relaxed">
          {toast.message}
        </p>
        
        {/* Action button */}
        {toast.action && (
          <button
            onClick={toast.action.handler}
            className="mt-2 text-xs font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* Close button */}
      {toast.dismissible !== false && (
        <button
          onClick={handleRemove}
          className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current transition-colors"
          aria-label="Fermer la notification"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  )
}

// Toast container component
const ToastContainer = ({ toasts, onRemove, position = 'top-right' }) => {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  }

  return (
    <div 
      className={cn(
        "fixed z-[100] flex flex-col gap-2 pointer-events-none",
        positionClasses[position]
      )}
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onRemove={onRemove} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Toast provider component
export const ToastProvider = ({ children, position = 'top-right', maxToasts = 5 }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((toast) => {
    const id = toast.id || `toast-${Date.now()}-${Math.random()}`
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      dismissible: true,
      ...toast
    }

    setToasts(prev => {
      const updatedToasts = [newToast, ...prev]
      // Limit number of toasts
      return updatedToasts.slice(0, maxToasts)
    })

    return id
  }, [maxToasts])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  // Helper methods for different toast types
  const toast = {
    success: (message, options = {}) => addToast({ 
      type: 'success', 
      message, 
      ...options 
    }),
    error: (message, options = {}) => addToast({ 
      type: 'error', 
      message, 
      duration: 7000, // Longer for errors
      ...options 
    }),
    warning: (message, options = {}) => addToast({ 
      type: 'warning', 
      message, 
      ...options 
    }),
    info: (message, options = {}) => addToast({ 
      type: 'info', 
      message, 
      ...options 
    }),
    loading: (message, options = {}) => addToast({ 
      type: 'loading', 
      message, 
      duration: 0, // Don't auto-dismiss loading toasts
      dismissible: false,
      ...options 
    }),
    promise: async (promise, messages) => {
      const loadingId = toast.loading(messages.loading || 'Chargement...')
      
      try {
        const result = await promise
        removeToast(loadingId)
        toast.success(messages.success || 'Opération réussie')
        return result
      } catch (error) {
        removeToast(loadingId)
        toast.error(messages.error || 'Une erreur est survenue')
        throw error
      }
    }
  }

  const contextValue = {
    toasts,
    toast,
    removeToast,
    clearToasts
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer 
        toasts={toasts} 
        onRemove={removeToast} 
        position={position} 
      />
    </ToastContext.Provider>
  )
}

export default ToastProvider
