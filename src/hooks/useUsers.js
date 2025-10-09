// src/hooks/useUsers.js
import { useState, useEffect, useCallback } from 'react';
import userService from '@/services/userService';

export const useUsers = (initialFilters = {}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let data;
      
      // Appliquer les filtres
      if (filters.kycStatus && filters.kycStatus !== 'all') {
        switch (filters.kycStatus) {
          case 'valide':
            data = await userService.getUsersWithActiveKyc();
            break;
          case 'rejete':
            data = await userService.getUsersWithRejectedKyc();
            break;
          case 'en_cours':
            data = await userService.getUsersWithPendingKyc();
            break;
          default:
            data = await userService.getUsersByKycStatus(filters.kycStatus);
        }
      } else if (filters.status && filters.status !== 'all') {
        switch (filters.status) {
          case 'actif':
            data = await userService.getActiveUsers();
            break;
          case 'inactif':
            data = await userService.getInactiveUsers();
            break;
          default:
            data = await userService.getAllUsers();
        }
      } else {
        // Par défaut, récupérer tous les utilisateurs
        data = await userService.getAllUsers();
      }
      
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des utilisateurs');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const refreshUsers = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    filters,
    updateFilters,
    refreshUsers,
    setUsers
  };
};