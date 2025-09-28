import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export const AnimatedCard = React.forwardRef(({ 
  className, 
  children, 
  hoverScale = true,
  hoverShadow = true,
  clickAnimation = true,
  ...props 
}, ref) => {
  const [, setIsPressed] = useState(false)

  return (
    <Card
      ref={ref}
      className={cn(
        "transition-all duration-200 ease-out",
        hoverScale && "hover:scale-[1.02]",
        hoverShadow && "hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-white/5",
        clickAnimation && "active:scale-[0.98]",
        "transform-gpu", // Optimisation GPU
        className
      )}
      onMouseDown={() => clickAnimation && setIsPressed(true)}
      onMouseUp={() => clickAnimation && setIsPressed(false)}
      onMouseLeave={() => clickAnimation && setIsPressed(false)}
      {...props}
    >
      {children}
    </Card>
  )
})

AnimatedCard.displayName = "AnimatedCard"

// Variante avec effet de brillance
export const GlowCard = React.forwardRef(({ 
  className, 
  children, 
  glowColor = "primary",
  ...props 
}, ref) => {
  const glowColors = {
    primary: "hover:shadow-blue-500/25",
    success: "hover:shadow-green-500/25",
    warning: "hover:shadow-yellow-500/25",
    destructive: "hover:shadow-red-500/25",
  }

  return (
    <AnimatedCard
      ref={ref}
      className={cn(
        "relative overflow-hidden",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        "before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
        glowColors[glowColor],
        className
      )}
      {...props}
    >
      {children}
    </AnimatedCard>
  )
})

GlowCard.displayName = "GlowCard"
