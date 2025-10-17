// src/services/transactionService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter automatiquement le token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token ajouté à la requête:', token.substring(0, 20) + '...');
    } else {
      console.warn('❌ Aucun token trouvé dans le sessionStorage');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('🔐 Token expiré ou invalide');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
      localStorage.removeItem('ricash_agent');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Fonction utilitaire pour récupérer l'agent connecté
// src/services/transactionService.js

// Fonction utilitaire pour récupérer l'utilisateur connecté
const getCurrentUser = () => {
  try {
    // Essayer plusieurs sources de données
    const agentData = localStorage.getItem('ricash_agent');
    const userData = localStorage.getItem('ricash_user');
    const tokenData = sessionStorage.getItem('userData');
    
    console.log('🔍 Recherche des données utilisateur:');
    console.log('   - ricash_agent:', agentData);
    console.log('   - ricash_user:', userData);
    console.log('   - userData:', tokenData);
    
    // Priorité 1: ricash_agent
    if (agentData) {
      const parsed = JSON.parse(agentData);
      console.log('✅ Données utilisateur trouvées dans ricash_agent:', parsed);
      return parsed;
    }
    
    // Priorité 2: ricash_user
    if (userData) {
      const parsed = JSON.parse(userData);
      console.log('✅ Données utilisateur trouvées dans ricash_user:', parsed);
      return parsed;
    }
    
    // Priorité 3: userData (sessionStorage)
    if (tokenData) {
      const parsed = JSON.parse(tokenData);
      console.log('✅ Données utilisateur trouvées dans userData:', parsed);
      return parsed;
    }
    
    console.warn('⚠️ Aucune donnée utilisateur trouvée dans le stockage');
    return null;
    
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des données utilisateur:', error);
    return null;
  }
};

export const transactionService = {
  async getAllTransactions() {
    try {
      console.log('🔄 Tentative de récupération des transactions...');
      const currentUser = getCurrentUser();
      
      console.log('👤 Données utilisateur récupérées:', currentUser);
      
      // Si pas de données utilisateur, essayer de récupérer quand même
      if (!currentUser) {
        console.warn('⚠️ Aucune donnée utilisateur, tentative de récupération des transactions sans filtre');
        const response = await api.get('/transactions/agent/mes-transactions');
        console.log('✅ Transactions récupérées sans filtre utilisateur:', response.data.length, 'transactions');
        return response.data;
      }
      
      // Normaliser le rôle
      const userRole = currentUser.role?.toUpperCase();
      const isAdmin = userRole === 'ADMIN' || userRole === 'ROLE_ADMIN';
      
      console.log(`🎯 Rôle détecté: ${userRole}, isAdmin: ${isAdmin}`);
      
      if (isAdmin) {
        console.log('👑 Admin - Récupération de toutes les transactions');
        const response = await api.get('/transactions');
        console.log('✅ Toutes les transactions récupérées avec succès:', response.data.length, 'transactions');
        return response.data;
      } else {
        console.log('👤 Utilisateur - Récupération des transactions personnelles');
        const response = await api.get('/transactions/agent/mes-transactions');
        console.log('✅ Transactions personnelles récupérées avec succès:', response.data.length, 'transactions');
        return response.data;
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des transactions:', error);
      console.error('Détails de l\'erreur:', error.response?.data || error.message);
      console.error('URL tentée:', error.config?.url);
      throw error;
    }
  },

  // Récupérer une transaction par ID
  async getTransactionById(id) {
    try {
      console.log('🔄 Tentative de récupération de la transaction:', id);
      const response = await api.get(`/transactions/${id}`);
      console.log('✅ Transaction récupérée avec succès');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de la transaction:', error);
      console.error('Détails de l\'erreur:', error.response?.data || error.message);
      throw error;
    }
  },

  // Récupérer les transactions par statut
  async getTransactionsByStatus(status) {
    try {
      console.log('🔄 Tentative de récupération des transactions avec statut:', status);
      const currentAgent = getCurrentAgent();
      
      if (currentAgent?.role === 'ADMIN') {
        // Admin voit toutes les transactions par statut
        const response = await api.get(`/transactions/statut/${status}`);
        console.log('✅ Transactions par statut récupérées avec succès');
        return response.data;
      } else {
        // Agent doit filtrer côté frontend ou backend selon votre implémentation
        // Pour l'instant, on récupère toutes ses transactions et on filtre
        const allAgentTransactions = await this.getTransactionsByAgent(currentAgent.id);
        const filtered = allAgentTransactions.filter(t => t.statut === status);
        console.log('✅ Transactions par statut filtrées pour l\'agent:', filtered.length);
        return filtered;
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des transactions par statut:', error);
      console.error('Détails de l\'erreur:', error.response?.data || error.message);
      throw error;
    }
  },

  // Les autres méthodes restent inchangées...
  async getTransactionsEnCours() {
    try {
      console.log('🔄 Tentative de récupération des transactions en cours...');
      const response = await api.get('/transactions/en-cours');
      console.log('✅ Transactions en cours récupérées avec succès');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des transactions en cours:', error);
      console.error('Détails de l\'erreur:', error.response?.data || error.message);
      throw error;
    }
  },

  async getTransactionsCompletees() {
    try {
      console.log('🔄 Tentative de récupération des transactions complétées...');
      const response = await api.get('/transactions/completees');
      console.log('✅ Transactions complétées récupérées avec succès');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des transactions complétées:', error);
      console.error('Détails de l\'erreur:', error.response?.data || error.message);
      throw error;
    }
  },

  async getTransactionsRejetees() {
    try {
      console.log('🔄 Tentative de récupération des transactions rejetées...');
      const response = await api.get('/transactions/rejetees');
      console.log('✅ Transactions rejetées récupérées avec succès');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des transactions rejetées:', error);
      console.error('Détails de l\'erreur:', error.response?.data || error.message);
      throw error;
    }
  },

  async getTransactionsAnnulees() {
    try {
      console.log('🔄 Tentative de récupération des transactions annulées...');
      const response = await api.get('/transactions/annulees');
      console.log('✅ Transactions annulées récupérées avec succès');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des transactions annulées:', error);
      console.error('Détails de l\'erreur:', error.response?.data || error.message);
      throw error;
    }
  },

  async executerTransfert(transactionId) {
    try {
      console.log('🔄 Tentative d\'exécution du transfert:', transactionId);
      const response = await api.post(`/transactions/executer/${transactionId}`);
      console.log('✅ Transfert exécuté avec succès');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de l\'exécution du transfert:', error);
      console.error('Détails de l\'erreur:', error.response?.data || error.message);
      throw error;
    }
  },

  async annulerTransaction(transactionId) {
    try {
      console.log('🔄 Tentative d\'annulation de la transaction:', transactionId);
      const response = await api.put(`/transactions/annuler/${transactionId}`);
      console.log('✅ Transaction annulée avec succès');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de l\'annulation de la transaction:', error);
      console.error('Détails de l\'erreur:', error.response?.data || error.message);
      throw error;
    }
  },

  async rejeterTransaction(transactionId, raison) {
    try {
      console.log('🔄 Tentative de rejet de la transaction:', transactionId);
      const response = await api.put(`/transactions/rejeter/${transactionId}?raison=${encodeURIComponent(raison)}`);
      console.log('✅ Transaction rejetée avec succès');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors du rejet de la transaction:', error);
      console.error('Détails de l\'erreur:', error.response?.data || error.message);
      throw error;
    }
  },

  async initierTransfert(transferData) {
    try {
      console.log('🔄 Tentative d\'initiation d\'un nouveau transfert...');
      const response = await api.post('/transactions/initier', transferData);
      console.log('✅ Transfert initié avec succès');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de l\'initiation du transfert:', error);
      console.error('Détails de l\'erreur:', error.response?.data || error.message);
      throw error;
    }
  }
};