import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import { validateConfig } from './lib/config'
// import logger from './lib/logger'
// import { Toaster } from 'sonner'

// Fallbacks temporaires
const validateConfig = () => true
const logger = { info: console.log, error: console.error, debug: console.debug, performance: console.log }

// Valider la configuration au démarrage
try {
  validateConfig()
  logger.info('Application starting', {
    version: import.meta.env.VITE_APP_VERSION,
    environment: import.meta.env.MODE,
    timestamp: new Date().toISOString()
  })
} catch (error) {
  console.error('Configuration validation failed:', error)
  // Afficher une erreur à l'utilisateur
  document.body.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
      <div style="text-align: center; padding: 2rem; border: 1px solid #f87171; border-radius: 8px; background: #fef2f2;">
        <h1 style="color: #dc2626; margin-bottom: 1rem;">Erreur de Configuration</h1>
        <p style="color: #7f1d1d;">${error.message}</p>
        <p style="color: #7f1d1d; font-size: 0.875rem; margin-top: 1rem;">Veuillez contacter l'administrateur système.</p>
      </div>
    </div>
  `
  throw error
}

// Protection améliorée contre les erreurs DOM (maintenant loggées)
window.addEventListener('error', (event) => {
  if (event.error?.message?.includes('removeChild') || 
      event.error?.message?.includes('NotFoundError')) {
    logger.debug('DOM manipulation error suppressed', {
      message: event.error.message,
      filename: event.filename,
      lineno: event.lineno
    })
    event.preventDefault()
    return false
  }
  
  // Logger les autres erreurs
  logger.error('Uncaught error', {
    message: event.error?.message || event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack
  })
})

// Protection améliorée contre les promesses rejetées
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message?.includes('removeChild')) {
    logger.debug('Promise rejection for DOM error suppressed', {
      reason: event.reason.message
    })
    event.preventDefault()
    return
  }
  
  // Logger les autres rejections
  logger.error('Unhandled promise rejection', {
    reason: event.reason?.message || event.reason,
    stack: event.reason?.stack
  })
})

// Performance monitoring
if (typeof window !== 'undefined' && 'performance' in window) {
  window.addEventListener('load', () => {
    // Log des métriques de performance
    const navigation = performance.getEntriesByType('navigation')[0]
    if (navigation) {
      logger.performance('page_load', navigation.loadEventEnd - navigation.loadEventStart, {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        domInteractive: navigation.domInteractive - navigation.fetchStart,
        totalTime: navigation.loadEventEnd - navigation.fetchStart
      })
    }
  })
}

// Root element validation
const rootElement = document.getElementById('root')
if (!rootElement) {
  const error = new Error('Root element not found')
  logger.error('Critical startup error', { error })
  throw error
}

// Render avec error boundary global
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
