import React, { useCallback, useRef, useEffect } from 'react'

// Hook pour mesurer les performances des composants
export const usePerformance = (componentName) => {
  const renderStartTime = useRef(performance.now())
  
  useEffect(() => {
    const renderTime = performance.now() - renderStartTime.current
    
    // Logger seulement les renders lents (> 50ms)
    if (renderTime > 50) {
      console.warn(`🐌 Slow render: ${componentName} took ${renderTime.toFixed(2)}ms`)
    }
    
    // Mesurer le temps de paint
    requestAnimationFrame(() => {
      const paintTime = performance.now() - renderStartTime.current
      if (paintTime > 100) {
        console.warn(`🎨 Slow paint: ${componentName} painted in ${paintTime.toFixed(2)}ms`)
      }
    })
  })
  
  const measureFunction = useCallback((functionName, fn) => {
    return (...args) => {
      const start = performance.now()
      const result = fn(...args)
      const end = performance.now()
      
      if (end - start > 10) {
        console.warn(`⚡ Slow function: ${componentName}.${functionName} took ${(end - start).toFixed(2)}ms`)
      }
      
      return result
    }
  }, [componentName])
  
  return { measureFunction }
}

// Hook pour détecter les fuites mémoire
export const useMemoryMonitor = (componentName) => {
  const lastMemory = useRef(0)
  
  useEffect(() => {
    if (performance.memory) {
      const currentMemory = performance.memory.usedJSHeapSize
      const diff = currentMemory - lastMemory.current
      
      if (diff > 5 * 1024 * 1024) { // 5MB increase
        console.warn(`🧠 Memory increase: ${componentName} +${(diff / 1024 / 1024).toFixed(2)}MB`)
      }
      
      lastMemory.current = currentMemory
    }
    
    return () => {
      // Cleanup monitoring
      if (performance.memory) {
        const finalMemory = performance.memory.usedJSHeapSize
        const diff = finalMemory - lastMemory.current
        
        if (diff > 1024 * 1024) { // 1MB not cleaned up
          console.warn(`🗑️ Potential memory leak: ${componentName} +${(diff / 1024 / 1024).toFixed(2)}MB not freed`)
        }
      }
    }
  }, [componentName])
}

// Hook pour optimiser les re-renders
export const useRenderOptimization = (deps, debugName) => {
  const renderCount = useRef(0)
  const lastDeps = useRef(deps)
  
  useEffect(() => {
    renderCount.current++
    
    if (renderCount.current > 10) {
      console.warn(`🔄 High render count: ${debugName} rendered ${renderCount.current} times`)
      
      // Comparer les dépendances pour identifier les changements
      if (lastDeps.current && deps) {
        deps.forEach((dep, index) => {
          if (dep !== lastDeps.current[index]) {
            console.log(`📊 Dep change in ${debugName}[${index}]:`, lastDeps.current[index], '→', dep)
          }
        })
      }
    }
    
    lastDeps.current = deps
  })
  
  return renderCount.current
}

// Hook pour mesurer les Core Web Vitals
export const useWebVitals = () => {
  useEffect(() => {
    // Cumulative Layout Shift (CLS)
    let clsValue = 0
    let clsEntries = []
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
          clsEntries.push(entry)
        }
      }
      
      // Log si CLS > 0.1 (seuil "good")
      if (clsValue > 0.1) {
        console.warn(`📐 High CLS: ${clsValue.toFixed(3)} (threshold: 0.1)`)
      }
    })
    
    if ('LayoutShift' in window) {
      observer.observe({ entryTypes: ['layout-shift'] })
    }
    
    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fid = entry.processingStart - entry.startTime
        
        // Log si FID > 100ms
        if (fid > 100) {
          console.warn(`⏱️ High FID: ${fid.toFixed(2)}ms (threshold: 100ms)`)
        }
      }
    })
    
    if ('first-input' in PerformanceObserver.supportedEntryTypes) {
      fidObserver.observe({ entryTypes: ['first-input'] })
    }
    
    return () => {
      observer.disconnect()
      fidObserver.disconnect()
    }
  }, [])
}

// Hook pour lazy loading optimisé
export const useLazyLoading = (ref, options = {}) => {
  const { 
    threshold = 0.1,
    rootMargin = '50px',
    once = true 
  } = options
  
  const [isInView, setIsInView] = React.useState(false)
  const [hasLoaded, setHasLoaded] = React.useState(false)
  
  useEffect(() => {
    const element = ref.current
    if (!element || (once && hasLoaded)) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (once) {
            setHasLoaded(true)
            observer.unobserve(element)
          }
        } else if (!once) {
          setIsInView(false)
        }
      },
      { threshold, rootMargin }
    )
    
    observer.observe(element)
    
    return () => observer.disconnect()
  }, [ref, threshold, rootMargin, once, hasLoaded])
  
  return isInView
}
