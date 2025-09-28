import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Users, 
  ArrowLeftRight, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  TrendingDown,
  Activity,
  Shield,
  Zap,
  Plus,
  Eye,
  Download,
  Filter
} from 'lucide-react'
import { RicashCard, RicashStatCard, RicashTableCard } from '@/components/ui/ricash-card'
import { RicashButton, RicashIconButton } from '@/components/ui/ricash-button'
import { RicashStatusBadge } from '@/components/ui/ricash-table'
import { LoadingButton } from '@/components/ui/loading-button'
import { 
  EnhancedStatCard, 
  EnhancedChartContainer, 
  EnhancedTable, 
  EnhancedSearchBar,
  EnhancedActionBar,
  EnhancedEmptyState,
  EnhancedLoadingOverlay
} from '@/components/ui/enhanced-dashboard-components'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'

// Palette de couleurs Ricash
const RICASH_COLORS = {
  bleuFonce: '#29475B',
  dore: '#B19068',
  turquoise: '#2B8286',
  blancCasse: '#F4F2EE',
  bleuVert: '#376470'
}

const statsData = [
  {
    title: 'Utilisateurs actifs',
    value: '12,847',
    change: '+12%',
    changeType: 'positive',
    icon: Users,
    description: 'Ce mois',
    color: RICASH_COLORS.turquoise
  },
  {
    title: 'Transferts aujourd\'hui',
    value: '1,234',
    change: '+8%',
    changeType: 'positive',
    icon: ArrowLeftRight,
    description: 'Dernières 24h',
    color: RICASH_COLORS.dore
  },
  {
    title: 'Volume total',
    value: '€2.4M',
    change: '+15%',
    changeType: 'positive',
    icon: DollarSign,
    description: 'Ce mois',
    color: RICASH_COLORS.bleuFonce
  },
  {
    title: 'Taux de réussite',
    value: '98.5%',
    change: '+0.3%',
    changeType: 'positive',
    icon: TrendingUp,
    description: 'Dernière semaine',
    color: RICASH_COLORS.bleuVert
  }
]

const transfersData = [
  { name: 'Lun', transferts: 120, volume: 45000, revenue: 1200 },
  { name: 'Mar', transferts: 150, volume: 52000, revenue: 1450 },
  { name: 'Mer', transferts: 180, volume: 61000, revenue: 1680 },
  { name: 'Jeu', transferts: 165, volume: 58000, revenue: 1520 },
  { name: 'Ven', transferts: 200, volume: 72000, revenue: 1850 },
  { name: 'Sam', transferts: 140, volume: 48000, revenue: 1250 },
  { name: 'Dim', transferts: 110, volume: 38000, revenue: 980 }
]

const statusData = [
  { name: 'Complétés', value: 85, color: RICASH_COLORS.turquoise },
  { name: 'En cours', value: 10, color: RICASH_COLORS.dore },
  { name: 'En attente', value: 3, color: RICASH_COLORS.bleuVert },
  { name: 'Échoués', value: 2, color: '#ef4444' }
]

const recentTransfers = [
  {
    id: 'TXN001',
    sender: 'Jean Dupont',
    receiver: 'Marie Martin',
    amount: '€500',
    status: 'completed',
    time: '2 min',
    type: 'transfert'
  },
  {
    id: 'TXN002',
    sender: 'Pierre Durand',
    receiver: 'Sophie Leroy',
    amount: '€1,200',
    status: 'pending',
    time: '5 min',
    type: 'paiement'
  },
  {
    id: 'TXN003',
    sender: 'Michel Bernard',
    receiver: 'Claire Moreau',
    amount: '€750',
    status: 'completed',
    time: '8 min',
    type: 'transfert'
  },
  {
    id: 'TXN004',
    sender: 'Antoine Petit',
    receiver: 'Lucie Roux',
    amount: '€300',
    status: 'failed',
    time: '12 min',
    type: 'paiement'
  }
]

