import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft,
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign,
  Shield,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Copy,
  Download,
  MessageSquare,
  Settings,
  CreditCard,
  Eye,
  RefreshCw,
  Edit,
  Ban,
  UserCheck,
  FileText,
  Bell,
  Globe
} from 'lucide-react'
import { RicashButton } from '@/components/ui/ricash-button'
import { RicashCard } from '@/components/ui/ricash-card'
import { RicashInput } from '@/components/ui/ricash-input'
import { RicashLabel } from '@/components/ui/ricash-label'
import { RicashTextarea } from '@/components/ui/ricash-textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

// Mock data pour les détails d'utilisateur
const mockUserDetails = {
  USR001: {
    id: 'USR001',
    nom: 'Diallo',
    prenom: 'Aminata',
    email: 'aminata.diallo@email.com',
    telephone: '+221 77 123 45 67',
    pays: 'Sénégal',
    ville: 'Dakar',
    adresse: 'Mermoz, Dakar',
    dateNaissance: '1990-05-15',
    statut: 'actif',
    kycStatus: 'valide',
    typeCompte: 'Premium',
    solde: 2500000,
    limiteJournaliere: 500000,
    limiteMensuelle: 10000000,
    dateCreation: '2023-01-15T10:30:00Z',
    dernierLogin: '2024-01-20T14:30:00Z',
    nombreTransactions: 156,
    montantTotalTransactions: 12500000,
    documents: [
      { nom: 'CNI', type: 'pdf', taille: '2.3 MB', statut: 'validé' },
      { nom: 'Passeport', type: 'pdf', taille: '1.8 MB', statut: 'validé' },
      { nom: 'Justificatif domicile', type: 'pdf', taille: '1.2 MB', statut: 'validé' },
      { nom: 'Justificatif revenus', type: 'pdf', taille: '2.1 MB', statut: 'en_attente' }
    ],
    preferences: {
      notifications: true,
      sms: true,
      email: true,
      langue: 'fr'
    },
    historique: [
      { date: '2024-01-20T14:30:00Z', action: 'Connexion réussie', statut: 'succes' },
      { date: '2024-01-20T10:15:00Z', action: 'Transaction envoyée', statut: 'succes' },
      { date: '2024-01-19T16:45:00Z', action: 'Document validé', statut: 'succes' },
      { date: '2024-01-19T09:20:00Z', action: 'Tentative de connexion', statut: 'succes' }
    ],
    transactions: [
      {
        id: 'TXN001',
        date: '2024-01-20T10:15:00Z',
        montant: 150000,
        type: 'envoi',
        statut: 'complété',
        destinataire: 'Moussa Ba'
      },
      {
        id: 'TXN002',
        date: '2024-01-19T14:30:00Z',
        montant: 75000,
        type: 'reception',
        statut: 'complété',
        expediteur: 'Fatou Ndiaye'
      }
    ]
  },
  USR002: {
    id: 'USR002',
    nom: 'Ba',
    prenom: 'Moussa',
    email: 'moussa.ba@email.com',
    telephone: '+221 76 987 65 43',
    pays: 'Sénégal',
    ville: 'Thiès',
    adresse: 'Thiès Centre',
    dateNaissance: '1985-08-22',
    statut: 'suspendu',
    kycStatus: 'en_cours',
    typeCompte: 'Standard',
    solde: 500000,
    limiteJournaliere: 200000,
    limiteMensuelle: 2000000,
    dateCreation: '2023-03-10T08:15:00Z',
    dernierLogin: '2024-01-15T10:20:00Z',
    nombreTransactions: 45,
    montantTotalTransactions: 3200000,
    documents: [
      { nom: 'CNI', type: 'pdf', taille: '2.1 MB', statut: 'en_attente' },
      { nom: 'Justificatif domicile', type: 'pdf', taille: '1.5 MB', statut: 'rejete' }
    ],
    preferences: {
      notifications: false,
      sms: true,
      email: false,
      langue: 'fr'
    },
    historique: [
      { date: '2024-01-15T10:20:00Z', action: 'Compte suspendu', statut: 'warning' },
      { date: '2024-01-15T09:45:00Z', action: 'Document rejeté', statut: 'error' },
      { date: '2024-01-14T16:30:00Z', action: 'Connexion réussie', statut: 'succes' }
    ],
    transactions: [
      {
        id: 'TXN003',
        date: '2024-01-15T09:30:00Z',
        montant: 100000,
        type: 'envoi',
        statut: 'suspendu',
        destinataire: 'Aminata Diallo'
      }
    ]
  }
}

