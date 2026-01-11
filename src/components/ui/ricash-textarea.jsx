import React from 'react'
import { cn } from '@/lib/utils'

const RicashTextarea = React.forwardRef(({
  className,
  variant = "default",
  size = "default",
  ...props
}, ref) => {
  const variantClasses = {
    default: "border-[#376470]/20 focus:border-[#2B8286] focus:ring-[#2B8286]/20",
    error: "border-red-300 focus:border-red-500 focus:ring-red-500/20",
    success: "border-green-300 focus:border-green-500 focus:ring-green-500/20"
  }

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    default: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base"
  }

  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border bg-white px-3 py-2 text-sm placeholder:text-[#376470]",
        "focus:outline-none focus:ring-2 focus:ring-offset-0",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "resize-vertical",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

RicashTextarea.displayName = 'RicashTextarea'

export { RicashTextarea }
