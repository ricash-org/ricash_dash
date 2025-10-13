// src/pages/Agencies.jsx
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Users,
  Phone,
  Mail,
  RefreshCw,
  TrendingUp,
  MapPin,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  Ban
} from 'lucide-react'

// Composants Ricash
import { RicashCard, RicashStatCard, RicashTableCard } from '@/components/ui/ricash-card'
import { RicashButton } from '@/components/ui/ricash-button'
import { RicashInput, RicashSelect } from '@/components/ui/ricash-input'
import { RicashStatusBadge } from '@/components/ui/ricash-table'
import {
  RicashTable,
  RicashTableHeader,
  RicashTableBody,
  RicashTableRow,
  RicashTableCell
} from '@/components/ui/ricash-table'
import { RicashTableActionsDropdown } from '@/components/ui/ricash-dropdown'

// Service API
import { agenceService } from '@/services/agenceService'

// Fonctions utilitaires
const getStatusBadge = (estActive) => {
  return estActive 
    ? <RicashStatusBadge status="active">Active</RicashStatusBadge>
    : <RicashStatusBadge status="suspendue">Inactive</RicashStatusBadge>
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount || 0)
}

const Agencies = React.memo(() => {
  const navigate = useNavigate()
  const [agencies, setAgencies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    actives: 0,
    inactives: 0,
    soldeTotal: 0
  })
  
  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    status: 'all'
  })
  
  // Charger les données au montage du composant
  useEffect(() => {
    loadAgencies()
  }, [])

  // Charger les agences depuis l'API
  const loadAgencies = async () => {
    setIsLoading(true)
    try {
      const [agencesData, soldeTotal] = await Promise.all([
        agenceService.getAllAgences(),
        agenceService.getSoldeTotal()
      ])
      
      setAgencies(agencesData)
      
      // Calculer les statistiques
      const actives = agencesData.filter(agence => agence.estActive).length
      const inactives = agencesData.filter(agence => !agence.estActive).length
      
      setStats({
        total: agencesData.length,
        actives,
        inactives,
        soldeTotal: soldeTotal || 0
      })
    } catch (error) {
      console.error('Erreur lors du chargement des agences:', error)
      // Optionnel: Afficher un message d'erreur à l'utilisateur
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handlers optimisés
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])
  
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      status: 'all'
    })
  }, [])
  
  const handleRefresh = useCallback(async () => {
    await loadAgencies()
  }, [])

  // Filtered agencies with memoization
  const filteredAgencies = useMemo(() => {
    return agencies.filter(agency => {
      const matchesSearch = !filters.search || 
        agency.nom.toLowerCase().includes(filters.search.toLowerCase()) ||
        (agency.adresse?.ville && agency.adresse.ville.toLowerCase().includes(filters.search.toLowerCase())) ||
        (agency.agentNom && agency.agentNom.toLowerCase().includes(filters.search.toLowerCase()))
      
      const matchesStatus = filters.status === 'all' || 
        (filters.status === 'active' && agency.estActive) ||
        (filters.status === 'inactive' && !agency.estActive)

      return matchesSearch && matchesStatus
    })
  }, [agencies, filters])

  // Gestion du statut des agences
  const handleToggleStatus = async (agency) => {
    try {
      const updatedAgency = await agenceService.toggleAgenceStatus(
        agency.id, 
        !agency.estActive
      )
      
      // Mettre à jour la liste locale
      setAgencies(prev => 
        prev.map(a => a.id === agency.id ? updatedAgency : a)
      )
      
      // Recharger les stats
      const soldeTotal = await agenceService.getSoldeTotal()
      setStats(prev => ({
        ...prev,
        soldeTotal,
        actives: prev.actives + (updatedAgency.estActive ? 1 : -1),
        inactives: prev.inactives + (updatedAgency.estActive ? -1 : 1)
      }))
      
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error)
    }
  }

  const handleDeleteAgency = async (agencyId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette agence ? Cette action est irréversible.')) {
      try {
        // Note: Vous devrez ajouter un endpoint DELETE dans votre controller Spring Boot
        // await agenceService.deleteAgence(agencyId)
        // setAgencies(prev => prev.filter(agency => agency.id !== agencyId))
        
        // Pour l'instant, on désactive simplement
        const agency = agencies.find(a => a.id === agencyId)
        if (agency) {
          await handleToggleStatus(agency)
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
      }
    }
  }

  // Navigation handlers
  const handleViewDetails = (agency) => {
    navigate(`/app/agencies/${agency.id}/details`)
  }

  const handleManageAgents = (agency) => {
    navigate('/app/agents', { state: { agenceId: agency.id } })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Agences</h1>
          <p className="text-muted-foreground">
            Gérez votre réseau d'agences et partenaires Ricash
          </p>
        </div>
        <div className="flex gap-2">
          <RicashButton
            onClick={handleRefresh}
            loading={isLoading}
            loadingText="Actualisation..."
            variant="outline"
            size="lg"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser
          </RicashButton>
          <RicashButton 
            onClick={() => navigate('/app/agencies/create')}
            loading={false}
            size="lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle agence
          </RicashButton>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <RicashStatCard
          icon={Building2}
          title="Total agences"
          value={stats.total}
          description="Nombre total d'agences dans votre réseau"
        />
        <RicashStatCard
          icon={CheckCircle}
          title="Agences actives"
          value={stats.actives}
          description="Nombre d'agences en fonctionnement"
        />
        <RicashStatCard
          icon={XCircle}
          title="Agences inactives"
          value={stats.inactives}
          description="Nombre d'agences suspendues"
        />
        <RicashStatCard
          icon={TrendingUp}
          title="Solde Total"
          value={formatCurrency(stats.soldeTotal)}
          description="Solde total de toutes les agences"
        />
      </div>

      {/* Filters and search */}
      <RicashTableCard>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <RicashInput
              placeholder="Rechercher par nom, ville ou responsable..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <RicashSelect
              value={filters.status}
              onValueChange={(value) => updateFilters({ status: value })}
              placeholder="Statut"
              options={[
                { value: 'all', label: 'Tous les statuts' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
              ]}
              triggerClassName="w-[140px]"
            />
            <RicashButton variant="outline" onClick={resetFilters}>
              <Filter className="mr-2 h-4 w-4" />
              Reset
            </RicashButton>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Chargement des agences...</p>
          </div>
        ) : (
          <RicashTable>
            <RicashTableHeader>
              <RicashTableRow>
                <RicashTableCell>Agence</RicashTableCell>
                <RicashTableCell>Localisation</RicashTableCell>
                <RicashTableCell>Responsable</RicashTableCell>
                <RicashTableCell>Téléphone</RicashTableCell>
                <RicashTableCell>Statut</RicashTableCell>
                <RicashTableCell>Solde</RicashTableCell>
                <RicashTableCell>Actions</RicashTableCell>
              </RicashTableRow>
            </RicashTableHeader>
            <RicashTableBody>
              {filteredAgencies.map((agency) => (
                <RicashTableRow key={agency.id}>
                  <RicashTableCell>
                    <div>
                      <div className="font-medium">{agency.nom}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        ID: {agency.id}
                      </div>
                    </div>
                  </RicashTableCell>
                  <RicashTableCell>
                    <div>
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-3 w-3" />
                        <span className="font-medium">{agency.adresse?.ville}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {agency.adresse?.ligne1}
                      </div>
                    </div>
                  </RicashTableCell>
                  <RicashTableCell>
                    <div>
                      <div className="font-medium">{agency.agentNom}</div>
                    </div>
                  </RicashTableCell>
                  <RicashTableCell>
                    <div className="flex items-center">
                      <Phone className="mr-1 h-3 w-3" />
                      {agency.telephone}
                    </div>
                  </RicashTableCell>
                  <RicashTableCell>{getStatusBadge(agency.estActive)}</RicashTableCell>
                  <RicashTableCell>
                    <div className="font-medium">{formatCurrency(agency.solde)}</div>
                  </RicashTableCell>
                  <RicashTableCell>
                    <RicashTableActionsDropdown
                      actions={[
                        {
                          label: "Voir détails",
                          icon: "👁️",
                          onClick: () => handleViewDetails(agency),
                          variant: "default"
                        },
                        {
                          label: "Gérer agents",
                          icon: "👥",
                          onClick: () => handleManageAgents(agency),
                          variant: "default"
                        },
                        {
                          label: agency.estActive ? "Désactiver" : "Activer",
                          icon: agency.estActive ? "🚫" : "✅",
                          onClick: () => handleToggleStatus(agency),
                          variant: agency.estActive ? "warning" : "success"
                        }
                      ]}
                    />
                  </RicashTableCell>
                </RicashTableRow>
              ))}
            </RicashTableBody>
          </RicashTable>
        )}

        {!isLoading && filteredAgencies.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {agencies.length === 0 ? 'Aucune agence trouvée.' : 'Aucune agence trouvée avec ces critères.'}
            </p>
          </div>
        )}
      </RicashTableCard>
    </div>
  )
})

Agencies.displayName = 'Agencies'

export default Agencies