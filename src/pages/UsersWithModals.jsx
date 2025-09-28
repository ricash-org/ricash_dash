import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Ban, 
  CheckCircle,
  AlertTriangle,
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingButton } from '@/components/ui/loading-button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedCard, GlowCard } from '@/components/ui/animated-card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SafeSelect } from '@/components/ui/safe-select'
import { SAFE_SELECT_OPTIONS } from '@/lib/safe-select-options'
import { MoreHorizontal } from 'lucide-react'

// Import modals
import UserDetailsModal from '../components/Modals/UserDetailsModal'
import KycValidationModal from '../components/Modals/KycValidationModal'
import CreateUserModal from '../components/Modals/CreateUserModal'
import BlockUnblockModal from '../components/Modals/BlockUnblockModal'

// Pour l'instant, on simule ces modules jusqu'à ce qu'ils soient installés - Remove unused
// const useTableColumns = (columns) => useMemo(() => columns, [columns])
// const useTableActions = (actions) => useMemo(() => actions, [actions])
const createPerformanceTimer = () => ({ end: () => {} })
const useLogger = () => ({ logUserAction: () => {} })

// Configuration des colonnes optimisée - Remove unused
// const createUserColumns = () => [
//   {
//     key: 'user',
//     label: 'Utilisateur',
//     render: (_, user) => (
//       <div className="flex items-center space-x-3">
//         <div className={`w-2 h-2 rounded-full ${
//           user.statut === 'actif' ? 'bg-green-500' :
//           user.statut === 'suspendu' ? 'bg-red-500' :
//           user.statut === 'en_attente' ? 'bg-yellow-500' : 'bg-gray-500'
//         }`}></div>
//         <div>
//           <div className="font-medium">{user.prenom} {user.nom}</div>
//           <div className="text-sm text-muted-foreground">{user.id}</div>
//         </div>
//       </div>
//     )
//   },
//   {
//     key: 'contact',
//     label: 'Contact',
//     render: (_, user) => (
//       <div>
//         <div className="text-sm">{user.email}</div>
//         <div className="text-sm text-muted-foreground">{user.telephone}</div>
//       </div>
//     )
//   },
//   {
//     key: 'statut',
//     label: 'Statut',
//     type: 'status'
//   },
//   {
//     key: 'kycStatus',
//     label: 'KYC',
//     type: 'status'
//   },
//   {
//     key: 'solde',
//     label: 'Solde',
//     type: 'currency'
//   },
//   {
//     key: 'transactions',
//     label: 'Transactions',
//     render: (value) => <div className="text-center">{value}</div>
//   },
//   {
//     key: 'derniereConnexion',
//     label: 'Dernière connexion',
//     type: 'date'
//   }
// ]

