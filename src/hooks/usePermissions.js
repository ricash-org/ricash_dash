// hooks/usePermissions.js
import { useContext } from 'react';
import { AuthContext } from '@/hooks/useAuth';

export function usePermissions() {
  const { user, hasRole, hasAnyRole, isAdmin, isAgent, isUser } = useContext(AuthContext);

  const getAccessibleMenuItems = (allItems) => {
    if (!user) return [];

    const rolePermissions = {
      'ADMIN': [
        'Dashboard', 'Utilisateurs', 'Transferts', 'Agences', 
        'Agents', 'Paramètres', 'Rapports', 'Sécurité'
      ],
      'AGENT': [
        'Dashboard', 'Transferts', 'Paramètres', 'Agences', 
      ],
      'USER': [
        'Dashboard', 'Transferts', 'Paramètres'
      ]
    };

    return allItems.filter(item => 
      rolePermissions[user.role]?.includes(item.title)
    );
  };

  return {
    user,
    hasRole,
    hasAnyRole,
    isAdmin: isAdmin(),
    isAgent: isAgent(),
    isUser: isUser(),
    getAccessibleMenuItems
  };
}