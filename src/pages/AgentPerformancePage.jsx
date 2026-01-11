import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, BarChart3, Target, Award } from 'lucide-react'
import { RicashButton } from '@/components/ui/ricash-button'
import { RicashCard } from '@/components/ui/ricash-card'
import { TransactionsBarChart, RevenueLineChart } from '@/components/ui/ricash-charts'

// Mock data pour les performances d'agent
const mockAgentPerformance = {
  AGT001: {
    id: 'AGT001',
    nom: 'Sarr',
    prenom: 'Ibrahima',
    performanceData: {
      transactions: [120, 135, 150, 140, 160, 155, 170],
      chiffreAffaires: [45000, 52000, 48000, 55000, 60000, 58000, 62000],
      commissions: [1125, 1300, 1200, 1375, 1500, 1450, 1550],
      notes: [4.5, 4.6, 4.7, 4.8, 4.9, 4.8, 4.9]
    },
    objectifs: {
      transactionsMois: 200,
      chiffreAffairesMois: 50000,
      commissionMois: 1250,
      noteMinimale: 4.5
    },
    realisations: {
      transactionsMois: 170,
      chiffreAffairesMois: 62000,
      commissionMois: 1550,
      noteActuelle: 4.9
    }
  },
  AGT002: {
    id: 'AGT002',
    nom: 'Diop',
    prenom: 'Mariam',
    performanceData: {
      transactions: [100, 110, 120, 115, 125, 130, 140],
      chiffreAffaires: [38000, 42000, 40000, 45000, 48000, 50000, 52000],
      commissions: [950, 1050, 1000, 1125, 1200, 1250, 1300],
      notes: [4.2, 4.3, 4.4, 4.5, 4.6, 4.5, 4.7]
    },
    objectifs: {
      transactionsMois: 150,
      chiffreAffairesMois: 40000,
      commissionMois: 1000,
      noteMinimale: 4.0
    },
    realisations: {
      transactionsMois: 140,
      chiffreAffairesMois: 52000,
      commissionMois: 1300,
      noteActuelle: 4.7
    }
  },
  AGT003: {
    id: 'AGT003',
    nom: 'Diallo',
    prenom: 'Ousmane',
    performanceData: {
      transactions: [0, 0, 0, 0, 0, 0, 0],
      chiffreAffaires: [0, 0, 0, 0, 0, 0, 0],
      commissions: [0, 0, 0, 0, 0, 0, 0],
      notes: [0, 0, 0, 0, 0, 0, 0]
    },
    objectifs: {
      transactionsMois: 50,
      chiffreAffairesMois: 10000,
      commissionMois: 250,
      noteMinimale: 3.0
    },
    realisations: {
      transactionsMois: 0,
      chiffreAffairesMois: 0,
      commissionMois: 0,
      noteActuelle: 0
    }
  },
  AGT004: {
    id: 'AGT004',
    nom: 'Ndiaye',
    prenom: 'Fatou',
    performanceData: {
      transactions: [150, 160, 170, 165, 175, 180, 0],
      chiffreAffaires: [52000, 55000, 58000, 56000, 60000, 62000, 0],
      commissions: [1300, 1375, 1450, 1400, 1500, 1550, 0],
      notes: [4.7, 4.8, 4.9, 4.8, 4.9, 4.9, 0]
    },
    objectifs: {
      transactionsMois: 200,
      chiffreAffairesMois: 55000,
      commissionMois: 1375,
      noteMinimale: 4.5
    },
    realisations: {
      transactionsMois: 0,
      chiffreAffairesMois: 0,
      commissionMois: 0,
      noteActuelle: 4.9
    }
  },
  AGT005: {
    id: 'AGT005',
    nom: 'Ba',
    prenom: 'Mamadou',
    performanceData: {
      transactions: [80, 85, 90, 85, 0, 0, 0],
      chiffreAffaires: [30000, 32000, 35000, 32000, 0, 0, 0],
      commissions: [750, 800, 875, 800, 0, 0, 0],
      notes: [3.0, 3.1, 3.2, 3.1, 0, 0, 0]
    },
    objectifs: {
      transactionsMois: 120,
      chiffreAffairesMois: 30000,
      commissionMois: 750,
      noteMinimale: 3.5
    },
    realisations: {
      transactionsMois: 0,
      chiffreAffairesMois: 0,
      commissionMois: 0,
      noteActuelle: 3.2
    }
  }
}

