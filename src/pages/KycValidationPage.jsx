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
  Send
} from 'lucide-react'
import { RicashButton } from '@/components/ui/ricash-button'
import { RicashCard } from '@/components/ui/ricash-card'
import { RicashInput } from '@/components/ui/ricash-input'
import { RicashLabel } from '@/components/ui/ricash-label'
import { RicashTextarea } from '@/components/ui/ricash-textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

// Mock data pour la validation KYC
const mockKycData = {
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
    dateCreation: '2023-01-15T10:30:00Z',
    dernierLogin: '2024-01-20T14:30:00Z',
    documents: [
      { nom: 'CNI', type: 'pdf', taille: '2.3 MB', statut: 'validé', uploadedAt: '2023-01-15T10:30:00Z', validatedAt: '2023-01-16T14:20:00Z', validatedBy: 'Agent KYC001' },
      { nom: 'Passeport', type: 'pdf', taille: '1.8 MB', statut: 'validé', uploadedAt: '2023-01-15T11:00:00Z', validatedAt: '2023-01-16T15:30:00Z', validatedBy: 'Agent KYC001' },
      { nom: 'Justificatif domicile', type: 'pdf', taille: '1.2 MB', statut: 'validé', uploadedAt: '2023-01-15T12:00:00Z', validatedAt: '2023-01-16T16:00:00Z', validatedBy: 'Agent KYC001' },
      { nom: 'Justificatif revenus', type: 'pdf', taille: '2.1 MB', statut: 'en_attente', uploadedAt: '2023-01-20T09:00:00Z', validatedAt: null, validatedBy: null }
    ],
    historique: [
      { date: '2023-01-16T16:00:00Z', action: 'Validation justificatif domicile', statut: 'succes', agent: 'Agent KYC001' },
      { date: '2023-01-16T15:30:00Z', action: 'Validation passeport', statut: 'succes', agent: 'Agent KYC001' },
      { date: '2023-01-16T14:20:00Z', action: 'Validation CNI', statut: 'succes', agent: 'Agent KYC001' }
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
    dateCreation: '2023-03-10T08:15:00Z',
    dernierLogin: '2024-01-15T10:20:00Z',
    documents: [
      { nom: 'CNI', type: 'pdf', taille: '2.1 MB', statut: 'en_attente', uploadedAt: '2024-01-15T10:30:00Z', validatedAt: null, validatedBy: null },
      { nom: 'Passeport', type: 'pdf', taille: '0 MB', statut: 'non_soumis', uploadedAt: null, validatedAt: null, validatedBy: null },
      { nom: 'Justificatif domicile', type: 'pdf', taille: '1.5 MB', statut: 'rejete', uploadedAt: '2024-01-10T14:00:00Z', validatedAt: '2024-01-12T10:30:00Z', validatedBy: 'Agent KYC002', rejectionReason: 'Document illisible, veuillez fournir une meilleure qualité' },
      { nom: 'Justificatif revenus', type: 'pdf', taille: '0 MB', statut: 'non_soumis', uploadedAt: null, validatedAt: null, validatedBy: null }
    ],
    historique: [
      { date: '2024-01-12T10:30:00Z', action: 'Rejet justificatif domicile', statut: 'error', agent: 'Agent KYC002', reason: 'Document illisible, veuillez fournir une meilleure qualité' }
    ]
  }
}

