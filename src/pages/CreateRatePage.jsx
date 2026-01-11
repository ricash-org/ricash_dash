import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft,
  Save,
  DollarSign,
  Euro,
  PoundSterling,
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  CheckCircle,
  Settings,
  Building2,
  Calculator,
  BarChart3
} from 'lucide-react'
import { RicashButton } from '@/components/ui/ricash-button'
import { RicashCard } from '@/components/ui/ricash-card'
import { RicashInput } from '@/components/ui/ricash-input'
import { RicashLabel } from '@/components/ui/ricash-label'
import { RicashSelect } from '@/components/ui/ricash-input'
import { RicashTextarea } from '@/components/ui/ricash-textarea'
import { toast } from 'sonner'

const devises = [
  { value: 'EUR', label: 'EUR - Euro', icon: Euro },
  { value: 'USD', label: 'USD - Dollar US', icon: DollarSign },
  { value: 'GBP', label: 'GBP - Livre Sterling', icon: PoundSterling },
  { value: 'JPY', label: 'JPY - Yen Japonais', icon: Activity },
  { value: 'XOF', label: 'XOF - Franc CFA', icon: Activity },
  { value: 'CAD', label: 'CAD - Dollar Canadien', icon: DollarSign },
  { value: 'CHF', label: 'CHF - Franc Suisse', icon: DollarSign },
  { value: 'AUD', label: 'AUD - Dollar Australien', icon: DollarSign }
]

const sources = [
  { value: 'BCEAO', label: 'BCEAO - Banque Centrale des États de l\'Afrique de l\'Ouest' },
  { value: 'ECB', label: 'ECB - Banque Centrale Européenne' },
  { value: 'FED', label: 'FED - Réserve Fédérale Américaine' },
  { value: 'BOE', label: 'BOE - Banque d\'Angleterre' },
  { value: 'MANUAL', label: 'Saisie manuelle' },
  { value: 'API', label: 'API externe' }
]

