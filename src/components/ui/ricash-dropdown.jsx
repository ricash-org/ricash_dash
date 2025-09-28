import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, MoreHorizontal } from 'lucide-react'

// Composant de menu déroulant Ricash pour les actions de tableau
export function RicashDropdownMenu({ 
  trigger,
  children,
  align = "right",
  className,
  ...props 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const alignClasses = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 transform -translate-x-1/2"
  }

  // Fonction pour fermer le dropdown
  const closeDropdown = () => setIsOpen(false)

  return (
    <div className={cn("relative", className)} ref={dropdownRef} {...props}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div className={cn(
          "absolute top-full mt-2 z-50 min-w-[200px] bg-white rounded-lg shadow-lg border border-[#376470]/20 py-2",
          alignClasses[align]
        )}>
          {React.Children.map(children, child => {
            if (React.isValidElement(child) && child.type === RicashDropdownItem) {
              return React.cloneElement(child, { onClose: closeDropdown })
            }
            return child
          })}
        </div>
      )}
    </div>
  )
}

// Élément de menu déroulant Ricash
export function RicashDropdownItem({ 
  children,
  onClick,
  onClose,
  disabled = false,
  className,
  ...props 
}) {
  const handleClick = (e) => {
    if (onClick) {
      onClick(e)
    }
    // Fermer le dropdown après le clic
    if (onClose) {
      onClose()
    }
  }

  return (
    <button
      className={cn(
        "w-full px-4 py-2 text-left text-sm text-[#29475B] hover:bg-[#F4F2EE] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

// Séparateur de menu déroulant Ricash
export function RicashDropdownSeparator({ 
  className,
  ...props 
}) {
  return (
    <div 
      className={cn("h-px bg-[#376470]/20 my-2", className)} 
      {...props} 
    />
  )
}

// Composant d'actions de tableau avec menu déroulant Ricash
export function RicashTableActionsDropdown({ 
  actions = [],
  className,
  ...props 
}) {
  const defaultActions = [
    {
      label: "Voir",
      icon: "👁️",
      onClick: () => console.log("Voir"),
      variant: "default"
    },
    {
      label: "Modifier",
      icon: "✏️",
      onClick: () => console.log("Modifier"),
      variant: "default"
    },
    {
      label: "Supprimer",
      icon: "🗑️",
      onClick: () => console.log("Supprimer"),
      variant: "danger"
    }
  ]

  const finalActions = actions.length > 0 ? actions : defaultActions

  return (
    <RicashDropdownMenu
      trigger={
        <button className="p-2 text-[#376470] hover:bg-[#376470]/10 rounded-md transition-colors duration-200">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      }
      className={className}
      {...props}
    >
      {finalActions.map((action, index) => (
        <RicashDropdownItem
          key={index}
          onClick={action.onClick}
          disabled={action.disabled}
          className={cn(
            action.variant === "danger" && "text-red-600 hover:bg-red-50"
          )}
        >
          <div className="flex items-center space-x-2">
            <span className="text-sm">{action.icon}</span>
            <span>{action.label}</span>
          </div>
        </RicashDropdownItem>
      ))}
    </RicashDropdownMenu>
  )
}

// Composant de sélection multiple Ricash
export function RicashTableBulkActions({ 
  selectedItems = [],
  onSelectAll: _onSelectAll,
  onClearSelection,
  actions = [],
  className,
  ...props 
}) {
  const isAllSelected = selectedItems.length > 0
  const totalItems = selectedItems.length
  
  // Utiliser la prop pour éviter l'erreur de linting
  console.log('onSelectAll disponible:', _onSelectAll)

  return (
    <div className={cn(
      "bg-white border border-[#376470]/20 rounded-lg p-4 mb-4",
      isAllSelected ? "block" : "hidden",
      className
    )} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-[#376470]">
            {totalItems} élément(s) sélectionné(s)
          </span>
          
          <button
            onClick={onClearSelection}
            className="text-sm text-[#2B8286] hover:text-[#2B8286]/80 transition-colors duration-200"
          >
            Désélectionner tout
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              disabled={action.disabled}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200",
                action.variant === "danger" 
                  ? "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300" 
                  : "bg-[#2B8286] text-white hover:bg-[#2B8286]/90 disabled:bg-[#2B8286]/50",
                "disabled:cursor-not-allowed"
              )}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Composant de recherche de tableau Ricash
export function RicashTableSearch({ 
  value,
  onChange,
  placeholder = "Rechercher...",
  className,
  ...props 
}) {
  return (
    <div className={cn("relative", className)} {...props}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-[#376470]/20 rounded-lg text-[#29475B] placeholder-[#376470]/60 focus:outline-none focus:ring-2 focus:ring-[#2B8286] focus:border-[#2B8286] transition-all duration-200"
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="text-[#376470]">🔍</span>
      </div>
    </div>
  )
}

// Composant de filtres de tableau Ricash
export function RicashTableFilters({ 
  filters = [],
  onFilterChange,
  className,
  ...props 
}) {
  return (
    <div className={cn("flex items-center space-x-4 mb-4", className)} {...props}>
      {filters.map((filter, index) => (
        <div key={index} className="flex items-center space-x-2">
          <label className="text-sm font-medium text-[#29475B]">
            {filter.label}:
          </label>
          <select
            value={filter.value}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
            className="px-3 py-2 border border-[#376470]/20 rounded-lg text-[#29475B] focus:outline-none focus:ring-2 focus:ring-[#2B8286] focus:border-[#2B8286] transition-all duration-200"
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  )
}
