<<<<<<< HEAD
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb'
=======
import React, { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
>>>>>>> b2b435d85c9b4936f607c4f528b67c75a4e07405
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
<<<<<<< HEAD
import { Switch } from '@/components/ui/switch'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination'
import { exportToCsv } from '@/lib/csv'
=======
>>>>>>> b2b435d85c9b4936f607c4f528b67c75a4e07405

// Import modals
// import AgencyDetailsModal from '../components/Modals/AgencyDetailsModal'
// import CreateAgencyModal from '../components/Modals/CreateAgencyModal'

// Mock data
const initialAgencies = [
  {
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
    }
  },
  {
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
    }
  },
  {
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
    }
  },
  {
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
    }
  },
  {
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
    }
  }
]

const getStatusBadge = (statut) => {
  switch (statut) {
    case 'active':
      return <RicashStatusBadge status="active">Active</RicashStatusBadge>
    case 'maintenance':
      return <RicashStatusBadge status="maintenance">Maintenance</RicashStatusBadge>
    case 'suspendue':
      return <RicashStatusBadge status="suspendue">Suspendue</RicashStatusBadge>
    case 'fermee':
      return <RicashStatusBadge status="fermee">Fermée</RicashStatusBadge>
    default:
      return <RicashStatusBadge status="unknown">Inconnu</RicashStatusBadge>
  }
}

const getTypeAgenceBadge = (type) => {
  switch (type) {
    case 'principale':
      return <RicashStatusBadge status="principale">Principale</RicashStatusBadge>
    case 'secondaire':
      return <RicashStatusBadge status="secondaire">Secondaire</RicashStatusBadge>
    case 'partenaire':
      return <RicashStatusBadge status="partenaire">Partenaire</RicashStatusBadge>
    default:
      return <RicashStatusBadge status="standard">Standard</RicashStatusBadge>
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

const Agencies = React.memo(() => {
  const navigate = useNavigate()
<<<<<<< HEAD
  const location = useLocation()
=======
>>>>>>> b2b435d85c9b4936f607c4f528b67c75a4e07405
  const [agencies, setAgencies] = useState(initialAgencies)
  const [isLoading, setIsLoading] = useState(false)
  
  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    type: 'all',
    ville: 'all'
  })
<<<<<<< HEAD
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
=======
>>>>>>> b2b435d85c9b4936f607c4f528b67c75a4e07405
  
  // Modal states - supprimés car convertis en pages

  // Handlers optimisés
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])
  
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      status: 'all',
      type: 'all',
      ville: 'all'
    })
<<<<<<< HEAD
    setPage(1)
=======
>>>>>>> b2b435d85c9b4936f607c4f528b67c75a4e07405
  }, [])
  
  const handleRefresh = useCallback(async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
  }, [])

  // Filtered agencies with memoization
  const filteredAgencies = useMemo(() => {
    return agencies.filter(agency => {
      const matchesSearch = !filters.search || 
        agency.nom.toLowerCase().includes(filters.search.toLowerCase()) ||
        agency.ville.toLowerCase().includes(filters.search.toLowerCase()) ||
        agency.quartier.toLowerCase().includes(filters.search.toLowerCase()) ||
        agency.code.toLowerCase().includes(filters.search.toLowerCase()) ||
        agency.responsable.nom.toLowerCase().includes(filters.search.toLowerCase())
      
      const matchesStatus = filters.status === 'all' || agency.statut === filters.status
      const matchesType = filters.type === 'all' || agency.typeAgence === filters.type
      const matchesVille = filters.ville === 'all' || agency.ville === filters.ville

    return matchesSearch && matchesStatus && matchesType && matchesVille
  })
  }, [agencies, filters])
<<<<<<< HEAD
  // Init from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setFilters(prev => ({
      ...prev,
      search: params.get('search') || '',
      status: params.get('status') || 'all',
      type: params.get('type') || 'all',
      ville: params.get('ville') || 'all',
    }))
    const p = parseInt(params.get('page') || '1', 10)
    setPage(isNaN(p) || p < 1 ? 1 : p)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist to URL
  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.status !== 'all') params.set('status', filters.status)
    if (filters.type !== 'all') params.set('type', filters.type)
    if (filters.ville !== 'all') params.set('ville', filters.ville)
    if (page > 1) params.set('page', String(page))
    navigate({ pathname: location.pathname, search: params.toString() }, { replace: true })
  }, [filters, page, navigate, location.pathname])

  const totalItems = filteredAgencies.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const pagedAgencies = filteredAgencies.slice((page-1)*pageSize, (page-1)*pageSize + pageSize)
