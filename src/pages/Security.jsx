import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Shield, 
  AlertTriangle, 
  Lock, 
  Eye, 
  Clock,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  TrendingUp,
  Activity,
  Key,
  UserCheck,
  Ban,
  Search,
  Filter,
  Download,
  RefreshCw,
  Plus,
  Settings,
  Bell,
  Zap,
  Globe,
  Building2,
  Target,
  BarChart3
} from 'lucide-react'
import { RicashCard, RicashStatCard, RicashTableCard } from '@/components/ui/ricash-card'
import { RicashButton, RicashIconButton } from '@/components/ui/ricash-button'
import { RicashInput } from '@/components/ui/ricash-input'
import { RicashSelect } from '@/components/ui/ricash-input'
import { RicashTabs, RicashTabsContent, RicashTabsList, RicashTabsTrigger } from '@/components/ui/ricash-navigation'
// Import modals
// Les modals ont été convertis en pages dédiées
import { RicashTable, RicashTableHeader, RicashTableBody, RicashTableRow, RicashTableCell, RicashStatusBadge } from '@/components/ui/ricash-table'
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
  Area,
  AreaChart
} from 'recharts'

// Palette de couleurs Ricash
const RICASH_COLORS = {
  bleuFonce: '#29475B',
  dore: '#B19068',
  turquoise: '#2B8286',
  blancCasse: '#F4F2EE',
  bleuVert: '#376470'
}

// Mock data for security metrics
const securityStats = [
  {
    title: 'Tentatives de fraude détectées',
    value: '23',
    change: '-15%',
    changeType: 'positive',
    icon: Shield,
    description: 'Cette semaine'
  },
  {
    title: 'Comptes bloqués',
    value: '8',
    change: '+2',
    changeType: 'neutral',
    icon: Ban,
    description: 'Dernières 24h'
  },
  {
    title: 'Score de conformité',
    value: '98.5%',
    change: '+0.5%',
    changeType: 'positive',
    icon: CheckCircle,
    description: 'Audit mensuel'
  },
  {
    title: 'Alertes actives',
    value: '12',
    change: '-3',
    changeType: 'positive',
    icon: AlertTriangle,
    description: 'Nécessitent attention'
  }
]

const fraudData = [
  { month: 'Jan', detected: 45, blocked: 43, ratio: 95.6 },
  { month: 'Fév', detected: 38, blocked: 36, ratio: 94.7 },
  { month: 'Mar', detected: 52, blocked: 50, ratio: 96.2 },
  { month: 'Avr', detected: 41, blocked: 40, ratio: 97.6 },
  { month: 'Mai', detected: 29, blocked: 28, ratio: 96.6 },
  { month: 'Jun', detected: 23, blocked: 23, ratio: 100 }
]

const complianceData = [
  { name: 'KYC Conforme', value: 95, color: RICASH_COLORS.turquoise },
  { name: 'AML Conforme', value: 98, color: RICASH_COLORS.bleuVert },
  { name: 'GDPR Conforme', value: 97, color: RICASH_COLORS.dore },
  { name: 'PCI DSS', value: 100, color: RICASH_COLORS.bleuFonce }
]

const securityAlerts = [
  {
    id: 'SEC001',
    type: 'critical',
    title: 'Tentative de connexion suspecte',
    description: 'Connexion depuis une IP non autorisée',
    timestamp: '2024-01-20T14:30:00',
    status: 'active',
    priority: 'high'
  },
  {
    id: 'SEC002',
    type: 'warning',
    title: 'Mise à jour de sécurité requise',
    description: 'Version de l\'API obsolète détectée',
    timestamp: '2024-01-20T12:15:00',
    status: 'pending',
    priority: 'medium'
  },
  {
    id: 'SEC003',
    type: 'info',
    title: 'Audit de sécurité programmé',
    description: 'Audit trimestriel prévu pour le 25 janvier',
    timestamp: '2024-01-20T10:00:00',
    status: 'scheduled',
    priority: 'low'
  },
  {
    id: 'SEC004',
    type: 'critical',
    title: 'Violation de politique détectée',
    description: 'Accès non autorisé à des données sensibles',
    timestamp: '2024-01-20T09:45:00',
    status: 'investigating',
    priority: 'high'
  }
]

