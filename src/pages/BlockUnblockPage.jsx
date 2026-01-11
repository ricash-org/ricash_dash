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
  AlertCircle,
  Lock,
  Unlock
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
    isBlocked: false,
    historiqueBlocages: [
      { date: '2024-01-18T09:15:00Z', action: 'bloque', raison: 'Suspicion de fraude', agent: 'Agent Sécurité', duree: '24h' },
      { date: '2024-01-19T14:20:00Z', action: 'debloque', raison: 'Vérification effectuée', agent: 'Agent Sécurité' }
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
    isBlocked: true,
    historiqueBlocages: [
      { date: '2024-01-19T10:20:00Z', action: 'bloque', raison: 'Documents KYC manquants', agent: 'Agent KYC002', duree: 'permanent' }
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

const getBlockStatusBadge = (isBlocked) => {
  return isBlocked ? (
    <Badge className="bg-red-100 text-red-800 flex items-center gap-1"><Lock className="h-3 w-3" />Bloqué</Badge>
  ) : (
    <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><Unlock className="h-3 w-3" />Débloqué</Badge>
  )
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

export default function BlockUnblockPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [action, setAction] = useState('')
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

  const handleBlockUnblock = async () => {
    if (!action) {
      toast.error('Veuillez sélectionner une action')
      return
    }

    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const actionText = action === 'bloque' ? 'bloqué' : 'débloqué'
    toast.success(`Utilisateur ${user.prenom} ${user.nom} ${actionText} avec succès`)
    setIsLoading(false)
    setShowConfirmation(false)
    
    // Rediriger vers la page des utilisateurs
    navigate('/app/users')
  }

  const handleConfirmAction = () => {
    if (!action) {
      toast.error('Veuillez sélectionner une action')
      return
    }
    setShowConfirmation(true)
  }

  const actionOptions = user.isBlocked ? [
    { value: 'debloque', label: 'Débloquer', description: 'Rétablir l\'accès au compte', icon: Unlock }
  ] : [
    { value: 'bloque', label: 'Bloquer', description: 'Restreindre l\'accès au compte', icon: Lock }
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
              {user.isBlocked ? 'Déblocage' : 'Blocage'} - {user.prenom} {user.nom}
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
            <h3 className="text-lg font-semibold text-[#29475B]">Statut de Blocage</h3>
            {user.isBlocked ? <Lock className="h-5 w-5 text-red-500" /> : <Unlock className="h-5 w-5 text-green-500" />}
          </div>
          <div className="space-y-3">
            {getBlockStatusBadge(user.isBlocked)}
            <div className="text-sm text-[#376470]">
              <p>Dernière action: {formatDate(user.historiqueBlocages[user.historiqueBlocages.length - 1]?.date)}</p>
              <p>Par: {user.historiqueBlocages[user.historiqueBlocages.length - 1]?.agent}</p>
            </div>
          </div>
        </RicashCard>

        <RicashCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#29475B]">Statut Compte</h3>
            <Shield className="h-5 w-5 text-[#2B8286]" />
          </div>
          <div className="space-y-2">
            {getStatusBadge(user.statut)}
            <div className="text-sm text-[#376470]">
              Type: {user.typeCompte}
            </div>
            <div className="text-sm font-semibold text-[#2B8286]">
              Solde: €{user.solde.toFixed(2)}
            </div>
          </div>
        </RicashCard>

        <RicashCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#29475B]">Activité</h3>
            <FileText className="h-5 w-5 text-[#B19068]" />
          </div>
          <div className="space-y-2">
            <div className="text-sm text-[#376470]">
              <p>Transactions: {user.transactions}</p>
              <p>Dernière connexion: {formatDate(user.dernierLogin)}</p>
            </div>
            <Badge className={
              user.kycStatus === 'valide' ? 'bg-green-100 text-green-800' :
              user.kycStatus === 'en_cours' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }>
              KYC: {user.kycStatus === 'valide' ? 'Validé' : user.kycStatus === 'en_cours' ? 'En cours' : 'Rejeté'}
            </Badge>
          </div>
        </RicashCard>
      </div>

      {/* Formulaire de blocage/déblocage */}
      <RicashCard className="p-6">
        <h3 className="text-lg font-semibold text-[#29475B] mb-6 flex items-center gap-2">
          {user.isBlocked ? <Unlock className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
          {user.isBlocked ? 'Déblocage du compte' : 'Blocage du compte'}
        </h3>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <RicashLabel className="text-sm font-medium text-[#376470] mb-2 block">
                Action à effectuer *
              </RicashLabel>
              <RicashSelect
                value={action}
                onValueChange={setAction}
                options={actionOptions.map(option => ({
                  value: option.value,
                  label: option.label
                }))}
                placeholder="Sélectionner une action"
              />
              {action && (
                <p className="text-sm text-[#376470] mt-2">
                  {actionOptions.find(opt => opt.value === action)?.description}
                </p>
              )}
            </div>

            <div>
              <RicashLabel className="text-sm font-medium text-[#376470] mb-2 block">
                Raison *
              </RicashLabel>
              <RicashTextarea
                placeholder={user.isBlocked ? "Expliquez pourquoi vous débloquez ce compte..." : "Expliquez pourquoi vous bloquez ce compte..."}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            {action === 'bloque' && (
              <div>
                <RicashLabel className="text-sm font-medium text-[#376470] mb-2 block">
                  Durée du blocage
                </RicashLabel>
                <RicashSelect
                  value={duration}
                  onValueChange={setDuration}
                  options={[
                    { value: '1h', label: '1 heure' },
                    { value: '24h', label: '24 heures' },
                    { value: '7d', label: '7 jours' },
                    { value: '30d', label: '30 jours' },
                    { value: 'permanent', label: 'Permanent' }
                  ]}
                  placeholder="Sélectionner une durée"
                />
              </div>
            )}
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

            <div className={`border rounded-lg p-4 ${user.isBlocked ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-start gap-2">
                <AlertCircle className={`h-5 w-5 mt-0.5 ${user.isBlocked ? 'text-green-600' : 'text-red-600'}`} />
                <div>
                  <h4 className={`font-medium ${user.isBlocked ? 'text-green-800' : 'text-red-800'}`}>
                    {user.isBlocked ? 'Déblocage du compte' : 'Blocage du compte'}
                  </h4>
                  <p className={`text-sm mt-1 ${user.isBlocked ? 'text-green-700' : 'text-red-700'}`}>
                    {user.isBlocked 
                      ? 'Cette action rétablira l\'accès complet au compte utilisateur.'
                      : 'Cette action restreindra l\'accès au compte utilisateur et empêchera les transactions.'
                    }
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
            onClick={handleConfirmAction}
            disabled={!action || !reason}
            className={`flex items-center gap-2 ${user.isBlocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {user.isBlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            {user.isBlocked ? 'Débloquer' : 'Bloquer'}
          </RicashButton>
        </div>
      </RicashCard>

      {/* Historique des blocages */}
      <RicashCard className="p-6">
        <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Historique des blocages
        </h3>
        <div className="space-y-4">
          {user.historiqueBlocages.map((entry, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                entry.action === 'bloque' ? 'bg-red-500' : 'bg-green-500'
              }`}>
                {entry.action === 'bloque' ? (
                  <Lock className="h-4 w-4 text-white" />
                ) : (
                  <Unlock className="h-4 w-4 text-white" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-[#29475B]">
                    {entry.action === 'bloque' ? 'Compte bloqué' : 'Compte débloqué'}
                  </p>
                  {entry.duree && (
                    <Badge className="bg-blue-100 text-blue-800">
                      {entry.duree === 'permanent' ? 'Permanent' : entry.duree}
                    </Badge>
                  )}
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
              <AlertTriangle className={`h-6 w-6 ${user.isBlocked ? 'text-green-600' : 'text-red-600'}`} />
              <h3 className="text-lg font-semibold text-[#29475B]">
                Confirmer l'action
              </h3>
            </div>
            <p className="text-[#376470] mb-6">
              Êtes-vous sûr de vouloir <strong>{user.isBlocked ? 'débloquer' : 'bloquer'}</strong> le compte de 
              <strong> {user.prenom} {user.nom}</strong> ?
            </p>
            {reason && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-[#376470] mb-1">Raison:</p>
                <p className="text-sm text-[#29475B]">{reason}</p>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <RicashButton
                variant="outline"
                onClick={() => setShowConfirmation(false)}
              >
                Annuler
              </RicashButton>
              <RicashButton
                onClick={handleBlockUnblock}
                loading={isLoading}
                className={`flex items-center gap-2 ${user.isBlocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {user.isBlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                Confirmer
              </RicashButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
