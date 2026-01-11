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
        
        {/* Sidebar avec conteneur vert moderne */}
        <div className={cn(
          "fixed left-0 top-0 h-full bg-gradient-to-b from-[#2B8286] to-[#376470] border-r border-[#29475B]/30 z-50 transition-all duration-300 ease-in-out",
          "w-64 shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          
          {/* Header avec logo sur fond vert */}
          <div className="flex flex-col items-center justify-center p-6 border-b border-[#29475B]/30 h-24 bg-gradient-to-br from-[#2B8286] to-[#376470]">
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
              className="lg:hidden absolute top-4 right-4 hover:bg-white/20 text-white rounded-full w-8 h-8 p-0"
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
                      "hover:bg-white/20 hover:shadow-md hover:scale-[1.02]",
                      isActive(item.href) 
                        ? "bg-white/30 text-white shadow-md border border-white/40" 
                        : "text-white/90 hover:text-white"
                    )}
                  >
                    <div className="flex items-center w-full">
                      {/* Icône avec couleurs blanches */}
                      <div className={cn(
                        "w-9 h-9 flex items-center justify-center rounded-xl mr-3 transition-all duration-300 border border-transparent",
                        "hover:bg-white/20 hover:shadow-md",
                        isActive(item.href) 
                          ? "bg-white/30 text-white shadow-lg border-white/40" 
                          : "text-white/80 border-white/20 bg-white/10"
                      )}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      
                      {/* Contenu principal */}
                      <div className="flex-1 min-w-0">
                        <div className={cn(
                          "text-sm font-semibold text-left transition-colors duration-300",
                          isActive(item.href) ? "text-white" : "text-white/90 hover:text-white"
                        )}>
                          {item.title}
                        </div>
                        <div className={cn(
                          "text-xs transition-colors duration-300",
                          isActive(item.href) ? "text-white/90" : "text-white/70 hover:text-white/90"
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
         <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
           <div className="text-center">
             <p className="text-xs text-white/80 font-medium">© 2025 Ricash</p>
           </div>
         </div>
      </div>
    </>
  )
}

