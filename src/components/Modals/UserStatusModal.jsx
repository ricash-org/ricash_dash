import React, { useState, useEffect } from 'react'
import { 
  Ban, 
  CheckCircle, 
  AlertTriangle,
  User,
  MessageSquare,
  Calendar,
  Shield,
  Clock,
  Zap,
  XCircle,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { BaseModal } from '@/components/ui/base-modal'
import { RicashButton } from '@/components/ui/ricash-button'
import { RicashCard } from '@/components/ui/ricash-card'
import { RicashInput } from '@/components/ui/ricash-input'
import { RicashStatusBadge } from '@/components/ui/ricash-table'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

const STATUS_OPTIONS = [
  {
    value: 'actif',
    label: 'Activer le compte',
    description: 'Rendre le compte pleinement fonctionnel',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    value: 'suspendu',
    label: 'Suspendre temporairement',
    description: 'Suspendre l\'accès au compte temporairement',
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  },
  {
    value: 'bloque',
    label: 'Bloquer définitivement',
    description: 'Bloquer l\'accès au compte de manière permanente',
    icon: Ban,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  {
    value: 'en_attente',
    label: 'Mettre en attente',
    description: 'Mettre le compte en attente de validation',
    icon: AlertTriangle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  }
]

const REASON_OPTIONS = {
  actif: [
    { value: 'kyc_completed', label: 'Validation KYC terminée' },
    { value: 'investigation_complete', label: 'Enquête terminée' },
    { value: 'user_request', label: 'Demande de l\'utilisateur' },
    { value: 'admin_decision', label: 'Décision administrative' },
    { value: 'other', label: 'Autre raison' }
  ],
  suspendu: [
    { value: 'suspicious_activity', label: 'Activité suspecte détectée' },
    { value: 'kyc_pending', label: 'KYC en attente' },
    { value: 'policy_violation', label: 'Violation des conditions' },
    { value: 'security_check', label: 'Vérification de sécurité' },
    { value: 'other', label: 'Autre raison' }
  ],
  bloque: [
    { value: 'fraud', label: 'Fraude confirmée' },
    { value: 'kyc_failed', label: 'Échec de validation KYC' },
    { value: 'money_laundering', label: 'Blanchiment d\'argent' },
    { value: 'repeated_violations', label: 'Violations répétées' },
    { value: 'legal_action', label: 'Action légale' },
    { value: 'other', label: 'Autre raison' }
  ],
  en_attente: [
    { value: 'kyc_required', label: 'KYC requis' },
    { value: 'document_verification', label: 'Vérification de documents' },
    { value: 'manual_review', label: 'Révision manuelle' },
    { value: 'compliance_check', label: 'Vérification de conformité' },
    { value: 'other', label: 'Autre raison' }
  ]
}

const DURATION_OPTIONS = [
  { value: '1h', label: '1 heure', description: 'Suspension temporaire courte' },
  { value: '24h', label: '24 heures', description: 'Suspension d\'une journée' },
  { value: '7d', label: '7 jours', description: 'Suspension d\'une semaine' },
  { value: '30d', label: '30 jours', description: 'Suspension d\'un mois' },
  { value: '90d', label: '90 jours', description: 'Suspension de 3 mois' },
  { value: 'permanent', label: 'Permanent', description: 'Suspension définitive' }
]

const getStatusBadge = (status) => {
  switch (status) {
    case 'actif':
      return <RicashStatusBadge variant="success">Actif</RicashStatusBadge>
    case 'suspendu':
      return <RicashStatusBadge variant="warning">Suspendu</RicashStatusBadge>
    case 'bloque':
      return <RicashStatusBadge variant="danger">Bloqué</RicashStatusBadge>
    case 'en_attente':
      return <RicashStatusBadge variant="secondary">En attente</RicashStatusBadge>
    default:
      return <RicashStatusBadge variant="outline">{status}</RicashStatusBadge>
  }
}

export default function UserStatusModal({ isOpen, onClose, user, onConfirm }) {
  const [selectedStatus, setSelectedStatus] = useState('')
  const [reason, setReason] = useState('')
  const [duration, setDuration] = useState('')
  const [comments, setComments] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedStatus('')
      setReason('')
      setDuration('')
      setComments('')
      setShowAdvanced(false)
    }
  }, [isOpen])

  if (!user) return null

  const handleSubmit = async () => {
    if (!selectedStatus || !reason) return

    setIsSubmitting(true)
    
    try {
      const actionData = {
        userId: user.id,
        currentStatus: user.statut,
        newStatus: selectedStatus,
        reason,
        duration: (selectedStatus === 'suspendu' || selectedStatus === 'bloque') ? duration : null,
        comments: comments.trim() || null,
        timestamp: new Date().toISOString(),
        adminId: 'ADMIN001', // En production, récupérer depuis le contexte d'auth
        adminName: 'Administrateur'
      }

      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      onConfirm?.(actionData)
      onClose()
    } catch (error) {
      console.error('Erreur lors de la modification du statut:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedStatusOption = STATUS_OPTIONS.find(opt => opt.value === selectedStatus)
  const availableReasons = selectedStatus ? REASON_OPTIONS[selectedStatus] || [] : []
  const showDuration = selectedStatus === 'suspendu' || selectedStatus === 'bloque'

  const isStatusChange = selectedStatus !== user.statut
  const isDangerousAction = selectedStatus === 'bloque' || selectedStatus === 'suspendu'

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-[#2B8286]" />
          <span>Modifier le statut utilisateur</span>
        </div>
      }
      description={`Gestion du statut du compte de ${user.prenom} ${user.nom}`}
      size="xl"
      loading={isSubmitting}
      actions={
        <div className="flex gap-3">
          <RicashButton variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </RicashButton>
          <RicashButton
            onClick={handleSubmit}
            disabled={!selectedStatus || !reason || isSubmitting}
            variant={isDangerousAction ? 'danger' : 'primary'}
            className="min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Traitement...
              </>
            ) : (
              <>
                {selectedStatusOption?.icon && <selectedStatusOption.icon className="h-4 w-4 mr-2" />}
                Confirmer
              </>
            )}
          </RicashButton>
        </div>
      }
    >
      <div className="space-y-6">
        {/* User Information */}
        <RicashCard>
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2B8286] to-[#376470] rounded-xl flex items-center justify-center shadow-lg">
                <User className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-[#29475B] mb-1">
                  {user.prenom} {user.nom}
                </h3>
                <p className="text-[#376470] font-mono text-sm mb-3">ID: {user.id}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#376470]">Statut actuel:</span>
                    {getStatusBadge(user.statut)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#376470]">KYC:</span>
                    <RicashStatusBadge 
                      variant={user.kycStatus === 'valide' ? 'success' : user.kycStatus === 'en_cours' ? 'warning' : 'danger'}
                    >
                      {user.kycStatus === 'valide' ? 'Validé' : user.kycStatus === 'en_cours' ? 'En cours' : 'Rejeté'}
                    </RicashStatusBadge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-[#376470]">Email:</span>
                    <p className="font-medium text-[#29475B]">{user.email}</p>
                  </div>
                  <div>
                    <span className="text-[#376470]">Téléphone:</span>
                    <p className="font-medium text-[#29475B]">{user.telephone}</p>
                  </div>
                  <div>
                    <span className="text-[#376470]">Solde:</span>
                    <p className="font-medium text-[#29475B]">€{user.solde?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div>
                    <span className="text-[#376470]">Transactions:</span>
                    <p className="font-medium text-[#29475B]">{user.transactions || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RicashCard>

        {/* Status Selection */}
        <RicashCard>
          <div className="p-6">
            <h4 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Nouveau statut
            </h4>
            
            <div className="grid gap-3">
              {STATUS_OPTIONS.map((option) => {
                const Icon = option.icon
                const isSelected = selectedStatus === option.value
                const isCurrentStatus = option.value === user.statut
                
                return (
                  <div
                    key={option.value}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? `${option.borderColor} ${option.bgColor} ring-2 ring-offset-2 ring-current` 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    } ${isCurrentStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => !isCurrentStatus && setSelectedStatus(option.value)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-5 w-5 ${isSelected ? option.color : 'text-gray-400'}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${isSelected ? option.color : 'text-[#29475B]'}`}>
                            {option.label}
                          </span>
                          {isCurrentStatus && (
                            <Badge variant="outline" className="text-xs">Statut actuel</Badge>
                          )}
                        </div>
                        <p className="text-sm text-[#376470] mt-1">{option.description}</p>
                      </div>
                      {isSelected && <CheckCircle className="h-5 w-5 text-green-600" />}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </RicashCard>

        {/* Reason Selection */}
        {selectedStatus && (
          <RicashCard>
            <div className="p-6">
              <h4 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Raison du changement
              </h4>
              
              <div className="space-y-3">
                <Label htmlFor="reason" className="text-sm font-medium text-[#29475B]">
                  Sélectionnez une raison *
                </Label>
                <select
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B8286] focus:border-transparent"
                >
                  <option value="">Choisissez une raison...</option>
                  {availableReasons.map((reasonOption) => (
                    <option key={reasonOption.value} value={reasonOption.value}>
                      {reasonOption.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </RicashCard>
        )}

        {/* Duration Selection */}
        {showDuration && (
          <RicashCard>
            <div className="p-6">
              <h4 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Durée de la suspension
              </h4>
              
              <div className="space-y-3">
                <Label htmlFor="duration" className="text-sm font-medium text-[#29475B]">
                  Sélectionnez une durée *
                </Label>
                <select
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B8286] focus:border-transparent"
                >
                  <option value="">Choisissez une durée...</option>
                  {DURATION_OPTIONS.map((durationOption) => (
                    <option key={durationOption.value} value={durationOption.value}>
                      {durationOption.label} - {durationOption.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </RicashCard>
        )}

        {/* Advanced Options */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <RicashButton variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Options avancées
              </span>
              {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </RicashButton>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <RicashCard className="mt-4">
              <div className="p-6">
                <h4 className="text-lg font-semibold text-[#29475B] mb-4">Commentaires additionnels</h4>
                <div className="space-y-3">
                  <Label htmlFor="comments" className="text-sm font-medium text-[#29475B]">
                    Détails supplémentaires (optionnel)
                  </Label>
                  <Textarea
                    id="comments"
                    placeholder="Ajoutez des détails sur cette action..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-[#376470]">
                    Ces commentaires seront visibles dans l'historique des actions et peuvent être utilisés pour le suivi.
                  </p>
                </div>
              </div>
            </RicashCard>
          </CollapsibleContent>
        </Collapsible>

        {/* Warning Messages */}
        {isDangerousAction && (
          <RicashCard className="border-red-200 bg-red-50">
            <div className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">⚠️ Action critique</h4>
                  <p className="text-sm text-red-700 mb-3">
                    Cette action va {selectedStatus === 'bloque' ? 'bloquer définitivement' : 'suspendre temporairement'} le compte de l'utilisateur. 
                    L'utilisateur ne pourra plus accéder à ses fonds ni effectuer de transactions.
                  </p>
                  <div className="text-xs text-red-600">
                    <p>• Cette action sera enregistrée dans l'audit trail</p>
                    <p>• L'utilisateur recevra une notification par email</p>
                    <p>• Une confirmation sera requise pour annuler cette action</p>
                  </div>
                </div>
              </div>
            </div>
          </RicashCard>
        )}

        {/* Status Change Preview */}
        {isStatusChange && selectedStatus && (
          <RicashCard className="border-blue-200 bg-blue-50">
            <div className="p-6">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">Aperçu du changement</h4>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-700">Statut actuel:</span>
                      {getStatusBadge(user.statut)}
                    </div>
                    <div className="text-blue-600">→</div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-700">Nouveau statut:</span>
                      {getStatusBadge(selectedStatus)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RicashCard>
        )}
      </div>
    </BaseModal>
  )
}
