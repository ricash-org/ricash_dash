import React, { useState } from 'react'
import { 
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
  MessageSquare
} from 'lucide-react'
import { BaseModal } from '@/components/ui/base-modal'
import { RicashButton } from '@/components/ui/ricash-button'
import { RicashCard } from '@/components/ui/ricash-card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const getStatusBadge = (status) => {
  switch (status) {
    case 'complete':
      return <Badge variant="default" className="bg-green-100 text-green-800">Complété</Badge>
    case 'en_cours':
      return <Badge variant="default" className="bg-blue-100 text-blue-800">En cours</Badge>
    case 'en_attente':
      return <Badge variant="default" className="bg-yellow-100 text-yellow-800">En attente</Badge>
    case 'annule':
      return <Badge variant="destructive">Annulé</Badge>
    case 'suspect':
      return <Badge variant="destructive" className="bg-orange-100 text-orange-800">Suspect</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'complete':
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case 'en_cours':
      return <Clock className="h-5 w-5 text-blue-500" />
    case 'en_attente':
      return <Clock className="h-5 w-5 text-yellow-500" />
    case 'annule':
      return <XCircle className="h-5 w-5 text-red-500" />
    case 'suspect':
      return <AlertTriangle className="h-5 w-5 text-orange-500" />
    default:
      return <Clock className="h-5 w-5 text-gray-500" />
  }
}

