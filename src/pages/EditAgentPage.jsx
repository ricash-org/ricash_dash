import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, X } from 'lucide-react'
import { RicashButton } from '@/components/ui/ricash-button'
import { RicashInput } from '@/components/ui/ricash-input'
import { RicashSelect } from '@/components/ui/ricash-input'
import { RicashCard } from '@/components/ui/ricash-card'

// Mock data pour l'édition d'agent
const mockAgentEdit = {
  AGT001: {
    id: 'AGT001',
    nom: 'Sarr',
    prenom: 'Ibrahima',
    telephone: '+221 77 123 45 67',
    email: 'ibrahima.sarr@ricash.com',
    statut: 'actif',
    dateEmbauche: '2023-01-15',
    poste: 'Agent Principal',
    niveau: 'Senior',
    agence: 'AGE001',
    salaire: 320000,
    adresse: 'Mermoz, Dakar',
    dateNaissance: '1985-03-15',
    cni: '1234567890123'
  },
  AGT002: {
    id: 'AGT002',
    nom: 'Diop',
    prenom: 'Mariam',
    telephone: '+221 76 987 65 43',
    email: 'mariam.diop@ricash.com',
    statut: 'actif',
    dateEmbauche: '2023-02-20',
    poste: 'Agent Caissier',
    niveau: 'Intermédiaire',
    agence: 'AGE001',
    salaire: 280000,
    adresse: 'Ouakam, Dakar',
    dateNaissance: '1990-07-22',
    cni: '9876543210987'
  },
  AGT003: {
    id: 'AGT003',
    nom: 'Diallo',
    prenom: 'Ousmane',
    telephone: '+221 78 456 78 90',
    email: 'ousmane.diallo@ricash.com',
    statut: 'formation',
    dateEmbauche: '2024-01-10',
    poste: 'Agent Stagiaire',
    niveau: 'Junior',
    agence: 'AGE002',
    salaire: 200000,
    adresse: 'Thiès Centre',
    dateNaissance: '1995-11-08',
    cni: '4567890123456'
  },
  AGT004: {
    id: 'AGT004',
    nom: 'Ndiaye',
    prenom: 'Fatou',
    telephone: '+221 77 789 01 23',
    email: 'fatou.ndiaye@ricash.com',
    statut: 'conge',
    dateEmbauche: '2022-08-15',
    poste: 'Agent Principal',
    niveau: 'Senior',
    agence: 'AGE003',
    salaire: 350000,
    adresse: 'Saint-Louis Centre',
    dateNaissance: '1988-04-12',
    cni: '7890123456789'
  },
  AGT005: {
    id: 'AGT005',
    nom: 'Ba',
    prenom: 'Mamadou',
    telephone: '+221 76 321 54 67',
    email: 'mamadou.ba@ricash.com',
    statut: 'inactif',
    dateEmbauche: '2022-03-10',
    poste: 'Agent Caissier',
    niveau: 'Intermédiaire',
    agence: 'AGE001',
    salaire: 250000,
    adresse: 'Yoff, Dakar',
    dateNaissance: '1992-09-25',
    cni: '3216549870123'
  }
}

export default function EditAgentPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  
  const agent = mockAgentEdit[id]
  
  const [formData, setFormData] = useState({
    nom: agent?.nom || '',
    prenom: agent?.prenom || '',
    telephone: agent?.telephone || '',
    email: agent?.email || '',
    statut: agent?.statut || 'actif',
    poste: agent?.poste || '',
    niveau: agent?.niveau || 'Junior',
    agence: agent?.agence || '',
    salaire: agent?.salaire || 0,
    adresse: agent?.adresse || '',
    dateNaissance: agent?.dateNaissance || '',
    cni: agent?.cni || ''
  })

  if (!agent) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <RicashButton
            variant="outline"
            onClick={() => navigate('/app/agents')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux agents
          </RicashButton>
        </div>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Agent non trouvé</h2>
          <p className="text-gray-600">L'agent avec l'ID {id} n'existe pas.</p>
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
    navigate('/app/agents')
  }

  const handleCancel = () => {
    navigate('/app/agents')
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
              Modifier l'agent
            </h1>
            <p className="text-[#376470]">Agent ID: {agent.id}</p>
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
          {/* Personal Information */}
          <RicashCard className="p-6">
            <h3 className="text-lg font-semibold text-[#29475B] mb-4">
              Informations personnelles
            </h3>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-[#29475B] mb-2">
                    Prénom
                  </label>
                  <RicashInput
                    value={formData.prenom}
                    onChange={(e) => handleInputChange('prenom', e.target.value)}
                    placeholder="Prénom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#29475B] mb-2">
                    Nom
                  </label>
                  <RicashInput
                    value={formData.nom}
                    onChange={(e) => handleInputChange('nom', e.target.value)}
                    placeholder="Nom"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#29475B] mb-2">
                  Téléphone
                </label>
                <RicashInput
                  value={formData.telephone}
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
                  placeholder="+221 77 123 45 67"
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
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-[#29475B] mb-2">
                    Date de naissance
                  </label>
                  <RicashInput
                    type="date"
                    value={formData.dateNaissance}
                    onChange={(e) => handleInputChange('dateNaissance', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#29475B] mb-2">
                    CNI
                  </label>
                  <RicashInput
                    value={formData.cni}
                    onChange={(e) => handleInputChange('cni', e.target.value)}
                    placeholder="1234567890123"
                  />
                </div>
              </div>
            </div>
          </RicashCard>

          {/* Professional Information */}
          <RicashCard className="p-6">
            <h3 className="text-lg font-semibold text-[#29475B] mb-4">
              Informations professionnelles
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
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                  <option value="conge">En congé</option>
                  <option value="formation">En formation</option>
                </RicashSelect>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#29475B] mb-2">
                  Poste
                </label>
                <RicashSelect
                  value={formData.poste}
                  onChange={(e) => handleInputChange('poste', e.target.value)}
                >
                  <option value="Agent Principal">Agent Principal</option>
                  <option value="Agent Caissier">Agent Caissier</option>
                  <option value="Agent Stagiaire">Agent Stagiaire</option>
                </RicashSelect>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#29475B] mb-2">
                  Niveau
                </label>
                <RicashSelect
                  value={formData.niveau}
                  onChange={(e) => handleInputChange('niveau', e.target.value)}
                >
                  <option value="Junior">Junior</option>
                  <option value="Intermédiaire">Intermédiaire</option>
                  <option value="Senior">Senior</option>
                </RicashSelect>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#29475B] mb-2">
                  Agence
                </label>
                <RicashSelect
                  value={formData.agence}
                  onChange={(e) => handleInputChange('agence', e.target.value)}
                >
                  <option value="AGE001">Ricash Dakar Centre</option>
                  <option value="AGE002">Ricash Thiès</option>
                  <option value="AGE003">Ricash Saint-Louis</option>
                </RicashSelect>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#29475B] mb-2">
                  Salaire (FCFA)
                </label>
                <RicashInput
                  type="number"
                  value={formData.salaire}
                  onChange={(e) => handleInputChange('salaire', parseInt(e.target.value))}
                  placeholder="320000"
                />
              </div>
            </div>
          </RicashCard>
        </div>
      </form>
    </div>
  )
}
