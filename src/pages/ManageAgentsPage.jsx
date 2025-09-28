import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  Users,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Phone,
  Mail,
  User,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Building2,
  TrendingUp,
  DollarSign,
  Calendar,
  Filter,
  Download,
  Upload,
  Eye,
  UserPlus,
  Settings,
  BarChart3,
  AlertCircle
} from 'lucide-react'
import { RicashButton } from '@/components/ui/ricash-button'
import { RicashInput } from '@/components/ui/ricash-input'
import { RicashLabel } from '@/components/ui/ricash-label'
import { RicashCard, RicashStatCard } from '@/components/ui/ricash-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SafeSelect } from '@/components/ui/safe-select'
import { toast } from 'sonner'

// Mock data for agencies and agents
const mockAgencies = [
  {
    id: 'AGE001',
    nom: 'Ricash Dakar Centre',
    code: 'DAK-001',
    ville: 'Dakar',
    statut: 'active',
    nombreAgents: 8,
    chiffreAffaires: 2500000
  },
  {
    id: 'AGE002',
    nom: 'Ricash Touba',
    code: 'TOU-002',
    ville: 'Touba',
    statut: 'active',
    nombreAgents: 5,
    chiffreAffaires: 1800000
  }
]

const mockAgents = [
  {
    id: 'AGT001',
    nom: 'Ibrahima Sarr',
    prenom: 'Ibrahima',
    telephone: '+221 77 123 45 67',
    email: 'ibrahima.sarr@ricash.com',
    statut: 'actif',
    dateEmbauche: '2023-01-15',
    poste: 'Agent principal',
    niveau: 'Expert',
    agence: { id: 'AGE001', nom: 'Ricash Dakar Centre' },
    chiffreAffaires: 150000,
    transactionsJour: 25,
    transactionsMois: 750,
    commission: 4500,
    notePerformance: 4.8,
    dernierLogin: '2024-01-15T08:30:00Z'
  },
  {
    id: 'AGT002',
    nom: 'Mariam Diop',
    prenom: 'Mariam',
    telephone: '+221 76 987 65 43',
    email: 'mariam.diop@ricash.com',
    statut: 'actif',
    dateEmbauche: '2023-02-20',
    poste: 'Agent caissier',
    niveau: 'Intermédiaire',
    agence: { id: 'AGE001', nom: 'Ricash Dakar Centre' },
    chiffreAffaires: 120000,
    transactionsJour: 18,
    transactionsMois: 540,
    commission: 3600,
    notePerformance: 4.5,
    dernierLogin: '2024-01-15T09:15:00Z'
  },
  {
    id: 'AGT003',
    nom: 'Abdou Ndiaye',
    prenom: 'Abdou',
    telephone: '+221 78 456 12 34',
    email: 'abdou.ndiaye@ricash.com',
    statut: 'conge',
    dateEmbauche: '2023-03-10',
    poste: 'Agent caissier',
    niveau: 'Débutant',
    agence: { id: 'AGE001', nom: 'Ricash Dakar Centre' },
    chiffreAffaires: 95000,
    transactionsJour: 0,
    transactionsMois: 285,
    commission: 2850,
    notePerformance: 4.2,
    dernierLogin: '2024-01-10T16:45:00Z'
  },
  {
    id: 'AGT004',
    nom: 'Fatou Ba',
    prenom: 'Fatou',
    telephone: '+221 77 654 32 10',
    email: 'fatou.ba@ricash.com',
    statut: 'actif',
    dateEmbauche: '2023-04-05',
    poste: 'Agent KYC',
    niveau: 'Avancé',
    agence: { id: 'AGE002', nom: 'Ricash Touba' },
    chiffreAffaires: 80000,
    transactionsJour: 12,
    transactionsMois: 360,
    commission: 2400,
    notePerformance: 4.6,
    dernierLogin: '2024-01-15T10:30:00Z'
  }
]

