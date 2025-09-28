import { useState, useEffect } from 'react'
import { 
  DollarSign,
  Percent,
  ArrowLeftRight,
  Building2,
  Settings, 
  Calculator,
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
import { SAFE_SELECT_OPTIONS } from '@/lib/safe-select-options'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

// Static options moved directly to SelectItems to prevent DOM issues

export default function FeesConfigModal({ isOpen, onClose, onSave, fee }) {
  const [formData, setFormData] = useState({
    nom: '',
    type: 'transfert',
    corridorOrigine: '',
    corridorDestination: '',
    montantMin: 0,
    montantMax: 1000,
    fraisFixe: 0,
    fraisPourcentage: 0,
    commissionAgent: 0,
    commissionAgence: 0,
    statut: 'actif',
    description: ''
  })
  const [errors, setErrors] = useState({})
  const [previewAmount, setPreviewAmount] = useState(500)

  useEffect(() => {
    if (fee) {
      setFormData({
        nom: fee.nom || '',
        type: fee.type || 'transfert',
        corridorOrigine: fee.corridorOrigine || '',
        corridorDestination: fee.corridorDestination || '',
        montantMin: fee.montantMin || 0,
        montantMax: fee.montantMax || 1000,
        fraisFixe: fee.fraisFixe || 0,
        fraisPourcentage: fee.fraisPourcentage || 0,
        commissionAgent: fee.commissionAgent || 0,
        commissionAgence: fee.commissionAgence || 0,
        statut: fee.statut || 'actif',
        description: fee.description || ''
      })
    } else {
      setFormData({
        nom: '',
        type: 'transfert',
        corridorOrigine: '',
        corridorDestination: '',
        montantMin: 0,
        montantMax: 1000,
        fraisFixe: 0,
        fraisPourcentage: 0,
        commissionAgent: 0,
        commissionAgence: 0,
        statut: 'actif',
        description: ''
      })
    }
    setErrors({})
  }, [fee, isOpen])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
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
    
    // Required fields validation
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis'
    if (!formData.corridorOrigine) newErrors.corridorOrigine = 'Le corridor d\'origine est requis'
    if (!formData.corridorDestination) newErrors.corridorDestination = 'Le corridor de destination est requis'
    
    // Numeric validations
    if (formData.montantMin < 0) newErrors.montantMin = 'Le montant minimum doit être positif'
    if (formData.montantMax <= formData.montantMin) newErrors.montantMax = 'Le montant maximum doit être supérieur au minimum'
    if (formData.fraisFixe < 0) newErrors.fraisFixe = 'Les frais fixes doivent être positifs'
    if (formData.fraisPourcentage < 0 || formData.fraisPourcentage > 100) newErrors.fraisPourcentage = 'Le pourcentage doit être entre 0 et 100'
    if (formData.commissionAgent < 0 || formData.commissionAgent > 100) newErrors.commissionAgent = 'La commission agent doit être entre 0 et 100'
    if (formData.commissionAgence < 0 || formData.commissionAgence > 100) newErrors.commissionAgence = 'La commission agence doit être entre 0 et 100'
    
    // Business logic validations
    if (formData.fraisFixe === 0 && formData.fraisPourcentage === 0) {
      newErrors.fraisFixe = 'Au moins un type de frais doit être défini'
      newErrors.fraisPourcentage = 'Au moins un type de frais doit être défini'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      const feeData = {
        ...formData,
        montantMin: Number(formData.montantMin),
        montantMax: Number(formData.montantMax),
        fraisFixe: Number(formData.fraisFixe),
        fraisPourcentage: Number(formData.fraisPourcentage),
        commissionAgent: Number(formData.commissionAgent),
        commissionAgence: Number(formData.commissionAgence)
      }
      
      onSave?.(feeData)
      onClose()
    }
  }

  const calculatePreview = () => {
    const fraisTotal = formData.fraisFixe + (previewAmount * formData.fraisPourcentage / 100)
    const commissionAgentAmount = previewAmount * formData.commissionAgent / 100
    const commissionAgenceAmount = previewAmount * formData.commissionAgence / 100
    
    return {
      fraisTotal,
      commissionAgentAmount,
      commissionAgenceAmount,
      totalDebite: previewAmount + fraisTotal
    }
  }

  const preview = calculatePreview()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatPercentage = (percentage) => {
    return `${percentage}%`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {fee ? 'Modifier la configuration' : 'Nouvelle configuration de frais'}
          </DialogTitle>
          <DialogDescription>
            {fee ? 'Modifiez les paramètres de frais et commissions' : 'Créez une nouvelle configuration de frais et commissions'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Configuration Form */}
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom de la configuration *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => handleInputChange('nom', e.target.value)}
                    placeholder="Ex: Transfert France → Sénégal"
                    className={errors.nom ? 'border-red-500' : ''}
                  />
                  {errors.nom && <p className="text-sm text-red-500">{errors.nom}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type de transaction</Label>
                  <SafeSelect
                    value={formData.type}
                    onValueChange={(value) => handleInputChange('type', value)}
                    placeholder="Sélectionner le type"
                    options={SAFE_SELECT_OPTIONS.transactionTypes}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="corridorOrigine">Origine *</Label>
                    <SafeSelect
                      value={formData.corridorOrigine}
                      onValueChange={(value) => handleInputChange('corridorOrigine', value)}
                      placeholder="Pays d'origine"
                      options={SAFE_SELECT_OPTIONS.countries}
                      triggerClassName={errors.corridorOrigine ? 'border-red-500' : ''}
                    />
                    {errors.corridorOrigine && <p className="text-sm text-red-500">{errors.corridorOrigine}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="corridorDestination">Destination *</Label>
                    <SafeSelect
                      value={formData.corridorDestination}
                      onValueChange={(value) => handleInputChange('corridorDestination', value)}
                      placeholder="Pays de destination"
                      options={SAFE_SELECT_OPTIONS.countries}
                      triggerClassName={errors.corridorDestination ? 'border-red-500' : ''}
                    />
                    {errors.corridorDestination && <p className="text-sm text-red-500">{errors.corridorDestination}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="statut">Statut</Label>
                  <SafeSelect
                    value={formData.statut}
                    onValueChange={(value) => handleInputChange('statut', value)}
                    placeholder="Statut"
                    options={[
                      { value: 'actif', label: 'Actif', key: 'status-actif' },
                      { value: 'inactif', label: 'Inactif', key: 'status-inactif' },
                      { value: 'brouillon', label: 'Brouillon', key: 'status-brouillon' }
                    ]}
                  />
                  </div>
              </CardContent>
            </Card>

            {/* Amount Limits */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Limites de montant</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="montantMin">Montant minimum (€)</Label>
                    <Input
                      id="montantMin"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.montantMin}
                      onChange={(e) => handleInputChange('montantMin', parseFloat(e.target.value) || 0)}
                      className={errors.montantMin ? 'border-red-500' : ''}
                    />
                    {errors.montantMin && <p className="text-sm text-red-500">{errors.montantMin}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="montantMax">Montant maximum (€)</Label>
                    <Input
                      id="montantMax"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.montantMax}
                      onChange={(e) => handleInputChange('montantMax', parseFloat(e.target.value) || 0)}
                      className={errors.montantMax ? 'border-red-500' : ''}
                    />
                    {errors.montantMax && <p className="text-sm text-red-500">{errors.montantMax}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fees Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Configuration des frais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fraisFixe">Frais fixe (€)</Label>
                    <Input
                      id="fraisFixe"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.fraisFixe}
                      onChange={(e) => handleInputChange('fraisFixe', parseFloat(e.target.value) || 0)}
                      className={errors.fraisFixe ? 'border-red-500' : ''}
                    />
                    {errors.fraisFixe && <p className="text-sm text-red-500">{errors.fraisFixe}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fraisPourcentage">Frais en % du montant</Label>
                    <Input
                      id="fraisPourcentage"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.fraisPourcentage}
                      onChange={(e) => handleInputChange('fraisPourcentage', parseFloat(e.target.value) || 0)}
                      className={errors.fraisPourcentage ? 'border-red-500' : ''}
                    />
                    {errors.fraisPourcentage && <p className="text-sm text-red-500">{errors.fraisPourcentage}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Commissions Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Percent className="h-5 w-5" />
                  Configuration des commissions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="commissionAgent">Commission agent (%)</Label>
                            <Input
                      id="commissionAgent"
                              type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.commissionAgent}
                      onChange={(e) => handleInputChange('commissionAgent', parseFloat(e.target.value) || 0)}
                      className={errors.commissionAgent ? 'border-red-500' : ''}
                    />
                    {errors.commissionAgent && <p className="text-sm text-red-500">{errors.commissionAgent}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="commissionAgence">Commission agence (%)</Label>
                            <Input
                      id="commissionAgence"
                              type="number"
                      min="0"
                      max="100"
                              step="0.1"
                      value={formData.commissionAgence}
                      onChange={(e) => handleInputChange('commissionAgence', parseFloat(e.target.value) || 0)}
                      className={errors.commissionAgence ? 'border-red-500' : ''}
                    />
                    {errors.commissionAgence && <p className="text-sm text-red-500">{errors.commissionAgence}</p>}
                          </div>
                          </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Calculator */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Aperçu des calculs
                </CardTitle>
                <CardDescription>
                  Testez votre configuration avec différents montants
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="previewAmount">Montant de test (€)</Label>
                  <Input
                    id="previewAmount"
                    type="number"
                    min="0"
                    step="1"
                    value={previewAmount}
                    onChange={(e) => setPreviewAmount(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Montant envoyé:</span>
                    <span className="font-medium">{formatCurrency(previewAmount)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Frais fixe:</span>
                    <span className="font-medium">{formatCurrency(formData.fraisFixe)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Frais en % ({formatPercentage(formData.fraisPourcentage)}):</span>
                    <span className="font-medium">{formatCurrency(previewAmount * formData.fraisPourcentage / 100)}</span>
                  </div>
                  
                  <div className="flex justify-between font-medium text-red-600">
                    <span>Total frais:</span>
                    <span>{formatCurrency(preview.fraisTotal)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-green-600">
                    <span className="text-sm">Commission agent ({formatPercentage(formData.commissionAgent)}):</span>
                    <span className="font-medium">{formatCurrency(preview.commissionAgentAmount)}</span>
                  </div>
                  
                  <div className="flex justify-between text-blue-600">
                    <span className="text-sm">Commission agence ({formatPercentage(formData.commissionAgence)}):</span>
                    <span className="font-medium">{formatCurrency(preview.commissionAgenceAmount)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold">
                    <span>Total à débiter:</span>
                    <span>{formatCurrency(preview.totalDebite)}</span>
                  </div>
                </div>

                {(previewAmount < formData.montantMin || previewAmount > formData.montantMax) && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      ⚠️ Ce montant est en dehors des limites configurées ({formatCurrency(formData.montantMin)} - {formatCurrency(formData.montantMax)})
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Configuration Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Résumé de la configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <Badge variant="outline">{SAFE_SELECT_OPTIONS.transactionTypes.find(t => t.value === formData.type)?.label}</Badge>
                    </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Corridor:</span>
                  <span className="text-sm font-medium">{formData.corridorOrigine} → {formData.corridorDestination}</span>
                  </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Limites:</span>
                  <span className="text-sm font-medium">{formatCurrency(formData.montantMin)} - {formatCurrency(formData.montantMax)}</span>
                    </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Statut:</span>
                  <Badge variant={formData.statut === 'actif' ? 'default' : 'secondary'}>
                    {formData.statut.charAt(0).toUpperCase() + formData.statut.slice(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="mr-2 h-4 w-4" />
            {fee ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}