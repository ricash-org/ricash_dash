import React, { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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
import { toast } from 'sonner'

// Palette de couleurs Ricash
const RICASH_COLORS = {
  bleuFonce: '#29475B',
  dore: '#B19068',
  turquoise: '#2B8286',
  blancCasse: '#F4F2EE',
  bleuVert: '#376470'
}

// Mock data enrichi
const mockTransfers = [
  {
    id: 'TXN001',
    expediteur: { nom: 'Jean Dupont', telephone: '+33 6 12 34 56 78', email: 'jean.dupont@email.com' },
    destinataire: { nom: 'Fatou Diallo', telephone: '+221 77 123 45 67', email: 'fatou.diallo@email.com' },
    montant: 500,
    devise: 'EUR',
    frais: 15,
    montantTotal: 515,
    statut: 'en_attente',
    dateCreation: '2024-01-15T10:30:00Z',
    pays: 'France → Sénégal',
    agence: { nom: 'Agence Dakar Centre', ville: 'Dakar', id: 'AGE001' },
    agent: { nom: 'Amadou Diallo', telephone: '+221 77 987 65 43', email: 'amadou.diallo@ricash.com' },
    codeRetrait: 'RC123456',
    motif: 'Frais médicaux',
    urgence: 'normal'
  },
  {
    id: 'TXN002',
    expediteur: { nom: 'Marie Martin', telephone: '+33 6 98 76 54 32', email: 'marie.martin@email.com' },
    destinataire: { nom: 'Ibrahima Sarr', telephone: '+221 77 234 56 78', email: 'ibrahima.sarr@email.com' },
    montant: 1200,
    devise: 'EUR',
    frais: 25,
    montantTotal: 1225,
    statut: 'traite',
    dateCreation: '2024-01-14T14:20:00Z',
    pays: 'France → Sénégal',
    agence: { nom: 'Agence Dakar Centre', ville: 'Dakar', id: 'AGE001' },
    agent: { nom: 'Amadou Diallo', telephone: '+221 77 987 65 43', email: 'amadou.diallo@ricash.com' },
    codeRetrait: 'RC789012',
    motif: 'Aide familiale',
    urgence: 'urgent'
  },
  {
    id: 'TXN003',
    expediteur: { nom: 'Pierre Dubois', telephone: '+33 6 45 67 89 01', email: 'pierre.dubois@email.com' },
    destinataire: { nom: 'Aminata Traoré', telephone: '+221 78 345 67 89', email: 'aminata.traore@email.com' },
    montant: 800,
    devise: 'EUR',
    frais: 20,
    montantTotal: 820,
    statut: 'suspendu',
    dateCreation: '2024-01-13T09:15:00Z',
    pays: 'France → Sénégal',
    agence: { nom: 'Agence Dakar Plateau', ville: 'Dakar', id: 'AGE002' },
    agent: { nom: 'Fatou Sarr', telephone: '+221 77 123 45 67', email: 'fatou.sarr@ricash.com' },
    codeRetrait: 'RC345678',
    motif: 'Études',
    urgence: 'normal'
  },
  {
    id: 'TXN004',
    expediteur: { nom: 'Sophie Laurent', telephone: '+33 6 23 45 67 89', email: 'sophie.laurent@email.com' },
    destinataire: { nom: 'Moussa Diop', telephone: '+221 76 456 78 90', email: 'moussa.diop@email.com' },
    montant: 300,
    devise: 'EUR',
    frais: 12,
    montantTotal: 312,
    statut: 'annule',
    dateCreation: '2024-01-12T16:45:00Z',
    pays: 'France → Sénégal',
    agence: { nom: 'Agence Thiès Centre', ville: 'Thiès', id: 'AGE003' },
    agent: { nom: 'Ibrahima Fall', telephone: '+221 77 234 56 78', email: 'ibrahima.fall@ricash.com' },
    codeRetrait: 'RC456789',
    motif: 'Urgence médicale',
    urgence: 'urgent'
  },
  {
    id: 'TXN005',
    expediteur: { nom: 'Thomas Moreau', telephone: '+33 6 34 56 78 90', email: 'thomas.moreau@email.com' },
    destinataire: { nom: 'Khadija Ndiaye', telephone: '+221 78 567 89 01', email: 'khadija.ndiaye@email.com' },
    montant: 1500,
    devise: 'EUR',
    frais: 30,
    montantTotal: 1530,
    statut: 'en_cours',
    dateCreation: '2024-01-11T11:30:00Z',
    pays: 'France → Sénégal',
    agence: { nom: 'Agence Dakar Centre', ville: 'Dakar', id: 'AGE001' },
    agent: { nom: 'Amadou Diallo', telephone: '+221 77 987 65 43', email: 'amadou.diallo@ricash.com' },
    codeRetrait: 'RC567890',
    motif: 'Investissement',
    urgence: 'normal'
  },
  {
    id: 'TXN006',
    expediteur: { nom: 'Claire Rousseau', telephone: '+33 6 12 34 56 78', email: 'claire.rousseau@email.com' },
    destinataire: { nom: 'Ousmane Ba', telephone: '+221 77 678 90 12', email: 'ousmane.ba@email.com' },
    montant: 750,
    devise: 'EUR',
    frais: 18,
    montantTotal: 768,
    statut: 'traite',
    dateCreation: '2024-01-10T14:20:00Z',
    pays: 'France → Sénégal',
    agence: { nom: 'Agence Saint-Louis', ville: 'Saint-Louis', id: 'AGE004' },
    agent: { nom: 'Mariama Sarr', telephone: '+221 77 345 67 89', email: 'mariama.sarr@ricash.com' },
    codeRetrait: 'RC678901',
    motif: 'Aide familiale',
    urgence: 'normal'
  },
  {
    id: 'TXN007',
    expediteur: { nom: 'Antoine Petit', telephone: '+33 6 22 33 44 55', email: 'antoine.petit@email.com' },
    destinataire: { nom: 'Fatou Fall', telephone: '+221 77 789 01 23', email: 'fatou.fall@email.com' },
    montant: 400,
    devise: 'EUR',
    frais: 15,
    montantTotal: 415,
    statut: 'en_attente',
    dateCreation: '2024-01-09T08:45:00Z',
    pays: 'France → Sénégal',
    agence: { nom: 'Agence Kaolack', ville: 'Kaolack', id: 'AGE005' },
    agent: { nom: 'Saliou Ndiaye', telephone: '+221 77 456 78 90', email: 'saliou.ndiaye@ricash.com' },
    codeRetrait: 'RC789012',
    motif: 'Paiement école',
    urgence: 'normal'
  },
  {
    id: 'TXN008',
    expediteur: { nom: 'Isabelle Blanc', telephone: '+33 6 33 44 55 66', email: 'isabelle.blanc@email.com' },
    destinataire: { nom: 'Cheikh Diop', telephone: '+221 77 890 12 34', email: 'cheikh.diop@email.com' },
    montant: 2000,
    devise: 'EUR',
    frais: 40,
    montantTotal: 2040,
    statut: 'traite',
    dateCreation: '2024-01-08T15:20:00Z',
    pays: 'France → Sénégal',
    agence: { nom: 'Agence Dakar Centre', ville: 'Dakar', id: 'AGE001' },
    agent: { nom: 'Amadou Diallo', telephone: '+221 77 987 65 43', email: 'amadou.diallo@ricash.com' },
    codeRetrait: 'RC890123',
    motif: 'Achat immobilier',
    urgence: 'urgent'
  }
]

const formatCurrency = (amount, currency = 'EUR') => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusColor = (statut) => {
  switch (statut) {
    case 'en_attente': return 'bg-yellow-100 text-yellow-800'
    case 'traite': return 'bg-green-100 text-green-800'
    case 'suspendu': return 'bg-red-100 text-red-800'
    case 'annule': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusIcon = (statut) => {
  switch (statut) {
    case 'en_attente': return <Clock className="h-4 w-4" />
    case 'traite': return <CheckCircle className="h-4 w-4" />
    case 'suspendu': return <XCircle className="h-4 w-4" />
    case 'annule': return <AlertTriangle className="h-4 w-4" />
    default: return <Clock className="h-4 w-4" />
  }
}

export default function Transfers() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('tous')
  const [sortBy, setSortBy] = useState('dateCreation')
  const [sortOrder, setSortOrder] = useState('desc')
  const [transfers, setTransfers] = useState(mockTransfers)

  // Déterminer le filtre basé sur l'URL
  const currentFilter = useMemo(() => {
    const path = location.pathname
    if (path.includes('/pending')) return 'en_attente'
    if (path.includes('/suspicious')) return 'suspendu'
    return 'tous'
  }, [location.pathname])

  // Appliquer le filtre initial
  useEffect(() => {
    setStatusFilter(currentFilter)
  }, [currentFilter])

  // Filtrer et trier les données
  const filteredTransfers = useMemo(() => {
    let filtered = transfers

    // Filtre par statut
    if (statusFilter !== 'tous') {
      filtered = filtered.filter(transfer => transfer.statut === statusFilter)
    }

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(transfer => 
        transfer.expediteur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.destinataire.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.codeRetrait.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === 'dateCreation') {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [transfers, statusFilter, searchTerm, sortBy, sortOrder])

  // Statistiques
  const stats = useMemo(() => {
    const total = transfers.length
    const enAttente = transfers.filter(t => t.statut === 'en_attente').length
    const traites = transfers.filter(t => t.statut === 'traite').length
    const suspendus = transfers.filter(t => t.statut === 'suspendu').length
    const montantTotal = transfers.reduce((sum, t) => sum + t.montant, 0)
    const fraisTotal = transfers.reduce((sum, t) => sum + t.frais, 0)

    return {
      total,
      enAttente,
      traites,
      suspendus,
      montantTotal,
      fraisTotal
    }
  }, [transfers])

  const handleViewDetails = (transferId) => {
    navigate(`/app/transfers/${transferId}/details`)
  }

  const handleCreateTransfer = () => {
    navigate('/app/transfers/create')
  }

  const handleExport = () => {
    // Créer un CSV des transferts filtrés
    const csvContent = [
      ['ID', 'Expéditeur', 'Destinataire', 'Montant', 'Statut', 'Date', 'Agence'].join(','),
      ...filteredTransfers.map(transfer => [
        transfer.id,
        transfer.expediteur.nom,
        transfer.destinataire.nom,
        `${transfer.montant} ${transfer.devise}`,
        transfer.statut,
        formatDate(transfer.dateCreation),
        transfer.agence.nom
      ].join(','))
    ].join('\n')

    // Créer et télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `transferts_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('Export des transferts téléchargé avec succès!')
  }

  const handleStatusChange = (transferId, newStatus) => {
    setTransfers(prevTransfers => 
      prevTransfers.map(transfer => 
        transfer.id === transferId 
          ? { ...transfer, statut: newStatus }
          : transfer
      )
    )
    toast.success(`Statut du transfert ${transferId} changé en: ${newStatus}`)
  }

  const handleSuspendTransfer = (transferId) => {
    setTransfers(prevTransfers => 
      prevTransfers.map(transfer => 
        transfer.id === transferId 
          ? { ...transfer, statut: 'suspendu' }
          : transfer
      )
    )
    toast.success(`Transfert ${transferId} suspendu pour vérification`)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#29475B]">Transferts</h1>
          <p className="text-[#376470] mt-1">
            {currentFilter === 'en_attente' && 'Transferts en attente de traitement'}
            {currentFilter === 'suspendu' && 'Transferts suspendus pour vérification'}
            {currentFilter === 'tous' && 'Gestion des transferts d\'argent'}
          </p>
        </div>
          <div className="flex gap-3">
            <RicashButton
              variant="outline"
              onClick={handleExport}
            className="flex items-center gap-2"
            >
            <Download className="h-4 w-4" />
              Exporter
            </RicashButton>
            <RicashButton 
              onClick={handleCreateTransfer}
            className="flex items-center gap-2 bg-gradient-to-r from-[#2B8286] to-[#B19068] hover:from-[#2B8286]/90 hover:to-[#B19068]/90"
            >
            <Plus className="h-4 w-4" />
            Nouveau Transfert
            </RicashButton>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <RicashStatCard
          title="Total Transferts"
          value={stats.total}
          icon={ArrowLeftRight}
          iconColor="text-[#29475B]"
        />
        <RicashStatCard
          title="En Attente"
          value={stats.enAttente}
          icon={Clock}
          iconColor="text-yellow-600"
        />
        <RicashStatCard
          title="Traités"
          value={stats.traites}
          icon={CheckCircle}
          iconColor="text-green-600"
        />
        <RicashStatCard
          title="Suspendus"
          value={stats.suspendus}
          icon={AlertTriangle}
          iconColor="text-red-600"
        />
        <RicashStatCard
          title="Montant Total"
          value={formatCurrency(stats.montantTotal)}
          icon={DollarSign}
          iconColor="text-[#2B8286]"
        />
        <RicashStatCard
          title="Frais Total"
          value={formatCurrency(stats.fraisTotal)}
          icon={Percent}
          iconColor="text-[#B19068]"
        />
      </div>

      {/* Filtres et recherche */}
      <RicashCard className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <RicashInput
                placeholder="Rechercher par nom, ID, code retrait..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <RicashSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="min-w-[150px]"
            >
              <option value="tous">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="traite">Traités</option>
              <option value="suspendu">Suspendus</option>
              <option value="annule">Annulés</option>
            </RicashSelect>
            <RicashSelect
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-')
                setSortBy(field)
                setSortOrder(order)
              }}
              className="min-w-[150px]"
            >
              <option value="dateCreation-desc">Plus récent</option>
              <option value="dateCreation-asc">Plus ancien</option>
              <option value="montant-desc">Montant décroissant</option>
              <option value="montant-asc">Montant croissant</option>
              <option value="expediteur.nom-asc">Nom A-Z</option>
              <option value="expediteur.nom-desc">Nom Z-A</option>
            </RicashSelect>
          </div>
        </div>
      </RicashCard>

      {/* Tableau des transferts */}
      <RicashTableCard>
        <RicashTable>
          <RicashTableHeader>
            <RicashTableRow>
              <RicashTableCell>ID</RicashTableCell>
              <RicashTableCell>Expéditeur</RicashTableCell>
              <RicashTableCell>Destinataire</RicashTableCell>
              <RicashTableCell>Montant</RicashTableCell>
              <RicashTableCell>Statut</RicashTableCell>
              <RicashTableCell>Date</RicashTableCell>
              <RicashTableCell>Agence</RicashTableCell>
              <RicashTableCell>Actions</RicashTableCell>
            </RicashTableRow>
          </RicashTableHeader>
          <RicashTableBody>
                {filteredTransfers.map((transfer) => (
              <RicashTableRow key={transfer.id}>
                <RicashTableCell>
                        <div>
                    <div className="font-medium text-[#29475B]">{transfer.id}</div>
                      <div className="text-sm text-[#376470]">{transfer.codeRetrait}</div>
                  </div>
                </RicashTableCell>
                <RicashTableCell>
                  <div>
                    <div className="font-medium text-[#29475B]">{transfer.expediteur.nom}</div>
                    <div className="text-sm text-[#376470]">{transfer.expediteur.telephone}</div>
                  </div>
                </RicashTableCell>
                <RicashTableCell>
                  <div>
                    <div className="font-medium text-[#29475B]">{transfer.destinataire.nom}</div>
                    <div className="text-sm text-[#376470]">{transfer.destinataire.telephone}</div>
                  </div>
                </RicashTableCell>
                <RicashTableCell>
                      <div>
                    <div className="font-medium text-[#29475B]">{formatCurrency(transfer.montant, transfer.devise)}</div>
                    <div className="text-sm text-[#376470]">+ {formatCurrency(transfer.frais, transfer.devise)} frais</div>
                      </div>
                </RicashTableCell>
                <RicashTableCell>
                  <RicashStatusBadge 
                    className={`${getStatusColor(transfer.statut)} flex items-center gap-1`}
                  >
                    {getStatusIcon(transfer.statut)}
                    {transfer.statut.replace('_', ' ')}
                  </RicashStatusBadge>
                </RicashTableCell>
                <RicashTableCell>
                  <div className="text-sm text-[#29475B]">
                    {formatDate(transfer.dateCreation)}
                  </div>
                </RicashTableCell>
                <RicashTableCell>
                  <div>
                    <div className="font-medium text-[#29475B]">{transfer.agence.nom}</div>
                    <div className="text-sm text-[#376470]">{transfer.agence.ville}</div>
                        </div>
                </RicashTableCell>
                <RicashTableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                      <RicashIconButton variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                        </RicashIconButton>
                        </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleViewDetails(transfer.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Voir détails
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(transfer.id, 'traite')}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Marquer comme traité
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(transfer.id, 'en_attente')}>
                        <Clock className="h-4 w-4 mr-2" />
                        Marquer en attente
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleSuspendTransfer(transfer.id)}
                        className="text-red-600"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Suspendre
                      </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                </RicashTableCell>
              </RicashTableRow>
            ))}
          </RicashTableBody>
        </RicashTable>
      </RicashTableCard>

      {/* Pagination ou message si aucun résultat */}
      {filteredTransfers.length === 0 && (
        <RicashCard className="p-12 text-center">
          <ArrowLeftRight className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun transfert trouvé</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Aucun transfert ne correspond à votre recherche.' : 'Aucun transfert avec ce statut.'}
          </p>
          <RicashButton onClick={handleCreateTransfer}>
            <Plus className="h-4 w-4 mr-2" />
            Créer un transfert
          </RicashButton>
        </RicashCard>
      )}
    </div>
  )
}