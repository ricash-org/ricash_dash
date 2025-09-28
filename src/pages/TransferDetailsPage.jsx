import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft,
  ArrowLeftRight, 
  User, 
  MapPin, 
  Calendar, 
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Copy,
  Download,
  MessageSquare,
  Building2,
  Phone,
  Mail,
  DollarSign,
  Percent,
  Shield,
  Eye,
  RefreshCw
} from 'lucide-react'
import { RicashButton } from '@/components/ui/ricash-button'
import { RicashCard } from '@/components/ui/ricash-card'
import { RicashInput } from '@/components/ui/ricash-input'
import { RicashLabel } from '@/components/ui/ricash-label'
import { RicashTextarea } from '@/components/ui/ricash-textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

// Mock data pour les détails de transfert
const mockTransferDetails = {
  TXN001: {
    id: 'TXN001',
    expediteur: { 
      nom: 'Jean Dupont', 
      prenom: 'Jean',
      telephone: '+33 6 12 34 56 78', 
      email: 'jean.dupont@email.com',
      adresse: '123 Rue de la République, Paris, France',
      pays: 'France',
      cni: '1234567890123'
    },
    destinataire: { 
      nom: 'Fatou Diallo', 
      prenom: 'Fatou',
      telephone: '+221 77 123 45 67', 
      email: 'fatou.diallo@email.com',
      adresse: '456 Avenue Léopold Sédar Senghor, Dakar, Sénégal',
      pays: 'Sénégal',
      cni: '9876543210987'
    },
    montant: 500,
    devise: 'EUR',
    frais: 15,
    montantTotal: 515,
    statut: 'en_attente',
    dateCreation: '2024-01-15T10:30:00Z',
    dateTraitement: null,
    pays: 'France → Sénégal',
    agence: { nom: 'Agence Dakar Centre', ville: 'Dakar', id: 'AGE001' },
    agent: { nom: 'Amadou Diallo', telephone: '+221 77 987 65 43', email: 'amadou.diallo@ricash.com' },
    codeRetrait: 'RC123456',
    motif: 'Frais médicaux',
    urgence: 'normal',
    historique: [
      { date: '2024-01-15T10:30:00Z', action: 'Transfert créé', statut: 'en_attente' },
      { date: '2024-01-15T10:35:00Z', action: 'Validation expéditeur', statut: 'en_attente' },
      { date: '2024-01-15T10:40:00Z', action: 'Validation destinataire', statut: 'en_attente' }
    ],
    documents: [
      { nom: 'CNI Expéditeur', type: 'pdf', taille: '2.3 MB', statut: 'validé' },
      { nom: 'Justificatif revenus', type: 'pdf', taille: '1.8 MB', statut: 'en_attente' }
    ]
  },
  TXN002: {
    id: 'TXN002',
    expediteur: { 
      nom: 'Marie Martin', 
      prenom: 'Marie',
      telephone: '+33 6 98 76 54 32', 
      email: 'marie.martin@email.com',
      adresse: '789 Boulevard Saint-Germain, Paris, France',
      pays: 'France',
      cni: '1112223334445'
    },
    destinataire: { 
      nom: 'Ibrahima Sarr', 
      prenom: 'Ibrahima',
      telephone: '+221 77 234 56 78', 
      email: 'ibrahima.sarr@email.com',
      adresse: '321 Rue de la Paix, Dakar, Sénégal',
      pays: 'Sénégal',
      cni: '5556667778889'
    },
    montant: 1200,
    devise: 'EUR',
    frais: 25,
    montantTotal: 1225,
    statut: 'traite',
    dateCreation: '2024-01-14T14:20:00Z',
    dateTraitement: '2024-01-14T16:45:00Z',
    pays: 'France → Sénégal',
    agence: { nom: 'Agence Dakar Centre', ville: 'Dakar', id: 'AGE001' },
    agent: { nom: 'Amadou Diallo', telephone: '+221 77 987 65 43', email: 'amadou.diallo@ricash.com' },
    codeRetrait: 'RC789012',
    motif: 'Aide familiale',
    urgence: 'urgent',
    historique: [
      { date: '2024-01-14T14:20:00Z', action: 'Transfert créé', statut: 'en_attente' },
      { date: '2024-01-14T14:25:00Z', action: 'Validation expéditeur', statut: 'en_attente' },
      { date: '2024-01-14T14:30:00Z', action: 'Validation destinataire', statut: 'en_attente' },
      { date: '2024-01-14T16:45:00Z', action: 'Transfert traité', statut: 'traite' }
    ],
    documents: [
      { nom: 'CNI Expéditeur', type: 'pdf', taille: '2.1 MB', statut: 'validé' },
      { nom: 'Justificatif revenus', type: 'pdf', taille: '1.9 MB', statut: 'validé' },
      { nom: 'Reçu de retrait', type: 'pdf', taille: '0.8 MB', statut: 'validé' }
    ]
  },
  TXN003: {
    id: 'TXN003',
    expediteur: { 
      nom: 'Pierre Dubois', 
      prenom: 'Pierre',
      telephone: '+33 6 45 67 89 01', 
      email: 'pierre.dubois@email.com',
      adresse: '456 Rue de Rivoli, Lyon, France',
      pays: 'France',
      cni: '3334445556667'
    },
    destinataire: { 
      nom: 'Aminata Traoré', 
      prenom: 'Aminata',
      telephone: '+221 78 345 67 89', 
      email: 'aminata.traore@email.com',
      adresse: '789 Avenue Bourguiba, Dakar, Sénégal',
      pays: 'Sénégal',
      cni: '1112223334445'
    },
    montant: 800,
    devise: 'EUR',
    frais: 20,
    montantTotal: 820,
    statut: 'suspendu',
    dateCreation: '2024-01-13T09:15:00Z',
    dateTraitement: null,
    pays: 'France → Sénégal',
    agence: { nom: 'Agence Dakar Plateau', ville: 'Dakar', id: 'AGE002' },
    agent: { nom: 'Fatou Sarr', telephone: '+221 77 123 45 67', email: 'fatou.sarr@ricash.com' },
    codeRetrait: 'RC345678',
    motif: 'Études',
    urgence: 'normal',
    historique: [
      { date: '2024-01-13T09:15:00Z', action: 'Transfert créé', statut: 'en_attente' },
      { date: '2024-01-13T09:20:00Z', action: 'Validation expéditeur', statut: 'en_attente' },
      { date: '2024-01-13T09:25:00Z', action: 'Suspension pour vérification', statut: 'suspendu' }
    ],
    documents: [
      { nom: 'CNI Expéditeur', type: 'pdf', taille: '2.0 MB', statut: 'validé' },
      { nom: 'Justificatif revenus', type: 'pdf', taille: '1.7 MB', statut: 'en_attente' },
      { nom: 'Certificat scolaire', type: 'pdf', taille: '1.2 MB', statut: 'en_attente' }
    ]
  },
  TXN004: {
    id: 'TXN004',
    expediteur: { 
      nom: 'Sophie Laurent', 
      prenom: 'Sophie',
      telephone: '+33 6 23 45 67 89', 
      email: 'sophie.laurent@email.com',
      adresse: '321 Avenue des Champs-Élysées, Paris, France',
      pays: 'France',
      cni: '7778889990001'
    },
    destinataire: { 
      nom: 'Moussa Diop', 
      prenom: 'Moussa',
      telephone: '+221 76 456 78 90', 
      email: 'moussa.diop@email.com',
      adresse: '654 Rue de la Liberté, Thiès, Sénégal',
      pays: 'Sénégal',
      cni: '2223334445556'
    },
    montant: 300,
    devise: 'EUR',
    frais: 12,
    montantTotal: 312,
    statut: 'annule',
    dateCreation: '2024-01-12T16:45:00Z',
    dateTraitement: null,
    pays: 'France → Sénégal',
    agence: { nom: 'Agence Thiès Centre', ville: 'Thiès', id: 'AGE003' },
    agent: { nom: 'Ibrahima Fall', telephone: '+221 77 234 56 78', email: 'ibrahima.fall@ricash.com' },
    codeRetrait: 'RC456789',
    motif: 'Urgence médicale',
    urgence: 'urgent',
    historique: [
      { date: '2024-01-12T16:45:00Z', action: 'Transfert créé', statut: 'en_attente' },
      { date: '2024-01-12T16:50:00Z', action: 'Validation expéditeur', statut: 'en_attente' },
      { date: '2024-01-12T17:00:00Z', action: 'Transfert annulé par le client', statut: 'annule' }
    ],
    documents: [
      { nom: 'CNI Expéditeur', type: 'pdf', taille: '2.1 MB', statut: 'validé' },
      { nom: 'Certificat médical', type: 'pdf', taille: '1.5 MB', statut: 'validé' }
    ]
  },
  TXN005: {
    id: 'TXN005',
    expediteur: { 
      nom: 'Thomas Moreau', 
      prenom: 'Thomas',
      telephone: '+33 6 34 56 78 90', 
      email: 'thomas.moreau@email.com',
      adresse: '987 Boulevard Haussmann, Paris, France',
      pays: 'France',
      cni: '4445556667778'
    },
    destinataire: { 
      nom: 'Khadija Ndiaye', 
      prenom: 'Khadija',
      telephone: '+221 78 567 89 01', 
      email: 'khadija.ndiaye@email.com',
      adresse: '147 Avenue Cheikh Anta Diop, Dakar, Sénégal',
      pays: 'Sénégal',
      cni: '3334445556667'
    },
    montant: 1500,
    devise: 'EUR',
    frais: 30,
    montantTotal: 1530,
    statut: 'en_cours',
    dateCreation: '2024-01-11T11:30:00Z',
    dateTraitement: null,
    pays: 'France → Sénégal',
    agence: { nom: 'Agence Dakar Centre', ville: 'Dakar', id: 'AGE001' },
    agent: { nom: 'Amadou Diallo', telephone: '+221 77 987 65 43', email: 'amadou.diallo@ricash.com' },
    codeRetrait: 'RC567890',
    motif: 'Investissement',
    urgence: 'normal',
    historique: [
      { date: '2024-01-11T11:30:00Z', action: 'Transfert créé', statut: 'en_attente' },
      { date: '2024-01-11T11:35:00Z', action: 'Validation expéditeur', statut: 'en_attente' },
      { date: '2024-01-11T11:40:00Z', action: 'Validation destinataire', statut: 'en_attente' },
      { date: '2024-01-11T12:00:00Z', action: 'Traitement en cours', statut: 'en_cours' }
    ],
    documents: [
      { nom: 'CNI Expéditeur', type: 'pdf', taille: '2.2 MB', statut: 'validé' },
      { nom: 'Justificatif revenus', type: 'pdf', taille: '2.0 MB', statut: 'validé' },
      { nom: 'Contrat d\'investissement', type: 'pdf', taille: '3.1 MB', statut: 'validé' },
      { nom: 'Reçu de retrait', type: 'pdf', taille: '0.9 MB', statut: 'en_attente' }
    ]
  },
  TXN006: {
    id: 'TXN006',
    expediteur: { 
      nom: 'Claire Rousseau', 
      prenom: 'Claire',
      telephone: '+33 6 12 34 56 78', 
      email: 'claire.rousseau@email.com',
      adresse: '159 Rue de la Paix, Marseille, France',
      pays: 'France',
      cni: '5556667778889'
    },
    destinataire: { 
      nom: 'Ousmane Ba', 
      prenom: 'Ousmane',
      telephone: '+221 77 678 90 12', 
      email: 'ousmane.ba@email.com',
      adresse: '258 Avenue du Centenaire, Saint-Louis, Sénégal',
      pays: 'Sénégal',
      cni: '4445556667778'
    },
    montant: 750,
    devise: 'EUR',
    frais: 18,
    montantTotal: 768,
    statut: 'traite',
    dateCreation: '2024-01-10T14:20:00Z',
    dateTraitement: '2024-01-10T16:30:00Z',
    pays: 'France → Sénégal',
    agence: { nom: 'Agence Saint-Louis', ville: 'Saint-Louis', id: 'AGE004' },
    agent: { nom: 'Mariama Sarr', telephone: '+221 77 345 67 89', email: 'mariama.sarr@ricash.com' },
    codeRetrait: 'RC678901',
    motif: 'Aide familiale',
    urgence: 'normal',
    historique: [
      { date: '2024-01-10T14:20:00Z', action: 'Transfert créé', statut: 'en_attente' },
      { date: '2024-01-10T14:25:00Z', action: 'Validation expéditeur', statut: 'en_attente' },
      { date: '2024-01-10T14:30:00Z', action: 'Validation destinataire', statut: 'en_attente' },
      { date: '2024-01-10T16:30:00Z', action: 'Transfert traité', statut: 'traite' }
    ],
    documents: [
      { nom: 'CNI Expéditeur', type: 'pdf', taille: '2.0 MB', statut: 'validé' },
      { nom: 'Justificatif revenus', type: 'pdf', taille: '1.8 MB', statut: 'validé' },
      { nom: 'Reçu de retrait', type: 'pdf', taille: '0.7 MB', statut: 'validé' }
    ]
  },
  TXN007: {
    id: 'TXN007',
    expediteur: { 
      nom: 'Antoine Petit', 
      prenom: 'Antoine',
      telephone: '+33 6 22 33 44 55', 
      email: 'antoine.petit@email.com',
      adresse: '321 Rue de la République, Toulouse, France',
      pays: 'France',
      cni: '6667778889990'
    },
    destinataire: { 
      nom: 'Fatou Fall', 
      prenom: 'Fatou',
      telephone: '+221 77 789 01 23', 
      email: 'fatou.fall@email.com',
      adresse: '147 Avenue Cheikh Anta Diop, Kaolack, Sénégal',
      pays: 'Sénégal',
      cni: '7778889990001'
    },
    montant: 400,
    devise: 'EUR',
    frais: 15,
    montantTotal: 415,
    statut: 'en_attente',
    dateCreation: '2024-01-09T08:45:00Z',
    dateTraitement: null,
    pays: 'France → Sénégal',
    agence: { nom: 'Agence Kaolack', ville: 'Kaolack', id: 'AGE005' },
    agent: { nom: 'Saliou Ndiaye', telephone: '+221 77 456 78 90', email: 'saliou.ndiaye@ricash.com' },
    codeRetrait: 'RC789012',
    motif: 'Paiement école',
    urgence: 'normal',
    historique: [
      { date: '2024-01-09T08:45:00Z', action: 'Transfert créé', statut: 'en_attente' },
      { date: '2024-01-09T08:50:00Z', action: 'Validation expéditeur', statut: 'en_attente' },
      { date: '2024-01-09T08:55:00Z', action: 'Validation destinataire', statut: 'en_attente' }
    ],
    documents: [
      { nom: 'CNI Expéditeur', type: 'pdf', taille: '2.1 MB', statut: 'validé' },
      { nom: 'Justificatif revenus', type: 'pdf', taille: '1.6 MB', statut: 'en_attente' },
      { nom: 'Certificat scolaire', type: 'pdf', taille: '1.0 MB', statut: 'en_attente' }
    ]
  },
  TXN008: {
    id: 'TXN008',
    expediteur: { 
      nom: 'Isabelle Blanc', 
      prenom: 'Isabelle',
      telephone: '+33 6 33 44 55 66', 
      email: 'isabelle.blanc@email.com',
      adresse: '654 Boulevard Haussmann, Nice, France',
      pays: 'France',
      cni: '8889990001112'
    },
    destinataire: { 
      nom: 'Cheikh Diop', 
      prenom: 'Cheikh',
      telephone: '+221 77 890 12 34', 
      email: 'cheikh.diop@email.com',
      adresse: '258 Avenue du Centenaire, Dakar, Sénégal',
      pays: 'Sénégal',
      cni: '9990001112223'
    },
    montant: 2000,
    devise: 'EUR',
    frais: 40,
    montantTotal: 2040,
    statut: 'traite',
    dateCreation: '2024-01-08T15:20:00Z',
    dateTraitement: '2024-01-08T17:45:00Z',
    pays: 'France → Sénégal',
    agence: { nom: 'Agence Dakar Centre', ville: 'Dakar', id: 'AGE001' },
    agent: { nom: 'Amadou Diallo', telephone: '+221 77 987 65 43', email: 'amadou.diallo@ricash.com' },
    codeRetrait: 'RC890123',
    motif: 'Achat immobilier',
    urgence: 'urgent',
    historique: [
      { date: '2024-01-08T15:20:00Z', action: 'Transfert créé', statut: 'en_attente' },
      { date: '2024-01-08T15:25:00Z', action: 'Validation expéditeur', statut: 'en_attente' },
      { date: '2024-01-08T15:30:00Z', action: 'Validation destinataire', statut: 'en_attente' },
      { date: '2024-01-08T17:45:00Z', action: 'Transfert traité', statut: 'traite' }
    ],
    documents: [
      { nom: 'CNI Expéditeur', type: 'pdf', taille: '2.3 MB', statut: 'validé' },
      { nom: 'Justificatif revenus', type: 'pdf', taille: '2.5 MB', statut: 'validé' },
      { nom: 'Contrat immobilier', type: 'pdf', taille: '4.2 MB', statut: 'validé' },
      { nom: 'Reçu de retrait', type: 'pdf', taille: '0.8 MB', statut: 'validé' }
    ]
  }
}

