import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/admin';

const api = axios.create({
  baseURL: API_BASE_URL,
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
      localStorage.removeItem('ricash_agent');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const agentService = {
  // Récupérer tous les agents
  async getAllAgents() {
    try {
      const response = await api.get('/agents');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des agents:', error);
      throw error;
    }
  },

  // Récupérer un agent par son ID
// Récupérer un agent par son ID
async getAgentById(agentId) {
  try {
    console.log('🔄 Tentative de récupération de l\'agent ID:', agentId);
    console.log('📡 URL complète:', `${API_BASE_URL}/agents/${agentId}`);
    
    // Vérifiez le token
    const token = sessionStorage.getItem('token');
    console.log('🔐 Token utilisé:', token ? token.substring(0, 20) + '...' : 'AUCUN TOKEN');
    
    const response = await api.get(`/agents/${agentId}`);
    
    console.log('✅ Réponse reçue - Status:', response.status);
    console.log('📦 Données agent:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur détaillée:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      headers: error.config?.headers
    });
    
    // Si c'est une erreur 401, rediriger vers login
    if (error.response?.status === 401) {
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    throw error;
  }
},

  // Récupérer les agents en attente de validation
  async getAgentsEnAttente() {
    try {
      const response = await api.get('/agents/en-attente');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des agents en attente:', error);
      throw error;
    }
  },

  // Récupérer les agents actifs
  async getAgentsActifs() {
    try {
      const response = await api.get('/agents/actifs');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des agents actifs:', error);
      throw error;
    }
  },

  // Récupérer les agents inactifs
  async getAgentsInactifs() {
    try {
      const response = await api.get('/agents/inactifs');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des agents inactifs:', error);
      throw error;
    }
  },

  // Valider ou rejeter un agent
  async validateAgent(validationRequest) {
    try {
      const response = await api.post('/agents/validation', validationRequest);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la validation de l\'agent:', error);
      throw error;
    }
  },

  // Activer/désactiver un agent
  async toggleAgentStatus(agentId, active) {
    try {
      const response = await api.post(`/agents/${agentId}/toggle-status?active=${active}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      throw error;
    }
  },

  // Supprimer un agent
  async deleteAgent(agentId) {
    try {
      const response = await api.delete(`/agents/${agentId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'agent:', error);
      throw error;
    }
  }
};