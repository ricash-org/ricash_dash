import React, { useMemo, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { RicashTableCard } from '@/components/ui/ricash-card'
import { RicashTable, RicashTableHeader, RicashTableBody, RicashTableRow, RicashTableCell, RicashStatusBadge } from '@/components/ui/ricash-table'
import { RicashInput } from '@/components/ui/ricash-input'
import { RicashButton } from '@/components/ui/ricash-button'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb'
import { Search, Eye, Download } from 'lucide-react'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination'
import { exportToCsv } from '@/lib/csv'

const mockCases = [
  { id: 'USR001', nom: 'Diallo', prenom: 'Aminata', telephone: '+221 77 123 45 67', status: 'valide' },
  { id: 'USR002', nom: 'Ba', prenom: 'Moussa', telephone: '+221 76 987 65 43', status: 'en_cours' },
]

export default function KycHub() {
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const s = search.toLowerCase()
    return mockCases.filter(c =>
      c.id.toLowerCase().includes(s) ||
      c.nom.toLowerCase().includes(s) ||
      c.prenom.toLowerCase().includes(s) ||
      c.telephone.includes(search)
    )
  }, [search])

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  // Init from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const s = params.get('search') || ''
    const p = parseInt(params.get('page') || '1', 10)
    const ps = parseInt(params.get('pageSize') || '10', 10)
    setSearch(s)
    setPage(isNaN(p) || p < 1 ? 1 : p)
    setPageSize(isNaN(ps) || ps < 1 ? 10 : ps)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // Persist to URL
  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (page > 1) params.set('page', String(page))
    if (pageSize !== 10) params.set('pageSize', String(pageSize))
    navigate({ pathname: location.pathname, search: params.toString() }, { replace: true })
  }, [search, page, pageSize, navigate, location.pathname])
  const totalItems = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const startIndex = (page - 1) * pageSize
  const paged = filtered.slice(startIndex, startIndex + pageSize)

  const exportCsv = () => exportToCsv('kyc_cases.csv', [["ID","Nom","Prénom","Téléphone","Statut"], ...filtered.map(c => [c.id, c.nom, c.prenom, c.telephone, c.status])])

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/app/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>KYC</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#376470]/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#29475B]">Vérification KYC</h1>
            <p className="text-[#376470]">File d'attente et recherche</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-80 max-w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#376470]" />
              <RicashInput value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Recherche par nom, ID, téléphone" className="pl-9" />
            </div>
            <RicashButton variant="outline" onClick={exportCsv}>
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </RicashButton>
          </div>
        </div>
      </div>

      <RicashTableCard title="Dossiers" description={`${filtered.length} résultat(s)`}>
        <RicashTable>
          <RicashTableHeader>
            <RicashTableRow>
              <RicashTableCell>ID</RicashTableCell>
              <RicashTableCell>Nom</RicashTableCell>
              <RicashTableCell>Téléphone</RicashTableCell>
              <RicashTableCell>Statut</RicashTableCell>
              <RicashTableCell>Actions</RicashTableCell>
            </RicashTableRow>
          </RicashTableHeader>
          <RicashTableBody>
            {paged.map(c => (
              <RicashTableRow key={c.id}>
                <RicashTableCell className="font-mono">{c.id}</RicashTableCell>
                <RicashTableCell>{c.prenom} {c.nom}</RicashTableCell>
                <RicashTableCell>{c.telephone}</RicashTableCell>
                <RicashTableCell>
                  <RicashStatusBadge status={c.status === 'valide' ? 'success' : c.status === 'en_cours' ? 'warning' : 'info'}>
                    {c.status}
                  </RicashStatusBadge>
                </RicashTableCell>
                <RicashTableCell>
                  <RicashButton size="sm" variant="outline" onClick={() => navigate(`/app/users/kyc/${c.id}`)}>
                    <Eye className="h-4 w-4 mr-1" /> Voir
                  </RicashButton>
                </RicashTableCell>
              </RicashTableRow>
            ))}
          </RicashTableBody>
        </RicashTable>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-sm text-[#376470]">Page {page} / {totalPages} • {totalItems} dossiers</div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => setPage(p => Math.max(1, p - 1))} href="#" />
              </PaginationItem>
              {Array.from({ length: totalPages }).slice(0, 5).map((_, idx) => {
                const num = idx + 1
                return (
                  <PaginationItem key={num}>
                    <PaginationLink href="#" isActive={num === page} onClick={() => setPage(num)}>
                      {num}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}
              <PaginationItem>
                <PaginationNext onClick={() => setPage(p => Math.min(totalPages, p + 1))} href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </RicashTableCard>
    </div>
  )
}


