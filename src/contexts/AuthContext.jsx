import { useState, useEffect, useCallback, useRef } from 'react'
import { AuthContext } from '@/hooks/useAuth'
import axios from 'axios'

// Configuration
const logger = { info: console.log, error: console.error, warn: console.warn }
const config = { 
  auth: { 
    maxLoginAttempts: 5, 
    lockoutDuration: 900000, 
    sessionTimeout: 3600000, 
    refreshTokenThreshold: 300000 
  } 
}
const toast = { success: console.log, error: console.error, info: console.info }

// Service d'authentification avec le vrai backend
 const authAPI = { 
  login: async (credentials) => {
    try {
      // Créer les paramètres au format URL-encoded
      const params = new URLSearchParams();
      params.append('email', credentials.email);
      params.append('password', credentials.password);

      const response = await axios.post('http://localhost:8080/api/auth/auto-login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.status !== 200) {
        throw new Error('Email ou mot de passe incorrect');
      }

      const responseData = response.data;
      
      // ⬇️ CORRECTION : Structure cohérente avec votre réponse backend
      const userData = {
        id: responseData.userId,
        name: responseData.userData?.nom || credentials.email,
        email: credentials.email,
        role: responseData.role
      };

      return { 
        user: userData, 
        accessToken: responseData.idToken, 
        refreshToken: responseData.customToken 
      };
      
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data?.message || error.response.data?.error || 'Email ou mot de passe incorrect';
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('Impossible de contacter le serveur');
      } else {
        throw new Error('Erreur de connexion inattendue');
      }
    }
  },

  
  logout: async () => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      try {
        await axios.post('http://localhost:8080/api/auth/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.warn('Logout API call failed, continuing with local logout', error);
      }
    }
  },
  
  refreshToken: async () => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post('http://localhost:8080/api/auth/refresh-token', {
        refreshToken: refreshToken
      });

      return { 
        accessToken: response.data.access_token || response.data.idToken,
        refreshToken: response.data.refresh_token || response.data.refreshToken 
      };
    } catch (error) {
      throw new Error('Token refresh failed: ' + error.message);
    }
  }
};

// Gestion des tokens
const tokenStorage = {
  getAccessToken: () => sessionStorage.getItem('token'),
  getRefreshToken: () => sessionStorage.getItem('refreshToken'),
  setTokens: (access, refresh) => { 
    sessionStorage.setItem('token', access); 
    sessionStorage.setItem('refreshToken', refresh);
  },
  clearTokens: () => { 
    sessionStorage.removeItem('token'); 
    sessionStorage.removeItem('refreshToken'); 
    localStorage.removeItem('ricash_user');
    localStorage.removeItem('ricash_lockout');
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockoutTime, setLockoutTime] = useState(null)

  // Session timeout management
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

  // Logout function
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
        const savedUser = localStorage.getItem('ricash_user');
        const token = tokenStorage.getAccessToken();
        
        if (savedUser && token) {
          // Optionnel: Valider le token avec le backend
          try {
            const validationResponse = await axios.post('http://localhost:8080/api/auth/verify-token', {}, {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });

            if (validationResponse.status === 200) {
              const userData = JSON.parse(savedUser);
              setUser(userData);
              logger.info('Existing session restored', { 
                userId: userData.id,
                email: userData.email 
              });
            } else {
              // Token invalide, nettoyer
              tokenStorage.clearTokens();
              localStorage.removeItem('ricash_user');
            }
          } catch (error) {
            // En cas d'erreur, on garde la session locale
            const userData = JSON.parse(savedUser);
            setUser(userData);
          }
        }
      } catch (error) {
        logger.error('Error restoring session', { error });
        tokenStorage.clearTokens();
        localStorage.removeItem('ricash_user');
      } finally {
        setTimeout(() => setIsLoading(false), 100);
      }
    };

    checkExistingSession();
  }, []);

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