const CreateRatePage = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    deviseBase: '',
    deviseCible: '',
    tauxAchat: '',
    tauxVente: '',
    source: 'BCEAO',
    limiteMin: '',
    limiteMax: '',
    commission: '',
    commentaires: ''
  })

  const [errors, setErrors] = useState({})

  const validateStep = (step) => {
    const newErrors = {}
    
    if (step === 1) {
      if (!formData.deviseBase) newErrors.deviseBase = 'Devise de base requise'
      if (!formData.deviseCible) newErrors.deviseCible = 'Devise cible requise'
      if (formData.deviseBase === formData.deviseCible) {
        newErrors.deviseCible = 'La devise cible doit être différente de la devise de base'
      }
    }
    
    if (step === 2) {
      if (!formData.tauxAchat) newErrors.tauxAchat = 'Taux d\'achat requis'
      if (!formData.tauxVente) newErrors.tauxVente = 'Taux de vente requis'
      if (formData.tauxAchat && formData.tauxVente && parseFloat(formData.tauxAchat) >= parseFloat(formData.tauxVente)) {
        newErrors.tauxVente = 'Le taux de vente doit être supérieur au taux d\'achat'
      }
    }
    
    if (step === 3) {
      if (!formData.limiteMin) newErrors.limiteMin = 'Limite minimale requise'
      if (!formData.limiteMax) newErrors.limiteMax = 'Limite maximale requise'
      if (formData.limiteMin && formData.limiteMax && parseFloat(formData.limiteMin) >= parseFloat(formData.limiteMax)) {
        newErrors.limiteMax = 'La limite maximale doit être supérieure à la limite minimale'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return
    
    setIsLoading(true)
    try {
      // Simuler l'envoi des données
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Taux de change créé avec succès!')
      navigate('/app/settings/rates')
    } catch (error) {
      toast.error('Erreur lors de la création du taux de change')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getDeviseIcon = (devise) => {
    const deviseObj = devises.find(d => d.value === devise)
    return deviseObj ? deviseObj.icon : Activity
  }

  const calculateSpread = () => {
    if (formData.tauxAchat && formData.tauxVente) {
      const achat = parseFloat(formData.tauxAchat)
      const vente = parseFloat(formData.tauxVente)
      if (achat > 0) {
        return ((vente - achat) / achat * 100).toFixed(2)
      }
    }
    return 0
  }

  const steps = [
    { number: 1, title: 'Devises', description: 'Sélectionnez les devises' },
    { number: 2, title: 'Taux', description: 'Définissez les taux de change' },
    { number: 3, title: 'Limites', description: 'Configurez les limites et commissions' }
  ]

  return (
    <div className="p-6 bg-[#F4F2EE] min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <RicashButton
            variant="outline"
            size="sm"
            onClick={() => navigate('/app/settings/rates')}
            className="border-[#376470]/20 text-[#376470] hover:bg-[#376470]/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </RicashButton>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#29475B] tracking-tight">
              💱 Nouveau Taux de Change
            </h1>
            <p className="text-[#376470] text-lg mt-2">
              Créer un nouveau taux de change entre deux devises
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-sm text-[#376470]">
              Étape {currentStep} sur 3
            </div>
            <div className="w-32 bg-[#376470]/20 rounded-full h-2">
              <div 
                className="bg-[#2B8286] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = currentStep === step.number
            const isCompleted = currentStep > step.number
            const StepIcon = step.number === 1 ? DollarSign : step.number === 2 ? TrendingUp : Settings
            
            return (
              <div key={step.number} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                  ${isActive ? 'border-[#2B8286] bg-[#2B8286] text-white' : 
                    isCompleted ? 'border-[#2B8286] bg-[#2B8286] text-white' : 
                    'border-[#376470]/30 text-[#376470]'}
                `}>
                  <StepIcon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <div className={`text-sm font-medium ${isActive ? 'text-[#2B8286]' : 'text-[#376470]'}`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-[#376470]">
                    {step.description}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${isCompleted ? 'bg-[#2B8286]' : 'bg-[#376470]/30'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Form Content */}
      <RicashCard className="p-8 border-[#376470]/20">
        {/* Step 1: Devises */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <DollarSign className="h-16 w-16 text-[#2B8286] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#29475B] mb-2">
                Sélection des Devises
              </h2>
              <p className="text-[#376470]">
                Choisissez la devise de base et la devise cible pour le taux de change
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <RicashLabel className="text-[#29475B] font-semibold mb-2">
                  💱 Devise de Base
                </RicashLabel>
                <RicashSelect
                  value={formData.deviseBase}
                  onValueChange={(value) => handleInputChange('deviseBase', value)}
                  placeholder="Sélectionnez la devise de base"
                  options={devises.map(devise => ({
                    value: devise.value,
                    label: devise.label
                  }))}
                  className="border-[#376470]/20 focus:border-[#2B8286]"
                />
                {errors.deviseBase && (
                  <div className="text-red-500 text-xs mt-1">{errors.deviseBase}</div>
                )}
              </div>

              <div>
                <RicashLabel className="text-[#29475B] font-semibold mb-2">
                  🎯 Devise Cible
                </RicashLabel>
                <RicashSelect
                  value={formData.deviseCible}
                  onValueChange={(value) => handleInputChange('deviseCible', value)}
                  placeholder="Sélectionnez la devise cible"
                  options={devises
                    .filter(devise => devise.value !== formData.deviseBase)
                    .map(devise => ({
                      value: devise.value,
                      label: devise.label
                    }))}
                  className="border-[#376470]/20 focus:border-[#2B8286]"
                />
                {errors.deviseCible && (
                  <div className="text-red-500 text-xs mt-1">{errors.deviseCible}</div>
                )}
              </div>
            </div>

            {formData.deviseBase && formData.deviseCible && (
              <div className="bg-gradient-to-r from-[#2B8286]/10 to-[#B19068]/10 p-6 rounded-lg border border-[#2B8286]/20">
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {React.createElement(getDeviseIcon(formData.deviseBase), { className: "h-6 w-6 text-[#2B8286]" })}
                    <span className="text-lg font-semibold text-[#29475B]">{formData.deviseBase}</span>
                  </div>
                  <TrendingUp className="h-5 w-5 text-[#376470]" />
                  <div className="flex items-center space-x-2">
                    {React.createElement(getDeviseIcon(formData.deviseCible), { className: "h-6 w-6 text-[#B19068]" })}
                    <span className="text-lg font-semibold text-[#29475B]">{formData.deviseCible}</span>
                  </div>
                </div>
                <div className="text-center text-[#376470] mt-2">
                  Paire de devises sélectionnée
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Taux */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <TrendingUp className="h-16 w-16 text-[#2B8286] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#29475B] mb-2">
                Configuration des Taux
              </h2>
              <p className="text-[#376470]">
                Définissez les taux d'achat et de vente pour cette paire de devises
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <RicashLabel className="text-[#29475B] font-semibold mb-2">
                  📈 Taux d'Achat
                </RicashLabel>
                <RicashInput
                  type="number"
                  step="0.000001"
                  value={formData.tauxAchat}
                  onChange={(e) => handleInputChange('tauxAchat', e.target.value)}
                  placeholder="Ex: 655.957"
                  className="border-[#376470]/20 focus:border-[#2B8286]"
                />
                {errors.tauxAchat && (
                  <div className="text-red-500 text-xs mt-1">{errors.tauxAchat}</div>
                )}
                <div className="text-xs text-[#376470] mt-1">
                  Prix auquel nous achetons {formData.deviseBase}
                </div>
              </div>

              <div>
                <RicashLabel className="text-[#29475B] font-semibold mb-2">
                  📉 Taux de Vente
                </RicashLabel>
                <RicashInput
                  type="number"
                  step="0.000001"
                  value={formData.tauxVente}
                  onChange={(e) => handleInputChange('tauxVente', e.target.value)}
                  placeholder="Ex: 656.957"
                  className="border-[#376470]/20 focus:border-[#2B8286]"
                />
                {errors.tauxVente && (
                  <div className="text-red-500 text-xs mt-1">{errors.tauxVente}</div>
                )}
                <div className="text-xs text-[#376470] mt-1">
                  Prix auquel nous vendons {formData.deviseBase}
                </div>
              </div>
            </div>

            <div>
              <RicashLabel className="text-[#29475B] font-semibold mb-2">
                🏛️ Source du Taux
              </RicashLabel>
              <RicashSelect
                value={formData.source}
                onValueChange={(value) => handleInputChange('source', value)}
                placeholder="Sélectionnez la source"
                options={sources.map(source => ({
                  value: source.value,
                  label: source.label
                }))}
                className="border-[#376470]/20 focus:border-[#2B8286]"
              />
            </div>

            {formData.tauxAchat && formData.tauxVente && (
              <div className="bg-gradient-to-r from-[#2B8286]/10 to-[#B19068]/10 p-6 rounded-lg border border-[#2B8286]/20">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#2B8286]">
                      {formData.tauxAchat}
                    </div>
                    <div className="text-sm text-[#376470]">Taux d'achat</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#B19068]">
                      {formData.tauxVente}
                    </div>
                    <div className="text-sm text-[#376470]">Taux de vente</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#29475B]">
                      {calculateSpread()}%
                    </div>
                    <div className="text-sm text-[#376470]">Spread</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Limites */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Settings className="h-16 w-16 text-[#2B8286] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#29475B] mb-2">
                Configuration des Limites
              </h2>
              <p className="text-[#376470]">
                Définissez les limites de transaction et les commissions
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <RicashLabel className="text-[#29475B] font-semibold mb-2">
                  📊 Limite Minimale
                </RicashLabel>
                <RicashInput
                  type="number"
                  step="0.01"
                  value={formData.limiteMin}
                  onChange={(e) => handleInputChange('limiteMin', e.target.value)}
                  placeholder="Ex: 100"
                  className="border-[#376470]/20 focus:border-[#2B8286]"
                />
                {errors.limiteMin && (
                  <div className="text-red-500 text-xs mt-1">{errors.limiteMin}</div>
                )}
                <div className="text-xs text-[#376470] mt-1">
                  Montant minimum pour cette paire
                </div>
              </div>

              <div>
                <RicashLabel className="text-[#29475B] font-semibold mb-2">
                  📈 Limite Maximale
                </RicashLabel>
                <RicashInput
                  type="number"
                  step="0.01"
                  value={formData.limiteMax}
                  onChange={(e) => handleInputChange('limiteMax', e.target.value)}
                  placeholder="Ex: 1000000"
                  className="border-[#376470]/20 focus:border-[#2B8286]"
                />
                {errors.limiteMax && (
                  <div className="text-red-500 text-xs mt-1">{errors.limiteMax}</div>
                )}
                <div className="text-xs text-[#376470] mt-1">
                  Montant maximum pour cette paire
                </div>
              </div>
            </div>

            <div>
              <RicashLabel className="text-[#29475B] font-semibold mb-2">
                💰 Commission (%)
              </RicashLabel>
              <RicashInput
                type="number"
                step="0.01"
                value={formData.commission}
                onChange={(e) => handleInputChange('commission', e.target.value)}
                placeholder="Ex: 0.5"
                className="border-[#376470]/20 focus:border-[#2B8286]"
              />
              <div className="text-xs text-[#376470] mt-1">
                Commission appliquée sur les transactions
              </div>
            </div>

            <div>
              <RicashLabel className="text-[#29475B] font-semibold mb-2">
                📝 Commentaires
              </RicashLabel>
              <RicashTextarea
                value={formData.commentaires}
                onChange={(e) => handleInputChange('commentaires', e.target.value)}
                placeholder="Notes additionnelles sur ce taux de change..."
                rows={3}
                className="border-[#376470]/20 focus:border-[#2B8286]"
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#376470]/20">
          <RicashButton
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="border-[#376470]/20 text-[#376470] hover:bg-[#376470]/10"
          >
            Précédent
          </RicashButton>

          <div className="flex gap-3">
            <RicashButton
              variant="outline"
              onClick={() => navigate('/app/settings/rates')}
              className="border-[#376470]/20 text-[#376470] hover:bg-[#376470]/10"
            >
              Annuler
            </RicashButton>
            
            {currentStep < 3 ? (
              <RicashButton
                onClick={handleNext}
                className="bg-[#2B8286] hover:bg-[#2B8286]/90 text-white"
              >
                Suivant
              </RicashButton>
            ) : (
              <RicashButton
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-[#2B8286] hover:bg-[#2B8286]/90 text-white"
              >
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Création...' : 'Créer le taux'}
              </RicashButton>
            )}
          </div>
        </div>
      </RicashCard>
    </div>
  )
}

export default CreateRatePage
