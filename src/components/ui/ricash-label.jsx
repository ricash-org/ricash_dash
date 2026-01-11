import React from 'react'
import { cn } from '@/lib/utils'

const RicashLabel = React.forwardRef(({
  children,
  className,
  variant = "default",
  size = "default",
  required = false,
  ...props
}, ref) => {
  const variantClasses = {
    default: "text-[#29475B]",
    muted: "text-[#376470]",
    accent: "text-[#2B8286]"
  }

  const sizeClasses = {
    sm: "text-sm",
    default: "text-sm font-medium",
    lg: "text-base font-semibold"
  }

  return (
    <label
      ref={ref}
      className={cn(
        "block leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )
})

RicashLabel.displayName = 'RicashLabel'

export { RicashLabel }
