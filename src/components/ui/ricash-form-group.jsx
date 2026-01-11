import React from 'react'
import { cn } from '@/lib/utils'

const RicashFormGroup = React.forwardRef(({
  children,
  className,
  label,
  description,
  error,
  required = false,
  ...props
}, ref) => {
  return (
    <div ref={ref} className={cn("space-y-2", className)} {...props}>
      {label && (
        <label className="block text-sm font-medium text-[#29475B]">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {description && (
        <p className="text-sm text-[#376470]">{description}</p>
      )}
      
      <div className="space-y-1">
        {children}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

RicashFormGroup.displayName = 'RicashFormGroup'

export { RicashFormGroup }