const getStatusBadge = (statut) => {
  switch (statut) {
    case 'actif':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Actif</Badge>
    case 'inactif':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inactif</Badge>
    case 'conge':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En congé</Badge>
    case 'formation':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Formation</Badge>
    default:
      return <Badge variant="secondary">Inconnu</Badge>
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function ManageAgentsPage() {
  const navigate = useNavigate()
  const { agencyId } = useParams()
  const [selectedAgency, setSelectedAgency] = useState(null)
  const [agents, setAgents] = useState(mockAgents)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [deleteAgentOpen, setDeleteAgentOpen] = useState(false)

  // Load agency data
  useEffect(() => {
    if (agencyId) {
      const agency = mockAgencies.find(a => a.id === agencyId)
      setSelectedAgency(agency)
    }
  }, [agencyId])

  // Filter agents based on search and status
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || agent.statut === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Calculate statistics
  const stats = {
    total: agents.length,
    actifs: agents.filter(a => a.statut === 'actif').length,
    inactifs: agents.filter(a => a.statut === 'inactif').length,
    enConge: agents.filter(a => a.statut === 'conge').length,
    enFormation: agents.filter(a => a.statut === 'formation').length,
    chiffreAffairesTotal: agents.reduce((sum, a) => sum + a.chiffreAffaires, 0),
    transactionsTotal: agents.reduce((sum, a) => sum + a.transactionsJour, 0),
    transactionsMois: agents.reduce((sum, a) => sum + a.transactionsMois, 0),
    commissionTotal: agents.reduce((sum, a) => sum + a.commission, 0),
    performanceMoyenne: agents.reduce((sum, a) => sum + a.notePerformance, 0) / agents.length,
    performanceMax: Math.max(...agents.map(a => a.notePerformance)),
    chiffreAffairesMoyen: agents.reduce((sum, a) => sum + a.chiffreAffaires, 0) / agents.length
  }

  const handleAddAgent = () => {
    navigate('/app/agents/create')
  }

  const handleEditAgent = (agent) => {
    navigate(`/app/agents/${agent.id}/edit`)
  }

  const handleViewAgent = (agent) => {
    navigate(`/app/agents/${agent.id}/details`)
  }

  const handleToggleAgentStatus = (agent) => {
    navigate(`/app/agents/${agent.id}/details`)
  }

  const handleDeleteAgent = (agent) => {
    setSelectedAgent(agent)
    setDeleteAgentOpen(true)
  }

  const handleExportData = () => {
    toast.success('Export des données en cours...')
  }

  const handleImportData = () => {
    toast.info('Fonctionnalité d\'import à venir')
  }

  const handleConfirmDelete = () => {
    if (selectedAgent) {
      setAgents(prev => prev.filter(agent => agent.id !== selectedAgent.id))
      toast.success(`Agent ${selectedAgent.prenom} ${selectedAgent.nom} supprimé avec succès`)
      setDeleteAgentOpen(false)
      setSelectedAgent(null)
    }
  }

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts', key: 'status-all' },
    { value: 'actif', label: 'Actifs', key: 'status-actif' },
    { value: 'inactif', label: 'Inactifs', key: 'status-inactif' },
    { value: 'conge', label: 'En congé', key: 'status-conge' },
    { value: 'formation', label: 'En formation', key: 'status-formation' }
  ]

  if (!selectedAgency) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Agence non trouvée</h2>
          <p className="text-gray-600 mb-4">L'agence demandée n'existe pas.</p>
          <RicashButton onClick={() => navigate('/app/agencies')}>
            Retour aux agences
          </RicashButton>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F2EE]">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <RicashButton
                variant="outline"
                size="lg"
                onClick={() => navigate('/app/agencies')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </RicashButton>
              <div>
                <h1 className="text-3xl font-bold text-[#29475B] flex items-center gap-3">
                  <Users className="h-8 w-8 text-[#2B8286]" />
                  Gestion des agents
                </h1>
                <p className="text-[#376470] mt-1 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {selectedAgency.nom} - {selectedAgency.code}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <RicashButton
                variant="outline"
                size="lg"
                onClick={handleExportData}
              >
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </RicashButton>
              <RicashButton
                variant="outline"
                size="lg"
                onClick={handleImportData}
              >
                <Upload className="mr-2 h-4 w-4" />
                Importer
              </RicashButton>
              <RicashButton
                size="lg"
                onClick={handleAddAgent}
                className="bg-gradient-to-r from-[#2B8286] to-[#376470] hover:from-[#2B8286]/90 hover:to-[#376470]/90 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Ajouter un agent
              </RicashButton>
            </div>
          </div>
        </div>

        {/* Section Statistiques */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#2B8286] to-[#376470] flex items-center justify-center shadow-sm">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#29475B]">Statistiques de l'agence</h2>
              <p className="text-[#376470] text-sm">Vue d'ensemble des performances des agents</p>
            </div>
          </div>

          {/* Stats cards avec design Ricash */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <RicashStatCard
              title="Total des agents"
              value={stats.total.toString()}
              change={`+${stats.enFormation}`}
              changeType="positive"
              description="Cette agence"
              icon={Users}
              iconColor="#2B8286"
              className="transform hover:scale-105 transition-transform duration-300"
            />
            <RicashStatCard
              title="Agents actifs"
              value={stats.actifs.toString()}
              change={`${Math.round((stats.actifs / stats.total) * 100)}%`}
              changeType="positive"
              description="En activité"
              icon={CheckCircle}
              iconColor="#10b981"
              className="transform hover:scale-105 transition-transform duration-300"
            />
            <RicashStatCard
              title="Total CA"
              value={formatCurrency(stats.chiffreAffairesTotal)}
              change={`+${formatCurrency(stats.chiffreAffairesMoyen)}`}
              changeType="positive"
              description="Ce mois"
              icon={DollarSign}
              iconColor="#376470"
              className="transform hover:scale-105 transition-transform duration-300"
            />
            <RicashStatCard
              title="Performance Moy."
              value={`${stats.performanceMoyenne.toFixed(1)}/5`}
              change={`Max: ${stats.performanceMax}/5`}
              changeType="positive"
              description="Note moyenne"
              icon={TrendingUp}
              iconColor="#f59e0b"
              className="transform hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Stats supplémentaires */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <RicashStatCard
              title="En congé"
              value={stats.enConge.toString()}
              change="0"
              changeType="neutral"
              description="Agents en congé"
              icon={Clock}
              iconColor="#f59e0b"
              className="transform hover:scale-105 transition-transform duration-300"
            />
            <RicashStatCard
              title="En formation"
              value={stats.enFormation.toString()}
              change="+1"
              changeType="positive"
              description="Agents en formation"
              icon={User}
              iconColor="#3b82f6"
              className="transform hover:scale-105 transition-transform duration-300"
            />
            <RicashStatCard
              title="Transactions/mois"
              value={stats.transactionsMois.toString()}
              change={`+${stats.transactionsTotal}`}
              changeType="positive"
              description="Total mensuel"
              icon={BarChart3}
              iconColor="#8b5cf6"
              className="transform hover:scale-105 transition-transform duration-300"
            />
            <RicashStatCard
              title="Commissions"
              value={formatCurrency(stats.commissionTotal)}
              change="+5%"
              changeType="positive"
              description="Total commissions"
              icon={TrendingUp}
              iconColor="#06b6d4"
              className="transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Filters and Search */}
        <RicashCard className="p-8 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div className="flex flex-col lg:flex-row gap-6 flex-1">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#376470]/60" />
                <Input
                  placeholder="Rechercher un agent..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-base border-[#376470]/20 focus:border-[#2B8286] focus:ring-[#2B8286]/20"
                />
              </div>
              
              <div className="w-full lg:w-64">
                <SafeSelect
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                  options={statusOptions}
                  placeholder="Filtrer par statut"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-[#376470] bg-[#F4F2EE] px-4 py-3 rounded-lg">
              <Filter className="h-4 w-4" />
              <span className="font-medium">{filteredAgents.length} agent(s) trouvé(s)</span>
            </div>
          </div>
        </RicashCard>

        {/* Agents Table */}
        <RicashCard className="overflow-hidden">
          <div className="p-8 border-b border-[#376470]/10 bg-gradient-to-r from-[#F4F2EE] to-white">
            <h3 className="text-xl font-bold text-[#29475B] flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#2B8286] to-[#376470] flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              Liste des agents
            </h3>
            <p className="text-[#376470] mt-2">
              Agents affectés à l'agence {selectedAgency.nom}
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-[#F4F2EE] to-[#F4F2EE]/50">
                  <TableHead className="px-6 py-4 text-left font-semibold text-[#29475B]">Agent</TableHead>
                  <TableHead className="px-6 py-4 text-left font-semibold text-[#29475B]">Poste & Niveau</TableHead>
                  <TableHead className="px-6 py-4 text-left font-semibold text-[#29475B]">Contact</TableHead>
                  <TableHead className="px-6 py-4 text-left font-semibold text-[#29475B]">Statut</TableHead>
                  <TableHead className="px-6 py-4 text-left font-semibold text-[#29475B]">Performance</TableHead>
                  <TableHead className="px-6 py-4 text-left font-semibold text-[#29475B]">CA Mensuel</TableHead>
                  <TableHead className="px-6 py-4 text-left font-semibold text-[#29475B]">Dernière activité</TableHead>
                  <TableHead className="px-6 py-4 text-center font-semibold text-[#29475B]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.map((agent) => (
                  <TableRow key={agent.id} className="hover:bg-[#F4F2EE]/30 transition-colors duration-200">
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#2B8286] to-[#376470] rounded-full flex items-center justify-center shadow-sm">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-[#29475B] text-base">{agent.prenom} {agent.nom}</div>
                          <div className="text-sm text-[#376470] font-mono">{agent.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell className="px-6 py-5">
                      <div>
                        <div className="font-semibold text-[#29475B] text-base">{agent.poste}</div>
                        <div className="text-sm text-[#376470] font-medium">{agent.niveau}</div>
                      </div>
                    </TableCell>
                    
                    <TableCell className="px-6 py-5">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Phone className="mr-2 h-4 w-4 text-[#376470]/60" />
                          <span className="text-[#29475B] font-medium">{agent.telephone}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="mr-2 h-4 w-4 text-[#376470]/60" />
                          <span className="text-[#376470]">{agent.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell className="px-6 py-5">
                      {getStatusBadge(agent.statut)}
                    </TableCell>
                    
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="text-base font-bold text-[#29475B]">{agent.notePerformance}/5</div>
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full ${
                                i < Math.floor(agent.notePerformance)
                                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell className="px-6 py-5">
                      <div className="font-bold text-[#29475B] text-base">{formatCurrency(agent.chiffreAffaires)}</div>
                      <div className="text-sm text-[#376470] font-medium">{agent.transactionsJour} trans./jour</div>
                    </TableCell>
                    
                    <TableCell className="px-6 py-5">
                      <div className="text-sm font-medium text-[#29475B]">{formatDateTime(agent.dernierLogin)}</div>
                    </TableCell>
                    
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-10 w-10 p-0 hover:bg-[#F4F2EE]">
                              <MoreHorizontal className="h-4 w-4 text-[#376470]" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel className="text-[#29475B] font-semibold">Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewAgent(agent)} className="text-[#29475B]">
                              <Eye className="mr-2 h-4 w-4" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditAgent(agent)} className="text-[#29475B]">
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleToggleAgentStatus(agent)}
                              className="text-[#29475B]"
                            >
                              <Settings className="mr-2 h-4 w-4" />
                              Modifier le statut
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteAgent(agent)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredAgents.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun agent trouvé</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Aucun agent ne correspond à vos critères de recherche.'
                  : 'Cette agence n\'a pas encore d\'agents assignés.'
                }
              </p>
              <RicashButton 
                size="lg"
                onClick={handleAddAgent}
                className="bg-gradient-to-r from-[#2B8286] to-[#376470] hover:from-[#2B8286]/90 hover:to-[#376470]/90 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Ajouter le premier agent
              </RicashButton>
            </div>
          )}
        </RicashCard>
      </div>

      {/* Modals */}

      {deleteAgentOpen && selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Trash2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Supprimer l'agent</h3>
                    <p className="text-white/80 text-sm">
                      Cette action est irréversible
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setDeleteAgentOpen(false)}
                  className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Agent Info Card */}
              <RicashCard className="p-6 mb-6 border-0 shadow-lg bg-gradient-to-br from-white to-red-50/30">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-sm">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-[#29475B]">
                      {selectedAgent.prenom} {selectedAgent.nom}
                    </h4>
                    <p className="text-[#376470] text-sm">{selectedAgent.poste} - {selectedAgent.niveau}</p>
                    <p className="text-[#376470] text-sm">{selectedAgent.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-[#376470]">Statut :</span>
                      {getStatusBadge(selectedAgent.statut)}
                    </div>
                  </div>
                </div>
              </RicashCard>

              {/* Warning Message */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-red-800 mb-1">Attention !</h5>
                    <p className="text-sm text-red-700">
                      Êtes-vous sûr de vouloir supprimer cet agent ? Toutes ses données seront définitivement perdues, 
                      y compris son historique de transactions et ses performances.
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-[#29475B]">{selectedAgent.transactionsMois}</p>
                  <p className="text-sm text-[#376470]">Transactions/mois</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-[#29475B]">{formatCurrency(selectedAgent.chiffreAffaires)}</p>
                  <p className="text-sm text-[#376470]">CA mensuel</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <RicashButton 
                variant="outline" 
                size="lg"
                onClick={() => setDeleteAgentOpen(false)}
              >
                Annuler
              </RicashButton>
              <RicashButton 
                variant="destructive" 
                size="lg"
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer définitivement
              </RicashButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
