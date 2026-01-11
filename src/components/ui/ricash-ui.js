// Export des composants Ricash depuis leurs fichiers respectifs
export { RicashCard, RicashStatCard, RicashTableCard } from './ricash-card'
export { RicashButton } from './ricash-button'
export { RicashInput, RicashTextarea, RicashSelect } from './ricash-input'
export { RicashLabel } from './ricash-label'
export { RicashFormGroup } from './ricash-form-group'
export { RicashBadge } from './ricash-badge'

// Export des composants de table Ricash
export {
  RicashTable,
  RicashTableHeader,
  RicashTableBody,
  RicashTableRow,
  RicashTableCell,
  RicashStatusBadge,
  RicashTableAction,
  RicashTableActions,
  RicashTableRowSelect,
  RicashTablePagination
} from './ricash-table'

// Export des composants de navigation Ricash
export {
  RicashBreadcrumb,
  RicashTabs,
  RicashTabsContent,
  RicashTabsList,
  RicashTabsTrigger,
  RicashPagination,
  RicashFilterBar
} from './ricash-navigation'

// Export des composants de dropdown et actions de table Ricash
export {
  RicashDropdownMenu,
  RicashDropdownItem,
  RicashDropdownSeparator,
  RicashTableActionsDropdown,
  RicashTableBulkActions,
  RicashTableSearch,
  RicashTableFilters
} from './ricash-dropdown'

// Palette de couleurs officielle Ricash
export const RICASH_COLORS = {
  BLEU_FONCE: '#29475B',
  DORE_BEIGE: '#B19068',
  TURQUOISE: '#2B8286',
  BLANC_CASSE: '#F4F2EE',
  BLEU_VERT: '#376470'
}

// Classes utilitaires Ricash
export const RICASH_UTILITIES = {
  // Couleurs de fond
  'bg-ricash-primary': 'bg-[#29475B]',
  'bg-ricash-secondary': 'bg-[#B19068]',
  'bg-ricash-accent': 'bg-[#2B8286]',
  'bg-ricash-light': 'bg-[#F4F2EE]',
  'bg-ricash-medium': 'bg-[#376470]',
  
  // Couleurs de texte
  'text-ricash-primary': 'text-[#29475B]',
  'text-ricash-secondary': 'text-[#B19068]',
  'text-ricash-accent': 'text-[#2B8286]',
  'text-ricash-light': 'text-[#F4F2EE]',
  'text-ricash-medium': 'text-[#376470]',
  
  // Bordures
  'border-ricash-primary': 'border-[#29475B]',
  'border-ricash-secondary': 'border-[#B19068]',
  'border-ricash-accent': 'border-[#2B8286]',
  'border-ricash-light': 'border-[#F4F2EE]',
  'border-ricash-medium': 'border-[#376470]'
}

// Utilitaires Ricash
export const RicashUtils = {
  // Fonction pour obtenir une couleur avec opacité
  withOpacity: (color, opacity) => {
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  },
  
  // Fonction pour créer un gradient Ricash
  createGradient: (fromColor, toColor, direction = 'to-r') => {
    return `bg-gradient-${direction} from-[${fromColor}] to-[${toColor}]`
  },
  
  // Fonction pour obtenir une couleur Ricash par nom
  getColor: (name) => {
    const colors = {
      primary: '#29475B',
      secondary: '#B19068',
      accent: '#2B8286',
      light: '#F4F2EE',
      medium: '#376470'
    }
    return colors[name] || colors.primary
  }
}

// Tous les composants sont exportés individuellement ci-dessus
// Utilisez les imports nommés pour accéder aux composants :
// 
// import { RicashCard, RicashButton, RicashInput } from '@/components/ui/ricash-ui'
// 
// Ou importez directement depuis les fichiers spécifiques :
// 
// import { RicashCard } from '@/components/ui/ricash-card'
// import { RicashButton } from '@/components/ui/ricash-button'