const getStatusBadge = (status) => {
  switch (status) {
    case 'validé':
      return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="h-3 w-3" />Validé</Badge>
    case 'en_attente':
      return <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1"><Clock className="h-3 w-3" />En attente</Badge>
    case 'rejete':
      return <Badge className="bg-red-100 text-red-800 flex items-center gap-1"><XCircle className="h-3 w-3" />Rejeté</Badge>
    case 'non_soumis':
      return <Badge className="bg-gray-100 text-gray-800 flex items-center gap-1"><XCircle className="h-3 w-3" />Non soumis</Badge>
    case 'valide':
      return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><UserCheck className="h-3 w-3" />Validé</Badge>
    case 'en_cours':
      return <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1"><Clock className="h-3 w-3" />En cours</Badge>
    default:
      return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'validé':
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case 'en_attente':
      return <Clock className="h-5 w-5 text-yellow-500" />
    case 'rejete':
      return <XCircle className="h-5 w-5 text-red-500" />
    case 'non_soumis':
      return <XCircle className="h-5 w-5 text-gray-400" />
    case 'valide':
      return <UserCheck className="h-5 w-5 text-green-500" />
    case 'en_cours':
      return <Clock className="h-5 w-5 text-blue-500" />
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

export default function KycValidationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [comment, setComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const kycData = mockKycData[id]
  
  if (!kycData) {
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

  const handleValidateDocument = async (documentType) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    toast.success(`Document ${documentType} validé avec succès!`)
    setIsLoading(false)
  }

  const handleRejectDocument = async (documentType) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    toast.success(`Document ${documentType} rejeté!`)
    setIsLoading(false)
  }

  const handleDownloadDocument = (documentType) => {
    toast.success(`Téléchargement du document ${documentType} en cours...`)
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
                Validation KYC - {kycData.prenom} {kycData.nom}
              </h1>
              <p className="text-[#376470]">ID: {kycData.id}</p>
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
            <h3 className="text-lg font-semibold text-[#29475B]">Statut KYC</h3>
            <div className="text-sm text-[#376470]">
              <p>Créé le: {formatDate(kycData.dateCreation)}</p>
              <p>Dernière connexion: {formatDate(kycData.dernierLogin)}</p>
            </div>
          </div>
        </RicashCard>

        <RicashCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#29475B]">Statut Compte</h3>
            <Shield className="h-5 w-5 text-[#2B8286]" />
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-[#29475B]">
              {kycData.typeCompte}
            </div>
            <div className="text-sm text-[#376470]">
              Statut: {kycData.statut}
            </div>
            <div className="text-sm font-semibold text-[#2B8286]">
              Pays: {kycData.pays}
            </div>
          </div>
        </RicashCard>

        <RicashCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#29475B]">Documents</h3>
            <FileText className="h-5 w-5 text-[#B19068]" />
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Total:</span> {kycData.documents.length}</p>
            <p><span className="font-medium">Validés:</span> {kycData.documents.filter(d => d.statut === 'validé').length}</p>
            <p><span className="font-medium">En attente:</span> {kycData.documents.filter(d => d.statut === 'en_attente').length}</p>
            <p><span className="font-medium">Rejetés:</span> {kycData.documents.filter(d => d.statut === 'rejete').length}</p>
          </div>
        </RicashCard>
      </div>

      {/* Onglets pour les détails */}
      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {kycData.documents.map((doc, index) => (
              <RicashCard key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#29475B] flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {doc.nom}
                </h3>
                <div className="flex items-center gap-2">
                    {getStatusIcon(doc.statut)}
                    {getStatusBadge(doc.statut)}
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-[#376470]">Taille</span>
                    <span className="font-semibold text-[#29475B]">{doc.taille}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-[#376470]">Uploadé le</span>
                    <span className="font-semibold text-[#29475B]">{formatDate(doc.uploadedAt)}</span>
                </div>
                {doc.validatedAt && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-[#376470]">Validé le</span>
                      <span className="font-semibold text-[#29475B]">{formatDate(doc.validatedAt)}</span>
                  </div>
                )}
                {doc.validatedBy && (
                    <div className="flex justify-between items-center py-3 bg-[#2B8286]/10 rounded-lg px-3">
                      <span className="font-semibold text-[#29475B]">Validé par</span>
                      <span className="font-bold text-lg text-[#2B8286]">{doc.validatedBy}</span>
                  </div>
                )}
                {doc.rejectionReason && (
                    <div className="pt-2">
                      <p className="text-sm text-[#376470] mb-1">Raison du rejet</p>
                      <p className="text-sm text-red-600 italic">"{doc.rejectionReason}"</p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                  {doc.uploadedAt && (
                  <RicashButton
                    variant="outline"
                    size="sm"
                      onClick={() => handleDownloadDocument(doc.nom)}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Télécharger
                  </RicashButton>
                )}
                
                  {doc.statut === 'en_attente' && (
                  <>
                    <RicashButton
                      variant="success"
                      size="sm"
                        onClick={() => handleValidateDocument(doc.nom)}
                        disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Valider
                    </RicashButton>
                    <RicashButton
                      variant="danger"
                      size="sm"
                        onClick={() => handleRejectDocument(doc.nom)}
                        disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Rejeter
                    </RicashButton>
                  </>
                )}
              </div>
            </RicashCard>
          ))}
        </div>
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
                <p className="text-[#29475B] font-medium">{kycData.prenom} {kycData.nom}</p>
              </div>
              <div>
                <RicashLabel className="text-sm font-medium text-[#376470]">Téléphone</RicashLabel>
                <div className="flex items-center gap-2">
                  <p className="text-[#29475B]">{kycData.telephone}</p>
                  <RicashButton
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(kycData.telephone)}
                  >
                    <Copy className="h-3 w-3" />
                  </RicashButton>
                </div>
              </div>
              <div>
                <RicashLabel className="text-sm font-medium text-[#376470]">Email</RicashLabel>
                <div className="flex items-center gap-2">
                  <p className="text-[#29475B]">{kycData.email}</p>
                  <RicashButton
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(kycData.email)}
                  >
                    <Copy className="h-3 w-3" />
                  </RicashButton>
                </div>
              </div>
              <div>
                <RicashLabel className="text-sm font-medium text-[#376470]">Pays</RicashLabel>
                <p className="text-[#29475B]">{kycData.pays}</p>
              </div>
              <div>
                <RicashLabel className="text-sm font-medium text-[#376470]">Ville</RicashLabel>
                <p className="text-[#29475B]">{kycData.ville}</p>
              </div>
                  <div>
                <RicashLabel className="text-sm font-medium text-[#376470]">Date de naissance</RicashLabel>
                <p className="text-[#29475B]">{formatDate(kycData.dateNaissance)}</p>
              </div>
              <div className="md:col-span-2">
                <RicashLabel className="text-sm font-medium text-[#376470]">Adresse</RicashLabel>
                <p className="text-[#29475B]">{kycData.adresse}</p>
              </div>
            </div>
          </RicashCard>
        </TabsContent>

        <TabsContent value="historique" className="space-y-6">
          <RicashCard className="p-6">
            <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Historique des validations
            </h3>
            <div className="space-y-4">
              {kycData.historique.map((action, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[#2B8286] flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#29475B]">{action.action}</p>
                    <p className="text-sm text-[#376470]">{formatDate(action.date)} - {action.agent}</p>
                    {action.reason && (
                      <p className="text-sm text-red-600 mt-1">{action.reason}</p>
                    )}
                  </div>
                  <Badge className={
                    action.statut === 'succes' ? 'bg-green-100 text-green-800' :
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
              Commentaires KYC
            </h3>
            <div className="space-y-4">
              <RicashTextarea
                placeholder="Ajouter un commentaire sur la validation KYC..."
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