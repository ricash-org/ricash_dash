import React, { useState } from 'react'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Shield, 
  CheckCircle, 
  X, 
  ArrowRight, 
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

const CreateUserWizard = ({ isOpen, onClose, onUserCreated }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    occupation: '',
    employer: '',
    monthlyIncome: '',
    accountType: 'Standard',
    initialDeposit: '',
    currency: 'XOF',
    idType: '',
    idNumber: '',
    idExpiryDate: '',
    password: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: '',
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    termsAccepted: false,
    privacyAccepted: false
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const steps = [
    { id: 1, title: 'Informations Personnelles', description: 'Nom, email, téléphone' },
    { id: 2, title: 'Adresse', description: 'Adresse complète' },
    { id: 3, title: 'Informations Professionnelles', description: 'Profession et revenus' },
    { id: 4, title: 'Compte Financier', description: 'Type de compte et dépôt initial' },
    { id: 5, title: 'Documents', description: 'Pièces d\'identité' },
    { id: 6, title: 'Sécurité', description: 'Mot de passe et questions de sécurité' },
    { id: 7, title: 'Confirmation', description: 'Vérification et validation' }
  ]

  const countries = [
    'Sénégal', 'Mali', 'Burkina Faso', 'Côte d\'Ivoire', 'Guinée', 'Niger', 
    'Tchad', 'Cameroun', 'Gabon', 'Congo', 'RDC', 'Madagascar', 'Maurice'
  ]

  const accountTypes = [
    { value: 'Standard', label: 'Compte Standard', description: 'Limite de transfert: 200,000 XOF/jour' },
    { value: 'Premium', label: 'Compte Premium', description: 'Limite de transfert: 500,000 XOF/jour' },
    { value: 'VIP', label: 'Compte VIP', description: 'Limite de transfert: 1,000,000 XOF/jour' }
  ]

  const idTypes = [
    'Carte Nationale d\'Identité',
    'Passeport',
    'Permis de Conduire',
    'Carte de Résident'
  ]

  const securityQuestions = [
    'Quel est le nom de votre premier animal de compagnie ?',
    'Dans quelle ville êtes-vous né(e) ?',
    'Quel est le nom de votre école primaire ?',
    'Quel est le nom de votre meilleur ami d\'enfance ?',
    'Quel est votre plat préféré ?'
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleNotificationChange = (type, checked) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: checked
      }
    }))
  }

  const validateStep = (step) => {
    const newErrors = {}

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis'
        if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis'
        if (!formData.email.trim()) {
          newErrors.email = 'L\'email est requis'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'L\'email n\'est pas valide'
        }
        if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis'
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'La date de naissance est requise'
        if (!formData.gender) newErrors.gender = 'Le genre est requis'
        if (!formData.nationality) newErrors.nationality = 'La nationalité est requise'
        break

      case 2:
        if (!formData.address.trim()) newErrors.address = 'L\'adresse est requise'
        if (!formData.city.trim()) newErrors.city = 'La ville est requise'
        if (!formData.country) newErrors.country = 'Le pays est requis'
        if (!formData.postalCode.trim()) newErrors.postalCode = 'Le code postal est requis'
        break

      case 3:
        if (!formData.occupation.trim()) newErrors.occupation = 'La profession est requise'
        if (!formData.employer.trim()) newErrors.employer = 'L\'employeur est requis'
        if (!formData.monthlyIncome.trim()) newErrors.monthlyIncome = 'Le revenu mensuel est requis'
        break

      case 4:
        if (!formData.accountType) newErrors.accountType = 'Le type de compte est requis'
        if (!formData.initialDeposit.trim()) {
          newErrors.initialDeposit = 'Le dépôt initial est requis'
        } else if (isNaN(formData.initialDeposit) || parseFloat(formData.initialDeposit) < 0) {
          newErrors.initialDeposit = 'Le montant doit être un nombre positif'
        }
        break

      case 5:
        if (!formData.idType) newErrors.idType = 'Le type de pièce d\'identité est requis'
        if (!formData.idNumber.trim()) newErrors.idNumber = 'Le numéro de pièce d\'identité est requis'
        if (!formData.idExpiryDate) newErrors.idExpiryDate = 'La date d\'expiration est requise'
        break

      case 6:
        if (!formData.password.trim()) {
          newErrors.password = 'Le mot de passe est requis'
        } else if (formData.password.length < 8) {
          newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères'
        }
        if (!formData.confirmPassword.trim()) {
          newErrors.confirmPassword = 'La confirmation du mot de passe est requise'
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
        }
        if (!formData.securityQuestion) newErrors.securityQuestion = 'La question de sécurité est requise'
        if (!formData.securityAnswer.trim()) newErrors.securityAnswer = 'La réponse de sécurité est requise'
        break

      case 7:
        if (!formData.termsAccepted) newErrors.termsAccepted = 'Vous devez accepter les conditions d\'utilisation'
        if (!formData.privacyAccepted) newErrors.privacyAccepted = 'Vous devez accepter la politique de confidentialité'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newUser = {
        id: `USR-${Date.now()}`,
        nom: formData.lastName,
        prenom: formData.firstName,
        email: formData.email,
        telephone: formData.phone,
        pays: formData.country,
        ville: formData.city,
        statut: 'success',
        kycStatus: 'info',
        typeCompte: formData.accountType,
        solde: parseFloat(formData.initialDeposit) || 0,
        transactions: 0,
        dateInscription: new Date().toISOString(),
        derniereConnexion: new Date().toISOString()
      }

      onUserCreated?.(newUser)
      onClose()
      
      setCurrentStep(1)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        nationality: '',
        address: '',
        city: '',
        country: '',
        postalCode: '',
        occupation: '',
        employer: '',
        monthlyIncome: '',
        accountType: 'Standard',
        initialDeposit: '',
        currency: 'XOF',
        idType: '',
        idNumber: '',
        idExpiryDate: '',
        password: '',
        confirmPassword: '',
        securityQuestion: '',
        securityAnswer: '',
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        termsAccepted: false,
        privacyAccepted: false
      })
      setErrors({})
      
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
  return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Prénom *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Entrez le prénom"
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>
              
              <div>
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Entrez le nom"
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="exemple@email.com"
              className={errors.email ? 'border-red-500' : ''}
            />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Téléphone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+221 77 123 4567"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dateOfBirth">Date de naissance *</Label>
            <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className={errors.dateOfBirth ? 'border-red-500' : ''}
                />
                {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
              </div>
              
              <div>
                <Label htmlFor="gender">Genre *</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Sélectionnez le genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Homme</SelectItem>
                    <SelectItem value="female">Femme</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              </div>
              
              <div>
                <Label htmlFor="nationality">Nationalité *</Label>
                <Select value={formData.nationality} onValueChange={(value) => handleInputChange('nationality', value)}>
                  <SelectTrigger className={errors.nationality ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Sélectionnez la nationalité" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="address">Adresse complète *</Label>
            <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Entrez l'adresse complète"
                className={errors.address ? 'border-red-500' : ''}
                rows={3}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Ville *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Entrez la ville"
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              
              <div>
                <Label htmlFor="country">Pays *</Label>
                <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                  <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Sélectionnez le pays" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="postalCode">Code postal *</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                placeholder="Entrez le code postal"
                className={errors.postalCode ? 'border-red-500' : ''}
              />
              {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="occupation">Profession *</Label>
              <Input
                id="occupation"
                value={formData.occupation}
                onChange={(e) => handleInputChange('occupation', e.target.value)}
                placeholder="Entrez la profession"
                className={errors.occupation ? 'border-red-500' : ''}
              />
              {errors.occupation && <p className="text-red-500 text-sm mt-1">{errors.occupation}</p>}
            </div>

            <div>
              <Label htmlFor="employer">Employeur *</Label>
              <Input
                id="employer"
                value={formData.employer}
                onChange={(e) => handleInputChange('employer', e.target.value)}
                placeholder="Entrez le nom de l'employeur"
                className={errors.employer ? 'border-red-500' : ''}
              />
              {errors.employer && <p className="text-red-500 text-sm mt-1">{errors.employer}</p>}
          </div>

            <div>
              <Label htmlFor="monthlyIncome">Revenu mensuel (XOF) *</Label>
            <Input
                id="monthlyIncome"
                type="number"
                value={formData.monthlyIncome}
                onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                placeholder="Entrez le revenu mensuel"
                className={errors.monthlyIncome ? 'border-red-500' : ''}
              />
              {errors.monthlyIncome && <p className="text-red-500 text-sm mt-1">{errors.monthlyIncome}</p>}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="accountType">Type de compte *</Label>
              <Select value={formData.accountType} onValueChange={(value) => handleInputChange('accountType', value)}>
                <SelectTrigger className={errors.accountType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Sélectionnez le type de compte" />
                </SelectTrigger>
                <SelectContent>
                  {accountTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-gray-500">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.accountType && <p className="text-red-500 text-sm mt-1">{errors.accountType}</p>}
          </div>

            <div>
              <Label htmlFor="initialDeposit">Dépôt initial (XOF) *</Label>
              <Input
                id="initialDeposit"
                type="number"
                value={formData.initialDeposit}
                onChange={(e) => handleInputChange('initialDeposit', e.target.value)}
                placeholder="Entrez le montant du dépôt initial"
                className={errors.initialDeposit ? 'border-red-500' : ''}
              />
              {errors.initialDeposit && <p className="text-red-500 text-sm mt-1">{errors.initialDeposit}</p>}
            </div>

            <div>
              <Label htmlFor="currency">Devise</Label>
              <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XOF">XOF (Franc CFA)</SelectItem>
                  <SelectItem value="EUR">EUR (Euro)</SelectItem>
                  <SelectItem value="USD">USD (Dollar US)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 5:
  return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="idType">Type de pièce d'identité *</Label>
              <Select value={formData.idType} onValueChange={(value) => handleInputChange('idType', value)}>
                <SelectTrigger className={errors.idType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Sélectionnez le type de pièce" />
                </SelectTrigger>
                <SelectContent>
                  {idTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.idType && <p className="text-red-500 text-sm mt-1">{errors.idType}</p>}
            </div>

            <div>
              <Label htmlFor="idNumber">Numéro de pièce d'identité *</Label>
              <Input
                id="idNumber"
                value={formData.idNumber}
                onChange={(e) => handleInputChange('idNumber', e.target.value)}
                placeholder="Entrez le numéro de la pièce"
                className={errors.idNumber ? 'border-red-500' : ''}
              />
              {errors.idNumber && <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>}
            </div>

            <div>
              <Label htmlFor="idExpiryDate">Date d'expiration *</Label>
              <Input
                id="idExpiryDate"
                type="date"
                value={formData.idExpiryDate}
                onChange={(e) => handleInputChange('idExpiryDate', e.target.value)}
                className={errors.idExpiryDate ? 'border-red-500' : ''}
              />
              {errors.idExpiryDate && <p className="text-red-500 text-sm mt-1">{errors.idExpiryDate}</p>}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Mot de passe *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Entrez le mot de passe"
                  className={errors.password ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirmez le mot de passe"
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <div>
              <Label htmlFor="securityQuestion">Question de sécurité *</Label>
              <Select value={formData.securityQuestion} onValueChange={(value) => handleInputChange('securityQuestion', value)}>
                <SelectTrigger className={errors.securityQuestion ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Sélectionnez une question" />
                </SelectTrigger>
                <SelectContent>
                  {securityQuestions.map((question, index) => (
                    <SelectItem key={index} value={question}>{question}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.securityQuestion && <p className="text-red-500 text-sm mt-1">{errors.securityQuestion}</p>}
          </div>

            <div>
              <Label htmlFor="securityAnswer">Réponse de sécurité *</Label>
              <Input
                id="securityAnswer"
                value={formData.securityAnswer}
                onChange={(e) => handleInputChange('securityAnswer', e.target.value)}
                placeholder="Entrez votre réponse"
                className={errors.securityAnswer ? 'border-red-500' : ''}
              />
              {errors.securityAnswer && <p className="text-red-500 text-sm mt-1">{errors.securityAnswer}</p>}
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">Récapitulatif</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Nom complet:</strong> {formData.firstName} {formData.lastName}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Téléphone:</strong> {formData.phone}</p>
                  <p><strong>Nationalité:</strong> {formData.nationality}</p>
                </div>
                <div>
                  <p><strong>Ville:</strong> {formData.city}, {formData.country}</p>
                  <p><strong>Profession:</strong> {formData.occupation}</p>
                  <p><strong>Type de compte:</strong> {formData.accountType}</p>
                  <p><strong>Dépôt initial:</strong> {formData.initialDeposit} {formData.currency}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="termsAccepted"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => handleInputChange('termsAccepted', checked)}
                />
                <Label htmlFor="termsAccepted" className="text-sm">
                  J'accepte les <a href="#" className="text-blue-600 hover:underline">conditions d'utilisation</a> *
                </Label>
              </div>
              {errors.termsAccepted && <p className="text-red-500 text-sm">{errors.termsAccepted}</p>}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="privacyAccepted"
                  checked={formData.privacyAccepted}
                  onCheckedChange={(checked) => handleInputChange('privacyAccepted', checked)}
                />
                <Label htmlFor="privacyAccepted" className="text-sm">
                  J'accepte la <a href="#" className="text-blue-600 hover:underline">politique de confidentialité</a> *
                </Label>
              </div>
              {errors.privacyAccepted && <p className="text-red-500 text-sm">{errors.privacyAccepted}</p>}
          </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Préférences de notification</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emailNotifications"
                    checked={formData.notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                  />
                  <Label htmlFor="emailNotifications" className="text-sm">Notifications par email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="smsNotifications"
                    checked={formData.notifications.sms}
                    onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                  />
                  <Label htmlFor="smsNotifications" className="text-sm">Notifications par SMS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pushNotifications"
                    checked={formData.notifications.push}
                    onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                  />
                  <Label htmlFor="pushNotifications" className="text-sm">Notifications push</Label>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
        <div>
            <h2 className="text-2xl font-bold text-gray-900">Créer un nouvel utilisateur</h2>
            <p className="text-gray-600 mt-1">
              Étape {currentStep} sur {steps.length}: {steps[currentStep - 1].title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep > step.id
                    ? 'bg-green-500 text-white'
                    : currentStep === step.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.id ? <CheckCircle className="w-4 h-4" /> : step.id}
                </div>
                <div className="ml-2 hidden md:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Précédent
      </Button>
      
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            {currentStep === steps.length ? (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Création...
                  </>
                ) : (
                  <>
                    Créer l'utilisateur
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handleNext} className="flex items-center">
                Suivant
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateUserWizard
