import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  User, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Award, 
  Shield, 
  MoreHorizontal, 
  Download, 
  RefreshCw, 
  Eye,
  BadgeCheck,
  AlertCircle,
  Clock
} from 'lucide-react'
import { RicashButton, RicashIconButton } from '@/components/ui/ricash-button'
import { RicashCard } from '@/components/ui/ricash-card'
import { RicashStatusBadge } from '@/components/ui/ricash-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { agentService } from '@/services/agentService'

const formatCurrency = (amount) => {
  if (!amount) return '0 XOF'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
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

const getStatusColor = (estActif) => {
  return estActif ? 'success' : 'error'
}

const getStatusText = (estActif) => {
  return estActif ? 'Actif' : 'Inactif'
}

const getKycStatusBadge = (kycStatut) => {
  switch (kycStatut) {
    case 'VERIFIE':
      return <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
        <BadgeCheck className="h-3 w-3" />
        KYC Validé
      </div>
    case 'EN_ATTENTE':
      return <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
        <Clock className="h-3 w-3" />
        En attente
      </div>
    case 'REJETE':
      return <div className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
        <AlertCircle className="h-3 w-3" />
        KYC Rejeté
      </div>
    default:
      return <div className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
        Inconnu
      </div>
  }
}

// Fonction pour adapter les données de l'API à la structure attendue
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
    role: agent.role,
    admin: agent.admin,
    // Champs avec valeurs par défaut pour la compatibilité
    poste: 'Agent',
    niveau: 'Intermédiaire',
    agence: {
      nom: 'Agence Principale',
      ville: 'Dakar'
    },
    chiffreAffaires: 0,
    commission: 0,
    notePerformance: 4.0,
    transactionsJour: 0,
    transactionsMois: 0,
    salaire: 0,
    adresse: 'Non spécifiée',
    dateNaissance: 'Non spécifiée',
    cni: 'Non spécifiée',
    emergencyContact: {
      nom: 'Non spécifié',
      telephone: 'Non spécifié'
    },
    certifications: []
  }
}

