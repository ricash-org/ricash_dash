import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2, MapPin, Phone, Mail, Users, DollarSign, TrendingUp, Clock, Edit, MoreVertical } from 'lucide-react'
import { RicashButton } from '@/components/ui/ricash-button'
import { RicashCard } from '@/components/ui/ricash-card'
import { RicashStatusBadge } from '@/components/ui/ricash-table'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

// Mock data pour les détails d'agence
const mockAgencyDetails = {
  AGE001: {
    id: 'AGE001',
    nom: 'Ricash Dakar Centre',
    code: 'DKR-CTR-001',
    ville: 'Dakar',
    quartier: 'Plateau',
    adresse: '15 Avenue Georges Pompidou',
    telephone: '+221 33 821 45 67',
    email: 'dakar.centre@ricash.com',
    responsable: {
      nom: 'Amadou Diallo',
      telephone: '+221 77 123 45 67',
      email: 'amadou.diallo@ricash.com'
    },
    statut: 'active',
    typeAgence: 'principale',
    dateOuverture: '2023-01-15',
    nombreAgents: 12,
    limiteJournaliere: 500000,
    chiffreAffaires: 2500000,
    commission: 2.5,
    horaires: '08:00-18:00',
    coordonnees: {
      latitude: 14.6937,
      longitude: -17.4441
    },
    performance: {
      transactionsJour: 145,
      transactionsMois: 4350,
      chiffreAffairesMois: 2500000,
      tauxReussite: 98.5,
      satisfactionClient: 4.7
    }
  },
  AGE002: {
    id: 'AGE002',
    nom: 'Ricash Touba',
    code: 'TBA-001',
    ville: 'Touba',
    quartier: 'Centre',
    adresse: 'Avenue Cheikh Ahmadou Bamba',
    telephone: '+221 33 975 12 34',
    email: 'touba@ricash.com',
    responsable: {
      nom: 'Fatou Ndiaye',
      telephone: '+221 76 987 65 43',
      email: 'fatou.ndiaye@ricash.com'
    },
    statut: 'active',
    typeAgence: 'secondaire',
    dateOuverture: '2023-03-20',
    nombreAgents: 8,
    limiteJournaliere: 300000,
    chiffreAffaires: 1800000,
    commission: 2.0,
    horaires: '08:00-17:00',
    coordonnees: {
      latitude: 14.8606,
      longitude: -15.8817
    },
    performance: {
      transactionsJour: 95,
      transactionsMois: 2850,
      chiffreAffairesMois: 1800000,
      tauxReussite: 97.2,
      satisfactionClient: 4.5
    }
  },
  AGE003: {
    id: 'AGE003',
    nom: 'Ricash Saint-Louis',
    code: 'STL-001',
    ville: 'Saint-Louis',
    quartier: 'Sor',
    adresse: 'Rue Abdoulaye Mar Diop',
    telephone: '+221 33 961 78 90',
    email: 'saintlouis@ricash.com',
    responsable: {
      nom: 'Ousmane Ba',
      telephone: '+221 78 456 12 34',
      email: 'ousmane.ba@ricash.com'
    },
    statut: 'active',
    typeAgence: 'secondaire',
    dateOuverture: '2023-05-10',
    nombreAgents: 6,
    limiteJournaliere: 200000,
    chiffreAffaires: 1200000,
    commission: 1.8,
    horaires: '08:30-17:30',
    coordonnees: {
      latitude: 16.0395,
      longitude: -16.4942
    },
    performance: {
      transactionsJour: 65,
      transactionsMois: 1950,
      chiffreAffairesMois: 1200000,
      tauxReussite: 96.8,
      satisfactionClient: 4.3
    }
  },
  AGE004: {
    id: 'AGE004',
    nom: 'Ricash Thiès',
    code: 'THS-001',
    ville: 'Thiès',
    quartier: 'Centre-ville',
    adresse: 'Avenue Léopold Sédar Senghor',
    telephone: '+221 33 951 23 45',
    email: 'thies@ricash.com',
    responsable: {
      nom: 'Aïssatou Sow',
      telephone: '+221 77 654 32 10',
      email: 'aissatou.sow@ricash.com'
    },
    statut: 'maintenance',
    typeAgence: 'secondaire',
    dateOuverture: '2023-02-28',
    nombreAgents: 10,
    limiteJournaliere: 400000,
    chiffreAffaires: 2100000,
    commission: 2.2,
    horaires: '08:00-18:00',
    coordonnees: {
      latitude: 14.7886,
      longitude: -16.9318
    },
    performance: {
      transactionsJour: 0,
      transactionsMois: 0,
      chiffreAffairesMois: 0,
      tauxReussite: 0,
      satisfactionClient: 0
    }
  },
  AGE005: {
    id: 'AGE005',
    nom: 'Ricash Kaolack',
    code: 'KLK-001',
    ville: 'Kaolack',
    quartier: 'Médina',
    adresse: 'Avenue El Hadj Malick Sy',
    telephone: '+221 33 941 56 78',
    email: 'kaolack@ricash.com',
    responsable: {
      nom: 'Mamadou Thiam',
      telephone: '+221 76 123 78 90',
      email: 'mamadou.thiam@ricash.com'
    },
    statut: 'suspendue',
    typeAgence: 'secondaire',
    dateOuverture: '2023-06-15',
    nombreAgents: 5,
    limiteJournaliere: 150000,
    chiffreAffaires: 800000,
    commission: 1.5,
    horaires: '09:00-17:00',
    coordonnees: {
      latitude: 14.1516,
      longitude: -16.0734
    },
    performance: {
      transactionsJour: 0,
      transactionsMois: 0,
      chiffreAffairesMois: 0,
      tauxReussite: 0,
      satisfactionClient: 0
    }
  }
}

