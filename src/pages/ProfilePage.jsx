
import React, { useState, useEffect, useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  User, Mail, Phone, MapPin, Calendar, Shield, Edit, Save, X, 
  Camera, Key, Bell, Globe, Lock, Eye, EyeOff
} from 'lucide-react'
import { RicashCard } from '@/components/ui/ricash-card'
import { RicashButton } from '@/components/ui/ricash-button'
import { RicashInput } from '@/components/ui/ricash-input'
import { RicashTabs, RicashTabsContent, RicashTabsList, RicashTabsTrigger } from '@/components/ui/ricash-navigation'
import { AuthContext } from '@/hooks/useAuth'
import profileService from '@/services/profilService'

// Palette de couleurs Ricash
const RICASH_COLORS = {
  bleuFonce: '#29475B',
  dore: '#B19068',
  turquoise: '#2B8286',
  blancCasse: '#F4F2EE',
  bleuVert: '#376470'
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user: authUser, updateUser } = useContext(AuthContext)
  
  // Référence pour l'input file
  const fileInputRef = useRef(null)
  
  // États existants
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('initial')

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [user, setUser] = useState(() => {
    return authUser ? {
      ...authUser,
      preferences: authUser.preferences || {
        langue: 'fr',
        timezone: 'Europe/Paris',
        notifications: {
          email: true,
          sms: false,
          push: true
        }
      },
      adresse: authUser.adresse || {
        rue: '',
        ville: '',
        codePostal: '',
        pays: ''
      }
    } : null;
  });

  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
    dateNaissance: user?.dateNaissance || '',
    adresse: { ...(user?.adresse || {}) }
  });

  const [message, setMessage] = useState({ type: '', text: '' })

  // Fonction pour sauvegarder l'image dans le localStorage
  const saveImageToLocalStorage = (imageData) => {
    try {
      localStorage.setItem(`profileImage_${user?.id}`, imageData)
      return true
    } catch (error) {
      console.error('Erreur sauvegarde locale:', error)
      return false
    }
  }

  // Fonction pour récupérer l'image du localStorage
  const getImageFromLocalStorage = () => {
    try {
      return localStorage.getItem(`profileImage_${user?.id}`)
    } catch (error) {
      console.error('Erreur lecture locale:', error)
      return null
    }
  }

  // Fonction pour gérer la sélection d'image
  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validation
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Veuillez sélectionner une image valide' })
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'L\'image ne doit pas dépasser 5MB' })
        return
      }
      
      setProfileImage(file)
      
      // Créer preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
        
        // Sauvegarder automatiquement dans le localStorage
        try {
          localStorage.setItem(`profileImage_${user?.id}`, e.target.result)
          setMessage({ type: 'success', text: 'Photo de profil mise à jour!' })
          
          // Mettre à jour l'affichage immédiatement
          const updatedUser = { ...user, profileImageUrl: e.target.result }
          setUser(updatedUser)
          updateUser(updatedUser)
          
          setTimeout(() => setMessage({ type: '', text: '' }), 3000)
        } catch (error) {
          setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  // Protection contre les accès à des propriétés undefined
  const getNotifications = () => {
    return user?.preferences?.notifications || {
      email: true,
      sms: false,
      push: true
    };
  }

  // Charger les données du profil au montage du composant
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const token = sessionStorage.getItem('token')
        if (!token) {
          navigate('/login')
          return
        }

        const profileData = await profileService.getProfile(token)
        
        // Vérifier s'il y a une image sauvegardée localement
        const localImage = getImageFromLocalStorage()
        if (localImage) {
          profileData.profileImageUrl = localImage
          profileData.hasLocalImage = true
        }

        setUser(profileData)
        setFormData({
          nom: profileData.nom || '',
          prenom: profileData.prenom || '',
          email: profileData.email || '',
          telephone: profileData.telephone || '',
          dateNaissance: profileData.dateNaissance || '',
          adresse: profileData.adresse || { rue: '', ville: '', codePostal: '', pays: '' }
        })
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error)
        setMessage({ type: 'error', text: 'Erreur lors du chargement du profil' })
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [navigate])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: user.telephone,
      dateNaissance: user.dateNaissance,
      adresse: { ...user.adresse }
    })
    setMessage({ type: '', text: '' })
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const token = sessionStorage.getItem('token')
      
      // Préparer les données pour l'envoi
      const updates = {
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone,
        email: formData.email
      }

      const updatedUser = await profileService.updateProfile(updates, token)
      setUser(updatedUser)
      
      // Mettre à jour le contexte d'authentification
      updateUser(updatedUser)
      
      setIsEditing(false)
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès' })
      
      // Effacer le message après 3 secondes
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du profil' })
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' })
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' })
      return
    }

    try {
      setSaving(true)
      const token = sessionStorage.getItem('token')
      
      await profileService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, token)
      
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setMessage({ type: 'success', text: 'Mot de passe changé avec succès' })
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error)
      setMessage({ type: 'error', text: 'Erreur lors du changement de mot de passe' })
    } finally {
      setSaving(false)
    }
  }

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
  }

  const handlePasswordInputChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Non renseignée'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F4F2EE]">
        <div className="text-[#29475B]">Chargement du profil...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F4F2EE]">
        <div className="text-[#29475B]">Erreur de chargement du profil</div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6 bg-[#F4F2EE] min-h-screen">
      {/* Message de statut */}
      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Page header */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#376470]/10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#29475B] mb-2">
              Mon Profil
            </h1>
            <p className="text-lg text-[#376470] font-medium">
              Gérez vos informations personnelles et paramètres
            </p>
          </div>
          <div className="flex gap-3">
            {!isEditing ? (
              <RicashButton
                variant="accent"
                size="lg"
                onClick={handleEdit}
                disabled={saving}
              >
                <Edit className="mr-2 h-5 w-5" />
                {saving ? 'Sauvegarde...' : 'Modifier le profil'}
              </RicashButton>
            ) : (
              <>
                <RicashButton
                  variant="outline"
                  size="lg"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <X className="mr-2 h-5 w-5" />
                  Annuler
                </RicashButton>
                <RicashButton
                  variant="accent"
                  size="lg"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Save className="mr-2 h-5 w-5" />
                  {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </RicashButton>
              </>
            )}
          </div>
        </div>
      </div>

      <RicashTabs defaultValue="personal" className="w-full">
        <RicashTabsList className="grid w-full grid-cols-3 bg-white rounded-2xl shadow-lg border border-[#376470]/10">
          <RicashTabsTrigger value="personal" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Informations personnelles</span>
          </RicashTabsTrigger>
          <RicashTabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Sécurité</span>
          </RicashTabsTrigger>
          <RicashTabsTrigger value="preferences" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Préférences</span>
          </RicashTabsTrigger>
        </RicashTabsList>

        {/* Onglet Informations personnelles */}
        <RicashTabsContent value="personal" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Photo de profil */}
            <RicashCard className="lg:col-span-1">
              <div className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  {imagePreview || user?.profileImageUrl ? (
                    <img 
                      src={imagePreview || user.profileImageUrl} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#2B8286] to-[#B19068] flex items-center justify-center text-white text-4xl font-bold mx-auto border-4 border-white shadow-lg">
                      {user.prenom?.charAt(0) || ''}{user.nom?.charAt(0) || ''}
                    </div>
                  )}
                  
                  {isEditing && (
                    <>
                      <button 
                        onClick={handleImageClick}
                        className="absolute bottom-2 right-2 w-8 h-8 bg-[#2B8286] text-white rounded-full flex items-center justify-center hover:bg-[#2B8286]/90 transition-colors shadow-lg"
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                      
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                        accept="image/*"
                        className="hidden"
                      />
                    </>
                  )}
                </div>
                <h3 className="text-xl font-bold text-[#29475B] mb-1">
                  {user.prenom} {user.nom}
                </h3>
                <p className="text-[#376470] mb-4">{user.role}</p>
                <div className="space-y-2 text-sm text-[#376470]">
                  <p>Email: {user.email}</p>
                  {user.dateCreation && (
                    <p>Membre depuis {formatDate(user.dateCreation)}</p>
                  )}
                </div>
              </div>
            </RicashCard>

            {/* Informations détaillées - Formulaire dynamique */}
            <RicashCard className="lg:col-span-2">
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#29475B] mb-6">
                  Informations personnelles
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Les champs de formulaire restent similaires mais utilisent formData */}
                  <div>
                    <label className="block text-sm font-medium text-[#29475B] mb-2">
                      Prénom
                    </label>
                    {isEditing ? (
                      <RicashInput
                        value={formData.prenom}
                        onChange={(e) => handleInputChange('prenom', e.target.value)}
                        placeholder="Votre prénom"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-[#F4F2EE] rounded-lg">
                        <User className="h-4 w-4 text-[#376470] mr-3" />
                        <span className="text-[#29475B]">{user.prenom}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#29475B] mb-2">
                      Nom
                    </label>
                    {isEditing ? (
                      <RicashInput
                        value={formData.nom}
                        onChange={(e) => handleInputChange('nom', e.target.value)}
                        placeholder="Votre nom"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-[#F4F2EE] rounded-lg">
                        <User className="h-4 w-4 text-[#376470] mr-3" />
                        <span className="text-[#29475B]">{user.nom}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#29475B] mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <RicashInput
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="votre@email.com"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-[#F4F2EE] rounded-lg">
                        <Mail className="h-4 w-4 text-[#376470] mr-3" />
                        <span className="text-[#29475B]">{user.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#29475B] mb-2">
                      Téléphone
                    </label>
                    {isEditing ? (
                      <RicashInput
                        value={formData.telephone}
                        onChange={(e) => handleInputChange('telephone', e.target.value)}
                        placeholder="+33 6 12 34 56 78"
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-[#F4F2EE] rounded-lg">
                        <Phone className="h-4 w-4 text-[#376470] mr-3" />
                        <span className="text-[#29475B]">{user.telephone}</span>
                      </div>
                    )}
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-[#29475B] mb-2">
                      Adresse
                    </label>
                    {isEditing ? (
                      <div className="space-y-3">
                        <RicashInput
                          value={formData.adresse.rue}
                          onChange={(e) => handleInputChange('adresse.rue', e.target.value)}
                          placeholder="Rue et numéro"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <RicashInput
                            value={formData.adresse.codePostal}
                            onChange={(e) => handleInputChange('adresse.codePostal', e.target.value)}
                            placeholder="Code postal"
                          />
                          <RicashInput
                            value={formData.adresse.ville}
                            onChange={(e) => handleInputChange('adresse.ville', e.target.value)}
                            placeholder="Ville"
                          />
                        </div>
                        <RicashInput
                          value={formData.adresse.pays}
                          onChange={(e) => handleInputChange('adresse.pays', e.target.value)}
                          placeholder="Pays"
                        />
                      </div>
                    ) : (
                      <div className="flex items-start p-3 bg-[#F4F2EE] rounded-lg">
                        <MapPin className="h-4 w-4 text-[#376470] mr-3 mt-1" />
                        <div className="text-[#29475B]">
                          <div>{user.adresse.rue}</div>
                          <div>{user.adresse.codePostal} {user.adresse.ville}</div>
                          <div>{user.adresse.pays}</div>
                        </div>
                      </div>
                    )}
                  </div> */}
                </div>
              </div>
            </RicashCard>
          </div>
        </RicashTabsContent>

        {/* Onglet Sécurité - Maintenant fonctionnel */}
        <RicashTabsContent value="security" className="space-y-6">
          <RicashCard>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#29475B] mb-6">
                Sécurité du compte
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#29475B] mb-2">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <RicashInput
                      type={showPassword ? "text" : "password"}
                      placeholder="Entrez votre mot de passe actuel"
                      className="pr-10"
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-[#376470]" />
                      ) : (
                        <Eye className="h-4 w-4 text-[#376470]" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#29475B] mb-2">
                    Nouveau mot de passe
                  </label>
                  <RicashInput
                    type="password"
                    placeholder="Entrez votre nouveau mot de passe"
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#29475B] mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <RicashInput
                    type="password"
                    placeholder="Confirmez votre nouveau mot de passe"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                  />
                </div>

                <RicashButton 
                  variant="accent" 
                  onClick={handlePasswordChange}
                  disabled={saving}
                >
                  <Key className="mr-2 h-4 w-4" />
                  {saving ? 'Changement...' : 'Changer le mot de passe'}
                </RicashButton>
              </div>
            </div>
          </RicashCard>
        </RicashTabsContent>

        {/* Onglet Sécurité */}
        <RicashTabsContent value="security" className="space-y-6">
          <RicashCard>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#29475B] mb-6">
                Sécurité du compte
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#29475B] mb-2">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <RicashInput
                      type={showPassword ? "text" : "password"}
                      placeholder="Entrez votre mot de passe actuel"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-[#376470]" />
                      ) : (
                        <Eye className="h-4 w-4 text-[#376470]" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#29475B] mb-2">
                    Nouveau mot de passe
                  </label>
                  <RicashInput
                    type="password"
                    placeholder="Entrez votre nouveau mot de passe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#29475B] mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <RicashInput
                    type="password"
                    placeholder="Confirmez votre nouveau mot de passe"
                  />
                </div>

                <RicashButton variant="accent">
                  <Key className="mr-2 h-4 w-4" />
                  Changer le mot de passe
                </RicashButton>
              </div>
            </div>
          </RicashCard>

          <RicashCard>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#29475B] mb-6">
                Authentification à deux facteurs
              </h3>
              <div className="flex items-center justify-between p-4 bg-[#F4F2EE] rounded-lg">
                <div>
                  <h4 className="font-medium text-[#29475B]">2FA activé</h4>
                  <p className="text-sm text-[#376470]">Votre compte est protégé par l'authentification à deux facteurs</p>
                </div>
                <RicashButton variant="outline" size="sm">
                  <Shield className="mr-2 h-4 w-4" />
                  Gérer
                </RicashButton>
              </div>
            </div>
          </RicashCard>
        </RicashTabsContent>

        {/* Onglet Préférences */}
        <RicashTabsContent value="preferences" className="space-y-6">
          <RicashCard>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#29475B] mb-6">
                Préférences de notification
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#F4F2EE] rounded-lg">
                  <div>
                    <h4 className="font-medium text-[#29475B]">Notifications par email</h4>
                    <p className="text-sm text-[#376470]">Recevoir des notifications importantes par email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={getNotifications().email}
                    className="w-4 h-4 text-[#2B8286] rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#F4F2EE] rounded-lg">
                  <div>
                    <h4 className="font-medium text-[#29475B]">Notifications SMS</h4>
                    <p className="text-sm text-[#376470]">Recevoir des alertes par SMS</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={getNotifications().sms} 
                    className="w-4 h-4 text-[#2B8286] rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#F4F2EE] rounded-lg">
                  <div>
                    <h4 className="font-medium text-[#29475B]">Notifications push</h4>
                    <p className="text-sm text-[#376470]">Recevoir des notifications dans l'application</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={getNotifications().push}
                    className="w-4 h-4 text-[#2B8286] rounded"
                  />
                </div>
              </div>
            </div>
          </RicashCard>

          <RicashCard>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#29475B] mb-6">
                Paramètres de langue et région
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-[#29475B] mb-2">
                    Langue
                  </label>
                  <select className="w-full p-3 border border-[#376470]/20 rounded-lg bg-white">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#29475B] mb-2">
                    Fuseau horaire
                  </label>
                  <select className="w-full p-3 border border-[#376470]/20 rounded-lg bg-white">
                    <option value="Europe/Paris">Europe/Paris</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="America/New_York">America/New_York</option>
                  </select>
                </div>
              </div>
            </div>
          </RicashCard>
        </RicashTabsContent>
      </RicashTabs>
    </div>
  )
}
