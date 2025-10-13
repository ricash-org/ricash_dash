import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  User,
  Phone,
  Mail,
  Building2,
  Calendar,
  MapPin,
  Award,
  TrendingUp,
  Clock,
  DollarSign,
  Shield,
  FileText,
  Star,
  Edit,
  MoreVertical,
  ArrowLeft,
  BadgeCheck,
  AlertCircle
} from 'lucide-react'
import { RicashButton } from '@/components/ui/ricash-button'
import { RicashCard } from '@/components/ui/ricash-card'
import { Badge } from '@/components/ui/badge'
import { agentService } from '@/services/agentService'

const formatCurrency = (amount) => {
  if (!amount) return '0 XOF'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
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

const getStatusBadge = (estActif) => {
  return estActif ? 
    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Actif</Badge> :
    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inactif</Badge>
}

const getKycStatusBadge = (kycStatut) => {
  switch (kycStatut) {
    case 'VERIFIE':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        <BadgeCheck className="h-3 w-3 mr-1" />
        KYC Validé
      </Badge>
    case 'EN_ATTENTE':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
        <Clock className="h-3 w-3 mr-1" />
        En attente
      </Badge>
    case 'REJETE':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        <AlertCircle className="h-3 w-3 mr-1" />
        KYC Rejeté
      </Badge>
    default:
      return <Badge variant="secondary">Inconnu</Badge>
  }
}

export default function AgentDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [agent, setAgent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('🔍 ID récupéré des paramètres:', id);
    console.log('📍 URL actuelle:', window.location.href);
    loadAgentDetails()
  }, [id])

  const loadAgentDetails = async () => {
    try {
      console.log('🔄 Début du chargement des détails pour l\'agent ID:', id);
      const agentData = await agentService.getAgentById(id)
      console.log('✅ Données agent reçues:', agentData);
      setAgent(agentData)
    } catch (error) {
      console.error('❌ Erreur complète lors du chargement:', error);
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2B8286]"></div>
        </div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="p-6">
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
            Retour aux agents
          </RicashButton>
          <div>
            <h1 className="text-3xl font-bold text-[#29475B]">
              {agent.prenom} {agent.nom}
            </h1>
            <p className="text-[#376470]">ID: {agent.identifiant}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <RicashButton variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </RicashButton>
        </div>
      </div>

      {/* Status badges */}
      <div className="flex flex-wrap gap-2">
        {getStatusBadge(agent.estActif)}
        {getKycStatusBadge(agent.kycStatut)}
        <Badge variant="outline">
          {agent.role}
        </Badge>
      </div>

      {/* Informations principales */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Informations personnelles */}
        <RicashCard className="p-6">
          <h2 className="text-xl font-bold text-[#29475B] mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            Informations personnelles
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#376470]">Nom</label>
                <p className="text-[#29475B] font-medium">{agent.nom}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#376470]">Prénom</label>
                <p className="text-[#29475B] font-medium">{agent.prenom}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[#376470]" />
              <div>
                <label className="text-sm font-medium text-[#376470]">Email</label>
                <p className="text-[#29475B] font-medium">{agent.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-[#376470]" />
              <div>
                <label className="text-sm font-medium text-[#376470]">Téléphone</label>
                <p className="text-[#29475B] font-medium">{agent.telephone}</p>
              </div>
            </div>
          </div>
        </RicashCard>

        {/* Informations professionnelles */}
        <RicashCard className="p-6">
          <h2 className="text-xl font-bold text-[#29475B] mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informations professionnelles
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#376470]">Rôle</label>
              <p className="text-[#29475B] font-medium">{agent.role}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-[#376470]" />
              <div>
                <label className="text-sm font-medium text-[#376470]">Date de création</label>
                <p className="text-[#29475B] font-medium">{formatDate(agent.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-[#376470]" />
              <div>
                <label className="text-sm font-medium text-[#376470]">Dernière mise à jour</label>
                <p className="text-[#29475B] font-medium">{formatDateTime(agent.updatedAt)}</p>
              </div>
            </div>
          </div>
        </RicashCard>

        {/* Solde et finances */}
        <RicashCard className="p-6">
          <h2 className="text-xl font-bold text-[#29475B] mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Solde de caisse
          </h2>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#29475B] mb-2">
              {formatCurrency(agent.soldeCaisse)}
            </div>
            <p className="text-sm text-[#376470]">Solde actuel</p>
          </div>
        </RicashCard>

        {/* Documents */}
        <RicashCard className="p-6">
          <h2 className="text-xl font-bold text-[#29475B] mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-[#376470]">CNI Recto</label>
              {agent.imageRectoUrl && (
                <div className="mt-1">
                  <img 
                    src={agent.imageRectoUrl} 
                    alt="CNI Recto" 
                    className="h-20 rounded border"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-[#376470]">CNI Verso</label>
              {agent.imageVersoUrl && (
                <div className="mt-1">
                  <img 
                    src={agent.imageVersoUrl} 
                    alt="CNI Verso" 
                    className="h-20 rounded border"
                  />
                </div>
              )}
            </div>
          </div>
        </RicashCard>
      </div>

      {/* Admin validateur */}
      {agent.admin && (
        <RicashCard className="p-6">
          <h2 className="text-xl font-bold text-[#29475B] mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Validé par
          </h2>
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