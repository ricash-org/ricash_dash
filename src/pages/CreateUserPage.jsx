import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Shield,
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

export default function CreateUserPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    dateNaissance: '',
    cni: '',
    adresse: '',
    pays: 'Sénégal',
    ville: '',
    profession: '',
    revenuMensuel: 0,
    sourceRevenu: 'Salaire',
    statut: 'actif',
    limiteMensuelle: 1000000,
    preferences: {
      notifications: true,
      sms: true,
      email: true
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

  const validateStep = (step) => {
    const newErrors = {}
    
    if (step === 1) {
      if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis'
      if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis'
      if (!formData.telephone.trim()) newErrors.telephone = 'Le téléphone est requis'
      if (!formData.email.trim()) newErrors.email = 'L\'email est requis'
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Format email invalide'
      }
    } else if (step === 2) {
      if (!formData.dateNaissance.trim()) newErrors.dateNaissance = 'La date de naissance est requise'
      if (!formData.cni.trim()) newErrors.cni = 'Le numéro CNI est requis'
      if (!formData.adresse.trim()) newErrors.adresse = 'L\'adresse est requise'
      if (!formData.ville.trim()) newErrors.ville = 'La ville est requise'
    } else if (step === 3) {
      if (!formData.profession.trim()) newErrors.profession = 'La profession est requise'
      if (!formData.revenuMensuel || formData.revenuMensuel <= 0) {
        newErrors.revenuMensuel = 'Le revenu mensuel doit être positif'
      }
      if (!formData.limiteMensuelle || formData.limiteMensuelle <= 0) {
        newErrors.limiteMensuelle = 'La limite mensuelle doit être positive'
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
    
    setIsLoading(true)
    
    try {
      const userData = {
        id: `USR${Date.now()}`,
        ...formData,
        dateCreation: new Date().toISOString(),
        solde: 0,
        transactions: [],
        kyc: {
          statut: 'en_attente',
          documents: [],
          dateValidation: null
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Utilisateur créé avec succès!', {
        description: `ID: ${userData.id}`,
        duration: 5000
      })
      
      navigate('/app/users')
    } catch (error) {
      toast.error('Erreur lors de la création de l\'utilisateur')
    } finally {
      setIsLoading(false)
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Informations personnelles'
      case 2: return 'Informations d\'identité'
      case 3: return 'Informations financières'
      default: return ''
    }
  }

  const getStepIcon = (step) => {
    switch (step) {
      case 1: return <User className="h-4 w-4" />
      case 2: return <Shield className="h-4 w-4" />
      case 3: return <DollarSign className="h-4 w-4" />
      default: return null
    }
  }

  const pays = [
    { value: 'Sénégal', label: 'Sénégal', key: 'country-senegal' },
    { value: 'France', label: 'France', key: 'country-france' },
    { value: 'Mali', label: 'Mali', key: 'country-mali' },
    { value: 'Côte d\'Ivoire', label: 'Côte d\'Ivoire', key: 'country-ivory-coast' }
  ]

  const sourcesRevenu = [
    { value: 'Salaire', label: 'Salaire', key: 'source-salaire' },
    { value: 'Commerce', label: 'Commerce', key: 'source-commerce' },
    { value: 'Agriculture', label: 'Agriculture', key: 'source-agriculture' },
    { value: 'Pension', label: 'Pension', key: 'source-pension' },
    { value: 'Autre', label: 'Autre', key: 'source-autre' }
  ]

  const ErrorMessage = ({ error }) => {
    if (!error) return null
    return <div className="text-red-500 text-xs mt-1">{error}</div>
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
              Créer un nouvel utilisateur
            </h1>
            <div className="text-[#376470]">Étape {currentStep}/3 - {getStepTitle()}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <RicashButton variant="outline" onClick={() => navigate('/app/users')}>
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
                {step <= currentStep ? getStepIcon(step) : step}
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
            {currentStep === 1 && "Informations personnelles de l'utilisateur"}
            {currentStep === 2 && "Documents d'identité et adresse"}
            {currentStep === 3 && "Situation financière et limites"}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Informations personnelles */}
        {currentStep === 1 && (
          <RicashCard className="p-6 border-l-4 border-l-[#2B8286]">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#2B8286] flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#29475B]">
                    Informations personnelles
                  </h3>
                  <div className="text-sm text-[#376470]">
                    Données personnelles de l'utilisateur
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <RicashLabel htmlFor="nom" className="text-sm font-medium">Nom *</RicashLabel>
                  <RicashInput
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => handleInputChange('nom', e.target.value)}
                    placeholder="Entrez le nom"
                    className={errors.nom ? 'border-red-500' : ''}
                  />
                  <ErrorMessage error={errors.nom} />
                </div>
                
                <div className="space-y-2">
                  <RicashLabel htmlFor="prenom" className="text-sm font-medium">Prénom *</RicashLabel>
                  <RicashInput
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => handleInputChange('prenom', e.target.value)}
                    placeholder="Entrez le prénom"
                    className={errors.prenom ? 'border-red-500' : ''}
                  />
                  <ErrorMessage error={errors.prenom} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <RicashLabel htmlFor="telephone" className="text-sm font-medium">Téléphone *</RicashLabel>
                  <RicashInput
                    id="telephone"
                    value={formData.telephone}
                    onChange={(e) => handleInputChange('telephone', e.target.value)}
                    placeholder="+221 XX XXX XX XX"
                    className={errors.telephone ? 'border-red-500' : ''}
                  />
                  <ErrorMessage error={errors.telephone} />
                </div>
                
                <div className="space-y-2">
                  <RicashLabel htmlFor="email" className="text-sm font-medium">Email *</RicashLabel>
                  <RicashInput
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="exemple@email.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  <ErrorMessage error={errors.email} />
                </div>
              </div>

              <div className="space-y-2">
                <RicashLabel htmlFor="dateNaissance" className="text-sm font-medium">Date de naissance *</RicashLabel>
                <RicashInput
                  id="dateNaissance"
                  type="date"
                  value={formData.dateNaissance}
                  onChange={(e) => handleInputChange('dateNaissance', e.target.value)}
                  className={errors.dateNaissance ? 'border-red-500' : ''}
                />
                <ErrorMessage error={errors.dateNaissance} />
              </div>
            </div>
          </RicashCard>
        )}

        {/* Step 2: Informations d'identité */}
        {currentStep === 2 && (
          <RicashCard className="p-6 border-l-4 border-l-[#B19068]">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#B19068] flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#29475B]">
                    Informations d'identité
                  </h3>
                  <div className="text-sm text-[#376470]">
                    Documents d'identité et adresse
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <RicashLabel htmlFor="cni" className="text-sm font-medium">Numéro CNI *</RicashLabel>
                  <RicashInput
                    id="cni"
                    value={formData.cni}
                    onChange={(e) => handleInputChange('cni', e.target.value)}
                    placeholder="1234567890"
                    className={errors.cni ? 'border-red-500' : ''}
                  />
                  <ErrorMessage error={errors.cni} />
                </div>
                
                <div className="space-y-2">
                  <RicashLabel htmlFor="pays" className="text-sm font-medium">Pays</RicashLabel>
                  <SafeSelect
                    value={formData.pays}
                    onValueChange={(value) => handleInputChange('pays', value)}
                    options={pays}
                    placeholder="Sélectionnez un pays"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <RicashLabel htmlFor="adresse" className="text-sm font-medium">Adresse complète *</RicashLabel>
                <RicashTextarea
                  id="adresse"
                  value={formData.adresse}
                  onChange={(e) => handleInputChange('adresse', e.target.value)}
                  placeholder="Entrez l'adresse complète"
                  rows={3}
                  className={errors.adresse ? 'border-red-500' : ''}
                />
                <ErrorMessage error={errors.adresse} />
              </div>

              <div className="space-y-2">
                <RicashLabel htmlFor="ville" className="text-sm font-medium">Ville *</RicashLabel>
                <RicashInput
                  id="ville"
                  value={formData.ville}
                  onChange={(e) => handleInputChange('ville', e.target.value)}
                  placeholder="Entrez la ville"
                  className={errors.ville ? 'border-red-500' : ''}
                />
                <ErrorMessage error={errors.ville} />
              </div>
            </div>
          </RicashCard>
        )}

        {/* Step 3: Informations financières */}
        {currentStep === 3 && (
          <RicashCard className="p-6 border-l-4 border-l-[#2B8286]">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#2B8286] flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#29475B]">
                    Informations financières
                  </h3>
                  <div className="text-sm text-[#376470]">
                    Situation financière et limites
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <RicashLabel htmlFor="profession" className="text-sm font-medium">Profession *</RicashLabel>
                  <RicashInput
                    id="profession"
                    value={formData.profession}
                    onChange={(e) => handleInputChange('profession', e.target.value)}
                    placeholder="Entrez la profession"
                    className={errors.profession ? 'border-red-500' : ''}
                  />
                  <ErrorMessage error={errors.profession} />
                </div>
                
                <div className="space-y-2">
                  <RicashLabel htmlFor="sourceRevenu" className="text-sm font-medium">Source de revenu</RicashLabel>
                  <SafeSelect
                    value={formData.sourceRevenu}
                    onValueChange={(value) => handleInputChange('sourceRevenu', value)}
                    options={sourcesRevenu}
                    placeholder="Sélectionnez une source"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <RicashLabel htmlFor="revenuMensuel" className="text-sm font-medium">Revenu mensuel (FCFA) *</RicashLabel>
                  <RicashInput
                    id="revenuMensuel"
                    type="number"
                    value={formData.revenuMensuel}
                    onChange={(e) => handleInputChange('revenuMensuel', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className={errors.revenuMensuel ? 'border-red-500' : ''}
                  />
                  <ErrorMessage error={errors.revenuMensuel} />
                </div>
                
                <div className="space-y-2">
                  <RicashLabel htmlFor="limiteMensuelle" className="text-sm font-medium">Limite mensuelle (FCFA) *</RicashLabel>
                  <RicashInput
                    id="limiteMensuelle"
                    type="number"
                    value={formData.limiteMensuelle}
                    onChange={(e) => handleInputChange('limiteMensuelle', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className={errors.limiteMensuelle ? 'border-red-500' : ''}
                  />
                  <ErrorMessage error={errors.limiteMensuelle} />
                </div>
              </div>

              <div className="border-t pt-5">
                <h4 className="text-md font-semibold text-[#29475B] mb-4">Préférences de notification</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="notifications"
                      checked={formData.preferences.notifications}
                      onChange={(e) => handleInputChange('preferences.notifications', e.target.checked)}
                      className="rounded border-gray-300 text-[#2B8286] focus:ring-[#2B8286]"
                    />
                    <RicashLabel htmlFor="notifications" className="text-sm">Notifications générales</RicashLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="sms"
                      checked={formData.preferences.sms}
                      onChange={(e) => handleInputChange('preferences.sms', e.target.checked)}
                      className="rounded border-gray-300 text-[#2B8286] focus:ring-[#2B8286]"
                    />
                    <RicashLabel htmlFor="sms" className="text-sm">Notifications SMS</RicashLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="email"
                      checked={formData.preferences.email}
                      onChange={(e) => handleInputChange('preferences.email', e.target.checked)}
                      className="rounded border-gray-300 text-[#2B8286] focus:ring-[#2B8286]"
                    />
                    <RicashLabel htmlFor="email" className="text-sm">Notifications email</RicashLabel>
                  </div>
                </div>
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
                    Créer l'utilisateur
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