const formatCurrency = (amount) => {
  if (amount === 0) return '€0'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export default function AgentPerformancePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const agent = mockAgentPerformance[id]
  
  if (!agent) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <RicashButton
            variant="outline"
            onClick={() => navigate('/app/agents')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux agents
          </RicashButton>
        </div>
        <div className="text-center py-12">
          <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Agent non trouvé</h2>
          <p className="text-gray-600">L'agent avec l'ID {id} n'existe pas.</p>
        </div>
      </div>
    )
  }

  const performanceData = agent.performanceData
  const objectifs = agent.objectifs
  const realisations = agent.realisations

  // Créer les données pour les graphiques (7 derniers mois)
  const months = ['Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc', 'Jan']
  const chartData = months.map((month, index) => ({
    month,
    transactions: performanceData.transactions[index] || 0,
    chiffreAffaires: performanceData.chiffreAffaires[index] || 0,
    commissions: performanceData.commissions[index] || 0,
    notes: performanceData.notes[index] || 0
  }))

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <RicashButton
            variant="outline"
            onClick={() => navigate('/app/agents')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </RicashButton>
          <div>
            <h1 className="text-3xl font-bold text-[#29475B]">
              Performance - {agent.prenom} {agent.nom}
            </h1>
            <p className="text-[#376470]">Agent ID: {agent.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <RicashButton variant="outline">
            Exporter
          </RicashButton>
          <RicashButton variant="accent">
            Générer rapport
          </RicashButton>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <RicashCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#376470]">Transactions ce mois</p>
              <p className="text-2xl font-bold text-[#29475B]">
                {realisations.transactionsMois}
              </p>
              <p className="text-xs text-[#376470]">
                Objectif: {objectifs.transactionsMois}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-[#2B8286]" />
          </div>
        </RicashCard>
        
        <RicashCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#376470]">Chiffre d'affaires</p>
              <p className="text-2xl font-bold text-[#29475B]">
                {formatCurrency(realisations.chiffreAffairesMois)}
              </p>
              <p className="text-xs text-[#376470]">
                Objectif: {formatCurrency(objectifs.chiffreAffairesMois)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-[#B19068]" />
          </div>
        </RicashCard>
        
        <RicashCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#376470]">Commission</p>
              <p className="text-2xl font-bold text-[#29475B]">
                {formatCurrency(realisations.commissionMois)}
              </p>
              <p className="text-xs text-[#376470]">
                Objectif: {formatCurrency(objectifs.commissionMois)}
              </p>
            </div>
            <Target className="h-8 w-8 text-[#376470]" />
          </div>
        </RicashCard>
        
        <RicashCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#376470]">Note de performance</p>
              <p className="text-2xl font-bold text-[#29475B]">
                {realisations.noteActuelle}/5
              </p>
              <p className="text-xs text-[#376470]">
                Minimum: {objectifs.noteMinimale}/5
              </p>
            </div>
            <Award className="h-8 w-8 text-[#2B8286]" />
          </div>
        </RicashCard>
      </div>

      {/* Performance Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <RicashCard className="p-6">
          <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Évolution des transactions
          </h3>
          <TransactionsBarChart data={chartData} />
        </RicashCard>

        <RicashCard className="p-6">
          <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Évolution du chiffre d'affaires
          </h3>
          <RevenueLineChart data={chartData} />
        </RicashCard>
      </div>

      {/* Detailed Performance */}
      <RicashCard className="p-6">
        <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
          <Award className="h-5 w-5" />
          Détails de performance
        </h3>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-[#2B8286]/5 rounded-lg">
              <p className="text-sm text-[#376470]">Taux de réalisation</p>
              <p className="text-2xl font-bold text-[#29475B]">
                {Math.round((realisations.transactionsMois / objectifs.transactionsMois) * 100)}%
              </p>
            </div>
            <div className="text-center p-4 bg-[#B19068]/5 rounded-lg">
              <p className="text-sm text-[#376470]">Performance CA</p>
              <p className="text-2xl font-bold text-[#29475B]">
                {Math.round((realisations.chiffreAffairesMois / objectifs.chiffreAffairesMois) * 100)}%
              </p>
            </div>
            <div className="text-center p-4 bg-[#376470]/5 rounded-lg">
              <p className="text-sm text-[#376470]">Performance Commission</p>
              <p className="text-2xl font-bold text-[#29475B]">
                {Math.round((realisations.commissionMois / objectifs.commissionMois) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </RicashCard>
    </div>
  )
}
