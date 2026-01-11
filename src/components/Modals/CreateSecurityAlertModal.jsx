import { useState } from 'react'
import { 
  Shield,
  AlertTriangle,
  Bell,
  Zap,
  Globe,
  Building2,
  Target,
  Clock,
  User,
  FileText,
  Save,
  X
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SafeSelect } from '@/components/ui/safe-select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function CreateSecurityAlertModal({ isOpen, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type: 'suspicious_activity',
    niveau: 'medium',
    source: 'system',
    cible: 'all',
    conditions: {
      montantMin: '',
      montantMax: '',
      nombreTransactions: '',
      periode: '24h',
      utilisateur: '',
      agence: '',
      ip: '',
      pays: ''
    },
    actions: {
      bloquerTransaction: false,
      notifierAdmin: true,
      notifierAgent: false,
      suspendreCompte: false,
      genererRapport: true
    },
    statut: 'actif',
    dateDebut: '',
    dateFin: '',
    commentaires: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.titre.trim()) {
      newErrors.titre = 'Le titre est requis'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise'
    }
    
    if (!formData.niveau) {
      newErrors.niveau = 'Le niveau de priorité est requis'
    }
    
    if (!formData.type) {
      newErrors.type = 'Le type d\'alerte est requis'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      // Simuler la création de l'alerte
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newAlert = {
        ...formData,
        id: `ALERT-${Date.now()}`,
        dateCreation: new Date().toISOString(),
        createur: 'Admin',
        statut: 'actif'
      }
      
      onCreate?.(newAlert)
      onClose()
      
      // Reset form
      setFormData({
        titre: '',
        description: '',
        type: 'suspicious_activity',
        niveau: 'medium',
        source: 'system',
        cible: 'all',
        conditions: {
          montantMin: '',
          montantMax: '',
          nombreTransactions: '',
          periode: '24h',
          utilisateur: '',
          agence: '',
          ip: '',
          pays: ''
        },
        actions: {
          bloquerTransaction: false,
          notifierAdmin: true,
          notifierAgent: false,
          suspendreCompte: false,
          genererRapport: true
        },
        statut: 'actif',
        dateDebut: '',
        dateFin: '',
        commentaires: ''
      })
      setErrors({})
      
    } catch (error) {
      console.error('Erreur lors de la création de l\'alerte:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const alertTypes = [
    { value: 'suspicious_activity', label: 'Activité suspecte', key: 'alert-suspicious' },
    { value: 'fraud_detection', label: 'Détection de fraude', key: 'alert-fraud' },
    { value: 'unusual_pattern', label: 'Modèle inhabituel', key: 'alert-pattern' },
    { value: 'security_breach', label: 'Violation de sécurité', key: 'alert-breach' },
    { value: 'compliance_violation', label: 'Violation de conformité', key: 'alert-compliance' },
    { value: 'system_anomaly', label: 'Anomalie système', key: 'alert-system' }
  ]

  const alertLevels = [
    { value: 'low', label: 'Faible', key: 'level-low' },
    { value: 'medium', label: 'Moyen', key: 'level-medium' },
    { value: 'high', label: 'Élevé', key: 'level-high' },
    { value: 'critical', label: 'Critique', key: 'level-critical' }
  ]

  const alertSources = [
    { value: 'system', label: 'Système automatique', key: 'source-system' },
    { value: 'manual', label: 'Manuel', key: 'source-manual' },
    { value: 'external', label: 'Source externe', key: 'source-external' },
    { value: 'user_report', label: 'Signalement utilisateur', key: 'source-user' }
  ]

  // const alertTargets = [
  //   { value: 'all', label: 'Tous les utilisateurs', key: 'target-all' },
  //   { value: 'specific_user', label: 'Utilisateur spécifique', key: 'target-user' },
  //   { value: 'specific_agency', label: 'Agence spécifique', key: 'target-agency' },
  //   { value: 'specific_country', label: 'Pays spécifique', key: 'target-country' }
  // ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Créer une nouvelle alerte de sécurité
          </DialogTitle>
          <DialogDescription>
            Configurez une nouvelle alerte de sécurité pour surveiller les activités suspectes
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="titre">Titre de l'alerte *</Label>
                <Input
                  id="titre"
                  value={formData.titre}
                  onChange={(e) => handleInputChange('titre', e.target.value)}
                  placeholder="Ex: Activité suspecte détectée"
                  className={errors.titre ? 'border-red-500' : ''}
                />
                {errors.titre && <p className="text-sm text-red-500">{errors.titre}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type d'alerte *</Label>
                <SafeSelect 
                  value={formData.type} 
                  onValueChange={(value) => handleInputChange('type', value)}
                  placeholder="Sélectionnez un type"
                  options={alertTypes}
                />
                {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="niveau">Niveau de priorité *</Label>
                <SafeSelect 
                  value={formData.niveau} 
                  onValueChange={(value) => handleInputChange('niveau', value)}
                  placeholder="Sélectionnez un niveau"
                  options={alertLevels}
                />
                {errors.niveau && <p className="text-sm text-red-500">{errors.niveau}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <SafeSelect 
                  value={formData.source} 
                  onValueChange={(value) => handleInputChange('source', value)}
                  placeholder="Sélectionnez une source"
                  options={alertSources}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Décrivez les conditions qui déclencheront cette alerte..."
                  className={errors.description ? 'border-red-500' : ''}
                  rows={3}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Conditions de déclenchement */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conditions de déclenchement</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="montantMin">Montant minimum (XOF)</Label>
                <Input
                  id="montantMin"
                  type="number"
                  value={formData.conditions.montantMin}
                  onChange={(e) => handleInputChange('conditions.montantMin', e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="montantMax">Montant maximum (XOF)</Label>
                <Input
                  id="montantMax"
                  type="number"
                  value={formData.conditions.montantMax}
                  onChange={(e) => handleInputChange('conditions.montantMax', e.target.value)}
                  placeholder="1000000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nombreTransactions">Nombre de transactions</Label>
                <Input
                  id="nombreTransactions"
                  type="number"
                  value={formData.conditions.nombreTransactions}
                  onChange={(e) => handleInputChange('conditions.nombreTransactions', e.target.value)}
                  placeholder="10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="periode">Période de surveillance</Label>
                <SafeSelect 
                  value={formData.conditions.periode} 
                  onValueChange={(value) => handleInputChange('conditions.periode', value)}
                  options={[
                    { value: '1h', label: '1 heure', key: 'period-1h' },
                    { value: '24h', label: '24 heures', key: 'period-24h' },
                    { value: '7d', label: '7 jours', key: 'period-7d' },
                    { value: '30d', label: '30 jours', key: 'period-30d' }
                  ]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="utilisateur">Utilisateur spécifique</Label>
                <Input
                  id="utilisateur"
                  value={formData.conditions.utilisateur}
                  onChange={(e) => handleInputChange('conditions.utilisateur', e.target.value)}
                  placeholder="ID utilisateur"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agence">Agence spécifique</Label>
                <Input
                  id="agence"
                  value={formData.conditions.agence}
                  onChange={(e) => handleInputChange('conditions.agence', e.target.value)}
                  placeholder="ID agence"
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions à effectuer */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions à effectuer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="bloquerTransaction"
                    checked={formData.actions.bloquerTransaction}
                    onChange={(e) => handleInputChange('actions.bloquerTransaction', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="bloquerTransaction">Bloquer la transaction</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="notifierAdmin"
                    checked={formData.actions.notifierAdmin}
                    onChange={(e) => handleInputChange('actions.notifierAdmin', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="notifierAdmin">Notifier l'administrateur</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="notifierAgent"
                    checked={formData.actions.notifierAgent}
                    onChange={(e) => handleInputChange('actions.notifierAgent', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="notifierAgent">Notifier l'agent</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="suspendreCompte"
                    checked={formData.actions.suspendreCompte}
                    onChange={(e) => handleInputChange('actions.suspendreCompte', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="suspendreCompte">Suspendre le compte</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="genererRapport"
                    checked={formData.actions.genererRapport}
                    onChange={(e) => handleInputChange('actions.genererRapport', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="genererRapport">Générer un rapport</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Commentaires */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Commentaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="commentaires">Notes supplémentaires</Label>
                <Textarea
                  id="commentaires"
                  value={formData.commentaires}
                  onChange={(e) => handleInputChange('commentaires', e.target.value)}
                  placeholder="Ajoutez des notes ou instructions supplémentaires..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              <X className="mr-2 h-4 w-4" />
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#2B8286] hover:bg-[#2B8286]/90"
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Création...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Créer l'alerte
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
