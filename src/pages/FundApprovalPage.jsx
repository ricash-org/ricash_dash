import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RicashCard, RicashTableCard } from '@/components/ui/ricash-card'
import { RicashTable, RicashTableHeader, RicashTableBody, RicashTableRow, RicashTableCell, RicashStatusBadge } from '@/components/ui/ricash-table'
import { RicashButton } from '@/components/ui/ricash-button'
import { CheckCircle, XCircle, DollarSign, Download } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb'

const initialRequests = [
  { id: 'REQ001', agence: 'Ricash Dakar Centre', montant: 500000, motif: 'Pic d’activité', statut: 'en_attente' },
  { id: 'REQ002', agence: 'Ricash Touba', montant: 300000, motif: 'Trésorerie', statut: 'en_attente' }
]

const formatCurrency = (amount) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(amount)

export default function FundApprovalPage() {
  const [requests, setRequests] = useState(initialRequests)
  const navigate = useNavigate()
  const { hasRole, hasPermission } = useAuth()
  const canDecide = hasRole('FUNDS_ADMIN') || hasRole('SUPER_ADMIN') || hasPermission('FUNDS_DECIDE')
  const exportCsv = () => {
    const rows = [["Réf","Agence","Montant","Motif","Statut"]]
    requests.forEach(r => rows.push([r.id, r.agence, String(r.montant), r.motif, r.statut]))
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'fund_requests.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const updateStatus = (id, statut) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, statut } : r))
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/app/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Demandes de fonds</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#29475B] flex items-center gap-2">
          <DollarSign className="h-6 w-6" /> Validation des demandes de fonds
        </h1>
        <div>
          <RicashButton variant="outline" onClick={exportCsv}>
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </RicashButton>
        </div>
      </div>

      <RicashTableCard title="Demandes en attente" description={`${requests.filter(r => r.statut === 'en_attente').length} en attente`}>
        <RicashTable>
          <RicashTableHeader>
            <RicashTableRow>
              <RicashTableCell>Réf</RicashTableCell>
              <RicashTableCell>Agence</RicashTableCell>
              <RicashTableCell>Montant</RicashTableCell>
              <RicashTableCell>Motif</RicashTableCell>
              <RicashTableCell>Statut</RicashTableCell>
              <RicashTableCell>Actions</RicashTableCell>
            </RicashTableRow>
          </RicashTableHeader>
          <RicashTableBody>
            {requests.map((r) => (
              <RicashTableRow key={r.id}>
                <RicashTableCell className="font-mono">{r.id}</RicashTableCell>
                <RicashTableCell>{r.agence}</RicashTableCell>
                <RicashTableCell>{formatCurrency(r.montant)}</RicashTableCell>
                <RicashTableCell>{r.motif}</RicashTableCell>
                <RicashTableCell>
                  <RicashStatusBadge status={r.statut === 'en_attente' ? 'warning' : r.statut === 'approuve' ? 'success' : 'suspendue'}>
                    {r.statut === 'en_attente' ? 'En attente' : r.statut === 'approuve' ? 'Approuvée' : 'Rejetée'}
                  </RicashStatusBadge>
                </RicashTableCell>
                <RicashTableCell>
                  <div className="flex gap-2">
                    <RicashButton size="sm" variant="outline" onClick={() => navigate(`/app/funds/approval/${r.id}`)}>
                      Détails
                    </RicashButton>
                    <RicashButton size="sm" variant="success" onClick={() => updateStatus(r.id, 'approuve')} disabled={!canDecide}>
                      <CheckCircle className="h-4 w-4 mr-1" /> Approuver
                    </RicashButton>
                    <RicashButton size="sm" variant="danger" onClick={() => updateStatus(r.id, 'rejete')} disabled={!canDecide}>
                      <XCircle className="h-4 w-4 mr-1" /> Rejeter
                    </RicashButton>
                  </div>
                </RicashTableCell>
              </RicashTableRow>
            ))}
          </RicashTableBody>
        </RicashTable>
      </RicashTableCard>
    </div>
  )
}


