import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Edit, 
  Save, 
  X, 
  Camera,
  Key,
  Bell,
  Globe,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react'
import { RicashCard } from '@/components/ui/ricash-card'
import { RicashButton } from '@/components/ui/ricash-button'
import { RicashInput } from '@/components/ui/ricash-input'
import { RicashTabs, RicashTabsContent, RicashTabsList, RicashTabsTrigger } from '@/components/ui/ricash-navigation'

// Palette de couleurs Ricash
const RICASH_COLORS = {
  bleuFonce: '#29475B',
  dore: '#B19068',
  turquoise: '#2B8286',
  blancCasse: '#F4F2EE',
  bleuVert: '#376470'
}

// Mock data utilisateur
const mockUser = {
  id: 'USR001',
  nom: 'Dupont',
  prenom: 'Jean',
  email: 'jean.dupont@email.com',
  telephone: '+33 6 12 34 56 78',
  dateNaissance: '1985-03-15',
  adresse: {
    rue: '123 Avenue des Champs-Élysées',
    ville: 'Paris',
    codePostal: '75008',
    pays: 'France'
  },
  avatar: null,
  role: 'Administrateur',
  dateCreation: '2024-01-15',
  derniereConnexion: '2024-01-20T14:30:00',
  preferences: {
    langue: 'fr',
    timezone: 'Europe/Paris',
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  }
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [user, setUser] = useState(mockUser)
  const [formData, setFormData] = useState({
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    telephone: user.telephone,
    dateNaissance: user.dateNaissance,
    adresse: { ...user.adresse }
  })

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
  }

  const handleSave = () => {
    setUser(prev => ({
      ...prev,
      ...formData
    }))
    setIsEditing(false)
    // Ici on enverrait les données au serveur
    console.log('Profil mis à jour:', formData)
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-8 p-6 bg-[#F4F2EE] min-h-screen">
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
              >
                <Edit className="mr-2 h-5 w-5" />
                Modifier le profil
              </RicashButton>
            ) : (
              <>
                <RicashButton
                  variant="outline"
                  size="lg"
                  onClick={handleCancel}
                >
                  <X className="mr-2 h-5 w-5" />
                  Annuler
                </RicashButton>
                <RicashButton
                  variant="accent"
                  size="lg"
                  onClick={handleSave}
                >
                  <Save className="mr-2 h-5 w-5" />
                  Sauvegarder
                </RicashButton>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Onglets de profil */}
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
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#2B8286] to-[#B19068] flex items-center justify-center text-white text-4xl font-bold mx-auto">
                    {user.prenom.charAt(0)}{user.nom.charAt(0)}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-2 right-2 w-8 h-8 bg-[#2B8286] text-white rounded-full flex items-center justify-center hover:bg-[#2B8286]/90 transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <h3 className="text-xl font-bold text-[#29475B] mb-1">
                  {user.prenom} {user.nom}
                </h3>
                <p className="text-[#376470] mb-4">{user.role}</p>
                <div className="space-y-2 text-sm text-[#376470]">
                  <p>Membre depuis {formatDate(user.dateCreation)}</p>
                  <p>Dernière connexion: {formatDate(user.derniereConnexion)}</p>
                </div>
              </div>
            </RicashCard>

            {/* Informations détaillées */}
            <RicashCard className="lg:col-span-2">
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#29475B] mb-6">
                  Informations personnelles
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
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

                  <div>
                    <label className="block text-sm font-medium text-[#29475B] mb-2">
                      Date de naissance
                    </label>
                    {isEditing ? (
                      <RicashInput
                        type="date"
                        value={formData.dateNaissance}
                        onChange={(e) => handleInputChange('dateNaissance', e.target.value)}
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-[#F4F2EE] rounded-lg">
                        <Calendar className="h-4 w-4 text-[#376470] mr-3" />
                        <span className="text-[#29475B]">{formatDate(user.dateNaissance)}</span>
                      </div>
                    )}
                  </div>

                  <div>
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
                  </div>
                </div>
              </div>
            </RicashCard>
          </div>
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
                    checked={user.preferences.notifications.email}
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
                    checked={user.preferences.notifications.sms}
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
                    checked={user.preferences.notifications.push}
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