const fraudAttempts = [
  {
    id: 'FRA001',
    type: 'phishing',
    source: '192.168.1.100',
    target: 'user@ricash.com',
    timestamp: '2024-01-20T15:30:00',
    status: 'blocked',
    risk: 'high'
  },
  {
    id: 'FRA002',
    type: 'brute_force',
    source: '203.45.67.89',
    target: 'admin@ricash.com',
    timestamp: '2024-01-20T14:20:00',
    status: 'detected',
    risk: 'medium'
  },
  {
    id: 'FRA003',
    type: 'suspicious_activity',
    source: 'Internal',
    target: 'agent_123',
    timestamp: '2024-01-20T13:15:00',
    status: 'investigating',
    risk: 'low'
  }
]

const getAlertTypeColor = (type) => {
  switch (type) {
    case 'critical':
      return 'error'
    case 'warning':
      return 'warning'
    case 'info':
      return 'info'
    default:
      return 'default'
  }
}

const getAlertTypeText = (type) => {
  switch (type) {
    case 'critical':
      return 'Critique'
    case 'warning':
      return 'Avertissement'
    case 'info':
      return 'Information'
    default:
      return type
  }
}

const getFraudTypeIcon = (type) => {
  switch (type) {
    case 'phishing':
      return <Shield className="h-4 w-4 text-[#ef4444]" />
    case 'brute_force':
      return <Lock className="h-4 w-4 text-[#f59e0b]" />
    case 'suspicious_activity':
      return <AlertTriangle className="h-4 w-4 text-[#3b82f6]" />
    default:
      return <AlertTriangle className="h-4 w-4 text-[#6b7280]" />
  }
}

const getFraudStatusColor = (status) => {
  switch (status) {
    case 'blocked':
      return 'success'
    case 'detected':
      return 'warning'
    case 'investigating':
      return 'info'
    default:
      return 'default'
  }
}

const getFraudStatusText = (status) => {
  switch (status) {
    case 'blocked':
      return 'Bloqué'
    case 'detected':
      return 'Détecté'
    case 'investigating':
      return 'En investigation'
    default:
      return status
  }
}

const getRiskColor = (risk) => {
  switch (risk) {
    case 'high':
      return 'text-red-600'
    case 'medium':
      return 'text-yellow-600'
    case 'low':
      return 'text-green-600'
    default:
      return 'text-gray-600'
  }
}

