// src/pages/TransactionDetails.jsx
import React, { useState, useEffect } from 'react'
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

// Service API
import { transactionService } from '@/services/transactionService'

const getStatusBadge = (statut) => {
  const safeStatut = statut || 'INCONNU';
  switch (safeStatut) {
    case 'COMPLETEE':
      return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="h-3 w-3" />Complétée</Badge>
    case 'EN_COURS':
      return <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1"><Clock className="h-3 w-3" />En cours</Badge>
    case 'EN_ATTENTE':
      return <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1"><Clock className="h-3 w-3" />En attente</Badge>
    case 'ANNULEE':
      return <Badge className="bg-red-100 text-red-800 flex items-center gap-1"><XCircle className="h-3 w-3" />Annulée</Badge>
    case 'REJETEE':
      return <Badge className="bg-red-100 text-red-800 flex items-center gap-1"><XCircle className="h-3 w-3" />Rejetée</Badge>
    default:
      return <Badge className="bg-gray-100 text-gray-800">{safeStatut}</Badge>
  }
}

const getStatusIcon = (statut) => {
  const safeStatut = statut || 'INCONNU';
  switch (safeStatut) {
    case 'COMPLETEE':
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case 'EN_COURS':
      return <Clock className="h-5 w-5 text-blue-500" />
    case 'EN_ATTENTE':
      return <Clock className="h-5 w-5 text-yellow-500" />
    case 'ANNULEE':
    case 'REJETEE':
      return <XCircle className="h-5 w-5 text-red-500" />
    default:
      return <Clock className="h-5 w-5 text-gray-500" />
  }
}

const formatCurrency = (amount, currency = 'XOF') => {
  const safeAmount = amount || 0;
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(safeAmount)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return 'Date invalide';
  }
}

// Fonction pour obtenir les informations de l'expéditeur selon le type de transaction
const getExpediteurInfo = (transaction) => {
  if (!transaction) return { nom: 'N/A', telephone: 'N/A', email: 'N/A' };
  
  switch (transaction.type) {
    case 'CLIENT_TO_CLIENT':
      return {
        nom: transaction.expediteurNom || 'N/A',
        telephone: transaction.expediteurTelephone || 'N/A',
        email: 'N/A'
      };
    
    case 'CLIENT_TO_AGENT':
      return {
        nom: transaction.expediteurNom || 'N/A',
        telephone: transaction.expediteurTelephone || 'N/A',
        email: 'N/A'
      };
    
    case 'AGENT_TO_CLIENT':
      return {
        nom: transaction.agentNom || 'N/A',
        telephone: transaction.agentTelephone || 'N/A',
        email: 'N/A'
      };
    
    case 'AGENT_TO_AGENT':
      return {
        nom: transaction.expediteurAgentNom || 'N/A',
        telephone: transaction.expediteurAgentTelephone || 'N/A',
        email: 'N/A'
      };
    
    default:
      return {
        nom: transaction.expediteurNom || transaction.agentNom || transaction.expediteurAgentNom || 'N/A',
        telephone: transaction.expediteurTelephone || transaction.agentTelephone || transaction.expediteurAgentTelephone || 'N/A',
        email: 'N/A'
      };
  }
};

// Fonction pour obtenir les informations du destinataire selon le type de transaction
const getDestinataireInfo = (transaction) => {
  if (!transaction) return { nom: 'N/A', telephone: 'N/A', email: 'N/A' };
  
  switch (transaction.type) {
    case 'CLIENT_TO_CLIENT':
      return {
        nom: transaction.destinataireNom || 'N/A',
        telephone: transaction.destinataireTelephone || 'N/A',
        email: 'N/A'
      };
    
    case 'CLIENT_TO_AGENT':
      return {
        nom: transaction.agentNom || 'N/A',
        telephone: transaction.agentTelephone || 'N/A',
        email: 'N/A'
      };
    
    case 'AGENT_TO_CLIENT':
      return {
        nom: transaction.destinataireNom || 'N/A',
        telephone: transaction.destinataireTelephone || 'N/A',
        email: 'N/A'
      };
    
    case 'AGENT_TO_AGENT':
      return {
        nom: transaction.destinataireAgentNom || 'N/A',
        telephone: transaction.destinataireAgentTelephone || 'N/A',
        email: 'N/A'
      };
    
    default:
      return {
        nom: transaction.destinataireNom || transaction.destinataireAgentNom || 'N/A',
        telephone: transaction.destinataireTelephone || transaction.destinataireAgentTelephone || 'N/A',
        email: 'N/A'
      };
  }
};

