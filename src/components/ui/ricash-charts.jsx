import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

// Composant de graphique en barres pour les transactions
export const TransactionsBarChart = ({ data, className = "" }) => {
  return (
    <div className={`h-64 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="month" 
            stroke="#6B7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6B7280"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              color: '#374151'
            }}
          />
          <Bar 
            dataKey="transactions" 
            fill="#2B8286" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Composant de graphique en ligne pour le chiffre d'affaires
export const RevenueLineChart = ({ data, className = "" }) => {
  const formatCurrency = (amount) => {
    if (amount === 0) return '€0'
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className={`h-64 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="month" 
            stroke="#6B7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6B7280"
            fontSize={12}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              color: '#374151'
            }}
            formatter={(value) => [formatCurrency(value), 'Chiffre d\'affaires']}
          />
          <Line 
            type="monotone" 
            dataKey="chiffreAffaires" 
            stroke="#B19068" 
            strokeWidth={3}
            dot={{ fill: '#B19068', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#B19068', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// Composant de graphique en ligne pour les commissions
export const CommissionLineChart = ({ data, className = "" }) => {
  const formatCurrency = (amount) => {
    if (amount === 0) return '€0'
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className={`h-64 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="month" 
            stroke="#6B7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6B7280"
            fontSize={12}
            tickFormatter={(value) => `${(value / 100).toFixed(0)}€`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              color: '#374151'
            }}
            formatter={(value) => [formatCurrency(value), 'Commission']}
          />
          <Line 
            type="monotone" 
            dataKey="commissions" 
            stroke="#376470" 
            strokeWidth={3}
            dot={{ fill: '#376470', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#376470', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// Composant de graphique en ligne pour les notes de performance
export const PerformanceLineChart = ({ data, className = "" }) => {
  return (
    <div className={`h-64 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="month" 
            stroke="#6B7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6B7280"
            fontSize={12}
            domain={[0, 5]}
            tickFormatter={(value) => `${value}/5`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              color: '#374151'
            }}
            formatter={(value) => [`${value}/5`, 'Note de performance']}
          />
          <Line 
            type="monotone" 
            dataKey="notes" 
            stroke="#29475B" 
            strokeWidth={3}
            dot={{ fill: '#29475B', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#29475B', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

