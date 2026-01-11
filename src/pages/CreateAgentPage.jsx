import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft,
  User,
  Phone,
  Mail,
  Building2,
  Calendar,
  MapPin,
  Award,
  DollarSign,
  Shield,
  FileText,
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

export default function CreateAgentPage() {
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
    poste: 'Agent Caissier',
    niveau: 'Débutant',
    agence: {
      id: '',
      nom: '',
      ville: ''
    },
    salaire: 250000,
    emergencyContact: {
      nom: '',
      telephone: ''
    },
    competences: [],
    certifications: []
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
      if (!formData.agence.id) newErrors['agence.id'] = 'L\'agence est requise'
    } else if (step === 3) {
      if (!formData.salaire || formData.salaire <= 0) {
        newErrors.salaire = 'Le salaire doit être positif'
      }
      if (!formData.emergencyContact.nom.trim()) {
        newErrors['emergencyContact.nom'] = 'Le nom du contact d\'urgence est requis'
      }
      if (!formData.emergencyContact.telephone.trim()) {
        newErrors['emergencyContact.telephone'] = 'Le téléphone du contact d\'urgence est requis'
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
      const agentData = {
        id: `AGT${Date.now()}`,
        ...formData,
        statut: 'actif',
        dateEmbauche: new Date().toISOString(),
        performance: {
          transactions: 0,
          chiffreAffaires: 0,
          commission: 0,
          note: 0
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Agent créé avec succès!', {
        description: `ID: ${agentData.id}`,
        duration: 5000
      })
      
      navigate('/app/agents')
    } catch (error) {
      toast.error('Erreur lors de la création de l\'agent')
    } finally {
    setIsLoading(false)
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Informations personnelles'
      case 2: return 'Informations professionnelles'
      case 3: return 'Configuration'
      default: return ''
    }
  }

  const getStepIcon = (step) => {
    switch (step) {
      case 1: return <User className="h-4 w-4" />
      case 2: return <Building2 className="h-4 w-4" />
      case 3: return <DollarSign className="h-4 w-4" />
      default: return null
    }
  }

  const agencies = [
    { value: 'AGE001', label: 'Agence Dakar Centre - Dakar', key: 'agency-001' },
    { value: 'AGE002', label: 'Agence Thiès Centre - Thiès', key: 'agency-002' },
    { value: 'AGE003', label: 'Agence Saint-Louis - Saint-Louis', key: 'agency-003' },
    { value: 'AGE004', label: 'Agence Kaolack - Kaolack', key: 'agency-004' }
  ]

  const posts = [
    { value: 'Agent Caissier', label: 'Agent Caissier', key: 'post-caissier' },
    { value: 'Agent Commercial', label: 'Agent Commercial', key: 'post-commercial' },
    { value: 'Superviseur', label: 'Superviseur', key: 'post-superviseur' },
    { value: 'Gestionnaire', label: 'Gestionnaire', key: 'post-gestionnaire' }
  ]

  const niveaux = [
    { value: 'Débutant', label: 'Débutant', key: 'niveau-debutant' },
    { value: 'Intermédiaire', label: 'Intermédiaire', key: 'niveau-intermediaire' },
    { value: 'Avancé', label: 'Avancé', key: 'niveau-avance' },
    { value: 'Expert', label: 'Expert', key: 'niveau-expert' }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <RicashButton
            variant="outline"
            onClick={() => navigate('/app/agents')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux agents
          </RicashButton>
          <div>
            <h1 className="text-3xl font-bold text-[#29475B]">
              Créer un nouvel agent
            </h1>
            <p className="text-[#376470]">Étape {currentStep}/3 - {getStepTitle()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <RicashButton variant="outline" onClick={() => navigate('/app/agents')}>
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
            {currentStep === 1 && "Informations personnelles de l'agent"}
            {currentStep === 2 && "Poste et affectation à l'agence"}
            {currentStep === 3 && "Salaire et contact d'urgence"}
          </p>
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
                  <p className="text-sm text-[#376470]">
                    Données personnelles de l'agent
                  </p>
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
                    placeholder="Diallo"
                    error={errors.nom}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <RicashLabel htmlFor="prenom" className="text-sm font-medium">Prénom *</RicashLabel>
                  <RicashInput
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => handleInputChange('prenom', e.target.value)}
                    placeholder="Amadou"
                    error={errors.prenom}
                    className="h-10"
                  />
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <RicashLabel htmlFor="telephone" className="text-sm font-medium">Téléphone *</RicashLabel>
                <RicashInput
                    id="telephone"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
                    placeholder="+221 77 987 65 43"
                    error={errors.telephone}
                    className="h-10"
                />
              </div>
              
                <div className="space-y-2">
                  <RicashLabel htmlFor="email" className="text-sm font-medium">Email *</RicashLabel>
                <RicashInput
                    id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="amadou.diallo@ricash.com"
                    error={errors.email}
                    className="h-10"
                />
              </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <RicashLabel htmlFor="dateNaissance" className="text-sm font-medium">Date de naissance *</RicashLabel>
                  <RicashInput
                    id="dateNaissance"
                    type="date"
                    value={formData.dateNaissance}
                    onChange={(e) => handleInputChange('dateNaissance', e.target.value)}
                    error={errors.dateNaissance}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <RicashLabel htmlFor="cni" className="text-sm font-medium">Numéro CNI *</RicashLabel>
                  <RicashInput
                    id="cni"
                    value={formData.cni}
                    onChange={(e) => handleInputChange('cni', e.target.value)}
                    placeholder="1234567890123"
                    error={errors.cni}
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
                  placeholder="123 Rue de la République, Plateau, Dakar"
                  error={errors.adresse}
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>
          </RicashCard>
        )}

        {/* Step 2: Informations professionnelles */}
        {currentStep === 2 && (
          <RicashCard className="p-6 border-l-4 border-l-[#B19068]">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#B19068] flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#29475B]">
              Informations professionnelles
            </h3>
                  <p className="text-sm text-[#376470]">
                    Poste et affectation
                  </p>
                </div>
              </div>
              </div>
              
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <RicashLabel htmlFor="poste" className="text-sm font-medium">Poste</RicashLabel>
                  <SafeSelect 
                  value={formData.poste}
                    onValueChange={(value) => handleInputChange('poste', value)}
                    options={posts}
                  />
              </div>
              
                <div className="space-y-2">
                  <RicashLabel htmlFor="niveau" className="text-sm font-medium">Niveau d'expérience</RicashLabel>
                  <SafeSelect 
                  value={formData.niveau}
                    onValueChange={(value) => handleInputChange('niveau', value)}
                    options={niveaux}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <RicashLabel htmlFor="agence.id" className="text-sm font-medium">Agence d'affectation *</RicashLabel>
                <SafeSelect 
                  value={formData.agence.id} 
                  onValueChange={(value) => {
                    const selectedAgency = agencies.find(a => a.value === value)
                    handleInputChange('agence.id', value)
                    handleInputChange('agence.nom', selectedAgency?.label.split(' - ')[0] || '')
                    handleInputChange('agence.ville', selectedAgency?.label.split(' - ')[1] || '')
                  }}
                  options={agencies}
                  error={errors['agence.id']}
                />
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
                    Configuration et contact d'urgence
                  </h3>
                  <p className="text-sm text-[#376470]">
                    Salaire et informations d'urgence
                  </p>
                </div>
              </div>
              </div>
              
            <div className="space-y-5">
              <div className="space-y-2">
                <RicashLabel htmlFor="salaire" className="text-sm font-medium">Salaire mensuel (FCFA) *</RicashLabel>
                <RicashInput
                  id="salaire"
                  type="number"
                  value={formData.salaire}
                  onChange={(e) => handleInputChange('salaire', parseFloat(e.target.value))}
                  placeholder="250000"
                  error={errors.salaire}
                  className="h-10"
                />
              </div>

              <div className="border-t pt-5">
                <h4 className="text-base font-semibold text-[#29475B] mb-4 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Contact d'urgence
                </h4>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <RicashLabel htmlFor="emergencyContact.nom" className="text-sm font-medium">Nom du contact *</RicashLabel>
                    <RicashInput
                      id="emergencyContact.nom"
                      value={formData.emergencyContact.nom}
                      onChange={(e) => handleInputChange('emergencyContact.nom', e.target.value)}
                      placeholder="Fatou Diallo"
                      error={errors['emergencyContact.nom']}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <RicashLabel htmlFor="emergencyContact.telephone" className="text-sm font-medium">Téléphone du contact *</RicashLabel>
                    <RicashInput
                      id="emergencyContact.telephone"
                      value={formData.emergencyContact.telephone}
                      onChange={(e) => handleInputChange('emergencyContact.telephone', e.target.value)}
                      placeholder="+221 77 123 45 67"
                      error={errors['emergencyContact.telephone']}
                      className="h-10"
                    />
                  </div>
                </div>
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
                    Créer l'agent
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