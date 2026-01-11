import React from 'react'
import { cn } from '@/lib/utils'

const RicashBadge = ({ 
  children, 
  variant = 'default', 
  size = 'sm',
  className,
  ...props 
}) => {
  const variants = {
    default: "bg-[#376470] text-[#F4F2EE]",
    primary: "bg-[#2B8286] text-white",
    secondary: "bg-[#B19068] text-white",
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-white",
    danger: "bg-red-500 text-white",
    info: "bg-blue-500 text-white"
  }

  const sizes = {
    xs: "px-1.5 py-0.5 text-xs",
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-sm"
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium transition-colors",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export { RicashBadge }
