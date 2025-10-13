// src/services/agenceService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/agences';

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

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('🔐 Token expiré ou invalide');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
      localStorage.removeItem('ricash_agence');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const agenceService = {
  // Récupérer toutes les agences avec solde
  async getAllAgences() {
    try {
      const response = await api.get('/avec-solde');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des agences:', error);
      throw error;
    }
  },

  // Récupérer les agences actives
  async getAgencesActives() {
    try {
      const response = await api.get('/actives');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des agences actives:', error);
      throw error;
    }
  },

  // Récupérer les agences inactives
  async getAgencesInactives() {
    try {
      const response = await api.get('/inactives');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des agences inactives:', error);
      throw error;
    }
  },

  // Récupérer le solde total
  async getSoldeTotal() {
    try {
      const response = await api.get('/solde-total');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du solde total:', error);
      throw error;
    }
  },

  // Changer le statut d'une agence
  async toggleAgenceStatus(agenceId, isActive) {
    try {
      const response = await api.patch(`/${agenceId}/status?isActive=${isActive}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      throw error;
    }
  },

  // Créer une nouvelle agence
  async createAgence(agenceData) {
    try {
      const response = await api.post('/create/by-agent', agenceData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'agence:', error);
      throw error;
    }
  }
};