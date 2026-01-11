import React from 'react'
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  MapPin,
  Shield,
  CreditCard,
  Save
} from 'lucide-react'
import {
  RicashCard,
  RicashButton,
  RicashInput,
  RicashTextarea,
  RicashSelect,
  RicashLabel,
  RicashFormGroup
} from '../ui/ricash-ui'

export default function RicashFormExample() {
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    country: '',
    notes: ''
  })
  
  const [errors, setErrors] = React.useState({})
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis'
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      console.log('Formulaire soumis:', formData)
      // Ici vous pouvez envoyer les données à votre API
      alert('Formulaire soumis avec succès!')
    }
  }
  
  const countries = [
    { value: 'SN', label: 'Sénégal' },
    { value: 'ML', label: 'Mali' },
    { value: 'CI', label: 'Côte d\'Ivoire' },
    { value: 'BF', label: 'Burkina Faso' },
    { value: 'FR', label: 'France' },
    { value: 'US', label: 'États-Unis' }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#29475B] mb-2">
          Formulaire Ricash
        </h1>
        <p className="text-[#376470]">
          Exemple d'utilisation des composants de formulaire Ricash
        </p>
      </div>
      
      {/* Formulaire principal */}
      <RicashCard title="Informations personnelles" subtitle="Remplissez vos informations de base">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RicashFormGroup>
              <RicashLabel>
                <User className="w-4 h-4 inline mr-2" />
                Prénom
              </RicashLabel>
              <RicashInput
                placeholder="Votre prénom"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                error={errors.firstName}
              />
            </RicashFormGroup>
            
            <RicashFormGroup>
              <RicashLabel>
                <User className="w-4 h-4 inline mr-2" />
                Nom
              </RicashLabel>
              <RicashInput
                placeholder="Votre nom"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                error={errors.lastName}
              />
            </RicashFormGroup>
          </div>
          
          {/* Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RicashFormGroup>
              <RicashLabel>
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </RicashLabel>
              <RicashInput
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={errors.email}
              />
            </RicashFormGroup>
            
            <RicashFormGroup>
              <RicashLabel>
                <Phone className="w-4 h-4 inline mr-2" />
                Téléphone
              </RicashLabel>
              <RicashInput
                type="tel"
                placeholder="+221 77 123 45 67"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                error={errors.phone}
              />
            </RicashFormGroup>
          </div>
          
          {/* Entreprise */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RicashFormGroup>
              <RicashLabel>
                <Building2 className="w-4 h-4 inline mr-2" />
                Entreprise
              </RicashLabel>
              <RicashInput
                placeholder="Nom de votre entreprise"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
              />
            </RicashFormGroup>
            
            <RicashFormGroup>
              <RicashLabel>
                <MapPin className="w-4 h-4 inline mr-2" />
                Pays
              </RicashLabel>
              <RicashSelect
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
              >
                <option value="">Sélectionner un pays</option>
                {countries.map(country => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </RicashSelect>
            </RicashFormGroup>
          </div>
          
          {/* Adresse */}
          <RicashFormGroup>
            <RicashLabel>
              <MapPin className="w-4 h-4 inline mr-2" />
              Adresse
            </RicashLabel>
            <RicashInput
              placeholder="Votre adresse complète"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </RicashFormGroup>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RicashFormGroup>
              <RicashLabel>
                <MapPin className="w-4 h-4 inline mr-2" />
                Ville
              </RicashLabel>
              <RicashInput
                placeholder="Votre ville"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
              />
            </RicashFormGroup>
            
            <RicashFormGroup>
              <RicashLabel>
                <Shield className="w-4 h-4 inline mr-2" />
                Code postal
              </RicashLabel>
              <RicashInput
                placeholder="Code postal"
                value={formData.postalCode}
                onChange={(e) => handleChange('postalCode', e.target.value)}
              />
            </RicashFormGroup>
          </div>
          
          {/* Notes */}
          <RicashFormGroup>
            <RicashLabel>
              <CreditCard className="w-4 h-4 inline mr-2" />
              Notes additionnelles
            </RicashLabel>
            <RicashTextarea
              placeholder="Informations supplémentaires..."
              rows={4}
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </RicashFormGroup>
          
          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-[#F4F2EE]">
            <RicashButton variant="outline" type="button">
              Annuler
            </RicashButton>
            <RicashButton variant="primary" type="submit">
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </RicashButton>
          </div>
        </form>
      </RicashCard>
      
      {/* Aperçu des données */}
      <RicashCard title="Aperçu des données" subtitle="Données du formulaire en temps réel">
        <div className="bg-[#F4F2EE]/30 rounded-lg p-4">
          <pre className="text-sm text-[#29475B] overflow-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </RicashCard>
    </div>
  )
}
