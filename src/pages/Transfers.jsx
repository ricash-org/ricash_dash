// src/pages/Transactions.jsx
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  ArrowLeftRight,
  Download,
  Plus,
  RefreshCw,
  DollarSign,
  TrendingUp,
  Percent,
  User,
  Building2,
  MapPin
} from 'lucide-react'
import { RicashButton, RicashIconButton } from '@/components/ui/ricash-button'
import { RicashInput } from '@/components/ui/ricash-input'
import { RicashSelect } from '@/components/ui/ricash-input'
import { RicashCard, RicashStatCard, RicashTableCard } from '@/components/ui/ricash-card'
import { RicashTable, RicashTableHeader, RicashTableBody, RicashTableRow, RicashTableCell, RicashStatusBadge } from '@/components/ui/ricash-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

// Service API
import { transactionService } from '@/services/transactionService'

// Fonctions utilitaires
const formatCurrency = (amount, currency = 'XOF') => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount || 0)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return 'Date invalide';
  }
}

const getStatusColor = (statut) => {
  switch (statut) {
    case 'COMPLETEE':
      return 'success'
    case 'EN_COURS':
      return 'info'
    case 'EN_ATTENTE':
      return 'warning'
    case 'ANNULEE':
      return 'error'
    case 'REJETEE':
      return 'error'
    default:
      return 'default'
  }
}

const getStatusText = (statut) => {
  switch (statut) {
    case 'COMPLETEE':
      return 'Complétée'
    case 'EN_COURS':
      return 'En cours'
    case 'EN_ATTENTE':
      return 'En attente'
    case 'ANNULEE':
      return 'Annulée'
    case 'REJETEE':
      return 'Rejetée'
    default:
      return statut
  }
}

