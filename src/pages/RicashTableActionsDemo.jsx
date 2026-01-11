import React, { useState } from 'react'
import { 
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
} from '@/components/ui/ricash-table'

import {
  RicashTableActionsDropdown,
  RicashTableBulkActions,
  RicashTableSearch,
  RicashTableFilters
} from '@/components/ui/ricash-dropdown'
import { RicashCard, RicashTableCard } from '@/components/ui/ricash-card'
import { RicashButton } from '@/components/ui/ricash-button'
import { Eye, Edit, Trash2, Download, Mail, Phone, Building2, Star } from 'lucide-react'

// Mock data pour la démonstration
const mockData = [
  {
    id: 1,
    nom: 'Ousmane Diallo',
    email: 'ousmane.diallo@ricash.com',
    telephone: '+221 76 123 45 67',
    agence: 'Agence Dakar Centre',
    statut: 'success',
    performance: 4.8,
    chiffreAffaires: 450000
  },
  {
    id: 2,
    nom: 'Fatou Ndiaye',
    email: 'fatou.ndiaye@ricash.com',
    telephone: '+221 77 987 65 43',
    agence: 'Agence Thiès',
    statut: 'warning',
    performance: 3.2,
    chiffreAffaires: 180000
  },
  {
    id: 3,
    nom: 'Mamadou Ba',
    email: 'mamadou.ba@ricash.com',
    telephone: '+221 78 456 78 90',
    agence: 'Agence Saint-Louis',
    statut: 'success',
    performance: 4.9,
    chiffreAffaires: 520000
  },
  {
    id: 4,
    nom: 'Khadija Fall',
    email: 'khadija.fall@ricash.com',
    telephone: '+221 79 123 45 67',
    agence: 'Agence Kaolack',
    statut: 'info',
    performance: 4.1,
    chiffreAffaires: 320000
  },
  {
    id: 5,
    nom: 'Modou Thiam',
    email: 'modou.thiam@ricash.com',
    telephone: '+221 70 987 65 43',
    agence: 'Agence Ziguinchor',
    statut: 'error',
    performance: 2.8,
    chiffreAffaires: 150000
  }
]

const getStatusText = (status) => {
  switch (status) {
    case 'success': return 'Actif'
    case 'warning': return 'En formation'
    case 'info': return 'En attente'
    case 'error': return 'Suspendu'
    default: return status
  }
}