=======
>>>>>>> b2b435d85c9b4936f607c4f528b67c75a4e07405

  const stats = {
    total: agencies.length,
    actives: agencies.filter(a => a.statut === 'active').length,
    maintenance: agencies.filter(a => a.statut === 'maintenance').length,
    suspendues: agencies.filter(a => a.statut === 'suspendue').length,
    totalAgents: agencies.reduce((sum, a) => sum + a.nombreAgents, 0),
    chiffreAffairesTotal: agencies.reduce((sum, a) => sum + a.chiffreAffaires, 0)
  }

  // Static ville options to prevent DOM issues with dynamic SelectItems

  // Navigation handlers
  const handleViewDetails = (agency) => {
    navigate(`/app/agencies/${agency.id}/details`)
  }

  const handleManageAgents = (agency) => {
    navigate('/app/agents')
  }

  const handleSuspendAgency = (agency) => {
    setAgencies(prev => prev.map(a => 
      a.id === agency.id 
        ? { ...a, statut: a.statut === 'suspendue' ? 'active' : 'suspendue' }
        : a
    ))
  }

  const handleDeleteAgency = (agencyId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette agence ? Cette action est irréversible.')) {
      setAgencies(prev => prev.filter(agency => agency.id !== agencyId))
    }
  }

  return (
    <div className="p-6 space-y-6">
<<<<<<< HEAD
      <div className="mb-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/app/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Agences</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
=======
>>>>>>> b2b435d85c9b4936f607c4f528b67c75a4e07405
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
<<<<<<< HEAD
            variant="outline"
            onClick={() => exportToCsv('agencies.csv', [["ID","Nom","Code","Ville","Quartier","Téléphone","Email","Statut","Agents","CA"], ...filteredAgencies.map(a => [a.id, a.nom, a.code, a.ville, a.quartier, a.telephone, a.email, a.statut, String(a.nombreAgents), String(a.chiffreAffaires)])])}
          >
            Export CSV
          </RicashButton>
          <RicashButton
=======
>>>>>>> b2b435d85c9b4936f607c4f528b67c75a4e07405
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
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
          icon={Clock}
          title="En maintenance"
          value={stats.maintenance}
          description="Nombre d'agences en maintenance"
        />
        <RicashStatCard
          icon={XCircle}
          title="Suspendues"
          value={stats.suspendues}
          description="Nombre d'agences suspendues"
        />
        <RicashStatCard
          icon={Users}
          title="Total agents"
          value={stats.totalAgents}
          description="Nombre total d'agents dans toutes les agences"
        />
        <RicashStatCard
          icon={TrendingUp}
          title="CA Total"
          value={formatCurrency(stats.chiffreAffairesTotal)}
          description="Chiffre d'affaires total de toutes les agences"
        />
      </div>

      {/* Filters and search */}
      <RicashTableCard>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <RicashInput
              placeholder="Rechercher par nom, ville, code ou responsable..."
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
                { value: 'maintenance', label: 'Maintenance' },
                { value: 'suspendue', label: 'Suspendue' },
                { value: 'fermee', label: 'Fermée' }
              ]}
              triggerClassName="w-[140px]"
            />
            <RicashSelect
              value={filters.type}
              onValueChange={(value) => updateFilters({ type: value })}
              placeholder="Type"
              options={[
                { value: 'all', label: 'Tous les types' },
                { value: 'principale', label: 'Principale' },
                { value: 'secondaire', label: 'Secondaire' },
                { value: 'partenaire', label: 'Partenaire' }
              ]}
              triggerClassName="w-[140px]"
            />
            <RicashSelect
              value={filters.ville}
              onValueChange={(value) => updateFilters({ ville: value })}
              placeholder="Ville"
              options={[
                { value: 'all', label: 'Toutes les villes' },
                { value: 'Dakar', label: 'Dakar' },
                { value: 'Thiès', label: 'Thiès' },
                { value: 'Saint-Louis', label: 'Saint-Louis' },
                { value: 'Touba', label: 'Touba' },
                { value: 'Kaolack', label: 'Kaolack' },
                { value: 'Tambacounda', label: 'Tambacounda' }
              ]}
              triggerClassName="w-[140px]"
            />
            <RicashButton variant="outline" onClick={resetFilters}>
              <Filter className="mr-2 h-4 w-4" />
              Reset
            </RicashButton>
          </div>
        </div>

        <RicashTable>
          <RicashTableHeader>
            <RicashTableRow>
              <RicashTableCell>Agence</RicashTableCell>
              <RicashTableCell>Code</RicashTableCell>
              <RicashTableCell>Localisation</RicashTableCell>
              <RicashTableCell>Responsable</RicashTableCell>
              <RicashTableCell>Type</RicashTableCell>
              <RicashTableCell>Statut</RicashTableCell>
              <RicashTableCell>Agents</RicashTableCell>
              <RicashTableCell>CA Mensuel</RicashTableCell>
              <RicashTableCell>Actions</RicashTableCell>
            </RicashTableRow>
          </RicashTableHeader>
          <RicashTableBody>
