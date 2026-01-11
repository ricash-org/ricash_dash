import React, { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { RicashCard } from '@/components/ui/ricash-card'
import { RicashButton } from '@/components/ui/ricash-button'
import { RicashTextarea } from '@/components/ui/ricash-textarea'
import { RicashStatusBadge } from '@/components/ui/ricash-table'
import { ArrowLeft, DollarSign, CheckCircle, XCircle, Building2, User } from 'lucide-react'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb'

const mockRequests = {
  REQ001: {
    id: 'REQ001',
    agence: { id: 'AGE001', nom: 'Ricash Dakar Centre', ville: 'Dakar' },
    agent: { id: 'AGT001', nom: 'Sarr Ibrahima', telephone: '+221 77 123 45 67' },
    montant: 500000,
    motif: 'Pic d’activité',
    statut: 'en_attente',
    soldeActuel: 1200000,
    historique: [
      { date: '2025-11-01T10:00:00Z', action: 'Création de la demande' }
    ]
  },
  REQ002: {
    id: 'REQ002',
    agence: { id: 'AGE002', nom: 'Ricash Touba', ville: 'Touba' },
    agent: { id: 'AGT005', nom: 'Ba Mamadou', telephone: '+221 76 321 54 67' },
    montant: 300000,
    motif: 'Trésorerie',
    statut: 'en_attente',
    soldeActuel: 800000,
    historique: [
      { date: '2025-11-02T09:30:00Z', action: 'Création de la demande' }
    ]
  }
}

const formatCurrency = (amount) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(amount)

export default function FundRequestDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [rejectReason, setRejectReason] = useState('')
  const request = useMemo(() => mockRequests[id], [id])

  if (!request) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <RicashButton variant="outline" onClick={() => navigate('/app/funds/approval')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour aux demandes
          </RicashButton>
        </div>
        <RicashCard className="p-6">
          <p className="text-[#29475B]">Demande introuvable.</p>
        </RicashCard>
      </div>
    )
  }

  const approve = () => {
    // Appel API réel à implémenter ici
    navigate('/app/funds/approval')
  }

  const reject = () => {
    // Appel API réel à implémenter ici avec { reason: rejectReason }
    navigate('/app/funds/approval')
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
            <BreadcrumbLink href="/app/funds/approval">Demandes de fonds</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Détail {request.id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RicashButton variant="outline" onClick={() => navigate('/app/funds/approval')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour
          </RicashButton>
          <h1 className="text-3xl font-bold text-[#29475B] flex items-center gap-2">
            <DollarSign className="h-6 w-6" /> Demande {request.id}
          </h1>
        </div>
        <RicashStatusBadge status={request.statut === 'en_attente' ? 'warning' : request.statut === 'approuve' ? 'success' : 'suspendue'}>
          {request.statut === 'en_attente' ? 'En attente' : request.statut === 'approuve' ? 'Approuvée' : 'Rejetée'}
        </RicashStatusBadge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <RicashCard className="p-6 space-y-3">
          <h3 className="text-lg font-semibold text-[#29475B]">Informations</h3>
          <div className="flex items-center justify-between">
            <span className="text-[#376470]">Montant</span>
            <span className="font-bold text-[#29475B]">{formatCurrency(request.montant)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#376470]">Solde actuel</span>
            <span className="font-medium text-[#29475B]">{formatCurrency(request.soldeActuel)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#376470]">Motif</span>
            <span className="text-[#29475B]">{request.motif}</span>
          </div>
        </RicashCard>

        <RicashCard className="p-6 space-y-3">
          <h3 className="text-lg font-semibold text-[#29475B] flex items-center gap-2"><Building2 className="h-5 w-5" /> Agence</h3>
          <div className="text-[#29475B] font-medium">{request.agence.nom}</div>
          <div className="text-sm text-[#376470]">{request.agence.ville}</div>
          <div className="text-xs text-[#376470]/70">ID: {request.agence.id}</div>
        </RicashCard>

        <RicashCard className="p-6 space-y-3">
          <h3 className="text-lg font-semibold text-[#29475B] flex items-center gap-2"><User className="h-5 w-5" /> Agent</h3>
          <div className="text-[#29475B] font-medium">{request.agent.nom}</div>
          <div className="text-sm text-[#376470]">{request.agent.telephone}</div>
          <div className="text-xs text-[#376470]/70">ID: {request.agent.id}</div>
        </RicashCard>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <RicashCard className="p-6 space-y-4 md:col-span-2">
          <h3 className="text-lg font-semibold text-[#29475B]">Historique</h3>
          <div className="space-y-3">
            {request.historique.map((h, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-[#29475B]">{h.action}</span>
                <span className="text-sm text-[#376470]">{new Date(h.date).toLocaleString('fr-FR')}</span>
              </div>
            ))}
          </div>
        </RicashCard>
        <RicashCard className="p-6 space-y-3">
          <h3 className="text-lg font-semibold text-[#29475B]">Traitement</h3>
          <div className="flex gap-2">
            <RicashButton variant="success" onClick={approve}>
              <CheckCircle className="h-4 w-4 mr-1" /> Accepter
            </RicashButton>
            <RicashButton variant="danger" onClick={reject} disabled={!rejectReason.trim()}>
              <XCircle className="h-4 w-4 mr-1" /> Rejeter
            </RicashButton>
          </div>
          <RicashTextarea rows={3} placeholder="Motif du rejet (obligatoire pour rejeter)" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
        </RicashCard>
      </div>
    </div>
  )
}


