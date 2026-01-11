import React, { useState } from 'react'
import { 
  User,
  Phone,
  Mail,
  Building2,
  Calendar,
  MapPin,
  Award,
  TrendingUp,
  Clock,
  DollarSign,
  Shield,
  FileText,
  Star,
  Edit,
  MoreVertical
} from 'lucide-react'
import { BaseModal } from '@/components/ui/base-modal'
import { useModal } from '@/hooks/useModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const getStatusBadge = (statut) => {
  switch (statut) {
    case 'actif':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Actif</Badge>
    case 'inactif':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inactif</Badge>
    case 'conge':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En congé</Badge>
    case 'formation':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Formation</Badge>
    case 'suspendu':
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Suspendu</Badge>
    default:
      return <Badge variant="secondary">Inconnu</Badge>
  }
}

const getNiveauBadge = (niveau) => {
  switch (niveau) {
    case 'Expert':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Expert</Badge>
    case 'Senior':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Senior</Badge>
    case 'Intermédiaire':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Intermédiaire</Badge>
    case 'Junior':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Junior</Badge>
    case 'Débutant':
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Débutant</Badge>
    default:
      return <Badge variant="secondary">N/A</Badge>
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getPerformanceColor = (note) => {
  if (note >= 4.5) return 'text-green-600'
  if (note >= 4.0) return 'text-blue-600'
  if (note >= 3.5) return 'text-yellow-600'
  return 'text-red-600'
}

const calculateAge = (birthDate) => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

const calculateExperience = (startDate) => {
  const today = new Date()
  const start = new Date(startDate)
  const diffTime = Math.abs(today - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const months = Math.floor(diffDays / 30)
  
  if (months < 12) {
    return `${months} mois`
  } else {
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    return remainingMonths > 0 ? `${years} an${years > 1 ? 's' : ''} ${remainingMonths} mois` : `${years} an${years > 1 ? 's' : ''}`
  }
}

export default function AgentDetailsModal({ isOpen, onClose, agent, onEdit, onDelete }) {
  const [activeTab, setActiveTab] = useState('overview')
  const { loading, withLoading } = useModal(false)

  if (!agent) return null

  const performancePercentage = (agent.notePerformance / 5) * 100

  const handleEdit = () => {
    onEdit?.(agent)
    onClose()
  }

  const handleDelete = async () => {
    await withLoading(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      onDelete?.(agent.id)
      onClose()
    })
  }

  const actions = (
    <>
      <Button variant="outline" onClick={onClose}>
        Fermer
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreVertical className="h-4 w-4" />
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleDelete}
            className="text-red-600 dark:text-red-400"
          >
            <FileText className="mr-2 h-4 w-4" />
            Désactiver
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {agent.prenom} {agent.nom}
        </div>
      }
      description={`Informations détaillées de l'agent ${agent.id}`}
      size="xl"
      loading={loading}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Status and Level */}
        <div className="flex flex-wrap gap-2">
          {getStatusBadge(agent.statut)}
          {getNiveauBadge(agent.niveau)}
        </div>

        {/* Tabs for better organization */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="personal">Personnel</TabsTrigger>
            <TabsTrigger value="professional">Professionnel</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Quick Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{agent.agence.nom}</p>
                      <p className="text-xs text-muted-foreground">{agent.agence.ville}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{agent.poste}</p>
                      <p className="text-xs text-muted-foreground">{agent.niveau}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{agent.notePerformance}/5</p>
                      <p className="text-xs text-muted-foreground">Performance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{formatCurrency(agent.chiffreAffaires)}</p>
                      <p className="text-xs text-muted-foreground">CA mensuel</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="personal" className="space-y-4">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Nom complet:</span>
                    <span>{agent.prenom} {agent.nom}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Date de naissance:</span>
                    <span>{formatDate(agent.dateNaissance)} ({calculateAge(agent.dateNaissance)} ans)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">CNI:</span>
                    <span className="font-mono">{agent.cni}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Adresse:</span>
                    <span>{agent.adresse}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Téléphone:</span>
                    <span>{agent.telephone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Email:</span>
                    <span>{agent.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Contact d'urgence:</span>
                    <div>
                      <div>{agent.emergencyContact.nom}</div>
                      <div className="text-sm text-muted-foreground">{agent.emergencyContact.telephone}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="professional" className="space-y-4">
            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Informations professionnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Poste:</span>
                    <span>{agent.poste}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Niveau:</span>
                    <span>{agent.niveau}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Date d'embauche:</span>
                    <span>{formatDate(agent.dateEmbauche)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Expérience:</span>
                    <span>{calculateExperience(agent.dateEmbauche)}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Agence:</span>
                    <div>
                      <div>{agent.agence.nom}</div>
                      <div className="text-sm text-muted-foreground">{agent.agence.ville}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Salaire:</span>
                    <span>{formatCurrency(agent.salaire)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Dernier login:</span>
                    <span>{formatDateTime(agent.dernierLogin)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Certifications et formations
                </CardTitle>
                <CardDescription>
                  Certifications obtenues par l'agent
                </CardDescription>
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

          <TabsContent value="performance" className="space-y-4">
            {/* Performance and Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Performance et statistiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Note de performance</span>
                        <span className={`font-bold ${getPerformanceColor(agent.notePerformance)}`}>
                          {agent.notePerformance}/5
                        </span>
                      </div>
                      <Progress value={performancePercentage} className="h-2" />
                    </div>
                    
                    <div className="grid gap-3 text-sm">
                      <div className="flex justify-between">
                        <span>Transactions du jour:</span>
                        <span className="font-medium">{agent.transactionsJour}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transactions du mois:</span>
                        <span className="font-medium">{agent.transactionsMois}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(agent.chiffreAffaires)}
                      </div>
                      <div className="text-sm text-muted-foreground">Chiffre d'affaires mensuel</div>
                    </div>
                    
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(agent.commission)}
                      </div>
                      <div className="text-sm text-muted-foreground">Commission mensuelle</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Métriques de performance</CardTitle>
                <CardDescription>
                  Indicateurs clés de performance de l'agent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-lg font-semibold">{agent.transactionsJour}</div>
                    <div className="text-xs text-muted-foreground">Transactions/jour</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-lg font-semibold">
                      {agent.transactionsMois > 0 ? Math.round(agent.chiffreAffaires / agent.transactionsMois) : 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Moyenne/transaction (XOF)</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-lg font-semibold">
                      {((agent.commission / agent.chiffreAffaires) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Taux de commission</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-lg font-semibold">{agent.certifications.length}</div>
                    <div className="text-xs text-muted-foreground">Certifications</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </BaseModal>
  )
}
