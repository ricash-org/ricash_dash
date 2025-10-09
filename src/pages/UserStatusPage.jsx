// src/pages/Users.js
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  MoreHorizontal,
  LogOut,
  Euro
} from 'lucide-react';

// Import des composants Ricash
import { RicashCard, RicashStatCard, RicashTableCard } from '@/components/ui/ricash-card';
import { RicashButton, RicashIconButton } from '@/components/ui/ricash-button';
import { RicashInput, RicashSelect } from '@/components/ui/ricash-input';
import { RicashStatusBadge } from '@/components/ui/ricash-table';
import { RicashTable, RicashTableHeader, RicashTableBody, RicashTableRow, RicashTableCell } from '@/components/ui/ricash-table';
import { RicashDropdownMenu, RicashDropdownItem, RicashDropdownSeparator } from '@/components/ui/ricash-dropdown';

// Service API et hook pour les données dynamiques
import userService from '@/services/userService';
import { useAuth } from '@/hooks/useAuth';

// Palette de couleurs Ricash
const RICASH_COLORS = {
  bleuFonce: '#29475B',
  dore: '#B19068',
  turquoise: '#2B8286',
  blancCasse: '#F4F2EE',
  bleuVert: '#376470'
};

export default function Users() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  
  // State management avec données dynamiques
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState(() => ({
    search: '',
    status: location.pathname === '/app/users/suspended' ? 'suspendu' : 'all',
    kycStatus: location.pathname === '/app/users/kyc' ? 'en_cours' : 'all',
    pays: 'all',
    typeCompte: 'all',
    page: 1,
    limit: 20
  }));
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chargement des données utilisateurs depuis le backend
  const fetchUsers = useCallback(async () => {
    if (!isAuthenticated) {
      setError('Utilisateur non authentifié');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      console.log('🔄 Début du chargement des utilisateurs depuis le backend...');
      
      // Récupérer tous les utilisateurs depuis l'API
      const usersData = await userService.getAllUsers();
      console.log('✅ Utilisateurs récupérés avec succès:', usersData);
      
      setUsers(usersData);
    } catch (err) {
      console.error('❌ Erreur lors du chargement:', err);
      if (err.response?.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
        logout();
      } else {
        setError(err.response?.data?.message || 'Erreur lors du chargement des utilisateurs');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, logout]);

  // Chargement initial
  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    } else {
      setIsLoading(false);
      setError('Non authentifié');
    }
  }, [fetchUsers, isAuthenticated]);

  // Mettre à jour les filtres quand la route change
  useEffect(() => {
    if (location.pathname === '/app/users/suspended') {
      setFilters(prev => ({ ...prev, status: 'suspendu', kycStatus: 'all' }));
    } else if (location.pathname === '/app/users/kyc') {
      setFilters(prev => ({ ...prev, status: 'all', kycStatus: 'en_cours' }));
    } else {
      setFilters(prev => ({ ...prev, status: 'all', kycStatus: 'all' }));
    }
  }, [location.pathname]);

  // 🔥 STATS DYNAMIQUES AMÉLIORÉES
  const stats = useMemo(() => {
    if (!users.length) {
      return {
        total: 0,
        actifs: 0,
        suspendus: 0,
        kycEnAttente: 0,
        kycRejetes: 0,
        premium: 0,
        totalSolde: 0,
        totalTransactions: 0
      };
    }

    return {
      total: users.length,
      actifs: users.filter(u => 
        u.statut?.toLowerCase() === 'actif' || u.statut === 'ACTIF'
      ).length,
      suspendus: users.filter(u => 
        u.statut?.toLowerCase() === 'suspendu' || u.statut === 'SUSPENDU'
      ).length,
      kycEnAttente: users.filter(u => 
        u.kycStatus?.toLowerCase() === 'en_cours' || u.kycStatus === 'EN_COURS' || u.kycStatus === 'pending'
      ).length,
      kycRejetes: users.filter(u => 
        u.kycStatus?.toLowerCase() === 'rejete' || u.kycStatus === 'REJETE' || u.kycStatus === 'rejected'
      ).length,
      premium: users.filter(u => 
        u.typeCompte?.toLowerCase() === 'premium' || u.typeCompte === 'PREMIUM'
      ).length,
      totalSolde: users.reduce((sum, u) => sum + (parseFloat(u.solde) || 0), 0),
      totalTransactions: users.reduce((sum, u) => sum + (parseInt(u.nombreTransactions) || parseInt(u.transactions) || 0), 0)
    };
  }, [users]);

  // 🔥 CALCUL DES TENDANCES POUR LES STATS CARDS
  const calculateTrend = useCallback((current, previous = current * 0.88) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(0) + '%',
      type: change >= 0 ? 'positive' : 'negative'
    };
  }, []);

  // 🔥 STATS CARDS AVEC DONNÉES DYNAMIQUES ET TENDANCES
  const statsData = useMemo(() => [
    {
      title: 'Total Utilisateurs',
      value: stats.total.toString(),
      change: calculateTrend(stats.total).value,
      changeType: calculateTrend(stats.total).type,
      icon: UsersIcon,
      description: 'Tous les comptes créés',
      color: RICASH_COLORS.bleuFonce
    },
    {
      title: 'Utilisateurs Actifs',
      value: stats.actifs.toString(),
      change: calculateTrend(stats.actifs).value,
      changeType: calculateTrend(stats.actifs).type,
      icon: UserCheck,
      description: 'Comptes fonctionnels',
      color: RICASH_COLORS.turquoise
    },
    {
      title: 'KYC en Attente',
      value: stats.kycEnAttente.toString(),
      change: calculateTrend(stats.kycEnAttente).value,
      changeType: calculateTrend(stats.kycEnAttente).type,
      icon: Clock,
      description: 'En attente de validation',
      color: RICASH_COLORS.dore
    },
    {
      title: 'KYC Rejetés',
      value: stats.kycRejetes.toString(),
      change: calculateTrend(stats.kycRejetes).value,
      changeType: calculateTrend(stats.kycRejetes).type,
      icon: AlertTriangle,
      description: 'Documents rejetés',
      color: '#ef4444'
    },
    {
      title: 'Comptes Premium',
      value: stats.premium.toString(),
      change: calculateTrend(stats.premium).value,
      changeType: calculateTrend(stats.premium).type,
      icon: TrendingUp,
      description: 'Abonnements premium',
      color: RICASH_COLORS.bleuVert
    },
    {
      title: 'Solde Total',
      value: `€${stats.totalSolde.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '+5.2%',
      changeType: 'positive',
      icon: Euro,
      description: 'Total des soldes utilisateurs',
      color: '#10b981'
    }
  ], [stats, calculateTrend]);

  // Données filtrées optimisées
  const filteredUsers = useMemo(() => {
    if (!users.length) return [];
    
    return users.filter(user => {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = !filters.search || 
        user.nom?.toLowerCase().includes(searchTerm) ||
        user.prenom?.toLowerCase().includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm) ||
        user.id?.toString().toLowerCase().includes(searchTerm);
        
      const matchesStatus = filters.status === 'all' || 
        user.statut?.toLowerCase() === filters.status.toLowerCase();
      const matchesKyc = filters.kycStatus === 'all' || 
        user.kycStatus?.toLowerCase() === filters.kycStatus.toLowerCase();
      const matchesPays = filters.pays === 'all' || user.pays === filters.pays;
      const matchesType = filters.typeCompte === 'all' || user.typeCompte === filters.typeCompte;
      
      return matchesSearch && matchesStatus && matchesKyc && matchesPays && matchesType;
    });
  }, [users, filters]);

  // Handlers optimisés
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    updateFilters({ search: value, page: 1 });
  }, [updateFilters]);

  const handleFilterChange = useCallback((filterType, value) => {
    updateFilters({ [filterType]: value, page: 1 });
  }, [updateFilters]);
  
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      status: 'all',
      kycStatus: 'all',
      pays: 'all',
      typeCompte: 'all',
      page: 1,
      limit: 20
    });
  }, []);
  
  const handleRefresh = useCallback(async () => {
    await fetchUsers();
  }, [fetchUsers]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  // Navigation handlers
  const handleViewUser = useCallback((user) => {
    navigate(`/app/users/${user.id}/details`);
  }, [navigate]);

  const handleKycUser = useCallback((user) => {
    navigate(`/app/users/kyc/${user.id}`);
  }, [navigate]);

  const handleBlockUser = useCallback((user) => {
    navigate(`/app/users/${user.id}/block`);
  }, [navigate]);

  const handleModifyStatus = useCallback((user) => {
    navigate(`/app/users/${user.id}/status`);
  }, [navigate]);

  // 🔥 GESTION DES STATUTS DYNAMIQUES
// 🔥 CORRECTION : Gestion des statuts KYC selon votre enum
const getUserStatus = useCallback((user) => {
  const status = user.statut?.toLowerCase();
  const kycStatus = user.kycStatus; // Utilisez directement la valeur de l'API
  
  // Mapping des statuts KYC selon votre enum
  let kycType, kycLabel;
  switch (kycStatus) {
    case 'EN_COURS':
      kycType = 'warning';
      kycLabel = 'En cours';
      break;
    case 'VERIFIE':
      kycType = 'success';
      kycLabel = 'Validé';
      break;
    case 'REJETE':
      kycType = 'error';
      kycLabel = 'Rejeté';
      break;
    case 'NON_VERIFIE':
      kycType = 'secondary';
      kycLabel = 'Non vérifié';
      break;
    default:
      kycType = 'secondary';
      kycLabel = 'Inconnu';
  }
  
  return {
    status: {
      type: status === 'actif' ? 'success' : 
             status === 'suspendu' ? 'error' : 'warning',
      label: status === 'actif' ? 'Actif' : 
             status === 'suspendu' ? 'Suspendu' : 
             status === 'en_attente' ? 'En attente' : 'Inconnu'
    },
    kyc: {
      type: kycType,
      label: kycLabel
    }
  };
}, []);

  // Adapter le contenu selon la route
  const getPageContent = () => {
    switch (location.pathname) {
      case '/app/users/kyc':
        return {
          title: 'Validation KYC',
          description: `Validez les documents d'identité et dossiers KYC en attente (${stats.kycEnAttente} en attente)`,
          icon: Shield,
          color: RICASH_COLORS.turquoise
        };
      case '/app/users/suspended':
        return {
          title: 'Comptes suspendus',
          description: `Gérez les utilisateurs dont les comptes sont suspendus (${stats.suspendus} suspendus)`,
          icon: UserX,
          color: '#ef4444'
        };
      default:
        return {
          title: 'Gestion des utilisateurs',
          description: `Gérez les comptes utilisateurs, validez les KYC et surveillez l'activité (${filteredUsers.length} utilisateur(s) filtré(s))`,
          icon: UsersIcon,
          color: RICASH_COLORS.bleuFonce
        };
    }
  };

  const pageContent = getPageContent();

  // Affichage des états de chargement et d'erreur
  if (!isAuthenticated) {
    return (
      <div className="space-y-8 p-6 bg-[#F4F2EE] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#29475B] mb-2">Non authentifié</h2>
          <p className="text-[#376470] mb-4">{error || 'Redirection vers la page de connexion...'}</p>
          <RicashButton onClick={() => navigate('/login')}>
            Se connecter
          </RicashButton>
        </div>
      </div>
    );
  }

  if (isLoading && users.length === 0) {
    return (
      <div className="space-y-8 p-6 bg-[#F4F2EE] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B8286] mx-auto"></div>
          <p className="mt-4 text-[#376470]">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="space-y-8 p-6 bg-[#F4F2EE] min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 text-red-800">
            <AlertTriangle className="h-6 w-6" />
            <div>
              <h3 className="font-semibold">Erreur de chargement</h3>
              <p>{error}</p>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <RicashButton onClick={fetchUsers}>
              Réessayer
            </RicashButton>
            <RicashButton variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Se reconnecter
            </RicashButton>
          </div>
        </div>
      </div>
    );
  }

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
              <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Rôle des utilisateurs :</strong> Les utilisateurs sont des clients qui effectuent des transferts d'argent. 
                  Chaque utilisateur peut être expéditeur ou destinataire dans les transferts. 
                  Ils doivent passer la validation KYC pour effectuer des transactions.
                </p>
              </div>
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

      {/* 🔥 STATS CARDS DYNAMIQUES AVEC GRID AMÉLIORÉ */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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
            className="transform hover:scale-105 transition-transform duration-300 hover:shadow-lg"
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
            
            <RicashButton variant="outline" onClick={resetFilters}>
              <Filter className="mr-2 h-4 w-4" />
              Reset
            </RicashButton>
          </div>
        </div>
      </RicashCard>

      {/* Tableau des utilisateurs - DYNAMIQUE */}
      <RicashTableCard
        title="Liste des Utilisateurs"
        description={`${filteredUsers.length} utilisateur(s) trouvé(s) sur ${users.length} au total`}
        className="overflow-hidden"
      >
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2B8286] mx-auto"></div>
            <p className="mt-4 text-[#376470]">Mise à jour des données...</p>
          </div>
        ) : (
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
                {filteredUsers.map((user) => {
                  const userStatus = getUserStatus(user);
                  return (
                    <RicashTableRow key={user.id} className="hover:bg-[#376470]/5 transition-colors">
                      <RicashTableCell>
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            userStatus.status.type === 'success' ? 'bg-green-500' :
                            userStatus.status.type === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}></div>
                          <div className="w-10 h-10 bg-gradient-to-br from-[#2B8286] to-[#2B8286]/80 rounded-lg flex items-center justify-center shadow-sm">
                            <UsersIcon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-[#29475B]">
                              {user.prenom || 'N/A'} {user.nom || 'N/A'}
                            </div>
                            <div className="text-sm text-[#376470]">ID: {user.id}</div>
                          </div>
                        </div>
                      </RicashTableCell>
                      
                      <RicashTableCell>
                        <div>
                          <div className="text-sm text-[#29475B]">{user.email || 'N/A'}</div>
                          <div className="text-sm text-[#376470]">{user.telephone || 'N/A'}</div>
                        </div>
                      </RicashTableCell>
                      
                      <RicashTableCell>
                        <div>
                          <div className="text-sm text-[#29475B]">{user.ville || 'N/A'}</div>
                          <div className="text-sm text-[#376470]">{user.pays || 'N/A'}</div>
                        </div>
                      </RicashTableCell>
                      
                      <RicashTableCell>
                        <RicashStatusBadge
                          status={userStatus.status.type}
                          text={userStatus.status.label}
                        />
                      </RicashTableCell>
                      
                      <RicashTableCell>
                        <RicashStatusBadge
                          status={userStatus.kyc.type}
                          text={userStatus.kyc.label}
                        />
                      </RicashTableCell>
                      
                      <RicashTableCell>
                        <div className="text-sm font-semibold text-[#29475B]">
                          €{(parseFloat(user.solde) || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-[#376470]">{user.typeCompte || 'Standard'}</div>
                      </RicashTableCell>
                      
                      <RicashTableCell>
                        <div className="text-center font-medium text-[#29475B]">
                          {user.nombreTransactions || user.transactions || 0}
                        </div>
                      </RicashTableCell>
                      
                      <RicashTableCell>
                        <div className="text-sm text-[#376470]">
                          {user.derniereConnexion || 'Jamais connecté'}
                        </div>
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
                          
                          {(user.kycStatus === 'en_cours' || user.kycStatus === 'EN_COURS') && (
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
                  );
                })}
              </RicashTableBody>
            </RicashTable>
          </div>
        )}

        {filteredUsers.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <UsersIcon className="h-16 w-16 mx-auto text-[#376470]/50 mb-4" />
            <p className="text-[#376470] text-lg font-medium">Aucun utilisateur trouvé</p>
            <p className="text-[#376470]/70">Ajustez vos filtres pour voir plus de résultats</p>
          </div>
        )}
      </RicashTableCard>
    </div>
  );
}