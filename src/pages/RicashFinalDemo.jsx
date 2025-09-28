import React, { useState } from 'react'
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  Shield, 
  Building2,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Globe,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail
} from 'lucide-react'
import { RicashCard, RicashStatCard, RicashTableCard } from '@/components/ui/ricash-card'
import { RicashButton, RicashIconButton, RicashActionButton } from '@/components/ui/ricash-button'
import { RicashInput } from '@/components/ui/ricash-input'
import { RicashSelect } from '@/components/ui/ricash-input'
import { RicashTabs, RicashTabsContent, RicashTabsList, RicashTabsTrigger } from '@/components/ui/ricash-navigation'
import { RicashTable, RicashTableHeader, RicashTableBody, RicashTableRow, RicashTableCell, RicashStatusBadge } from '@/components/ui/ricash-table'
import { RicashBreadcrumb } from '@/components/ui/ricash-navigation'
import { RicashPagination } from '@/components/ui/ricash-navigation'
import { RicashFilterBar } from '@/components/ui/ricash-navigation'

// Palette de couleurs Ricash officielle
const RICASH_COLORS = {
  bleuFonce: '#29475B',
  dore: '#B19068',
  turquoise: '#2B8286',
  blancCasse: '#F4F2EE',
  bleuVert: '#376470'
}

// Mock data pour la démonstration
const mockStats = [
  {
    title: 'Utilisateurs actifs',
    value: '2,847',
    change: '+15.3%',
    changeType: 'positive',
    description: 'Ce mois',
    icon: Users,
    iconColor: RICASH_COLORS.turquoise
  },
  {
    title: 'Revenus totaux',
    value: '€87,700',
    change: '+12.5%',
    changeType: 'positive',
    description: 'Ce mois',
    icon: DollarSign,
    iconColor: RICASH_COLORS.dore
  },
  {
    title: 'Transferts traités',
    value: '32,600',
    change: '+8.2%',
    changeType: 'positive',
    description: 'Ce mois',
    icon: TrendingUp,
    iconColor: RICASH_COLORS.bleuFonce
  },
  {
    title: 'Taux de réussite',
    value: '98.1%',
    change: '+0.3%',
    changeType: 'positive',
    description: 'Ce mois',
    icon: Activity,
    iconColor: RICASH_COLORS.bleuVert
  }
]

const mockAgents = [
  {
    id: 'AGT001',
    nom: 'Ousmane Diallo',
    prenom: 'Ousmane',
    email: 'ousmane.diallo@ricash.com',
    telephone: '+221 76 123 45 67',
    statut: 'actif',
    agence: 'Agence Dakar Centre',
    ville: 'Dakar',
    performance: 4.8,
    chiffreAffaires: 450000
  },
  {
    id: 'AGT002',
    nom: 'Fatou Ndiaye',
    prenom: 'Fatou',
    email: 'fatou.ndiaye@ricash.com',
    telephone: '+221 77 987 65 43',
    statut: 'formation',
    agence: 'Agence Thiès',
    ville: 'Thiès',
    performance: 3.2,
    chiffreAffaires: 180000
  },
  {
    id: 'AGT003',
    nom: 'Mamadou Ba',
    prenom: 'Mamadou',
    email: 'mamadou.ba@ricash.com',
    telephone: '+221 78 456 78 90',
    statut: 'actif',
    agence: 'Agence Saint-Louis',
    ville: 'Saint-Louis',
    performance: 4.9,
    chiffreAffaires: 520000
  }
]

const mockTransfers = [
  {
    id: 'TRF001',
    expediteur: 'Ousmane Diallo',
    destinataire: 'Fatou Ndiaye',
    montant: 150000,
    statut: 'complete',
    type: 'interne',
    date: '2024-01-20T14:30:00'
  },
  {
    id: 'TRF002',
    expediteur: 'Mamadou Ba',
    destinataire: 'Aissatou Sow',
    montant: 75000,
    statut: 'en_cours',
    type: 'externe',
    date: '2024-01-20T13:15:00'
  },
  {
    id: 'TRF003',
    expediteur: 'Khadija Fall',
    destinataire: 'Modou Thiam',
    montant: 200000,
    statut: 'en_attente',
    type: 'interne',
    date: '2024-01-20T12:00:00'
  }
]

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const getStatusColor = (status) => {
  switch (status) {
    case 'actif':
    case 'complete':
      return 'success'
    case 'formation':
    case 'en_cours':
      return 'warning'
    case 'en_attente':
      return 'info'
    default:
      return 'default'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'actif':
      return 'Actif'
    case 'formation':
      return 'En formation'
    case 'complete':
      return 'Complété'
    case 'en_cours':
      return 'En cours'
    case 'en_attente':
      return 'En attente'
    default:
      return status
  }
}