const getStatusBadge = (status) => {
  switch (status) {
    case 'actif':
      return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="h-3 w-3" />Actif</Badge>
    case 'suspendu':
      return <Badge className="bg-red-100 text-red-800 flex items-center gap-1"><Ban className="h-3 w-3" />Suspendu</Badge>
    case 'en_attente':
      return <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1"><Clock className="h-3 w-3" />En attente</Badge>
    case 'valide':
      return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><UserCheck className="h-3 w-3" />Validé</Badge>
    case 'en_cours':
      return <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1"><Clock className="h-3 w-3" />En cours</Badge>
    case 'rejete':
      return <Badge className="bg-red-100 text-red-800 flex items-center gap-1"><XCircle className="h-3 w-3" />Rejeté</Badge>
    default:
      return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'actif':
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case 'suspendu':
      return <Ban className="h-5 w-5 text-red-500" />
    case 'en_attente':
      return <Clock className="h-5 w-5 text-yellow-500" />
    case 'valide':
      return <UserCheck className="h-5 w-5 text-green-500" />
    case 'en_cours':
      return <Clock className="h-5 w-5 text-blue-500" />
    case 'rejete':
      return <XCircle className="h-5 w-5 text-red-500" />
    default:
      return <Clock className="h-5 w-5 text-gray-500" />
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
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

export default function UserDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [comment, setComment] = useState('')
  
  const user = mockUserDetails[id]
  
  if (!user) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <RicashButton
            variant="outline"
            onClick={() => navigate('/app/users')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux utilisateurs
          </RicashButton>
        </div>
        <div className="text-center py-12">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Utilisateur non trouvé</h2>
          <p className="text-gray-600">L'utilisateur avec l'ID {id} n'existe pas.</p>
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
            onClick={() => navigate('/app/users')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux utilisateurs
          </RicashButton>
          <div>
            <h1 className="text-3xl font-bold text-[#29475B]">
              {user.prenom} {user.nom}
            </h1>
            <p className="text-[#376470]">ID: {user.id}</p>
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
          <RicashButton>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </RicashButton>
        </div>
      </div>

      {/* Statut et informations principales */}
      <div className="grid gap-6 md:grid-cols-3">
        <RicashCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#29475B]">Statut</h3>
            {getStatusIcon(user.statut)}
          </div>
          <div className="space-y-3">
            {getStatusBadge(user.statut)}
            <div className="text-sm text-[#376470]">
              <p>Créé le: {formatDate(user.dateCreation)}</p>
              <p>Dernière connexion: {formatDate(user.dernierLogin)}</p>
            </div>
          </div>
        </RicashCard>

        <RicashCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#29475B]">Solde</h3>
            <DollarSign className="h-5 w-5 text-[#2B8286]" />
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-[#29475B]">
              {formatCurrency(user.solde)}
            </div>
            <div className="text-sm text-[#376470]">
              Limite journalière: {formatCurrency(user.limiteJournaliere)}
            </div>
            <div className="text-sm font-semibold text-[#2B8286]">
              Limite mensuelle: {formatCurrency(user.limiteMensuelle)}
            </div>
          </div>
        </RicashCard>

        <RicashCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#29475B]">Informations</h3>
            <Shield className="h-5 w-5 text-[#B19068]" />
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Type de compte:</span> {user.typeCompte}</p>
            <p><span className="font-medium">KYC:</span> {getStatusBadge(user.kycStatus)}</p>
            <p><span className="font-medium">Transactions:</span> {user.nombreTransactions}</p>
            <p><span className="font-medium">Volume total:</span> {formatCurrency(user.montantTotalTransactions)}</p>
          </div>
        </RicashCard>
      </div>

      {/* Onglets pour les détails */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
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
                  <span className="text-[#376470]">Solde actuel</span>
                  <span className="font-semibold text-[#29475B]">{formatCurrency(user.solde)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-[#376470]">Limite journalière</span>
                  <span className="font-semibold text-[#29475B]">{formatCurrency(user.limiteJournaliere)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-[#376470]">Limite mensuelle</span>
                  <span className="font-semibold text-[#29475B]">{formatCurrency(user.limiteMensuelle)}</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-[#2B8286]/10 rounded-lg px-3">
                  <span className="font-semibold text-[#29475B]">Volume total</span>
                  <span className="font-bold text-lg text-[#2B8286]">{formatCurrency(user.montantTotalTransactions)}</span>
                </div>
              </div>
            </RicashCard>

            {/* Documents */}
            <RicashCard className="p-6">
              <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents KYC
              </h3>
              <div className="space-y-3">
                {user.documents.map((doc, index) => (
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

          {/* Dernières transactions */}
          <RicashCard className="p-6">
            <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Dernières transactions
            </h3>
            <div className="space-y-3">
              {user.transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-[#29475B]">
                      {transaction.type === 'envoi' ? 'Envoi vers' : 'Réception de'} {transaction.destinataire || transaction.expediteur}
                    </p>
                    <p className="text-sm text-[#376470]">{formatDate(transaction.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#29475B]">{formatCurrency(transaction.montant)}</p>
                    <Badge className={
                      transaction.statut === 'complété' ? 'bg-green-100 text-green-800' :
                      transaction.statut === 'suspendu' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {transaction.statut}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </RicashCard>
        </TabsContent>

        <TabsContent value="personal" className="space-y-6">
          <RicashCard className="p-6">
            <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations personnelles
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <RicashLabel className="text-sm font-medium text-[#376470]">Nom complet</RicashLabel>
                <p className="text-[#29475B] font-medium">{user.prenom} {user.nom}</p>
              </div>
              <div>
                <RicashLabel className="text-sm font-medium text-[#376470]">Téléphone</RicashLabel>
                <div className="flex items-center gap-2">
                  <p className="text-[#29475B]">{user.telephone}</p>
                  <RicashButton
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(user.telephone)}
                  >
                    <Copy className="h-3 w-3" />
                  </RicashButton>
                </div>
              </div>
              <div>
                <RicashLabel className="text-sm font-medium text-[#376470]">Email</RicashLabel>
                <div className="flex items-center gap-2">
                  <p className="text-[#29475B]">{user.email}</p>
                  <RicashButton
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(user.email)}
                  >
                    <Copy className="h-3 w-3" />
                  </RicashButton>
                </div>
              </div>
              <div>
                <RicashLabel className="text-sm font-medium text-[#376470]">Pays</RicashLabel>
                <p className="text-[#29475B]">{user.pays}</p>
              </div>
              <div>
                <RicashLabel className="text-sm font-medium text-[#376470]">Ville</RicashLabel>
                <p className="text-[#29475B]">{user.ville}</p>
              </div>
              <div>
                <RicashLabel className="text-sm font-medium text-[#376470]">Date de naissance</RicashLabel>
                <p className="text-[#29475B]">{formatDate(user.dateNaissance)}</p>
              </div>
              <div className="md:col-span-2">
                <RicashLabel className="text-sm font-medium text-[#376470]">Adresse</RicashLabel>
                <p className="text-[#29475B]">{user.adresse}</p>
              </div>
            </div>
          </RicashCard>

          {/* Préférences */}
          <RicashCard className="p-6">
            <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Préférences
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-[#376470]" />
                  <span className="text-[#29475B]">Notifications</span>
                </div>
                <Badge className={user.preferences.notifications ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {user.preferences.notifications ? 'Activé' : 'Désactivé'}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#376470]" />
                  <span className="text-[#29475B]">SMS</span>
                </div>
                <Badge className={user.preferences.sms ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {user.preferences.sms ? 'Activé' : 'Désactivé'}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#376470]" />
                  <span className="text-[#29475B]">Email</span>
                </div>
                <Badge className={user.preferences.email ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {user.preferences.email ? 'Activé' : 'Désactivé'}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-[#376470]" />
                  <span className="text-[#29475B]">Langue</span>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  {user.preferences.langue.toUpperCase()}
                </Badge>
              </div>
            </div>
          </RicashCard>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <RicashCard className="p-6">
            <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Documents KYC
            </h3>
            <div className="space-y-4">
              {user.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-[#376470]" />
                    <div>
                      <p className="font-medium text-[#29475B]">{doc.nom}</p>
                      <p className="text-sm text-[#376470]">{doc.taille}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={
                      doc.statut === 'validé' ? 'bg-green-100 text-green-800' :
                      doc.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {doc.statut}
                    </Badge>
                    <RicashButton variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </RicashButton>
                  </div>
                </div>
              ))}
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
              {user.historique.map((action, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[#2B8286] flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#29475B]">{action.action}</p>
                    <p className="text-sm text-[#376470]">{formatDate(action.date)}</p>
                  </div>
                  <Badge className={
                    action.statut === 'succes' ? 'bg-green-100 text-green-800' :
                    action.statut === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    action.statut === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {action.statut}
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
                placeholder="Ajouter un commentaire sur cet utilisateur..."
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