export default function AgentDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [agent, setAgent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('🔍 AgentDetailsPage monté - ID:', id)
    loadAgentDetails()
  }, [id])

  const loadAgentDetails = async () => {
    try {
      console.log('🔄 Début du chargement des détails pour l\'agent ID:', id)
      const agentData = await agentService.getAgentById(id)
      console.log('✅ Données agent reçues de l\'API:', agentData)
      
      // Adapter les données de l'API
      const adaptedAgent = adaptAgentData(agentData)
      console.log('🔄 Données adaptées:', adaptedAgent)
      
      setAgent(adaptedAgent)
      toast.success('Données de l\'agent chargées avec succès!')
    } catch (error) {
      console.error('❌ Erreur lors du chargement des détails:', error)
      toast.error('Erreur lors du chargement des données de l\'agent')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    toast.success('Données de l\'agent exportées avec succès!')
  }

  const handleRefresh = () => {
    setIsLoading(true)
    loadAgentDetails()
  }

  const handleViewPerformance = () => {
    if (agent) {
      navigate(`/app/agents/${agent.id}/performance`)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <RicashButton
            variant="outline"
            onClick={() => navigate('/app/agents')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux agents
          </RicashButton>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2B8286]"></div>
          <span className="ml-2 text-[#376470]">Chargement des détails de l'agent...</span>
        </div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <RicashButton
            variant="outline"
            onClick={() => navigate('/app/agents')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux agents
          </RicashButton>
        </div>
        <div className="text-center py-12">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Agent non trouvé</h2>
          <p className="text-gray-600">L'agent avec l'ID {id} n'existe pas.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <RicashButton
            variant="outline"
            onClick={() => navigate('/app/agents')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </RicashButton>
          <div>
            <h1 className="text-3xl font-bold text-[#29475B]">
              {agent.prenom} {agent.nom}
            </h1>
            <p className="text-[#376470]">ID: {agent.identifiant}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <RicashButton 
            variant="outline"
            onClick={() => navigate(`/app/agents/${agent.id}/edit`)}
          >
            Modifier
          </RicashButton>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <RicashButton variant="accent">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                Actions
              </RicashButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleViewPerformance}>
                <Eye className="h-4 w-4 mr-2" />
                Voir performance
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Status and Level */}
      <div className="flex gap-4 flex-wrap">
        <RicashStatusBadge 
          status={getStatusColor(agent.estActif)} 
          text={getStatusText(agent.estActif)} 
        />
        {getKycStatusBadge(agent.kycStatut)}
        <div className="px-3 py-1 bg-[#2B8286]/10 text-[#2B8286] rounded-full text-sm font-medium">
          {agent.niveau}
        </div>
        <div className="px-3 py-1 bg-[#B19068]/10 text-[#B19068] rounded-full text-sm font-medium">
          {agent.poste}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <RicashCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#376470]">Solde de caisse</p>
              <p className="text-2xl font-bold text-[#29475B]">
                {formatCurrency(agent.soldeCaisse)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-[#2B8286]" />
          </div>
        </RicashCard>
        
        <RicashCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#376470]">Chiffre d'affaires</p>
              <p className="text-2xl font-bold text-[#29475B]">
                {formatCurrency(agent.chiffreAffaires)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-[#B19068]" />
          </div>
        </RicashCard>
        
        <RicashCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#376470]">Performance</p>
              <p className="text-2xl font-bold text-[#29475B]">
                {agent.notePerformance}/5
              </p>
            </div>
            <Award className="h-8 w-8 text-[#376470]" />
          </div>
        </RicashCard>
        
        <RicashCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#376470]">Commission</p>
              <p className="text-2xl font-bold text-[#29475B]">
                {formatCurrency(agent.commission)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-[#2B8286]" />
          </div>
        </RicashCard>
      </div>

      {/* Details Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <RicashCard className="p-6">
          <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            Informations personnelles
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-[#376470]" />
              <span className="text-[#29475B]">{agent.telephone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[#376470]" />
              <span className="text-[#29475B]">{agent.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-[#376470]" />
              <span className="text-[#29475B]">{agent.adresse}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-[#376470]" />
              <span className="text-[#29475B]">Date de création: {formatDate(agent.createdAt)}</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-[#376470]" />
              <span className="text-[#29475B]">Rôle: {agent.role}</span>
            </div>
          </div>
        </RicashCard>

        {/* Professional Information */}
        <RicashCard className="p-6">
          <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informations professionnelles
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-[#376470]" />
              <span className="text-[#29475B]">{agent.agence.nom}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-[#376470]" />
              <span className="text-[#29475B]">{agent.agence.ville}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-[#376470]" />
              <span className="text-[#29475B]">Dernière mise à jour: {formatDateTime(agent.updatedAt)}</span>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="h-4 w-4 text-[#376470]" />
              <span className="text-[#29475B]">Salaire: {formatCurrency(agent.salaire)}</span>
            </div>
            <div className="flex items-center gap-3">
              <Award className="h-4 w-4 text-[#376470]" />
              <span className="text-[#29475B]">Niveau: {agent.niveau}</span>
            </div>
          </div>
        </RicashCard>
      </div>

      {/* Documents */}
      <RicashCard className="p-6">
        <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Documents
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {agent.imageRectoUrl && (
            <div>
              <p className="text-sm font-medium text-[#376470] mb-2">CNI Recto</p>
              <img 
                src={agent.imageRectoUrl} 
                alt="CNI Recto" 
                className="h-32 rounded-lg border shadow-sm"
              />
            </div>
          )}
          {agent.imageVersoUrl && (
            <div>
              <p className="text-sm font-medium text-[#376470] mb-2">CNI Verso</p>
              <img 
                src={agent.imageVersoUrl} 
                alt="CNI Verso" 
                className="h-32 rounded-lg border shadow-sm"
              />
            </div>
          )}
        </div>
      </RicashCard>

      {/* Admin validateur */}
      {agent.admin && (
        <RicashCard className="p-6">
          <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            Validé par
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2B8286]/20 flex items-center justify-center">
              <User className="h-5 w-5 text-[#2B8286]" />
            </div>
            <div>
              <p className="font-medium text-[#29475B]">
                {agent.admin.prenom} {agent.admin.nom}
              </p>
              <p className="text-sm text-[#376470]">{agent.admin.email}</p>
            </div>
          </div>
        </RicashCard>
      )}
    </div>
  )
}