const getTypeIcon = (type) => {
  switch (type) {
    case 'interne':
      return <Building2 className="h-4 w-4 text-[#2B8286]" />
    case 'externe':
      return <Globe className="h-4 w-4 text-[#B19068]" />
    default:
      return <ArrowRight className="h-4 w-4 text-[#376470]" />
  }
}

export default function RicashFinalDemo() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    type: 'all'
  })

  const handleRefresh = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  const handleCreate = () => {
    console.log('Créer un nouvel élément')
  }

  const handleExport = () => {
    console.log('Exporter les données')
  }

  return (
    <div className="space-y-8 p-6 bg-[#F4F2EE] min-h-screen">
      {/* Breadcrumb Ricash */}
      <RicashBreadcrumb
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Démonstration Finale', href: '/ricash-final-demo' }
        ]}
      />

      {/* Page header avec design Ricash */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#376470]/10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#29475B] mb-2">
              🎨 Démonstration Finale Ricash
            </h1>
            <p className="text-lg text-[#376470] font-medium">
              Tous les composants Ricash refondus avec la palette officielle
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
              onClick={handleExport}
            >
              <Download className="mr-2 h-5 w-5" />
              Exporter
            </RicashButton>
            <RicashButton 
              variant="accent"
              size="lg"
              onClick={handleCreate}
            >
              <Plus className="mr-2 h-5 w-5" />
              Créer
            </RicashButton>
          </div>
        </div>
      </div>

      {/* Stats cards avec design Ricash */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {mockStats.map((stat, index) => (
          <RicashStatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            description={stat.description}
            icon={stat.icon}
            iconColor={stat.iconColor}
            className="transform hover:scale-105 transition-transform duration-300"
          />
        ))}
      </div>

      {/* Filtres avec design Ricash */}
      <RicashFilterBar
        className="bg-white rounded-2xl shadow-lg border border-[#376470]/10"
      >
        <div className="grid gap-4 md:grid-cols-3">
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
            value={filters.status}
            onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
          >
            <option value="all">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="formation">En formation</option>
            <option value="complete">Complété</option>
            <option value="en_cours">En cours</option>
            <option value="en_attente">En attente</option>
          </RicashSelect>

          <RicashSelect
            value={filters.type}
            onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
          >
            <option value="all">Tous les types</option>
            <option value="interne">Interne</option>
            <option value="externe">Externe</option>
          </RicashSelect>
        </div>
      </RicashFilterBar>

      {/* Onglets avec design Ricash */}
      <RicashTabs defaultValue="agents" className="w-full">
        <RicashTabsList className="grid w-full grid-cols-3 bg-white rounded-2xl shadow-lg border border-[#376470]/10">
          <RicashTabsTrigger value="agents" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Agents</span>
          </RicashTabsTrigger>
          <RicashTabsTrigger value="transfers" className="flex items-center space-x-2">
            <ArrowRight className="h-4 w-4" />
            <span>Transferts</span>
          </RicashTabsTrigger>
          <RicashTabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </RicashTabsTrigger>
        </RicashTabsList>

        {/* Onglet Agents */}
        <RicashTabsContent value="agents" className="space-y-6">
          <RicashTableCard
            title="Gestion des Agents"
            description={`${mockAgents.length} agent(s) trouvé(s)`}
            className="overflow-hidden"
          >
            <RicashTable>
              <RicashTableHeader>
                <RicashTableRow>
                  <RicashTableCell className="font-semibold text-[#29475B]">Agent</RicashTableCell>
                  <RicashTableCell className="font-semibold text-[#29475B]">Contact</RicashTableCell>
                  <RicashTableCell className="font-semibold text-[#29475B]">Statut</RicashTableCell>
                  <RicashTableCell className="font-semibold text-[#29475B]">Agence</RicashTableCell>
                  <RicashTableCell className="font-semibold text-[#29475B]">Performance</RicashTableCell>
                  <RicashTableCell className="font-semibold text-[#29475B]">Actions</RicashTableCell>
                </RicashTableRow>
              </RicashTableHeader>
              <RicashTableBody>
                {mockAgents.map((agent) => (
                  <RicashTableRow key={agent.id} className="hover:bg-[#376470]/5 transition-colors">
                    <RicashTableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#2B8286]/20 flex items-center justify-center">
                          <Users className="h-5 w-5 text-[#2B8286]" />
                        </div>
                        <div>
                          <div className="font-semibold text-[#29475B]">
                            {agent.prenom} {agent.nom}
                          </div>
                          <div className="text-sm text-[#376470]">ID: {agent.id}</div>
                        </div>
                      </div>
                    </RicashTableCell>

                    <RicashTableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="h-3 w-3 text-[#376470]" />
                          <span className="text-[#29475B]">{agent.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="h-3 w-3 text-[#376470]" />
                          <span className="text-[#29475B]">{agent.telephone}</span>
                        </div>
                      </div>
                    </RicashTableCell>

                    <RicashTableCell>
                      <RicashStatusBadge
                        status={getStatusColor(agent.statut)}
                        text={getStatusText(agent.statut)}
                      />
                    </RicashTableCell>

                    <RicashTableCell>
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-[#376470]" />
                        <div>
                          <div className="font-medium text-[#29475B]">{agent.agence}</div>
                          <div className="text-sm text-[#376470]">{agent.ville}</div>
                        </div>
                      </div>
                    </RicashTableCell>

                    <RicashTableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#376470]">Note:</span>
                          <span className="font-bold text-[#2B8286]">
                            {agent.performance}/5
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#376470]">CA:</span>
                          <span className="font-medium text-[#29475B]">
                            {formatCurrency(agent.chiffreAffaires)}
                          </span>
                        </div>
                      </div>
                    </RicashTableCell>

                    <RicashTableCell>
                      <div className="flex items-center space-x-2">
                        <RicashIconButton
                          variant="ghost"
                          size="sm"
                          className="text-[#2B8286] hover:bg-[#2B8286]/10"
                        >
                          <Eye className="h-4 w-4" />
                        </RicashIconButton>

                        <RicashIconButton
                          variant="ghost"
                          size="sm"
                          className="text-[#B19068] hover:bg-[#B19068]/10"
                        >
                          <Edit className="h-4 w-4" />
                        </RicashIconButton>

                        <RicashIconButton
                          variant="ghost"
                          size="sm"
                          className="text-[#376470] hover:bg-[#376470]/10"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </RicashIconButton>
                      </div>
                    </RicashTableCell>
                  </RicashTableRow>
                ))}
              </RicashTableBody>
            </RicashTable>
          </RicashTableCard>
        </RicashTabsContent>

        {/* Onglet Transferts */}
        <RicashTabsContent value="transfers" className="space-y-6">
          <RicashTableCard
            title="Gestion des Transferts"
            description={`${mockTransfers.length} transfert(s) trouvé(s)`}
            className="overflow-hidden"
          >
            <RicashTable>
              <RicashTableHeader>
                <RicashTableRow>
                  <RicashTableCell className="font-semibold text-[#29475B]">Transfert</RicashTableCell>
                  <RicashTableCell className="font-semibold text-[#29475B]">Détails</RicashTableCell>
                  <RicashTableCell className="font-semibold text-[#29475B]">Montant</RicashTableCell>
                  <RicashTableCell className="font-semibold text-[#29475B]">Statut</RicashTableCell>
                  <RicashTableCell className="font-semibold text-[#29475B]">Date</RicashTableCell>
                  <RicashTableCell className="font-semibold text-[#29475B]">Actions</RicashTableCell>
                </RicashTableRow>
              </RicashTableHeader>
              <RicashTableBody>
                {mockTransfers.map((transfer) => (
                  <RicashTableRow key={transfer.id} className="hover:bg-[#376470]/5 transition-colors">
                    <RicashTableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#B19068]/20 flex items-center justify-center">
                          {getTypeIcon(transfer.type)}
                        </div>
                        <div>
                          <div className="font-semibold text-[#29475B]">{transfer.id}</div>
                          <div className="text-sm text-[#376470]">{transfer.type}</div>
                        </div>
                      </div>
                    </RicashTableCell>

                    <RicashTableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="text-[#376470]">De: </span>
                          <span className="font-medium text-[#29475B]">{transfer.expediteur.nom}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-[#376470]">À: </span>
                          <span className="font-medium text-[#29475B]">{transfer.destinataire.nom}</span>
                        </div>
                      </div>
                    </RicashTableCell>

                    <RicashTableCell>
                      <div className="font-bold text-lg text-[#29475B]">
                        {formatCurrency(transfer.montant)}
                      </div>
                    </RicashTableCell>

                    <RicashTableCell>
                      <RicashStatusBadge
                        status={getStatusColor(transfer.statut)}
                        text={getStatusText(transfer.statut)}
                      />
                    </RicashTableCell>

                    <RicashTableCell>
                      <div className="text-[#376470]">
                        {new Date(transfer.date).toLocaleString()}
                      </div>
                    </RicashTableCell>

                    <RicashTableCell>
                      <div className="flex items-center space-x-2">
                        <RicashIconButton
                          variant="ghost"
                          size="sm"
                          className="text-[#2B8286] hover:bg-[#2B8286]/10"
                        >
                          <Eye className="h-4 w-4" />
                        </RicashIconButton>

                        <RicashIconButton
                          variant="ghost"
                          size="sm"
                          className="text-[#B19068] hover:bg-[#B19068]/10"
                        >
                          <Download className="h-4 w-4" />
                        </RicashIconButton>
                      </div>
                    </RicashTableCell>
                  </RicashTableRow>
                ))}
              </RicashTableBody>
            </RicashTable>
          </RicashTableCard>
        </RicashTabsContent>

        {/* Onglet Analytics */}
        <RicashTabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Graphique en barres */}
            <RicashCard className="overflow-hidden">
              <div className="p-6 border-b border-[#376470]/10">
                <h3 className="text-xl font-bold text-[#29475B] mb-2">
                  Performance des agents
                </h3>
                <p className="text-[#376470]">
                  Répartition par niveau de performance
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {mockAgents.map((agent) => (
                    <div key={agent.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#29475B] font-medium">
                          {agent.prenom} {agent.nom}
                        </span>
                        <span className="text-[#2B8286] font-bold">
                          {agent.performance}/5
                        </span>
                      </div>
                      <div className="w-full bg-[#376470]/20 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-[#2B8286] to-[#B19068] h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${(agent.performance / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </RicashCard>

            {/* Statistiques des transferts */}
            <RicashCard className="overflow-hidden">
              <div className="p-6 border-b border-[#376470]/10">
                <h3 className="text-xl font-bold text-[#29475B] mb-2">
                  Statistiques des transferts
                </h3>
                <p className="text-[#376470]">
                  Répartition par statut et type
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#2B8286]/10 border border-[#2B8286]/20">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-[#2B8286]" />
                      <span className="text-[#29475B] font-medium">Complétés</span>
                    </div>
                    <span className="text-[#2B8286] font-bold">1</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#B19068]/10 border border-[#B19068]/20">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-[#B19068]" />
                      <span className="text-[#29475B] font-medium">En cours</span>
                    </div>
                    <span className="text-[#B19068] font-bold">1</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#376470]/10 border border-[#376470]/20">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-[#376470]" />
                      <span className="text-[#29475B] font-medium">En attente</span>
                    </div>
                    <span className="text-[#376470] font-bold">1</span>
                  </div>
                </div>
              </div>
            </RicashCard>
          </div>
        </RicashTabsContent>
      </RicashTabs>

      {/* Pagination Ricash */}
      <div className="flex justify-center">
        <RicashPagination
          currentPage={1}
          totalPages={5}
          onPageChange={(page) => console.log('Page:', page)}
          className="bg-white rounded-2xl shadow-lg border border-[#376470]/10"
        />
      </div>

      {/* Footer avec design Ricash */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#376470]/10 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Star className="h-5 w-5 text-[#B19068]" />
          <span className="text-lg font-bold text-[#29475B]">
            Refonte UI/UX Ricash Terminée !
          </span>
          <Star className="h-5 w-5 text-[#B19068]" />
        </div>
        <p className="text-[#376470]">
          Tous les composants ont été refondus avec la palette de couleurs officielle Ricash
        </p>
        <div className="mt-4 flex justify-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-[#29475B]" />
            <span className="text-sm text-[#29475B]">Bleu Foncé</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-[#B19068]" />
            <span className="text-sm text-[#B19068]">Doré</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-[#2B8286]" />
            <span className="text-sm text-[#2B8286]">Turquoise</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-[#376470]" />
            <span className="text-sm text-[#376470]">Bleu-Vert</span>
          </div>
        </div>
      </div>
    </div>
  )
}