export default function Security() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    status: 'all',
    priority: 'all'
  })

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simuler un rechargement des données
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  const handleCreateAlert = () => {
    navigate('/app/security/alert/create')
  }

  const handleExportReport = () => {
    // Générer et télécharger un rapport CSV
    const csvContent = [
      ['ID', 'Type', 'Titre', 'Description', 'Horodatage', 'Statut', 'Priorité'].join(','),
      ...securityAlerts.map(alert => [
        alert.id,
        alert.type,
        alert.title,
        alert.description,
        new Date(alert.timestamp).toLocaleString(),
        alert.status,
        alert.priority
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `rapport_securite_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleViewAlert = (alertId) => {
    console.log('Voir l\'alerte:', alertId)
    // Ici vous pouvez ajouter la logique pour voir les détails de l'alerte
    // Par exemple, ouvrir un modal ou naviguer vers une page de détails
  }

  const handleManageAlert = (alertId) => {
    console.log('Gérer l\'alerte:', alertId)
    // Ici vous pouvez ajouter la logique pour gérer l'alerte
    // Par exemple, ouvrir un modal de gestion ou naviguer vers une page de gestion
  }

  const filteredAlerts = securityAlerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         alert.description.toLowerCase().includes(filters.search.toLowerCase())
    const matchesType = filters.type === 'all' || alert.type === filters.type
    const matchesStatus = filters.status === 'all' || alert.status === filters.status
    const matchesPriority = filters.priority === 'all' || alert.priority === filters.priority

    return matchesSearch && matchesType && matchesStatus && matchesPriority
  })

  const filteredFraudAttempts = fraudAttempts.filter(attempt => {
    const matchesSearch = attempt.type.toLowerCase().includes(filters.search.toLowerCase()) ||
                         attempt.target.toLowerCase().includes(filters.search.toLowerCase())
    const matchesStatus = filters.status === 'all' || attempt.status === filters.status

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8 p-6 bg-[#F4F2EE] min-h-screen">
      {/* Page header avec design Ricash */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#376470]/10">
        <div className="flex justify-between items-center">
        <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#29475B] mb-2">
              Sécurité & Conformité
            </h1>
            <p className="text-lg text-[#376470] font-medium">
              Surveillez et gérez la sécurité de votre plateforme
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
              variant="outline"
              size="lg"
              onClick={handleExportReport}
            >
              <Download className="mr-2 h-5 w-5" />
              Exporter
            </RicashButton>
            <RicashButton 
              variant="accent"
              size="lg"
              onClick={handleCreateAlert}
            >
              <Plus className="mr-2 h-5 w-5" />
              Nouvelle alerte
            </RicashButton>
          </div>
        </div>
      </div>

      {/* Stats cards avec design Ricash */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {securityStats.map((stat, index) => (
          <RicashStatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            description={stat.description}
            icon={stat.icon}
            iconColor={RICASH_COLORS.turquoise}
            className="transform hover:scale-105 transition-transform duration-300"
          />
        ))}
      </div>

      {/* Filtres avec design Ricash */}
      <RicashCard className="overflow-hidden">
        <div className="p-6 border-b border-[#376470]/10">
          <h3 className="text-xl font-bold text-[#29475B] mb-4">
            Filtres et recherche
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#376470]" />
              <RicashInput
                placeholder="Rechercher..."
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
              <option value="critical">Critique</option>
              <option value="warning">Avertissement</option>
              <option value="info">Information</option>
            </RicashSelect>

            <RicashSelect
              value={filters.status}
              onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="pending">En attente</option>
              <option value="resolved">Résolu</option>
            </RicashSelect>

            <RicashSelect
              value={filters.priority}
              onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}
            >
              <option value="all">Toutes les priorités</option>
              <option value="high">Haute</option>
              <option value="medium">Moyenne</option>
              <option value="low">Basse</option>
            </RicashSelect>
                        </div>
                      </div>
      </RicashCard>

      {/* Onglets de sécurité avec design Ricash */}
      <RicashTabs defaultValue="overview" className="w-full">
        <RicashTabsList className="grid w-full grid-cols-4 bg-white rounded-2xl shadow-lg border border-[#376470]/10">
          <RicashTabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Vue d'ensemble</span>
          </RicashTabsTrigger>
          <RicashTabsTrigger value="alerts" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Alertes</span>
          </RicashTabsTrigger>
          <RicashTabsTrigger value="fraud" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Fraude</span>
          </RicashTabsTrigger>
          <RicashTabsTrigger value="compliance" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Conformité</span>
          </RicashTabsTrigger>
        </RicashTabsList>

        {/* Onglet Vue d'ensemble */}
        <RicashTabsContent value="overview" className="space-y-6">
          {/* Graphique des tentatives de fraude */}
          <RicashCard className="overflow-hidden">
            <div className="p-6 border-b border-[#376470]/10">
              <h3 className="text-xl font-bold text-[#29475B] mb-2">
                Évolution des tentatives de fraude
              </h3>
              <p className="text-[#376470]">
                Détection et blocage des tentatives de fraude
              </p>
                      </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={fraudData}>
                  <defs>
                    <linearGradient id="colorDetected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={RICASH_COLORS.turquoise} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={RICASH_COLORS.turquoise} stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={RICASH_COLORS.dore} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={RICASH_COLORS.dore} stopOpacity={0.1}/>
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
                    dataKey="detected" 
                    stroke={RICASH_COLORS.turquoise} 
                    fillOpacity={1} 
                    fill="url(#colorDetected)" 
                    strokeWidth={3}
                    name="Détectées"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="blocked" 
                    stroke={RICASH_COLORS.dore} 
                    fillOpacity={1} 
                    fill="url(#colorBlocked)" 
                    strokeWidth={3}
                    name="Bloquées"
                  />
                </AreaChart>
              </ResponsiveContainer>
                    </div>
          </RicashCard>

          {/* Score de conformité et alertes récentes */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Score de conformité */}
            <RicashCard className="overflow-hidden">
              <div className="p-6 border-b border-[#376470]/10">
                <h3 className="text-xl font-bold text-[#29475B] mb-2">
                  Score de conformité
                </h3>
                <p className="text-[#376470]">
                  État de la conformité réglementaire
                </p>
                          </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={complianceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={{ stroke: RICASH_COLORS.bleuFonce, strokeWidth: 1 }}
                    >
                      {complianceData.map((entry, index) => (
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

            {/* Alertes récentes */}
            <RicashCard className="overflow-hidden">
              <div className="p-6 border-b border-[#376470]/10">
                <h3 className="text-xl font-bold text-[#29475B] mb-2">
                  Alertes récentes
                </h3>
                <p className="text-[#376470]">
                  Dernières alertes de sécurité
                </p>
                    </div>
              <div className="p-6">
                <div className="space-y-4">
                  {securityAlerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="flex items-center space-x-3 p-3 rounded-xl bg-[#376470]/5 border border-[#376470]/10">
                          <div className={`w-3 h-3 rounded-full ${
                        alert.type === 'critical' ? 'bg-red-500' :
                        alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <div className="font-semibold text-[#29475B] text-sm">{alert.title}</div>
                        <div className="text-xs text-[#376470]">{alert.description}</div>
                          </div>
                      <div className="text-xs text-[#376470]">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                          ))}
                        </div>
                      </div>
            </RicashCard>
                    </div>
        </RicashTabsContent>

        {/* Onglet Alertes */}
        <RicashTabsContent value="alerts" className="space-y-6">
          <RicashTableCard
            title="Alertes de sécurité"
            description={`${filteredAlerts.length} alerte(s) trouvée(s)`}
            className="overflow-hidden"
          >
            <RicashTable>
              <RicashTableHeader>
                <RicashTableRow>
                  <RicashTableCell className="font-semibold text-[#29475B]">Type</RicashTableCell>
                  <RicashTableCell className="font-semibold text-[#29475B]">Alerte</RicashTableCell>
                  <RicashTableCell className="font-semibold text-[#29475B]">Description</RicashTableCell>
                  <RicashTableCell className="font-semibold text-[#29475B]">Horodatage</RicashTableCell>
                  <RicashTableCell className="font-semibold text-[#29475B]">Statut</RicashTableCell>
                  <RicashTableCell className="font-semibold text-[#29475B]">Actions</RicashTableCell>
                </RicashTableRow>
              </RicashTableHeader>
              <RicashTableBody>
                {filteredAlerts.map((alert) => (
                  <RicashTableRow key={alert.id} className="hover:bg-[#376470]/5 transition-colors">
                    <RicashTableCell>
                      <RicashStatusBadge 
                        status={getAlertTypeColor(alert.type)} 
                        text={getAlertTypeText(alert.type)} 
                      />
                    </RicashTableCell>
                    <RicashTableCell>
                      <div className="font-semibold text-[#29475B]">{alert.title}</div>
                      <div className="text-sm text-[#376470]">ID: {alert.id}</div>
                    </RicashTableCell>
                    <RicashTableCell>
                      <div className="text-[#376470] max-w-xs truncate">{alert.description}</div>
                    </RicashTableCell>
                    <RicashTableCell>
                      <div className="text-[#376470]">
                        {new Date(alert.timestamp).toLocaleString()}
                    </div>
                    </RicashTableCell>
                    <RicashTableCell>
                        <div className="flex items-center space-x-2">
                        <RicashStatusBadge 
                          status={alert.status === 'active' ? 'error' : 
                                 alert.status === 'pending' ? 'warning' : 'success'} 
                          text={alert.status} 
                        />
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                          alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {alert.priority}
                        </span>
                        </div>
                    </RicashTableCell>
                    <RicashTableCell>
                      <div className="flex items-center space-x-2">
                        <RicashIconButton
                          variant="ghost"
                          size="sm"
                          className="text-[#2B8286] hover:bg-[#2B8286]/10"
                          onClick={() => handleViewAlert(alert.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </RicashIconButton>
                        <RicashIconButton
                          variant="ghost"
                          size="sm"
                          className="text-[#B19068] hover:bg-[#B19068]/10"
                          onClick={() => handleManageAlert(alert.id)}
                        >
                          <Settings className="h-4 w-4" />
                        </RicashIconButton>
                      </div>
                    </RicashTableCell>
                  </RicashTableRow>
                ))}
              </RicashTableBody>
            </RicashTable>
          </RicashTableCard>
        </RicashTabsContent>

        {/* Onglet Fraude */}
        <RicashTabsContent value="fraud" className="space-y-6">
          <RicashTableCard
            title="Tentatives de fraude"
            description={`${filteredFraudAttempts.length} tentative(s) détectée(s)`}
            className="overflow-hidden"
          >
            <RicashTable>
              <RicashTableHeader>
                <RicashTableRow>
                  <RicashTableCell className="font-semibold text-[#29475B]">Type</RicashTableCell>
                  <RicashTableCell className="font-semibold text-[#29475B]">Source</RicashTableCell>
                  <RicashTableCell className="font-semibold text-[#29475B]">Cible</RicashTableCell>
                  <RicashTableCell className="font-semibold text-[#29475B]">Horodatage</RicashTableCell>
                  <RicashTableCell className="font-semibold text-[#29475B]">Statut</RicashTableCell>
                  <RicashTableCell className="font-semibold text-[#29475B]">Risque</RicashTableCell>
                </RicashTableRow>
              </RicashTableHeader>
              <RicashTableBody>
                {filteredFraudAttempts.map((attempt) => (
                  <RicashTableRow key={attempt.id} className="hover:bg-[#376470]/5 transition-colors">
                    <RicashTableCell>
                        <div className="flex items-center space-x-2">
                        {getFraudTypeIcon(attempt.type)}
                        <span className="text-[#29475B] font-medium">{attempt.type}</span>
                        </div>
                    </RicashTableCell>
                    <RicashTableCell>
                      <div className="text-[#29475B] font-medium">{attempt.source}</div>
                    </RicashTableCell>
                    <RicashTableCell>
                      <div className="text-[#376470]">{attempt.target}</div>
                    </RicashTableCell>
                    <RicashTableCell>
                      <div className="text-[#376470]">
                        {new Date(attempt.timestamp).toLocaleString()}
                      </div>
                    </RicashTableCell>
                    <RicashTableCell>
                      <RicashStatusBadge 
                        status={getFraudStatusColor(attempt.status)} 
                        text={getFraudStatusText(attempt.status)} 
                      />
                    </RicashTableCell>
                    <RicashTableCell>
                      <span className={`font-medium ${getRiskColor(attempt.risk)}`}>
                        {attempt.risk}
                      </span>
                    </RicashTableCell>
                  </RicashTableRow>
                ))}
              </RicashTableBody>
            </RicashTable>
          </RicashTableCard>
        </RicashTabsContent>

        {/* Onglet Conformité */}
        <RicashTabsContent value="compliance" className="space-y-6">
          <RicashCard className="overflow-hidden">
            <div className="p-6 border-b border-[#376470]/10">
              <h3 className="text-xl font-bold text-[#29475B] mb-2">
                État de la conformité
              </h3>
              <p className="text-[#376470]">
                Suivi des obligations réglementaires
              </p>
                        </div>
            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Graphique de conformité */}
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={complianceData}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                        labelLine={{ stroke: RICASH_COLORS.bleuFonce, strokeWidth: 1 }}
                      >
                        {complianceData.map((entry, index) => (
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

                {/* Détails de conformité */}
                <div className="space-y-4">
                  {complianceData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-[#376470]/5 border border-[#376470]/10">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-medium text-[#29475B]">{item.name}</span>
                    </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#29475B]">{item.value}%</div>
                        <div className="text-sm text-[#376470]">
                          {item.value === 100 ? 'Conforme' : 'Non conforme'}
                    </div>
                  </div>
                    </div>
                  ))}
                    </div>
                  </div>
                    </div>
          </RicashCard>
        </RicashTabsContent>
      </RicashTabs>
    </div>
  )
}