export default function RicashTableActionsDemo() {
  const [selectedItems, setSelectedItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(3)

  // Gestion de la sélection
  const handleSelectAll = () => {
    if (selectedItems.length === mockData.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(mockData.map(item => item.id))
    }
  }

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const handleClearSelection = () => {
    setSelectedItems([])
  }

  // Actions de base
  const handleView = (id) => {
    console.log('Voir l\'élément:', id)
    alert(`Voir les détails de l'élément ${id}`)
  }

  const handleEdit = (id) => {
    console.log('Modifier l\'élément:', id)
    alert(`Modifier l'élément ${id}`)
  }

  const handleDelete = (id) => {
    console.log('Supprimer l\'élément:', id)
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'élément ${id} ?`)) {
      alert(`Élément ${id} supprimé`)
    }
  }

  const handleDownload = (id) => {
    console.log('Télécharger l\'élément:', id)
    alert(`Téléchargement de l'élément ${id}`)
  }

  const handleEmail = (id) => {
    console.log('Envoyer un email à l\'élément:', id)
    alert(`Email envoyé à l'élément ${id}`)
  }

  // Actions en lot
  const handleBulkDelete = () => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedItems.length} élément(s) ?`)) {
      alert(`${selectedItems.length} élément(s) supprimé(s)`)
      setSelectedItems([])
    }
  }

  const handleBulkExport = () => {
    alert(`Export de ${selectedItems.length} élément(s)`)
  }

  // Filtrage et recherche
  const filteredData = mockData.filter(item => {
    const matchesSearch = item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.statut === statusFilter
    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredData.slice(startIndex, endIndex)

  return (
    <div className="p-6 bg-[#F4F2EE] min-h-screen space-y-6">
      <h1 className="text-3xl font-bold text-[#29475B]">
        🎯 Démonstration des Actions de Tableau Ricash
      </h1>
      
      <p className="text-[#376470] text-lg">
        Testez toutes les fonctionnalités d'action des tableaux Ricash : sélection, actions individuelles, actions en lot, recherche, filtres et pagination.
      </p>

      {/* Recherche et filtres */}
      <RicashCard className="p-6">
        <h2 className="text-xl font-bold text-[#29475B] mb-4">🔍 Recherche et Filtres</h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          <RicashTableSearch
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom ou email..."
          />
          
          <RicashTableFilters
            filters={[
              {
                key: 'status',
                label: 'Statut',
                value: statusFilter,
                options: [
                  { value: 'all', label: 'Tous les statuts' },
                  { value: 'success', label: 'Actif' },
                  { value: 'warning', label: 'En formation' },
                  { value: 'info', label: 'En attente' },
                  { value: 'error', label: 'Suspendu' }
                ]
              }
            ]}
            onFilterChange={(key, value) => {
              if (key === 'status') setStatusFilter(value)
              setCurrentPage(1)
            }}
          />
        </div>
      </RicashCard>

      {/* Actions en lot */}
      <RicashTableBulkActions
        selectedItems={selectedItems}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
        actions={[
          {
            label: 'Supprimer en lot',
            icon: '🗑️',
            onClick: handleBulkDelete,
            variant: 'danger'
          },
          {
            label: 'Exporter en lot',
            icon: '📥',
            onClick: handleBulkExport,
            variant: 'default'
          }
        ]}
      />

      {/* Tableau principal */}
      <RicashTableCard
        title="Gestion des Agents Ricash"
        description={`${filteredData.length} agent(s) trouvé(s)`}
        className="overflow-hidden"
      >
        <RicashTable>
          <RicashTableHeader>
            <RicashTableRow>
              <RicashTableCell className="w-12">
                <input
                  type="checkbox"
                  checked={selectedItems.length === mockData.length}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-[#376470]/20 text-[#2B8286] focus:ring-[#2B8286] focus:ring-offset-2"
                />
              </RicashTableCell>
              <RicashTableCell className="font-semibold text-[#29475B]">Agent</RicashTableCell>
              <RicashTableCell className="font-semibold text-[#29475B]">Contact</RicashTableCell>
              <RicashTableCell className="font-semibold text-[#29475B]">Agence</RicashTableCell>
              <RicashTableCell className="font-semibold text-[#29475B]">Statut</RicashTableCell>
              <RicashTableCell className="font-semibold text-[#29475B]">Performance</RicashTableCell>
              <RicashTableCell className="font-semibold text-[#29475B]">Actions</RicashTableCell>
            </RicashTableRow>
          </RicashTableHeader>
          
          <RicashTableBody>
            {currentData.map((item) => (
              <RicashTableRow key={item.id} className="hover:bg-[#376470]/5 transition-colors">
                <RicashTableCell>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="h-4 w-4 rounded border-[#376470]/20 text-[#2B8286] focus:ring-[#2B8286] focus:ring-offset-2"
                  />
                </RicashTableCell>
                
                <RicashTableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#2B8286]/20 flex items-center justify-center">
                      <Star className="h-5 w-5 text-[#2B8286]" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#29475B]">{item.nom}</div>
                      <div className="text-sm text-[#376470]">ID: {item.id}</div>
                    </div>
                  </div>
                </RicashTableCell>

                <RicashTableCell>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-3 w-3 text-[#376470]" />
                      <span className="text-[#29475B]">{item.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-3 w-3 text-[#376470]" />
                      <span className="text-[#29475B]">{item.telephone}</span>
                    </div>
                  </div>
                </RicashTableCell>

                <RicashTableCell>
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-[#376470]" />
                    <span className="text-[#29475B]">{item.agence}</span>
                  </div>
                </RicashTableCell>

                <RicashTableCell>
                  <RicashStatusBadge
                    status={item.statut}
                    text={getStatusText(item.statut)}
                  />
                </RicashTableCell>

                <RicashTableCell>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#376470]">Note:</span>
                      <span className="font-bold text-[#2B8286]">
                        {item.performance}/5
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#376470]">CA:</span>
                      <span className="font-medium text-[#29475B]">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR',
                          minimumFractionDigits: 0
                        }).format(item.chiffreAffaires)}
                      </span>
                    </div>
                  </div>
                </RicashTableCell>

                <RicashTableCell>
                  <div className="flex items-center space-x-2">
                    {/* Actions individuelles avec boutons Ricash */}
                    <RicashTableAction
                      onClick={() => handleView(item.id)}
                      variant="ghost"
                      size="sm"
                      title="Voir"
                    >
                      <Eye className="h-4 w-4" />
                    </RicashTableAction>

                    <RicashTableAction
                      onClick={() => handleEdit(item.id)}
                      variant="ghost"
                      size="sm"
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </RicashTableAction>

                    <RicashTableAction
                      onClick={() => handleDownload(item.id)}
                      variant="ghost"
                      size="sm"
                      title="Télécharger"
                    >
                      <Download className="h-4 w-4" />
                    </RicashTableAction>

                    <RicashTableAction
                      onClick={() => handleEmail(item.id)}
                      variant="ghost"
                      size="sm"
                      title="Envoyer un email"
                    >
                      <Mail className="h-4 w-4" />
                    </RicashTableAction>

                    {/* Menu déroulant d'actions */}
                    <RicashTableActionsDropdown
                      actions={[
                        {
                          label: "Voir les détails",
                          icon: "👁️",
                          onClick: () => handleView(item.id),
                          variant: "default"
                        },
                        {
                          label: "Modifier",
                          icon: "✏️",
                          onClick: () => handleEdit(item.id),
                          variant: "default"
                        },
                        {
                          label: "Télécharger",
                          icon: "📥",
                          onClick: () => handleDownload(item.id),
                          variant: "default"
                        },
                        {
                          label: "Envoyer un email",
                          icon: "📧",
                          onClick: () => handleEmail(item.id),
                          variant: "default"
                        },
                        {
                          label: "Supprimer",
                          icon: "🗑️",
                          onClick: () => handleDelete(item.id),
                          variant: "danger"
                        }
                      ]}
                    />
                  </div>
                </RicashTableCell>
              </RicashTableRow>
            ))}
          </RicashTableBody>
        </RicashTable>

        {/* Pagination intégrée */}
        <RicashTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
        />
      </RicashTableCard>

      {/* Résumé des actions */}
      <RicashCard className="p-6">
        <h2 className="text-xl font-bold text-[#29475B] mb-4">📊 Résumé des Actions</h2>
        
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center p-4 bg-[#2B8286]/10 rounded-lg">
            <div className="text-2xl font-bold text-[#2B8286]">{filteredData.length}</div>
            <div className="text-sm text-[#376470]">Agents trouvés</div>
          </div>
          
          <div className="text-center p-4 bg-[#B19068]/10 rounded-lg">
            <div className="text-2xl font-bold text-[#B19068]">{selectedItems.length}</div>
            <div className="text-sm text-[#376470]">Éléments sélectionnés</div>
          </div>
          
          <div className="text-center p-4 bg-[#376470]/10 rounded-lg">
            <div className="text-2xl font-bold text-[#376470]">{currentPage}</div>
            <div className="text-sm text-[#376470]">Page actuelle</div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-[#F4F2EE] rounded-lg">
          <h3 className="font-semibold text-[#29475B] mb-2">✅ Fonctionnalités Testées :</h3>
          <ul className="text-sm text-[#376470] space-y-1">
            <li>• Sélection individuelle et en lot</li>
            <li>• Actions individuelles (Voir, Modifier, Télécharger, Email)</li>
            <li>• Menu déroulant d'actions avancées</li>
            <li>• Actions en lot (Supprimer, Exporter)</li>
            <li>• Recherche en temps réel</li>
            <li>• Filtrage par statut</li>
            <li>• Pagination avec navigation</li>
            <li>• Badges de statut Ricash</li>
            <li>• Hover states et transitions</li>
          </ul>
        </div>
      </RicashCard>
    </div>
  )
}
