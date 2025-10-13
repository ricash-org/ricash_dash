// src/pages/AgencyDetails.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2, MapPin, Phone, Mail, Users, DollarSign, TrendingUp, Clock, Edit, MoreVertical } from 'lucide-react'
import { RicashButton } from '@/components/ui/ricash-button'
import { RicashCard } from '@/components/ui/ricash-card'
import { RicashStatusBadge } from '@/components/ui/ricash-table'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

// Service API
import { agenceService } from '@/services/agenceService'

const getStatusBadge = (estActive) => {
  return estActive 
    ? <RicashStatusBadge variant="success">Active</RicashStatusBadge>
    : <RicashStatusBadge variant="danger">Inactive</RicashStatusBadge>
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount || 0)
}

export default function AgencyDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [agency, setAgency] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadAgencyDetails()
  }, [id])

  const loadAgencyDetails = async () => {
    try {
      setLoading(true)
      // Dans un cas réel, vous auriez un endpoint pour récupérer une agence par ID
      const agences = await agenceService.getAllAgences()
      const foundAgency = agences.find(a => a.id === parseInt(id))
      setAgency(foundAgency)
    } catch (error) {
      console.error('Erreur lors du chargement des détails:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async () => {
    try {
      const updatedAgency = await agenceService.toggleAgenceStatus(
        agency.id, 
        !agency.estActive
      )
      setAgency(updatedAgency)
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error)
    }
  }

  if (loading) {
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
          <p>Chargement des détails de l'agence...</p>
        </div>
      </div>
    )
  }

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
            <p className="text-gray-600 mt-1">ID: {agency.id}</p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-3">
          <RicashButton
            onClick={handleEdit}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Modifier
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
              <DropdownMenuItem onClick={handleToggleStatus}>
                {agency.estActive ? (
                  <>
                    <Clock className="mr-2 h-4 w-4" />
                    Désactiver l'agence
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Activer l'agence
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Status */}
      <div className="flex gap-2">
        {getStatusBadge(agency.estActive)}
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
                  <p className="text-gray-900 font-medium">{agency.adresse?.ligne1}</p>
                  <p className="text-gray-600">{agency.adresse?.ligne2}</p>
                  <p className="text-gray-600">{agency.adresse?.ville}, {agency.adresse?.pays}</p>
                  <p className="text-gray-600">Code postal: {agency.adresse?.codePostal}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Téléphone:</span>
                  </div>
                  <p className="text-gray-900 font-medium">{agency.telephone}</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nom</p>
                  <p className="text-gray-900 font-medium">{agency.agentNom}</p>
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
                  <span className="text-gray-600">Solde actuel</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(agency.solde)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Statut</span>
                  <span className={`font-semibold ${agency.estActive ? 'text-green-600' : 'text-red-600'}`}>
                    {agency.estActive ? 'Active' : 'Inactive'}
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
                  <span className="text-gray-600">ID Agence</span>
                  <span className="font-medium">{agency.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Nom</span>
                  <span className="font-medium">{agency.nom}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ville</span>
                  <span className="font-medium">{agency.adresse?.ville}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pays</span>
                  <span className="font-medium">{agency.adresse?.pays}</span>
                </div>
              </div>
            </div>
          </RicashCard>
        </div>
      </div>
    </div>
  )
}