import React from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Enhanced Stat Card avec animations et indicateurs
export const EnhancedStatCard = React.forwardRef(({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  trend,
  trendData,
  className,
  ...props
}, ref) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600 bg-green-50'
      case 'negative':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3" />
    if (trend === 'down') return <TrendingDown className="h-3 w-3" />
    return <Activity className="h-3 w-3" />
  }

  return (
    <div
      ref={ref}
      className={cn(
        "bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 group",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className="p-2 bg-[#2B8286]/10 rounded-lg group-hover:bg-[#2B8286]/20 transition-colors">
              <Icon className="h-5 w-5 text-[#2B8286]" />
            </div>
          )}
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        </div>
        {trend && (
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="text-3xl font-bold text-[#29475B]">{value}</div>
        
        {change && (
          <div className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
            getChangeColor()
          )}>
            {changeType === 'positive' && <ArrowUpRight className="h-3 w-3 mr-1" />}
            {changeType === 'negative' && <ArrowDownRight className="h-3 w-3 mr-1" />}
            {change}
          </div>
        )}
      </div>

      {trendData && (
        <div className="mt-4 h-8 flex items-end space-x-1">
          {trendData.map((point, index) => (
            <div
              key={index}
              className="bg-[#2B8286]/20 rounded-sm flex-1 hover:bg-[#2B8286]/40 transition-colors"
              style={{ height: `${point}%` }}
            />
          ))}
        </div>
      )}
    </div>
  )
})