const getStatusBadge = (statut) => {
  switch (statut) {
    case 'active':
      return <RicashStatusBadge variant="success">Active</RicashStatusBadge>
    case 'maintenance':
      return <RicashStatusBadge variant="warning">Maintenance</RicashStatusBadge>
    case 'suspendue':
      return <RicashStatusBadge variant="danger">Suspendue</RicashStatusBadge>
    default:
      return <RicashStatusBadge variant="secondary">{statut}</RicashStatusBadge>
  }
}

const getTypeAgenceBadge = (type) => {
  switch (type) {
    case 'principale':
      return <RicashStatusBadge variant="primary">Principale</RicashStatusBadge>
    case 'secondaire':
      return <RicashStatusBadge variant="secondary">Secondaire</RicashStatusBadge>
    default:
      return <RicashStatusBadge variant="outline">{type}</RicashStatusBadge>
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function AgencyDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const agency = mockAgencyDetails[id]

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

  const handleEdit = () => {
    navigate(`/app/agencies/${agency.id}/edit`)
  }

  const handleManageAgents = () => {
    navigate(`/app/agencies/${agency.id}/agents`)
  }

  const handleViewReports = () => {
    navigate(`/app/reports?agency=${agency.id}`)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <RicashButton
            variant="outline"
            onClick={() => navigate('/app/agencies')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </RicashButton>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              {agency.nom}
            </h1>
            <p className="text-gray-600 mt-1">Code: {agency.code}</p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-3">
          <RicashButton
            onClick={handleEdit}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Modificateur
          </RicashButton>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleManageAgents}>
                <Users className="mr-2 h-4 w-4" />
                Gérer les agents
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleViewReports}>
                <TrendingUp className="mr-2 h-4 w-4" />
                Voir les rapports
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Status and Type */}
      <div className="flex gap-2">
        {getStatusBadge(agency.statut)}
        {getTypeAgenceBadge(agency.typeAgence)}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <RicashCard>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informations générales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Adresse:</span>
                  </div>
                  <p className="text-gray-900 font-medium">{agency.adresse}</p>
                  <p className="text-gray-600">{agency.quartier}, {agency.ville}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Téléphone:</span>
                  </div>
                  <p className="text-gray-900 font-medium">{agency.telephone}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Email:</span>
                  </div>
                  <p className="text-gray-900 font-medium">{agency.email}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Horaires:</span>
                  </div>
                  <p className="text-gray-900 font-medium">{agency.horaires}</p>
                </div>
              </div>
            </div>
          </RicashCard>

          {/* Responsible Person */}
          <RicashCard>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Responsable de l'agence
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nom</p>
                  <p className="text-gray-900 font-medium">{agency.responsable.nom}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Téléphone</p>
                  <p className="text-gray-900 font-medium">{agency.responsable.telephone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-gray-900 font-medium">{agency.responsable.email}</p>
                </div>
              </div>
            </div>
          </RicashCard>

          {/* Performance Metrics */}
          <RicashCard>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{agency.performance.transactionsJour}</p>
                  <p className="text-sm text-gray-600">Transactions/jour</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{agency.performance.transactionsMois}</p>
                  <p className="text-sm text-gray-600">Transactions/mois</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{agency.performance.tauxReussite}%</p>
                  <p className="text-sm text-gray-600">Taux de réussite</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{agency.performance.satisfactionClient}/5</p>
                  <p className="text-sm text-gray-600">Satisfaction</p>
                </div>
              </div>
            </div>
          </RicashCard>
        </div>

        {/* Right Column - Stats and Info */}
        <div className="space-y-6">
          {/* Financial Summary */}
          <RicashCard>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Résumé financier
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Chiffre d'affaires mensuel</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(agency.chiffreAffaires)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Limite journalière</span>
                  <span className="font-semibold text-blue-600">
                    {formatCurrency(agency.limiteJournaliere)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Commission</span>
                  <span className="font-semibold text-purple-600">
                    {agency.commission}%
                  </span>
                </div>
              </div>
            </div>
          </RicashCard>

          {/* Agency Info */}
          <RicashCard>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informations de l'agence
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Date d'ouverture</span>
                  <span className="font-medium">{formatDate(agency.dateOuverture)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Nombre d'agents</span>
                  <span className="font-medium">{agency.nombreAgents}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Type d'agence</span>
                  <span className="font-medium capitalize">{agency.typeAgence}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Statut</span>
                  <span className="font-medium capitalize">{agency.statut}</span>
                </div>
              </div>
            </div>
          </RicashCard>

          {/* Coordinates */}
          <RicashCard>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Coordonnées GPS
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Latitude</span>
                  <span className="font-mono text-sm">{agency.coordonnees.latitude}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Longitude</span>
                  <span className="font-mono text-sm">{agency.coordonnees.longitude}</span>
                </div>
              </div>
            </div>
          </RicashCard>
        </div>
      </div>
    </div>
  )
}
