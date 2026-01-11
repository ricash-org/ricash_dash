import { useState } from 'react'
import { 
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

export default function CreateAgencyModal({ isOpen, onClose, onCreate }) {
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

  const validateForm = () => {
    const newErrors = {}
    
    // Required fields validation
    if (!formData.nom.trim()) newErrors.nom = 'Le nom de l\'agence est requis'
    if (!formData.ville.trim()) newErrors.ville = 'La ville est requise'
    if (!formData.quartier.trim()) newErrors.quartier = 'Le quartier est requis'
    if (!formData.adresse.trim()) newErrors.adresse = 'L\'adresse est requise'
    if (!formData.telephone.trim()) newErrors.telephone = 'Le téléphone est requis'
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis'
    if (!formData.responsable.nom.trim()) newErrors['responsable.nom'] = 'Le nom du responsable est requis'
    if (!formData.responsable.telephone.trim()) newErrors['responsable.telephone'] = 'Le téléphone du responsable est requis'
    if (!formData.responsable.email.trim()) newErrors['responsable.email'] = 'L\'email du responsable est requis'
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide'
    }
    if (formData.responsable.email && !emailRegex.test(formData.responsable.email)) {
      newErrors['responsable.email'] = 'Format d\'email invalide'
    }
    
    // Phone validation (basic)
    const phoneRegex = /^[+]?[\d\s-()]+$/
    if (formData.telephone && !phoneRegex.test(formData.telephone)) {
      newErrors.telephone = 'Format de téléphone invalide'
    }
    if (formData.responsable.telephone && !phoneRegex.test(formData.responsable.telephone)) {
      newErrors['responsable.telephone'] = 'Format de téléphone invalide'
    }
    
    // Numeric validations
    if (formData.limiteJournaliere <= 0) {
      newErrors.limiteJournaliere = 'La limite journalière doit être positive'
    }
    if (formData.commission < 0 || formData.commission > 10) {
      newErrors.commission = 'La commission doit être entre 0 et 10%'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      // Generate agency code
      const cityCode = formData.ville.substring(0, 3).toUpperCase()
      const code = `${cityCode}-${String(Date.now()).slice(-3)}`
      
      const agencyData = {
        ...formData,
        code,
        statut: 'active',
        nombreAgents: 0,
        chiffreAffaires: 0,
        limiteJournaliere: Number(formData.limiteJournaliere),
        commission: Number(formData.commission),
        coordonnees: {
          latitude: formData.coordonnees.latitude ? Number(formData.coordonnees.latitude) : 0,
          longitude: formData.coordonnees.longitude ? Number(formData.coordonnees.longitude) : 0
        }
      }
      
      onCreate?.(agencyData)
      onClose()
      
      // Reset form
      setFormData({
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
      setErrors({})
    }
  }

  const villes = [
    'Dakar', 'Thiès', 'Kaolack', 'Saint-Louis', 'Ziguinchor', 'Diourbel',
    'Touba', 'Mbour', 'Tambacounda', 'Kolda', 'Fatick', 'Louga'
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Créer une nouvelle agence
          </DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle agence ou point de service au réseau Ricash
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom de l'agence *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                  placeholder="Ex: Ricash Dakar Centre"
                  className={errors.nom ? 'border-red-500' : ''}
                />
                {errors.nom && <p className="text-sm text-red-500">{errors.nom}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="typeAgence">Type d'agence</Label>
                <SafeSelect 
                  value={formData.typeAgence} 
                  onValueChange={(value) => handleInputChange('typeAgence', value)}
                  placeholder="Sélectionnez un type"
                  options={[
                    { value: 'principale', label: 'Principale' },
                    { value: 'secondaire', label: 'Secondaire' },
                    { value: 'partenaire', label: 'Partenaire' }
                  ]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ville">Ville *</Label>
                <SafeSelect 
                  value={formData.ville} 
                  onValueChange={(value) => handleInputChange('ville', value)}
                  placeholder="Sélectionner une ville"
                  options={villes.map(ville => ({ value: ville, label: ville }))}
                  triggerClassName={errors.ville ? 'border-red-500' : ''}
                />
                {errors.ville && <p className="text-sm text-red-500">{errors.ville}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quartier">Quartier *</Label>
                <Input
                  id="quartier"
                  value={formData.quartier}
                  onChange={(e) => handleInputChange('quartier', e.target.value)}
                  placeholder="Ex: Plateau, Médina..."
                  className={errors.quartier ? 'border-red-500' : ''}
                />
                {errors.quartier && <p className="text-sm text-red-500">{errors.quartier}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="adresse">Adresse complète *</Label>
                <Textarea
                  id="adresse"
                  value={formData.adresse}
                  onChange={(e) => handleInputChange('adresse', e.target.value)}
                  placeholder="Adresse complète de l'agence"
                  className={errors.adresse ? 'border-red-500' : ''}
                />
                {errors.adresse && <p className="text-sm text-red-500">{errors.adresse}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone *</Label>
                <Input
                  id="telephone"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
                  placeholder="+221 33 xxx xx xx"
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
                  placeholder="agence@ricash.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Responsable Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Responsable d'agence
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="responsable.nom">Nom complet *</Label>
                <Input
                  id="responsable.nom"
                  value={formData.responsable.nom}
                  onChange={(e) => handleInputChange('responsable.nom', e.target.value)}
                  placeholder="Nom du responsable"
                  className={errors['responsable.nom'] ? 'border-red-500' : ''}
                />
                {errors['responsable.nom'] && <p className="text-sm text-red-500">{errors['responsable.nom']}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsable.telephone">Téléphone *</Label>
                <Input
                  id="responsable.telephone"
                  value={formData.responsable.telephone}
                  onChange={(e) => handleInputChange('responsable.telephone', e.target.value)}
                  placeholder="+221 77 xxx xx xx"
                  className={errors['responsable.telephone'] ? 'border-red-500' : ''}
                />
                {errors['responsable.telephone'] && <p className="text-sm text-red-500">{errors['responsable.telephone']}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="responsable.email">Email *</Label>
                <Input
                  id="responsable.email"
                  type="email"
                  value={formData.responsable.email}
                  onChange={(e) => handleInputChange('responsable.email', e.target.value)}
                  placeholder="responsable@ricash.com"
                  className={errors['responsable.email'] ? 'border-red-500' : ''}
                />
                {errors['responsable.email'] && <p className="text-sm text-red-500">{errors['responsable.email']}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configuration opérationnelle</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="horaires">Horaires d'ouverture</Label>
                <Input
                  id="horaires"
                  value={formData.horaires}
                  onChange={(e) => handleInputChange('horaires', e.target.value)}
                  placeholder="08:00-18:00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commission">Taux de commission (%)</Label>
                <Input
                  id="commission"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.commission}
                  onChange={(e) => handleInputChange('commission', parseFloat(e.target.value) || 0)}
                  className={errors.commission ? 'border-red-500' : ''}
                />
                {errors.commission && <p className="text-sm text-red-500">{errors.commission}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="limiteJournaliere">Limite journalière (XOF)</Label>
                <Input
                  id="limiteJournaliere"
                  type="number"
                  min="0"
                  value={formData.limiteJournaliere}
                  onChange={(e) => handleInputChange('limiteJournaliere', parseInt(e.target.value) || 0)}
                  className={errors.limiteJournaliere ? 'border-red-500' : ''}
                />
                {errors.limiteJournaliere && <p className="text-sm text-red-500">{errors.limiteJournaliere}</p>}
              </div>
            </CardContent>
          </Card>

          {/* GPS Coordinates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Coordonnées GPS (optionnel)
              </CardTitle>
              <CardDescription>
                Ces informations permettront la géolocalisation de l'agence
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.coordonnees.latitude}
                  onChange={(e) => handleInputChange('coordonnees.latitude', e.target.value)}
                  placeholder="14.6937"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.coordonnees.longitude}
                  onChange={(e) => handleInputChange('coordonnees.longitude', e.target.value)}
                  placeholder="-17.4441"
                />
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
            Créer l'agence
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
