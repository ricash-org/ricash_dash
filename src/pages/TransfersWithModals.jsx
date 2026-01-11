import React, { useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  CheckCircle, 
  XCircle,
  Clock,
  AlertTriangle,
  ArrowLeftRight,
  Download,
  Plus,
  RefreshCw,
  DollarSign,
  TrendingUp,
  Percent,
  User,
  Building2,
  MapPin
} from 'lucide-react'
import { RicashButton, RicashIconButton } from '@/components/ui/ricash-button'
import { RicashInput } from '@/components/ui/ricash-input'
import { RicashSelect } from '@/components/ui/ricash-input'
import { RicashCard, RicashStatCard, RicashTableCard } from '@/components/ui/ricash-card'
import { RicashTable, RicashTableHeader, RicashTableBody, RicashTableRow, RicashTableCell, RicashStatusBadge } from '@/components/ui/ricash-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Import modals
import TransferDetailsModal from '../components/Modals/TransferDetailsModal'
import CreateTransferModal from '../components/Modals/CreateTransferModal'

// Palette de couleurs Ricash
const RICASH_COLORS = {
  bleuFonce: '#29475B',
  dore: '#B19068',
  turquoise: '#2B8286',
  blancCasse: '#F4F2EE',
  bleuVert: '#376470'
}

// Mock data enrichi
const initialTransfers = [
  {
    id: 'TXN001',
    expediteur: {
      nom: 'Jean Dupont',
      telephone: '+33 6 12 34 56 78',
      email: 'jean.dupont@email.com',
      pays: 'France'
    },
    expediteurId: 'USR001',
    destinataire: {
      nom: 'Marie Martin',
      telephone: '+221 77 123 45 67',
      email: 'marie.martin@email.com',
      pays: 'Sénégal'
    },
    destinataireId: 'USR002',
    montant: 500.00,
    frais: 15.00,
    devise: 'EUR',
    statut: 'complete',
    pays: 'France → Sénégal',
    agence: {
      nom: 'Agence Dakar Centre',
      ville: 'Dakar',
      id: 'AGE001'
    },
    agent: {
      nom: 'Amadou Diallo',
      telephone: '+221 77 987 65 43',
      email: 'amadou.diallo@ricash.com'
    },
    codeRetrait: 'RC123456',
    dateCreation: '2024-01-20 14:30',
    dateCompletion: '2024-01-20 15:45',
    motif: 'Frais médicaux',
    canal: 'Mobile Money'
  },
  {
    id: 'TXN002',
    expediteur: {
      nom: 'Pierre Durand',
      telephone: '+33 6 98 76 54 32',
      email: 'pierre.durand@email.com',
      pays: 'France'
    },
    expediteurId: 'USR003',
    destinataire: {
      nom: 'Sophie Leroy',
      telephone: '+223 76 12 34 56',
      email: 'sophie.leroy@email.com',
      pays: 'Mali'
    },
    destinataireId: 'USR004',
    montant: 750.00,
    frais: 25.00,
    devise: 'EUR',
    statut: 'en_attente',
    pays: 'France → Mali',
    agence: {
      nom: 'Agence Bamako',
      ville: 'Bamako',
      id: 'AGE002'
    },
    agent: {
      nom: 'Fatou Traoré',
      telephone: '+223 76 98 76 54',
      email: 'fatou.traore@ricash.com'
    },
    codeRetrait: 'RC789012',
    dateCreation: '2024-01-20 16:15',
    dateCompletion: null,
    motif: 'Frais scolaires',
    canal: 'Comptoir'
  },
  {
    id: 'TXN003',
    expediteur: {
      nom: 'Michel Bernard',
      telephone: '+33 6 11 22 33 44',
      email: 'michel.bernard@email.com',
      pays: 'France'
    },
    expediteurId: 'USR005',
    destinataire: {
      nom: 'Aminata Diop',
      telephone: '+225 77 12 34 56',
      email: 'aminata.diop@email.com',
      pays: 'Côte d\'Ivoire'
    },
    destinataireId: 'USR006',
    montant: 300.00,
    frais: 12.00,
    devise: 'EUR',
    statut: 'suspect',
    pays: 'France → Côte d\'Ivoire',
    agence: {
      nom: 'Agence Abidjan',
      ville: 'Abidjan',
      id: 'AGE003'
    },
    agent: {
      nom: 'Kofi Asante',
      telephone: '+225 77 98 76 54',
      email: 'kofi.asante@ricash.com'
    },
    codeRetrait: 'RC345678',
    dateCreation: '2024-01-19 10:20',
    dateCompletion: null,
    motif: 'Urgence familiale',
    canal: 'Mobile Money'
  },
  {
    id: 'TXN004',
    expediteur: {
      nom: 'Sarah Johnson',
      telephone: '+33 6 55 66 77 88',
      email: 'sarah.johnson@email.com',
      pays: 'France'
    },
    expediteurId: 'USR007',
    destinataire: {
      nom: 'Moussa Kone',
      telephone: '+226 76 12 34 56',
      email: 'moussa.kone@email.com',
      pays: 'Burkina Faso'
    },
    destinataireId: 'USR008',
    montant: 1200.00,
    frais: 35.00,
    devise: 'EUR',
    statut: 'en_cours',
    pays: 'France → Burkina Faso',
    agence: {
      nom: 'Agence Ouagadougou',
      ville: 'Ouagadougou',
      id: 'AGE004'
    },
    agent: {
      nom: 'Ibrahim Ouedraogo',
      telephone: '+226 76 98 76 54',
      email: 'ibrahim.ouedraogo@ricash.com'
    },
    codeRetrait: 'RC901234',
    dateCreation: '2024-01-21 09:45',
    dateCompletion: null,
    motif: 'Investissement',
    canal: 'Comptoir'
  },
  {
    id: 'TXN005',
    expediteur: {
      nom: 'Emma Wilson',
      telephone: '+33 6 99 88 77 66',
      email: 'emma.wilson@email.com',
      pays: 'France'
    },
    expediteurId: 'USR009',
    destinataire: {
      nom: 'Aissatou Ba',
      telephone: '+221 77 55 44 33',
      email: 'aissatou.ba@email.com',
      pays: 'Sénégal'
    },
    destinataireId: 'USR010',
    montant: 450.00,
    frais: 18.00,
    devise: 'EUR',
    statut: 'annule',
    pays: 'France → Sénégal',
    agence: {
      nom: 'Agence Thiès',
      ville: 'Thiès',
      id: 'AGE005'
    },
    agent: {
      nom: 'Ousmane Fall',
      telephone: '+221 77 33 22 11',
      email: 'ousmane.fall@ricash.com'
    },
    codeRetrait: 'RC567890',
    dateCreation: '2024-01-18 14:20',
    dateCompletion: null,
    motif: 'Frais médicaux',
    canal: 'Mobile Money'
  }
]

