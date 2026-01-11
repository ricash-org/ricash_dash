import React, { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  Plus, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Euro,
  PoundSterling,
  Activity,
  Calendar,
  BarChart3,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Composants Ricash
import { RicashCard, RicashStatCard, RicashTableCard } from '@/components/ui/ricash-card'
import { RicashButton } from '@/components/ui/ricash-button'
import { RicashInput, RicashSelect } from '@/components/ui/ricash-input'
import { RicashStatusBadge } from '@/components/ui/ricash-table'
import {
  RicashTable,
  RicashTableHeader,
  RicashTableBody,
  RicashTableRow,
  RicashTableCell
} from '@/components/ui/ricash-table'
import { RicashTableActionsDropdown } from '@/components/ui/ricash-dropdown'

// Mock data pour les taux de change
const initialExchangeRates = [
  {
    id: 'EUR-001',
    deviseBase: 'EUR',
    deviseCible: 'XOF',
    tauxAchat: 655.957,
    tauxVente: 656.957,
    variation: 0.15,
    statut: 'success',
    derniereMAJ: '2024-01-15T10:30:00Z',
    source: 'BCEAO',
    limiteMin: 100,
    limiteMax: 1000000,
    commission: 0.5
  },
  {
    id: 'USD-001',
    deviseBase: 'USD',
    deviseCible: 'XOF',
    tauxAchat: 598.250,
    tauxVente: 599.250,
    variation: -0.25,
    statut: 'warning',
    derniereMAJ: '2024-01-15T10:25:00Z',
    source: 'BCEAO',
    limiteMin: 50,
    limiteMax: 500000,
    commission: 0.8
  },
  {
    id: 'GBP-001',
    deviseBase: 'GBP',
    deviseCible: 'XOF',
    tauxAchat: 758.500,
    tauxVente: 759.500,
    variation: 0.45,
    statut: 'success',
    derniereMAJ: '2024-01-15T10:20:00Z',
    source: 'BCEAO',
    limiteMin: 25,
    limiteMax: 250000,
    commission: 1.2
  },
  {
    id: 'JPY-001',
    deviseBase: 'JPY',
    deviseCible: 'XOF',
    tauxAchat: 4.125,
    tauxVente: 4.225,
    variation: -0.10,
    statut: 'info',
    derniereMAJ: '2024-01-15T10:15:00Z',
    source: 'BCEAO',
    limiteMin: 1000,
    limiteMax: 10000000,
    commission: 0.3
  },
  {
    id: 'XOF-001',
    deviseBase: 'XOF',
    deviseCible: 'EUR',
    tauxAchat: 0.00152,
    tauxVente: 0.00153,
    variation: 0.05,
    statut: 'success',
    derniereMAJ: '2024-01-15T10:10:00Z',
    source: 'BCEAO',
    limiteMin: 10000,
    limiteMax: 10000000,
    commission: 0.2
  }
]

const getDeviseIcon = (devise) => {
  const icons = {
    EUR: Euro,
    USD: DollarSign,
    GBP: PoundSterling,
    JPY: Activity,
    XOF: Activity
  }
  return icons[devise] || Activity
}

const getVariationColor = (variation) => {
  if (variation > 0) return 'text-green-600'
  if (variation < 0) return 'text-red-600'
  return 'text-gray-600'
}

const getVariationIcon = (variation) => {
  if (variation > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
  if (variation < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
  return <Activity className="h-4 w-4 text-gray-600" />
}

const formatCurrency = (amount, currency = 'XOF') => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  }).format(amount)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const ExchangeRates = React.memo(() => {
  const navigate = useNavigate()
  const [exchangeRates, setExchangeRates] = useState(initialExchangeRates)
  const [isLoading, setIsLoading] = useState(false)
  
  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    deviseBase: 'all',
    deviseCible: 'all',
    statut: 'all'
  })
  
  // Handlers optimisés
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])
  
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      deviseBase: 'all',
      deviseCible: 'all',
      statut: 'all'
    })
  }, [])
  
  const handleRefresh = useCallback(async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
  }, [])

  // Filtered rates with memoization
  const filteredRates = useMemo(() => {
    return exchangeRates.filter(rate => {
      const matchesSearch = !filters.search || 
        rate.deviseBase.toLowerCase().includes(filters.search.toLowerCase()) ||
        rate.deviseCible.toLowerCase().includes(filters.search.toLowerCase()) ||
        rate.source.toLowerCase().includes(filters.search.toLowerCase())
      
      const matchesBase = filters.deviseBase === 'all' || rate.deviseBase === filters.deviseBase
      const matchesCible = filters.deviseCible === 'all' || rate.deviseCible === filters.deviseCible
      const matchesStatut = filters.statut === 'all' || rate.statut === filters.statut

      return matchesSearch && matchesBase && matchesCible && matchesStatut
    })
  }, [exchangeRates, filters])

  const stats = {
    total: exchangeRates.length,
    actifs: exchangeRates.filter(r => r.statut === 'success').length,
    stables: exchangeRates.filter(r => Math.abs(r.variation) < 0.1).length,
    volatiles: exchangeRates.filter(r => Math.abs(r.variation) >= 0.1).length,
    moyenneVariation: exchangeRates.reduce((sum, r) => sum + Math.abs(r.variation), 0) / exchangeRates.length,
    derniereMAJ: new Date(Math.max(...exchangeRates.map(r => new Date(r.derniereMAJ)))).toLocaleString('fr-FR')
  }

  const handleEditRate = (rate) => {
    console.log('Éditer le taux:', rate)
  }

  const handleSuspendRate = (rate) => {
    setExchangeRates(prev => prev.map(r => 
      r.id === rate.id 
        ? { ...r, statut: r.statut === 'error' ? 'success' : 'error' }
        : r
    ))
  }

  const handleDeleteRate = (rateId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce taux de change ?')) {
      setExchangeRates(prev => prev.filter(rate => rate.id !== rateId))
    }
  }

  const handleCreateRate = () => {
    navigate('/app/settings/rates/create')
  }

  return (
    <div className="p-6 bg-[#F4F2EE] min-h-screen space-y-6">
      {/* Page header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#29475B] tracking-tight">
            💱 Gestion des Taux de Change
          </h1>
          <p className="text-[#376470] text-lg mt-2">
            Surveillez et gérez les taux de change pour toutes les devises
          </p>
        </div>
        <div className="flex gap-3">
          <RicashButton
            onClick={handleRefresh}
            disabled={isLoading}
            variant="outline"
            size="lg"
            className="border-[#376470]/20 text-[#376470] hover:bg-[#376470]/10"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Actualisation...' : 'Actualiser'}
          </RicashButton>
          <RicashButton 
            onClick={handleCreateRate}
            size="lg"
            className="bg-[#2B8286] hover:bg-[#2B8286]/90 text-white shadow-lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Nouveau taux
          </RicashButton>
        </div>
      </div>

             {/* Stats cards */}
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
         <RicashStatCard
           title="Total devises"
           value={stats.total}
           icon={DollarSign}
           trend="+2 ce mois"
           className="bg-gradient-to-br from-[#29475B] to-[#376470] text-white"
         />
         <RicashStatCard
           title="Taux actifs"
           value={stats.actifs}
           icon={CheckCircle}
           trend="Stable"
           className="bg-gradient-to-br from-[#2B8286] to-[#2B8286]/80 text-white"
         />
         <RicashStatCard
           title="Taux stables"
           value={stats.stables}
           icon={Activity}
           trend="En hausse"
           className="bg-gradient-to-br from-[#B19068] to-[#B19068]/80 text-white"
         />
         <RicashStatCard
           title="Taux volatiles"
           value={stats.volatiles}
           icon={AlertTriangle}
           trend="À surveiller"
           className="bg-gradient-to-br from-red-500 to-red-600 text-white"
         />
         <RicashStatCard
           title="Variation moy."
           value={`${stats.moyenneVariation.toFixed(2)}%`}
           icon={BarChart3}
           trend="Stable"
           className="bg-gradient-to-br from-[#376470] to-[#376470]/80 text-white"
         />
         <RicashStatCard
           title="Dernière MAJ"
           value={stats.derniereMAJ.split(' ')[0]}
           icon={Clock}
           trend="Aujourd'hui"
           className="bg-gradient-to-br from-[#2B8286] to-[#B19068] text-white"
         />
       </div>

      {/* Filtres et recherche */}
      <RicashCard className="p-6 border-[#376470]/20">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#29475B]">🔍 Recherche et Filtres</h2>
            <p className="text-[#376470] mt-1">
              {filteredRates.length} taux trouvé(s)
            </p>
          </div>
          <RicashButton
            onClick={resetFilters}
            variant="outline"
            size="sm"
            className="border-[#376470]/20 text-[#376470] hover:bg-[#376470]/10"
          >
            <Filter className="mr-2 h-4 w-4" />
            Reset filtres
          </RicashButton>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#376470]" />
            <RicashInput
              placeholder="Rechercher devises..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="pl-10 border-[#376470]/20 focus:border-[#2B8286]"
            />
          </div>
          
          <RicashSelect
            value={filters.deviseBase}
            onValueChange={(value) => updateFilters({ deviseBase: value })}
            placeholder="Devise de base"
            options={[
              { value: 'all', label: 'Toutes les devises' },
              { value: 'EUR', label: 'EUR - Euro' },
              { value: 'USD', label: 'USD - Dollar US' },
              { value: 'GBP', label: 'GBP - Livre Sterling' },
              { value: 'JPY', label: 'JPY - Yen Japonais' },
              { value: 'XOF', label: 'XOF - Franc CFA' }
            ]}
            className="border-[#376470]/20 focus:border-[#2B8286]"
          />
          
          <RicashSelect
            value={filters.deviseCible}
            onValueChange={(value) => updateFilters({ deviseCible: value })}
            placeholder="Devise cible"
            options={[
              { value: 'all', label: 'Toutes les devises' },
              { value: 'XOF', label: 'XOF - Franc CFA' },
              { value: 'EUR', label: 'EUR - Euro' },
              { value: 'USD', label: 'USD - Dollar US' },
              { value: 'GBP', label: 'GBP - Livre Sterling' },
              { value: 'JPY', label: 'JPY - Yen Japonais' }
            ]}
            className="border-[#376470]/20 focus:border-[#2B8286]"
          />
          
          <RicashSelect
            value={filters.statut}
            onValueChange={(value) => updateFilters({ statut: value })}
            placeholder="Statut"
            options={[
              { value: 'all', label: 'Tous les statuts' },
              { value: 'success', label: 'Actif' },
              { value: 'warning', label: 'Attention' },
              { value: 'error', label: 'Suspendu' },
              { value: 'info', label: 'Info' }
            ]}
            className="border-[#376470]/20 focus:border-[#2B8286]"
          />
        </div>
      </RicashCard>

      {/* Tableau des taux de change */}
      <RicashTableCard
        title="📊 Taux de Change Actuels"
        description={`${filteredRates.length} taux disponible(s)`}
        className="overflow-hidden border-[#376470]/20"
      >
        <RicashTable>
          <RicashTableHeader>
            <RicashTableRow>
              <RicashTableCell className="font-semibold text-[#29475B]">💱 Paire</RicashTableCell>
              <RicashTableCell className="font-semibold text-[#29475B]">📈 Taux Achat</RicashTableCell>
              <RicashTableCell className="font-semibold text-[#29475B]">📉 Taux Vente</RicashTableCell>
              <RicashTableCell className="font-semibold text-[#29475B]">📊 Variation</RicashTableCell>
              <RicashTableCell className="font-semibold text-[#29475B]">📅 Dernière MAJ</RicashTableCell>
              <RicashTableCell className="font-semibold text-[#29475B]">🏛️ Source</RicashTableCell>
              <RicashTableCell className="font-semibold text-[#29475B]">📋 Statut</RicashTableCell>
              <RicashTableCell className="font-semibold text-[#29475B]">⚡ Actions</RicashTableCell>
            </RicashTableRow>
          </RicashTableHeader>
          
          <RicashTableBody>
            {filteredRates.map((rate) => {
              const BaseIcon = getDeviseIcon(rate.deviseBase)
              const CibleIcon = getDeviseIcon(rate.deviseCible)
              
              return (
                <RicashTableRow key={rate.id} className="hover:bg-[#376470]/5 transition-all duration-200">
                  <RicashTableCell>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <BaseIcon className="h-5 w-5 text-[#2B8286]" />
                        <span className="font-semibold text-[#29475B]">{rate.deviseBase}</span>
                      </div>
                      <span className="text-[#376470]">→</span>
                      <div className="flex items-center space-x-2">
                        <CibleIcon className="h-5 w-5 text-[#B19068]" />
                        <span className="font-semibold text-[#29475B]">{rate.deviseCible}</span>
                      </div>
                    </div>
                  </RicashTableCell>
                  
                  <RicashTableCell>
                    <div className="font-bold text-[#2B8286]">
                      {formatCurrency(rate.tauxAchat, rate.deviseCible)}
                    </div>
                    <div className="text-xs text-[#376470]">Achat</div>
                  </RicashTableCell>
                  
                  <RicashTableCell>
                    <div className="font-bold text-[#B19068]">
                      {formatCurrency(rate.tauxVente, rate.deviseCible)}
                    </div>
                    <div className="text-xs text-[#376470]">Vente</div>
                  </RicashTableCell>
                  
                  <RicashTableCell>
                    <div className="flex items-center space-x-2">
                      {getVariationIcon(rate.variation)}
                      <span className={cn("font-semibold", getVariationColor(rate.variation))}>
                        {rate.variation > 0 ? '+' : ''}{rate.variation.toFixed(2)}%
                      </span>
                    </div>
                    <div className="text-xs text-[#376470] mt-1">
                      Spread: {((rate.tauxVente - rate.tauxAchat) / rate.tauxAchat * 100).toFixed(2)}%
                    </div>
                  </RicashTableCell>
                  
                  <RicashTableCell>
                    <div className="text-sm text-[#29475B]">
                      {formatDate(rate.derniereMAJ)}
                    </div>
                    <div className="text-xs text-[#376470]">
                      {Math.round((Date.now() - new Date(rate.derniereMAJ)) / (1000 * 60))} min
                    </div>
                  </RicashTableCell>
                  
                  <RicashTableCell>
                    <div className="text-sm font-medium text-[#29475B]">
                      {rate.source}
                    </div>
                    <div className="text-xs text-[#376470]">
                      Commission: {rate.commission}%
                    </div>
                  </RicashTableCell>
                  
                  <RicashTableCell>
                    <RicashStatusBadge
                      status={rate.statut}
                      text={rate.statut === 'success' ? 'Actif' : 
                            rate.statut === 'warning' ? 'Attention' :
                            rate.statut === 'error' ? 'Suspendu' : 'Info'}
                    />
                  </RicashTableCell>
                  
                  <RicashTableCell>
                    <RicashTableActionsDropdown
                      actions={[
                        {
                          label: "📊 Voir détails",
                          icon: "📊",
                          onClick: () => console.log('Voir détails:', rate),
                          variant: "default"
                        },
                        {
                          label: "✏️ Modifier",
                          icon: "✏️",
                          onClick: () => handleEditRate(rate),
                          variant: "default"
                        },
                        {
                          label: rate.statut !== 'error' ? "🚫 Suspendre" : "✅ Réactiver",
                          icon: rate.statut !== 'error' ? "🚫" : "✅",
                          onClick: () => handleSuspendRate(rate),
                          variant: rate.statut !== 'error' ? "warning" : "success"
                        },
                        {
                          label: "🗑️ Supprimer",
                          icon: "🗑️",
                          onClick: () => handleDeleteRate(rate.id),
                          variant: "danger"
                        }
                      ]}
                    />
                  </RicashTableCell>
                </RicashTableRow>
              )
            })}
          </RicashTableBody>
        </RicashTable>

        {filteredRates.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="mx-auto h-12 w-12 text-[#376470]/40 mb-4" />
            <h3 className="text-lg font-semibold text-[#29475B] mb-2">
              Aucun taux trouvé
            </h3>
            <p className="text-[#376470]">
              Aucun taux de change ne correspond à vos critères de recherche.
            </p>
          </div>
        )}
      </RicashTableCard>
    </div>
  )
})

ExchangeRates.displayName = 'ExchangeRates'

export default ExchangeRates
