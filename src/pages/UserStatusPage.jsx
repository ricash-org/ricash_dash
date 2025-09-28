import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft,
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Copy,
  Download,
  MessageSquare,
  FileText,
  Eye,
  RefreshCw,
  Edit,
  Ban,
  UserCheck,
  Upload,
  Send,
  Save,
  AlertCircle
} from 'lucide-react'
import { RicashButton } from '@/components/ui/ricash-button'
import { RicashCard } from '@/components/ui/ricash-card'
import { RicashInput } from '@/components/ui/ricash-input'
import { RicashLabel } from '@/components/ui/ricash-label'
import { RicashTextarea } from '@/components/ui/ricash-textarea'
import { RicashSelect } from '@/components/ui/ricash-input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

// Mock data pour les utilisateurs
const mockUsers = {
  USR001: {
    id: 'USR001',
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@email.com',
    telephone: '+33 6 12 34 56 78',
    pays: 'France',
    ville: 'Paris',
    adresse: '123 Rue de la Paix, Paris',
    dateNaissance: '1990-05-15',
    statut: 'actif',
    kycStatus: 'valide',
    typeCompte: 'Premium',
    dateCreation: '2024-01-15T10:30:00Z',
    dernierLogin: '2024-01-20T14:30:00Z',
    solde: 1250.50,
    transactions: 15,
    historiqueStatuts: [
      { date: '2024-01-15T10:30:00Z', statut: 'actif', raison: 'Création du compte', agent: 'Système' },
      { date: '2024-01-18T09:15:00Z', statut: 'suspendu', raison: 'Vérification KYC', agent: 'Agent KYC001' },
      { date: '2024-01-19T14:20:00Z', statut: 'actif', raison: 'KYC validé', agent: 'Agent KYC001' }
    ]
  },
  USR002: {
    id: 'USR002',
    nom: 'Martin',
    prenom: 'Marie',
    email: 'marie.martin@email.com',
    telephone: '+33 6 98 76 54 32',
    pays: 'France',
    ville: 'Lyon',
    adresse: '456 Avenue des Champs, Lyon',
    dateNaissance: '1985-08-22',
    statut: 'suspendu',
    kycStatus: 'en_cours',
    typeCompte: 'Standard',
    dateCreation: '2024-01-18T08:15:00Z',
    dernierLogin: '2024-01-19T10:20:00Z',
    solde: 750.00,
    transactions: 8,
    historiqueStatuts: [
      { date: '2024-01-18T08:15:00Z', statut: 'en_attente', raison: 'Création du compte', agent: 'Système' },
      { date: '2024-01-19T10:20:00Z', statut: 'suspendu', raison: 'Documents KYC manquants', agent: 'Agent KYC002' }
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
    case 'bloque':
      return <Badge className="bg-gray-100 text-gray-800 flex items-center gap-1"><XCircle className="h-3 w-3" />Bloqué</Badge>
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
    case 'bloque':
      return <XCircle className="h-5 w-5 text-gray-500" />
    default:
      return <Clock className="h-5 w-5 text-gray-500" />
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Non défini'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function UserStatusPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [reason, setReason] = useState('')
  const [duration, setDuration] = useState('')
  const [comment, setComment] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  
  const user = mockUsers[id]
  
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

  const handleStatusChange = async () => {
    if (!newStatus) {
      toast.error('Veuillez sélectionner un nouveau statut')
      return
    }

    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.success(`Statut de ${user.prenom} ${user.nom} changé de ${user.statut} vers ${newStatus}`)
    setIsLoading(false)
    setShowConfirmation(false)
    
    // Rediriger vers la page des utilisateurs
    navigate('/app/users')
  }

  const handleConfirmChange = () => {
    if (!newStatus) {
      toast.error('Veuillez sélectionner un nouveau statut')
      return
    }
    setShowConfirmation(true)
  }

  const statusOptions = [
    { value: 'actif', label: 'Actif', description: 'Compte fonctionnel et accessible' },
    { value: 'suspendu', label: 'Suspendu', description: 'Compte temporairement désactivé' },
    { value: 'en_attente', label: 'En attente', description: 'En attente de validation' },
    { value: 'bloque', label: 'Bloqué', description: 'Compte définitivement bloqué' }
  ]

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
              Modification du statut - {user.prenom} {user.nom}
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
        </div>
      </div>

      {/* Statut actuel et informations principales */}
      <div className="grid gap-6 md:grid-cols-3">
        <RicashCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#29475B]">Statut Actuel</h3>
            {getStatusIcon(user.statut)}
          </div>
          <div className="space-y-3">
            {getStatusBadge(user.statut)}
            <div className="text-sm text-[#376470]">
              <p>Dernière modification: {formatDate(user.historiqueStatuts[user.historiqueStatuts.length - 1]?.date)}</p>
              <p>Par: {user.historiqueStatuts[user.historiqueStatuts.length - 1]?.agent}</p>
            </div>
          </div>
        </RicashCard>

        <RicashCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#29475B]">Informations Compte</h3>
            <Shield className="h-5 w-5 text-[#2B8286]" />
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-[#29475B]">
              {user.typeCompte}
            </div>
            <div className="text-sm text-[#376470]">
              Solde: €{user.solde.toFixed(2)}
            </div>
            <div className="text-sm font-semibold text-[#2B8286]">
              Transactions: {user.transactions}
            </div>
          </div>
        </RicashCard>

        <RicashCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#29475B]">KYC</h3>
            <FileText className="h-5 w-5 text-[#B19068]" />
          </div>
          <div className="space-y-2">
            <Badge className={
              user.kycStatus === 'valide' ? 'bg-green-100 text-green-800' :
              user.kycStatus === 'en_cours' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }>
              {user.kycStatus === 'valide' ? 'Validé' : user.kycStatus === 'en_cours' ? 'En cours' : 'Rejeté'}
            </Badge>
            <div className="text-sm text-[#376470]">
              <p>Créé le: {formatDate(user.dateCreation)}</p>
              <p>Dernière connexion: {formatDate(user.dernierLogin)}</p>
            </div>
          </div>
        </RicashCard>
      </div>

      {/* Formulaire de modification du statut */}
      <RicashCard className="p-6">
        <h3 className="text-lg font-semibold text-[#29475B] mb-6 flex items-center gap-2">
          <Edit className="h-5 w-5" />
          Modification du statut
        </h3>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <RicashLabel className="text-sm font-medium text-[#376470] mb-2 block">
                Nouveau statut *
              </RicashLabel>
              <RicashSelect
                value={newStatus}
                onValueChange={setNewStatus}
                options={statusOptions.map(option => ({
                  value: option.value,
                  label: option.label
                }))}
                placeholder="Sélectionner un statut"
              />
              {newStatus && (
                <p className="text-sm text-[#376470] mt-2">
                  {statusOptions.find(opt => opt.value === newStatus)?.description}
                </p>
              )}
            </div>

            <div>
              <RicashLabel className="text-sm font-medium text-[#376470] mb-2 block">
                Raison du changement *
              </RicashLabel>
              <RicashTextarea
                placeholder="Expliquez la raison du changement de statut..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            <div>
              <RicashLabel className="text-sm font-medium text-[#376470] mb-2 block">
                Durée (si applicable)
              </RicashLabel>
              <RicashSelect
                value={duration}
                onValueChange={setDuration}
                options={[
                  { value: '', label: 'Permanent' },
                  { value: '1h', label: '1 heure' },
                  { value: '24h', label: '24 heures' },
                  { value: '7d', label: '7 jours' },
                  { value: '30d', label: '30 jours' }
                ]}
                placeholder="Sélectionner une durée"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <RicashLabel className="text-sm font-medium text-[#376470] mb-2 block">
                Commentaires additionnels
              </RicashLabel>
              <RicashTextarea
                placeholder="Ajoutez des commentaires ou instructions supplémentaires..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Attention</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Cette action modifiera le statut du compte utilisateur et pourra affecter son accès aux services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <RicashButton
            variant="outline"
            onClick={() => navigate('/app/users')}
          >
            Annuler
          </RicashButton>
          <RicashButton
            onClick={handleConfirmChange}
            disabled={!newStatus || !reason}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Modifier le statut
          </RicashButton>
        </div>
      </RicashCard>

      {/* Historique des statuts */}
      <RicashCard className="p-6">
        <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Historique des statuts
        </h3>
        <div className="space-y-4">
          {user.historiqueStatuts.map((entry, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-[#2B8286] flex items-center justify-center">
                <span className="text-white text-sm font-semibold">{index + 1}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-[#29475B]">{entry.statut}</p>
                  {getStatusBadge(entry.statut)}
                </div>
                <p className="text-sm text-[#376470]">{formatDate(entry.date)} - {entry.agent}</p>
                <p className="text-sm text-[#29475B] mt-1">{entry.raison}</p>
              </div>
            </div>
          ))}
        </div>
      </RicashCard>

      {/* Modal de confirmation */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
              <h3 className="text-lg font-semibold text-[#29475B]">Confirmer le changement</h3>
            </div>
            <p className="text-[#376470] mb-6">
              Êtes-vous sûr de vouloir changer le statut de <strong>{user.prenom} {user.nom}</strong> 
              de <strong>{user.statut}</strong> vers <strong>{newStatus}</strong> ?
            </p>
            <div className="flex justify-end gap-3">
              <RicashButton
                variant="outline"
                onClick={() => setShowConfirmation(false)}
              >
                Annuler
              </RicashButton>
              <RicashButton
                onClick={handleStatusChange}
                loading={isLoading}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Confirmer
              </RicashButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