const formatCurrency = (amount) => {
  if (amount === 0) return '€0'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const getStatusColor = (statut) => {
  switch (statut) {
    case 'complete':
      return 'success'
    case 'en_cours':
      return 'info'
    case 'en_attente':
      return 'warning'
    case 'annule':
      return 'error'
    case 'suspect':
      return 'warning'
    default:
      return 'default'
  }
}

const getStatusText = (statut) => {
  switch (statut) {
    case 'complete':
      return 'Complété'
    case 'en_cours':
      return 'En cours'
    case 'en_attente':
      return 'En attente'
    case 'annule':
      return 'Annulé'
    case 'suspect':
      return 'Suspect'
    default:
      return statut
  }
}


export default function TransfersWithModals() {
  const location = useLocation()
  const [transfers, setTransfers] = useState(initialTransfers)
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    corridor: 'all',
    agence: 'all',
    canal: 'all'
  })
  
  const filteredTransfers = useMemo(() => {
    return transfers.filter(transfer => {
      const matchesSearch = 
        transfer.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        transfer.expediteur.nom.toLowerCase().includes(filters.search.toLowerCase()) ||
        transfer.destinataire.nom.toLowerCase().includes(filters.search.toLowerCase()) ||
        transfer.codeRetrait.toLowerCase().includes(filters.search.toLowerCase())
      
      const matchesStatus = filters.status === 'all' || transfer.statut === filters.status
      const matchesCorridor = filters.corridor === 'all' || transfer.pays === filters.corridor
      const matchesAgence = filters.agence === 'all' || transfer.agence.ville === filters.agence
      const matchesCanal = filters.canal === 'all' || transfer.canal === filters.canal

      return matchesSearch && matchesStatus && matchesCorridor && matchesAgence && matchesCanal
    })
  }, [transfers, filters])

  const stats = {
    total: transfers.length,
    completed: transfers.filter(t => t.statut === 'complete').length,
    pending: transfers.filter(t => t.statut === 'en_attente').length,
    suspicious: transfers.filter(t => t.statut === 'suspect').length,
    enCours: transfers.filter(t => t.statut === 'en_cours').length,
    totalMontant: transfers.reduce((sum, t) => sum + (t.montant || 0), 0),
    revenusGeneres: transfers.reduce((sum, t) => sum + (t.frais || 0), 0),
    tauxReussite: Math.round((transfers.filter(t => t.statut === 'complete').length / transfers.length) * 100)
  }

  // Modal states
  const [selectedTransfer, setSelectedTransfer] = useState(null)
  const [transferDetailsOpen, setTransferDetailsOpen] = useState(false)
  const [createTransferOpen, setCreateTransferOpen] = useState(false)

  // Modal handlers
  const handleViewDetails = (transfer) => {
    setSelectedTransfer(transfer)
    setTransferDetailsOpen(true)
  }

  const handleApproveTransfer = (transferId) => {
    setTransfers(prev => prev.map(transfer => 
      transfer.id === transferId 
        ? { ...transfer, statut: 'en_cours' }
        : transfer
    ))
  }

  const handleRejectTransfer = (transferId) => {
    setTransfers(prev => prev.map(transfer => 
      transfer.id === transferId 
        ? { ...transfer, statut: 'annule' }
        : transfer
    ))
  }

  const handleCreateTransfer = () => {
    setCreateTransferOpen(true)
  }

  const handleCreateTransferSubmit = (transferData) => {
    console.log('Nouveau transfert créé:', transferData)
    setTransfers(prev => [transferData, ...prev])
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  // Adapter le contenu selon la route
  const getPageContent = () => {
    switch (location.pathname) {
      case '/transfers/pending':
        return {
          title: 'Transferts en attente',
          description: 'Validez les transferts nécessitant une approbation'
        }
      case '/transfers/suspicious':
        return {
          title: 'Transferts suspects',
          description: 'Analysez les transactions marquées comme suspectes'
        }
      default:
        return {
          title: 'Gestion des transferts',
          description: `Supervisez et validez les transactions de transfert d'argent (${filteredTransfers.length} transfert(s))`
        }
    }
  }

  const pageContent = getPageContent()

  return (
    <div className="space-y-8 p-6 bg-[#F4F2EE] min-h-screen">
      {/* Page header avec design Ricash */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#376470]/10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#29475B] mb-2">
              {pageContent.title}
            </h1>
            <p className="text-lg text-[#376470] font-medium">
              {pageContent.description}
            </p>
          </div>
          <div className="flex gap-3">
            <RicashButton
              variant="outline"
              size="lg"
              onClick={handleRefresh}
              loading={isLoading}
              loadingText="Actualisation..."
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Actualiser
            </RicashButton>
            <RicashButton 
              variant="accent"
              size="lg"
              onClick={handleCreateTransfer}
            >
              <Plus className="mr-2 h-5 w-5" />
              Nouveau transfert
            </RicashButton>
          </div>
        </div>
      </div>

      {/* Stats cards avec design Ricash */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        <RicashStatCard
          title="Total transferts"
          value={stats.total.toString()}
          change="+12%"
          changeType="positive"
          description="Ce mois"
          icon={ArrowLeftRight}
          iconColor={RICASH_COLORS.turquoise}
          className="transform hover:scale-105 transition-transform duration-300"
        />
        <RicashStatCard
          title="Complétés"
          value={stats.completed.toString()}
          change="+8%"
          changeType="positive"
          description="Ce mois"
          icon={CheckCircle}
          iconColor={RICASH_COLORS.turquoise}
          className="transform hover:scale-105 transition-transform duration-300"
        />
        <RicashStatCard
          title="En attente"
          value={stats.pending.toString()}
          change="+2"
          changeType="neutral"
          description="Aujourd'hui"
          icon={Clock}
          iconColor={RICASH_COLORS.dore}
          className="transform hover:scale-105 transition-transform duration-300"
        />
        <RicashStatCard
          title="Suspects"
          value={stats.suspicious.toString()}
          change="-1"
          changeType="negative"
          description="Ce mois"
          icon={AlertTriangle}
          iconColor="#ef4444"
          className="transform hover:scale-105 transition-transform duration-300"
        />
        <RicashStatCard
          title="En cours"
          value={stats.enCours.toString()}
          change="+3"
          changeType="positive"
          description="Aujourd'hui"
          icon={ArrowLeftRight}
          iconColor={RICASH_COLORS.bleuVert}
          className="transform hover:scale-105 transition-transform duration-300"
        />
        <RicashStatCard
          title="Volume total"
          value={formatCurrency(stats.totalMontant)}
          change="+15%"
          changeType="positive"
          description="Ce mois"
          icon={DollarSign}
          iconColor={RICASH_COLORS.bleuFonce}
          className="transform hover:scale-105 transition-transform duration-300"
        />
        <RicashStatCard
          title="Revenus générés"
          value={formatCurrency(stats.revenusGeneres)}
          change="+12%"
          changeType="positive"
          description="Ce mois"
          icon={TrendingUp}
          iconColor={RICASH_COLORS.dore}
          className="transform hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Filtres et recherche avec design Ricash */}
      <RicashCard className="overflow-hidden">
        <div className="p-6 border-b border-[#376470]/10">
          <h3 className="text-xl font-bold text-[#29475B] mb-4">
            Filtres et recherche
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#376470]" />
              <RicashInput
                placeholder="Rechercher un transfert..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
            
            <RicashSelect
              value={filters.status}
              onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            >
              <option value="all">Tous les statuts</option>
              <option value="complete">Complété</option>
              <option value="en_cours">En cours</option>
              <option value="en_attente">En attente</option>
              <option value="suspect">Suspect</option>
              <option value="annule">Annulé</option>
            </RicashSelect>

            <RicashSelect
              value={filters.corridor}
              onValueChange={(value) => setFilters(prev => ({ ...prev, corridor: value }))}
            >
              <option value="all">Tous les corridors</option>
              <option value="France → Sénégal">France → Sénégal</option>
              <option value="France → Mali">France → Mali</option>
              <option value="France → Côte d'Ivoire">France → Côte d'Ivoire</option>
              <option value="France → Burkina Faso">France → Burkina Faso</option>
            </RicashSelect>

            <RicashSelect
              value={filters.agence}
              onValueChange={(value) => setFilters(prev => ({ ...prev, agence: value }))}
            >
              <option value="all">Toutes les agences</option>
              <option value="Dakar">Dakar</option>
              <option value="Bamako">Bamako</option>
              <option value="Abidjan">Abidjan</option>
              <option value="Ouagadougou">Ouagadougou</option>
              <option value="Thiès">Thiès</option>
            </RicashSelect>

            <RicashSelect
              value={filters.canal}
              onValueChange={(value) => setFilters(prev => ({ ...prev, canal: value }))}
            >
              <option value="all">Tous les canaux</option>
              <option value="Mobile Money">Mobile Money</option>
              <option value="Comptoir">Comptoir</option>
            </RicashSelect>
          </div>
        </div>
      </RicashCard>

      {/* Tableau des transferts avec design Ricash */}
      <RicashTableCard
        title="Liste des transferts"
        description={`${filteredTransfers.length} transfert(s) trouvé(s)`}
        className="overflow-hidden"
      >
        <RicashTable>
          <RicashTableHeader>
            <RicashTableRow>
              <RicashTableCell className="font-semibold text-[#29475B]">Transaction</RicashTableCell>
              <RicashTableCell className="font-semibold text-[#29475B]">Expéditeur → Destinataire</RicashTableCell>
              <RicashTableCell className="font-semibold text-[#29475B]">Montant</RicashTableCell>
              <RicashTableCell className="font-semibold text-[#29475B]">Corridor</RicashTableCell>
              <RicashTableCell className="font-semibold text-[#29475B]">Statut</RicashTableCell>
              <RicashTableCell className="font-semibold text-[#29475B]">Agence/Agent</RicashTableCell>
              <RicashTableCell className="font-semibold text-[#29475B]">Actions</RicashTableCell>
            </RicashTableRow>
          </RicashTableHeader>
          <RicashTableBody>
            {filteredTransfers.map((transfer) => (
              <RicashTableRow key={transfer.id} className="hover:bg-[#376470]/5 transition-colors">
                <RicashTableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#2B8286]/20 flex items-center justify-center">
                      <ArrowLeftRight className="h-5 w-5 text-[#2B8286]" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#29475B]">
                        {transfer.id}
                      </div>
                      <div className="text-sm text-[#376470]">{transfer.codeRetrait}</div>
                      <div className="text-xs text-[#376470]/70">{transfer.dateCreation}</div>
                    </div>
                  </div>
                </RicashTableCell>
                
                <RicashTableCell>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="h-3 w-3 text-[#376470]" />
                      <span className="text-[#29475B]">{transfer.expediteur.nom}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <ArrowLeftRight className="h-3 w-3 text-[#376470]" />
                      <span className="text-[#29475B]">{transfer.destinataire.nom}</span>
                    </div>
                  </div>
                </RicashTableCell>
                
                <RicashTableCell>
                  <div className="space-y-1">
                    <div className="font-semibold text-[#29475B]">
                      {formatCurrency(transfer.montant)}
                    </div>
                    <div className="text-sm text-[#376470]">
                      Frais: {formatCurrency(transfer.frais)}
                    </div>
                  </div>
                </RicashTableCell>
                
                <RicashTableCell>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-[#376470]" />
                    <div className="text-sm text-[#29475B]">{transfer.pays}</div>
                  </div>
                </RicashTableCell>
                
                <RicashTableCell>
                  <RicashStatusBadge 
                    status={getStatusColor(transfer.statut)} 
                    text={getStatusText(transfer.statut)} 
                  />
                </RicashTableCell>
                
                <RicashTableCell>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-3 w-3 text-[#376470]" />
                      <span className="text-sm text-[#29475B]">{transfer.agence.nom}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-3 w-3 text-[#376470]" />
                      <span className="text-sm text-[#29475B]">{transfer.agent.nom}</span>
                    </div>
                  </div>
                </RicashTableCell>
                
                <RicashTableCell>
                  <div className="flex items-center space-x-2">
                    <RicashIconButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(transfer)}
                      className="text-[#2B8286] hover:bg-[#2B8286]/10"
                    >
                      <Eye className="h-4 w-4" />
                    </RicashIconButton>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <RicashIconButton
                          variant="ghost"
                          size="sm"
                          className="text-[#376470] hover:bg-[#376470]/10"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </RicashIconButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel className="text-[#29475B]">Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewDetails(transfer)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir détails
                        </DropdownMenuItem>
                        {transfer.statut === 'en_attente' && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-green-600"
                              onClick={() => handleApproveTransfer(transfer.id)}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approuver
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleRejectTransfer(transfer.id)}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Rejeter
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Télécharger reçu
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </RicashTableCell>
              </RicashTableRow>
            ))}
          </RicashTableBody>
        </RicashTable>
      </RicashTableCard>

      {/* Modals */}
      <TransferDetailsModal
        isOpen={transferDetailsOpen}
        onClose={() => setTransferDetailsOpen(false)}
        transfer={selectedTransfer}
        onApprove={handleApproveTransfer}
        onReject={handleRejectTransfer}
      />
      
      <CreateTransferModal
        isOpen={createTransferOpen}
        onClose={() => setCreateTransferOpen(false)}
        onCreate={handleCreateTransferSubmit}
      />
    </div>
  )
}

