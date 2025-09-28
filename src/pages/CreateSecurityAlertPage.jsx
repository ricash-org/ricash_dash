import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft,
  Shield, 
  AlertTriangle, 
  Lock, 
  Eye, 
  Clock,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  TrendingUp,
  Activity,
  Key,
  UserCheck,
  Ban,
  Search,
  Filter,
  Download,
  RefreshCw,
  Plus,
  Save,
  Send,
  Bell,
  AlertCircle,
  Zap,
  Target,
  Globe,
  Building2,
  DollarSign,
  Calendar,
  MessageSquare,
  Settings
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

// Mock data pour les alertes de sécurité
const mockSecurityAlerts = [
  {
    id: 'ALERT001',
    type: 'fraud',
    severity: 'high',
    title: 'Tentative de fraude détectée',
    description: 'Transaction suspecte de 5000€ vers un compte non vérifié',
    status: 'active',
    createdAt: '2024-01-20T10:30:00Z',
    assignedTo: 'Agent Sécurité 001',
    priority: 'urgent',
    category: 'Transaction suspecte'
  },
  {
    id: 'ALERT002',
    type: 'kyc',
    severity: 'medium',
    title: 'Document KYC expiré',
    description: 'Plusieurs utilisateurs avec des documents d\'identité expirés',
    status: 'pending',
    createdAt: '2024-01-19T14:20:00Z',
    assignedTo: 'Agent KYC 002',
    priority: 'normal',
    category: 'Validation KYC'
  },
  {
    id: 'ALERT003',
    type: 'system',
    severity: 'low',
    title: 'Maintenance programmée',
    description: 'Mise à jour du système prévue pour demain à 2h00',
    status: 'resolved',
    createdAt: '2024-01-18T09:15:00Z',
    assignedTo: 'Équipe Technique',
    priority: 'low',
    category: 'Maintenance'
  }
]

const alertTypes = [
  { value: 'fraud', label: 'Fraude', description: 'Activité frauduleuse détectée', icon: Shield },
  { value: 'kyc', label: 'KYC', description: 'Problème de validation d\'identité', icon: UserCheck },
  { value: 'system', label: 'Système', description: 'Problème technique ou maintenance', icon: Settings },
  { value: 'transaction', label: 'Transaction', description: 'Transaction suspecte ou bloquée', icon: DollarSign },
  { value: 'security', label: 'Sécurité', description: 'Violation de sécurité', icon: Lock },
  { value: 'compliance', label: 'Conformité', description: 'Problème de conformité réglementaire', icon: FileText }
]

