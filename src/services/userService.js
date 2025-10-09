// src/services/userService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Instance axios configurée
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Intercepteur pour ajouter automatiquement le token
api.interceptors.request.use(
  (config) => {
    // ⬇️ CORRECTION : Utiliser sessionStorage au lieu de localStorage
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

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('🔐 Token expiré ou invalide');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
      localStorage.removeItem('ricash_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const userService = {
  // 🔹 Récupérer tous les utilisateurs
  getAllUsers: async () => {
    console.log('🔄 Tentative de récupération des utilisateurs...');
    const response = await api.get('/users');
    console.log('✅ Utilisateurs récupérés avec succès:', response.data.length);
    return response.data;
  },

  // 🔹 Récupérer les utilisateurs par statut KYC
  getUsersByKycStatus: async (kycStatus) => {
    const response = await api.get(`/users/kyc-status/${kycStatus}`);
    return response.data;
  },

  // 🔹 Utilisateurs avec KYC actif
  getUsersWithActiveKyc: async () => {
    const response = await api.get('/users/kyc-active');
    return response.data;
  },

  // 🔹 Utilisateurs avec KYC rejeté
  getUsersWithRejectedKyc: async () => {
    const response = await api.get('/users/kyc-rejected');
    return response.data;
  },

  // 🔹 Utilisateurs avec KYC en attente
  getUsersWithPendingKyc: async () => {
    const response = await api.get('/users/kyc-pending');
    return response.data;
  },

  // 🔹 Utilisateurs actifs
  getActiveUsers: async () => {
    const response = await api.get('/users/active');
    return response.data;
  },

  // 🔹 Utilisateurs inactifs
  getInactiveUsers: async () => {
    const response = await api.get('/users/inactive');
    return response.data;
  },

  // 🔹 Récupérer les détails d'un utilisateur spécifique
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // 🔹 Modifier le statut d'un utilisateur
  updateUserStatus: async (userId, statusData) => {
    const response = await api.put(`/users/${userId}/status`, statusData);
    return response.data;
  },

  // 🔹 Valider ou rejeter un KYC
  processKyc: async (userId, kycDecision) => {
    const response = await api.post(`/users/${userId}/kyc`, kycDecision);
    return response.data;
  },

  // 🔹 Créer un nouvel utilisateur
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // 🔹 Supprimer un utilisateur
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
};

export default userService;