import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Ban, 
  CheckCircle,
  XCircle,
  Clock,
  User,
  Phone,
  Mail,
  Building2,
  Award,
  TrendingUp,
  MapPin,
  RefreshCw,
  Users,
  DollarSign,
  Activity,
  Shield,
  Zap
} from 'lucide-react'
import { RicashButton, RicashIconButton, RicashActionButton } from '@/components/ui/ricash-button'
import { RicashInput } from '@/components/ui/ricash-input'
import { RicashSelect } from '@/components/ui/ricash-input'
import { RicashCard, RicashStatCard, RicashTableCard } from '@/components/ui/ricash-card'
import { RicashTable, RicashTableHeader, RicashTableBody, RicashTableRow, RicashTableCell, RicashStatusBadge } from '@/components/ui/ricash-table'
import { LoadingButton } from '@/components/ui/loading-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Les modals ont été remplacés par des pages dédiées

// Palette de couleurs Ricash
const RICASH_COLORS = {
  bleuFonce: '#29475B',
  dore: '#B19068',
  turquoise: '#2B8286',
  blancCasse: '#F4F2EE',
  bleuVert: '#376470'
}

// Mock data for agents
const initialAgents = [
  {
    id: 'AGT001',
    nom: 'Sarr',
    prenom: 'Ibrahima',
    telephone: '+221 77 123 45 67',
    email: 'ibrahima.sarr@ricash.com',
    statut: 'actif',
    dateEmbauche: '2023-01-15',
    poste: 'Agent Principal',
    niveau: 'Senior',
    agence: {
      id: 'AGE001',
      nom: 'Ricash Dakar Centre',
      ville: 'Dakar'
    },
    chiffreAffaires: 450000,
    transactionsJour: 35,
    transactionsMois: 850,
    commission: 11250,
    notePerformance: 4.8,
    certifications: ['KYC', 'AML', 'Formation Manager'],
    dernierLogin: '2024-01-20T14:30:00',
    salaire: 320000,
    adresse: 'Mermoz, Dakar',
    dateNaissance: '1985-03-15',
    cni: '1234567890123',
    emergencyContact: {
      nom: 'Aminata Sarr',
      telephone: '+221 77 987 65 43'
    }
  },
  {
    id: 'AGT002',
    nom: 'Diop',
    prenom: 'Mariam',
    telephone: '+221 76 987 65 43',
    email: 'mariam.diop@ricash.com',
    statut: 'actif',
    dateEmbauche: '2023-02-20',
    poste: 'Agent Caissier',
    niveau: 'Intermédiaire',
    agence: {
      id: 'AGE001',
      nom: 'Ricash Dakar Centre',
      ville: 'Dakar'
    },
    chiffreAffaires: 380000,
    transactionsJour: 28,
    transactionsMois: 720,
    commission: 9500,
    notePerformance: 4.5,
    certifications: ['KYC', 'AML'],
    dernierLogin: '2024-01-20T13:15:00',
    salaire: 280000,
    adresse: 'Ouakam, Dakar',
    dateNaissance: '1990-07-22',
    cni: '9876543210987',
    emergencyContact: {
      nom: 'Moussa Diop',
      telephone: '+221 76 123 45 67'
    }
  },
  {
    id: 'AGT003',
    nom: 'Diallo',
    prenom: 'Ousmane',
    telephone: '+221 78 456 78 90',
    email: 'ousmane.diallo@ricash.com',
    statut: 'formation',
    dateEmbauche: '2024-01-10',
    poste: 'Agent Stagiaire',
    niveau: 'Junior',
    agence: {
      id: 'AGE002',
      nom: 'Ricash Thiès',
      ville: 'Thiès'
    },
    chiffreAffaires: 0,
    transactionsJour: 0,
    transactionsMois: 0,
    commission: 0,
    notePerformance: 0,
    certifications: ['Formation de base'],
    dernierLogin: '2024-01-19T09:00:00',
    salaire: 200000,
    adresse: 'Thiès Centre',
    dateNaissance: '1995-11-08',
    cni: '4567890123456',
    emergencyContact: {
      nom: 'Fatou Diallo',
      telephone: '+221 78 987 65 43'
    }
  },
  {
    id: 'AGT004',
    nom: 'Ndiaye',
    prenom: 'Fatou',
    telephone: '+221 77 789 01 23',
    email: 'fatou.ndiaye@ricash.com',
    statut: 'inactif',
    dateEmbauche: '2022-08-15',
    poste: 'Agent Principal',
    niveau: 'Senior',
    agence: {
      id: 'AGE003',
      nom: 'Ricash Saint-Louis',
      ville: 'Saint-Louis'
    },
    chiffreAffaires: 520000,
    transactionsJour: 42,
    transactionsMois: 920,
    commission: 13000,
    notePerformance: 4.9,
    certifications: ['KYC', 'AML', 'Formation Manager', 'Leadership'],
    dernierLogin: '2024-01-20T16:45:00',
    salaire: 350000,
    adresse: 'Saint-Louis Centre',
    dateNaissance: '1988-04-12',
    cni: '7890123456789',
    emergencyContact: {
      nom: 'Mamadou Ndiaye',
      telephone: '+221 77 456 78 90'
    }
  },
  {
    id: 'AGT005',
    nom: 'Ba',
    prenom: 'Mamadou',
    telephone: '+221 76 321 54 67',
    email: 'mamadou.ba@ricash.com',
    statut: 'inactif',
    dateEmbauche: '2022-03-10',
    poste: 'Agent Caissier',
    niveau: 'Intermédiaire',
    agence: {
      id: 'AGE001',
      nom: 'Ricash Dakar Centre',
      ville: 'Dakar'
    },
    chiffreAffaires: 0,
    transactionsJour: 0,
    transactionsMois: 0,
    commission: 0,
    notePerformance: 3.2,
    certifications: ['KYC'],
    dernierLogin: '2023-12-15T10:30:00',
    salaire: 250000,
    adresse: 'Yoff, Dakar',
    dateNaissance: '1992-09-25',
    cni: '3216549870123',
    emergencyContact: {
      nom: 'Aissatou Ba',
      telephone: '+221 76 789 01 23'
    }
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


const getPerformanceColor = (note) => {
  if (note >= 4.5) return 'text-[#2B8286]'
  if (note >= 4.0) return 'text-[#B19068]'
  if (note >= 3.5) return 'text-[#376470]'
  return 'text-red-500'
}

const getStatusColor = (statut) => {
  switch (statut) {
    case 'actif':
      return 'success'
    case 'inactif':
      return 'error'
    case 'formation':
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
    case 'formation':
      return 'En formation'
    default:
      return statut
  }
}

export default function Agents() {
  const navigate = useNavigate()
  const [agents, setAgents] = useState(initialAgents)
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    niveau: 'all',
    agence: 'all',
    poste: 'all'
  })
  
  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      const matchesSearch = agent.nom.toLowerCase().includes(filters.search.toLowerCase()) ||
        agent.prenom.toLowerCase().includes(filters.search.toLowerCase()) ||
        agent.email.toLowerCase().includes(filters.search.toLowerCase()) ||
                           agent.telephone.includes(filters.search)
      const matchesStatus = filters.status === 'all' || agent.statut === filters.status
      const matchesNiveau = filters.niveau === 'all' || agent.niveau === filters.niveau
      const matchesAgence = filters.agence === 'all' || agent.agence.ville === filters.agence
      const matchesPoste = filters.poste === 'all' || agent.poste === filters.poste

    return matchesSearch && matchesStatus && matchesNiveau && matchesAgence && matchesPoste
  })
  }, [agents, filters])

  const stats = {
    total: agents.length,
    actifs: agents.filter(a => a.statut === 'actif').length,
    inactifs: agents.filter(a => a.statut === 'inactif').length,
    enFormation: agents.filter(a => a.statut === 'formation').length,
    chiffreAffairesTotal: agents.reduce((sum, a) => sum + a.chiffreAffaires, 0),
    commissionTotale: agents.reduce((sum, a) => sum + a.commission, 0),
    performanceMoyenne: agents.reduce((sum, a) => sum + a.notePerformance, 0) / agents.length
  }

  // Modal handlers
  const handleViewDetails = (agent) => {
    navigate(`/app/agents/${agent.id}/details`)
  }


  const handleSuspendAgent = (agent) => {
    setAgents(prev => prev.map(a => 
      a.id === agent.id 
        ? { ...a, statut: a.statut === 'suspendu' ? 'actif' : 'suspendu' }
        : a
    ))
  }

  const handleActivateAgent = (agent) => {
    setAgents(prev => prev.map(a => 
      a.id === agent.id 
        ? { ...a, statut: 'actif' }
        : a
    ))
  }


  const handleDeleteAgent = (agentId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet agent ? Cette action est irréversible.')) {
      setAgents(prev => prev.filter(agent => agent.id !== agentId))
    }
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simuler un rechargement des données
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  const renderAgentActions = (agent) => {
    return (
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-[#29475B]">Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleViewDetails(agent)}>
          <Eye className="mr-2 h-4 w-4" />
          Voir détails
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {agent.statut === 'actif' ? (
          <DropdownMenuItem onClick={() => handleSuspendAgent(agent)}>
            <Ban className="mr-2 h-4 w-4" />
            Suspendre
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => handleActivateAgent(agent)}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Activer
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          onClick={() => handleDeleteAgent(agent.id)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    )
  }

  return (
    <div className="space-y-8 p-6 bg-[#F4F2EE] min-h-screen">
      {/* Page header avec design Ricash */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#376470]/10">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#29475B] mb-2">
              Gestion des Agents
            </h1>
            <p className="text-lg text-[#376470] font-medium">
            Gérez votre équipe d'agents et suivez leurs performances
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
              onClick={() => navigate('/app/agents/create')}
          >
              <Plus className="mr-2 h-5 w-5" />
          Nouvel agent
            </RicashButton>
          </div>
        </div>
      </div>

      {/* Stats cards avec design Ricash */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <RicashStatCard
          title="Total agents"
          value={stats.total.toString()}
          change="+2"
          changeType="positive"
          description="Ce mois"
          icon={Users}
          iconColor={RICASH_COLORS.turquoise}
          className="transform hover:scale-105 transition-transform duration-300"
        />
        <RicashStatCard
          title="Actifs"
          value={stats.actifs.toString()}
          change="+1"
          changeType="positive"
          description="Ce mois"
          icon={CheckCircle}
          iconColor={RICASH_COLORS.turquoise}
          className="transform hover:scale-105 transition-transform duration-300"
        />
        <RicashStatCard
          title="Formation"
          value={stats.enFormation.toString()}
          change="+1"
          changeType="positive"
          description="Ce mois"
          icon={Award}
          iconColor={RICASH_COLORS.bleuVert}
          className="transform hover:scale-105 transition-transform duration-300"
        />
        <RicashStatCard
          title="Inactifs"
          value={stats.inactifs.toString()}
          change="-1"
          changeType="negative"
          description="Ce mois"
          icon={XCircle}
          iconColor="#ef4444"
          className="transform hover:scale-105 transition-transform duration-300"
        />
        <RicashStatCard
          title="CA Total"
          value={formatCurrency(stats.chiffreAffairesTotal)}
          change="+15%"
          changeType="positive"
          description="Ce mois"
          icon={DollarSign}
          iconColor={RICASH_COLORS.bleuFonce}
          className="transform hover:scale-105 transition-transform duration-300"
        />
        <RicashStatCard
          title="Commissions"
          value={formatCurrency(stats.commissionTotale)}
          change="+12%"
          changeType="positive"
          description="Ce mois"
          icon={TrendingUp}
          iconColor={RICASH_COLORS.dore}
          className="transform hover:scale-105 transition-transform duration-300"
        />
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
                placeholder="Rechercher un agent..."
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
              <option value="inactif">Inactif</option>
              <option value="formation">En formation</option>
            </RicashSelect>

            <RicashSelect
                value={filters.niveau}
              onValueChange={(value) => setFilters(prev => ({ ...prev, niveau: value }))}
            >
              <option value="all">Tous les niveaux</option>
              <option value="Junior">Junior</option>
              <option value="Intermédiaire">Intermédiaire</option>
              <option value="Senior">Senior</option>
            </RicashSelect>

            <RicashSelect
                value={filters.agence}
              onValueChange={(value) => setFilters(prev => ({ ...prev, agence: value }))}
            >
              <option value="all">Toutes les agences</option>
              <option value="Dakar">Dakar</option>
              <option value="Thiès">Thiès</option>
              <option value="Saint-Louis">Saint-Louis</option>
            </RicashSelect>

            <RicashSelect
                value={filters.poste}
              onValueChange={(value) => setFilters(prev => ({ ...prev, poste: value }))}
            >
              <option value="all">Tous les postes</option>
              <option value="Agent Principal">Agent Principal</option>
              <option value="Agent Caissier">Agent Caissier</option>
              <option value="Agent Stagiaire">Agent Stagiaire</option>
            </RicashSelect>
          </div>
        </div>
      </RicashCard>

      {/* Tableau des agents avec design Ricash */}
      <RicashTableCard
        title="Liste des agents"
        description={`${filteredAgents.length} agent(s) trouvé(s)`}
        className="overflow-hidden"
      >
        <RicashTable>
          <RicashTableHeader>
            <RicashTableRow>
              <RicashTableCell className="font-semibold text-[#29475B]">Agent</RicashTableCell>
              <RicashTableCell className="font-semibold text-[#29475B]">Contact</RicashTableCell>
              <RicashTableCell className="font-semibold text-[#29475B]">Statut</RicashTableCell>
              <RicashTableCell className="font-semibold text-[#29475B]">Agence</RicashTableCell>
              <RicashTableCell className="font-semibold text-[#29475B]">Actions</RicashTableCell>
            </RicashTableRow>
          </RicashTableHeader>
          <RicashTableBody>
                {filteredAgents.map((agent) => (
              <RicashTableRow key={agent.id} className="hover:bg-[#376470]/5 transition-colors">
                <RicashTableCell>
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#2B8286]/20 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-[#2B8286]" />
                    </div>
                      <div className="min-w-0 flex-1">
                      <div className="font-semibold text-[#29475B] truncate">
                        {agent.prenom} {agent.nom}
                      </div>
                      <div className="text-sm text-[#376470] truncate">{agent.poste}</div>
                      <div className="text-xs text-[#376470]/70 truncate">ID: {agent.id}</div>
                    </div>
                  </div>
                </RicashTableCell>
                
                <RicashTableCell>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-3 w-3 text-[#376470] flex-shrink-0" />
                      <span className="text-[#29475B] truncate">{agent.telephone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-3 w-3 text-[#376470] flex-shrink-0" />
                      <span className="text-[#29475B] truncate">{agent.email}</span>
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
                  <div className="flex items-center space-x-2 min-w-0">
                    <Building2 className="h-4 w-4 text-[#376470] flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                      <div className="font-medium text-[#29475B] truncate">{agent.agence.nom}</div>
                      <div className="text-sm text-[#376470] truncate">{agent.agence.ville}</div>
                        </div>
                      </div>
                </RicashTableCell>
                
                <RicashTableCell>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#376470]">CA:</span>
                      <span className="font-medium text-[#29475B]">
                        {formatCurrency(agent.chiffreAffaires)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#376470]">Commission:</span>
                      <span className="font-medium text-[#29475B]">
                        {formatCurrency(agent.commission)}
                      </span>
                    </div>
                  </div>
                </RicashTableCell>
                
                <RicashTableCell>
                  <div className="flex items-center space-x-2">
                    <RicashIconButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(agent)}
                      className="text-[#2B8286] hover:bg-[#2B8286]/10"
                    >
                      <Eye className="h-4 w-4" />
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
                        {renderAgentActions(agent)}
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
