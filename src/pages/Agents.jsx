import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Ban, 
  CheckCircle,
  XCircle,
  Users,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Building2,
  Mail,
  Phone
} from 'lucide-react'
import { RicashButton, RicashIconButton } from '@/components/ui/ricash-button'
import { RicashInput } from '@/components/ui/ricash-input'
import { RicashSelect } from '@/components/ui/ricash-input'
import { RicashCard, RicashStatCard, RicashTableCard } from '@/components/ui/ricash-card'
import { RicashTable, RicashTableHeader, RicashTableBody, RicashTableRow, RicashTableCell, RicashStatusBadge } from '@/components/ui/ricash-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { agentService } from '@/services/agentService'

// Palette de couleurs Ricash
const RICASH_COLORS = {
  bleuFonce: '#29475B',
  dore: '#B19068',
  turquoise: '#2B8286',
  blancCasse: '#F4F2EE',
  bleuVert: '#376470'
}

const formatCurrency = (amount) => {
  if (!amount) return '0 XOF'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const getStatusColor = (estActif) => {
  return estActif ? 'success' : 'error'
}

const getStatusText = (estActif) => {
  return estActif ? 'Actif' : 'Inactif'
}

const getKycStatusBadge = (kycStatut) => {
  switch (kycStatut) {
    case 'VERIFIE':
      return <RicashStatusBadge status="success" text="KYC Validé" />
    case 'EN_ATTENTE':
      return <RicashStatusBadge status="warning" text="En attente" />
    case 'REJETE':
      return <RicashStatusBadge status="error" text="KYC Rejeté" />
    default:
      return <RicashStatusBadge status="default" text="Inconnu" />
  }
}

// Fonction pour adapter les données de l'API à la structure attendue par le composant
const adaptAgentData = (agent) => {
  return {
    id: agent.id,
    identifiant: agent.identifiant,
    nom: agent.nom,
    prenom: agent.prenom,
    telephone: agent.telephone,
    email: agent.email,
    estActif: agent.estActif,
    kycStatut: agent.kycStatut,
    soldeCaisse: agent.soldeCaisse,
    imageRectoUrl: agent.imageRectoUrl,
    imageVersoUrl: agent.imageVersoUrl,
    createdAt: agent.createdAt,
    updatedAt: agent.updatedAt,
    // Champs avec valeurs par défaut pour la compatibilité
    poste: 'Agent', // Valeur par défaut puisque non fournie par l'API
    niveau: 'Intermédiaire', // Valeur par défaut
    agence: {
      nom: 'Agence Principale', // Valeur par défaut
      ville: 'Dakar' // Valeur par défaut
    },
    chiffreAffaires: 0, // Valeur par défaut
    commission: 0, // Valeur par défaut
    notePerformance: 4.0, // Valeur par défaut
    transactionsJour: 0, // Valeur par défaut
    transactionsMois: 0 // Valeur par défaut
  }
}

export default function Agents() {
  const navigate = useNavigate()
  const [agents, setAgents] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    kycStatus: 'all'
  })

  // Charger les agents au montage du composant
  useEffect(() => {
    loadAgents()
  }, [])

  const loadAgents = async () => {
    setIsLoading(true)
    try {
      const agentsData = await agentService.getAllAgents()
      // Adapter les données de l'API
      const adaptedAgents = agentsData.map(adaptAgentData)
      setAgents(adaptedAgents)
    } catch (error) {
      console.error('Erreur lors du chargement des agents:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      const matchesSearch = 
        agent.nom?.toLowerCase().includes(filters.search.toLowerCase()) ||
        agent.prenom?.toLowerCase().includes(filters.search.toLowerCase()) ||
        agent.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
        agent.identifiant?.toLowerCase().includes(filters.search.toLowerCase()) ||
        agent.telephone?.includes(filters.search)
      
      const matchesStatus = filters.status === 'all' || 
        (filters.status === 'actif' && agent.estActif) ||
        (filters.status === 'inactif' && !agent.estActif)
      
      const matchesKycStatus = filters.kycStatus === 'all' || 
        agent.kycStatut === filters.kycStatus

      return matchesSearch && matchesStatus && matchesKycStatus
    })
  }, [agents, filters])

  const stats = {
    total: agents.length,
    actifs: agents.filter(a => a.estActif).length,
    inactifs: agents.filter(a => !a.estActif).length,
    kycVerifies: agents.filter(a => a.kycStatut === 'VERIFIE').length,
    soldeTotal: agents.reduce((sum, a) => sum + (a.soldeCaisse || 0), 0),
    chiffreAffairesTotal: agents.reduce((sum, a) => sum + (a.chiffreAffaires || 0), 0)
  }

  // Handlers pour les actions
  const handleViewDetails = (agent) => {
    navigate(`/app/agents/${agent.id}`)
  }

  const handleViewPerformance = (agent) => {
    navigate(`/app/agents/${agent.id}/performance`)
  }

  const handleToggleStatus = async (agent) => {
    try {
      await agentService.toggleAgentStatus(agent.id, !agent.estActif)
      await loadAgents() // Recharger les données
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error)
    }
  }

  const handleDeleteAgent = async (agentId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet agent ? Cette action est irréversible.')) {
      try {
        await agentService.deleteAgent(agentId)
        await loadAgents() // Recharger les données
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
      }
    }
  }

  const handleRefresh = async () => {
    await loadAgents()
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
        <DropdownMenuItem onClick={() => handleViewPerformance(agent)}>
          <TrendingUp className="mr-2 h-4 w-4" />
          Performance
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {agent.estActif ? (
          <DropdownMenuItem onClick={() => handleToggleStatus(agent)}>
            <Ban className="mr-2 h-4 w-4" />
            Désactiver
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => handleToggleStatus(agent)}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Activer
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          onClick={() => handleDeleteAgent(agent.id)}
          className="text-red-600 focus:text-red-600"
        >
          <XCircle className="mr-2 h-4 w-4" />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    )
  }

  return (
    <div className="space-y-8 p-6 bg-[#F4F2EE] min-h-screen">
      {/* Page header */}
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

      {/* Stats cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <RicashStatCard
          title="Total agents"
          value={stats.total.toString()}
          description="Tous statuts"
          icon={Users}
          iconColor={RICASH_COLORS.turquoise}
        />
        <RicashStatCard
          title="Actifs"
          value={stats.actifs.toString()}
          description="En service"
          icon={CheckCircle}
          iconColor={RICASH_COLORS.turquoise}
        />
        <RicashStatCard
          title="Inactifs"
          value={stats.inactifs.toString()}
          description="Hors service"
          icon={XCircle}
          iconColor="#ef4444"
        />
        <RicashStatCard
          title="KYC Validés"
          value={stats.kycVerifies.toString()}
          description="Documents vérifiés"
          icon={CheckCircle}
          iconColor={RICASH_COLORS.bleuVert}
        />
        <RicashStatCard
          title="Solde Total"
          value={formatCurrency(stats.soldeTotal)}
          description="Total des caisses"
          icon={DollarSign}
          iconColor={RICASH_COLORS.bleuFonce}
        />
        <RicashStatCard
          title="CA Total"
          value={formatCurrency(stats.chiffreAffairesTotal)}
          description="Ce mois"
          icon={TrendingUp}
          iconColor={RICASH_COLORS.dore}
        />
      </div>

      {/* Filtres et recherche */}
      <RicashCard className="overflow-hidden">
        <div className="p-6 border-b border-[#376470]/10">
          <h3 className="text-xl font-bold text-[#29475B] mb-4">
            Filtres et recherche
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            </RicashSelect>

            <RicashSelect
              value={filters.kycStatus}
              onValueChange={(value) => setFilters(prev => ({ ...prev, kycStatus: value }))}
            >
              <option value="all">Tous les KYC</option>
              <option value="VERIFIE">KYC Validé</option>
              <option value="EN_ATTENTE">En attente</option>
              <option value="REJETE">KYC Rejeté</option>
            </RicashSelect>
          </div>
        </div>
      </RicashCard>

      {/* Tableau des agents */}
      <RicashTableCard
        title="Liste des agents"
        description={`${filteredAgents.length} agent(s) trouvé(s)`}
        className="overflow-hidden"
      >
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2B8286] mx-auto"></div>
            <p className="mt-2 text-[#376470]">Chargement des agents...</p>
          </div>
        ) : (
          <RicashTable>
            <RicashTableHeader>
              <RicashTableRow>
                <RicashTableCell className="font-semibold text-[#29475B]">Agent</RicashTableCell>
                <RicashTableCell className="font-semibold text-[#29475B]">Contact</RicashTableCell>
                <RicashTableCell className="font-semibold text-[#29475B]">Statut</RicashTableCell>
                <RicashTableCell className="font-semibold text-[#29475B]">KYC</RicashTableCell>
                <RicashTableCell className="font-semibold text-[#29475B]">Solde</RicashTableCell>
                <RicashTableCell className="font-semibold text-[#29475B]">Actions</RicashTableCell>
              </RicashTableRow>
            </RicashTableHeader>
            <RicashTableBody>
              {filteredAgents.map((agent) => (
                <RicashTableRow key={agent.id} className="hover:bg-[#376470]/5 transition-colors">
                  <RicashTableCell>
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-[#2B8286]/20 flex items-center justify-center flex-shrink-0">
                        <Users className="h-5 w-5 text-[#2B8286]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-[#29475B] truncate">
                          {agent.prenom} {agent.nom}
                        </div>
                        <div className="text-sm text-[#376470] truncate">{agent.poste}</div>
                        <div className="text-xs text-[#376470]/70 truncate">ID: {agent.identifiant}</div>
                      </div>
                    </div>
                  </RicashTableCell>
                  
                  <RicashTableCell>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-[#376470] flex-shrink-0" />
                        <span className="text-[#29475B] truncate">{agent.telephone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-[#376470] flex-shrink-0" />
                        <span className="text-[#29475B] truncate">{agent.email}</span>
                      </div>
                    </div>
                  </RicashTableCell>
                  
                  <RicashTableCell>
                    <RicashStatusBadge 
                      status={getStatusColor(agent.estActif)} 
                      text={getStatusText(agent.estActif)} 
                    />
                  </RicashTableCell>

                  <RicashTableCell>
                    {getKycStatusBadge(agent.kycStatut)}
                  </RicashTableCell>
                  
                  <RicashTableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-[#29475B]">
                        {formatCurrency(agent.soldeCaisse)}
                      </div>
                      <div className="text-xs text-[#376470]">
                        Créé le {new Date(agent.createdAt).toLocaleDateString('fr-FR')}
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
        )}
        
        {filteredAgents.length === 0 && !isLoading && (
          <div className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun agent trouvé</h3>
            <p className="text-gray-600">
              {filters.search || filters.status !== 'all' || filters.kycStatus !== 'all'
                ? "Aucun agent ne correspond aux critères de recherche."
                : "Aucun agent n'est enregistré dans le système."}
            </p>
          </div>
        )}
      </RicashTableCard>
    </div>
  )
}