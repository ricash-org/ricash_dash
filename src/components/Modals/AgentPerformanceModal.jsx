import { useState } from 'react'
import { 
  TrendingUp,
  TrendingDown,
  Star,
  Award,
  Calendar,
  DollarSign,
  ArrowLeftRight,
  Target,
  BarChart3,
  PieChart
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts'

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

const getPerformanceColor = (note) => {
  if (note >= 4.5) return 'text-green-600'
  if (note >= 4.0) return 'text-blue-600'
  if (note >= 3.5) return 'text-yellow-600'
  return 'text-red-600'
}

const getPerformanceBadge = (note) => {
  if (note >= 4.5) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
  if (note >= 4.0) return <Badge className="bg-blue-100 text-blue-800">Très bien</Badge>
  if (note >= 3.5) return <Badge className="bg-yellow-100 text-yellow-800">Bien</Badge>
  if (note >= 3.0) return <Badge className="bg-orange-100 text-orange-800">Moyen</Badge>
  return <Badge className="bg-red-100 text-red-800">À améliorer</Badge>
}

// Mock performance data
const generatePerformanceData = (agent) => {
  const monthlyData = [
    { mois: 'Jan', transactions: 620, ca: 380000, commission: 9500, performance: 4.2 },
    { mois: 'Fév', transactions: 580, ca: 420000, commission: 10500, performance: 4.4 },
    { mois: 'Mar', transactions: 720, ca: 450000, commission: 11250, performance: 4.6 },
    { mois: 'Avr', transactions: 680, ca: 410000, commission: 10250, performance: 4.3 },
    { mois: 'Mai', transactions: 750, ca: 480000, commission: 12000, performance: 4.7 },
    { mois: 'Juin', transactions: agent.transactionsMois, ca: agent.chiffreAffaires, commission: agent.commission, performance: agent.notePerformance }
  ]

  const weeklyData = [
    { semaine: 'S1', transactions: 45, ca: 85000 },
    { semaine: 'S2', transactions: 52, ca: 95000 },
    { semaine: 'S3', transactions: 48, ca: 88000 },
    { semaine: 'S4', transactions: 55, ca: 102000 }
  ]

  const performanceByCategory = [
    { name: 'Rapidité', value: 4.5, color: '#8884d8' },
    { name: 'Précision', value: 4.7, color: '#82ca9d' },
    { name: 'Service client', value: 4.3, color: '#ffc658' },
    { name: 'Conformité', value: 4.8, color: '#ff7300' },
    { name: 'Ponctualité', value: 4.6, color: '#00ff7f' }
  ]

  const objectifs = {
    transactionsMois: 800,
    caMois: 500000,
    commissionMois: 12500,
    notePerformance: 4.5
  }

  return { monthlyData, weeklyData, performanceByCategory, objectifs }
}

export default function AgentPerformanceModal({ isOpen, onClose, agent }) {
  const [activeTab, setActiveTab] = useState('overview')

  if (!agent) return null

  const { monthlyData, weeklyData, performanceByCategory, objectifs } = generatePerformanceData(agent)

  const performancePercentage = (agent.notePerformance / 5) * 100
  const transactionsProgress = Math.min((agent.transactionsMois / objectifs.transactionsMois) * 100, 100)
  const caProgress = Math.min((agent.chiffreAffaires / objectifs.caMois) * 100, 100)
  const commissionProgress = Math.min((agent.commission / objectifs.commissionMois) * 100, 100)

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff7f']

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance - {agent.prenom} {agent.nom}
          </DialogTitle>
          <DialogDescription>
            Analyse détaillée des performances et objectifs de l'agent
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="evolution">Évolution</TabsTrigger>
            <TabsTrigger value="objectifs">Objectifs</TabsTrigger>
            <TabsTrigger value="competences">Compétences</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Performance Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Note globale</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getPerformanceColor(agent.notePerformance)}`}>
                    {agent.notePerformance}/5
                  </div>
                  <div className="mt-1">
                    {getPerformanceBadge(agent.notePerformance)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Transactions/mois</CardTitle>
                  <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{agent.transactionsMois}</div>
                  <div className="text-sm text-muted-foreground">
                    {agent.transactionsJour}/jour
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CA mensuel</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{formatCurrency(agent.chiffreAffaires)}</div>
                  <div className="text-sm text-muted-foreground">
                    Commission: {formatCurrency(agent.commission)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Certifications</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{agent.certifications.length}</div>
                  <div className="text-sm text-muted-foreground">
                    Niveau {agent.niveau}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Performance hebdomadaire</CardTitle>
                <CardDescription>Transactions et chiffre d'affaires par semaine</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="semaine" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'ca' ? formatCurrency(value) : value,
                        name === 'transactions' ? 'Transactions' : 'CA'
                      ]}
                    />
                    <Bar yAxisId="left" dataKey="transactions" fill="#8884d8" name="transactions" />
                    <Bar yAxisId="right" dataKey="ca" fill="#82ca9d" name="ca" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evolution" className="space-y-6">
            {/* Monthly Evolution */}
            <Card>
              <CardHeader>
                <CardTitle>Évolution sur 6 mois</CardTitle>
                <CardDescription>Tendances des performances mensuelles</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'ca') return [formatCurrency(value), 'CA']
                        if (name === 'commission') return [formatCurrency(value), 'Commission']
                        if (name === 'performance') return [value, 'Performance']
                        return [value, 'Transactions']
                      }}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="transactions" stroke="#8884d8" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="performance" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance Trends */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Tendance Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-lg font-bold text-green-600">+12%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">vs mois précédent</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Tendance CA</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-lg font-bold text-green-600">+8%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">vs mois précédent</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Tendance Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-lg font-bold text-green-600">+0.2</span>
                  </div>
                  <p className="text-sm text-muted-foreground">vs mois précédent</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="objectifs" className="space-y-6">
            {/* Objectives Progress */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Transactions mensuelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{agent.transactionsMois} / {objectifs.transactionsMois}</span>
                    <span>{transactionsProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={transactionsProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {transactionsProgress >= 100 ? 'Objectif atteint !' : `Reste ${objectifs.transactionsMois - agent.transactionsMois} transactions`}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Chiffre d'affaires</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{formatCurrency(agent.chiffreAffaires)}</span>
                    <span>{caProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={caProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Objectif: {formatCurrency(objectifs.caMois)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Commission</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{formatCurrency(agent.commission)}</span>
                    <span>{commissionProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={commissionProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Objectif: {formatCurrency(objectifs.commissionMois)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Note de performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{agent.notePerformance} / 5</span>
                    <span>{performancePercentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={performancePercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Objectif: {objectifs.notePerformance}/5
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Objectives Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Résumé des objectifs</CardTitle>
                <CardDescription>État d'avancement des objectifs mensuels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">Objectifs atteints</span>
                    <span className="text-lg font-bold text-green-600">
                      {[transactionsProgress, caProgress, commissionProgress, performancePercentage].filter(p => p >= 100).length}/4
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    L'agent a atteint {[transactionsProgress, caProgress, commissionProgress, performancePercentage].filter(p => p >= 100).length} objectifs sur 4 ce mois.
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competences" className="space-y-6">
            {/* Skills Radar */}
            <Card>
              <CardHeader>
                <CardTitle>Évaluation par compétences</CardTitle>
                <CardDescription>Notes détaillées par domaine de compétence</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={performanceByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {performanceByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}/5`, 'Note']} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Skills Details */}
            <Card>
              <CardHeader>
                <CardTitle>Détail des compétences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceByCategory.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{skill.name}</span>
                        <span className={getPerformanceColor(skill.value)}>{skill.value}/5</span>
                      </div>
                      <Progress value={(skill.value / 5) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle>Certifications obtenues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {agent.certifications.map((certification, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <Award className="mr-1 h-3 w-3" />
                      {certification}
                    </Badge>
                  ))}
                </div>
                
                {agent.certifications.length === 0 && (
                  <p className="text-muted-foreground text-sm">Aucune certification enregistrée</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
