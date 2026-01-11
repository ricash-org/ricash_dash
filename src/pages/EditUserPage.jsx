import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, X } from 'lucide-react'
import { RicashButton } from '@/components/ui/ricash-button'
import { RicashInput } from '@/components/ui/ricash-input'
import { RicashSelect } from '@/components/ui/ricash-input'
import { RicashCard } from '@/components/ui/ricash-card'

// Mock data pour l'édition d'utilisateur
const mockUserEdit = {
  USR001: {
    id: 'USR001',
    nom: 'Diallo',
    prenom: 'Aminata',
    email: 'aminata.diallo@email.com',
    telephone: '+221 77 123 45 67',
    pays: 'Sénégal',
    ville: 'Dakar',
    adresse: 'Mermoz, Dakar',
    dateNaissance: '1990-05-15',
    statut: 'actif',
    kycStatus: 'valide',
    typeCompte: 'Premium',
    limiteJournaliere: 500000,
    limiteMensuelle: 10000000
  },
  USR002: {
    id: 'USR002',
    nom: 'Ba',
    prenom: 'Moussa',
    email: 'moussa.ba@email.com',
    telephone: '+221 76 987 65 43',
    pays: 'Sénégal',
    ville: 'Thiès',
    adresse: 'Thiès Centre',
    dateNaissance: '1985-08-22',
    statut: 'suspendu',
    kycStatus: 'en_cours',
    typeCompte: 'Standard',
    limiteJournaliere: 200000,
    limiteMensuelle: 2000000
  },
  USR003: {
    id: 'USR003',
    nom: 'Ndiaye',
    prenom: 'Fatou',
    email: 'fatou.ndiaye@email.com',
    telephone: '+221 78 456 78 90',
    pays: 'Sénégal',
    ville: 'Saint-Louis',
    adresse: 'Saint-Louis Centre',
    dateNaissance: '1992-12-08',
    statut: 'actif',
    kycStatus: 'valide',
    typeCompte: 'Premium',
    limiteJournaliere: 300000,
    limiteMensuelle: 5000000
  },
  USR004: {
    id: 'USR004',
    nom: 'Sarr',
    prenom: 'Ibrahima',
    email: 'ibrahima.sarr@email.com',
    telephone: '+221 77 789 01 23',
    pays: 'Sénégal',
    ville: 'Kaolack',
    adresse: 'Kaolack Centre',
    dateNaissance: '1988-04-12',
    statut: 'actif',
    kycStatus: 'valide',
    typeCompte: 'Standard',
    limiteJournaliere: 150000,
    limiteMensuelle: 3000000
  },
  USR005: {
    id: 'USR005',
    nom: 'Fall',
    prenom: 'Mariam',
    email: 'mariam.fall@email.com',
    telephone: '+221 76 321 54 67',
    pays: 'Sénégal',
    ville: 'Ziguinchor',
    adresse: 'Ziguinchor Centre',
    dateNaissance: '1995-11-25',
    statut: 'suspendu',
    kycStatus: 'rejete',
    typeCompte: 'Standard',
    limiteJournaliere: 0,
    limiteMensuelle: 0
  }
}

