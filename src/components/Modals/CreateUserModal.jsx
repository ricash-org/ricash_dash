import { useState } from 'react'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin,
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

export default function CreateUserModal({ isOpen, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    codePostal: '',
    pays: '',
    dateNaissance: '',
    profession: '',
    statut: 'en_attente',
    role: 'user'
  })
  const [documents, setDocuments] = useState([])
  const [errors, setErrors] = useState({})

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    const newDocuments = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      type: 'document',
      size: file.size
    }))
    setDocuments(prev => [...prev, ...newDocuments])
  }

  const removeDocument = (id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis'
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis'
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide'
    if (!formData.telephone.trim()) newErrors.telephone = 'Le téléphone est requis'
    if (!formData.pays) newErrors.pays = 'Le pays est requis'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      const userData = {
        ...formData,
        id: `USR${Date.now()}`,
        dateCreation: new Date().toISOString().split('T')[0],
        derniereConnexion: 'Jamais',
        solde: 0,
        transactions: 0,
        kycStatus: 'non_verifie',
        documents: documents
      }
      onCreate?.(userData)
      onClose()
      // Reset form
      setFormData({
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
        adresse: '',
        ville: '',
        codePostal: '',
        pays: '',
        dateNaissance: '',
        profession: '',
        statut: 'en_attente',
        role: 'user'
      })
      setDocuments([])
      setErrors({})
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Plus className="h-5 w-5" />
            <span>Créer un nouvel utilisateur</span>
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer un nouveau compte utilisateur
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations personnelles</CardTitle>
              <CardDescription>
                Informations de base de l'utilisateur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => handleInputChange('prenom', e.target.value)}
                    placeholder="Entrez le prénom"
                    className={errors.prenom ? 'border-red-500' : ''}
                  />
                  {errors.prenom && <p className="text-sm text-red-500 mt-1">{errors.prenom}</p>}
                </div>
                <div>
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => handleInputChange('nom', e.target.value)}
                    placeholder="Entrez le nom"
                    className={errors.nom ? 'border-red-500' : ''}
                  />
                  {errors.nom && <p className="text-sm text-red-500 mt-1">{errors.nom}</p>}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="exemple@email.com"
                      className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="telephone">Téléphone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="telephone"
                      value={formData.telephone}
                      onChange={(e) => handleInputChange('telephone', e.target.value)}
                      placeholder="+33 6 12 34 56 78"
                      className={`pl-10 ${errors.telephone ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.telephone && <p className="text-sm text-red-500 mt-1">{errors.telephone}</p>}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="dateNaissance">Date de naissance</Label>
                  <Input
                    id="dateNaissance"
                    type="date"
                    value={formData.dateNaissance}
                    onChange={(e) => handleInputChange('dateNaissance', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="profession">Profession</Label>
                  <Input
                    id="profession"
                    value={formData.profession}
                    onChange={(e) => handleInputChange('profession', e.target.value)}
                    placeholder="Entrez la profession"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Adresse</CardTitle>
              <CardDescription>
                Informations de localisation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="adresse">Adresse complète</Label>
                <Textarea
                  id="adresse"
                  value={formData.adresse}
                  onChange={(e) => handleInputChange('adresse', e.target.value)}
                  placeholder="Entrez l'adresse complète"
                  rows={2}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="ville">Ville</Label>
                  <Input
                    id="ville"
                    value={formData.ville}
                    onChange={(e) => handleInputChange('ville', e.target.value)}
                    placeholder="Entrez la ville"
                  />
                </div>
                <div>
                  <Label htmlFor="codePostal">Code postal</Label>
                  <Input
                    id="codePostal"
                    value={formData.codePostal}
                    onChange={(e) => handleInputChange('codePostal', e.target.value)}
                    placeholder="12345"
                  />
                </div>
                <div>
                  <Label htmlFor="pays">Pays *</Label>
                  <SafeSelect
                    value={formData.pays}
                    onValueChange={(value) => handleInputChange('pays', value)}
                    placeholder="Sélectionnez un pays"
                    options={[
                      { value: 'france', label: 'France' },
                      { value: 'senegal', label: 'Sénégal' },
                      { value: 'mali', label: 'Mali' },
                      { value: 'cote_ivoire', label: 'Côte d\'Ivoire' },
                      { value: 'burkina_faso', label: 'Burkina Faso' },
                      { value: 'cameroun', label: 'Cameroun' }
                    ]}
                    triggerClassName={errors.pays ? 'border-red-500' : ''}
                  />
                  {errors.pays && <p className="text-sm text-red-500 mt-1">{errors.pays}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Paramètres du compte</CardTitle>
              <CardDescription>
                Configuration initiale du compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="statut">Statut initial</Label>
                  <SafeSelect
                    value={formData.statut}
                    onValueChange={(value) => handleInputChange('statut', value)}
                    placeholder="Sélectionnez un statut"
                    options={[
                      { value: 'en_attente', label: 'En attente' },
                      { value: 'actif', label: 'Actif' },
                      { value: 'suspendu', label: 'Suspendu' }
                    ]}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Rôle</Label>
                  <SafeSelect
                    value={formData.role}
                    onValueChange={(value) => handleInputChange('role', value)}
                    placeholder="Sélectionnez un rôle"
                    options={[
                      { value: 'user', label: 'Utilisateur' },
                      { value: 'agent', label: 'Agent' },
                      { value: 'admin', label: 'Administrateur' }
                    ]}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Documents</CardTitle>
              <CardDescription>
                Téléchargez les documents d'identité (optionnel)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="documents">Télécharger des documents</Label>
                <div className="mt-2">
                  <input
                    id="documents"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('documents').click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Sélectionner des fichiers
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Formats acceptés: PDF, JPG, PNG (max 5MB par fichier)
                </p>
              </div>

              {documents.length > 0 && (
                <div className="space-y-2">
                  <Label>Documents sélectionnés</Label>
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(doc.size)}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(doc.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="flex justify-end space-x-2">
            <Button onClick={handleSubmit}>
              <User className="h-4 w-4 mr-2" />
              Créer l'utilisateur
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