// Fonction pour obtenir le libellé du type de transaction
const getTypeLabel = (type) => {
  const labels = {
    'CLIENT_TO_CLIENT': 'Client → Client',
    'CLIENT_TO_AGENT': 'Client → Agent',
    'AGENT_TO_CLIENT': 'Agent → Client',
    'AGENT_TO_AGENT': 'Agent → Agent'
  };
  return labels[type] || type || 'Transfert';
};

// Fonction pour obtenir le rôle de l'expéditeur
const getExpediteurRole = (type) => {
  switch (type) {
    case 'CLIENT_TO_CLIENT':
    case 'CLIENT_TO_AGENT':
      return 'Client';
    case 'AGENT_TO_CLIENT':
    case 'AGENT_TO_AGENT':
      return 'Agent';
    default:
      return 'Expéditeur';
  }
};

// Fonction pour obtenir le rôle du destinataire
const getDestinataireRole = (type) => {
  switch (type) {
    case 'CLIENT_TO_CLIENT':
    case 'AGENT_TO_CLIENT':
      return 'Client';
    case 'CLIENT_TO_AGENT':
    case 'AGENT_TO_AGENT':
      return 'Agent';
    default:
      return 'Destinataire';
  }
};

export default function TransactionDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [error, setError] = useState(null)
  
  useEffect(() => {
    loadTransactionDetails()
  }, [id])

  const loadTransactionDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔄 Chargement des détails de la transaction:', id)
      const transactionData = await transactionService.getTransactionById(id)
      console.log('✅ Données reçues:', transactionData)
      
      if (!transactionData) {
        setError('Transaction non trouvée')
        toast.error('Transaction non trouvée')
        return
      }
      
      setTransaction(transactionData)
      toast.success('Détails de la transaction chargés avec succès')
    } catch (error) {
      console.error('❌ Erreur lors du chargement des détails:', error)
      setError('Erreur lors du chargement des détails de la transaction')
      toast.error('Erreur lors du chargement des détails de la transaction')
    } finally {
      setLoading(false)
    }
  }

  const handleExecuterTransfert = async () => {
    if (!transaction?.id) {
      toast.error('ID de transaction manquant')
      return;
    }
    
    try {
      const updatedTransaction = await transactionService.executerTransfert(transaction.id)
      setTransaction(updatedTransaction)
      toast.success('Transfert exécuté avec succès')
    } catch (error) {
      console.error('Erreur lors de l\'exécution du transfert:', error)
      toast.error('Erreur lors de l\'exécution du transfert')
    }
  }

  const handleAnnulerTransaction = async () => {
    if (!transaction?.id) {
      toast.error('ID de transaction manquant')
      return;
    }
    
    try {
      const updatedTransaction = await transactionService.annulerTransaction(transaction.id)
      setTransaction(updatedTransaction)
      toast.success('Transaction annulée avec succès')
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la transaction:', error)
      toast.error('Erreur lors de l\'annulation de la transaction')
    }
  }

  const copyToClipboard = (text) => {
    if (!text || text === 'N/A') {
      toast.warning('Aucun texte à copier')
      return;
    }
    navigator.clipboard.writeText(text.toString())
    toast.success('Copié dans le presse-papiers!')
  }

  const handleAddComment = () => {
    if (!comment.trim()) {
      toast.warning('Veuillez saisir un commentaire')
      return;
    }
    // Ici vous pouvez implémenter l'envoi du commentaire à l'API
    toast.success('Commentaire ajouté avec succès')
    setComment('')
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <RicashButton
            variant="outline"
            onClick={() => navigate('/app/transfers')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux transfers
          </RicashButton>
        </div>
        <div className="text-center py-12">
          <RefreshCw className="h-16 w-16 animate-spin text-[#2B8286] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Chargement...</h2>
          <p className="text-gray-600">Chargement des détails de la transaction</p>
        </div>
      </div>
    )
  }

  if (error || !transaction) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <RicashButton
            variant="outline"
            onClick={() => navigate('/app/transfers')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux transfers
          </RicashButton>
        </div>
        <div className="text-center py-12">
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Transaction non trouvée'}
          </h2>
          <p className="text-gray-600 mb-4">
            La transaction avec l'ID {id} n'existe pas ou n'a pas pu être chargée.
          </p>
          <div className="flex gap-3 justify-center">
            <RicashButton onClick={loadTransactionDetails}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </RicashButton>
            <RicashButton variant="outline" onClick={() => navigate('/app/transfers')}>
              Retour à la liste
            </RicashButton>
          </div>
        </div>
      </div>
    )
  }

  const safeStatut = transaction?.statut || 'INCONNU';
  const safeAmount = transaction?.montant || 0;
  const safeFees = transaction?.frais || 0;
  const totalAmount = safeAmount + safeFees;
  const typeLabel = getTypeLabel(transaction?.type);
  
  // Récupérer les informations des parties
  const expediteurInfo = getExpediteurInfo(transaction);
  const destinataireInfo = getDestinataireInfo(transaction);
  const expediteurRole = getExpediteurRole(transaction?.type);
  const destinataireRole = getDestinataireRole(transaction?.type);

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
            Retour aux transfers
          </RicashButton>
          <div>
            <h1 className="text-3xl font-bold text-[#29475B]">
              Détails de la transaction #{transaction.id || 'N/A'}
            </h1>
            <p className="text-[#376470]">Code: {transaction.codeTransaction || 'N/A'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {safeStatut === 'EN_ATTENTE' && (
            <RicashButton 
              onClick={handleExecuterTransfert} 
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Exécuter
            </RicashButton>
          )}
          {(safeStatut === 'EN_ATTENTE' || safeStatut === 'EN_COURS') && (
            <RicashButton 
              variant="outline" 
              onClick={handleAnnulerTransaction}
              className="text-red-600 border-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Annuler
            </RicashButton>
          )}
          <RicashButton variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </RicashButton>
        </div>
      </div>

      {/* Statut et informations principales */}
      <div className="grid gap-6 md:grid-cols-3">
        <RicashCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#29475B]">Statut</h3>
            {getStatusIcon(safeStatut)}
          </div>
          <div className="space-y-3">
            {getStatusBadge(safeStatut)}
            <div className="text-sm text-[#376470] space-y-1">
              <p className="flex justify-between">
                <span>Créé le:</span>
                <span>{formatDate(transaction.dateCreation)}</span>
              </p>
              {transaction.dateExecution && (
                <p className="flex justify-between">
                  <span>Exécuté le:</span>
                  <span>{formatDate(transaction.dateExecution)}</span>
                </p>
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
              {formatCurrency(safeAmount)}
            </div>
            {safeFees > 0 && (
              <div className="text-sm text-[#376470]">
                Frais: {formatCurrency(safeFees)}
              </div>
            )}
            <div className="text-sm font-semibold text-[#2B8286] border-t pt-2 mt-2">
              Total: {formatCurrency(totalAmount)}
            </div>
          </div>
        </RicashCard>

        <RicashCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#29475B]">Informations</h3>
            <MapPin className="h-5 w-5 text-[#B19068]" />
          </div>
          <div className="space-y-2 text-sm">
            <p className="flex justify-between">
              <span className="font-medium text-[#376470]">Code:</span>
              <span className="text-[#29475B]">{transaction.codeTransaction || 'N/A'}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-medium text-[#376470]">Type:</span>
              <span className="text-[#29475B]">{typeLabel}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-medium text-[#376470]">Devise:</span>
              <span className="text-[#29475B]">{transaction.devise || 'XOF'}</span>
            </p>
          </div>
        </RicashCard>
      </div>

      {/* Onglets pour les détails */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="parties">Parties</TabsTrigger>
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
                  <span className="text-[#376470]">Montant principal</span>
                  <span className="font-semibold text-[#29475B]">{formatCurrency(safeAmount)}</span>
                </div>
                {safeFees > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-[#376470]">Frais de transfert</span>
                    <span className="font-semibold text-[#29475B]">{formatCurrency(safeFees)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-3 bg-[#2B8286]/10 rounded-lg px-3">
                  <span className="font-semibold text-[#29475B]">Total</span>
                  <span className="font-bold text-lg text-[#2B8286]">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
                {transaction.motif && (
                  <div className="pt-2">
                    <p className="text-sm text-[#376470] mb-1">Motif</p>
                    <p className="text-sm text-[#29475B] italic">"{transaction.motif}"</p>
                  </div>
                )}
              </div>
            </RicashCard>

            {/* Informations techniques */}
            <RicashCard className="p-6">
              <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Informations techniques
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#376470]">ID Transaction</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-[#29475B]">{transaction.id || 'N/A'}</span>
                    <RicashButton
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(transaction.id)}
                    >
                      <Copy className="h-3 w-3" />
                    </RicashButton>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#376470]">Code Transaction</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-[#29475B]">{transaction.codeTransaction || 'N/A'}</span>
                    {transaction.codeTransaction && transaction.codeTransaction !== 'N/A' && (
                      <RicashButton
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(transaction.codeTransaction)}
                      >
                        <Copy className="h-3 w-3" />
                      </RicashButton>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#376470]">Date création</span>
                  <span className="text-[#29475B]">{formatDate(transaction.dateCreation)}</span>
                </div>
                {transaction.dateExecution && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#376470]">Date exécution</span>
                    <span className="text-[#29475B]">{formatDate(transaction.dateExecution)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-[#376470]">Statut</span>
                  <span className="text-[#29475B] capitalize">{safeStatut.toLowerCase()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#376470]">Type</span>
                  <Badge className={
                    transaction?.type === 'AGENT_TO_AGENT' ? 'bg-purple-100 text-purple-800' :
                    transaction?.type === 'CLIENT_TO_CLIENT' ? 'bg-blue-100 text-blue-800' :
                    transaction?.type === 'CLIENT_TO_AGENT' ? 'bg-green-100 text-green-800' :
                    'bg-orange-100 text-orange-800'
                  }>
                    {transaction?.type || 'N/A'}
                  </Badge>
                </div>
              </div>
            </RicashCard>
          </div>
        </TabsContent>

        <TabsContent value="parties" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Expéditeur */}
            <RicashCard className="p-6">
              <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Expéditeur
                <Badge variant="outline" className="ml-2 text-xs">
                  {expediteurRole}
                </Badge>
              </h3>
              <div className="space-y-4">
                <div>
                  <RicashLabel className="text-sm font-medium text-[#376470]">Nom complet</RicashLabel>
                  <p className="text-[#29475B] font-medium">{expediteurInfo.nom}</p>
                </div>
                {expediteurInfo.telephone !== 'N/A' && (
                  <div className="flex items-center justify-between">
                    <RicashLabel className="text-sm font-medium text-[#376470]">Téléphone</RicashLabel>
                    <div className="flex items-center gap-2">
                      <p className="text-[#29475B]">{expediteurInfo.telephone}</p>
                      <RicashButton
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(expediteurInfo.telephone)}
                      >
                        <Copy className="h-3 w-3" />
                      </RicashButton>
                    </div>
                  </div>
                )}
              </div>
            </RicashCard>

            {/* Destinataire */}
            <RicashCard className="p-6">
              <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Destinataire
                <Badge variant="outline" className="ml-2 text-xs">
                  {destinataireRole}
                </Badge>
              </h3>
              <div className="space-y-4">
                <div>
                  <RicashLabel className="text-sm font-medium text-[#376470]">Nom complet</RicashLabel>
                  <p className="text-[#29475B] font-medium">{destinataireInfo.nom}</p>
                </div>
                {destinataireInfo.telephone !== 'N/A' && (
                  <div className="flex items-center justify-between">
                    <RicashLabel className="text-sm font-medium text-[#376470]">Téléphone</RicashLabel>
                    <div className="flex items-center gap-2">
                      <p className="text-[#29475B]">{destinataireInfo.telephone}</p>
                      <RicashButton
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(destinataireInfo.telephone)}
                      >
                        <Copy className="h-3 w-3" />
                      </RicashButton>
                    </div>
                  </div>
                )}
              </div>
            </RicashCard>
          </div>

          {/* Information sur le type de transaction */}
          <RicashCard className="p-6">
            <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5" />
              Type de Transaction
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#376470]">Schéma de transfert</p>
                <p className="text-[#29475B] font-medium">{typeLabel}</p>
              </div>
              <Badge className={
                transaction?.type === 'AGENT_TO_AGENT' ? 'bg-purple-100 text-purple-800' :
                transaction?.type === 'CLIENT_TO_CLIENT' ? 'bg-blue-100 text-blue-800' :
                transaction?.type === 'CLIENT_TO_AGENT' ? 'bg-green-100 text-green-800' :
                'bg-orange-100 text-orange-800'
              }>
                {transaction?.type || 'N/A'}
              </Badge>
            </div>
          </RicashCard>
        </TabsContent>

        <TabsContent value="historique" className="space-y-6">
          <RicashCard className="p-6">
            <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Historique des statuts
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-[#2B8286] flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">1</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#29475B]">Transaction créée</p>
                  <p className="text-sm text-[#376470]">{formatDate(transaction.dateCreation)}</p>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  Créée
                </Badge>
              </div>

              {safeStatut === 'COMPLETEE' && transaction.dateExecution && (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[#2B8286] flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">2</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#29475B]">Transaction exécutée</p>
                    <p className="text-sm text-[#376470]">{formatDate(transaction.dateExecution)}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Exécutée
                  </Badge>
                </div>
              )}

              {(safeStatut === 'ANNULEE' || safeStatut === 'REJETEE') && (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[#2B8286] flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">2</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#29475B]">
                      Transaction {safeStatut === 'ANNULEE' ? 'annulée' : 'rejetée'}
                    </p>
                    <p className="text-sm text-[#376470]">{formatDate(transaction.dateExecution) || '-'}</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800">
                    {safeStatut === 'ANNULEE' ? 'Annulée' : 'Rejetée'}
                  </Badge>
                </div>
              )}
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
                placeholder="Ajouter un commentaire sur cette transaction..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <RicashButton onClick={handleAddComment} className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Ajouter commentaire
              </RicashButton>
            </div>
          </RicashCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}