<<<<<<< HEAD
            {pagedAgencies.map((agency) => (
=======
            {filteredAgencies.map((agency) => (
>>>>>>> b2b435d85c9b4936f607c4f528b67c75a4e07405
              <RicashTableRow key={agency.id}>
                <RicashTableCell>
                  <div>
                    <div className="font-medium">{agency.nom}</div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Phone className="mr-1 h-3 w-3" />
                      {agency.telephone}
                    </div>
                  </div>
                </RicashTableCell>
                <RicashTableCell>
                  <div className="font-mono text-sm">{agency.code}</div>
                </RicashTableCell>
                <RicashTableCell>
                  <div>
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-3 w-3" />
                      <span className="font-medium">{agency.ville}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{agency.quartier}</div>
                  </div>
                </RicashTableCell>
                <RicashTableCell>
                  <div>
                    <div className="font-medium">{agency.responsable.nom}</div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="mr-1 h-3 w-3" />
                      {agency.responsable.email}
                    </div>
                  </div>
                </RicashTableCell>
                <RicashTableCell>{getTypeAgenceBadge(agency.typeAgence)}</RicashTableCell>
<<<<<<< HEAD
                <RicashTableCell>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(agency.statut)}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Active</span>
                      <Switch
                        checked={agency.statut === 'active'}
                        onCheckedChange={(checked) => {
                          setAgencies(prev => prev.map(a => a.id === agency.id ? { ...a, statut: checked ? 'active' : 'suspendue' } : a))
                        }}
                      />
                    </div>
                  </div>
                </RicashTableCell>
=======
                <RicashTableCell>{getStatusBadge(agency.statut)}</RicashTableCell>
>>>>>>> b2b435d85c9b4936f607c4f528b67c75a4e07405
                <RicashTableCell>
                  <div className="text-center">
                    <span className="font-medium">{agency.nombreAgents}</span>
                  </div>
                </RicashTableCell>
                <RicashTableCell>
                  <div className="font-medium">{formatCurrency(agency.chiffreAffaires)}</div>
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
                          label: agency.statut !== 'suspendue' ? "Suspendre" : "Réactiver",
                          icon: agency.statut !== 'suspendue' ? "🚫" : "✅",
                          onClick: () => handleSuspendAgency(agency),
                          variant: agency.statut !== 'suspendue' ? "warning" : "success"
                        },
                        {
                          label: "Supprimer",
                          icon: "🗑️",
                          onClick: () => handleDeleteAgency(agency.id),
                          variant: "danger"
                        }
                      ]}
                    />
                  </RicashTableCell>
              </RicashTableRow>
            ))}
          </RicashTableBody>
        </RicashTable>

        {filteredAgencies.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucune agence trouvée avec ces critères.</p>
          </div>
        )}
<<<<<<< HEAD
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-sm text-muted-foreground">Page {page} / {totalPages} • {totalItems} agence(s)</div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" onClick={() => setPage(p => Math.max(1, p-1))} />
              </PaginationItem>
              {Array.from({ length: totalPages }).slice(0,5).map((_, idx) => {
                const num = idx + 1
                return (
                  <PaginationItem key={num}>
                    <PaginationLink href="#" isActive={num === page} onClick={() => setPage(num)}>{num}</PaginationLink>
                  </PaginationItem>
                )
              })}
              <PaginationItem>
                <PaginationNext href="#" onClick={() => setPage(p => Math.min(totalPages, p+1))} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
=======
>>>>>>> b2b435d85c9b4936f607c4f528b67c75a4e07405
      </RicashTableCard>

    </div>
  )
})

Agencies.displayName = 'Agencies'

export default Agencies
