import { useState } from 'react'
<<<<<<< HEAD
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb'
=======
>>>>>>> b2b435d85c9b4936f607c4f528b67c75a4e07405
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ArrowLeftRight, 
  DollarSign,
  Download,
  Calendar,
  Filter,
  FileText,
  PieChart as PieChartIcon,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Activity,
  Shield,
  Zap,
  Globe,
  Building2,
  Target,
  RefreshCw,
  Plus,
  Eye
} from 'lucide-react'
import { RicashCard, RicashStatCard, RicashTableCard } from '@/components/ui/ricash-card'
<<<<<<< HEAD
import { RICASH_COLORS } from '@/lib/palette'
=======
>>>>>>> b2b435d85c9b4936f607c4f528b67c75a4e07405
import { RicashButton, RicashIconButton } from '@/components/ui/ricash-button'
import { RicashSelect } from '@/components/ui/ricash-input'
import { RicashTabs, RicashTabsContent, RicashTabsList, RicashTabsTrigger } from '@/components/ui/ricash-navigation'
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

<<<<<<< HEAD
=======
// Palette de couleurs Ricash
const RICASH_COLORS = {
  bleuFonce: '#29475B',
  dore: '#B19068',
  turquoise: '#2B8286',
  blancCasse: '#F4F2EE',
  bleuVert: '#376470'
}

>>>>>>> b2b435d85c9b4936f607c4f528b67c75a4e07405
// Mock data for reports
const monthlyData = [
  { month: 'Jan', utilisateurs: 2400, transferts: 4800, volume: 980000, commissions: 12400 },
  { month: 'Fév', utilisateurs: 2600, transferts: 5200, volume: 1050000, commissions: 13200 },
  { month: 'Mar', utilisateurs: 2800, transferts: 5600, volume: 1120000, commissions: 14100 },
  { month: 'Avr', utilisateurs: 3000, transferts: 6000, volume: 1200000, commissions: 15000 },
  { month: 'Mai', utilisateurs: 3200, transferts: 6400, volume: 1280000, commissions: 16000 },
  { month: 'Jun', utilisateurs: 3400, transferts: 6800, volume: 1360000, commissions: 17000 }
]

const kycData = [
  { name: 'Validés', value: 68, color: RICASH_COLORS.turquoise },
  { name: 'En cours', value: 22, color: RICASH_COLORS.dore },
  { name: 'Rejetés', value: 7, color: '#ef4444' },
  { name: 'Non vérifiés', value: 3, color: RICASH_COLORS.bleuVert }
]

const transactionStatusData = [
  { name: 'Complétées', value: 85, color: RICASH_COLORS.turquoise },
  { name: 'En cours', value: 8, color: RICASH_COLORS.dore },
  { name: 'En attente', value: 5, color: RICASH_COLORS.bleuVert },
  { name: 'Échouées', value: 2, color: '#ef4444' }
]

const agencyPerformance = [
  { agence: 'Agence Paris Nord', transferts: 1245, volume: 425000, commission: 8500, taux: 98.5 },
  { agence: 'Agence Lyon Centre', transferts: 890, volume: 310000, commission: 6200, taux: 97.8 },
  { agence: 'Agence Marseille', transferts: 756, volume: 280000, commission: 5600, taux: 96.9 },
  { agence: 'Agence Toulouse', transferts: 623, volume: 215000, commission: 4300, taux: 98.1 },
  { agence: 'Agence Bordeaux', transferts: 534, volume: 185000, commission: 3700, taux: 97.5 }
]

const topCountries = [
  { pays: 'Sénégal', transferts: 3245, volume: 1250000, pourcentage: 35 },
  { pays: 'Mali', transferts: 2890, volume: 980000, pourcentage: 28 },
  { pays: 'Côte d\'Ivoire', transferts: 2156, volume: 750000, pourcentage: 22 },
  { pays: 'Burkina Faso', transferts: 1234, volume: 420000, pourcentage: 15 }
]

