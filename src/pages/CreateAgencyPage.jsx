import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  User,
  Clock,
  DollarSign,
  Navigation,
  Upload,
  Plus,
  X,
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

export default function CreateAgencyPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    nom: '',
    ville: '',
    quartier: '',
    adresse: '',
    telephone: '',
    email: '',
    typeAgence: 'secondaire',
    responsable: {
      nom: '',
      telephone: '',
      email: ''
    },
    horaires: '08:00-18:00',
    limiteJournaliere: 200000,
    commission: 2.0,
    coordonnees: {
      latitude: '',
      longitude: ''
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
      if (!formData.nom.trim()) newErrors.nom = 'Le nom de l\'agence est requis'
      if (!formData.ville.trim()) newErrors.ville = 'La ville est requise'
      if (!formData.quartier.trim()) newErrors.quartier = 'Le quartier est requis'
      if (!formData.adresse.trim()) newErrors.adresse = 'L\'adresse est requise'
    } else if (step === 2) {
      if (!formData.telephone.trim()) newErrors.telephone = 'Le téléphone est requis'
      if (!formData.email.trim()) newErrors.email = 'L\'email est requis'
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Format email invalide'
      }
      if (!formData.responsable.nom.trim()) newErrors['responsable.nom'] = 'Le nom du responsable est requis'
      if (!formData.responsable.telephone.trim()) newErrors['responsable.telephone'] = 'Le téléphone du responsable est requis'
      if (!formData.responsable.email.trim()) newErrors['responsable.email'] = 'L\'email du responsable est requis'
    } else if (step === 3) {
      if (!formData.limiteJournaliere || formData.limiteJournaliere <= 0) {
        newErrors.limiteJournaliere = 'La limite journalière doit être positive'
      }
      if (!formData.commission || formData.commission <= 0) {
        newErrors.commission = 'La commission doit être positive'
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
      const agencyData = {
        id: `AGE${Date.now()}`,
        ...formData,
        statut: 'active',
        dateCreation: new Date().toISOString(),
        agents: [],
        transactions: []
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Agence créée avec succès!', {
        description: `ID: ${agencyData.id}`,
        duration: 5000
      })
      
      navigate('/app/agencies')
    } catch (error) {
      toast.error('Erreur lors de la création de l\'agence')
    } finally {
      setIsLoading(false)
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Informations générales'
      case 2: return 'Contact et responsable'
      case 3: return 'Configuration'
      default: return ''
    }
  }

  const getStepIcon = (step) => {
    switch (step) {
      case 1: return <Building2 className="h-4 w-4" />
      case 2: return <User className="h-4 w-4" />
      case 3: return <DollarSign className="h-4 w-4" />
      default: return null
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <RicashButton
            variant="outline"
            onClick={() => navigate('/app/agencies')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux agences
          </RicashButton>
          <div>
            <h1 className="text-3xl font-bold text-[#29475B]">
              Créer une nouvelle agence
            </h1>
            <p className="text-[#376470]">Étape {currentStep}/3 - {getStepTitle()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <RicashButton variant="outline" onClick={() => navigate('/app/agencies')}>
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
          <p className="text-base font-medium text-[#29475B]">{getStepTitle()}</p>
          <p className="text-sm text-[#376470]">
            {currentStep === 1 && "Informations de base de l'agence"}
            {currentStep === 2 && "Coordonnées et responsable"}
            {currentStep === 3 && "Paramètres financiers et limites"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Informations générales */}
        {currentStep === 1 && (
          <RicashCard className="p-6 border-l-4 border-l-[#2B8286]">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#2B8286] flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#29475B]">
                    Informations générales
                  </h3>
                  <p className="text-sm text-[#376470]">
                    Données de base de l'agence
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <RicashLabel htmlFor="nom" className="text-sm font-medium">Nom de l'agence *</RicashLabel>
                  <RicashInput
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => handleInputChange('nom', e.target.value)}
                    placeholder="Agence Dakar Centre"
                    error={errors.nom}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <RicashLabel htmlFor="typeAgence" className="text-sm font-medium">Type d'agence</RicashLabel>
                  <SafeSelect 
                    value={formData.typeAgence} 
                    onValueChange={(value) => handleInputChange('typeAgence', value)}
                    options={[
                      { value: 'principale', label: 'Principale', key: 'type-principale' },
                      { value: 'secondaire', label: 'Secondaire', key: 'type-secondaire' },
                      { value: 'mobile', label: 'Mobile', key: 'type-mobile' }
                    ]}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <RicashLabel htmlFor="ville" className="text-sm font-medium">Ville *</RicashLabel>
                  <RicashInput
                    id="ville"
                    value={formData.ville}
                    onChange={(e) => handleInputChange('ville', e.target.value)}
                    placeholder="Dakar"
                    error={errors.ville}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <RicashLabel htmlFor="quartier" className="text-sm font-medium">Quartier *</RicashLabel>
                  <RicashInput
                    id="quartier"
                    value={formData.quartier}
                    onChange={(e) => handleInputChange('quartier', e.target.value)}
                    placeholder="Plateau"
                    error={errors.quartier}
                    className="h-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <RicashLabel htmlFor="adresse" className="text-sm font-medium">Adresse complète *</RicashLabel>
                <RicashTextarea
                  id="adresse"
                  value={formData.adresse}
                  onChange={(e) => handleInputChange('adresse', e.target.value)}
                  placeholder="123 Avenue Léopold Sédar Senghor, Plateau, Dakar"
                  error={errors.adresse}
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <RicashLabel htmlFor="horaires" className="text-sm font-medium">Horaires d'ouverture</RicashLabel>
                  <RicashInput
                    id="horaires"
                    value={formData.horaires}
                    onChange={(e) => handleInputChange('horaires', e.target.value)}
                    placeholder="08:00-18:00"
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <RicashLabel htmlFor="latitude" className="text-sm font-medium">Latitude (optionnel)</RicashLabel>
                  <RicashInput
                    id="latitude"
                    value={formData.coordonnees.latitude}
                    onChange={(e) => handleInputChange('coordonnees.latitude', e.target.value)}
                    placeholder="14.7167"
                    className="h-10"
                  />
                </div>
              </div>
            </div>
          </RicashCard>
        )}

        {/* Step 2: Contact et responsable */}
        {currentStep === 2 && (
          <RicashCard className="p-6 border-l-4 border-l-[#B19068]">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#B19068] flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#29475B]">
                    Contact et responsable
                  </h3>
                  <p className="text-sm text-[#376470]">
                    Coordonnées de l'agence et du responsable
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <RicashLabel htmlFor="telephone" className="text-sm font-medium">Téléphone agence *</RicashLabel>
                  <RicashInput
                    id="telephone"
                    value={formData.telephone}
                    onChange={(e) => handleInputChange('telephone', e.target.value)}
                    placeholder="+221 33 123 45 67"
                    error={errors.telephone}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <RicashLabel htmlFor="email" className="text-sm font-medium">Email agence *</RicashLabel>
                  <RicashInput
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="contact@agence-dakar.com"
                    error={errors.email}
                    className="h-10"
                  />
                </div>
              </div>

              <div className="border-t pt-5">
                <h4 className="text-base font-semibold text-[#29475B] mb-4 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Responsable de l'agence
                </h4>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <RicashLabel htmlFor="responsable.nom" className="text-sm font-medium">Nom du responsable *</RicashLabel>
                    <RicashInput
                      id="responsable.nom"
                      value={formData.responsable.nom}
                      onChange={(e) => handleInputChange('responsable.nom', e.target.value)}
                      placeholder="Amadou Diallo"
                      error={errors['responsable.nom']}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <RicashLabel htmlFor="responsable.telephone" className="text-sm font-medium">Téléphone responsable *</RicashLabel>
                    <RicashInput
                      id="responsable.telephone"
                      value={formData.responsable.telephone}
                      onChange={(e) => handleInputChange('responsable.telephone', e.target.value)}
                      placeholder="+221 77 987 65 43"
                      error={errors['responsable.telephone']}
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="space-y-2">
                    <RicashLabel htmlFor="responsable.email" className="text-sm font-medium">Email responsable *</RicashLabel>
                    <RicashInput
                      id="responsable.email"
                      type="email"
                      value={formData.responsable.email}
                      onChange={(e) => handleInputChange('responsable.email', e.target.value)}
                      placeholder="amadou.diallo@agence-dakar.com"
                      error={errors['responsable.email']}
                      className="h-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </RicashCard>
        )}

        {/* Step 3: Configuration */}
        {currentStep === 3 && (
          <RicashCard className="p-6 border-l-4 border-l-[#2B8286]">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#2B8286] flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#29475B]">
                    Configuration financière
                  </h3>
                  <p className="text-sm text-[#376470]">
                    Limites et paramètres financiers
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <RicashLabel htmlFor="limiteJournaliere" className="text-sm font-medium">Limite journalière (€) *</RicashLabel>
                  <RicashInput
                    id="limiteJournaliere"
                    type="number"
                    value={formData.limiteJournaliere}
                    onChange={(e) => handleInputChange('limiteJournaliere', parseFloat(e.target.value))}
                    placeholder="200000"
                    error={errors.limiteJournaliere}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <RicashLabel htmlFor="commission" className="text-sm font-medium">Commission (%) *</RicashLabel>
                  <RicashInput
                    id="commission"
                    type="number"
                    step="0.1"
                    value={formData.commission}
                    onChange={(e) => handleInputChange('commission', parseFloat(e.target.value))}
                    placeholder="2.0"
                    error={errors.commission}
                    className="h-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <RicashLabel htmlFor="longitude" className="text-sm font-medium">Longitude (optionnel)</RicashLabel>
                <RicashInput
                  id="longitude"
                  value={formData.coordonnees.longitude}
                  onChange={(e) => handleInputChange('coordonnees.longitude', e.target.value)}
                  placeholder="-17.4677"
                  className="h-10"
                />
              </div>
            </div>
          </RicashCard>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-6 border-t">
          <div>
            {currentStep > 1 && (
              <RicashButton
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
                onClick={nextStep}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                Suivant
              </RicashButton>
            ) : (
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
                    Créer l'agence
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