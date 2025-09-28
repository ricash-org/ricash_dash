import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const MenuButton = React.forwardRef(({
  isOpen = false,
  onClick,
  className,
  size = "default",
  variant = "ghost",
  ...props
}, ref) => {
  const [isPressed, setIsPressed] = useState(false)

  const handleMouseDown = () => setIsPressed(true)
  const handleMouseUp = () => setIsPressed(false)
  const handleMouseLeave = () => setIsPressed(false)

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className={cn(
        // Base styles
        "relative lg:hidden p-3 h-12 w-12 rounded-xl",
        "transition-all duration-300 ease-out",
        
        // Hover states
        "hover:bg-[#2B8286]/10 hover:shadow-lg",
        "hover:scale-105 active:scale-95",
        
        // Focus states
        "focus:ring-2 focus:ring-primary/30 focus:ring-offset-2",
        "focus:outline-none focus-visible:ring-primary/50",
        
        // Touch optimization
        "touch-manipulation select-none",
        
        // Micro-interactions
        "group overflow-hidden",
        
        // Pressed state
        isPressed && "scale-95 bg-[#2B8286]/20",
        
        className
      )}
      aria-label={isOpen ? "Fermer le menu de navigation" : "Ouvrir le menu de navigation"}
      aria-expanded={isOpen}
      aria-controls="sidebar-navigation"
      title={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
      {...props}
    >
      {/* Animated hamburger icon */}
      <div className="relative w-5 h-5 flex flex-col justify-center items-center">
        {/* Top line */}
        <div 
          className={cn(
            "absolute w-5 h-0.5 bg-[#2B8286] transition-all duration-300 ease-out",
            "transform origin-center",
            isOpen ? "rotate-45 translate-y-0" : "-translate-y-1.5"
          )}
        />
        
        {/* Middle line */}
        <div 
          className={cn(
            "absolute w-5 h-0.5 bg-[#2B8286] transition-all duration-200 ease-out",
            isOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
          )}
        />
        
        {/* Bottom line */}
        <div 
          className={cn(
            "absolute w-5 h-0.5 bg-[#2B8286] transition-all duration-300 ease-out",
            "transform origin-center",
            isOpen ? "-rotate-45 translate-y-0" : "translate-y-1.5"
          )}
        />
      </div>
      
      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-[#2B8286]/10 scale-0 group-hover:scale-100 transition-transform duration-500 ease-out rounded-xl" />
      </div>
      
      {/* Screen reader feedback */}
      <span className="sr-only">
        {isOpen ? "Fermer la navigation" : "Ouvrir la navigation"}
      </span>
    </Button>
  )
})

MenuButton.displayName = 'MenuButton'
