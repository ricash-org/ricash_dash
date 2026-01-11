import { useState } from 'react'
import { 
  Users,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Phone,
  Mail,
  User,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Mock data for agents
const mockAgents = [
  {
    id: 'AGT001',
    nom: 'Ibrahima Sarr',
    telephone: '+221 77 123 45 67',
    email: 'ibrahima.sarr@ricash.com',
    statut: 'actif',
    dateEmbauche: '2023-01-15',
    poste: 'Agent principal',
    chiffreAffaires: 150000,
    transactionsJour: 25
  },
  {
    id: 'AGT002',
    nom: 'Mariam Diop',
    telephone: '+221 76 987 65 43',
    email: 'mariam.diop@ricash.com',
    statut: 'actif',
    dateEmbauche: '2023-02-20',
    poste: 'Agent caissier',
    chiffreAffaires: 120000,
    transactionsJour: 18
  },
  {
    id: 'AGT003',
    nom: 'Abdou Ndiaye',
    telephone: '+221 78 456 12 34',
    email: 'abdou.ndiaye@ricash.com',
    statut: 'conge',
    dateEmbauche: '2023-03-10',
    poste: 'Agent caissier',
    chiffreAffaires: 95000,
    transactionsJour: 0
  },
  {
    id: 'AGT004',
    nom: 'Fatou Ba',
    telephone: '+221 77 654 32 10',
    email: 'fatou.ba@ricash.com',
    statut: 'actif',
    dateEmbauche: '2023-04-05',
    poste: 'Agent KYC',
    chiffreAffaires: 80000,
    transactionsJour: 12
  }
]

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
    default:
      return <Badge variant="secondary">Inconnu</Badge>
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
    month: 'short',
    day: 'numeric'
  })
}

export default function ManageAgentsModal({ isOpen, onClose, agency }) {
  const [agents, setAgents] = useState(mockAgents)
  const [searchTerm, setSearchTerm] = useState('')

  if (!agency) return null

  const filteredAgents = agents.filter(agent =>
    agent.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: agents.length,
    actifs: agents.filter(a => a.statut === 'actif').length,
    inactifs: agents.filter(a => a.statut === 'inactif').length,
    enConge: agents.filter(a => a.statut === 'conge').length,
    chiffreAffairesTotal: agents.reduce((sum, a) => sum + a.chiffreAffaires, 0),
    transactionsTotal: agents.reduce((sum, a) => sum + a.transactionsJour, 0)
  }

  const handleAddAgent = () => {
    // In a real app, this would open a modal to add a new agent
    console.log('Add new agent')
  }

  const handleEditAgent = (agent) => {
    // In a real app, this would open a modal to edit agent details
    console.log('Edit agent:', agent)
  }

  const handleToggleAgentStatus = (agentId) => {
    setAgents(prev => prev.map(agent =>
      agent.id === agentId
        ? { ...agent, statut: agent.statut === 'actif' ? 'inactif' : 'actif' }
        : agent
    ))
  }

  const handleDeleteAgent = (agentId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet agent ?')) {
      setAgents(prev => prev.filter(agent => agent.id !== agentId))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestion des agents - {agency.nom}
          </DialogTitle>
          <DialogDescription>
            Gérez les agents de l'agence {agency.code}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total agents</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Actifs</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.actifs}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En congé</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.enConge}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inactifs</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.inactifs}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CA Équipe</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{formatCurrency(stats.chiffreAffairesTotal)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transactions/jour</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.transactionsTotal}</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Add */}
          <div className="flex justify-between items-center">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un agent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleAddAgent}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un agent
            </Button>
          </div>

          {/* Agents Table */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des agents</CardTitle>
              <CardDescription>
                Agents affectés à l'agence {agency.nom}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent</TableHead>
                      <TableHead>Poste</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date embauche</TableHead>
                      <TableHead>CA Mensuel</TableHead>
                      <TableHead>Trans./jour</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAgents.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{agent.nom}</div>
                            <div className="text-sm text-muted-foreground">{agent.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{agent.poste}</div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Phone className="mr-1 h-3 w-3" />
                              {agent.telephone}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Mail className="mr-1 h-3 w-3" />
                              {agent.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(agent.statut)}</TableCell>
                        <TableCell>{formatDate(agent.dateEmbauche)}</TableCell>
                        <TableCell>
                          <div className="font-medium">{formatCurrency(agent.chiffreAffaires)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center font-medium">{agent.transactionsJour}</div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEditAgent(agent)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleToggleAgentStatus(agent.id)}
                                className={agent.statut === 'actif' ? 'text-red-600' : 'text-green-600'}
                              >
                                {agent.statut === 'actif' ? (
                                  <>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Désactiver
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Activer
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteAgent(agent.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredAgents.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Aucun agent trouvé.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
