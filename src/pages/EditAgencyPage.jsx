import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, X } from 'lucide-react'
import { RicashButton } from '@/components/ui/ricash-button'
import { RicashInput } from '@/components/ui/ricash-input'
import { RicashSelect } from '@/components/ui/ricash-input'
import { RicashCard } from '@/components/ui/ricash-card'

// Mock data pour l'édition d'agence
const mockAgencyEdit = {
  AGE001: {
    id: 'AGE001',
    nom: 'Ricash Dakar Centre',
    ville: 'Dakar',
    adresse: '15 Avenue Georges Pompidou, Plateau',
    telephone: '+221 33 821 45 67',
    email: 'dakar.centre@ricash.com',
    statut: 'active',
    dateOuverture: '2023-01-15',
    nombreAgents: 12,
    manager: 'Amadou Diallo'
  },
  AGE002: {
    id: 'AGE002',
    nom: 'Ricash Touba',
    ville: 'Touba',
    adresse: 'Avenue Cheikh Ahmadou Bamba, Centre',
    telephone: '+221 33 975 12 34',
    email: 'touba@ricash.com',
    statut: 'active',
    dateOuverture: '2023-03-20',
    nombreAgents: 8,
    manager: 'Fatou Ndiaye'
  },
  AGE003: {
    id: 'AGE003',
    nom: 'Ricash Saint-Louis',
    ville: 'Saint-Louis',
    adresse: 'Rue de la République, Sor',
    telephone: '+221 33 961 23 45',
    email: 'saintlouis@ricash.com',
    statut: 'active',
    dateOuverture: '2023-05-10',
    nombreAgents: 6,
    manager: 'Moussa Fall'
  },
  AGE004: {
    id: 'AGE004',
    nom: 'Ricash Thiès',
    ville: 'Thiès',
    adresse: 'Avenue de la Gare, Centre',
    telephone: '+221 33 951 34 56',
    email: 'thies@ricash.com',
    statut: 'maintenance',
    dateOuverture: '2023-07-15',
    nombreAgents: 5,
    manager: 'Aminata Ba'
  },
  AGE005: {
    id: 'AGE005',
    nom: 'Ricash Kaolack',
    ville: 'Kaolack',
    adresse: 'Boulevard du Centenaire',
    telephone: '+221 33 941 45 67',
    email: 'kaolack@ricash.com',
    statut: 'suspendue',
    dateOuverture: '2023-09-01',
    nombreAgents: 4,
    manager: 'Ibrahima Sarr'
  }
}

export default function EditAgencyPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  
  const agency = mockAgencyEdit[id]
  
  const [formData, setFormData] = useState({
    nom: agency?.nom || '',
    ville: agency?.ville || '',
    adresse: agency?.adresse || '',
    telephone: agency?.telephone || '',
    email: agency?.email || '',
    statut: agency?.statut || 'active',
    dateOuverture: agency?.dateOuverture || '',
    nombreAgents: agency?.nombreAgents || 0,
    manager: agency?.manager || ''
  })

  if (!agency) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <RicashButton
            variant="outline"
            onClick={() => navigate('/app/agencies')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux agences
          </RicashButton>
        </div>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Agence non trouvée</h2>
          <p className="text-gray-600">L'agence avec l'ID {id} n'existe pas.</p>
        </div>
      </div>
    )
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simuler la sauvegarde
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    navigate('/app/agencies')
  }

  const handleCancel = () => {
    navigate('/app/agencies')
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <RicashButton
            variant="outline"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </RicashButton>
          <div>
            <h1 className="text-3xl font-bold text-[#29475B]">
              Modifier l'agence
            </h1>
            <p className="text-[#376470]">Agence ID: {agency.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <RicashButton variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Annuler
          </RicashButton>
          <RicashButton 
            variant="accent" 
            onClick={handleSubmit}
            loading={isLoading}
            loadingText="Sauvegarde..."
          >
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </RicashButton>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Agency Information */}
          <RicashCard className="p-6">
            <h3 className="text-lg font-semibold text-[#29475B] mb-4">
              Informations de l'agence
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#29475B] mb-2">
                  Nom de l'agence
                </label>
                <RicashInput
                  value={formData.nom}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                  placeholder="Nom de l'agence"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#29475B] mb-2">
                  Ville
                </label>
                <RicashSelect
                  value={formData.ville}
                  onChange={(e) => handleInputChange('ville', e.target.value)}
                >
                  <option value="Dakar">Dakar</option>
                  <option value="Thiès">Thiès</option>
                  <option value="Saint-Louis">Saint-Louis</option>
                  <option value="Kaolack">Kaolack</option>
                  <option value="Ziguinchor">Ziguinchor</option>
                </RicashSelect>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#29475B] mb-2">
                  Adresse
                </label>
                <RicashInput
                  value={formData.adresse}
                  onChange={(e) => handleInputChange('adresse', e.target.value)}
                  placeholder="Adresse complète"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#29475B] mb-2">
                  Téléphone
                </label>
                <RicashInput
                  value={formData.telephone}
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
                  placeholder="+221 33 123 45 67"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#29475B] mb-2">
                  Email
                </label>
                <RicashInput
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
            </div>
          </RicashCard>

          {/* Status and Management */}
          <RicashCard className="p-6">
            <h3 className="text-lg font-semibold text-[#29475B] mb-4">
              Statut et gestion
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#29475B] mb-2">
                  Statut
                </label>
                <RicashSelect
                  value={formData.statut}
                  onChange={(e) => handleInputChange('statut', e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="maintenance">En maintenance</option>
                  <option value="suspendue">Suspendue</option>
                </RicashSelect>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#29475B] mb-2">
                  Date d'ouverture
                </label>
                <RicashInput
                  type="date"
                  value={formData.dateOuverture}
                  onChange={(e) => handleInputChange('dateOuverture', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#29475B] mb-2">
                  Nombre d'agents
                </label>
                <RicashInput
                  type="number"
                  value={formData.nombreAgents}
                  onChange={(e) => handleInputChange('nombreAgents', parseInt(e.target.value))}
                  placeholder="12"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#29475B] mb-2">
                  Manager
                </label>
                <RicashSelect
                  value={formData.manager}
                  onChange={(e) => handleInputChange('manager', e.target.value)}
                >
                  <option value="Amadou Diallo">Amadou Diallo</option>
                  <option value="Fatou Traoré">Fatou Traoré</option>
                  <option value="Kofi Asante">Kofi Asante</option>
                </RicashSelect>
              </div>
            </div>
          </RicashCard>
        </div>
      </form>
    </div>
  )
}