const getStatusIcon = (statut) => {
  switch (statut) {
    case 'COMPLETEE':
      return <CheckCircle className="h-4 w-4" />
    case 'EN_COURS':
      return <Clock className="h-4 w-4" />
    case 'EN_ATTENTE':
      return <Clock className="h-4 w-4" />
    case 'ANNULEE':
    case 'REJETEE':
      return <XCircle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

// Fonction utilitaire pour déterminer les parties selon le type de transaction
const getPartiesTransaction = (transaction) => {
  switch (transaction.type) {
    case 'CLIENT_TO_CLIENT':
      return {
        expediteur: transaction.expediteurNom || 'N/A',
        expediteurTel: transaction.expediteurTelephone || 'N/A',
        destinataire: transaction.destinataireNom || 'N/A',
        destinataireTel: transaction.destinataireTelephone || 'N/A'
      };
    
    case 'CLIENT_TO_AGENT':
      return {
        expediteur: transaction.expediteurNom || 'N/A',
        expediteurTel: transaction.expediteurTelephone || 'N/A',
        destinataire: transaction.agentNom || 'N/A',
        destinataireTel: transaction.agentTelephone || 'N/A'
      };
    
    case 'AGENT_TO_CLIENT':
      return {
        expediteur: transaction.agentNom || 'N/A',
        expediteurTel: transaction.agentTelephone || 'N/A',
        destinataire: transaction.destinataireNom || 'N/A',
        destinataireTel: transaction.destinataireTelephone || 'N/A'
      };
    
    case 'AGENT_TO_AGENT':
      return {
        expediteur: transaction.expediteurAgentNom || 'N/A',
        expediteurTel: transaction.expediteurAgentTelephone || 'N/A',
        destinataire: transaction.destinataireAgentNom || 'N/A',
        destinataireTel: transaction.destinataireAgentTelephone || 'N/A'
      };
    
    default:
      return {
        expediteur: 'N/A',
        expediteurTel: 'N/A',
        destinataire: 'N/A',
        destinataireTel: 'N/A'
      };
  }
};

// Fonction pour obtenir le badge du type de transaction
const getTypeBadge = (type) => {
  const typeLabels = {
    'CLIENT_TO_CLIENT': 'Client → Client',
    'CLIENT_TO_AGENT': 'Client → Agent', 
    'AGENT_TO_CLIENT': 'Agent → Client',
    'AGENT_TO_AGENT': 'Agent → Agent'
  };
  
  const typeColors = {
    'CLIENT_TO_CLIENT': 'bg-blue-100 text-blue-800',
    'CLIENT_TO_AGENT': 'bg-green-100 text-green-800',
    'AGENT_TO_CLIENT': 'bg-orange-100 text-orange-800',
    'AGENT_TO_AGENT': 'bg-purple-100 text-purple-800'
  };
  
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${typeColors[type] || 'bg-gray-100 text-gray-800'}`}>
      {typeLabels[type] || type}
    </span>
  );
};

export default function Transactions() {
  const location = useLocation()
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    enAttente: 0,
    completees: 0,
    enCours: 0,
    annulees: 0,
    rejetees: 0,
    montantTotal: 0,
    fraisTotal: 0
  })
  
  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    status: 'all'
  })

  // Charger les données au montage du composant
  useEffect(() => {
    console.log('🚀 Composant Transactions monté, chargement des données...');
    loadUserData();
    loadTransactions()
  }, [])

  // src/pages/Transactions.jsx

// Charger les données de l'utilisateur
const loadUserData = () => {
  try {
    // Essayer plusieurs sources
    const agentData = localStorage.getItem('ricash_agent');
    const userData = localStorage.getItem('ricash_user');
    const tokenData = sessionStorage.getItem('userData');
    
    console.log('🔍 Recherche des données utilisateur dans le composant:');
    console.log('   - ricash_agent:', agentData);
    console.log('   - ricash_user:', userData);
    console.log('   - userData:', tokenData);
    
    let userDataToUse = null;
    
    // Priorité 1: ricash_agent
    if (agentData) {
      userDataToUse = JSON.parse(agentData);
    } 
    // Priorité 2: ricash_user
    else if (userData) {
      userDataToUse = JSON.parse(userData);
    }
    // Priorité 3: userData (sessionStorage)
    else if (tokenData) {
      userDataToUse = JSON.parse(tokenData);
    }
    
    if (userDataToUse) {
      // Normaliser les rôles
      let normalizedRole = userDataToUse.role;
      if (normalizedRole === 'ROLE_ADMIN' || normalizedRole === 'ADMIN') {
        normalizedRole = 'ADMIN';
      } else if (normalizedRole === 'ROLE_AGENT' || normalizedRole === 'AGENT') {
        normalizedRole = 'AGENT';
      }
      
      const normalizedData = {
        ...userDataToUse,
        role: normalizedRole
      };
      
      setUserData(normalizedData);
      console.log('👤 Données utilisateur chargées et normalisées:', normalizedData);
      return normalizedData;
    } else {
      console.warn('⚠️ Aucune donnée utilisateur trouvée dans aucune source');
      const fallbackData = { role: 'AGENT', id: null };
      setUserData(fallbackData);
      return fallbackData;
    }
  } catch (error) {
    console.error('❌ Erreur lors du chargement des données utilisateur:', error);
    const fallbackData = { role: 'AGENT', id: null };
    setUserData(fallbackData);
    return fallbackData;
  }
}

// Dans loadTransactions, améliorer la récupération des données
const loadTransactions = async () => {
  setIsLoading(true)
  try {
    console.log('📡 Début du chargement des transactions...');
    
    // Charger les données utilisateur
    const currentUserData = loadUserData();
    
    // DÉTERMINATION DU RÔLE
    const isAdmin = currentUserData?.role === 'ADMIN';
    const isAgent = currentUserData?.role === 'AGENT';
    
    console.log('👤 Utilisateur connecté:', { 
      id: currentUserData?.id, 
      role: currentUserData?.role, 
      isAdmin,
      isAgent
    });

    let transactionsData = []
    
    // Adapter le chargement selon la route
    if (location.pathname.includes('/pending')) {
      console.log('🔄 Chargement des transactions en attente...');
      transactionsData = await transactionService.getTransactionsByStatus('EN_ATTENTE')
    } else if (location.pathname.includes('/suspicious')) {
      console.log('🔄 Chargement des transactions suspectes...');
      transactionsData = await transactionService.getAllTransactions()
    } else {
      console.log('🔄 Chargement des transactions selon le rôle...');
      transactionsData = await transactionService.getAllTransactions()
    }
    
    console.log('✅ Données reçues:', transactionsData);
    setTransactions(transactionsData || [])
    calculateStats(transactionsData || [])
    
    // Message de succès adapté au rôle
    const successMessage = isAdmin 
      ? `${transactionsData?.length || 0} transactions chargées` 
      : `${transactionsData?.length || 0} de vos transactions chargées`;
    
    toast.success(successMessage)
  } catch (error) {
    console.error('❌ Erreur lors du chargement des transactions:', error)
    
    // Message d'erreur plus spécifique
    if (error.response?.status === 500) {
      toast.error('Erreur serveur lors du chargement des transactions');
    } else {
      toast.error('Erreur lors du chargement des transactions')
    }
    
    setTransactions([])
    setStats({
      total: 0,
      enAttente: 0,
      completees: 0,
      enCours: 0,
      annulees: 0,
      rejetees: 0,
      montantTotal: 0,
      fraisTotal: 0
    })
  } finally {
    setIsLoading(false)
  }
}

  // Calculer les statistiques
  const calculateStats = (transactionsData) => {
    if (!transactionsData || !Array.isArray(transactionsData)) {
      console.warn('⚠️ Données de transactions invalides pour les statistiques');
      return;
    }

    const total = transactionsData.length
    const enAttente = transactionsData.filter(t => t.statut === 'EN_ATTENTE').length
    const completees = transactionsData.filter(t => t.statut === 'COMPLETEE').length
    const enCours = transactionsData.filter(t => t.statut === 'EN_COURS').length
    const annulees = transactionsData.filter(t => t.statut === 'ANNULEE').length
    const rejetees = transactionsData.filter(t => t.statut === 'REJETEE').length
    const montantTotal = transactionsData.reduce((sum, t) => sum + (t.montant || 0), 0)
    const fraisTotal = transactionsData.reduce((sum, t) => sum + (t.frais || 0), 0)

    setStats({
      total,
      enAttente,
      completees,
      enCours,
      annulees,
      rejetees,
      montantTotal,
      fraisTotal
    })

    console.log('📊 Statistiques calculées:', {
      total,
      enAttente,
      completees,
      enCours,
      annulees,
      rejetees,
      montantTotal,
      fraisTotal
    });
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
    console.log('🔄 Actualisation manuelle des transactions...');
    await loadTransactions()
  }, [])

  // Filtered transactions with memoization
  const filteredTransactions = useMemo(() => {
    if (!transactions || !Array.isArray(transactions)) {
      return [];
    }

    return transactions.filter(transaction => {
      const parties = getPartiesTransaction(transaction);
      
      const matchesSearch = !filters.search || 
        transaction.id?.toString().toLowerCase().includes(filters.search.toLowerCase()) ||
        transaction.codeTransaction?.toLowerCase().includes(filters.search.toLowerCase()) ||
        parties.expediteur.toLowerCase().includes(filters.search.toLowerCase()) ||
        parties.destinataire.toLowerCase().includes(filters.search.toLowerCase()) ||
        parties.expediteurTel.toLowerCase().includes(filters.search.toLowerCase()) ||
        parties.destinataireTel.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || transaction.statut === filters.status;

      return matchesSearch && matchesStatus;
    });
  }, [transactions, filters])

  // Gestion des actions sur les transactions
  const handleExecuterTransfert = async (transactionId) => {
    try {
      const updatedTransaction = await transactionService.executerTransfert(transactionId)
      setTransactions(prev => 
        prev.map(t => t.id === transactionId ? updatedTransaction : t)
      )
      toast.success('Transfert exécuté avec succès')
      await loadTransactions() // Recharger pour mettre à jour les stats
    } catch (error) {
      console.error('Erreur lors de l\'exécution du transfert:', error)
      toast.error('Erreur lors de l\'exécution du transfert')
    }
  }

  const handleAnnulerTransaction = async (transactionId) => {
    try {
      const updatedTransaction = await transactionService.annulerTransaction(transactionId)
      setTransactions(prev => 
        prev.map(t => t.id === transactionId ? updatedTransaction : t)
      )
      toast.success('Transaction annulée avec succès')
      await loadTransactions() // Recharger pour mettre à jour les stats
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la transaction:', error)
      toast.error('Erreur lors de l\'annulation de la transaction')
    }
  }

  const handleRejeterTransaction = async (transactionId, raison) => {
    try {
      const updatedTransaction = await transactionService.rejeterTransaction(transactionId, raison)
      setTransactions(prev => 
        prev.map(t => t.id === transactionId ? updatedTransaction : t)
      )
      toast.success('Transaction rejetée avec succès')
      await loadTransactions() // Recharger pour mettre à jour les stats
    } catch (error) {
      console.error('Erreur lors du rejet de la transaction:', error)
      toast.error('Erreur lors du rejet de la transaction')
    }
  }

  // Navigation handlers
  const handleViewDetails = (transaction) => {
    navigate(`/app/transfers/${transaction.id}/details`)
  }

  const handleCreateTransfer = () => {
    navigate('/app/transactions/create')
  }

  const handleExport = () => {
    if (!filteredTransactions.length) {
      toast.warning('Aucune transaction à exporter')
      return;
    }

    const csvContent = [
      ['ID', 'Expéditeur', 'Téléphone Expéditeur', 'Destinataire', 'Téléphone Destinataire', 'Montant', 'Statut', 'Date', 'Code Transaction', 'Type'].join(','),
      ...filteredTransactions.map(transaction => {
        const parties = getPartiesTransaction(transaction);
        return [
          transaction.id,
          parties.expediteur,
          parties.expediteurTel,
          parties.destinataire,
          parties.destinataireTel,
          `${transaction.montant || 0} XOF`,
          transaction.statut,
          formatDate(transaction.dateCreation),
          transaction.codeTransaction || 'N/A',
          transaction.type || 'N/A'
        ].join(',')
      })
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('Export des transactions téléchargé avec succès!')
  }

  // Adapter le contenu selon la route et le rôle
  const getPageContent = () => {
    const currentUserData = userData || JSON.parse(localStorage.getItem('ricash_agent') || '{}');
    const isAdmin = currentUserData.role === 'ADMIN';
    
    const baseDescription = isAdmin 
      ? `Supervisez toutes les transactions de transfert d'argent (${filteredTransactions.length} transaction(s))`
      : `Gérez vos transactions de transfert d'argent (${filteredTransactions.length} transaction(s))`;

    switch (location.pathname) {
      case '/app/transactions/pending':
        return {
          title: isAdmin ? 'Transactions en attente' : 'Mes transactions en attente',
          description: isAdmin 
            ? 'Validez les transactions nécessitant une approbation' 
            : 'Vos transactions en attente de traitement'
        }
      case '/app/transactions/suspicious':
        return {
          title: 'Transactions suspectes',
          description: 'Analysez les transactions marquées comme suspectes'
        }
      default:
        return {
          title: isAdmin ? 'Gestion des transactions' : 'Mes transactions',
          description: baseDescription
        }
    }
  }

  const pageContent = getPageContent()
  const currentUserData = userData || JSON.parse(localStorage.getItem('ricash_agent') || '{}');
  const isAdmin = currentUserData.role === 'ADMIN';

  console.log('🎯 État actuel:', {
    isLoading,
    userData: currentUserData,
    isAdmin,
    transactionsCount: transactions?.length,
    filteredCount: filteredTransactions.length,
    filters,
    stats
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#29475B]">{pageContent.title}</h1>
          <p className="text-[#376470] mt-1">{pageContent.description}</p>
          {/* Indicateur de rôle */}
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              isAdmin 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {isAdmin ? '👑 Administrateur' : '👤 Agent'}
            </span>
            {!isAdmin && currentUserData.id && (
              <span className="text-xs text-gray-600">
                ID: {currentUserData.id}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <RicashButton
            variant="outline"
            onClick={handleExport}
            className="flex items-center gap-2"
            disabled={!filteredTransactions.length}
          >
            <Download className="h-4 w-4" />
            Exporter
          </RicashButton>
          <RicashButton 
            onClick={handleCreateTransfer}
            className="flex items-center gap-2 bg-gradient-to-r from-[#2B8286] to-[#B19068] hover:from-[#2B8286]/90 hover:to-[#B19068]/90"
          >
            <Plus className="h-4 w-4" />
            Nouvelle Transaction
          </RicashButton>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <RicashStatCard
          title="Total Transactions"
          value={stats.total.toString()}
          icon={ArrowLeftRight}
          iconColor="text-[#29475B]"
        />
        <RicashStatCard
          title="En Attente"
          value={stats.enAttente.toString()}
          icon={Clock}
          iconColor="text-yellow-600"
        />
        <RicashStatCard
          title="Complétées"
          value={stats.completees.toString()}
          icon={CheckCircle}
          iconColor="text-green-600"
        />
        <RicashStatCard
          title="En Cours"
          value={stats.enCours.toString()}
          icon={Clock}
          iconColor="text-blue-600"
        />
        <RicashStatCard
          title="Montant Total"
          value={formatCurrency(stats.montantTotal)}
          icon={DollarSign}
          iconColor="text-[#2B8286]"
        />
        <RicashStatCard
          title="Frais Total"
          value={formatCurrency(stats.fraisTotal)}
          icon={Percent}
          iconColor="text-[#B19068]"
        />
      </div>

      {/* Filtres et recherche */}
      <RicashCard className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <RicashInput
                placeholder="Rechercher par nom, ID, code transaction, téléphone..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <RicashSelect
              value={filters.status}
              onValueChange={(value) => updateFilters({ status: value })}
              placeholder="Statut"
              options={[
                { value: 'all', label: 'Tous les statuts' },
                { value: 'EN_ATTENTE', label: 'En attente' },
                { value: 'EN_COURS', label: 'En cours' },
                { value: 'COMPLETEE', label: 'Complétée' },
                { value: 'ANNULEE', label: 'Annulée' },
                { value: 'REJETEE', label: 'Rejetée' }
              ]}
            />
            <RicashButton variant="outline" onClick={resetFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Reset
            </RicashButton>
            <RicashButton variant="outline" onClick={handleRefresh} loading={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </RicashButton>
          </div>
        </div>
      </RicashCard>

      {/* Tableau des transactions */}
      {isLoading ? (
        <RicashCard className="p-12 text-center">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-[#2B8286] mr-3" />
            <span className="text-lg text-[#29475B]">Chargement des transactions...</span>
          </div>
        </RicashCard>
      ) : (
        <RicashTableCard>
          <RicashTable>
            <RicashTableHeader>
              <RicashTableRow>
                <RicashTableCell>ID</RicashTableCell>
                <RicashTableCell>Expéditeur</RicashTableCell>
                <RicashTableCell>Destinataire</RicashTableCell>
                <RicashTableCell>Montant</RicashTableCell>
                <RicashTableCell>Statut</RicashTableCell>
                <RicashTableCell>Date</RicashTableCell>
                <RicashTableCell>Code Transaction</RicashTableCell>
                <RicashTableCell>Actions</RicashTableCell>
              </RicashTableRow>
            </RicashTableHeader>
            <RicashTableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => {
                  const parties = getPartiesTransaction(transaction);
                  
                  return (
                    <RicashTableRow key={transaction.id}>
                      <RicashTableCell>
                        <div>
                          <div className="font-medium text-[#29475B]">{transaction.id}</div>
                        </div>
                      </RicashTableCell>
                      
                      {/* Cellule Expéditeur corrigée */}
                      <RicashTableCell>
                        <div>
                          <div className="font-medium text-[#29475B]">
                            {parties.expediteur}
                          </div>
                          <div className="text-sm text-[#376470]">
                            {parties.expediteurTel}
                          </div>
                          <div className="mt-1">
                            {getTypeBadge(transaction.type)}
                          </div>
                        </div>
                      </RicashTableCell>
                      
                      {/* Cellule Destinataire corrigée */}
                      <RicashTableCell>
                        <div>
                          <div className="font-medium text-[#29475B]">
                            {parties.destinataire}
                          </div>
                          <div className="text-sm text-[#376470]">
                            {parties.destinataireTel}
                          </div>
                        </div>
                      </RicashTableCell>
                      
                      <RicashTableCell>
                        <div>
                          <div className="font-medium text-[#29475B]">
                            {formatCurrency(transaction.montant)}
                          </div>
                          {transaction.frais && (
                            <div className="text-sm text-[#376470]">
                              Frais: {formatCurrency(transaction.frais)}
                            </div>
                          )}
                        </div>
                      </RicashTableCell>
                      
                      <RicashTableCell>
                        <RicashStatusBadge 
                          status={getStatusColor(transaction.statut)}
                          className="flex items-center gap-1"
                        >
                          {getStatusIcon(transaction.statut)}
                          {getStatusText(transaction.statut)}
                        </RicashStatusBadge>
                      </RicashTableCell>
                      
                      <RicashTableCell>
                        <div className="text-sm text-[#29475B]">
                          {formatDate(transaction.dateCreation)}
                        </div>
                      </RicashTableCell>
                      
                      <RicashTableCell>
                        <div className="font-mono text-sm text-[#376470]">
                          {transaction.codeTransaction || 'N/A'}
                        </div>
                      </RicashTableCell>
                      
                      <RicashTableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <RicashIconButton variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </RicashIconButton>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewDetails(transaction)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir détails
                            </DropdownMenuItem>
                            
                            {transaction.statut === 'EN_ATTENTE' && (
                              <>
                                <DropdownMenuItem 
                                  onClick={() => handleExecuterTransfert(transaction.id)}
                                  className="text-green-600"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Exécuter
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleRejeterTransaction(transaction.id, 'Rejet manuel')}
                                  className="text-red-600"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Rejeter
                                </DropdownMenuItem>
                              </>
                            )}
                            
                            {transaction.statut === 'EN_COURS' && (
                              <DropdownMenuItem 
                                onClick={() => handleAnnulerTransaction(transaction.id)}
                                className="text-orange-600"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Annuler
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </RicashTableCell>
                    </RicashTableRow>
                  );
                })
              ) : (
                <RicashTableRow>
                  <RicashTableCell colSpan={8} className="text-center py-8">
                    <ArrowLeftRight className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune transaction trouvée</h3>
                    <p className="text-gray-600 mb-4">
                      {filters.search ? 'Aucune transaction ne correspond à votre recherche.' : 'Aucune transaction disponible.'}
                    </p>
                    <RicashButton onClick={handleCreateTransfer}>
                      <Plus className="h-4 w-4 mr-2" />
                      Créer une transaction
                    </RicashButton>
                  </RicashTableCell>
                </RicashTableRow>
              )}
            </RicashTableBody>
          </RicashTable>
        </RicashTableCard>
      )}
    </div>
  )
}