const UsersWithModals = React.memo(() => {
  const location = useLocation()
  const { logUserAction } = useLogger()
  
  // State management local pour l'instant
  const [filters, setFilters] = useState(() => ({
    search: '',
    status: location.pathname === '/users/suspended' ? 'suspendu' : 'all',
    kycStatus: location.pathname === '/users/kyc' ? 'en_cours' : 'all',
    page: 1,
    limit: 20
  }))
  
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  // Mettre à jour les filtres quand la route change
  useEffect(() => {
    if (location.pathname === '/users/suspended') {
      setFilters(prev => ({ ...prev, status: 'suspendu', kycStatus: 'all' }))
    } else if (location.pathname === '/users/kyc') {
      setFilters(prev => ({ ...prev, status: 'all', kycStatus: 'en_cours' }))
    } else {
      setFilters(prev => ({ ...prev, status: 'all', kycStatus: 'all' }))
    }
  }, [location.pathname])
  
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      status: 'all',
      kycStatus: 'all',
      page: 1,
      limit: 20
    })
  }, [])
  
  // Modals state local
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [showKycValidation, setShowKycValidation] = useState(false)
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [showBlockUnblock, setShowBlockUnblock] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  
  // Mock data et loading states - Remove unused state for now
  // const [, setIsLoading] = useState(false)
  
  // Performance timer pour la page
  React.useEffect(() => {
    const timer = createPerformanceTimer('users_page_load')
    return () => timer.end()
  }, [])
  
  // Configuration des colonnes mémorisée - Remove unused for now
  // const columns = useTableColumns(createUserColumns())
  
  // Configuration des actions mémorisée - Remove unused for now
  // const actions = useTableActions([
  //   {
  //     key: 'view',
  //     label: 'Voir détails',
  //     icon: Eye
  //   },
  //   {
  //     key: 'edit',
  //     label: 'Modifier',
  //     icon: Edit
  //   },
  //   {
  //     key: 'kyc',
  //     label: 'Valider KYC',
  //     icon: CheckCircle,
  //     condition: (user) => user.kycStatus === 'en_cours'
  //   },
  //   {
  //     key: 'block',
  //     label: 'Bloquer/Débloquer',
  //     icon: Ban,
  //     variant: 'destructive'
  //   },
  //   {
  //     key: 'delete',
  //     label: 'Supprimer',
  //     icon: Trash2,
  //     variant: 'destructive'
  //   }
  // ])

  // Mock data - wrapped in useMemo to avoid recreating on each render
  const mockUsers = React.useMemo(() => [
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
    transactions: 15
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
    transactions: 8
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
    transactions: 3
    }
  ], [])
  
  // Stats calculées
  const stats = useMemo(() => ({
    total: mockUsers.length,
    actifs: mockUsers.filter(u => u.statut === 'actif').length,
    suspendus: mockUsers.filter(u => u.statut === 'suspendu').length,
    kycEnAttente: mockUsers.filter(u => u.kycStatus === 'en_cours').length
  }), [mockUsers])
  
  // Handlers optimisés
  const handleSearchChange = useCallback((e) => {
    const search = e.target.value
    updateFilters({ search, page: 1 })
    
    logUserAction('user_search', {
      searchTerm: search,
      component: 'UsersPage'
    })
  }, [updateFilters, logUserAction])
  
  const handleStatusFilter = useCallback((status) => {
    updateFilters({ status, page: 1 })
    
    logUserAction('user_filter_status', {
      status,
      component: 'UsersPage'
    })
  }, [updateFilters, logUserAction])
  
  const handleKycFilter = useCallback((kycStatus) => {
    updateFilters({ kycStatus, page: 1 })
    
    logUserAction('user_filter_kyc', {
      kycStatus,
      component: 'UsersPage'
    })
  }, [updateFilters, logUserAction])
  
  const handleCreateUser = useCallback(() => {
    setShowCreateUser(true)
    logUserAction('open_create_user_modal', { component: 'UsersPage' })
  }, [logUserAction])
  
  // Handlers simplifiés
  const handleViewUser = useCallback((user) => {
    setSelectedUser(user)
    setShowUserDetails(true)
    logUserAction('view_user', { userId: user.id })
  }, [logUserAction])

  const handleKycUser = useCallback((user) => {
    setSelectedUser(user)
    setShowKycValidation(true)
    logUserAction('kyc_user', { userId: user.id })
  }, [logUserAction])

  const handleBlockUser = useCallback((user) => {
    setSelectedUser(user)
    setShowBlockUnblock(true)
    logUserAction('block_user', { userId: user.id })
  }, [logUserAction])
  
  // Modal handlers simplifiés
  const handleUserCreate = useCallback((userData) => {
    console.log('Creating user:', userData)
    setShowCreateUser(false)
  }, [])
  
  const handleKycValidation = useCallback((decision, comments) => {
    console.log('KYC validation:', decision, comments)
    setShowKycValidation(false)
    setSelectedUser(null)
  }, [])
  
  const handleUserStatusUpdate = useCallback((status) => {
    console.log('Status update:', status)
    setShowBlockUnblock(false)
    setSelectedUser(null)
  }, [])
  
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
      
      return matchesSearch && matchesStatus && matchesKyc
    })
  }, [mockUsers, filters])

  // Adapter le contenu selon la route
  const getPageContent = () => {
    switch (location.pathname) {
      case '/users/kyc':
        return {
          title: 'Validation KYC',
          description: 'Validez les documents d\'identité et dossiers KYC en attente'
        }
      case '/users/suspended':
        return {
          title: 'Comptes suspendus',
          description: 'Gérez les utilisateurs dont les comptes sont suspendus'
        }
      default:
        return {
          title: 'Gestion des utilisateurs',
          description: `Gérez les comptes utilisateurs, validez les KYC et surveillez l'activité (${filteredUsers.length} utilisateur(s))`
        }
    }
  }

  const pageContent = getPageContent()

  return (
    <div className="p-6 space-y-6">
      {/* Header avec stats */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{pageContent.title}</h1>
          <p className="text-muted-foreground">
            {pageContent.description}
          </p>
        </div>
                 <LoadingButton 
           onClick={handleCreateUser} 
           loading={false}
           loadingText="Création..."
         >
          <Plus className="mr-2 h-4 w-4" />
          Nouvel utilisateur
         </LoadingButton>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnimatedCard>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Tous les comptes enregistrés
            </p>
          </CardContent>
        </AnimatedCard>
        
        <GlowCard glowColor="success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.actifs}</div>
            <p className="text-xs text-muted-foreground">
              Comptes actifs et fonctionnels
            </p>
          </CardContent>
        </GlowCard>
        
        <GlowCard glowColor="destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comptes Suspendus</CardTitle>
            <Ban className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.suspendus}</div>
            <p className="text-xs text-muted-foreground">
              Comptes temporairement bloqués
            </p>
          </CardContent>
        </GlowCard>
        
        <GlowCard glowColor="warning">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">KYC en Attente</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.kycEnAttente}</div>
            <p className="text-xs text-muted-foreground">
              Documents à valider
            </p>
          </CardContent>
        </GlowCard>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres et Recherche</CardTitle>
          <CardDescription>
            Recherchez et filtrez les utilisateurs selon vos critères
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, email ou ID..."
                  value={filters.search}
                  onChange={handleSearchChange}
                  className="pl-8"
              />
            </div>
            </div>
            <div className="flex gap-2">
            <SafeSelect
                value={filters.status}
                onValueChange={handleStatusFilter}
                options={[
                  { value: 'all', label: 'Tous les statuts' },
                  { value: 'actif', label: 'Actifs' },
                  { value: 'suspendu', label: 'Suspendus' },
                  { value: 'en_attente', label: 'En attente' },
                  { value: 'bloque', label: 'Bloqués' }
                ]}
            />
            <SafeSelect
                value={filters.kycStatus}
                onValueChange={handleKycFilter}
                options={[
                  { value: 'all', label: 'Tous KYC' },
                  { value: 'valide', label: 'KYC Validé' },
                  { value: 'en_cours', label: 'En cours' },
                  { value: 'rejete', label: 'Rejeté' },
                  { value: 'non_verifie', label: 'Non vérifié' }
                ]}
              />
              <Button variant="outline" onClick={resetFilters}>
                <Filter className="mr-2 h-4 w-4" />
                Reset
              </Button>
                        </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau optimisé */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Utilisateurs</CardTitle>
          <CardDescription>
            {`${filteredUsers.length} utilisateur(s) trouvé(s)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>KYC</TableHead>
                  <TableHead>Solde</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          user.statut === 'actif' ? 'bg-green-500' :
                          user.statut === 'suspendu' ? 'bg-red-500' :
                          user.statut === 'en_attente' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`}></div>
                        <div>
                          <div className="font-medium">{user.prenom} {user.nom}</div>
                          <div className="text-sm text-muted-foreground">{user.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{user.email}</div>
                        <div className="text-sm text-muted-foreground">{user.telephone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.statut === 'actif' ? 'default' : 'destructive'} 
                             className={user.statut === 'actif' ? 'bg-green-100 text-green-800' : ''}>
                        {user.statut === 'actif' ? 'Actif' : 
                         user.statut === 'suspendu' ? 'Suspendu' : 
                         user.statut === 'en_attente' ? 'En attente' : 'Bloqué'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.kycStatus === 'valide' ? 'default' : 
                                    user.kycStatus === 'en_cours' ? 'secondary' : 'destructive'}
                             className={user.kycStatus === 'valide' ? 'bg-green-100 text-green-800' : 
                                       user.kycStatus === 'en_cours' ? 'bg-blue-100 text-blue-800' : ''}>
                        {user.kycStatus === 'valide' ? 'Validé' : 
                         user.kycStatus === 'en_cours' ? 'En cours' : 
                         user.kycStatus === 'rejete' ? 'Rejeté' : 'Non vérifié'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">€{user.solde?.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">{user.transactions}</div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{user.derniereConnexion}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewUser(user)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir détails
                          </DropdownMenuItem>
                          {user.kycStatus === 'en_cours' && (
                            <DropdownMenuItem onClick={() => handleKycUser(user)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Valider KYC
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleBlockUser(user)}>
                              <Ban className="mr-2 h-4 w-4" />
                            Bloquer/Débloquer
                            </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun utilisateur trouvé avec ces critères.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={showUserDetails}
        onClose={() => {
          setShowUserDetails(false)
          setSelectedUser(null)
        }}
      />

      <KycValidationModal
        user={selectedUser}
        isOpen={showKycValidation}
        onClose={() => {
          setShowKycValidation(false)
          setSelectedUser(null)
        }}
        onValidate={handleKycValidation}
      />

      <CreateUserModal
        isOpen={showCreateUser}
        onClose={() => setShowCreateUser(false)}
        onSubmit={handleUserCreate}
      />

      <BlockUnblockModal
        user={selectedUser}
        isOpen={showBlockUnblock}
        onClose={() => {
          setShowBlockUnblock(false)
          setSelectedUser(null)
        }}
        onConfirm={handleUserStatusUpdate}
      />
    </div>
  )
})

UsersWithModals.displayName = 'UsersWithModals'

export default UsersWithModals