const recentReports = [
  { id: 'RPT001', nom: 'Rapport mensuel Janvier', type: 'Mensuel', date: '2024-02-01', statut: 'generated' },
  { id: 'RPT002', nom: 'Analyse KYC Q1', type: 'KYC', date: '2024-01-28', statut: 'processing' },
  { id: 'RPT003', nom: 'Performance agences', type: 'Agences', date: '2024-01-25', statut: 'generated' },
  { id: 'RPT004', nom: 'Audit conformité', type: 'Conformité', date: '2024-01-20', statut: 'generated' }
]

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatNumber = (num) => {
  return new Intl.NumberFormat('fr-FR').format(num)
}

const getStatusColor = (status) => {
  switch (status) {
    case 'generated':
      return 'success'
    case 'processing':
      return 'warning'
    case 'failed':
      return 'error'
    default:
      return 'default'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'generated':
      return 'Généré'
    case 'processing':
      return 'En cours'
    case 'failed':
      return 'Échoué'
    default:
      return status
  }
}

const getTypeIcon = (type) => {
  switch (type) {
    case 'Mensuel':
      return <Calendar className="h-4 w-4 text-[#2B8286]" />
    case 'KYC':
      return <Shield className="h-4 w-4 text-[#B19068]" />
    case 'Agences':
      return <Building2 className="h-4 w-4 text-[#376470]" />
    case 'Conformité':
      return <Target className="h-4 w-4 text-[#29475B]" />
    default:
      return <FileText className="h-4 w-4 text-[#376470]" />
  }
}

