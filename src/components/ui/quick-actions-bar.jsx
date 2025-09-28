import React from 'react'
import { 
  Filter, 
  Download, 
  Upload, 
  RefreshCw, 
  Settings,
  MoreHorizontal 
} from 'lucide-react'
import { RicashButton } from '@/components/ui/ricash-button'
import { RicashDropdownMenu, RicashDropdownItem, RicashDropdownSeparator } from '@/components/ui/ricash-dropdown'

export default function QuickActionsBar({ 
  onFilter,
  onExport,
  onImport,
  onRefresh,
  onSettings,
  className = ""
}) {
  const handleFilter = () => {
    onFilter?.()
  }

  const handleExport = () => {
    onExport?.()
  }

  const handleImport = () => {
    onImport?.()
  }

  const handleRefresh = () => {
    onRefresh?.()
  }

  const handleSettings = () => {
    onSettings?.()
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Bouton Filtres */}
      <RicashButton
        variant="outline"
        size="sm"
        onClick={handleFilter}
        className="flex items-center gap-2"
      >
        <Filter className="h-4 w-4" />
        Filtres
      </RicashButton>

      {/* Bouton Export */}
      <RicashButton
        variant="outline"
        size="sm"
        onClick={handleExport}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Export
      </RicashButton>

      {/* Bouton Import */}
      <RicashButton
        variant="outline"
        size="sm"
        onClick={handleImport}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        Import
      </RicashButton>

      {/* Bouton Actualiser */}
      <RicashButton
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Actualiser
      </RicashButton>

      {/* Menu Actions supplémentaires */}
      <RicashDropdownMenu
        trigger={
          <RicashButton
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <MoreHorizontal className="h-4 w-4" />
            Plus
          </RicashButton>
        }
      >
        <RicashDropdownItem onClick={handleSettings}>
          <Settings className="h-4 w-4 mr-2" />
          Paramètres
        </RicashDropdownItem>
        <RicashDropdownSeparator />
        <RicashDropdownItem onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Exporter CSV
        </RicashDropdownItem>
        <RicashDropdownItem onClick={handleImport}>
          <Upload className="h-4 w-4 mr-2" />
          Importer CSV
        </RicashDropdownItem>
      </RicashDropdownMenu>
    </div>
  )
}

