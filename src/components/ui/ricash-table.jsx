import React from 'react'
import { cn } from '@/lib/utils'

export function RicashTable({ 
  children, 
  className,
  ...props 
}) {
  return (
    <div className={cn("w-full", className)} {...props}>
      <table className="w-full">
        {children}
      </table>
    </div>
  )
}

export function RicashTableHeader({ 
  children, 
  className,
  ...props 
}) {
  return (
    <thead className={cn("bg-[#F4F2EE] border-b border-[#376470]/20", className)} {...props}>
      {children}
    </thead>
  )
}

export function RicashTableBody({ 
  children, 
  className,
  ...props 
}) {
  return (
    <tbody className={cn("divide-y divide-[#F4F2EE]", className)} {...props}>
      {children}
    </tbody>
  )
}

export function RicashTableRow({ 
  children, 
  className,
  ...props 
}) {
  return (
    <tr 
      className={cn(
        "hover:bg-[#F4F2EE]/50 transition-colors duration-200",
        className
      )} 
      {...props}
    >
      {children}
    </tr>
  )
}

export function RicashTableCell({ 
  children, 
  className,
  ...props 
}) {
  return (
    <td 
      className={cn(
        "px-6 py-4 text-sm text-[#29475B]",
        className
      )} 
      {...props}
    >
      {children}
    </td>
  )
}

export function RicashStatusBadge({ 
  status, 
  text,
  className,
  ...props 
}) {
  const statusConfig = {
    success: {
      bg: "bg-[#2B8286]/10",
      text: "text-[#2B8286]",
      border: "border-[#2B8286]/20"
    },
    warning: {
      bg: "bg-[#B19068]/10",
      text: "text-[#B19068]",
      border: "border-[#B19068]/20"
    },
    error: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-200"
    },
    info: {
      bg: "bg-[#376470]/10",
      text: "text-[#376470]",
      border: "border-[#376470]/20"
    },
    default: {
      bg: "bg-gray-100",
      text: "text-gray-600",
      border: "border-gray-200"
    }
  }

  const config = statusConfig[status] || statusConfig.default

  return (
    <span 
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors duration-200",
        config.bg,
        config.text,
        config.border,
        className
      )}
      {...props}
    >
      {text || status}
    </span>
  )
}
// Composant d'action de tableau Ricash optimisé
export function RicashTableAction({ 
  children,
  onClick,
  variant = "ghost",
  size = "sm",
  className,
  disabled = false,
  ...props 
}) {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2B8286] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variantClasses = {
    ghost: "text-[#376470] hover:bg-[#376470]/10 hover:text-[#29475B]",
    primary: "bg-[#2B8286] text-white hover:bg-[#2B8286]/90",
    secondary: "bg-[#B19068] text-white hover:bg-[#B19068]/90",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-[#376470]/20 text-[#376470] hover:bg-[#376470]/5"
  }

  const sizeClasses = {
    sm: "h-8 w-8 p-1",
    md: "h-9 w-9 p-2",
    lg: "h-10 w-10 p-2.5"
  }

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

// Composant de menu d'actions Ricash
export function RicashTableActions({ 
  actions = [],
  className,
  ...props 
}) {
  return (
    <div className={cn("flex items-center space-x-2", className)} {...props}>
      {actions.map((action, index) => (
        <RicashTableAction
          key={index}
          onClick={action.onClick}
          variant={action.variant || "ghost"}
          size={action.size || "sm"}
          disabled={action.disabled}
          title={action.title}
          className={action.className}
        >
          {action.icon}
        </RicashTableAction>
      ))}
    </div>
  )
}

// Composant de sélection de ligne Ricash
export function RicashTableRowSelect({ 
  checked,
  onChange,
  disabled = false,
  className,
  ...props 
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className={cn(
        "h-4 w-4 rounded border-[#376470]/20 text-[#2B8286] focus:ring-[#2B8286] focus:ring-offset-2",
        className
      )}
      {...props}
    />
  )
}

// Composant de pagination de tableau Ricash
export function RicashTablePagination({ 
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className,
  ...props 
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  
  return (
    <div className={cn("flex items-center justify-between bg-white px-6 py-4 border-t border-[#F4F2EE]", className)} {...props}>
      <div className="text-sm text-[#376470]">
        Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, totalItems)} sur {totalItems} résultats
      </div>
      
      <div className="flex items-center space-x-2">
        <RicashTableAction
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
        >
          ←
        </RicashTableAction>
        
        {pages.map((page) => (
          <RicashTableAction
            key={page}
            onClick={() => onPageChange(page)}
            variant={currentPage === page ? "primary" : "outline"}
            size="sm"
          >
            {page}
          </RicashTableAction>
        ))}
        
        <RicashTableAction
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
        >
          →
        </RicashTableAction>
      </div>
    </div>
  )
}

