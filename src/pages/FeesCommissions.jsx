import React, { useState, useMemo } from 'react'
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  DollarSign,
  Percent,
  ArrowLeftRight,
  Building2,
  Settings,
  TrendingUp,
  Calculator,
  Filter,
  Award,
  RefreshCw,
  RotateCcw,
  Globe,
  Target,
  PieChart as PieChartIcon,
  BarChart3,
  Activity,
  Shield,
  Zap
} from 'lucide-react'
import { RicashButton, RicashIconButton, RicashActionButton } from '@/components/ui/ricash-button'
import { RicashInput } from '@/components/ui/ricash-input'
import { RicashSelect } from '@/components/ui/ricash-input'
import { RicashCard, RicashStatCard, RicashTableCard } from '@/components/ui/ricash-card'
import { RicashTable, RicashTableHeader, RicashTableBody, RicashTableRow, RicashTableCell, RicashStatusBadge } from '@/components/ui/ricash-table'
import { RicashTabs, RicashTabsContent, RicashTabsList, RicashTabsTrigger } from '@/components/ui/ricash-navigation'
import { LoadingButton } from '@/components/ui/loading-button'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts'

// Import modals
// Les modals ont été convertis en pages dédiées

// Palette de couleurs Ricash
const RICASH_COLORS = {
  bleuFonce: '#29475B',
  dore: '#B19068',
  turquoise: '#2B8286',
  blancCasse: '#F4F2EE',
  bleuVert: '#376470'
}

// Mock data for fees and commissions
const initialFees = [
  {
    id: 'FEE001',
    nom: 'Transfert France → Sénégal',
    type: 'transfert',
    corridorOrigine: 'France',
    corridorDestination: 'Sénégal',
    montantMin: 0,
    montantMax: 500,
    fraisFixe: 15,
    fraisPourcentage: 2.5,
    commissionAgent: 1.5,
    commissionAgence: 3.0,
    statut: 'actif',
    dateCreation: '2024-01-01',
    derniereModification: '2024-01-15'
  },
  {
    id: 'FEE002',
    nom: 'Transfert France → Mali',
    type: 'transfert',
    corridorOrigine: 'France',
    corridorDestination: 'Mali',
    montantMin: 0,
    montantMax: 1000,
    fraisFixe: 18,
    fraisPourcentage: 3.0,
    commissionAgent: 1.8,
    commissionAgence: 3.5,
    statut: 'actif',
    dateCreation: '2024-01-01',
    derniereModification: '2024-01-10'
  },
  {
    id: 'FEE003',
    nom: 'Transfert Sénégal → France',
    type: 'transfert',
    corridorOrigine: 'Sénégal',
    corridorDestination: 'France',
    montantMin: 0,
    montantMax: 300,
    fraisFixe: 12,
    fraisPourcentage: 2.0,
    commissionAgent: 1.2,
    commissionAgence: 2.8,
    statut: 'actif',
    dateCreation: '2024-01-01',
    derniereModification: '2024-01-20'
  },
  {
    id: 'FEE004',
    nom: 'Paiement marchand',
    type: 'paiement',
    corridorOrigine: 'Tous',
    corridorDestination: 'Tous',
    montantMin: 0,
    montantMax: 2000,
    fraisFixe: 25,
    fraisPourcentage: 1.5,
    commissionAgent: 2.0,
    commissionAgence: 4.0,
    statut: 'inactif',
    dateCreation: '2024-01-01',
    derniereModification: '2024-01-05'
  },
  {
    id: 'FEE005',
    nom: 'Transfert express',
    type: 'express',
    corridorOrigine: 'France',
    corridorDestination: 'Sénégal',
    montantMin: 0,
    montantMax: 1000,
    fraisFixe: 30,
    fraisPourcentage: 4.0,
    commissionAgent: 2.5,
    commissionAgence: 5.0,
    statut: 'actif',
    dateCreation: '2024-01-01',
    derniereModification: '2024-01-18'
  }
]

