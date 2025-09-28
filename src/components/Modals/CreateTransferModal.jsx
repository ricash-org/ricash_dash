import React, { useState, useEffect } from 'react'
import { 
  ChevronLeft,
  ChevronRight,
  DollarSign,
  User,
  Save,
  ArrowRightLeft,
  CheckCircle,
  AlertCircle,
  Copy,
  Eye,
  EyeOff,
  Calculator,
  Shield,
  Clock,
  MapPin
} from 'lucide-react'
import { BaseModal } from '@/components/ui/base-modal'
import { RicashButton } from '@/components/ui/ricash-button'
import { RicashInput, RicashTextarea } from '@/components/ui/ricash-input'
import { RicashLabel } from '@/components/ui/ricash-label'
import { RicashCard } from '@/components/ui/ricash-card'
import { SafeSelect } from '@/components/ui/safe-select'
import { toast } from 'sonner'
import './CreateTransferModal.css'

export default function CreateTransferModal({ isOpen, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    expediteur: {
      nom: '',
      prenom: '',
      telephone: '',
      email: '',
      pays: 'France'
    },
    destinataire: {
      nom: '',
      prenom: '',
      telephone: '',
      email: '',
      pays: 'Sénégal'
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
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [showSummary, setShowSummary] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1)
      setErrors({})
      setIsLoading(false)
      setShowSummary(false)
      setCopiedCode(false)
    }
  }, [isOpen])

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
      fees = 5
    } else if (amount <= 500) {
      fees = 15
    } else if (amount <= 1000) {
      fees = 25
    } else if (amount <= 5000) {
      fees = 50
    } else {
      fees = 100
    }
    
    return fees
  }

  const handleAmountChange = (value) => {
    handleInputChange('transfert.montant', value)
    const fees = calculateFees(value)
    const total = parseFloat(value) + fees
    handleInputChange('transfert.frais', fees)
    handleInputChange('transfert.montantTotal', total)
  }

  const validateStep = (step) => {
    const newErrors = {}
    
    if (step === 1) {
      if (!formData.expediteur.nom.trim()) newErrors['expediteur.nom'] = 'Le nom est requis'
      if (!formData.expediteur.prenom.trim()) newErrors['expediteur.prenom'] = 'Le prénom est requis'
      if (!formData.expediteur.telephone.trim()) newErrors['expediteur.telephone'] = 'Le téléphone est requis'
      if (!formData.expediteur.email.trim()) newErrors['expediteur.email'] = 'L\'email est requis'
      if (formData.expediteur.email && !/\S+@\S+\.\S+/.test(formData.expediteur.email)) {
        newErrors['expediteur.email'] = 'Format email invalide'
    }
    } else if (step === 2) {
      if (!formData.destinataire.nom.trim()) newErrors['destinataire.nom'] = 'Le nom est requis'
      if (!formData.destinataire.prenom.trim()) newErrors['destinataire.prenom'] = 'Le prénom est requis'
      if (!formData.destinataire.telephone.trim()) newErrors['destinataire.telephone'] = 'Le téléphone est requis'
      if (!formData.destinataire.email.trim()) newErrors['destinataire.email'] = 'L\'email est requis'
      if (formData.destinataire.email && !/\S+@\S+\.\S+/.test(formData.destinataire.email)) {
        newErrors['destinataire.email'] = 'Format email invalide'
      }
    } else if (step === 3) {
      if (!formData.transfert.montant) newErrors['transfert.montant'] = 'Le montant est requis'
      if (parseFloat(formData.transfert.montant) <= 0) newErrors['transfert.montant'] = 'Le montant doit être positif'
      if (parseFloat(formData.transfert.montant) > 10000) newErrors['transfert.montant'] = 'Montant maximum: 10,000'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 3) {
        setShowSummary(true)
      } else {
        setCurrentStep(prev => Math.min(prev + 1, 3))
      }
    }
  }

  const prevStep = () => {
    if (showSummary) {
      setShowSummary(false)
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 1))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateStep(3)) return
    
    setIsLoading(true)
    
    try {
      const transferData = {
        id: `TXN${Date.now()}`,
        expediteur: formData.expediteur,
        destinataire: formData.destinataire,
        montant: parseFloat(formData.transfert.montant),
        frais: formData.transfert.frais,
        montantTotal: formData.transfert.montantTotal,
        devise: formData.transfert.devise,
        motif: formData.transfert.motif,
        urgence: formData.transfert.urgence,
        statut: 'en_attente',
        dateCreation: new Date().toISOString(),
        pays: `${formData.expediteur.pays} → ${formData.destinataire.pays}`,
        agence: { nom: 'Agence Dakar Centre', ville: 'Dakar', id: 'AGE001' },
        agent: { nom: 'Amadou Diallo', telephone: '+221 77 987 65 43', email: 'amadou.diallo@ricash.com' },
        codeRetrait: `RC${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      onCreate?.(transferData)
      toast.success('Transfert créé avec succès!', {
        description: `Code de retrait: ${transferData.codeRetrait}`,
        duration: 5000
      })
      onClose()
    } catch (error) {
      toast.error('Erreur lors de la création du transfert')
    } finally {
      setIsLoading(false)
    }
  }

  const currencies = [
    { value: 'EUR', label: 'EUR - Euro', key: 'currency-eur' },
    { value: 'XOF', label: 'XOF - Franc CFA', key: 'currency-xof' },
    { value: 'USD', label: 'USD - Dollar US', key: 'currency-usd' }
  ]

  const urgencyOptions = [
    { value: 'normal', label: 'Normal (24h)', key: 'urgency-normal' },
    { value: 'urgent', label: 'Urgent (2h)', key: 'urgency-urgent' },
    { value: 'express', label: 'Express (30min)', key: 'urgency-express' }
  ]

  const countries = [
    { value: 'France', label: 'France', key: 'country-france' },
    { value: 'Sénégal', label: 'Sénégal', key: 'country-senegal' },
    { value: 'Mali', label: 'Mali', key: 'country-mali' },
    { value: 'Côte d\'Ivoire', label: 'Côte d\'Ivoire', key: 'country-ivory-coast' }
  ]

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Expéditeur'
      case 2: return 'Destinataire'
      case 3: return 'Transfert'
      default: return ''
    }
  }

  const getStepIcon = (step) => {
    switch (step) {
      case 1: return <User className="h-4 w-4" />
      case 2: return <User className="h-4 w-4" />
      case 3: return <DollarSign className="h-4 w-4" />
      default: return null
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(true)
    toast.success('Code copié!')
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const renderSummary = () => (
    <div className="space-y-6">
      {/* Header avec animation */}
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-[#29475B] mb-2">Récapitulatif du transfert</h3>
        <p className="text-[#376470] text-sm">Vérifiez les informations avant de confirmer</p>
      </div>

      {/* Informations expéditeur */}
      <RicashCard className="p-6 border-l-4 border-l-[#2B8286]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#2B8286] flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-[#29475B]">Expéditeur</h4>
            <p className="text-sm text-[#376470]">{formData.expediteur.pays}</p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-xs text-[#376470] mb-1">Nom complet</p>
            <p className="font-medium text-[#29475B]">{formData.expediteur.prenom} {formData.expediteur.nom}</p>
          </div>
          <div>
            <p className="text-xs text-[#376470] mb-1">Téléphone</p>
            <p className="font-medium text-[#29475B]">{formData.expediteur.telephone}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs text-[#376470] mb-1">Email</p>
            <p className="font-medium text-[#29475B]">{formData.expediteur.email}</p>
          </div>
        </div>
      </RicashCard>

      {/* Flèche de transfert */}
      <div className="flex justify-center">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#2B8286] to-[#B19068] flex items-center justify-center">
          <ArrowRightLeft className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Informations destinataire */}
      <RicashCard className="p-6 border-l-4 border-l-[#B19068]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#B19068] flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-[#29475B]">Destinataire</h4>
            <p className="text-sm text-[#376470]">{formData.destinataire.pays}</p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-xs text-[#376470] mb-1">Nom complet</p>
            <p className="font-medium text-[#29475B]">{formData.destinataire.prenom} {formData.destinataire.nom}</p>
          </div>
          <div>
            <p className="text-xs text-[#376470] mb-1">Téléphone</p>
            <p className="font-medium text-[#29475B]">{formData.destinataire.telephone}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs text-[#376470] mb-1">Email</p>
            <p className="font-medium text-[#29475B]">{formData.destinataire.email}</p>
          </div>
        </div>
      </RicashCard>

      {/* Détails financiers */}
      <RicashCard className="p-6 bg-gradient-to-r from-[#2B8286]/5 to-[#B19068]/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#2B8286] flex items-center justify-center">
            <Calculator className="h-5 w-5 text-white" />
          </div>
          <h4 className="font-semibold text-[#29475B]">Détails financiers</h4>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-[#376470]">Montant à envoyer</span>
            <span className="font-semibold text-[#29475B]">{formData.transfert.montant} {formData.transfert.devise}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-[#376470]">Frais de transfert</span>
            <span className="font-semibold text-[#29475B]">{formData.transfert.frais} {formData.transfert.devise}</span>
          </div>
          <div className="flex justify-between items-center py-3 bg-[#2B8286]/10 rounded-lg px-3">
            <span className="font-semibold text-[#29475B]">Total à débiter</span>
            <span className="font-bold text-lg text-[#2B8286]">{formData.transfert.montantTotal} {formData.transfert.devise}</span>
          </div>
          {formData.transfert.motif && (
            <div className="pt-2">
              <p className="text-xs text-[#376470] mb-1">Motif</p>
              <p className="text-sm text-[#29475B] italic">"{formData.transfert.motif}"</p>
            </div>
          )}
        </div>
      </RicashCard>

      {/* Informations de sécurité */}
      <RicashCard className="p-6 bg-blue-50 border border-blue-200">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="h-5 w-5 text-blue-600" />
          <h4 className="font-semibold text-blue-800">Sécurité et suivi</h4>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-blue-700">Transfert sécurisé et crypté</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-blue-700">Délai: {urgencyOptions.find(u => u.value === formData.transfert.urgence)?.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="text-blue-700">Suivi en temps réel disponible</span>
          </div>
        </div>
      </RicashCard>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#2B8286] to-[#B19068] flex items-center justify-center">
            <ArrowRightLeft className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#29475B]">Nouveau Transfert</h2>
            <p className="text-xs text-[#376470]">Création d'un transfert d'argent</p>
          </div>
        </div>
      }
      description={showSummary ? 'Récapitulatif' : `Étape ${currentStep}/3 - ${getStepTitle()}`}
      size="custom"
      className="modal"
      actions={
        <div className="flex justify-between w-full items-center">
          <div>
            {(currentStep > 1 || showSummary) && (
              <RicashButton
                variant="outline"
                onClick={prevStep}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </RicashButton>
            )}
          </div>
          <div className="flex gap-3">
            {showSummary ? (
            <RicashButton
                onClick={handleSubmit}
              disabled={isLoading}
                className="flex items-center gap-2 min-w-[140px] bg-gradient-to-r from-[#2B8286] to-[#B19068] hover:from-[#2B8286]/90 hover:to-[#B19068]/90"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Création...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Confirmer le transfert
                  </>
                )}
            </RicashButton>
            ) : currentStep < 3 ? (
              <RicashButton
                onClick={nextStep}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </RicashButton>
            ) : (
              <RicashButton
                onClick={nextStep}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Récapitulatif
              </RicashButton>
            )}
          </div>
        </div>
      }
    >
      {showSummary ? (
        renderSummary()
      ) : (
        <>
          {/* Progress indicator optimisé pour 450px */}
          <div className="mb-6">
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                step <= currentStep 
                      ? 'bg-gradient-to-r from-[#2B8286] to-[#B19068] text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-500 border-2 border-gray-200'
              }`}>
                    {step <= currentStep ? getStepIcon(step) : step}
              </div>
              {step < 3 && (
                    <div className={`w-12 h-1 mx-2 rounded-full transition-all duration-300 ${
                  step < currentStep 
                        ? 'bg-gradient-to-r from-[#2B8286] to-[#B19068]' 
                    : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
            <div className="text-center mt-3">
              <p className="text-sm font-medium text-[#29475B]">{getStepTitle()}</p>
              <p className="text-xs text-[#376470]">
                {currentStep === 1 && "Informations de la personne qui envoie"}
                {currentStep === 2 && "Informations de la personne qui reçoit"}
                {currentStep === 3 && "Montant et détails du transfert"}
              </p>
        </div>
      </div>

          <form onSubmit={handleSubmit} className="space-y-5">
        {/* Step 1: Expéditeur */}
        {currentStep === 1 && (
              <RicashCard className="p-5 border-l-4 border-l-[#2B8286]">
            <div className="mb-5">
              <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-[#2B8286] flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#29475B]">
                  Informations expéditeur
                </h3>
                      <p className="text-sm text-[#376470]">
                        Personne qui envoie l'argent
              </p>
            </div>
                  </div>
                </div>
                
                <div className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                      <RicashLabel htmlFor="expediteur.nom" className="text-sm font-medium">Nom *</RicashLabel>
                <RicashInput
                  id="expediteur.nom"
                  value={formData.expediteur.nom}
                  onChange={(e) => handleInputChange('expediteur.nom', e.target.value)}
                  placeholder="Dupont"
                  error={errors['expediteur.nom']}
                        className="h-10"
                />
              </div>

              <div className="space-y-2">
                      <RicashLabel htmlFor="expediteur.prenom" className="text-sm font-medium">Prénom *</RicashLabel>
                <RicashInput
                  id="expediteur.prenom"
                  value={formData.expediteur.prenom}
                  onChange={(e) => handleInputChange('expediteur.prenom', e.target.value)}
                  placeholder="Jean"
                  error={errors['expediteur.prenom']}
                        className="h-10"
                />
                    </div>
              </div>

                  <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                      <RicashLabel htmlFor="expediteur.telephone" className="text-sm font-medium">Téléphone *</RicashLabel>
                <RicashInput
                  id="expediteur.telephone"
                  value={formData.expediteur.telephone}
                  onChange={(e) => handleInputChange('expediteur.telephone', e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                  error={errors['expediteur.telephone']}
                        className="h-10"
                />
              </div>

              <div className="space-y-2">
                      <RicashLabel htmlFor="expediteur.email" className="text-sm font-medium">Email *</RicashLabel>
                <RicashInput
                  id="expediteur.email"
                  type="email"
                  value={formData.expediteur.email}
                  onChange={(e) => handleInputChange('expediteur.email', e.target.value)}
                  placeholder="jean.dupont@email.com"
                  error={errors['expediteur.email']}
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <RicashLabel htmlFor="expediteur.pays" className="text-sm font-medium">Pays *</RicashLabel>
                    <SafeSelect 
                      value={formData.expediteur.pays} 
                      onValueChange={(value) => handleInputChange('expediteur.pays', value)}
                      options={countries}
                />
              </div>
            </div>
          </RicashCard>
        )}

        {/* Step 2: Destinataire */}
        {currentStep === 2 && (
              <RicashCard className="p-5 border-l-4 border-l-[#B19068]">
            <div className="mb-5">
              <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-[#B19068] flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#29475B]">
                  Informations destinataire
                </h3>
                      <p className="text-sm text-[#376470]">
                        Personne qui recevra l'argent
              </p>
            </div>
                  </div>
                </div>
                
                <div className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                      <RicashLabel htmlFor="destinataire.nom" className="text-sm font-medium">Nom *</RicashLabel>
                <RicashInput
                  id="destinataire.nom"
                  value={formData.destinataire.nom}
                  onChange={(e) => handleInputChange('destinataire.nom', e.target.value)}
                  placeholder="Martin"
                  error={errors['destinataire.nom']}
                        className="h-10"
                />
              </div>

              <div className="space-y-2">
                      <RicashLabel htmlFor="destinataire.prenom" className="text-sm font-medium">Prénom *</RicashLabel>
                <RicashInput
                  id="destinataire.prenom"
                  value={formData.destinataire.prenom}
                  onChange={(e) => handleInputChange('destinataire.prenom', e.target.value)}
                  placeholder="Marie"
                  error={errors['destinataire.prenom']}
                        className="h-10"
                />
                    </div>
              </div>

                  <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                      <RicashLabel htmlFor="destinataire.telephone" className="text-sm font-medium">Téléphone *</RicashLabel>
                <RicashInput
                  id="destinataire.telephone"
                  value={formData.destinataire.telephone}
                  onChange={(e) => handleInputChange('destinataire.telephone', e.target.value)}
                  placeholder="+221 77 123 45 67"
                  error={errors['destinataire.telephone']}
                        className="h-10"
                />
              </div>

              <div className="space-y-2">
                      <RicashLabel htmlFor="destinataire.email" className="text-sm font-medium">Email *</RicashLabel>
                <RicashInput
                  id="destinataire.email"
                  type="email"
                  value={formData.destinataire.email}
                  onChange={(e) => handleInputChange('destinataire.email', e.target.value)}
                  placeholder="marie.martin@email.com"
                        error={errors['destinataire.email']}
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <RicashLabel htmlFor="destinataire.pays" className="text-sm font-medium">Pays *</RicashLabel>
                    <SafeSelect 
                      value={formData.destinataire.pays} 
                      onValueChange={(value) => handleInputChange('destinataire.pays', value)}
                      options={countries}
                />
              </div>
            </div>
          </RicashCard>
        )}

        {/* Step 3: Détails du transfert */}
        {currentStep === 3 && (
              <div className="space-y-6">
                <RicashCard className="p-5 border-l-4 border-l-[#2B8286]">
            <div className="mb-5">
              <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-[#2B8286] flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[#29475B]">
                  Détails du transfert
                </h3>
                        <p className="text-sm text-[#376470]">
                          Montant et informations du transfert
              </p>
            </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                        <RicashLabel htmlFor="transfert.montant" className="text-sm font-medium">Montant à envoyer *</RicashLabel>
                  <RicashInput
                    id="transfert.montant"
                    type="number"
                    step="0.01"
                    value={formData.transfert.montant}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="500.00"
                    error={errors['transfert.montant']}
                          className="h-10"
                  />
                </div>

                <div className="space-y-2">
                        <RicashLabel htmlFor="transfert.devise" className="text-sm font-medium">Devise</RicashLabel>
                  <SafeSelect 
                    value={formData.transfert.devise} 
                    onValueChange={(value) => handleInputChange('transfert.devise', value)}
                    options={currencies}
                  />
                      </div>
                </div>

                    <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                        <RicashLabel htmlFor="transfert.frais" className="text-sm font-medium">Frais de transfert</RicashLabel>
                    <RicashInput
                      id="transfert.frais"
                      value={`${formData.transfert.frais} ${formData.transfert.devise}`}
                      disabled
                          className="h-11 bg-gray-50 text-gray-600"
                    />
                </div>

                <div className="space-y-2">
                        <RicashLabel htmlFor="transfert.montantTotal" className="text-sm font-medium">Total à débiter</RicashLabel>
                    <RicashInput
                      id="transfert.montantTotal"
                      value={`${formData.transfert.montantTotal} ${formData.transfert.devise}`}
                      disabled
                          className="h-11 bg-[#2B8286]/10 text-[#29475B] font-semibold"
                    />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <RicashLabel htmlFor="transfert.urgence" className="text-sm font-medium">Délai de traitement</RicashLabel>
                      <SafeSelect 
                        value={formData.transfert.urgence} 
                        onValueChange={(value) => handleInputChange('transfert.urgence', value)}
                        options={urgencyOptions}
                      />
              </div>

              <div className="space-y-2">
                      <RicashLabel htmlFor="transfert.motif" className="text-sm font-medium">Motif (optionnel)</RicashLabel>
                <RicashTextarea
                  id="transfert.motif"
                  value={formData.transfert.motif}
                  onChange={(e) => handleInputChange('transfert.motif', e.target.value)}
                        placeholder="Frais médicaux, aide familiale, paiement de facture..."
                  rows={3}
                        className="resize-none"
                />
              </div>
            </div>
          </RicashCard>

                {/* Informations importantes */}
                <RicashCard className="p-4 bg-blue-50 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-800 mb-1">Informations importantes</p>
                      <ul className="text-blue-700 space-y-1 text-xs">
                        <li>• Le destinataire recevra un SMS avec le code de retrait</li>
                        <li>• Les frais sont calculés automatiquement selon le montant</li>
                        <li>• Le transfert sera traité selon le délai choisi</li>
                        <li>• Vous recevrez une confirmation par email</li>
                      </ul>
                    </div>
                  </div>
                </RicashCard>
              </div>
        )}
      </form>
        </>
      )}
    </BaseModal>
  )
}