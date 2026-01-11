import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  Users as UsersIcon, 
  Search, 
  Plus, 
  Eye,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  AlertTriangle,
  Filter,
  RefreshCw,
  Download,
  Upload,
  Shield,
  Activity,
  TrendingUp,
  UserCheck,
  UserX,
  Clock,
  FileText,
  MoreHorizontal
} from 'lucide-react'

// Import des composants Ricash
import { RicashCard, RicashStatCard, RicashTableCard } from '@/components/ui/ricash-card'
import { RicashButton, RicashIconButton } from '@/components/ui/ricash-button'
import { RicashInput, RicashSelect } from '@/components/ui/ricash-input'
import { RicashStatusBadge } from '@/components/ui/ricash-table'
import { RicashTable, RicashTableHeader, RicashTableBody, RicashTableRow, RicashTableCell } from '@/components/ui/ricash-table'
import { RicashDropdownMenu, RicashDropdownItem, RicashDropdownSeparator } from '@/components/ui/ricash-dropdown'

// Palette de couleurs Ricash officielle
const RICASH_COLORS = {
  turquoise: '#2B8286',
  bleuVert: '#376470',
  bleuFonce: '#29475B',
  dore: '#B19068',
  blancCasse: '#F4F2EE'
}

// Mock data étendu
const mockUsers = [
  {
    id: 'USR001',
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@email.com',
    telephone: '+33 6 12 34 56 78',
    statut: 'actif',
    kycStatus: 'valide',
    dateCreation: '2024-01-15',
    derniereConnexion: '2024-01-20',
    solde: 1250.50,
    transactions: 15,
    pays: 'France',
    ville: 'Paris',
    typeCompte: 'Premium'
  },
  {
    id: 'USR002',
    nom: 'Martin',
    prenom: 'Marie',
    email: 'marie.martin@email.com',
    telephone: '+33 6 98 76 54 32',
    statut: 'actif',
    kycStatus: 'en_cours',
    dateCreation: '2024-01-18',
    derniereConnexion: '2024-01-19',
    solde: 750.00,
    transactions: 8,
    pays: 'France',
    ville: 'Lyon',
    typeCompte: 'Standard'
  },
  {
    id: 'USR003',
    nom: 'Durand',
    prenom: 'Pierre',
    email: 'pierre.durand@email.com',
    telephone: '+33 6 11 22 33 44',
    statut: 'suspendu',
    kycStatus: 'rejete',
    dateCreation: '2024-01-10',
    derniereConnexion: '2024-01-12',
    solde: 0.00,
    transactions: 3,
    pays: 'France',
    ville: 'Marseille',
    typeCompte: 'Standard'
  },
  {
    id: 'USR004',
    nom: 'Diallo',
    prenom: 'Fatou',
    email: 'fatou.diallo@email.com',
    telephone: '+221 77 123 4567',
    statut: 'actif',
    kycStatus: 'valide',
    dateCreation: '2024-01-20',
    derniereConnexion: '2024-01-21',
    solde: 2500.75,
    transactions: 25,
    pays: 'Sénégal',
    ville: 'Dakar',
    typeCompte: 'Premium'
  },
  {
    id: 'USR005',
    nom: 'Traoré',
    prenom: 'Moussa',
    email: 'moussa.traore@email.com',
    telephone: '+223 65 987 6543',
    statut: 'en_attente',
    kycStatus: 'en_cours',
    dateCreation: '2024-01-22',
    derniereConnexion: 'Jamais',
    solde: 0.00,
    transactions: 0,
    pays: 'Mali',
    ville: 'Bamako',
    typeCompte: 'Standard'
  }
]

