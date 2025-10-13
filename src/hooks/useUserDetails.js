import { useState, useCallback } from 'react';
import userService from '@/services/userService'; 

export const useUserDetails = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async (userId) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const userData = await userService.getUserById(userId);
      setUser(userData);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des détails utilisateur');
      console.error('Error fetching user details:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserStatus = useCallback(async (userId, statusData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await userService.updateUserStatus(userId, statusData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du statut');
      console.error('Error updating user status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const processKyc = useCallback(async (userId, kycDecision) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await userService.processKyc(userId, kycDecision);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du traitement KYC');
      console.error('Error processing KYC:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  return {
    user,
    loading,
    error,
    fetchUser,
    updateUserStatus,
    processKyc,
    clearUser
  };
};