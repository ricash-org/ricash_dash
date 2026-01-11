import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Building2, Phone, Mail, MapPin, Calendar, DollarSign, TrendingUp, Award, Shield, MoreHorizontal, Download, RefreshCw, Eye } from 'lucide-react'
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

// Mock data pour les détails d'agent
const mockAgentDetails = {
  AGT001: {
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
  AGT002: {
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
  AGT003: {
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
  AGT004: {
    id: 'AGT004',
    nom: 'Ndiaye',
    prenom: 'Fatou',
    telephone: '+221 77 789 01 23',
    email: 'fatou.ndiaye@ricash.com',
    statut: 'conge',
    dateEmbauche: '2022-08-15',
    poste: 'Agent Principal',
    niveau: 'Senior',
    agence: {
      id: 'AGE003',
      nom: 'Ricash Saint-Louis',
      ville: 'Saint-Louis'
    },
    chiffreAffaires: 520000,
    transactionsJour: 0,
    transactionsMois: 0,
    commission: 13000,
    notePerformance: 4.9,
    certifications: ['KYC', 'AML', 'Formation Manager', 'Leadership'],
    dernierLogin: '2024-01-15T16:45:00',
    salaire: 350000,
    adresse: 'Saint-Louis Centre',
    dateNaissance: '1988-04-12',
    cni: '7890123456789',
    emergencyContact: {
      nom: 'Mamadou Ndiaye',
      telephone: '+221 77 456 78 90'
    }
  },
  AGT005: {
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
}

const formatCurrency = (amount) => {
  if (amount === 0) return '€0'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const getStatusColor = (statut) => {
  switch (statut) {
    case 'actif':
      return 'success'
    case 'inactif':
      return 'error'
    case 'conge':
      return 'warning'
    case 'formation':
      return 'info'
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
    case 'conge':
      return 'En congé'
    case 'formation':
      return 'En formation'
    default:
      return statut
  }
}

export default function AgentDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const agent = mockAgentDetails[id]

  const handleExport = () => {
    // Logique d'export des données de l'agent
    toast.success('Données de l\'agent exportées avec succès!')
  }

  const handleRefresh = () => {
    // Logique de rafraîchissement des données
    toast.success('Données actualisées!')
  }

  const handleViewPerformance = () => {
    navigate(`/app/agents/${agent.id}/performance`)
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
            <p className="text-[#376470]">Agent ID: {agent.id}</p>
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
      <div className="flex gap-4">
        <RicashStatusBadge 
          status={getStatusColor(agent.statut)} 
          text={getStatusText(agent.statut)} 
        />
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
              <p className="text-sm text-[#376470]">Chiffre d'affaires</p>
              <p className="text-2xl font-bold text-[#29475B]">
                {formatCurrency(agent.chiffreAffaires)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-[#2B8286]" />
          </div>
        </RicashCard>
        
        <RicashCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#376470]">Transactions/mois</p>
              <p className="text-2xl font-bold text-[#29475B]">
                {agent.transactionsMois}
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
              <span className="text-[#29475B]">Né le {agent.dateNaissance}</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-[#376470]" />
              <span className="text-[#29475B]">CNI: {agent.cni}</span>
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
              <span className="text-[#29475B]">Embauché le {agent.dateEmbauche}</span>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="h-4 w-4 text-[#376470]" />
              <span className="text-[#29475B]">Salaire: {formatCurrency(agent.salaire)}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-[#376470]" />
              <span className="text-[#29475B]">Dernière connexion: {new Date(agent.dernierLogin).toLocaleString('fr-FR')}</span>
            </div>
          </div>
        </RicashCard>
      </div>

      {/* Certifications */}
      <RicashCard className="p-6">
        <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
          <Award className="h-5 w-5" />
          Certifications
        </h3>
        <div className="flex flex-wrap gap-2">
          {agent.certifications.map((cert, index) => (
            <div key={index} className="px-3 py-1 bg-[#2B8286]/10 text-[#2B8286] rounded-full text-sm font-medium">
              {cert}
            </div>
          ))}
        </div>
      </RicashCard>

      {/* Emergency Contact */}
      <RicashCard className="p-6">
        <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Contact d'urgence
        </h3>
        <div className="space-y-2">
          <p className="text-[#29475B] font-medium">{agent.emergencyContact.nom}</p>
          <p className="text-[#376470]">{agent.emergencyContact.telephone}</p>
        </div>
      </RicashCard>
    </div>
  )
}