export default function Users() {
  const location = useLocation()
  const navigate = useNavigate()
  
  // State management
  const [filters, setFilters] = useState(() => ({
    search: '',
    status: location.pathname === '/app/users/suspended' ? 'suspendu' : 'all',
    kycStatus: location.pathname === '/app/users/kyc' ? 'en_cours' : 'all',
    pays: 'all',
    typeCompte: 'all',
    page: 1,
    limit: 20
  }))
  
  const [isLoading, setIsLoading] = useState(false)

  // Mettre à jour les filtres quand la route change
  useEffect(() => {
    if (location.pathname === '/app/users/suspended') {
      setFilters(prev => ({ ...prev, status: 'suspendu', kycStatus: 'all' }))
    } else if (location.pathname === '/app/users/kyc') {
      setFilters(prev => ({ ...prev, status: 'all', kycStatus: 'en_cours' }))
    } else {
      setFilters(prev => ({ ...prev, status: 'all', kycStatus: 'all' }))
    }
  }, [location.pathname])

  // Stats calculées
  const stats = useMemo(() => ({
    total: mockUsers.length,
    actifs: mockUsers.filter(u => u.statut === 'actif').length,
    suspendus: mockUsers.filter(u => u.statut === 'suspendu').length,
    kycEnAttente: mockUsers.filter(u => u.kycStatus === 'en_cours').length,
    premium: mockUsers.filter(u => u.typeCompte === 'Premium').length,
    totalSolde: mockUsers.reduce((sum, u) => sum + u.solde, 0),
    totalTransactions: mockUsers.reduce((sum, u) => sum + u.transactions, 0)
  }), [])

  // Données filtrées
  const filteredUsers = useMemo(() => {
    return mockUsers.filter(user => {
      const matchesSearch = !filters.search || 
        user.nom.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.prenom.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.id.toLowerCase().includes(filters.search.toLowerCase())
        
      const matchesStatus = filters.status === 'all' || user.statut === filters.status
      const matchesKyc = filters.kycStatus === 'all' || user.kycStatus === filters.kycStatus
      const matchesPays = filters.pays === 'all' || user.pays === filters.pays
      const matchesType = filters.typeCompte === 'all' || user.typeCompte === filters.typeCompte
      
      return matchesSearch && matchesStatus && matchesKyc && matchesPays && matchesType
    })
  }, [filters])

  // Handlers
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  const handleSearchChange = useCallback((e) => {
    updateFilters({ search: e.target.value, page: 1 })
  }, [updateFilters])

  const handleFilterChange = useCallback((filterType, value) => {
    updateFilters({ [filterType]: value, page: 1 })
  }, [updateFilters])
  
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      status: 'all',
      kycStatus: 'all',
      pays: 'all',
      typeCompte: 'all',
      page: 1,
      limit: 20
    })
  }, [])
  
  const handleRefresh = useCallback(async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
  }, [])

  // Navigation handlers
  const handleViewUser = useCallback((user) => {
    navigate(`/app/users/${user.id}/details`)
  }, [navigate])

  const handleKycUser = useCallback((user) => {
    navigate(`/app/users/kyc/${user.id}`)
  }, [navigate])

  const handleBlockUser = useCallback((user) => {
    navigate(`/app/users/${user.id}/block`)
  }, [navigate])

  const handleModifyStatus = useCallback((user) => {
    navigate(`/app/users/${user.id}/status`)
  }, [navigate])

  // Adapter le contenu selon la route
  const getPageContent = () => {
    switch (location.pathname) {
      case '/app/users/kyc':
        return {
          title: 'Validation KYC',
          description: 'Validez les documents d\'identité et dossiers KYC en attente',
          icon: Shield,
          color: RICASH_COLORS.turquoise
        }
      case '/app/users/suspended':
        return {
          title: 'Comptes suspendus',
          description: 'Gérez les utilisateurs dont les comptes sont suspendus',
          icon: UserX,
          color: '#ef4444'
        }
      default:
        return {
          title: 'Gestion des utilisateurs',
          description: `Gérez les comptes utilisateurs, validez les KYC et surveillez l'activité (${filteredUsers.length} utilisateur(s))`,
          icon: UsersIcon,
          color: RICASH_COLORS.bleuFonce
        }
    }
  }

  const pageContent = getPageContent()

  // Stats cards data
  const statsData = [
    {
      title: 'Total Utilisateurs',
      value: stats.total.toString(),
      change: '+12%',
      changeType: 'positive',
      icon: UsersIcon,
      description: 'Tous les comptes',
      color: RICASH_COLORS.bleuFonce
    },
    {
      title: 'Utilisateurs Actifs',
      value: stats.actifs.toString(),
      change: '+8%',
      changeType: 'positive',
      icon: UserCheck,
      description: 'Comptes fonctionnels',
      color: RICASH_COLORS.turquoise
    },
    {
      title: 'KYC en Attente',
      value: stats.kycEnAttente.toString(),
      change: '-3%',
      changeType: 'negative',
      icon: Clock,
      description: 'À valider',
      color: RICASH_COLORS.dore
    },
    {
      title: 'Comptes Premium',
      value: stats.premium.toString(),
      change: '+15%',
      changeType: 'positive',
      icon: TrendingUp,
      description: 'Abonnements premium',
      color: RICASH_COLORS.bleuVert
    }
  ]

  return (
    <div className="space-y-8 p-6 bg-[#F4F2EE] min-h-screen">
      {/* Page header avec design Ricash */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#376470]/10">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: `${pageContent.color}20` }}>
              <pageContent.icon className="h-6 w-6" style={{ color: pageContent.color }} />
            </div>
        <div>
              <h1 className="text-4xl font-bold tracking-tight text-[#29475B] mb-2">
                {pageContent.title}
          </h1>
              <p className="text-lg text-[#376470] font-medium">
                {pageContent.description}
          </p>
            </div>
        </div>
        <div className="flex gap-3">
          <RicashButton
            variant="accent"
            size="lg"
            onClick={() => navigate('/app/users/create')}
          >
            <Plus className="mr-2 h-5 w-5" />
            Nouvel utilisateur
          </RicashButton>
          <RicashButton
            variant="outline"
            size="lg"
            onClick={handleRefresh}
            loading={isLoading}
            loadingText="Actualisation..."
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Actualiser
          </RicashButton>
        </div>
        </div>
      </div>

      {/* Stats cards avec design Ricash */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
        <RicashStatCard
            key={index} 
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            description={stat.description}
            icon={stat.icon}
            iconColor={stat.color}
            className="transform hover:scale-105 transition-transform duration-300"
          />
        ))}
      </div>

      {/* Filtres et recherche */}
      <RicashCard className="overflow-hidden">
        <div className="p-6 border-b border-[#376470]/10">
          <h3 className="text-xl font-bold text-[#29475B] mb-2">
            Filtres et Recherche
          </h3>
          <p className="text-[#376470]">
            Recherchez et filtrez les utilisateurs selon vos critères
            </p>
          </div>
        <div className="p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#376470]" />
            <RicashInput
                  placeholder="Rechercher par nom, email ou ID..."
              value={filters.search}
                  onChange={handleSearchChange}
                  className="pl-10"
            />
              </div>
          </div>
          
          <RicashSelect
              value={filters.status}
              onValueChange={(value) => handleFilterChange('status', value)}
            options={[
              { value: 'all', label: 'Tous les statuts' },
                { value: 'actif', label: 'Actifs' },
                { value: 'suspendu', label: 'Suspendus' },
                { value: 'en_attente', label: 'En attente' },
                { value: 'bloque', label: 'Bloqués' }
              ]}
          />
          
          <RicashSelect
            value={filters.kycStatus}
            onValueChange={(value) => handleFilterChange('kycStatus', value)}
            options={[
              { value: 'all', label: 'Tous KYC' },
              { value: 'valide', label: 'KYC Validé' },
              { value: 'en_cours', label: 'En cours' },
              { value: 'rejete', label: 'Rejeté' },
              { value: 'non_verifie', label: 'Non vérifié' }
            ]}
          />
          
          <RicashButton
            variant="outline"
            onClick={() => {
              setFilters({
                search: '',
                status: 'all',
                kycStatus: 'all'
              })
            }}
          >
            <Filter className="mr-2 h-4 w-4" />
            Reset
          </RicashButton>
        </div>
        </div>
      </RicashCard>

      {/* Tableau des utilisateurs */}
      <RicashTableCard
        title="Liste des Utilisateurs"
        description={`${filteredUsers.length} utilisateur(s) trouvé(s)`}
        className="overflow-hidden"
      >
        <div className="overflow-x-auto">
        <RicashTable>
          <RicashTableHeader>
            <RicashTableRow>
                <RicashTableCell className="font-semibold">Utilisateur</RicashTableCell>
                <RicashTableCell className="font-semibold">Contact</RicashTableCell>
                <RicashTableCell className="font-semibold">Localisation</RicashTableCell>
                <RicashTableCell className="font-semibold">Statut</RicashTableCell>
                <RicashTableCell className="font-semibold">KYC</RicashTableCell>
                <RicashTableCell className="font-semibold">Solde</RicashTableCell>
                <RicashTableCell className="font-semibold">Transactions</RicashTableCell>
                <RicashTableCell className="font-semibold">Dernière connexion</RicashTableCell>
                <RicashTableCell className="font-semibold text-right">Actions</RicashTableCell>
            </RicashTableRow>
          </RicashTableHeader>
          <RicashTableBody>
            {filteredUsers.length === 0 ? (
              <RicashTableRow>
                <RicashTableCell colSpan={9} className="text-center py-12">
                  <UsersIcon className="h-16 w-16 mx-auto text-[#376470]/50 mb-4" />
                  <p className="text-[#376470] text-lg font-medium">Aucun utilisateur trouvé</p>
                  <p className="text-[#376470]/70">Ajustez vos filtres pour voir plus de résultats</p>
                </RicashTableCell>
              </RicashTableRow>
            ) : (
              filteredUsers.map((user) => (
                <RicashTableRow key={user.id} className="hover:bg-[#376470]/5 transition-colors">
                  <RicashTableCell>
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        user.statut === 'actif' ? 'bg-green-500' :
                        user.statut === 'suspendu' ? 'bg-red-500' :
                        user.statut === 'en_attente' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}></div>
                      <div className="w-10 h-10 bg-gradient-to-br from-[#2B8286] to-[#2B8286]/80 rounded-lg flex items-center justify-center shadow-sm">
                        <UsersIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-[#29475B]">{user.prenom} {user.nom}</div>
                        <div className="text-sm text-[#376470]">{user.id}</div>
                      </div>
                    </div>
                  </RicashTableCell>
                  
                  <RicashTableCell>
                    <div>
                      <div className="text-sm text-[#29475B]">{user.email}</div>
                      <div className="text-sm text-[#376470]">{user.telephone}</div>
                    </div>
                  </RicashTableCell>
                  
                  <RicashTableCell>
                    <div>
                      <div className="text-sm text-[#29475B]">{user.ville}</div>
                      <div className="text-sm text-[#376470]">{user.pays}</div>
                    </div>
                  </RicashTableCell>
                  
                  <RicashTableCell>
                    <RicashStatusBadge
                      status={user.statut === 'actif' ? 'success' : user.statut === 'suspendu' ? 'error' : 'warning'} 
                      text={user.statut === 'actif' ? 'Actif' : user.statut === 'suspendu' ? 'Suspendu' : 'En attente'} 
                    />
                  </RicashTableCell>
                  
                  <RicashTableCell>
                    <RicashStatusBadge
                      status={user.kycStatus === 'valide' ? 'success' : user.kycStatus === 'en_cours' ? 'warning' : 'error'} 
                      text={user.kycStatus === 'valide' ? 'Validé' : user.kycStatus === 'en_cours' ? 'En cours' : 'Rejeté'} 
                    />
                  </RicashTableCell>
                  
                  <RicashTableCell>
                    <div className="text-sm font-semibold text-[#29475B]">€{user.solde.toFixed(2)}</div>
                    <div className="text-xs text-[#376470]">{user.typeCompte}</div>
                  </RicashTableCell>
                  
                  <RicashTableCell>
                    <div className="text-center font-medium text-[#29475B]">{user.transactions}</div>
                  </RicashTableCell>
                  
                  <RicashTableCell>
                    <div className="text-sm text-[#376470]">{user.derniereConnexion}</div>
                  </RicashTableCell>
                  
                  <RicashTableCell className="text-right">
                    <RicashDropdownMenu
                      trigger={
                        <RicashIconButton variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </RicashIconButton>
                      }
                      align="end"
                    >
                      <RicashDropdownItem onClick={() => handleViewUser(user)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir détails
                      </RicashDropdownItem>
                      
                      {user.kycStatus === 'en_cours' && (
                        <RicashDropdownItem onClick={() => handleKycUser(user)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Valider KYC
                        </RicashDropdownItem>
                      )}
                      
                      <RicashDropdownSeparator />
                      
                      <RicashDropdownItem onClick={() => handleModifyStatus(user)}>
                        <Shield className="mr-2 h-4 w-4" />
                        Modifier le statut
                      </RicashDropdownItem>
                      
                      <RicashDropdownItem onClick={() => handleBlockUser(user)}>
                        <Ban className="mr-2 h-4 w-4" />
                        Bloquer/Débloquer
                      </RicashDropdownItem>
                      
                      <RicashDropdownItem className="text-red-600 hover:text-red-700">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </RicashDropdownItem>
                    </RicashDropdownMenu>
                  </RicashTableCell>
                </RicashTableRow>
              ))
            )}
          </RicashTableBody>
        </RicashTable>
        </div>
      </RicashTableCard>
    </div>
  )
}