export default function TransferDetailsModal({ isOpen, onClose, transfer, onApprove, onReject }) {
  const [activeTab, setActiveTab] = useState('details')
  const [action, setAction] = useState('')
  const [comments, setComments] = useState('')

  if (!transfer) return null

  const handleAction = () => {
    if (action === 'approve') {
      onApprove?.(transfer.id, comments)
    } else if (action === 'reject') {
      onReject?.(transfer.id, comments)
    }
    onClose()
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  // Timeline simplifiée
  const timeline = [
    {
      id: 1,
      action: 'Transfert initié',
      timestamp: '2024-01-20 14:30:00',
      status: 'completed'
    },
    {
      id: 2,
      action: 'Paiement reçu',
      timestamp: '2024-01-20 14:31:15',
      status: 'completed'
    },
    {
      id: 3,
      action: 'Vérification en cours',
      timestamp: '2024-01-20 14:32:00',
      status: transfer.statut === 'en_attente' ? 'pending' : 'completed'
    },
    {
      id: 4,
      action: 'Fonds disponibles',
      timestamp: transfer.dateCompletion || 'En attente',
      status: transfer.statut === 'complete' ? 'completed' : 'pending'
    }
  ]

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center space-x-3">
          <ArrowLeftRight className="h-5 w-5 text-[#2B8286]" />
          <span>Détails du transfert</span>
        </div>
      }
      description={`Informations complètes sur la transaction ${transfer.id}`}
      size="dashboard-wide"
      actions={
        <div className="flex space-x-2">
          <RicashButton variant="outline" onClick={onClose}>
            Fermer
          </RicashButton>
          {transfer.statut === 'en_attente' && (
            <RicashButton 
              onClick={handleAction}
              disabled={!action}
              variant={action === 'approve' ? 'primary' : action === 'reject' ? 'danger' : 'secondary'}
            >
              {action === 'approve' && <CheckCircle className="h-4 w-4 mr-2" />}
              {action === 'reject' && <XCircle className="h-4 w-4 mr-2" />}
              {action === 'approve' ? 'Approuver' : action === 'reject' ? 'Rejeter' : 'Sélectionner une action'}
            </RicashButton>
          )}
          <RicashButton variant="accent">
            <Download className="h-4 w-4 mr-2" />
            Télécharger reçu
          </RicashButton>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header compact */}
        <RicashCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getStatusIcon(transfer.statut)}
              <div>
                <h3 className="text-lg font-semibold text-[#29475B]">{transfer.id}</h3>
                <p className="text-sm text-[#376470]">{transfer.expediteur.nom} → {transfer.destinataire.nom}</p>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusBadge(transfer.statut)}
                  <Badge variant="outline" className="text-xs">{transfer.pays}</Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-[#2B8286]">€{transfer.montant.toFixed(2)}</div>
              <div className="text-xs text-[#376470]">Frais: €{transfer.frais.toFixed(2)}</div>
            </div>
          </div>
        </RicashCard>

        {/* Action form compact pour les transferts en attente */}
        {transfer.statut === 'en_attente' && (
          <RicashCard className="p-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-[#29475B]">Action requise</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-[#29475B]">Action</Label>
                  <div className="flex space-x-2 mt-2">
                    <RicashButton
                      variant={action === 'approve' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setAction('approve')}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approuver
                    </RicashButton>
                    <RicashButton
                      variant={action === 'reject' ? 'danger' : 'outline'}
                      size="sm"
                      onClick={() => setAction('reject')}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Rejeter
                    </RicashButton>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-[#29475B]">Commentaires</Label>
                  <Textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Ajouter des commentaires..."
                    rows={2}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          </RicashCard>
        )}

        {/* Tabs compactes */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="timeline">Chronologie</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <RicashCard className="p-4">
                <h4 className="font-semibold text-[#29475B] mb-3">Informations transaction</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#376470]">ID Transaction</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-mono">{transfer.id}</span>
                      <RicashButton variant="ghost" size="sm" onClick={() => copyToClipboard(transfer.id)}>
                        <Copy className="h-3 w-3" />
                      </RicashButton>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#376470]">Code de retrait</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-mono">{transfer.codeRetrait}</span>
                      <RicashButton variant="ghost" size="sm" onClick={() => copyToClipboard(transfer.codeRetrait)}>
                        <Copy className="h-3 w-3" />
                      </RicashButton>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#376470]">Montant</span>
                    <span className="text-sm font-semibold text-[#29475B]">€{transfer.montant.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#376470]">Frais</span>
                    <span className="text-sm text-[#29475B]">€{transfer.frais.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#376470]">Date création</span>
                    <span className="text-sm text-[#29475B]">{new Date(transfer.dateCreation).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </RicashCard>

              <RicashCard className="p-4">
                <h4 className="font-semibold text-[#29475B] mb-3">Informations agent</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#376470]">Agent</span>
                    <span className="text-sm text-[#29475B]">{transfer.agent.nom}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#376470]">Agence</span>
                    <span className="text-sm text-[#29475B]">{transfer.agence.nom}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#376470]">Type</span>
                    <span className="text-sm text-[#29475B]">{transfer.type}</span>
                  </div>
                </div>
              </RicashCard>
            </div>
          </TabsContent>

          <TabsContent value="participants" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <RicashCard className="p-4">
                <h4 className="font-semibold text-[#29475B] mb-3 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Expéditeur
                </h4>
                <div className="space-y-2">
                  <div className="text-sm text-[#29475B]">{transfer.expediteur.nom}</div>
                  <div className="text-xs text-[#376470]">ID: {transfer.expediteurId}</div>
                </div>
              </RicashCard>

              <RicashCard className="p-4">
                <h4 className="font-semibold text-[#29475B] mb-3 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Destinataire
                </h4>
                <div className="space-y-2">
                  <div className="text-sm text-[#29475B]">{transfer.destinataire.nom}</div>
                  <div className="text-xs text-[#376470]">ID: {transfer.destinataireId}</div>
                </div>
              </RicashCard>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <RicashCard className="p-4">
              <h4 className="font-semibold text-[#29475B] mb-4">Chronologie des événements</h4>
              <div className="space-y-3">
                {timeline.map((item, index) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      item.status === 'completed' ? 'bg-green-500' : 
                      item.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-300'
                    }`} />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#29475B]">{item.action}</div>
                      <div className="text-xs text-[#376470]">{item.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </RicashCard>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <RicashCard className="p-4">
              <h4 className="font-semibold text-[#29475B] mb-3">Vérifications de sécurité</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#376470]">Contrôle AML</span>
                  <Badge className="bg-green-100 text-green-800">Validé</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#376470]">Vérification KYC</span>
                  <Badge className="bg-green-100 text-green-800">Validé</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#376470]">Score de risque</span>
                  <Badge className="bg-blue-100 text-blue-800">Faible</Badge>
                </div>
              </div>
            </RicashCard>
          </TabsContent>
        </Tabs>
      </div>
    </BaseModal>
  )
}