export default function Reports() {
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    periode: '6mois',
    type: 'all',
    agence: 'all'
  })

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simuler un rechargement des données
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  const handleGenerateReport = () => {
    // Logique pour générer un rapport
    console.log('Générer un nouveau rapport')
<<<<<<< HEAD
=======
    // Simulation de génération de rapport
    const newReport = {
      id: `RPT${Date.now()}`,
      nom: `Rapport ${new Date().toLocaleDateString('fr-FR')}`,
      type: 'Mensuel',
      date: new Date().toISOString().split('T')[0],
      statut: 'processing'
    }
    // Ici on ajouterait le rapport à la liste
    console.log('Nouveau rapport créé:', newReport)
>>>>>>> b2b435d85c9b4936f607c4f528b67c75a4e07405
  }

  const handleDownloadReport = (reportId) => {
    // Logique pour télécharger un rapport
    console.log('Télécharger rapport:', reportId)
<<<<<<< HEAD
=======
    // Simulation de téléchargement
    const report = recentReports.find(r => r.id === reportId)
    if (report) {
      // Créer un fichier CSV simulé
      const csvContent = `Rapport,${report.nom}\nType,${report.type}\nDate,${report.date}\nStatut,${report.statut}\n\nDonnées du rapport...`
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${report.nom.replace(/\s+/g, '_')}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleViewReport = (reportId) => {
    // Logique pour visualiser un rapport
    console.log('Visualiser rapport:', reportId)
    const report = recentReports.find(r => r.id === reportId)
    if (report) {
      // Ici on ouvrirait une modal ou redirigerait vers une page de détail
      alert(`Visualisation du rapport: ${report.nom}`)
    }
>>>>>>> b2b435d85c9b4936f607c4f528b67c75a4e07405
  }

  return (
    <div className="space-y-8 p-6 bg-[#F4F2EE] min-h-screen">
<<<<<<< HEAD
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/app/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Rapports & Analytics</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
=======
>>>>>>> b2b435d85c9b4936f607c4f528b67c75a4e07405
      {/* Page header avec design Ricash */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#376470]/10">
        <div className="flex justify-between items-center">
        <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#29475B] mb-2">
              Rapports & Analytics
            </h1>
            <p className="text-lg text-[#376470] font-medium">
              Analysez vos performances et générez des rapports détaillés
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
              onClick={handleGenerateReport}
            >
              <Plus className="mr-2 h-5 w-5" />
              Nouveau rapport
            </RicashButton>
          </div>
        </div>
      </div>

      {/* Stats cards avec design Ricash */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <RicashStatCard
          title="Utilisateurs totaux"
          value={formatNumber(monthlyData[monthlyData.length - 1].utilisateurs)}
          change="+8.3%"
          changeType="positive"
          description="Ce mois"
          icon={Users}
          iconColor={RICASH_COLORS.turquoise}
          className="transform hover:scale-105 transition-transform duration-300"
        />
        <RicashStatCard
          title="Transferts totaux"
          value={formatNumber(monthlyData[monthlyData.length - 1].transferts)}
          change="+6.7%"
          changeType="positive"
          description="Ce mois"
          icon={ArrowLeftRight}
          iconColor={RICASH_COLORS.dore}
          className="transform hover:scale-105 transition-transform duration-300"
        />
        <RicashStatCard
          title="Volume total"
          value={formatCurrency(monthlyData[monthlyData.length - 1].volume)}
          change="+7.1%"
          changeType="positive"
          description="Ce mois"
          icon={DollarSign}
          iconColor={RICASH_COLORS.bleuFonce}
          className="transform hover:scale-105 transition-transform duration-300"
        />
        <RicashStatCard
          title="Commissions totales"
          value={formatCurrency(monthlyData[monthlyData.length - 1].commissions)}
          change="+6.7%"
          changeType="positive"
          description="Ce mois"
          icon={TrendingUp}
          iconColor={RICASH_COLORS.bleuVert}
          className="transform hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Filtres avec design Ricash */}
      <RicashCard className="overflow-hidden">
        <div className="p-6 border-b border-[#376470]/10">
          <h3 className="text-xl font-bold text-[#29475B] mb-4">
            Filtres et paramètres
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <RicashSelect
              value={filters.periode}
              onValueChange={(value) => setFilters(prev => ({ ...prev, periode: value }))}
            >
              <option value="1mois">1 mois</option>
              <option value="3mois">3 mois</option>
              <option value="6mois">6 mois</option>
              <option value="1an">1 an</option>
            </RicashSelect>

            <RicashSelect
              value={filters.type}
              onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
            >
              <option value="all">Tous les types</option>
              <option value="transferts">Transferts</option>
              <option value="kyc">KYC</option>
              <option value="agences">Agences</option>
            </RicashSelect>

            <RicashSelect
              value={filters.agence}
              onValueChange={(value) => setFilters(prev => ({ ...prev, agence: value }))}
            >
              <option value="all">Toutes les agences</option>
              <option value="paris">Paris</option>
              <option value="lyon">Lyon</option>
              <option value="marseille">Marseille</option>
            </RicashSelect>
          </div>
        </div>
      </RicashCard>

      {/* Onglets de rapports avec design Ricash */}
      <RicashTabs defaultValue="overview" className="w-full">
        <RicashTabsList className="grid w-full grid-cols-4 bg-white rounded-2xl shadow-lg border border-[#376470]/10">
          <RicashTabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Vue d'ensemble</span>
          </RicashTabsTrigger>
          <RicashTabsTrigger value="kyc" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>KYC</span>
          </RicashTabsTrigger>
          <RicashTabsTrigger value="agencies" className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span>Agences</span>
          </RicashTabsTrigger>
          <RicashTabsTrigger value="reports" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Rapports</span>
          </RicashTabsTrigger>
        </RicashTabsList>

        {/* Onglet Vue d'ensemble */}
        <RicashTabsContent value="overview" className="space-y-6">
          {/* Graphique des tendances mensuelles */}
          <RicashCard className="overflow-hidden">
            <div className="p-6 border-b border-[#376470]/10">
              <h3 className="text-xl font-bold text-[#29475B] mb-2">
                Tendances mensuelles
              </h3>
              <p className="text-[#376470]">
                Évolution des utilisateurs, transferts, volume et commissions
              </p>
                </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorUtilisateurs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={RICASH_COLORS.turquoise} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={RICASH_COLORS.turquoise} stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorTransferts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={RICASH_COLORS.dore} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={RICASH_COLORS.dore} stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={RICASH_COLORS.bleuFonce} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={RICASH_COLORS.bleuFonce} stopOpacity={0.1}/>
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
                    dataKey="utilisateurs" 
                    stroke={RICASH_COLORS.turquoise} 
                    fillOpacity={1} 
                    fill="url(#colorUtilisateurs)" 
                    strokeWidth={3}
                    name="Utilisateurs"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="transferts" 
                    stroke={RICASH_COLORS.dore} 
                    fillOpacity={1} 
                    fill="url(#colorTransferts)" 
                    strokeWidth={3}
                    name="Transferts"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="volume" 
                    stroke={RICASH_COLORS.bleuFonce} 
                    fillOpacity={1} 
                    fill="url(#colorVolume)" 
                    strokeWidth={3}
                    name="Volume"
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

          {/* Top pays et statuts des transactions */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top pays */}
            <RicashCard className="overflow-hidden">
              <div className="p-6 border-b border-[#376470]/10">
                <h3 className="text-xl font-bold text-[#29475B] mb-2">
                  Top pays de destination
                </h3>
                <p className="text-[#376470]">
                  Répartition par volume et nombre de transferts
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {topCountries.map((country, index) => (
                    <div key={country.pays} className="flex items-center justify-between p-4 rounded-xl bg-[#376470]/5 border border-[#376470]/10">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-[#2B8286]/20 flex items-center justify-center text-sm font-bold text-[#2B8286]">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-[#29475B]">{country.pays}</div>
                          <div className="text-sm text-[#376470]">
                            {formatNumber(country.transferts)} transferts
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-[#29475B]">
                          {formatCurrency(country.volume)}
                        </div>
                        <div className="text-sm text-[#376470]">
                          {country.pourcentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
          </div>
            </RicashCard>

            {/* Statuts des transactions */}
            <RicashCard className="overflow-hidden">
              <div className="p-6 border-b border-[#376470]/10">
                <h3 className="text-xl font-bold text-[#29475B] mb-2">
                  Statuts des transactions
                </h3>
                <p className="text-[#376470]">
                  Répartition des statuts aujourd'hui
                </p>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={transactionStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={{ stroke: RICASH_COLORS.bleuFonce, strokeWidth: 1 }}
                    >
                      {transactionStatusData.map((entry, index) => (
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
        </RicashTabsContent>

        {/* Onglet KYC */}
        <RicashTabsContent value="kyc" className="space-y-6">
          <RicashCard className="overflow-hidden">
            <div className="p-6 border-b border-[#376470]/10">
              <h3 className="text-xl font-bold text-[#29475B] mb-2">
                Analyse KYC
              </h3>
              <p className="text-[#376470]">
                Statistiques et répartition des statuts KYC
              </p>
                  </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                    data={kycData}
                      cx="50%"
                      cy="50%"
                    outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    labelLine={{ stroke: RICASH_COLORS.bleuFonce, strokeWidth: 1 }}
                    >
                    {kycData.map((entry, index) => (
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
        </RicashTabsContent>

        {/* Onglet Agences */}
        <RicashTabsContent value="agencies" className="space-y-6">
          <RicashTableCard
            title="Performance des agences"
            description="Classement par performance et volume"
            className="overflow-hidden"
          >
            <RicashTable>
              <RicashTableHeader>
                <RicashTableRow>
                  <RicashTableCell className="font-semibold text-[#29475B]">Agence</RicashTableCell>
                  <RicashTableCell className="font-semibold text-[#29475B]">Transferts</RicashTableCell>
                  <RicashTableCell className="font-semibold text-[#29475B]">Volume</RicashTableCell>
                  <RicashTableCell className="font-semibold text-[#29475B]">Commission</RicashTableCell>
                  <RicashTableCell className="font-semibold text-[#29475B]">Taux de réussite</RicashTableCell>
                </RicashTableRow>
              </RicashTableHeader>
              <RicashTableBody>
                  {agencyPerformance.map((agency, index) => (
                  <RicashTableRow key={agency.agence} className="hover:bg-[#376470]/5 transition-colors">
                    <RicashTableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-[#2B8286]/20 flex items-center justify-center text-sm font-bold text-[#2B8286]">
                          {index + 1}
                        </div>
                        <div className="font-semibold text-[#29475B]">{agency.agence}</div>
                      </div>
                    </RicashTableCell>
                    <RicashTableCell className="text-[#29475B] font-medium">
                      {formatNumber(agency.transferts)}
                    </RicashTableCell>
                    <RicashTableCell className="text-[#29475B] font-medium">
                      {formatCurrency(agency.volume)}
                    </RicashTableCell>
                    <RicashTableCell className="text-[#29475B] font-medium">
                      {formatCurrency(agency.commission)}
                    </RicashTableCell>
                    <RicashTableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-[#376470]/20 rounded-full h-2">
                          <div 
                            className="bg-[#2B8286] h-2 rounded-full" 
                            style={{ width: `${agency.taux}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-[#29475B]">
                          {agency.taux}%
                        </span>
                      </div>
                    </RicashTableCell>
                  </RicashTableRow>
                ))}
              </RicashTableBody>
            </RicashTable>
          </RicashTableCard>
        </RicashTabsContent>

        {/* Onglet Rapports */}
        <RicashTabsContent value="reports" className="space-y-6">
          <RicashTableCard
            title="Rapports récents"
            description="Gérez et téléchargez vos rapports générés"
            className="overflow-hidden"
          >
            <RicashTable>
              <RicashTableHeader>
                <RicashTableRow>
                  <RicashTableCell className="font-semibold text-[#29475B]">Rapport</RicashTableCell>
                  <RicashTableCell className="font-semibold text-[#29475B]">Type</RicashTableCell>
                  <RicashTableCell className="font-semibold text-[#29475B]">Date</RicashTableCell>
                  <RicashTableCell className="font-semibold text-[#29475B]">Statut</RicashTableCell>
                  <RicashTableCell className="font-semibold text-[#29475B]">Actions</RicashTableCell>
                </RicashTableRow>
              </RicashTableHeader>
              <RicashTableBody>
                {recentReports.map((report) => (
                  <RicashTableRow key={report.id} className="hover:bg-[#376470]/5 transition-colors">
                    <RicashTableCell>
                    <div className="flex items-center space-x-3">
                        {getTypeIcon(report.type)}
                      <div>
                          <div className="font-semibold text-[#29475B]">{report.nom}</div>
                          <div className="text-sm text-[#376470]">ID: {report.id}</div>
                        </div>
                      </div>
                    </RicashTableCell>
                    <RicashTableCell>
                      <div className="text-[#29475B] font-medium">{report.type}</div>
                    </RicashTableCell>
                    <RicashTableCell>
                      <div className="text-[#376470]">{report.date}</div>
                    </RicashTableCell>
                    <RicashTableCell>
                      <RicashStatusBadge 
                        status={getStatusColor(report.statut)} 
                        text={getStatusText(report.statut)} 
                      />
                    </RicashTableCell>
                    <RicashTableCell>
                    <div className="flex items-center space-x-2">
                      {report.statut === 'generated' && (
                          <RicashIconButton
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadReport(report.id)}
                            className="text-[#2B8286] hover:bg-[#2B8286]/10"
                          >
                            <Download className="h-4 w-4" />
                          </RicashIconButton>
                        )}
                        <RicashIconButton
                          variant="ghost"
                          size="sm"
<<<<<<< HEAD
=======
                          onClick={() => handleViewReport(report.id)}
>>>>>>> b2b435d85c9b4936f607c4f528b67c75a4e07405
                          className="text-[#376470] hover:bg-[#376470]/10"
                        >
                          <Eye className="h-4 w-4" />
                        </RicashIconButton>
                    </div>
                    </RicashTableCell>
                  </RicashTableRow>
                ))}
              </RicashTableBody>
            </RicashTable>
          </RicashTableCard>
        </RicashTabsContent>
      </RicashTabs>
    </div>
  )
}
