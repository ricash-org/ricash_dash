import React from 'react'
import { cn } from '@/lib/utils'

export function RicashInput({ 
  className,
  error,
  ...props 
}) {
  return (
    <div className="w-full">
      <input
        className={cn(
          "flex h-10 w-full rounded-lg border border-[#376470]/20 bg-white px-3 py-2 text-sm text-[#29475B] placeholder-[#376470]/60",
          "ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B8286] focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-all duration-200",
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export function RicashTextarea({ 
  className,
  error,
  ...props 
}) {
  return (
    <div className="w-full">
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border border-[#376470]/20 bg-white px-3 py-2 text-sm text-[#29475B] placeholder-[#376470]/60",
          "ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B8286] focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-all duration-200 resize-none",
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export function RicashSelect({ 
  children,
  className,
  error,
  onValueChange,
  options = [],
  value,
  placeholder = "Sélectionnez...",
  ...props 
}) {
  // Exclure les props personnalisées du DOM
  const { onValueChange: _, options: __, ...domProps } = props
  
  const handleChange = (e) => {
    if (onValueChange) {
      onValueChange(e.target.value)
    }
    if (domProps.onChange) {
      domProps.onChange(e)
    }
  }

  return (
    <div className="w-full">
      <select
        className={cn(
          "flex h-10 w-full rounded-lg border border-[#376470]/20 bg-white px-3 py-2 text-sm text-[#29475B]",
          "ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B8286] focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-all duration-200",
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        value={value}
        onChange={handleChange}
        {...domProps}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
        {children}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export function RicashLabel({ 
  children,
  className,
  ...props 
}) {
  return (
    <label
      className={cn(
        "text-sm font-medium text-[#29475B] mb-2 block",
        className
      )}
      {...props}
    >
      {children}
    </label>
  )
}

export function RicashFormGroup({ 
  children,
  className,
  ...props 
}) {
  return (
    <div
      className={cn(
        "space-y-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
