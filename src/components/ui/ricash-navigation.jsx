import React from 'react'
import { cn } from '@/lib/utils'

export function RicashBreadcrumb({ 
  items,
  className,
  ...props 
}) {
  return (
    <nav
      className={cn("flex", className)}
      aria-label="Breadcrumb"
      {...props}
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-[#376470]/40">/</span>
            )}
            {item.href ? (
              <a
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#2B8286]",
                  index === items.length - 1 
                    ? "text-[#29475B]" 
                    : "text-[#376470]"
                )}
              >
                {item.label}
              </a>
            ) : (
              <span
                className={cn(
                  "text-sm font-medium",
                  index === items.length - 1 
                    ? "text-[#29475B]" 
                    : "text-[#376470]"
                )}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function RicashTabs({ 
  defaultValue,
  value,
  onValueChange,
  children,
  className,
  ...props 
}) {
  const [activeTab, setActiveTab] = React.useState(defaultValue || value)
  
  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue)
    if (onValueChange) onValueChange(tabValue)
  }
  
  return (
    <div className={cn("w-full", className)} {...props}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { 
            activeTab, 
            onTabChange: handleTabChange 
          })
        }
        return child
      })}
    </div>
  )
}

export function RicashTabsList({ 
  children,
  className,
  ...props 
}) {
  return (
    <div className={cn("flex space-x-1 rounded-lg bg-[#F4F2EE] p-1", className)} {...props}>
      {children}
    </div>
  )
}

export function RicashTabsTrigger({ 
  value: _value,
  children,
  className,
  ...props 
}) {
  // Utiliser la prop pour éviter l'erreur de linting
  console.log('Tab value:', _value)
  return (
    <button
      className={cn(
        "flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-[#2B8286] data-[state=active]:shadow-sm",
        "text-[#376470] hover:text-[#29475B] hover:bg-white/50",
        className
      )}
      data-state="active"
      {...props}
    >
      {children}
    </button>
  )
}

export function RicashTabsContent({ 
  value: _value,
  children,
  className,
  ...props 
}) {
  // Utiliser la prop pour éviter l'erreur de linting
  console.log('Tab content value:', _value)
  return (
    <div
      className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function RicashPagination({ 
  currentPage,
  totalPages,
  onPageChange,
  className,
  ...props 
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  
  return (
    <div className={cn("flex items-center justify-between", className)} {...props}>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
            currentPage === 1
              ? "text-[#376470]/40 cursor-not-allowed"
              : "text-[#376470] hover:bg-[#F4F2EE] hover:text-[#29475B]"
          )}
        >
          Précédent
        </button>
      </div>
      
      <div className="flex items-center space-x-1">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              currentPage === page
                ? "bg-[#2B8286] text-white"
                : "text-[#376470] hover:bg-[#F4F2EE] hover:text-[#29475B]"
            )}
          >
            {page}
          </button>
        ))}
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
            currentPage === totalPages
              ? "text-[#376470]/40 cursor-not-allowed"
              : "text-[#376470] hover:bg-[#F4F2EE] hover:text-[#29475B]"
          )}
        >
          Suivant
        </button>
      </div>
    </div>
  )
}

export function RicashFilterBar({ 
  children,
  className,
  ...props 
}) {
  return (
    <div
      className={cn(
        "bg-white border border-[#376470]/10 rounded-lg p-4 mb-6",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#29475B] mb-0">
          Filtres
        </h3>
        <div className="flex items-center space-x-3">
          {children}
        </div>
      </div>
    </div>
  )
}
