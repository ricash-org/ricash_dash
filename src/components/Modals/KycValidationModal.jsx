import { useState } from 'react'
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download,
  MessageSquare,
  Calendar,
  User
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
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { SafeSelect } from '@/components/ui/safe-select'

export default function KycValidationModal({ isOpen, onClose, user, onValidate, onReject }) {
  const [decision, setDecision] = useState('')
  const [comments, setComments] = useState('')
  const [selectedDocument, setSelectedDocument] = useState(null)

  if (!user) return null

  // Mock data for documents
  const documents = [
    {
      id: 'DOC001',
      type: 'Pièce d\'identité',
      nom: 'carte_identite.pdf',
      url: '/documents/carte_identite.pdf',
      statut: 'en_cours',
      dateUpload: '2024-01-15',
      taille: '2.3 MB'
    },
    {
      id: 'DOC002',
      type: 'Justificatif de domicile',
      nom: 'facture_electricite.pdf',
      url: '/documents/facture_electricite.pdf',
      statut: 'en_cours',
      dateUpload: '2024-01-15',
      taille: '1.8 MB'
    },
    {
      id: 'DOC003',
      type: 'Relevé bancaire',
      nom: 'releve_bancaire.pdf',
      url: '/documents/releve_bancaire.pdf',
      statut: 'en_cours',
      dateUpload: '2024-01-20',
      taille: '3.1 MB'
    }
  ]

  const handleSubmit = () => {
    if (decision === 'approve') {
      onValidate?.(user.id, comments)
    } else if (decision === 'reject') {
      onReject?.(user.id, comments)
    }
    onClose()
  }

  const getDocumentIcon = () => {
    return <FileText className="h-4 w-4" />
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5" />
            <span>Validation KYC</span>
          </DialogTitle>
          <DialogDescription>
            Examinez et validez les documents KYC de {user.prenom} {user.nom}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* User info */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations utilisateur</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.prenom} {user.nom}</h3>
                    <p className="text-sm text-muted-foreground">{user.id}</p>
                  </div>
                </div>
                
                <div className="grid gap-3">
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Téléphone</Label>
                    <p className="text-sm text-muted-foreground">{user.telephone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Date de création</Label>
                    <p className="text-sm text-muted-foreground">{user.dateCreation}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Statut actuel</Label>
                    <Badge variant="secondary" className="mt-1">
                      {user.kycStatus === 'en_cours' ? 'En cours de validation' : user.kycStatus}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Decision form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Décision de validation</CardTitle>
                <CardDescription>
                  Sélectionnez votre décision et ajoutez des commentaires
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="decision">Décision</Label>
                  <SafeSelect
                    value={decision}
                    onValueChange={setDecision}
                    placeholder="Sélectionnez une décision"
                    options={[
                      { value: 'approve', label: '✅ Approuver' },
                      { value: 'reject', label: '❌ Rejeter' }
                    ]}
                  />
                </div>

                <div>
                  <Label htmlFor="comments">Commentaires</Label>
                  <Textarea
                    id="comments"
                    placeholder="Ajoutez des commentaires sur votre décision..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button 
                    onClick={handleSubmit}
                    disabled={!decision}
                    className="flex-1"
                    variant={decision === 'approve' ? 'default' : decision === 'reject' ? 'destructive' : 'secondary'}
                  >
                    {decision === 'approve' && <CheckCircle className="h-4 w-4 mr-2" />}
                    {decision === 'reject' && <XCircle className="h-4 w-4 mr-2" />}
                    {decision === 'approve' ? 'Approuver KYC' : decision === 'reject' ? 'Rejeter KYC' : 'Sélectionner une décision'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documents */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Documents soumis</CardTitle>
                <CardDescription>
                  Cliquez sur un document pour l'examiner en détail
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.map((document) => (
                    <div 
                      key={document.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedDocument?.id === document.id 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedDocument(document)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getDocumentIcon(document.type)}
                          <div>
                            <p className="font-medium text-sm">{document.type}</p>
                            <p className="text-xs text-muted-foreground">{document.nom}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            {document.taille}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Uploadé le {document.dateUpload}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Document preview */}
            {selectedDocument && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Aperçu du document</CardTitle>
                  <CardDescription>
                    {selectedDocument.type} - {selectedDocument.nom}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg p-8 text-center">
                    <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Aperçu du document : {selectedDocument.nom}
                    </p>
                    <div className="flex justify-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Ouvrir
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Validation history */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Historique de validation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium">Documents soumis</p>
                      <p className="text-xs text-muted-foreground">15 janvier 2024 à 10:15</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <MessageSquare className="h-4 w-4 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium">En attente de validation</p>
                      <p className="text-xs text-muted-foreground">Depuis 5 jours</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