export default function EditUserPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  
  const userData = mockUserEdit[id]
  
  if (!userData) {
    return (
      <div className="min-h-screen bg-[#F4F2EE] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-[#29475B] mb-4">Utilisateur non trouvé</h1>
            <p className="text-[#376470] mb-6">L'utilisateur avec l'ID "{id}" n'existe pas.</p>
            <RicashButton onClick={() => navigate('/app/users')}>
              Retour à la liste des utilisateurs
            </RicashButton>
          </div>
        </div>
      </div>
    )
  }

  const [formData, setFormData] = useState({
    nom: userData.nom,
    prenom: userData.prenom,
    email: userData.email,
    telephone: userData.telephone,
    pays: userData.pays,
    ville: userData.ville,
    adresse: userData.adresse,
    dateNaissance: userData.dateNaissance,
    statut: userData.statut,
    kycStatus: userData.kycStatus,
    typeCompte: userData.typeCompte,
    limiteJournaliere: userData.limiteJournaliere,
    limiteMensuelle: userData.limiteMensuelle
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simuler une sauvegarde
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('Utilisateur mis à jour:', formData)
    setIsLoading(false)
    
    // Rediriger vers les détails
    navigate(`/app/users/${id}/details`)
  }

  const handleCancel = () => {
    navigate(`/app/users/${id}/details`)
  }

  return (
    <div className="min-h-screen bg-[#F4F2EE] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <RicashButton
              variant="outline"
              onClick={() => navigate('/app/users')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux utilisateurs
            </RicashButton>
            <div>
              <h1 className="text-3xl font-bold text-[#29475B]">
                Modifier {formData.prenom} {formData.nom}
              </h1>
              <p className="text-[#376470]">ID: {id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <RicashButton
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Annuler
            </RicashButton>
            <RicashButton
              onClick={handleSubmit}
              loading={isLoading}
              loadingText="Sauvegarde..."
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Sauvegarder
            </RicashButton>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations personnelles */}
          <RicashCard className="p-6">
            <h3 className="text-lg font-semibold text-[#29475B] mb-4">Informations personnelles</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <RicashInput
                label="Nom"
                value={formData.nom}
                onChange={(e) => handleInputChange('nom', e.target.value)}
                required
              />
              <RicashInput
                label="Prénom"
                value={formData.prenom}
                onChange={(e) => handleInputChange('prenom', e.target.value)}
                required
              />
              <RicashInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
              <RicashInput
                label="Téléphone"
                value={formData.telephone}
                onChange={(e) => handleInputChange('telephone', e.target.value)}
                required
              />
              <RicashSelect
                label="Pays"
                value={formData.pays}
                onChange={(e) => handleInputChange('pays', e.target.value)}
                options={[
                  { value: 'Sénégal', label: 'Sénégal' },
                  { value: 'Mali', label: 'Mali' },
                  { value: 'Burkina Faso', label: 'Burkina Faso' },
                  { value: 'Côte d\'Ivoire', label: 'Côte d\'Ivoire' }
                ]}
              />
              <RicashInput
                label="Ville"
                value={formData.ville}
                onChange={(e) => handleInputChange('ville', e.target.value)}
                required
              />
              <RicashInput
                label="Adresse"
                value={formData.adresse}
                onChange={(e) => handleInputChange('adresse', e.target.value)}
                className="md:col-span-2"
              />
              <RicashInput
                label="Date de naissance"
                type="date"
                value={formData.dateNaissance}
                onChange={(e) => handleInputChange('dateNaissance', e.target.value)}
                required
              />
            </div>
          </RicashCard>

          {/* Informations du compte */}
          <RicashCard className="p-6">
            <h3 className="text-lg font-semibold text-[#29475B] mb-4">Informations du compte</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <RicashSelect
                label="Statut"
                value={formData.statut}
                onChange={(e) => handleInputChange('statut', e.target.value)}
                options={[
                  { value: 'actif', label: 'Actif' },
                  { value: 'suspendu', label: 'Suspendu' },
                  { value: 'en_attente', label: 'En attente' }
                ]}
              />
              <RicashSelect
                label="Statut KYC"
                value={formData.kycStatus}
                onChange={(e) => handleInputChange('kycStatus', e.target.value)}
                options={[
                  { value: 'valide', label: 'Validé' },
                  { value: 'en_cours', label: 'En cours' },
                  { value: 'rejete', label: 'Rejeté' }
                ]}
              />
              <RicashSelect
                label="Type de compte"
                value={formData.typeCompte}
                onChange={(e) => handleInputChange('typeCompte', e.target.value)}
                options={[
                  { value: 'Standard', label: 'Standard' },
                  { value: 'Premium', label: 'Premium' },
                  { value: 'VIP', label: 'VIP' }
                ]}
              />
              <RicashInput
                label="Limite journalière (€)"
                type="number"
                value={formData.limiteJournaliere}
                onChange={(e) => handleInputChange('limiteJournaliere', parseInt(e.target.value) || 0)}
                min="0"
              />
              <RicashInput
                label="Limite mensuelle (€)"
                type="number"
                value={formData.limiteMensuelle}
                onChange={(e) => handleInputChange('limiteMensuelle', parseInt(e.target.value) || 0)}
                min="0"
                className="md:col-span-2"
              />
            </div>
          </RicashCard>
        </form>
      </div>
    </div>
  )
}

