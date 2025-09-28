import { useState, useEffect, useCallback, useRef } from 'react'
import { AuthContext } from '@/hooks/useAuth'
// import { authAPI, tokenStorage } from '../lib/api'
// import logger from '../lib/logger'
// import { config } from '../lib/config'
// import { toast } from 'sonner'

// Fallbacks temporaires
const logger = { info: console.log, error: console.error, warn: console.warn }
const config = { auth: { maxLoginAttempts: 5, lockoutDuration: 900000, sessionTimeout: 3600000, refreshTokenThreshold: 300000 } }
const toast = { success: console.log, error: console.error, info: console.info }
const authAPI = { 
  login: async (credentials) => {
    // Identifiants de démonstration
    const validCredentials = [
      { email: 'admin@ricash.com', password: 'admin123', name: 'Administrateur', role: 'admin' },
      { email: 'user@ricash.com', password: 'user123', name: 'Utilisateur', role: 'user' },
      { email: 'demo@ricash.com', password: 'demo123', name: 'Démo', role: 'demo' },
      { email: 'test@ricash.com', password: 'test123', name: 'Test', role: 'test' }
    ]
    
    const user = validCredentials.find(
      cred => cred.email === credentials.email && cred.password === credentials.password
    )
    
    if (!user) {
      throw new Error('Email ou mot de passe incorrect')
    }
    
    return { 
      user: { 
        id: user.email, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      }, 
      accessToken: `token_${user.email}`, 
      refreshToken: `refresh_${user.email}` 
    }
  },
  logout: async () => {},
  refreshToken: async () => ({ accessToken: 'new_token', refreshToken: 'new_refresh' })
}
const tokenStorage = {
  getAccessToken: () => localStorage.getItem('token'),
  getRefreshToken: () => localStorage.getItem('refresh'),
  setTokens: (access, refresh) => { localStorage.setItem('token', access); localStorage.setItem('refresh', refresh) },
  clearTokens: () => { localStorage.removeItem('token'); localStorage.removeItem('refresh'); localStorage.removeItem('ricash_user') }
}


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockoutTime, setLockoutTime] = useState(null)

  // Session timeout management - use refs to avoid infinite re-renders
  const sessionTimeoutId = useRef(null)
  const refreshTimeoutId = useRef(null)

  // Vérifier le lockout au démarrage
  useEffect(() => {
    const lockoutData = localStorage.getItem('ricash_lockout')
    if (lockoutData) {
      try {
        const { timestamp, attempts } = JSON.parse(lockoutData)
        const now = Date.now()
        
        if (now - timestamp < config.auth.lockoutDuration) {
          setIsLocked(true)
          setLockoutTime(timestamp + config.auth.lockoutDuration)
          setLoginAttempts(attempts)
        } else {
          localStorage.removeItem('ricash_lockout')
        }
      } catch {
        localStorage.removeItem('ricash_lockout')
      }
    }
  }, [])

  // Auto-unlock après expiration
  useEffect(() => {
    if (isLocked && lockoutTime) {
      const timeLeft = lockoutTime - Date.now()
      if (timeLeft > 0) {
        const timeoutId = setTimeout(() => {
          setIsLocked(false)
          setLockoutTime(null)
          setLoginAttempts(0)
          localStorage.removeItem('ricash_lockout')
          toast.success('Compte déverrouillé, vous pouvez réessayer')
        }, timeLeft)
        
        return () => clearTimeout(timeoutId)
      }
    }
  }, [isLocked, lockoutTime])

  // Logout function - defined before setupSessionTimeout to avoid circular dependency
  const logout = useCallback(async (reason = 'User logout') => {
    try {
      logger.info('Logout initiated', { reason, userId: user?.id })
      
      // Clear timeouts
      if (sessionTimeoutId.current) clearTimeout(sessionTimeoutId.current)
      if (refreshTimeoutId.current) clearTimeout(refreshTimeoutId.current)
      
      // Call logout API
      await authAPI.logout()
      
    } catch (error) {
      logger.warn('Logout API call failed', { error })
      // Continue with local logout even if API fails
    } finally {
      // Clear local state and storage
      setUser(null)
      sessionTimeoutId.current = null
      refreshTimeoutId.current = null
      tokenStorage.clearTokens()
      localStorage.removeItem('ricash_user')
      
      if (reason !== 'User logout') {
        toast.info(reason)
      }
      
      logger.info('Logout completed')
    }
  }, [user])

  // Setup session timeout
  const setupSessionTimeout = useCallback(() => {
    // Clear existing timeouts
    if (sessionTimeoutId.current) clearTimeout(sessionTimeoutId.current)
    if (refreshTimeoutId.current) clearTimeout(refreshTimeoutId.current)

    // Session timeout
    const sessionTimeout = setTimeout(() => {
      logger.warn('Session expired due to inactivity')
      logout('Session expirée')
    }, config.auth.sessionTimeout)
    sessionTimeoutId.current = sessionTimeout

    // Refresh token before expiration
    const refreshTimeout = setTimeout(async () => {
      try {
        logger.info('Attempting to refresh token before expiration')
        await authAPI.refreshToken()
        setupSessionTimeout() // Reset timers
      } catch (error) {
        logger.error('Failed to refresh token', { error })
        logout('Session expirée')
      }
    }, config.auth.sessionTimeout - config.auth.refreshTokenThreshold)
    refreshTimeoutId.current = refreshTimeout
  }, [logout])

  // Reset session timeout on user activity
  const resetSessionTimeout = useCallback(() => {
    if (user && sessionTimeoutId.current) {
      setupSessionTimeout()
    }
  }, [user, setupSessionTimeout])

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const savedUser = localStorage.getItem('ricash_user')
        
        // Pour la démo, on vérifie seulement si l'utilisateur existe
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          setUser(userData)
          
          // Générer un token pour la session
          const accessToken = `token_${userData.email}`
          const refreshToken = `refresh_${userData.email}`
          tokenStorage.setTokens(accessToken, refreshToken)
          
          logger.info('Existing session restored', { 
            userId: userData.id,
            email: userData.email 
          })
        }
      } catch (error) {
        logger.error('Error restoring session', { error })
        // Clean up corrupted data
        tokenStorage.clearTokens()
        localStorage.removeItem('ricash_user')
      } finally {
        // Délai minimal pour éviter le flash de login
        setTimeout(() => setIsLoading(false), 100)
      }
    }

    checkExistingSession()
  }, [])

  // Setup session timeout when user is set
  useEffect(() => {
    if (user) {
      setupSessionTimeout()
    }
  }, [user, setupSessionTimeout])

  // Setup activity listeners for session management
  useEffect(() => {
    if (user) {
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
      
      const resetTimer = () => resetSessionTimeout()
      
      events.forEach(event => {
        document.addEventListener(event, resetTimer, true)
      })
      
      return () => {
        events.forEach(event => {
          document.removeEventListener(event, resetTimer, true)
        })
      }
    }
  }, [user, resetSessionTimeout])

  const login = async (credentials) => {
    try {
      if (isLocked) {
        const timeLeft = Math.ceil((lockoutTime - Date.now()) / 1000 / 60)
        throw new Error(`Compte verrouillé. Réessayez dans ${timeLeft} minutes.`)
      }

      setIsLoading(true)
      
      logger.info('Login attempt', { email: credentials.email })
      
      const { user: userData, accessToken, refreshToken } = await authAPI.login(credentials)
      
      // Success - reset attempts and setup session
      setUser(userData)
      setLoginAttempts(0)
      localStorage.setItem('ricash_user', JSON.stringify(userData))
      localStorage.removeItem('ricash_lockout')
      
      // Stocker les tokens pour la session
      tokenStorage.setTokens(accessToken, refreshToken)
      
      setupSessionTimeout()
      
      logger.info('Login successful', { 
        userId: userData.id,
        email: userData.email,
        role: userData.role 
      })
      
      toast.success(`Bienvenue ${userData.name || userData.email}!`)
      
      return userData
      
    } catch (error) {
      logger.error('Login failed', { 
        error: error.message,
        email: credentials.email,
        attempts: loginAttempts + 1 
      })
      
      // Increment failed attempts
      const newAttempts = loginAttempts + 1
      setLoginAttempts(newAttempts)
      
      // Lock account after max attempts
      if (newAttempts >= config.auth.maxLoginAttempts) {
        const lockoutTimestamp = Date.now()
        setIsLocked(true)
        setLockoutTime(lockoutTimestamp + config.auth.lockoutDuration)
        
        localStorage.setItem('ricash_lockout', JSON.stringify({
          timestamp: lockoutTimestamp,
          attempts: newAttempts
        }))
        
        const lockoutMinutes = Math.ceil(config.auth.lockoutDuration / 1000 / 60)
        toast.error(`Trop de tentatives. Compte verrouillé pour ${lockoutMinutes} minutes.`)
        
        logger.warn('Account locked due to failed login attempts', {
          email: credentials.email,
          attempts: newAttempts,
          lockoutDuration: config.auth.lockoutDuration
        })
      } else {
        const remainingAttempts = config.auth.maxLoginAttempts - newAttempts
        toast.error(`${error.message}. ${remainingAttempts} tentatives restantes.`)
      }
      
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = useCallback((userData) => {
    setUser(userData)
    localStorage.setItem('ricash_user', JSON.stringify(userData))
    logger.info('User data updated', { userId: userData.id })
  }, [])

  const refreshSession = useCallback(async () => {
    try {
      logger.info('Refreshing user session')
      const { accessToken, refreshToken } = await authAPI.refreshToken()
      setupSessionTimeout()
      logger.info('Session refreshed successfully')
      return { accessToken, refreshToken }
    } catch (error) {
      logger.error('Session refresh failed', { error })
      logout('Session expirée')
      throw error
    }
  }, [logout, setupSessionTimeout])

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    loginAttempts,
    isLocked,
    lockoutTime,
    
    // Actions
    login,
    logout,
    updateUser,
    refreshSession,
    resetSessionTimeout,
    
    // Utilities
    hasRole: (role) => user?.role === role || user?.roles?.includes(role),
    hasPermission: (permission) => user?.permissions?.includes(permission),
    getRemainingLockoutTime: () => isLocked && lockoutTime ? Math.max(0, lockoutTime - Date.now()) : 0
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