const alerts = [
  {
    id: 1,
    type: 'warning',
    message: 'Transfert suspect détecté - Montant élevé',
    time: '5 min',
    priority: 'high'
  },
  {
    id: 2,
    type: 'info',
    message: '15 documents KYC en attente de validation',
    time: '1h',
    priority: 'medium'
  },
  {
    id: 3,
    type: 'error',
    message: 'Connexion API partenaire interrompue',
    time: '2h',
    priority: 'high'
  }
]


const getStatusBadge = (status) => {
  switch (status) {
    case 'completed':
      return <RicashStatusBadge status="success" text="Complété" />
    case 'pending':
      return <RicashStatusBadge status="warning" text="En attente" />
    case 'failed':
      return <RicashStatusBadge status="error" text="Échoué" />
    default:
      return null
  }
}

const getAlertIcon = (type) => {
  switch (type) {
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-[#B19068]" />
    case 'error':
      return <XCircle className="h-4 w-4 text-red-500" />
    case 'info':
      return <CheckCircle className="h-4 w-4 text-[#2B8286]" />
    default:
      return null
  }
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return 'border-l-4 border-l-red-500 bg-red-50'
    case 'medium':
      return 'border-l-4 border-l-[#B19068] bg-[#B19068]/10'
    case 'low':
      return 'border-l-4 border-l-[#2B8286] bg-[#2B8286]/10'
    default:
      return ''
  }
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  
  const handleRefresh = async () => {
    if (isLoading) return // Protection simple
    
    try {
      setIsLoading(true)
      // Simuler un rechargement des données
      await new Promise(resolve => setTimeout(resolve, 1500))
    } catch (error) {
      console.error('Erreur lors de l\'actualisation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTransfer = () => {
    navigate('/app/transfers/create')
  }

  return (
    <div className="space-y-8 p-6 bg-[#F4F2EE] min-h-screen">
      {/* Page header avec design Ricash */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#376470]/10">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#29475B] mb-2">
              Dashboard Ricash
            </h1>
            <p className="text-lg text-[#376470] font-medium">
              Vue d'ensemble de votre plateforme de transferts
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
            <RicashButton variant="accent" size="lg" onClick={handleCreateTransfer}>
              <Plus className="mr-2 h-5 w-5" />
              Nouveau transfert
            </RicashButton>
          </div>
        </div>
      </div>

      {/* Stats cards avec design Ricash */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <RicashStatCard
              key={index} 
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            description={stat.description}
            icon={stat.icon}
            iconColor={stat.color}
            className="transform hover:scale-105 transition-transform duration-300"
          />
        ))}
      </div>

      {/* Graphiques principaux */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Graphique des transferts avec design Ricash */}
        <RicashCard className="overflow-hidden">
          <div className="p-6 border-b border-[#376470]/10">
            <h3 className="text-xl font-bold text-[#29475B] mb-2">
              Activité des transferts
            </h3>
            <p className="text-[#376470]">
              Nombre de transferts et volume cette semaine
            </p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={transfersData}>
                <defs>
                  <linearGradient id="colorTransferts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={RICASH_COLORS.turquoise} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={RICASH_COLORS.turquoise} stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={RICASH_COLORS.dore} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={RICASH_COLORS.dore} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={RICASH_COLORS.bleuVert} strokeOpacity={0.2} />
                <XAxis 
                  dataKey="name" 
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
                  dataKey="transferts" 
                  stroke={RICASH_COLORS.turquoise} 
                  fillOpacity={1} 
                  fill="url(#colorTransferts)" 
                  strokeWidth={3}
                />
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  stroke={RICASH_COLORS.dore} 
                  fillOpacity={1} 
                  fill="url(#colorVolume)" 
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </RicashCard>

        {/* Graphique circulaire avec design Ricash */}
        <RicashCard className="overflow-hidden">
          <div className="p-6 border-b border-[#376470]/10">
            <h3 className="text-xl font-bold text-[#29475B] mb-2">
              Statut des transferts
            </h3>
            <p className="text-[#376470]">
              Répartition des statuts aujourd'hui
            </p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={{ stroke: RICASH_COLORS.bleuFonce, strokeWidth: 1 }}
                >
                  {statusData.map((entry, index) => (
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

      {/* Tableau des transferts récents et alertes */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Transferts récents avec design Ricash */}
        <RicashTableCard
          title="Transferts récents"
          description="Dernières transactions effectuées"
          className="overflow-hidden"
        >
          <div className="space-y-3">
              {recentTransfers.map((transfer) => (
              <div 
                key={transfer.id} 
                className="flex items-center justify-between p-4 rounded-xl hover:bg-[#376470]/5 transition-all duration-200 border border-[#376470]/10"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transfer.type === 'transfert' ? 'bg-[#2B8286]/20' : 'bg-[#B19068]/20'
                  }`}>
                    {transfer.type === 'transfert' ? (
                      <ArrowLeftRight className="h-5 w-5 text-[#2B8286]" />
                    ) : (
                      <DollarSign className="h-5 w-5 text-[#B19068]" />
                    )}
                  </div>
                    <div>
                    <div className="font-semibold text-[#29475B]">{transfer.id}</div>
                    <div className="text-sm text-[#376470]">
                        {transfer.sender} → {transfer.receiver}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                  <div className="font-bold text-lg text-[#29475B]">{transfer.amount}</div>
                  <div className="text-sm text-[#376470]">Il y a {transfer.time}</div>
                  </div>
                  <div>
                    {getStatusBadge(transfer.status)}
                  </div>
                </div>
              ))}
            </div>
          <div className="mt-6 pt-4 border-t border-[#376470]/10">
            <RicashButton 
              variant="outline" 
              className="w-full" 
              size="lg"
              onClick={() => navigate('/app/transfers')}
            >
              Voir tous les transferts
            </RicashButton>
          </div>
        </RicashTableCard>

        {/* Alertes système avec design Ricash */}
        <RicashCard className="overflow-hidden border-l-4 border-l-[#B19068]">
          <div className="p-6 border-b border-[#376470]/10 bg-gradient-to-r from-[#B19068]/5 to-transparent">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#B19068]/20 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-[#B19068]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#29475B]">
                  Alertes système
                </h3>
                <p className="text-[#376470]">
              Notifications importantes nécessitant votre attention
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-4 rounded-xl ${getPriorityColor(alert.priority)} border border-[#376470]/10`}
                >
                  <div className="flex items-start space-x-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                      <div className="text-sm font-medium text-[#29475B]">{alert.message}</div>
                      <div className="text-xs text-[#376470] mt-1">
                      Il y a {alert.time}
                      </div>
                    </div>
                    <RicashButton variant="ghost" size="sm">
                      Traiter
                    </RicashButton>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-[#376470]/10">
              <RicashButton variant="outline" className="w-full" size="lg">
              Voir toutes les alertes
              </RicashButton>
            </div>
          </div>
        </RicashCard>
      </div>

      {/* Section des métriques avancées */}
      <RicashCard className="overflow-hidden">
        <div className="p-6 border-b border-[#376470]/10">
          <h3 className="text-xl font-bold text-[#29475B] mb-2">
            Métriques de performance
          </h3>
          <p className="text-[#376470]">
            Indicateurs clés de votre plateforme
          </p>
        </div>
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-[#2B8286]/10 to-[#2B8286]/5">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#2B8286]/20 flex items-center justify-center">
                <Activity className="h-8 w-8 text-[#2B8286]" />
              </div>
              <div className="text-2xl font-bold text-[#29475B]">99.8%</div>
              <div className="text-sm text-[#376470]">Uptime système</div>
            </div>
            
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-[#B19068]/10 to-[#B19068]/5">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#B19068]/20 flex items-center justify-center">
                <Shield className="h-8 w-8 text-[#B19068]" />
              </div>
              <div className="text-2xl font-bold text-[#29475B]">100%</div>
              <div className="text-sm text-[#376470]">Sécurité validée</div>
            </div>
            
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-[#376470]/10 to-[#376470]/5">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#376470]/20 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-[#376470]" />
              </div>
              <div className="text-2xl font-bold text-[#29475B]">+23%</div>
              <div className="text-sm text-[#376470]">Croissance mensuelle</div>
            </div>
          </div>
        </div>
      </RicashCard>

    </div>
  )
}

