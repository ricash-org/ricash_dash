import React, { useState, useRef, useEffect, useMemo } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

// Truly Safe Select that doesn't use Radix UI at all
export function SafeSelect({ 
  value, 
  onValueChange, 
  placeholder = "Sélectionner...", 
  options = [], 
  className,
  triggerClassName,
  disabled = false,
  ...props 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const selectRef = useRef(null)
  const optionsRef = useRef(null)

  // Normalize options
  const normalizedOptions = useMemo(() => options.map((option, index) => {
    if (typeof option === 'string') {
      return {
        value: option,
        label: option,
        key: `option-${index}-${option}`
      }
    }
    return {
      value: option.value,
      label: option.label || option.value,
      key: option.key || `option-${index}-${option.value}`
    }
  }), [options])

  // Find selected option
  useEffect(() => {
    const option = normalizedOptions.find(opt => opt.value === value)
    setSelectedOption(option || null)
  }, [value, normalizedOptions])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle option selection
  const handleSelect = (option) => {
    setSelectedOption(option)
    onValueChange?.(option.value)
    setIsOpen(false)
  }

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (disabled) return
    
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()
        setIsOpen(!isOpen)
        break
      case 'Escape':
        setIsOpen(false)
        break
      case 'ArrowDown':
        event.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        }
        break
      case 'ArrowUp':
        event.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        }
        break
    }
  }

  return (
    <div 
      ref={selectRef}
      className={cn("relative", className)}
      {...props}
    >
      {/* Trigger */}
      <button
        type="button"
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          triggerClassName
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        role="combobox"
      >
        <span className={cn(
          "truncate",
          !selectedOption && "text-muted-foreground"
        )}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={cn(
            "h-4 w-4 opacity-50 transition-transform",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {/* Options */}
      {isOpen && (
        <div
          ref={optionsRef}
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
          role="listbox"
        >
          {normalizedOptions.length === 0 ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              Aucune option disponible
            </div>
          ) : (
            normalizedOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                className={cn(
                  "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                  selectedOption?.value === option.value && "bg-accent text-accent-foreground"
                )}
                onClick={() => handleSelect(option)}
                role="option"
                aria-selected={selectedOption?.value === option.value}
              >
                <span className="flex-1 truncate">{option.label}</span>
                {selectedOption?.value === option.value && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}