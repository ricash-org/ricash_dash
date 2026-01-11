import { useState } from 'react'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  CreditCard, 
  ArrowLeftRight,
  FileText,
  Ban,
  CheckCircle,
  Edit,
  Trash2
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const getStatusBadge = (status) => {
  switch (status) {
    case 'actif':
      return <Badge variant="default" className="bg-green-100 text-green-800">Actif</Badge>
    case 'suspendu':
      return <Badge variant="destructive">Suspendu</Badge>
    case 'en_attente':
      return <Badge variant="default" className="bg-yellow-100 text-yellow-800">En attente</Badge>
    case 'bloque':
      return <Badge variant="destructive">Bloqué</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getKycBadge = (status) => {
  switch (status) {
    case 'valide':
      return <Badge variant="default" className="bg-green-100 text-green-800">Validé</Badge>
    case 'en_cours':
      return <Badge variant="default" className="bg-blue-100 text-blue-800">En cours</Badge>
    case 'rejete':
      return <Badge variant="destructive">Rejeté</Badge>
    case 'non_verifie':
      return <Badge variant="secondary">Non vérifié</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function UserDetailsModal({ isOpen, onClose, user }) {
  const [activeTab, setActiveTab] = useState('details')

  if (!user) return null

  // Mock data for transactions
  const transactions = [
    {
      id: 'TXN001',
      type: 'Envoi',
      destinataire: 'Marie Martin',
      montant: 500.00,
      statut: 'complete',
      date: '2024-01-20 14:30'
    },
    {
      id: 'TXN002',
      type: 'Réception',
      expediteur: 'Pierre Durand',
      montant: 300.00,
      statut: 'complete',
      date: '2024-01-18 10:15'
    },
    {
      id: 'TXN003',
      type: 'Envoi',
      destinataire: 'Sophie Leroy',
      montant: 750.00,
      statut: 'en_cours',
      date: '2024-01-19 16:45'
    }
  ]

  // Mock data for documents
  const documents = [
    {
      id: 'DOC001',
      type: 'Pièce d\'identité',
      nom: 'carte_identite.pdf',
      statut: 'valide',
      dateUpload: '2024-01-15'
    },
    {
      id: 'DOC002',
      type: 'Justificatif de domicile',
      nom: 'facture_electricite.pdf',
      statut: 'valide',
      dateUpload: '2024-01-15'
    },
    {
      id: 'DOC003',
      type: 'Relevé bancaire',
      nom: 'releve_bancaire.pdf',
      statut: 'en_cours',
      dateUpload: '2024-01-20'
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <User className="h-5 w-5" />
            <span>Détails de l'utilisateur</span>
          </DialogTitle>
          <DialogDescription>
            Informations complètes et historique de {user.prenom} {user.nom}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{user.prenom} {user.nom}</h3>
                    <p className="text-muted-foreground">{user.id}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      {getStatusBadge(user.statut)}
                      {getKycBadge(user.kycStatus)}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  {user.statut === 'actif' ? (
                    <Button variant="outline" size="sm" className="text-yellow-600">
                      <Ban className="h-4 w-4 mr-2" />
                      Suspendre
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Activer
                    </Button>
                  )}
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Informations</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="activity">Activité</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informations personnelles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Téléphone</p>
                        <p className="text-sm text-muted-foreground">{user.telephone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Date de création</p>
                        <p className="text-sm text-muted-foreground">{user.dateCreation}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Dernière connexion</p>
                        <p className="text-sm text-muted-foreground">{user.derniereConnexion}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informations financières</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Solde actuel</p>
                        <p className="text-lg font-semibold">€{user.solde.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Nombre de transactions</p>
                        <p className="text-lg font-semibold">{user.transactions}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Statut KYC</p>
                        <div className="mt-1">{getKycBadge(user.kycStatus)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Historique des transactions</CardTitle>
                  <CardDescription>
                    Toutes les transactions effectuées par cet utilisateur
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID Transaction</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Contrepartie</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">{transaction.id}</TableCell>
                          <TableCell>{transaction.type}</TableCell>
                          <TableCell>
                            {transaction.destinataire || transaction.expediteur}
                          </TableCell>
                          <TableCell>€{transaction.montant.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={transaction.statut === 'complete' ? 'default' : 'secondary'}>
                              {transaction.statut === 'complete' ? 'Complété' : 'En cours'}
                            </Badge>
                          </TableCell>
                          <TableCell>{transaction.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Documents KYC</CardTitle>
                  <CardDescription>
                    Documents soumis pour la vérification d'identité
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type de document</TableHead>
                        <TableHead>Nom du fichier</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date d'upload</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map((document) => (
                        <TableRow key={document.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4" />
                              <span>{document.type}</span>
                            </div>
                          </TableCell>
                          <TableCell>{document.nom}</TableCell>
                          <TableCell>
                            <Badge variant={document.statut === 'valide' ? 'default' : 'secondary'}>
                              {document.statut === 'valide' ? 'Validé' : 'En cours'}
                            </Badge>
                          </TableCell>
                          <TableCell>{document.dateUpload}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Voir
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Journal d'activité</CardTitle>
                  <CardDescription>
                    Historique des actions et événements liés à ce compte
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 border rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                      <div>
                        <p className="text-sm font-medium">Compte activé</p>
                        <p className="text-xs text-muted-foreground">20 janvier 2024 à 14:30</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 border rounded-lg">
                      <FileText className="h-4 w-4 text-blue-500 mt-1" />
                      <div>
                        <p className="text-sm font-medium">Documents KYC soumis</p>
                        <p className="text-xs text-muted-foreground">15 janvier 2024 à 10:15</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 border rounded-lg">
                      <User className="h-4 w-4 text-gray-500 mt-1" />
                      <div>
                        <p className="text-sm font-medium">Compte créé</p>
                        <p className="text-xs text-muted-foreground">15 janvier 2024 à 09:00</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}

