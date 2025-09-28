import { 
  Building2,
  MapPin,
  Phone,
  Mail,
  User,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Navigation,
  Badge as BadgeIcon
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
import { Separator } from '@/components/ui/separator'

const getStatusBadge = (statut) => {
  switch (statut) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
    case 'maintenance':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Maintenance</Badge>
    case 'suspendue':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Suspendue</Badge>
    case 'fermee':
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Fermée</Badge>
    default:
      return <Badge variant="secondary">Inconnu</Badge>
  }
}

const getTypeAgenceBadge = (type) => {
  switch (type) {
    case 'principale':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Principale</Badge>
    case 'secondaire':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Secondaire</Badge>
    case 'partenaire':
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Partenaire</Badge>
    default:
      return <Badge variant="secondary">Standard</Badge>
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

export default function AgencyDetailsModal({ isOpen, onClose, agency }) {
  if (!agency) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {agency.nom}
          </DialogTitle>
          <DialogDescription>
            Informations détaillées de l'agence {agency.code}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Status and Type */}
          <div className="flex gap-2">
            {getStatusBadge(agency.statut)}
            {getTypeAgenceBadge(agency.typeAgence)}
          </div>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BadgeIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Code agence:</span>
                  <span className="font-mono">{agency.code}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Adresse:</span>
                  <span>{agency.adresse}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Ville/Quartier:</span>
                  <span>{agency.ville}, {agency.quartier}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Téléphone:</span>
                  <span>{agency.telephone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Email:</span>
                  <span>{agency.email}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Date d'ouverture:</span>
                  <span>{formatDate(agency.dateOuverture)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Horaires:</span>
                  <span>{agency.horaires}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Nombre d'agents:</span>
                  <span>{agency.nombreAgents}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Coordonnées GPS:</span>
                  <span>{agency.coordonnees.latitude}, {agency.coordonnees.longitude}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Responsable Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Responsable d'agence
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Nom:</span>
                <span>{agency.responsable.nom}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Téléphone:</span>
                <span>{agency.responsable.telephone}</span>
              </div>
              <div className="flex items-center gap-2 md:col-span-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Email:</span>
                <span>{agency.responsable.email}</span>
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Informations financières
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(agency.chiffreAffaires)}
                </div>
                <div className="text-sm text-muted-foreground">Chiffre d'affaires mensuel</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(agency.limiteJournaliere)}
                </div>
                <div className="text-sm text-muted-foreground">Limite journalière</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {agency.commission}%
                </div>
                <div className="text-sm text-muted-foreground">Taux de commission</div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Métriques de performance</CardTitle>
              <CardDescription>
                Statistiques et indicateurs clés de l'agence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-lg font-semibold">{agency.nombreAgents}</div>
                  <div className="text-xs text-muted-foreground">Agents actifs</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-lg font-semibold">
                    {Math.round(agency.chiffreAffaires / agency.nombreAgents)}
                  </div>
                  <div className="text-xs text-muted-foreground">CA / Agent (XOF)</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-lg font-semibold">
                    {((agency.chiffreAffaires / agency.limiteJournaliere) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Utilisation limite</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-lg font-semibold">
                    {Math.round((agency.chiffreAffaires * agency.commission) / 100)}
                  </div>
                  <div className="text-xs text-muted-foreground">Commission (XOF)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
