import React from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useThemeContext } from '@/hooks/useThemeContext'

export const ThemeToggle = ({ variant = "outline", size = "sm" }) => {
  const { theme, changeTheme, resolvedTheme } = useThemeContext()

  const themes = [
    {
      value: 'light',
      label: 'Clair',
      icon: Sun
    },
    {
      value: 'dark',
      label: 'Sombre',
      icon: Moon
    },
    {
      value: 'system',
      label: 'Système',
      icon: Monitor
    }
  ]

  const currentThemeData = themes.find(t => t.value === theme)
  const CurrentIcon = currentThemeData?.icon || Sun

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          className="w-9 h-9 p-0"
          title={`Thème actuel: ${currentThemeData?.label || 'Clair'}`}
        >
          <CurrentIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon
          const isActive = theme === themeOption.value
          
          return (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => changeTheme(themeOption.value)}
              className={`flex items-center justify-between ${
                isActive ? 'bg-accent' : ''
              }`}
            >
              <div className="flex items-center">
                <Icon className="mr-2 h-4 w-4" />
                {themeOption.label}
              </div>
              {isActive && (
                <div className="w-2 h-2 rounded-full bg-primary" />
              )}
            </DropdownMenuItem>
          )
        })}
        
        {theme === 'system' && (
          <div className="px-2 py-1 text-xs text-muted-foreground border-t mt-1">
            Détecté: {resolvedTheme === 'dark' ? 'Sombre' : 'Clair'}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Version simple toggle pour les cas où on veut juste basculer
export const SimpleThemeToggle = ({ className = "" }) => {
  const { toggleTheme, isDark } = useThemeContext()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={`w-9 h-9 p-0 ${className}`}
      title={`Basculer vers le thème ${isDark ? 'clair' : 'sombre'}`}
    >
      {isDark ? (
        <Sun className="h-4 w-4 transition-transform hover:rotate-180" />
      ) : (
        <Moon className="h-4 w-4 transition-transform hover:-rotate-12" />
      )}
    </Button>
  )
}
