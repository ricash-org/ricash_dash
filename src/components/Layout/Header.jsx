import { useState, useRef, useEffect, useCallback } from 'react'
import { 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Moon, 
  Sun, 
  Monitor,
  HelpCircle,
  MessageSquare,
  Shield,
  CreditCard,
  Activity,
  Zap,
  Plus,
  Filter,
  Command,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  Maximize2,
  Minimize2,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MenuButton } from '@/components/ui/menu-button'
import { Input } from '@/components/ui/input'
import {
  RicashDropdownMenu,
  RicashDropdownItem,
  RicashDropdownSeparator,
} from '@/components/ui/ricash-dropdown'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'

export default function Header({ onMenuToggle, isSidebarOpen = false }) {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const searchRef = useRef(null)
  
  const [notifications] = useState([
    { 
      id: 1, 
      message: 'Nouveau transfert en attente de validation', 
      time: '2 min',
      type: 'transfer',
      priority: 'high',
      unread: true,
      amount: '€1,250.00'
    },
    { 
      id: 2, 
      message: 'Document KYC soumis par Jean Dupont', 
      time: '15 min',
      type: 'kyc',
      priority: 'medium',
      unread: true,
      user: 'Jean Dupont'
    },
    { 
      id: 3, 
      message: 'Alerte sécurité: tentative de connexion suspecte', 
      time: '1h',
      type: 'security',
      priority: 'high',
      unread: false,
      location: 'Paris, France'
    },
    { 
      id: 4, 
      message: 'Nouvelle commission calculée', 
      time: '2h',
      type: 'commission',
      priority: 'low',
      unread: false,
      amount: '€45.50'
    },
    { 
      id: 5, 
      message: 'Système de sauvegarde terminé', 
      time: '3h',
      type: 'system',
      priority: 'low',
      unread: false
    }
  ])

  const unreadCount = notifications.filter(n => n.unread).length

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'transfer': return <CreditCard className="h-4 w-4 text-blue-500" />
      case 'kyc': return <Shield className="h-4 w-4 text-green-500" />
      case 'security': return <Activity className="h-4 w-4 text-red-500" />
      case 'commission': return <Zap className="h-4 w-4 text-yellow-500" />
      case 'system': return <Settings className="h-4 w-4 text-purple-500" />
      default: return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50/20'
      case 'medium': return 'border-l-yellow-500 bg-yellow-50/20'
      case 'low': return 'border-l-green-500 bg-green-50/20'
      default: return 'border-l-gray-300'
    }
  }

  const handleLogout = () => {
    logout()
  }

  const handleSearch = (e) => {
    e.preventDefault()
    console.log('Recherche:', searchQuery)
  }

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setSearchQuery('')
      setIsSearchFocused(false)
      searchRef.current?.blur()
    }
    if (e.key === '/' && !isSearchFocused) {
      e.preventDefault()
      searchRef.current?.focus()
    }
  }, [isSearchFocused])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isSearchFocused, handleKeyDown])

  return (
    <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200/60 px-4 sm:px-6 py-3 sm:py-4 h-16 sm:h-18 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between max-w-full">
        {/* Left section */}
        <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
          {/* Menu hamburger avec animation premium */}
          <MenuButton
            isOpen={isSidebarOpen}
            onClick={onMenuToggle}
            className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 hover:shadow-md"
          />
          
          {/* Logo/Brand avec animation */}
          <div className="hidden sm:flex items-center space-x-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-[#2B8286] via-[#376470] to-[#29475B] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-sm">R</span>
            </div>
          <div className="hidden lg:block">
            <h1 className="text-lg font-bold text-[#29475B] group-hover:text-[#2B8286] transition-colors duration-300">Ricash</h1>
            <p className="text-xs text-[#376470] font-medium">Dashboard Pro</p>
            </div>
          </div>
          
          {/* Séparateur visuel amélioré */}
          <div className="hidden sm:block lg:hidden w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
          
          {/* Barre de recherche premium */}
          <form onSubmit={handleSearch} className="relative group flex-1 max-w-md lg:max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-all duration-300 group-focus-within:text-[#2B8286] group-focus-within:scale-110" />
            <Input
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Rechercher utilisateurs, transferts, transactions..."
                className="pl-10 pr-20 w-full transition-all duration-300 ease-out focus:shadow-lg focus:ring-2 focus:ring-[#2B8286]/20 border-gray-300 focus:border-[#2B8286] text-sm bg-gray-50/50 focus:bg-white rounded-xl"
              />
              
              {/* Raccourci clavier */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-300 rounded-md">
                  /
                </kbd>
              </div>
              
              {/* Focus glow effect amélioré */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-[#2B8286]/5 via-transparent to-[#2B8286]/5" />
            </div>
            
            {/* Suggestions de recherche améliorées */}
            {searchQuery && isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto backdrop-blur-xl">
                <div className="p-3 text-xs font-semibold text-[#29475B] border-b border-gray-100 bg-gradient-to-r from-[#2B8286]/5 to-transparent">
                  Résultats pour "{searchQuery}"
                </div>
                <div className="p-3">
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <User className="h-4 w-4 text-[#2B8286]" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Utilisateurs</div>
                      <div className="text-xs text-gray-500">Rechercher dans les comptes</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <CreditCard className="h-4 w-4 text-[#2B8286]" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Transferts</div>
                      <div className="text-xs text-gray-500">Rechercher dans les transactions</div>
                    </div>
                  </div>
          </div>
              </div>
            )}
          </form>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Bouton plein écran */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleFullscreen}
            className="h-9 w-9 rounded-lg hover:bg-gray-100 transition-all duration-200 text-gray-600 hover:text-gray-900"
            aria-label="Plein écran"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>

          {/* Theme Toggle premium */}
          <RicashDropdownMenu
            trigger={
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-9 w-9 rounded-lg hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 transition-all duration-200 text-gray-600 hover:text-gray-900 group"
                aria-label="Changer le thème"
              >
                <div className="group-hover:scale-110 transition-transform duration-200">
                  {theme === 'dark' ? <Moon className="h-4 w-4" /> : theme === 'light' ? <Sun className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                </div>
              </Button>
            }
            align="right"
          >
            <div className="px-3 py-2 text-sm font-semibold text-[#29475B] border-b border-gray-200 bg-gradient-to-r from-[#2B8286]/5 to-transparent">
              Apparence
            </div>
            <RicashDropdownItem onClick={() => setTheme('light')} className={theme === 'light' ? 'bg-[#2B8286]/10 text-[#2B8286] font-medium' : ''}>
              <Sun className="mr-2 h-4 w-4" />
              Mode clair
            </RicashDropdownItem>
            <RicashDropdownItem onClick={() => setTheme('dark')} className={theme === 'dark' ? 'bg-[#2B8286]/10 text-[#2B8286] font-medium' : ''}>
              <Moon className="mr-2 h-4 w-4" />
              Mode sombre
            </RicashDropdownItem>
            <RicashDropdownItem onClick={() => setTheme('system')} className={theme === 'system' ? 'bg-[#2B8286]/10 text-[#2B8286] font-medium' : ''}>
              <Monitor className="mr-2 h-4 w-4" />
              Système
            </RicashDropdownItem>
          </RicashDropdownMenu>
          
          {/* Aide avec tooltip */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 text-gray-600 hover:text-[#2B8286] group"
            aria-label="Centre d'aide"
          >
            <HelpCircle className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
          </Button>
          
          {/* Notifications premium */}
          <RicashDropdownMenu
            trigger={
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative h-9 w-9 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 text-gray-600 hover:text-[#2B8286] group"
                aria-label={`${unreadCount} nouvelles notifications`}
              >
                <Bell className="h-4 w-4 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold animate-pulse bg-gradient-to-r from-red-500 to-red-600"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            }
            align="right"
            className="w-96"
          >
            <div className="px-4 py-3 text-sm font-bold text-[#29475B] border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-[#2B8286]/5 to-transparent">
              <span>Notifications</span>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs bg-[#2B8286]/10 text-[#2B8286] border-[#2B8286]/20">
                    {unreadCount} nouvelles
                  </Badge>
                )}
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`flex items-start p-4 text-sm hover:bg-gray-50 transition-all duration-200 border-l-4 ${getPriorityColor(notification.priority)} ${
                    notification.unread ? 'bg-blue-50/30' : ''
                  } group`}
                >
                  <div className="flex-shrink-0 mr-3 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-[#29475B] transition-colors">
                      {notification.message}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center space-x-2">
                      <Clock className="h-3 w-3" />
                      <span>Il y a {notification.time}</span>
                      {notification.amount && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          {notification.amount}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-2 flex flex-col items-end space-y-1">
                    {notification.unread && (
                      <div className="w-2 h-2 bg-[#2B8286] rounded-full"></div>
                    )}
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <RicashDropdownSeparator />
            <RicashDropdownItem className="text-center text-[#2B8286] hover:text-[#29475B] font-semibold hover:bg-[#2B8286]/5">
                Voir toutes les notifications
            </RicashDropdownItem>
          </RicashDropdownMenu>

          {/* Messages/Chat premium */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative h-9 w-9 rounded-lg hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200 text-gray-600 hover:text-green-600 group"
            aria-label="Messages"
          >
            <MessageSquare className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
          </Button>

          {/* User menu premium */}
          <RicashDropdownMenu
            trigger={
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center space-x-3 px-3 h-10 rounded-lg hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 transition-all duration-200 group text-gray-700 hover:text-gray-900"
                aria-label="Menu utilisateur"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#2B8286] via-[#376470] to-[#29475B] rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-sm font-semibold transition-colors group-hover:text-[#29475B] text-gray-700">
                    {user?.name || 'Utilisateur'}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">{user?.email || ''}</div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-all duration-200 group-hover:rotate-180" />
              </Button>
            }
            align="right"
            className="w-72"
          >
            <div className="px-4 py-4 border-b border-gray-200 bg-gradient-to-r from-[#2B8286]/5 to-transparent">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2B8286] via-[#376470] to-[#29475B] rounded-xl flex items-center justify-center shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#29475B]">{user?.name || 'Utilisateur'}</div>
                  <div className="text-xs text-gray-500 font-medium">{user?.email || ''}</div>
                  <Badge variant="outline" className="text-xs mt-1 bg-green-50 text-green-700 border-green-200">
                    Administrateur
                  </Badge>
                </div>
              </div>
            </div>
            
            <RicashDropdownItem className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 p-4">
              <User className="mr-3 h-4 w-4 text-[#2B8286]" />
              <div>
                <div className="text-sm font-semibold text-gray-900">Mon profil</div>
                <div className="text-xs text-gray-500">Gérer mes informations</div>
              </div>
            </RicashDropdownItem>
            
            <RicashDropdownItem className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 p-4">
              <Settings className="mr-3 h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm font-semibold text-gray-900">Paramètres</div>
                <div className="text-xs text-gray-500">Préférences et sécurité</div>
              </div>
            </RicashDropdownItem>

            <RicashDropdownItem className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 p-4">
              <TrendingUp className="mr-3 h-4 w-4 text-purple-500" />
              <div>
                <div className="text-sm font-semibold text-gray-900">Statistiques</div>
                <div className="text-xs text-gray-500">Mes performances</div>
              </div>
            </RicashDropdownItem>
            
            <RicashDropdownSeparator />
            
            <RicashDropdownItem 
              className="text-red-600 hover:text-red-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 p-4" 
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-4 w-4" />
              <div>
                <div className="text-sm font-semibold">Déconnexion</div>
                <div className="text-xs text-red-500">Se déconnecter du compte</div>
              </div>
            </RicashDropdownItem>
          </RicashDropdownMenu>
        </div>
      </div>
    </header>
  )
}