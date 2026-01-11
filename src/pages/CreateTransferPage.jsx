import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft,
  User,
  DollarSign,
  Save,
  CheckCircle
} from 'lucide-react'
import { RicashButton } from '@/components/ui/ricash-button'
import { RicashCard } from '@/components/ui/ricash-card'
import { RicashInput } from '@/components/ui/ricash-input'
import { RicashLabel } from '@/components/ui/ricash-label'
import { RicashTextarea } from '@/components/ui/ricash-textarea'
import { SafeSelect } from '@/components/ui/safe-select'
import { toast } from 'sonner'

export default function CreateTransferPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    expediteur: {
      nom: '',
      prenom: '',
      telephone: '',
      email: '',
    },
    destinataire: {
      nom: '',
      prenom: '',
      telephone: '',
      email: '',
    },
    transfert: {
      montant: '',
      devise: 'EUR',
      frais: 0,
      montantTotal: 0,
      motif: '',
      urgence: 'normal'
    }
  })
  const [errors, setErrors] = useState({})

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

  const calculateFees = (montant) => {
    const amount = parseFloat(montant) || 0
    let fees = 0
    
    if (amount <= 100) {
      fees = amount * 0.02
    } else if (amount <= 500) {
      fees = amount * 0.015
    } else if (amount <= 1000) {
      fees = amount * 0.01
    } else {
      fees = amount * 0.005
    }
    
    return Math.round(fees * 100) / 100
  }

  const validateStep = (step) => {
    const newErrors = {}
    
    if (step === 1) {
      if (!formData.expediteur.nom.trim()) newErrors['expediteur.nom'] = 'Le nom est requis'
      if (!formData.expediteur.prenom.trim()) newErrors['expediteur.prenom'] = 'Le prénom est requis'
      if (!formData.expediteur.telephone.trim()) newErrors['expediteur.telephone'] = 'Le téléphone est requis'
      if (!formData.expediteur.email.trim()) newErrors['expediteur.email'] = 'L\'email est requis'
    } else if (step === 2) {
      if (!formData.destinataire.nom.trim()) newErrors['destinataire.nom'] = 'Le nom est requis'
      if (!formData.destinataire.prenom.trim()) newErrors['destinataire.prenom'] = 'Le prénom est requis'
      if (!formData.destinataire.telephone.trim()) newErrors['destinataire.telephone'] = 'Le téléphone est requis'
      if (!formData.destinataire.email.trim()) newErrors['destinataire.email'] = 'L\'email est requis'
    } else if (step === 3) {
      if (!formData.transfert.montant || parseFloat(formData.transfert.montant) <= 0) {
        newErrors['transfert.montant'] = 'Le montant doit être positif'
      }
      if (!formData.transfert.motif.trim()) {
        newErrors['transfert.motif'] = 'Le motif est requis'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateStep(3)) return
    
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Informations expéditeur'
      case 2: return 'Informations destinataire'
      case 3: return 'Détails du transfert'
      default: return ''
    }
  }

  const pays = [
    { value: 'Sénégal', label: 'Sénégal', key: 'country-senegal' },
    { value: 'France', label: 'France', key: 'country-france' },
    { value: 'Mali', label: 'Mali', key: 'country-mali' },
    { value: 'Côte d\'Ivoire', label: 'Côte d\'Ivoire', key: 'country-ivory-coast' }
  ]

  const devises = [
    { value: 'EUR', label: 'EUR (€)', key: 'currency-eur' },
    { value: 'USD', label: 'USD ($)', key: 'currency-usd' },
    { value: 'XOF', label: 'XOF (FCFA)', key: 'currency-xof' }
  ]

  const niveauxUrgence = [
    { value: 'normal', label: 'Normal', key: 'urgency-normal' },
    { value: 'urgent', label: 'Urgent', key: 'urgency-urgent' },
    { value: 'critique', label: 'Critique', key: 'urgency-critical' }
  ]

  // Calculate fees when amount changes
  React.useEffect(() => {
    if (formData.transfert.montant) {
      const fees = calculateFees(formData.transfert.montant)
      const total = parseFloat(formData.transfert.montant) + fees
      setFormData(prev => ({
        ...prev,
        transfert: {
          ...prev.transfert,
          frais: fees,
          montantTotal: total
        }
      }))
    }
  }, [formData.transfert.montant])

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
            Retour aux transferts
          </RicashButton>
          <div>
            <h1 className="text-3xl font-bold text-[#29475B]">
              Nouveau transfert
            </h1>
            <div className="text-[#376470]">
              Étape {currentStep}/3 - {getStepTitle()}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <RicashButton variant="outline" onClick={() => navigate('/app/transfers')}>
            Annuler
          </RicashButton>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                step <= currentStep 
                  ? 'bg-gradient-to-r from-[#2B8286] to-[#B19068] text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-500 border-2 border-gray-200'
              }`}>
                {step <= currentStep ? <User className="h-4 w-4" /> : step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                  step < currentStep 
                    ? 'bg-gradient-to-r from-[#2B8286] to-[#B19068]' 
                    : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-3">
          <div className="text-base font-medium text-[#29475B]">{getStepTitle()}</div>
          <div className="text-sm text-[#376470]">
            {currentStep === 1 && "Informations de la personne qui envoie"}
            {currentStep === 2 && "Informations de la personne qui reçoit"}
            {currentStep === 3 && "Montant et détails du transfert"}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Informations expéditeur */}
        {currentStep === 1 && (
          <RicashCard className="p-6 border-l-4 border-l-[#2B8286]">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#2B8286] flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#29475B]">
                    Informations expéditeur
                  </h3>
                  <div className="text-sm text-[#376470]">
                    Personne qui envoie l'argent
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <RicashLabel htmlFor="expediteur.nom" className="text-sm font-medium">Nom *</RicashLabel>
                  <RicashInput
                    id="expediteur.nom"
                    value={formData.expediteur.nom}
                    onChange={(e) => handleInputChange('expediteur.nom', e.target.value)}
                    placeholder="Entrez le nom"
                    className={errors['expediteur.nom'] ? 'border-red-500' : ''}
                  />
                  {errors['expediteur.nom'] && (
                    <div className="text-red-500 text-xs mt-1">{errors['expediteur.nom']}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <RicashLabel htmlFor="expediteur.prenom" className="text-sm font-medium">Prénom *</RicashLabel>
                  <RicashInput
                    id="expediteur.prenom"
                    value={formData.expediteur.prenom}
                    onChange={(e) => handleInputChange('expediteur.prenom', e.target.value)}
                    placeholder="Entrez le prénom"
                    className={errors['expediteur.prenom'] ? 'border-red-500' : ''}
                  />
                  {errors['expediteur.prenom'] && (
                    <div className="text-red-500 text-xs mt-1">{errors['expediteur.prenom']}</div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <RicashLabel htmlFor="expediteur.telephone" className="text-sm font-medium">Téléphone *</RicashLabel>
                  <RicashInput
                    id="expediteur.telephone"
                    value={formData.expediteur.telephone}
                    onChange={(e) => handleInputChange('expediteur.telephone', e.target.value)}
                    placeholder="+221 XX XXX XX XX"
                    className={errors['expediteur.telephone'] ? 'border-red-500' : ''}
                  />
                  {errors['expediteur.telephone'] && (
                    <div className="text-red-500 text-xs mt-1">{errors['expediteur.telephone']}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <RicashLabel htmlFor="expediteur.email" className="text-sm font-medium">Email *</RicashLabel>
                  <RicashInput
                    id="expediteur.email"
                    type="email"
                    value={formData.expediteur.email}
                    onChange={(e) => handleInputChange('expediteur.email', e.target.value)}
                    placeholder="exemple@email.com"
                    className={errors['expediteur.email'] ? 'border-red-500' : ''}
                  />
                  {errors['expediteur.email'] && (
                    <div className="text-red-500 text-xs mt-1">{errors['expediteur.email']}</div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <RicashLabel htmlFor="expediteur.pays" className="text-sm font-medium">Pays</RicashLabel>
                <SafeSelect
                  value={formData.expediteur.pays}
                  onValueChange={(value) => handleInputChange('expediteur.pays', value)}
                  options={pays}
                  placeholder="Sélectionnez un pays"
                />
              </div>
            </div>
          </RicashCard>
        )}

        {/* Step 2: Informations destinataire */}
        {currentStep === 2 && (
          <RicashCard className="p-6 border-l-4 border-l-[#B19068]">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#B19068] flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#29475B]">
                    Informations destinataire
                  </h3>
                  <div className="text-sm text-[#376470]">
                    Personne qui recevra l'argent
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <RicashLabel htmlFor="destinataire.nom" className="text-sm font-medium">Nom *</RicashLabel>
                  <RicashInput
                    id="destinataire.nom"
                    value={formData.destinataire.nom}
                    onChange={(e) => handleInputChange('destinataire.nom', e.target.value)}
                    placeholder="Entrez le nom"
                    className={errors['destinataire.nom'] ? 'border-red-500' : ''}
                  />
                  {errors['destinataire.nom'] && (
                    <div className="text-red-500 text-xs mt-1">{errors['destinataire.nom']}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <RicashLabel htmlFor="destinataire.prenom" className="text-sm font-medium">Prénom *</RicashLabel>
                  <RicashInput
                    id="destinataire.prenom"
                    value={formData.destinataire.prenom}
                    onChange={(e) => handleInputChange('destinataire.prenom', e.target.value)}
                    placeholder="Entrez le prénom"
                    className={errors['destinataire.prenom'] ? 'border-red-500' : ''}
                  />
                  {errors['destinataire.prenom'] && (
                    <div className="text-red-500 text-xs mt-1">{errors['destinataire.prenom']}</div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <RicashLabel htmlFor="destinataire.telephone" className="text-sm font-medium">Téléphone *</RicashLabel>
                  <RicashInput
                    id="destinataire.telephone"
                    value={formData.destinataire.telephone}
                    onChange={(e) => handleInputChange('destinataire.telephone', e.target.value)}
                    placeholder="+221 XX XXX XX XX"
                    className={errors['destinataire.telephone'] ? 'border-red-500' : ''}
                  />
                  {errors['destinataire.telephone'] && (
                    <div className="text-red-500 text-xs mt-1">{errors['destinataire.telephone']}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <RicashLabel htmlFor="destinataire.email" className="text-sm font-medium">Email *</RicashLabel>
                  <RicashInput
                    id="destinataire.email"
                    type="email"
                    value={formData.destinataire.email}
                    onChange={(e) => handleInputChange('destinataire.email', e.target.value)}
                    placeholder="exemple@email.com"
                    className={errors['destinataire.email'] ? 'border-red-500' : ''}
                  />
                  {errors['destinataire.email'] && (
                    <div className="text-red-500 text-xs mt-1">{errors['destinataire.email']}</div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <RicashLabel htmlFor="destinataire.pays" className="text-sm font-medium">Pays</RicashLabel>
                <SafeSelect
                  value={formData.destinataire.pays}
                  onValueChange={(value) => handleInputChange('destinataire.pays', value)}
                  options={pays}
                  placeholder="Sélectionnez un pays"
                />
              </div>
            </div>
          </RicashCard>
        )}

        {/* Step 3: Détails du transfert */}
        {currentStep === 3 && (
          <RicashCard className="p-6 border-l-4 border-l-[#2B8286]">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#2B8286] flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#29475B]">
                    Détails du transfert
                  </h3>
                  <div className="text-sm text-[#376470]">
                    Montant et informations du transfert
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <RicashLabel htmlFor="transfert.montant" className="text-sm font-medium">Montant *</RicashLabel>
                  <RicashInput
                    id="transfert.montant"
                    type="number"
                    value={formData.transfert.montant}
                    onChange={(e) => handleInputChange('transfert.montant', e.target.value)}
                    placeholder="0.00"
                    className={errors['transfert.montant'] ? 'border-red-500' : ''}
                  />
                  {errors['transfert.montant'] && (
                    <div className="text-red-500 text-xs mt-1">{errors['transfert.montant']}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <RicashLabel htmlFor="transfert.devise" className="text-sm font-medium">Devise</RicashLabel>
                  <SafeSelect
                    value={formData.transfert.devise}
                    onValueChange={(value) => handleInputChange('transfert.devise', value)}
                    options={devises}
                    placeholder="Sélectionnez une devise"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <RicashLabel htmlFor="transfert.frais" className="text-sm font-medium">Frais (calculés automatiquement)</RicashLabel>
                  <RicashInput
                    id="transfert.frais"
                    value={formData.transfert.frais}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                
                <div className="space-y-2">
                  <RicashLabel htmlFor="transfert.montantTotal" className="text-sm font-medium">Total à payer</RicashLabel>
                  <RicashInput
                    id="transfert.montantTotal"
                    value={formData.transfert.montantTotal}
                    disabled
                    className="bg-gray-50 font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <RicashLabel htmlFor="transfert.urgence" className="text-sm font-medium">Niveau d'urgence</RicashLabel>
                <SafeSelect
                  value={formData.transfert.urgence}
                  onValueChange={(value) => handleInputChange('transfert.urgence', value)}
                  options={niveauxUrgence}
                  placeholder="Sélectionnez le niveau d'urgence"
                />
              </div>

              <div className="space-y-2">
                <RicashLabel htmlFor="transfert.motif" className="text-sm font-medium">Motif du transfert *</RicashLabel>
                <RicashTextarea
                  id="transfert.motif"
                  value={formData.transfert.motif}
                  onChange={(e) => handleInputChange('transfert.motif', e.target.value)}
                  placeholder="Décrivez le motif du transfert..."
                  rows={3}
                  className={errors['transfert.motif'] ? 'border-red-500' : ''}
                />
                {errors['transfert.motif'] && (
                  <div className="text-red-500 text-xs mt-1">{errors['transfert.motif']}</div>
                )}
              </div>
            </div>
          </RicashCard>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between items-center pt-6 border-t">
          <div className="flex gap-3">
            {currentStep > 1 && (
              <RicashButton
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Précédent
              </RicashButton>
            )}
          </div>
          <div className="flex gap-3">
            {currentStep < 3 ? (
              <RicashButton
                type="button"
                onClick={nextStep}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                Suivant
              </RicashButton>
            ) : (
              <RicashButton
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 min-w-[160px] bg-gradient-to-r from-[#2B8286] to-[#B19068] hover:from-[#2B8286]/90 hover:to-[#B19068]/90"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Création...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Créer le transfert
                  </>
                )}
              </RicashButton>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}