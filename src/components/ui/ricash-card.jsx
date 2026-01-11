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
              {title}
            </h3>
          )}
          {subtitle && (
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
            <Icon className={cn("h-4 w-4", iconColor || "text-[#2B8286]")} />
          </div>
        )}
      </div>
      
        {value}
      </div>
      
      {subtitle && (
          {subtitle}
        </div>
      )}
      
      {(trend || trendValue) && (
        <div className="flex items-center space-x-2">
          <div className={cn(
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
