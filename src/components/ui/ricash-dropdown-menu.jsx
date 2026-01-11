import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { RicashIconButton } from '@/components/ui/ricash-button'
import { MoreHorizontal } from 'lucide-react'

// Composant dropdown robuste pour éviter les erreurs DOM
export const RicashDropdownMenu = ({ 
  trigger, 
  items = [], 
  align = "end", 
  className = "w-48" 
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger || (
          <RicashIconButton
            variant="ghost"
            size="sm"
            className="text-[#376470] hover:bg-[#376470]/10"
          >
            <MoreHorizontal className="h-4 w-4" />
          </RicashIconButton>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={className}>
        {items.map((item, index) => {
          if (item.type === 'label') {
            return (
              <DropdownMenuLabel key={index} className="text-[#29475B]">
                {item.label}
              </DropdownMenuLabel>
            )
          }
          
          if (item.type === 'separator') {
            return <DropdownMenuSeparator key={index} />
          }
          
          if (item.type === 'item') {
            return (
              <DropdownMenuItem 
                key={index}
                onClick={item.onClick}
                className={item.className}
                disabled={item.disabled}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </DropdownMenuItem>
            )
          }
          
          return null
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Hook pour créer des items de dropdown de manière stable
export const useDropdownItems = (agent) => {
  return React.useMemo(() => {
    const items = [
      { type: 'label', label: 'Actions' },
      { type: 'separator' },
      { 
        type: 'item', 
        label: 'Voir détails', 
        icon: '👁️',
        onClick: () => console.log('View details', agent.id)
      },
      { 
        type: 'item', 
        label: 'Performance', 
        icon: '📊',
        onClick: () => console.log('View performance', agent.id)
      },
      { type: 'separator' },
      { 
        type: 'item', 
        label: agent.statut === 'actif' ? 'Suspendre' : 'Activer', 
        icon: agent.statut === 'actif' ? '🚫' : '✅',
        onClick: () => console.log('Toggle status', agent.id)
      },
      { 
        type: 'item', 
        label: 'Supprimer', 
        icon: '🗑️',
        onClick: () => console.log('Delete', agent.id),
        className: 'text-red-600 focus:text-red-600'
      }
    ]
    
    return items
  }, [agent.id, agent.statut])
}

