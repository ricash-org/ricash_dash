import { useState } from 'react'
import { 
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
  Plus,
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

export default function CreateAgentModal({ isOpen, onClose, onCreate }) {
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

  const validateForm = () => {
    const newErrors = {}
    
    // Required fields validation
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis'
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis'
    if (!formData.telephone.trim()) newErrors.telephone = 'Le téléphone est requis'
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis'
    if (!formData.dateNaissance) newErrors.dateNaissance = 'La date de naissance est requise'
    if (!formData.cni.trim()) newErrors.cni = 'Le numéro CNI est requis'
    if (!formData.adresse.trim()) newErrors.adresse = 'L\'adresse est requise'
    if (!formData.agence.id) newErrors['agence.id'] = 'L\'agence est requise'
    if (!formData.emergencyContact.nom.trim()) newErrors['emergencyContact.nom'] = 'Le contact d\'urgence est requis'
    if (!formData.emergencyContact.telephone.trim()) newErrors['emergencyContact.telephone'] = 'Le téléphone du contact d\'urgence est requis'
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide'
    }
    
    // Phone validation (basic)
    const phoneRegex = /^[+]?[\d\s-()]+$/
    if (formData.telephone && !phoneRegex.test(formData.telephone)) {
      newErrors.telephone = 'Format de téléphone invalide'
    }
    if (formData.emergencyContact.telephone && !phoneRegex.test(formData.emergencyContact.telephone)) {
      newErrors['emergencyContact.telephone'] = 'Format de téléphone invalide'
    }
    
    // CNI validation (13 digits for Senegal)
    if (formData.cni && (formData.cni.length !== 13 || !/^\d+$/.test(formData.cni))) {
      newErrors.cni = 'Le CNI doit contenir 13 chiffres'
    }
    
    // Age validation (minimum 18 years)
    if (formData.dateNaissance) {
      const today = new Date()
      const birthDate = new Date(formData.dateNaissance)
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      
      if (age < 18) {
        newErrors.dateNaissance = 'L\'agent doit être majeur (18 ans minimum)'
      }
    }
    
    // Salary validation
    if (formData.salaire <= 0) {
      newErrors.salaire = 'Le salaire doit être positif'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      const agentData = {
        ...formData,
        statut: 'formation',
        chiffreAffaires: 0,
        transactionsJour: 0,
        transactionsMois: 0,
        commission: 0,
        notePerformance: 0,
        dernierLogin: new Date().toISOString(),
        salaire: Number(formData.salaire)
      }
      
      onCreate?.(agentData)
      onClose()
      
      // Reset form
      setFormData({
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
        certifications: []
      })
      setErrors({})
    }
  }

  // Static options data moved to handleAgenceChange function and directly in SelectItems
  // to prevent DOM issues with dynamic rendering

  const handleAgenceChange = (agenceId) => {
    const agencesData = {
      'AGE001': { id: 'AGE001', nom: 'Ricash Dakar Centre', ville: 'Dakar' },
      'AGE002': { id: 'AGE002', nom: 'Ricash Touba', ville: 'Touba' },
      'AGE003': { id: 'AGE003', nom: 'Ricash Saint-Louis', ville: 'Saint-Louis' },
      'AGE004': { id: 'AGE004', nom: 'Ricash Thiès', ville: 'Thiès' },
      'AGE005': { id: 'AGE005', nom: 'Ricash Kaolack', ville: 'Kaolack' }
    }
    
    const selectedAgence = agencesData[agenceId]
    if (selectedAgence) {
      setFormData(prev => ({
        ...prev,
        agence: selectedAgence
      }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Ajouter un nouvel agent
          </DialogTitle>
          <DialogDescription>
            Créez un nouveau profil d'agent pour votre réseau Ricash
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  value={formData.prenom}
                  onChange={(e) => handleInputChange('prenom', e.target.value)}
                  placeholder="Prénom de l'agent"
                  className={errors.prenom ? 'border-red-500' : ''}
                />
                {errors.prenom && <p className="text-sm text-red-500">{errors.prenom}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                  placeholder="Nom de famille"
                  className={errors.nom ? 'border-red-500' : ''}
                />
                {errors.nom && <p className="text-sm text-red-500">{errors.nom}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateNaissance">Date de naissance *</Label>
                <Input
                  id="dateNaissance"
                  type="date"
                  value={formData.dateNaissance}
                  onChange={(e) => handleInputChange('dateNaissance', e.target.value)}
                  className={errors.dateNaissance ? 'border-red-500' : ''}
                />
                {errors.dateNaissance && <p className="text-sm text-red-500">{errors.dateNaissance}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cni">Numéro CNI *</Label>
                <Input
                  id="cni"
                  value={formData.cni}
                  onChange={(e) => handleInputChange('cni', e.target.value)}
                  placeholder="1234567890123"
                  maxLength={13}
                  className={errors.cni ? 'border-red-500' : ''}
                />
                {errors.cni && <p className="text-sm text-red-500">{errors.cni}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="adresse">Adresse complète *</Label>
                <Textarea
                  id="adresse"
                  value={formData.adresse}
                  onChange={(e) => handleInputChange('adresse', e.target.value)}
                  placeholder="Adresse de résidence de l'agent"
                  className={errors.adresse ? 'border-red-500' : ''}
                />
                {errors.adresse && <p className="text-sm text-red-500">{errors.adresse}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Informations de contact
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone *</Label>
                <Input
                  id="telephone"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
                  placeholder="+221 77 xxx xx xx"
                  className={errors.telephone ? 'border-red-500' : ''}
                />
                {errors.telephone && <p className="text-sm text-red-500">{errors.telephone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="agent@ricash.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Contact d'urgence
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact.nom">Nom du contact *</Label>
                <Input
                  id="emergencyContact.nom"
                  value={formData.emergencyContact.nom}
                  onChange={(e) => handleInputChange('emergencyContact.nom', e.target.value)}
                  placeholder="Nom de la personne à contacter"
                  className={errors['emergencyContact.nom'] ? 'border-red-500' : ''}
                />
                {errors['emergencyContact.nom'] && <p className="text-sm text-red-500">{errors['emergencyContact.nom']}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact.telephone">Téléphone du contact *</Label>
                <Input
                  id="emergencyContact.telephone"
                  value={formData.emergencyContact.telephone}
                  onChange={(e) => handleInputChange('emergencyContact.telephone', e.target.value)}
                  placeholder="+221 77 xxx xx xx"
                  className={errors['emergencyContact.telephone'] ? 'border-red-500' : ''}
                />
                {errors['emergencyContact.telephone'] && <p className="text-sm text-red-500">{errors['emergencyContact.telephone']}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informations professionnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="poste">Poste</Label>
                <SafeSelect 
                  value={formData.poste} 
                  onValueChange={(value) => handleInputChange('poste', value)}
                  placeholder="Sélectionnez un poste"
                  options={[
                    { value: 'Agent Caissier', label: 'Agent Caissier' },
                    { value: 'Agent Principal', label: 'Agent Principal' },
                    { value: 'Agent KYC', label: 'Agent KYC' },
                    { value: 'Agent Stagiaire', label: 'Agent Stagiaire' },
                    { value: 'Superviseur', label: 'Superviseur' },
                    { value: 'Manager', label: 'Manager' }
                  ]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="niveau">Niveau</Label>
                <SafeSelect 
                  value={formData.niveau} 
                  onValueChange={(value) => handleInputChange('niveau', value)}
                  placeholder="Sélectionnez un niveau"
                  options={[
                    { value: 'Débutant', label: 'Débutant' },
                    { value: 'Junior', label: 'Junior' },
                    { value: 'Intermédiaire', label: 'Intermédiaire' },
                    { value: 'Senior', label: 'Senior' },
                    { value: 'Expert', label: 'Expert' }
                  ]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agence">Agence d'affectation *</Label>
                <SafeSelect 
                  value={formData.agence.id} 
                  onValueChange={handleAgenceChange}
                  placeholder="Sélectionner une agence"
                  options={[
                    { value: 'AGE001', label: 'Ricash Dakar Centre - Dakar' },
                    { value: 'AGE002', label: 'Ricash Touba - Touba' },
                    { value: 'AGE003', label: 'Ricash Saint-Louis - Saint-Louis' },
                    { value: 'AGE004', label: 'Ricash Thiès - Thiès' },
                    { value: 'AGE005', label: 'Ricash Kaolack - Kaolack' }
                  ]}
                  triggerClassName={errors['agence.id'] ? 'border-red-500' : ''}
                />
                {errors['agence.id'] && <p className="text-sm text-red-500">{errors['agence.id']}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaire">Salaire mensuel (XOF)</Label>
                <Input
                  id="salaire"
                  type="number"
                  min="0"
                  value={formData.salaire}
                  onChange={(e) => handleInputChange('salaire', parseInt(e.target.value) || 0)}
                  className={errors.salaire ? 'border-red-500' : ''}
                />
                {errors.salaire && <p className="text-sm text-red-500">{errors.salaire}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            <Plus className="mr-2 h-4 w-4" />
            Créer l'agent
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