// Enhanced Action Bar avec animations
export const EnhancedActionBar = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between p-4 bg-gradient-to-r from-[#2B8286]/5 to-[#376470]/5 rounded-lg border border-[#2B8286]/20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

// Enhanced Empty State avec illustrations
export const EnhancedEmptyState = React.forwardRef(({
  icon: Icon,
  title,
  description,
  action,
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center py-12 px-6 text-center",
        className
      )}
      {...props}
    >
      {Icon && (
        <div className="mb-4 p-4 bg-gray-100 rounded-full">
          <Icon className="h-8 w-8 text-gray-400" />
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md">{description}</p>
      
      {action && (
        <div className="flex items-center space-x-2">
          {action}
        </div>
      )}
    </div>
  )
})

// Enhanced Loading Overlay avec animations
export const EnhancedLoadingOverlay = React.forwardRef(({
  isLoading,
  text = "Chargement...",
  className,
  ...props
}, ref) => {
  if (!isLoading) return null

  return (
    <div
      ref={ref}
      className={cn(
        "fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50",
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Loader2 className="h-8 w-8 animate-spin text-[#2B8286]" />
          <div className="absolute inset-0 h-8 w-8 border-2 border-[#2B8286]/20 rounded-full animate-pulse" />
        </div>
        <p className="text-sm text-gray-600 font-medium">{text}</p>
      </div>
    </div>
  )
})

// Enhanced Chart Container avec animations et interactions
export const EnhancedChartContainer = React.forwardRef(({
  title,
  subtitle,
  children,
  className,
  loading = false,
  error = null,
  actions,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300",
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-[#29475B]">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-6 w-6 animate-spin text-[#2B8286]" />
              <p className="text-sm text-gray-600">Chargement du graphique...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
            <p className="text-sm text-red-600 mb-2">Erreur de chargement</p>
            <p className="text-xs text-gray-500">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="chart-container">
            {children}
          </div>
        )}
      </div>
    </div>
  )
})

// Enhanced Table avec animations et interactions
export const EnhancedTable = React.forwardRef(({
  data,
  columns,
  loading = false,
  emptyMessage = "Aucune donnée disponible",
  className,
  ...props
}, ref) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-8">
          <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={cn(
        "bg-white rounded-lg border border-gray-200 overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
})

// Enhanced Search Bar avec animations
export const EnhancedSearchBar = React.forwardRef(({
  placeholder = "Rechercher...",
  value,
  onChange,
  onClear,
  loading = false,
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex items-center",
        className
      )}
      {...props}
    >
      <div className="relative flex-1">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B8286] focus:border-[#2B8286] transition-colors"
        />
        
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : (
            <Activity className="h-4 w-4 text-gray-400" />
          )}
        </div>

        {/* Clear Button */}
        {value && (
          <button
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  )
})

// Enhanced Metric Card avec indicateurs de performance
export const EnhancedMetricCard = React.forwardRef(({
  title,
  value,
  previousValue,
  target,
  icon: Icon,
  format = 'number',
  className,
  ...props
}, ref) => {
  const getPerformanceColor = () => {
    if (!previousValue || !target) return 'text-gray-600'
    
    const current = parseFloat(value)
    const prev = parseFloat(previousValue)
    const targetValue = parseFloat(target)
    
    if (current >= targetValue) return 'text-green-600'
    if (current > prev) return 'text-blue-600'
    return 'text-orange-600'
  }

  const getPerformanceIcon = () => {
    if (!previousValue || !target) return <Activity className="h-4 w-4" />
    
    const current = parseFloat(value)
    const targetValue = parseFloat(target)
    
    if (current >= targetValue) return <CheckCircle className="h-4 w-4" />
    if (current > parseFloat(previousValue)) return <TrendingUp className="h-4 w-4" />
    return <AlertTriangle className="h-4 w-4" />
  }

  return (
    <div
      ref={ref}
      className={cn(
        "bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {Icon && <Icon className="h-4 w-4 text-gray-500" />}
          <span className="text-sm font-medium text-gray-600">{title}</span>
        </div>
        <div className={cn("flex items-center space-x-1", getPerformanceColor())}>
          {getPerformanceIcon()}
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="text-2xl font-bold text-[#29475B]">{value}</div>
        
        {previousValue && (
          <div className="text-xs text-gray-500">
            Précédent: {previousValue}
          </div>
        )}
        
        {target && (
          <div className="text-xs text-gray-500">
            Objectif: {target}
          </div>
        )}
      </div>
    </div>
  )
})

// Enhanced Status Indicator
export const EnhancedStatusIndicator = React.forwardRef(({
  status,
  size = 'sm',
  showText = true,
  className,
  ...props
}, ref) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
      case 'success':
      case 'completed':
        return {
          color: 'bg-green-500',
          text: 'Actif',
          icon: CheckCircle
        }
      case 'inactive':
      case 'error':
      case 'failed':
        return {
          color: 'bg-red-500',
          text: 'Inactif',
          icon: AlertTriangle
        }
      case 'pending':
      case 'loading':
        return {
          color: 'bg-yellow-500',
          text: 'En attente',
          icon: Clock
        }
      default:
        return {
          color: 'bg-gray-500',
          text: 'Inconnu',
          icon: Activity
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-2 w-2'
      case 'md':
        return 'h-3 w-3'
      case 'lg':
        return 'h-4 w-4'
      default:
        return 'h-2 w-2'
    }
  }

  return (
    <div
      ref={ref}
      className={cn("flex items-center space-x-2", className)}
      {...props}
    >
      <div className={cn(
        "rounded-full animate-pulse",
        config.color,
        getSizeClasses()
      )} />
      
      {showText && (
        <span className="text-sm text-gray-600 flex items-center space-x-1">
          <Icon className="h-3 w-3" />
          <span>{config.text}</span>
        </span>
      )}
    </div>
  )
})

EnhancedStatCard.displayName = 'EnhancedStatCard'
EnhancedActionBar.displayName = 'EnhancedActionBar'
EnhancedEmptyState.displayName = 'EnhancedEmptyState'
EnhancedLoadingOverlay.displayName = 'EnhancedLoadingOverlay'
EnhancedChartContainer.displayName = 'EnhancedChartContainer'
EnhancedTable.displayName = 'EnhancedTable'
EnhancedSearchBar.displayName = 'EnhancedSearchBar'
EnhancedMetricCard.displayName = 'EnhancedMetricCard'
EnhancedStatusIndicator.displayName = 'EnhancedStatusIndicator'