const getStatusBadge = (status) => {
  switch (status) {
    case 'traite':
      return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="h-3 w-3" />Traité</Badge>
    case 'en_cours':
      return <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1"><Clock className="h-3 w-3" />En cours</Badge>
    case 'en_attente':
      return <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1"><Clock className="h-3 w-3" />En attente</Badge>
    case 'annule':
      return <Badge className="bg-red-100 text-red-800 flex items-center gap-1"><XCircle className="h-3 w-3" />Annulé</Badge>
    case 'suspendu':
      return <Badge className="bg-orange-100 text-orange-800 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Suspendu</Badge>
    default:
      return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'traite':
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case 'en_cours':
      return <Clock className="h-5 w-5 text-blue-500" />
    case 'en_attente':
      return <Clock className="h-5 w-5 text-yellow-500" />
    case 'annule':
      return <XCircle className="h-5 w-5 text-red-500" />
    case 'suspendu':
      return <AlertTriangle className="h-5 w-5 text-orange-500" />
    default:
      return <Clock className="h-5 w-5 text-gray-500" />
  }
}

const formatCurrency = (amount, currency = 'EUR') => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function TransferDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [comment, setComment] = useState('')
  
  const transfer = mockTransferDetails[id]
  
  if (!transfer) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <RicashButton
            variant="outline"
            onClick={() => navigate('/app/transfers')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux transferts
          </RicashButton>
        </div>
        <div className="text-center py-12">
          <ArrowLeftRight className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Transfert non trouvé</h2>
          <p className="text-gray-600">Le transfert avec l'ID {id} n'existe pas.</p>
        </div>
      </div>
    )
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copié dans le presse-papiers!')
  }

  const handleStatusChange = (newStatus) => {
    // Logique de changement de statut
    toast.success(`Statut changé en: ${newStatus}`)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <RicashButton
            variant="outline"
            onClick={() => navigate('/app/transfers')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux transferts
          </RicashButton>
          <div>
            <h1 className="text-3xl font-bold text-[#29475B]">
              Détails du transfert {transfer.id}
            </h1>
            <p className="text-[#376470]">Code de retrait: {transfer.codeRetrait}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <RicashButton variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </RicashButton>
          <RicashButton variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </RicashButton>
        </div>
      </div>

      {/* Statut et informations principales */}
      <div className="grid gap-6 md:grid-cols-3">
        <RicashCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#29475B]">Statut</h3>
            {getStatusIcon(transfer.statut)}
          </div>
          <div className="space-y-3">
            {getStatusBadge(transfer.statut)}
            <div className="text-sm text-[#376470]">
              <p>Créé le: {formatDate(transfer.dateCreation)}</p>
              {transfer.dateTraitement && (
                <p>Traité le: {formatDate(transfer.dateTraitement)}</p>
              )}
            </div>
          </div>
        </RicashCard>

        <RicashCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#29475B]">Montant</h3>
            <DollarSign className="h-5 w-5 text-[#2B8286]" />
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-[#29475B]">
              {formatCurrency(transfer.montant, transfer.devise)}
            </div>
            <div className="text-sm text-[#376470]">
              Frais: {formatCurrency(transfer.frais, transfer.devise)}
            </div>
            <div className="text-sm font-semibold text-[#2B8286]">
              Total: {formatCurrency(transfer.montantTotal, transfer.devise)}
            </div>
          </div>
        </RicashCard>

        <RicashCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#29475B]">Informations</h3>
            <MapPin className="h-5 w-5 text-[#B19068]" />
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Pays:</span> {transfer.pays}</p>
            <p><span className="font-medium">Urgence:</span> {transfer.urgence}</p>
            <p><span className="font-medium">Agence:</span> {transfer.agence.nom}</p>
            <p><span className="font-medium">Agent:</span> {transfer.agent.nom}</p>
          </div>
        </RicashCard>
      </div>

      {/* Onglets pour les détails */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="expediteur">Expéditeur</TabsTrigger>
          <TabsTrigger value="destinataire">Destinataire</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Informations financières */}
            <RicashCard className="p-6">
              <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Détails financiers
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-[#376470]">Montant à envoyer</span>
                  <span className="font-semibold text-[#29475B]">{formatCurrency(transfer.montant, transfer.devise)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-[#376470]">Frais de transfert</span>
                  <span className="font-semibold text-[#29475B]">{formatCurrency(transfer.frais, transfer.devise)}</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-[#2B8286]/10 rounded-lg px-3">
                  <span className="font-semibold text-[#29475B]">Total à débiter</span>
                  <span className="font-bold text-lg text-[#2B8286]">{formatCurrency(transfer.montantTotal, transfer.devise)}</span>
                </div>
                {transfer.motif && (
                  <div className="pt-2">
                    <p className="text-sm text-[#376470] mb-1">Motif</p>
                    <p className="text-sm text-[#29475B] italic">"{transfer.motif}"</p>
                  </div>
                )}
              </div>
            </RicashCard>

            {/* Documents */}
            <RicashCard className="p-6">
              <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Documents
              </h3>
              <div className="space-y-3">
                {transfer.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-[#29475B]">{doc.nom}</p>
                      <p className="text-sm text-[#376470]">{doc.taille}</p>
                    </div>
                    <Badge className={
                      doc.statut === 'validé' ? 'bg-green-100 text-green-800' :
                      doc.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {doc.statut}
                    </Badge>
                  </div>
                ))}
              </div>
            </RicashCard>
          </div>
        </TabsContent>

        <TabsContent value="expediteur" className="space-y-6">
          <RicashCard className="p-6">
            <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations expéditeur
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <RicashLabel className="text-sm font-medium text-[#376470]">Nom complet</RicashLabel>
                <p className="text-[#29475B] font-medium">{transfer.expediteur.prenom} {transfer.expediteur.nom}</p>
              </div>
              <div>
                <RicashLabel className="text-sm font-medium text-[#376470]">Téléphone</RicashLabel>
                <div className="flex items-center gap-2">
                  <p className="text-[#29475B]">{transfer.expediteur.telephone}</p>
                  <RicashButton
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(transfer.expediteur.telephone)}
                  >
                    <Copy className="h-3 w-3" />
                  </RicashButton>
                </div>
              </div>
              <div>
                <RicashLabel className="text-sm font-medium text-[#376470]">Email</RicashLabel>
                <div className="flex items-center gap-2">
                  <p className="text-[#29475B]">{transfer.expediteur.email}</p>
                  <RicashButton
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(transfer.expediteur.email)}
                  >
                    <Copy className="h-3 w-3" />
                  </RicashButton>
                </div>
              </div>
              <div>
                <RicashLabel className="text-sm font-medium text-[#376470]">Pays</RicashLabel>
                <p className="text-[#29475B]">{transfer.expediteur.pays}</p>
              </div>
              <div className="md:col-span-2">
                <RicashLabel className="text-sm font-medium text-[#376470]">Adresse</RicashLabel>
                <p className="text-[#29475B]">{transfer.expediteur.adresse}</p>
              </div>
              <div>
                <RicashLabel className="text-sm font-medium text-[#376470]">CNI</RicashLabel>
                <div className="flex items-center gap-2">
                  <p className="text-[#29475B]">{transfer.expediteur.cni}</p>
                  <RicashButton
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(transfer.expediteur.cni)}
                  >
                    <Copy className="h-3 w-3" />
                  </RicashButton>
                </div>
              </div>
            </div>
          </RicashCard>
        </TabsContent>

        <TabsContent value="destinataire" className="space-y-6">
          <RicashCard className="p-6">
            <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations destinataire
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <RicashLabel className="text-sm font-medium text-[#376470]">Nom complet</RicashLabel>
                <p className="text-[#29475B] font-medium">{transfer.destinataire.prenom} {transfer.destinataire.nom}</p>
              </div>
              <div>
                <RicashLabel className="text-sm font-medium text-[#376470]">Téléphone</RicashLabel>
                <div className="flex items-center gap-2">
                  <p className="text-[#29475B]">{transfer.destinataire.telephone}</p>
                  <RicashButton
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(transfer.destinataire.telephone)}
                  >
                    <Copy className="h-3 w-3" />
                  </RicashButton>
                </div>
              </div>
              <div>
                <RicashLabel className="text-sm font-medium text-[#376470]">Email</RicashLabel>
                <div className="flex items-center gap-2">
                  <p className="text-[#29475B]">{transfer.destinataire.email}</p>
                  <RicashButton
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(transfer.destinataire.email)}
                  >
                    <Copy className="h-3 w-3" />
                  </RicashButton>
                </div>
              </div>
              <div>
                <RicashLabel className="text-sm font-medium text-[#376470]">Pays</RicashLabel>
                <p className="text-[#29475B]">{transfer.destinataire.pays}</p>
              </div>
              <div className="md:col-span-2">
                <RicashLabel className="text-sm font-medium text-[#376470]">Adresse</RicashLabel>
                <p className="text-[#29475B]">{transfer.destinataire.adresse}</p>
              </div>
              <div>
                <RicashLabel className="text-sm font-medium text-[#376470]">CNI</RicashLabel>
                <div className="flex items-center gap-2">
                  <p className="text-[#29475B]">{transfer.destinataire.cni}</p>
                  <RicashButton
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(transfer.destinataire.cni)}
                  >
                    <Copy className="h-3 w-3" />
                  </RicashButton>
                </div>
              </div>
            </div>
          </RicashCard>
        </TabsContent>

        <TabsContent value="historique" className="space-y-6">
          <RicashCard className="p-6">
            <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Historique des actions
            </h3>
            <div className="space-y-4">
              {transfer.historique.map((action, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[#2B8286] flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#29475B]">{action.action}</p>
                    <p className="text-sm text-[#376470]">{formatDate(action.date)}</p>
                  </div>
                  <Badge className={
                    action.statut === 'traite' ? 'bg-green-100 text-green-800' :
                    action.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {action.statut.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </RicashCard>

          {/* Commentaires */}
          <RicashCard className="p-6">
            <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Commentaires
            </h3>
            <div className="space-y-4">
              <RicashTextarea
                placeholder="Ajouter un commentaire sur ce transfert..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <RicashButton>
                <MessageSquare className="h-4 w-4 mr-2" />
                Ajouter commentaire
              </RicashButton>
            </div>
          </RicashCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}
