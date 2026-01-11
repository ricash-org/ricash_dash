import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  ArrowLeftRight, 
  Building2, 
  UserCheck, 
  Settings, 
  BarChart3, 
  Shield,
  Menu,
  X,
  DollarSign,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import richashLogo from '@/assets/richash.png'

const baseMenuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/app/dashboard',
    description: 'Vue d\'ensemble'
  },
  {
    title: 'Utilisateurs',
    icon: Users,
    href: '/app/users',
    description: 'Gestion des comptes'
  },
  {
    title: 'Transferts',
    icon: ArrowLeftRight,
    href: '/app/transfers',
    description: 'Supervision des transactions'
  },
  {
    title: 'Agences',
    icon: Building2,
    href: '/app/agencies',
    description: 'Réseau de partenaires'
  },
  {
    title: 'KYC',
    icon: UserCheck,
    href: '/app/users/kyc',
    description: 'Vérification KYC'
  },
  {
    title: 'Agents',
    icon: UserCheck,
    href: '/app/agents',
    description: 'Gestion des agents'
  },
  {
    title: 'Demande de fonds',
    icon: DollarSign,
    href: '/app/funds/request',
    description: 'Créer une demande de fonds'
  },
  {
    title: 'Validation fonds',
    icon: CheckCircle,
    href: '/app/funds/approval',
    description: 'Approuver ou rejeter les demandes'
  },
  {
    title: 'Paramètres',
    icon: Settings,
    href: '/app/settings',
    description: 'Configuration système'
  },
  {
    title: 'Rapports',
    icon: BarChart3,
    href: '/app/reports',
    description: 'Analyses et statistiques'
  },
  {
    title: 'Sécurité',
    icon: Shield,
    href: '/app/security',
    description: 'Conformité et contrôles'
  }
]

export default function Sidebar({ isOpen, onToggle }) {
  const location = useLocation()
  const { hasRole } = useAuth()

  const isActive = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  return (
    <>
              {/* Overlay pour mobile */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm lg:hidden"
            onClick={onToggle}
          />
        )}
        
        {/* Sidebar avec conteneur blanc moderne */}
        <div className={cn(
          "fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ease-in-out",
          "w-64 shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          
          {/* Header avec logo sur fond blanc */}
          <div className="flex flex-col items-center justify-center p-6 border-b border-gray-100 h-24 bg-gradient-to-br from-gray-50 to-white">
            {/* Logo Ricash sans conteneur coloré */}
            <div className="w-32 h-32 flex items-center justify-center mb-3">
              <img 
                src={richashLogo} 
                alt="Ricash" 
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Bouton mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="lg:hidden absolute top-4 right-4 hover:bg-gray-100 text-gray-600 rounded-full w-8 h-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

                  {/* Navigation avec couleurs modernes */}
          <nav className="p-4 space-y-3 overflow-y-auto h-[calc(100vh-6rem)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {baseMenuItems
              .filter(item => {
                if (item.href.startsWith('/app/users/kyc')) return hasRole('KYC_ADMIN') || hasRole('SUPER_ADMIN')
                if (item.href.startsWith('/app/funds/approval')) return hasRole('FUNDS_ADMIN') || hasRole('SUPER_ADMIN')
                return true
              })
              .map((item) => (
              <div key={item.title} className="group">
                <Link 
                  to={item.href} 
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onToggle()
                    }
                  }}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-left font-medium h-12 px-4 rounded-xl transition-all duration-300",
                      "hover:bg-gray-50 hover:shadow-md hover:scale-[1.02]",
                      isActive(item.href) 
                        ? "bg-gradient-to-r from-[#2B8286]/10 to-[#B19068]/10 text-[#29475B] shadow-md border border-[#2B8286]/20" 
                        : "text-gray-700 hover:text-[#29475B]"
                    )}
                  >
                    <div className="flex items-center w-full">
                      {/* Icône avec couleurs Ricash */}
                      <div className={cn(
                        "w-9 h-9 flex items-center justify-center rounded-xl mr-3 transition-all duration-300 border border-transparent",
                        "hover:bg-[#2B8286]/10 hover:shadow-md",
                        isActive(item.href) 
                          ? "bg-gradient-to-br from-[#2B8286] to-[#B19068] text-white shadow-lg border-[#2B8286]/20" 
                          : "text-[#2B8286] border-[#2B8286]/15 bg-white"
                      )}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      
                      {/* Contenu principal */}
                      <div className="flex-1 min-w-0">
                        <div className={cn(
                          "text-sm font-semibold text-left transition-colors duration-300",
                          isActive(item.href) ? "text-[#29475B]" : "text-gray-700 hover:text-[#29475B]"
                        )}>
                          {item.title}
                        </div>
                        <div className={cn(
                          "text-xs transition-colors duration-300",
                          isActive(item.href) ? "text-[#2B8286]" : "text-gray-500 hover:text-[#2B8286]"
                        )}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                </Link>
              </div>
            ))}
          </nav>

                 {/* Footer simple */}
         <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
           <div className="text-center">
             <p className="text-xs text-gray-500 font-medium">© 2025 Ricash</p>
           </div>
         </div>
      </div>
    </>
  )
}

