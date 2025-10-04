// src/services/profileService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/auth';

const profileService = {
  // Récupérer le profil utilisateur
  getProfile: async (token) => {
    const response = await axios.get(`${API_BASE_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  // Mettre à jour le profil
  updateProfile: async (updates, token) => {
    const response = await axios.put(`${API_BASE_URL}/profile/update`, updates, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  // Changer le mot de passe
  changePassword: async (passwordData, token) => {
    const response = await axios.post(`${API_BASE_URL}/change-password`, passwordData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }
};

export default profileService;