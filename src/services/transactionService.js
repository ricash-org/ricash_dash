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

export const transactionService = {
  // Récupérer toutes les transactions - CORRECTION ICI
  async getAllTransactions() {
    try {
      console.log('🔄 Tentative de récupération de toutes les transactions...');
      const response = await api.get('/transactions'); // ← CHANGEMENT ICI
      console.log('✅ Transactions récupérées avec succès:', response.data.length, 'transactions');
      return response.data;
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
      const response = await api.get(`/transactions/${id}`); // ← CHANGEMENT ICI
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
      const response = await api.get(`/transactions/statut/${status}`); // ← CHANGEMENT ICI
      console.log('✅ Transactions par statut récupérées avec succès');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des transactions par statut:', error);
      console.error('Détails de l\'erreur:', error.response?.data || error.message);
      throw error;
    }
  },

  // Récupérer les transactions en cours
  async getTransactionsEnCours() {
    try {
      console.log('🔄 Tentative de récupération des transactions en cours...');
      const response = await api.get('/transactions/en-cours'); // ← CHANGEMENT ICI
      console.log('✅ Transactions en cours récupérées avec succès');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des transactions en cours:', error);
      console.error('Détails de l\'erreur:', error.response?.data || error.message);
      throw error;
    }
  },

  // Récupérer les transactions complétées
  async getTransactionsCompletees() {
    try {
      console.log('🔄 Tentative de récupération des transactions complétées...');
      const response = await api.get('/transactions/completees'); // ← CHANGEMENT ICI
      console.log('✅ Transactions complétées récupérées avec succès');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des transactions complétées:', error);
      console.error('Détails de l\'erreur:', error.response?.data || error.message);
      throw error;
    }
  },

  // Récupérer les transactions rejetées
  async getTransactionsRejetees() {
    try {
      console.log('🔄 Tentative de récupération des transactions rejetées...');
      const response = await api.get('/transactions/rejetees'); // ← CHANGEMENT ICI
      console.log('✅ Transactions rejetées récupérées avec succès');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des transactions rejetées:', error);
      console.error('Détails de l\'erreur:', error.response?.data || error.message);
      throw error;
    }
  },

  // Récupérer les transactions annulées
  async getTransactionsAnnulees() {
    try {
      console.log('🔄 Tentative de récupération des transactions annulées...');
      const response = await api.get('/transactions/annulees'); // ← CHANGEMENT ICI
      console.log('✅ Transactions annulées récupérées avec succès');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des transactions annulées:', error);
      console.error('Détails de l\'erreur:', error.response?.data || error.message);
      throw error;
    }
  },

  // Exécuter un transfert
  async executerTransfert(transactionId) {
    try {
      console.log('🔄 Tentative d\'exécution du transfert:', transactionId);
      const response = await api.post(`/transactions/executer/${transactionId}`); // ← CHANGEMENT ICI
      console.log('✅ Transfert exécuté avec succès');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de l\'exécution du transfert:', error);
      console.error('Détails de l\'erreur:', error.response?.data || error.message);
      throw error;
    }
  },

  // Annuler une transaction
  async annulerTransaction(transactionId) {
    try {
      console.log('🔄 Tentative d\'annulation de la transaction:', transactionId);
      const response = await api.put(`/transactions/annuler/${transactionId}`); // ← CHANGEMENT ICI
      console.log('✅ Transaction annulée avec succès');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de l\'annulation de la transaction:', error);
      console.error('Détails de l\'erreur:', error.response?.data || error.message);
      throw error;
    }
  },

  // Rejeter une transaction
  async rejeterTransaction(transactionId, raison) {
    try {
      console.log('🔄 Tentative de rejet de la transaction:', transactionId);
      const response = await api.put(`/transactions/rejeter/${transactionId}?raison=${encodeURIComponent(raison)}`); // ← CHANGEMENT ICI
      console.log('✅ Transaction rejetée avec succès');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors du rejet de la transaction:', error);
      console.error('Détails de l\'erreur:', error.response?.data || error.message);
      throw error;
    }
  },

  // Initier un nouveau transfert
  async initierTransfert(transferData) {
    try {
      console.log('🔄 Tentative d\'initiation d\'un nouveau transfert...');
      const response = await api.post('/transactions/initier', transferData); // ← CHANGEMENT ICI
      console.log('✅ Transfert initié avec succès');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de l\'initiation du transfert:', error);
      console.error('Détails de l\'erreur:', error.response?.data || error.message);
      throw error;
    }
  }
};