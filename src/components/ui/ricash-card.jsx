import React from 'react'
import { cn } from '@/lib/utils'

export function RicashCard({ 
  className, 
  children, 
  title,
  subtitle,
  ...props 
}) {
  return (
    <div 
      className={cn(
        "bg-white rounded-xl border border-[#376470]/10 shadow-lg hover:shadow-xl transition-all duration-300",
        className
      )}
      {...props}
    >
      {(title || subtitle) && (
        <div className="p-6 border-b border-[#F4F2EE]">
          {title && (
            <h3 className="text-xl font-semibold text-[#29475B] mb-2 truncate">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-[#376470] text-sm truncate">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}

export function RicashStatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon,
  trend,
  trendValue,
  trendUp = true,
  changeType: _changeType, // eslint-disable-line no-unused-vars
  iconColor,
  className,
  ...props 
}) {
  // Exclure les props personnalisées du DOM
  const { iconColor: _iconColor, ...domProps } = props
  
  return (
    <div 
      className={cn(
        "bg-white rounded-xl border border-[#376470]/10 shadow-lg hover:shadow-xl transition-all duration-300 p-6",
        className
      )}
      {...domProps}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-[#376470] truncate flex-1 min-w-0 mr-2">{title}</div>
        {Icon && (
          <div className="w-8 h-8 bg-[#2B8286]/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon className={cn("h-4 w-4", iconColor || "text-[#2B8286]")} />
          </div>
        )}
      </div>
      
      <div className="text-2xl font-bold text-[#29475B] mb-2 truncate">
        {value}
      </div>
      
      {subtitle && (
        <div className="text-sm text-[#376470] mb-3 truncate">
          {subtitle}
        </div>
      )}
      
      {(trend || trendValue) && (
        <div className="flex items-center space-x-2">
          <div className={cn(
            "flex items-center space-x-1 text-sm font-medium truncate",
            trendUp ? "text-green-600" : "text-red-600"
          )}>
            <span className="truncate">{trendValue}</span>
            {trend && <span className="text-[#376470] truncate">• {trend}</span>}
          </div>
        </div>
      )}
    </div>
  )
}

export function RicashTableCard({ 
  title, 
  subtitle, 
  children, 
  className,
  ...props 
}) {
  return (
    <RicashCard 
      title={title} 
      subtitle={subtitle} 
      className={cn("overflow-hidden", className)}
      {...props}
    >
      {children}
    </RicashCard>
  )
}
