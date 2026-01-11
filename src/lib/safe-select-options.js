// Predefined safe options for common use cases
export const SAFE_SELECT_OPTIONS = {
  userStatus: [
    { value: 'all', label: 'Tous les statuts', key: 'user-status-all' },
    { value: 'actif', label: 'Actif', key: 'user-status-actif' },
    { value: 'suspendu', label: 'Suspendu', key: 'user-status-suspendu' },
    { value: 'en_attente', label: 'En attente', key: 'user-status-en_attente' },
    { value: 'bloque', label: 'Bloqué', key: 'user-status-bloque' }
  ],
  
  kycStatus: [
    { value: 'all', label: 'Tous les KYC', key: 'kyc-status-all' },
    { value: 'valide', label: 'Validé', key: 'kyc-status-valide' },
    { value: 'en_cours', label: 'En cours', key: 'kyc-status-en_cours' },
    { value: 'rejete', label: 'Rejeté', key: 'kyc-status-rejete' },
    { value: 'non_verifie', label: 'Non vérifié', key: 'kyc-status-non_verifie' }
  ],
  
  agentStatus: [
    { value: 'all', label: 'Tous', key: 'agent-status-all' },
    { value: 'actif', label: 'Actif', key: 'agent-status-actif' },
    { value: 'inactif', label: 'Inactif', key: 'agent-status-inactif' },
    { value: 'conge', label: 'En congé', key: 'agent-status-conge' },
    { value: 'formation', label: 'Formation', key: 'agent-status-formation' },
    { value: 'suspendu', label: 'Suspendu', key: 'agent-status-suspendu' }
  ],
  
  agentLevel: [
    { value: 'all', label: 'Tous', key: 'agent-level-all' },
    { value: 'Expert', label: 'Expert', key: 'agent-level-expert' },
    { value: 'Senior', label: 'Senior', key: 'agent-level-senior' },
    { value: 'Intermédiaire', label: 'Intermédiaire', key: 'agent-level-intermediaire' },
    { value: 'Junior', label: 'Junior', key: 'agent-level-junior' },
    { value: 'Débutant', label: 'Débutant', key: 'agent-level-debutant' }
  ],
  
  transferStatus: [
    { value: 'all', label: 'Tous les statuts', key: 'transfer-status-all' },
    { value: 'en_attente', label: 'En attente', key: 'transfer-status-en_attente' },
    { value: 'en_cours', label: 'En cours', key: 'transfer-status-en_cours' },
    { value: 'complete', label: 'Complété', key: 'transfer-status-complete' },
    { value: 'annule', label: 'Annulé', key: 'transfer-status-annule' },
    { value: 'echec', label: 'Échec', key: 'transfer-status-echec' }
  ],
  
  currencies: [
    { value: 'EUR', label: 'Euro (€)', key: 'currency-eur' },
    { value: 'USD', label: 'Dollar US ($)', key: 'currency-usd' },
    { value: 'XOF', label: 'Franc CFA (F)', key: 'currency-xof' },
    { value: 'GBP', label: 'Livre Sterling (£)', key: 'currency-gbp' },
    { value: 'CAD', label: 'Dollar Canadien (C$)', key: 'currency-cad' }
  ],
  
  countries: [
    { value: 'all', label: 'Tous les pays', key: 'country-all' },
    { value: 'France', label: 'France', key: 'country-france' },
    { value: 'Senegal', label: 'Sénégal', key: 'country-senegal' },
    { value: 'Mali', label: 'Mali', key: 'country-mali' },
    { value: 'Burkina Faso', label: 'Burkina Faso', key: 'country-burkina' },
    { value: 'Côte d\'Ivoire', label: 'Côte d\'Ivoire', key: 'country-ivory-coast' },
    { value: 'Maroc', label: 'Maroc', key: 'country-morocco' },
    { value: 'Tunisie', label: 'Tunisie', key: 'country-tunisia' },
    { value: 'Algérie', label: 'Algérie', key: 'country-algeria' },
    { value: 'Canada', label: 'Canada', key: 'country-canada' },
    { value: 'États-Unis', label: 'États-Unis', key: 'country-usa' },
    { value: 'Royaume-Uni', label: 'Royaume-Uni', key: 'country-uk' }
  ],
  
  months: [
    { value: 'all', label: 'Tous les mois', key: 'month-all' },
    { value: '01', label: 'Janvier', key: 'month-01' },
    { value: '02', label: 'Février', key: 'month-02' },
    { value: '03', label: 'Mars', key: 'month-03' },
    { value: '04', label: 'Avril', key: 'month-04' },
    { value: '05', label: 'Mai', key: 'month-05' },
    { value: '06', label: 'Juin', key: 'month-06' },
    { value: '07', label: 'Juillet', key: 'month-07' },
    { value: '08', label: 'Août', key: 'month-08' },
    { value: '09', label: 'Septembre', key: 'month-09' },
    { value: '10', label: 'Octobre', key: 'month-10' },
    { value: '11', label: 'Novembre', key: 'month-11' },
    { value: '12', label: 'Décembre', key: 'month-12' }
  ],
  
  years: Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i
    return {
      value: year.toString(),
      label: year.toString(),
      key: `year-${year}`
    }
  })
}
