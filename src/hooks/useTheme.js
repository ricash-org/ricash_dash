import { useState, useEffect, useCallback } from 'react'

const THEME_KEY = 'ricash-theme'

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    // Récupérer le thème du localStorage ou utiliser 'system' par défaut
    return localStorage.getItem(THEME_KEY) || 'system'
  })

  const [resolvedTheme, setResolvedTheme] = useState('light')

  // Fonction pour obtenir le thème système
  const getSystemTheme = useCallback(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }, [])

  // Appliquer le thème au document
  const applyTheme = useCallback((newTheme) => {
    const root = document.documentElement
    const actualTheme = newTheme === 'system' ? getSystemTheme() : newTheme
    
    // Supprimer les anciennes classes
    root.classList.remove('light', 'dark')
    
    // Ajouter la nouvelle classe
    root.classList.add(actualTheme)
    
    // Mettre à jour l'attribut data-theme pour les styles CSS
    root.setAttribute('data-theme', actualTheme)
    
    setResolvedTheme(actualTheme)
  }, [getSystemTheme])

  // Changer le thème
  const changeTheme = useCallback((newTheme) => {
    setTheme(newTheme)
    localStorage.setItem(THEME_KEY, newTheme)
    applyTheme(newTheme)
    
    // Log pour debug
    console.log(`🎨 Thème changé vers: ${newTheme}`)
  }, [applyTheme])

  // Basculer entre light et dark (ignorer system)
  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light'
    changeTheme(newTheme)
  }, [resolvedTheme, changeTheme])

  // Effet pour écouter les changements du thème système
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    
    // Appliquer le thème initial
    applyTheme(theme)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme, applyTheme])

  return {
    theme,
    resolvedTheme,
    changeTheme,
    toggleTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    isSystem: theme === 'system'
  }
}
