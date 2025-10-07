// AvatarService.js - VERSION CORRIGÉE
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/profil';

class AvatarService {
  async uploadAdminAvatar(adminId, file, token) { // Ajout du paramètre token
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_BASE_URL}/admin/${adminId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  }

  async uploadAgentAvatar(agentId, file, token) { // Ajout du paramètre token
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_BASE_URL}/agent/${agentId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  }

  async deleteAgentAvatar(agentId, token) { // Ajout du paramètre token
    await axios.delete(`${API_BASE_URL}/agent/${agentId}/avatar`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  async deleteAdminAvatar(adminId, token) { // Ajout du paramètre token
    await axios.delete(`${API_BASE_URL}/admin/${adminId}/avatar`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
}

export default new AvatarService();