import React from 'react'
import { 
  Users, 
  ArrowLeftRight, 
  DollarSign, 
  TrendingUp,
  Activity,
  Shield,
  UserCheck,
  Building2
} from 'lucide-react'
import {
  RicashCard,
  RicashStatCard,
  RicashTableCard,
  RicashButton,
  RicashTable,
  RicashTableHeader,
  RicashTableBody,
  RicashTableRow,
  RicashTableCell,
  RicashStatusBadge,
  RicashBreadcrumb,
  RicashTabs,
  RicashFilterBar
} from '../ui/ricash-ui'

export default function RicashDashboardExample() {
  const [activeTab, setActiveTab] = React.useState('overview')
  
  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'users', label: 'Utilisateurs' },
    { id: 'reports', label: 'Rapports' }
  ]
  
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Vue d\'ensemble' }
  ]
  
  const stats = [
    {
      title: 'Utilisateurs actifs',
      value: '12,847',
      subtitle: '+12% ce mois',
      icon: Users,
      trend: 'Croissance',
      trendValue: '+12%',
      trendUp: true
    },
    {
      title: 'Transactions',
      value: '€2.4M',
      subtitle: '+8% ce mois',
      icon: ArrowLeftRight,
      trend: 'Croissance',
      trendValue: '+8%',
      trendUp: true
    },
    {
      title: 'Revenus',
      value: '€847K',
      subtitle: '+15% ce mois',
      icon: DollarSign,
      trend: 'Croissance',
      trendValue: '+15%',
      trendUp: true
    },
    {
      title: 'Taux de conversion',
      value: '73.2%',
      subtitle: '+2.1% ce mois',
      icon: TrendingUp,
      trend: 'Croissance',
      trendValue: '+2.1%',
      trendUp: true
    }
  ]
  
  const recentTransactions = [
    {
      id: 'TXN001',
      user: 'Mamadou Diallo',
      amount: '€500',
      status: 'completed',
      date: '2024-01-15',
      type: 'Transfert'
    },
    {
      id: 'TXN002',
      user: 'Fatou Sall',
      amount: '€750',
      status: 'pending',
      date: '2024-01-15',
      type: 'Transfert'
    },
    {
      id: 'TXN003',
      user: 'Ibrahima Ba',
      amount: '€300',
      status: 'completed',
      date: '2024-01-14',
      type: 'Retrait'
    },
    {
      id: 'TXN004',
      user: 'Aissatou Diop',
      amount: '€1,200',
      status: 'suspended',
      date: '2024-01-14',
      type: 'Transfert'
    }
  ]
  
  const topAgents = [
    {
      name: 'Mariam Sow',
      agence: 'Dakar Centre',
      transactions: 156,
      revenue: '€45,200',
      commission: '€2,260'
    },
    {
      name: 'Abdou Ndiaye',
      agence: 'Thiès',
      transactions: 142,
      revenue: '€38,400',
      commission: '€1,920'
    },
    {
      name: 'Khadija Ba',
      agence: 'Saint-Louis',
      transactions: 128,
      revenue: '€34,800',
      commission: '€1,740'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <RicashBreadcrumb items={breadcrumbItems} />
      
      {/* En-tête du dashboard */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#29475B]">
            Dashboard Ricash
          </h1>
          <p className="text-[#376470] mt-2">
            Vue d'ensemble de votre plateforme de transfert d'argent
          </p>
        </div>
        <div className="flex space-x-3">
          <RicashButton variant="outline">
            <Activity className="w-4 h-4 mr-2" />
            Exporter
          </RicashButton>
          <RicashButton variant="primary">
            <TrendingUp className="w-4 h-4 mr-2" />
            Nouveau rapport
          </RicashButton>
        </div>
      </div>
      
      {/* Onglets */}
      <RicashTabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <RicashStatCard key={index} {...stat} />
        ))}
      </div>
      
      {/* Contenu des onglets */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Transactions récentes */}
          <RicashTableCard 
            title="Transactions récentes"
            subtitle="Dernières transactions de la journée"
          >
            <RicashTable>
              <RicashTableHeader>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#29475B] uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#29475B] uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#29475B] uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#29475B] uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#29475B] uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#29475B] uppercase tracking-wider">
                    Type
                  </th>
                </tr>
              </RicashTableHeader>
              <RicashTableBody>
                {recentTransactions.map((transaction) => (
                  <RicashTableRow key={transaction.id}>
                    <RicashTableCell className="font-mono text-sm">
                      {transaction.id}
                    </RicashTableCell>
                    <RicashTableCell className="font-medium">
                      {transaction.user}
                    </RicashTableCell>
                    <RicashTableCell className="font-semibold text-[#2B8286]">
                      {transaction.amount}
                    </RicashTableCell>
                    <RicashTableCell>
                      <RicashStatusBadge status={transaction.status} />
                    </RicashTableCell>
                    <RicashTableCell className="text-[#376470]">
                      {transaction.date}
                    </RicashTableCell>
                    <RicashTableCell>
                      {transaction.type}
                    </RicashTableCell>
                  </RicashTableRow>
                ))}
              </RicashTableBody>
            </RicashTable>
          </RicashTableCard>
          
          {/* Top agents */}
          <RicashCard title="Top agents du mois">
            <div className="space-y-4">
              {topAgents.map((agent, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-[#F4F2EE]/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-[#2B8286] rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-[#29475B]">{agent.name}</div>
                      <div className="text-sm text-[#376470]">{agent.agence}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-[#2B8286]">{agent.revenue}</div>
                    <div className="text-sm text-[#376470]">
                      {agent.transactions} transactions • {agent.commission}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </RicashCard>
        </div>
      )}
      
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          <RicashFilterBar>
            <RicashButton variant="outline" size="sm">
              Filtres
            </RicashButton>
            <RicashButton variant="outline" size="sm">
              Date
            </RicashButton>
            <RicashButton variant="outline" size="sm">
              Statut
            </RicashButton>
          </RicashFilterBar>
          
          <RicashCard title="Toutes les transactions">
            <p className="text-[#376470]">
              Interface de gestion des transactions en cours de développement...
            </p>
          </RicashCard>
        </div>
      )}
      
      {activeTab === 'users' && (
        <div className="space-y-6">
          <RicashCard title="Gestion des utilisateurs">
            <p className="text-[#376470]">
              Interface de gestion des utilisateurs en cours de développement...
            </p>
          </RicashCard>
        </div>
      )}
      
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <RicashCard title="Rapports et analyses">
            <p className="text-[#376470]">
              Interface des rapports en cours de développement...
            </p>
          </RicashCard>
        </div>
      )}
    </div>
  )
}