const severityLevels = [
  { value: 'low', label: 'Faible', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  { value: 'medium', label: 'Moyen', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
  { value: 'high', label: 'Élevé', color: 'bg-orange-100 text-orange-800', icon: AlertCircle },
  { value: 'critical', label: 'Critique', color: 'bg-red-100 text-red-800', icon: XCircle }
]

const priorityLevels = [
  { value: 'low', label: 'Faible', color: 'bg-gray-100 text-gray-800' },
  { value: 'normal', label: 'Normal', color: 'bg-blue-100 text-blue-800' },
  { value: 'high', label: 'Élevé', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
]

const getStatusBadge = (status) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-red-100 text-red-800 flex items-center gap-1"><AlertCircle className="h-3 w-3" />Actif</Badge>
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1"><Clock className="h-3 w-3" />En attente</Badge>
    case 'resolved':
      return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="h-3 w-3" />Résolu</Badge>
    case 'closed':
      return <Badge className="bg-gray-100 text-gray-800 flex items-center gap-1"><XCircle className="h-3 w-3" />Fermé</Badge>
    default:
      return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
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

export default function CreateSecurityAlertPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  
  // États du formulaire
  const [formData, setFormData] = useState({
    type: '',
    severity: '',
    priority: '',
    title: '',
    description: '',
    category: '',
    assignedTo: '',
    dueDate: '',
    tags: '',
    notes: ''
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!formData.type || !formData.title || !formData.description) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    toast.success('Alerte de sécurité créée avec succès!')
    setIsLoading(false)
    
    // Rediriger vers la page de sécurité
    navigate('/app/security')
  }

  const handleSaveDraft = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Brouillon sauvegardé!')
    setIsLoading(false)
  }

  const selectedType = alertTypes.find(type => type.value === formData.type)
  const selectedSeverity = severityLevels.find(level => level.value === formData.severity)
  const selectedPriority = priorityLevels.find(level => level.value === formData.priority)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <RicashButton
            variant="outline"
            onClick={() => navigate('/app/security')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la sécurité
          </RicashButton>
          <div>
            <h1 className="text-3xl font-bold text-[#29475B]">
              Créer une Alerte de Sécurité
            </h1>
            <p className="text-[#376470]">Créez et configurez une nouvelle alerte de sécurité</p>
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

      {/* Aperçu de l'alerte */}
      {(formData.type || formData.title) && (
        <RicashCard className="p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Aperçu de l'alerte
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-[#376470] mb-1">Type</p>
              <div className="flex items-center gap-2">
                {selectedType && <selectedType.icon className="h-4 w-4 text-[#2B8286]" />}
                <span className="font-medium text-[#29475B]">
                  {selectedType?.label || 'Non sélectionné'}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-[#376470] mb-1">Sévérité</p>
              {selectedSeverity && (
                <Badge className={`${selectedSeverity.color} flex items-center gap-1 w-fit`}>
                  <selectedSeverity.icon className="h-3 w-3" />
                  {selectedSeverity.label}
                </Badge>
              )}
            </div>
            <div>
              <p className="text-sm text-[#376470] mb-1">Priorité</p>
              {selectedPriority && (
                <Badge className={`${selectedPriority.color} w-fit`}>
                  {selectedPriority.label}
                </Badge>
              )}
            </div>
          </div>
          {formData.title && (
            <div className="mt-4">
              <p className="text-sm text-[#376470] mb-1">Titre</p>
              <p className="font-medium text-[#29475B]">{formData.title}</p>
            </div>
          )}
        </RicashCard>
      )}

      {/* Formulaire principal */}
      <RicashCard className="p-6">
        <h3 className="text-lg font-semibold text-[#29475B] mb-6 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Informations de l'alerte
        </h3>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <RicashLabel className="text-sm font-medium text-[#376470] mb-2 block">
                Type d'alerte *
              </RicashLabel>
              <RicashSelect
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value)}
                options={alertTypes.map(type => ({
                  value: type.value,
                  label: type.label
                }))}
                placeholder="Sélectionner un type"
              />
              {selectedType && (
                <p className="text-sm text-[#376470] mt-2">{selectedType.description}</p>
              )}
            </div>

            <div>
              <RicashLabel className="text-sm font-medium text-[#376470] mb-2 block">
                Sévérité *
              </RicashLabel>
              <RicashSelect
                value={formData.severity}
                onValueChange={(value) => handleInputChange('severity', value)}
                options={severityLevels.map(level => ({
                  value: level.value,
                  label: level.label
                }))}
                placeholder="Sélectionner une sévérité"
              />
            </div>

            <div>
              <RicashLabel className="text-sm font-medium text-[#376470] mb-2 block">
                Priorité
              </RicashLabel>
              <RicashSelect
                value={formData.priority}
                onValueChange={(value) => handleInputChange('priority', value)}
                options={priorityLevels.map(level => ({
                  value: level.value,
                  label: level.label
                }))}
                placeholder="Sélectionner une priorité"
              />
            </div>

            <div>
              <RicashLabel className="text-sm font-medium text-[#376470] mb-2 block">
                Catégorie
              </RicashLabel>
              <RicashInput
                placeholder="Ex: Transaction suspecte, KYC, Système..."
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <RicashLabel className="text-sm font-medium text-[#376470] mb-2 block">
                Titre de l'alerte *
              </RicashLabel>
              <RicashInput
                placeholder="Titre descriptif de l'alerte..."
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>

            <div>
              <RicashLabel className="text-sm font-medium text-[#376470] mb-2 block">
                Assigné à
              </RicashLabel>
              <RicashSelect
                value={formData.assignedTo}
                onValueChange={(value) => handleInputChange('assignedTo', value)}
                options={[
                  { value: 'agent-sec-001', label: 'Agent Sécurité 001' },
                  { value: 'agent-kyc-002', label: 'Agent KYC 002' },
                  { value: 'equipe-tech', label: 'Équipe Technique' },
                  { value: 'manager', label: 'Manager Sécurité' }
                ]}
                placeholder="Sélectionner un assigné"
              />
            </div>

            <div>
              <RicashLabel className="text-sm font-medium text-[#376470] mb-2 block">
                Date d'échéance
              </RicashLabel>
              <RicashInput
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
              />
            </div>

            <div>
              <RicashLabel className="text-sm font-medium text-[#376470] mb-2 block">
                Tags
              </RicashLabel>
              <RicashInput
                placeholder="Ex: fraude, urgence, client-vip..."
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <RicashLabel className="text-sm font-medium text-[#376470] mb-2 block">
            Description détaillée *
          </RicashLabel>
          <RicashTextarea
            placeholder="Décrivez en détail l'alerte de sécurité, les circonstances, les actions à prendre..."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>

        <div className="mt-6">
          <RicashLabel className="text-sm font-medium text-[#376470] mb-2 block">
            Notes additionnelles
          </RicashLabel>
          <RicashTextarea
            placeholder="Ajoutez des notes, instructions ou informations complémentaires..."
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={3}
            className="resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <RicashButton
            variant="outline"
            onClick={() => navigate('/app/security')}
          >
            Annuler
          </RicashButton>
          <RicashButton
            variant="outline"
            onClick={handleSaveDraft}
            loading={isLoading}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Sauvegarder brouillon
          </RicashButton>
          <RicashButton
            onClick={handleSave}
            loading={isLoading}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Créer l'alerte
          </RicashButton>
        </div>
      </RicashCard>

      {/* Alertes récentes */}
      <RicashCard className="p-6">
        <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Alertes récentes
        </h3>
        <div className="space-y-4">
          {mockSecurityAlerts.slice(0, 3).map((alert) => (
            <div key={alert.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                alert.severity === 'high' ? 'bg-red-500' :
                alert.severity === 'medium' ? 'bg-yellow-500' :
                'bg-green-500'
              }`}>
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-[#29475B]">{alert.title}</p>
                  {getStatusBadge(alert.status)}
                </div>
                <p className="text-sm text-[#376470]">{formatDate(alert.createdAt)} - {alert.assignedTo}</p>
                <p className="text-sm text-[#29475B] mt-1">{alert.description}</p>
              </div>
            </div>
          ))}
        </div>
      </RicashCard>

      {/* Avertissement */}
      <RicashCard className="p-6 bg-red-50 border-red-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-red-800 mb-2">Important</h4>
            <p className="text-sm text-red-700">
              Les alertes de sécurité sont critiques pour la protection du système. 
              Assurez-vous de fournir des informations précises et complètes pour faciliter la résolution.
            </p>
          </div>
        </div>
      </RicashCard>
    </div>
  )
}