const formatCurrency = (amount) => {
  if (amount === 0) return '€0'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatPercentage = (value) => {
  if (value === 0) return '0%'
  return `${value.toFixed(1)}%`
}

const getStatusColor = (statut) => {
  switch (statut) {
    case 'actif':
      return 'success'
    case 'inactif':
      return 'error'
    case 'test':
      return 'warning'
    default:
      return 'default'
  }
}

const getStatusText = (statut) => {
  switch (statut) {
    case 'actif':
      return 'Actif'
    case 'inactif':
      return 'Inactif'
    case 'test':
      return 'En test'
    default:
      return statut
  }
}

const getTypeIcon = (type) => {
  switch (type) {
    case 'transfert':
      return <ArrowLeftRight className="h-4 w-4 text-[#2B8286]" />
    case 'paiement':
      return <DollarSign className="h-4 w-4 text-[#B19068]" />
    case 'express':
      return <Zap className="h-4 w-4 text-[#376470]" />
    default:
      return <Globe className="h-4 w-4 text-[#29475B]" />
  }
}

const getTypeColor = (type) => {
  switch (type) {
    case 'transfert':
      return 'bg-[#2B8286]/20 text-[#2B8286]'
    case 'paiement':
      return 'bg-[#B19068]/20 text-[#B19068]'
    case 'express':
      return 'bg-[#376470]/20 text-[#376470]'
    default:
      return 'bg-[#29475B]/20 text-[#29475B]'
  }
}

// Données pour les graphiques
const revenueData = [
  { month: 'Jan', revenue: 45000, fees: 12000, commissions: 8000 },
  { month: 'Fév', revenue: 52000, fees: 13500, commissions: 9200 },
  { month: 'Mar', revenue: 48000, fees: 11800, commissions: 7800 },
  { month: 'Avr', revenue: 61000, fees: 15800, commissions: 10500 },
  { month: 'Mai', revenue: 58000, fees: 14200, commissions: 9500 },
  { month: 'Juin', revenue: 67000, fees: 16800, commissions: 11200 }
]

const corridorData = [
  { name: 'France → Sénégal', value: 45, color: RICASH_COLORS.turquoise },
  { name: 'France → Mali', value: 25, color: RICASH_COLORS.dore },
  { name: 'Sénégal → France', value: 20, color: RICASH_COLORS.bleuVert },
  { name: 'Autres', value: 10, color: RICASH_COLORS.bleuFonce }
]

export default function FeesCommissions() {
  const [fees, setFees] = useState(initialFees)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFee, setSelectedFee] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    statut: 'all',
    corridor: 'all'
  })

  const filteredFees = useMemo(() => {
    return fees.filter(fee => {
      const matchesSearch = fee.nom.toLowerCase().includes(filters.search.toLowerCase()) ||
        fee.corridorOrigine.toLowerCase().includes(filters.search.toLowerCase()) ||
        fee.corridorDestination.toLowerCase().includes(filters.search.toLowerCase())
      const matchesType = filters.type === 'all' || fee.type === filters.type
      const matchesStatut = filters.statut === 'all' || fee.statut === filters.statut
      const matchesCorridor = filters.corridor === 'all' || 
                             fee.corridorOrigine === filters.corridor || 
                             fee.corridorDestination === filters.corridor

      return matchesSearch && matchesType && matchesStatut && matchesCorridor
  })
  }, [fees, filters])

  const stats = useMemo(() => {
    const totalFees = fees.length
    const activeFees = fees.filter(f => f.statut === 'actif').length
    const totalRevenue = fees.reduce((sum, f) => sum + f.fraisFixe, 0)
    const averageCommissionRate = fees.length > 0 ? 
      fees.reduce((sum, f) => sum + f.commissionAgent + f.commissionAgence, 0) / fees.length : 0

    return {
      totalFees,
      activeFees,
      totalRevenue,
      averageCommissionRate
    }
  }, [fees])

  const handleCreateFee = (feeData) => {
      const newFee = {
        ...feeData,
        id: `FEE${String(fees.length + 1).padStart(3, '0')}`,
        dateCreation: new Date().toISOString().split('T')[0],
        derniereModification: new Date().toISOString().split('T')[0]
      }
      setFees(prev => [...prev, newFee])
    }

  const handleEditFee = (feeId, updatedData) => {
    setFees(prev => prev.map(fee => 
      fee.id === feeId 
        ? { ...fee, ...updatedData, derniereModification: new Date().toISOString().split('T')[0] }
        : fee
    ))
  }

  const handleDeleteFee = (feeId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette configuration de frais ? Cette action est irréversible.')) {
      setFees(prev => prev.filter(fee => fee.id !== feeId))
    }
  }

  const handleToggleStatus = (feeId) => {
    setFees(prev => prev.map(fee => 
      fee.id === feeId 
        ? { ...fee, statut: fee.statut === 'actif' ? 'inactif' : 'actif' }
        : fee
    ))
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simuler un rechargement des données
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  return (
    <div className="space-y-8 p-6 bg-[#F4F2EE] min-h-screen">
      {/* Page header avec design Ricash */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#376470]/10">
        <div className="flex justify-between items-center">
        <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#29475B] mb-2">
              Frais & Commissions
            </h1>
            <p className="text-lg text-[#376470] font-medium">
              Gérez vos configurations de frais et commissions par corridor
          </p>
        </div>
          <div className="flex gap-3">
            <RicashButton
            variant="outline" 
              size="lg"
            onClick={handleRefresh}
            loading={isLoading}
              loadingText="Actualisation..."
          >
              <RefreshCw className="mr-2 h-5 w-5" />
            Actualiser
            </RicashButton>
            <RicashButton 
              variant="accent"
              size="lg"
              onClick={() => navigate('/app/settings/fees/config')}
            >
              <Plus className="mr-2 h-5 w-5" />
          Nouvelle configuration
            </RicashButton>
          </div>
        </div>
      </div>

      {/* Stats cards avec design Ricash */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <RicashStatCard
          title="Total configurations"
          value={stats.totalFees.toString()}
          change="+2"
          changeType="positive"
          description="Ce mois"
          icon={Settings}
          iconColor={RICASH_COLORS.turquoise}
          className="transform hover:scale-105 transition-transform duration-300"
        />
        <RicashStatCard
          title="Configurations actives"
          value={stats.activeFees.toString()}
          change="+1"
          changeType="positive"
          description="Ce mois"
          icon={Target}
          iconColor={RICASH_COLORS.dore}
          className="transform hover:scale-105 transition-transform duration-300"
        />
        <RicashStatCard
          title="Revenus totaux"
          value={formatCurrency(stats.totalRevenue)}
          change="+15%"
          changeType="positive"
          description="Ce mois"
          icon={DollarSign}
          iconColor={RICASH_COLORS.bleuFonce}
          className="transform hover:scale-105 transition-transform duration-300"
        />
        <RicashStatCard
          title="Taux commission moyen"
          value={formatPercentage(stats.averageCommissionRate)}
          change="+0.3%"
          changeType="positive"
          description="Ce mois"
          icon={Percent}
          iconColor={RICASH_COLORS.bleuVert}
          className="transform hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Graphiques avec design Ricash */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Graphique des revenus */}
        <RicashCard className="overflow-hidden">
          <div className="p-6 border-b border-[#376470]/10">
            <h3 className="text-xl font-bold text-[#29475B] mb-2">
              Évolution des revenus
            </h3>
            <p className="text-[#376470]">
              Revenus, frais et commissions sur 6 mois
                  </p>
                </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={RICASH_COLORS.turquoise} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={RICASH_COLORS.turquoise} stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorFees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={RICASH_COLORS.dore} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={RICASH_COLORS.dore} stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorCommissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={RICASH_COLORS.bleuVert} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={RICASH_COLORS.bleuVert} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={RICASH_COLORS.bleuVert} strokeOpacity={0.2} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: RICASH_COLORS.bleuFonce, fontSize: 12 }}
                  axisLine={{ stroke: RICASH_COLORS.bleuVert, strokeOpacity: 0.3 }}
                />
                <YAxis 
                  tick={{ fill: RICASH_COLORS.bleuFonce, fontSize: 12 }}
                  axisLine={{ stroke: RICASH_COLORS.bleuVert, strokeOpacity: 0.3 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: RICASH_COLORS.blancCasse,
                    border: `1px solid ${RICASH_COLORS.bleuVert}`,
                    borderRadius: '8px',
                    color: RICASH_COLORS.bleuFonce
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke={RICASH_COLORS.turquoise} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  strokeWidth={3}
                  name="Revenus"
                />
                <Area 
                  type="monotone" 
                  dataKey="fees" 
                  stroke={RICASH_COLORS.dore} 
                  fillOpacity={1} 
                  fill="url(#colorFees)" 
                  strokeWidth={3}
                  name="Frais"
                />
                <Area 
                  type="monotone" 
                  dataKey="commissions" 
                  stroke={RICASH_COLORS.bleuVert} 
                  fillOpacity={1} 
                  fill="url(#colorCommissions)" 
                  strokeWidth={3}
                  name="Commissions"
                />
              </AreaChart>
            </ResponsiveContainer>
                  </div>
        </RicashCard>

        {/* Graphique des corridors */}
        <RicashCard className="overflow-hidden">
          <div className="p-6 border-b border-[#376470]/10">
            <h3 className="text-xl font-bold text-[#29475B] mb-2">
              Répartition par corridor
            </h3>
            <p className="text-[#376470]">
              Volume des transferts par corridor
            </p>
          </div>
          <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                  data={corridorData}
                      cx="50%"
                      cy="50%"
                  outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={{ stroke: RICASH_COLORS.bleuFonce, strokeWidth: 1 }}
                >
                  {corridorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: RICASH_COLORS.blancCasse,
                    border: `1px solid ${RICASH_COLORS.bleuVert}`,
                    borderRadius: '8px',
                    color: RICASH_COLORS.bleuFonce
                  }}
                />
                  </PieChart>
                </ResponsiveContainer>
          </div>
        </RicashCard>
      </div>

      {/* Filtres et recherche avec design Ricash */}
      <RicashCard className="overflow-hidden">
        <div className="p-6 border-b border-[#376470]/10">
          <h3 className="text-xl font-bold text-[#29475B] mb-4">
            Filtres et recherche
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#376470]" />
              <RicashInput
                placeholder="Rechercher une configuration..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
          </div>

            <RicashSelect
              value={filters.type}
              onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
            >
              <option value="all">Tous les types</option>
              <option value="transfert">Transfert</option>
              <option value="paiement">Paiement</option>
              <option value="express">Express</option>
            </RicashSelect>

            <RicashSelect
              value={filters.statut}
              onValueChange={(value) => setFilters(prev => ({ ...prev, statut: value }))}
            >
              <option value="all">Tous les statuts</option>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
              <option value="test">En test</option>
            </RicashSelect>

            <RicashSelect
              value={filters.corridor}
              onValueChange={(value) => setFilters(prev => ({ ...prev, corridor: value }))}
            >
              <option value="all">Tous les corridors</option>
              <option value="France">France</option>
              <option value="Sénégal">Sénégal</option>
              <option value="Mali">Mali</option>
            </RicashSelect>
                    </div>
                    </div>
      </RicashCard>

      {/* Tableau des configurations avec design Ricash */}
      <RicashTableCard
        title="Configurations de frais"
        description={`${filteredFees.length} configuration(s) trouvée(s)`}
        className="overflow-hidden"
      >
        <RicashTable>
          <RicashTableHeader>
            <RicashTableRow>
              <RicashTableCell className="font-semibold text-[#29475B]">Configuration</RicashTableCell>
              <RicashTableCell className="font-semibold text-[#29475B]">Corridor</RicashTableCell>
              <RicashTableCell className="font-semibold text-[#29475B]">Frais</RicashTableCell>
              <RicashTableCell className="font-semibold text-[#29475B]">Commissions</RicashTableCell>
              <RicashTableCell className="font-semibold text-[#29475B]">Statut</RicashTableCell>
              <RicashTableCell className="font-semibold text-[#29475B]">Actions</RicashTableCell>
            </RicashTableRow>
          </RicashTableHeader>
          <RicashTableBody>
            {filteredFees.map((fee) => (
              <RicashTableRow key={fee.id} className="hover:bg-[#376470]/5 transition-colors">
                <RicashTableCell>
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(fee.type)}`}>
                      {getTypeIcon(fee.type)}
                    </div>
                    <div>
                      <div className="font-semibold text-[#29475B]">{fee.nom}</div>
                      <div className="text-sm text-[#376470]">ID: {fee.id}</div>
                      <div className="text-xs text-[#376470]/70">
                        Créé le {new Date(fee.dateCreation).toLocaleDateString('fr-FR')}
                    </div>
                    </div>
                  </div>
                </RicashTableCell>
                
                <RicashTableCell>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-sm">
                      <Globe className="h-3 w-3 text-[#376470]" />
                      <span className="text-[#29475B]">{fee.corridorOrigine}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <ArrowLeftRight className="h-3 w-3 text-[#376470]" />
                      <span className="text-[#29475B]">{fee.corridorDestination}</span>
                    </div>
                  </div>
                </RicashTableCell>
                
                <RicashTableCell>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#376470]">Fixe:</span>
                      <span className="font-medium text-[#29475B]">
                        {formatCurrency(fee.fraisFixe)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#376470]">%:</span>
                      <span className="font-medium text-[#29475B]">
                        {formatPercentage(fee.fraisPourcentage)}
                      </span>
                    </div>
                    <div className="text-xs text-[#376470]/70">
                      {formatCurrency(fee.montantMin)} - {formatCurrency(fee.montantMax)}
                    </div>
                  </div>
                </RicashTableCell>
                
                <RicashTableCell>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#376470]">Agent:</span>
                      <span className="font-medium text-[#29475B]">
                        {formatPercentage(fee.commissionAgent)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#376470]">Agence:</span>
                      <span className="font-medium text-[#29475B]">
                        {formatPercentage(fee.commissionAgence)}
                      </span>
                    </div>
                    <div className="text-xs text-[#376470]/70">
                      Total: {formatPercentage(fee.commissionAgent + fee.commissionAgence)}
                    </div>
                  </div>
                </RicashTableCell>
                
                <RicashTableCell>
                  <RicashStatusBadge 
                    status={getStatusColor(fee.statut)} 
                    text={getStatusText(fee.statut)} 
                  />
                </RicashTableCell>
                
                <RicashTableCell>
                  <div className="flex items-center space-x-2">
                    <RicashIconButton
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/app/settings/fees/config')}
                      className="text-[#2B8286] hover:bg-[#2B8286]/10"
                    >
                      <Edit className="h-4 w-4" />
                    </RicashIconButton>
                    
                    <RicashIconButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(fee.id)}
                      className="text-[#B19068] hover:bg-[#B19068]/10"
                    >
                      {fee.statut === 'actif' ? (
                        <Shield className="h-4 w-4" />
                      ) : (
                        <Target className="h-4 w-4" />
                      )}
                    </RicashIconButton>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <RicashIconButton
                          variant="ghost"
                          size="sm"
                          className="text-[#376470] hover:bg-[#376470]/10"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </RicashIconButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel className="text-[#29475B]">Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/app/settings/fees/config')}>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(fee.id)}>
                          {fee.statut === 'actif' ? (
                            <>
                              <Shield className="mr-2 h-4 w-4" />
                              Désactiver
                            </>
                          ) : (
                            <>
                              <Target className="mr-2 h-4 w-4" />
                              Activer
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteFee(fee.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </RicashTableCell>
              </RicashTableRow>
            ))}
          </RicashTableBody>
        </RicashTable>
      </RicashTableCard>
    </div>
  )
}
