import { useState } from 'react'
import { 
  Ban, 
  CheckCircle, 
  AlertTriangle,
  User,
  MessageSquare,
  Calendar
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

export default function BlockUnblockModal({ isOpen, onClose, user, onConfirm }) {
  const [action, setAction] = useState('')
  const [reason, setReason] = useState('')
  const [duration, setDuration] = useState('')
  const [comments, setComments] = useState('')

  if (!user) return null

  const handleSubmit = () => {
    if (action && reason) {
      const actionData = {
        userId: user.id,
        action,
        reason,
        duration,
        comments,
        timestamp: new Date().toISOString()
      }
      onConfirm?.(actionData)
      onClose()
    }
  }

  const isBlocking = action === 'block'
  const isUnblocking = action === 'unblock'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            {isBlocking ? (
              <Ban className="h-5 w-5 text-red-500" />
            ) : isUnblocking ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            )}
            <span>
              {isBlocking ? 'Bloquer l\'utilisateur' : isUnblocking ? 'Débloquer l\'utilisateur' : 'Modifier le statut'}
            </span>
          </DialogTitle>
          <DialogDescription>
            {isBlocking 
              ? `Bloquer le compte de ${user.prenom} ${user.nom}`
              : isUnblocking 
              ? `Débloquer le compte de ${user.prenom} ${user.nom}`
              : `Modifier le statut du compte de ${user.prenom} ${user.nom}`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User info */}
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
                  <div className="mt-2">
                    <Badge variant={user.statut === 'actif' ? 'default' : 'destructive'} 
                           className={user.statut === 'actif' ? 'bg-green-100 text-green-800' : ''}>
                      {user.statut === 'actif' ? 'Actif' : user.statut === 'suspendu' ? 'Suspendu' : 'En attente'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Téléphone</Label>
                  <p className="text-sm text-muted-foreground">{user.telephone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Solde actuel</Label>
                  <p className="text-sm text-muted-foreground">€{user.solde?.toFixed(2) || '0.00'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Transactions</Label>
                  <p className="text-sm text-muted-foreground">{user.transactions || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Action à effectuer</CardTitle>
              <CardDescription>
                Sélectionnez l'action que vous souhaitez effectuer sur ce compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="action">Action</Label>
                <SafeSelect
                  value={action}
                  onValueChange={setAction}
                  placeholder="Sélectionnez une action"
                  options={[
                    { value: 'block', label: '🚫 Bloquer le compte' },
                    { value: 'unblock', label: '✅ Débloquer le compte' },
                    { value: 'suspend', label: '⏸️ Suspendre temporairement' },
                    { value: 'activate', label: '🟢 Activer le compte' }
                  ]}
                />
              </div>

              {action && (
                <div>
                  <Label htmlFor="reason">Raison</Label>
                  <SafeSelect
                    value={reason}
                    onValueChange={setReason}
                    placeholder="Sélectionnez une raison"
                    options={[
                      { value: 'fraud', label: 'Fraude suspectée' },
                      { value: 'kyc_failed', label: 'Échec de validation KYC' },
                      { value: 'policy_violation', label: 'Violation des conditions' },
                      { value: 'suspicious_activity', label: 'Activité suspecte' },
                      { value: 'user_request', label: 'Demande de l\'utilisateur' },
                      { value: 'kyc_completed', label: 'KYC validé' },
                      { value: 'investigation_complete', label: 'Enquête terminée' },
                      { value: 'other', label: 'Autre raison' }
                    ]}
                  />
                </div>
              )}

              {(action === 'block' || action === 'suspend') && (
                <div>
                  <Label htmlFor="duration">Durée</Label>
                  <SafeSelect
                    value={duration}
                    onValueChange={setDuration}
                    placeholder="Sélectionnez une durée"
                    options={[
                      { value: '24h', label: '24 heures' },
                      { value: '7d', label: '7 jours' },
                      { value: '30d', label: '30 jours' },
                      { value: '90d', label: '90 jours' },
                      { value: 'permanent', label: 'Permanent' }
                    ]}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Commentaires</CardTitle>
              <CardDescription>
                Ajoutez des détails sur cette action (optionnel)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="comments">Commentaires</Label>
                <Textarea
                  id="comments"
                  placeholder="Décrivez les détails de cette action..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Warning for blocking */}
          {isBlocking && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800">Attention</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Bloquer ce compte empêchera l'utilisateur d'accéder à ses fonds et d'effectuer des transactions. 
                      Cette action doit être justifiée et documentée.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action buttons */}
          <div className="flex justify-end space-x-2">
            <Button 
              onClick={handleSubmit}
              disabled={!action || !reason}
              variant={isBlocking ? 'destructive' : isUnblocking ? 'default' : 'secondary'}
            >
              {isBlocking && <Ban className="h-4 w-4 mr-2" />}
              {isUnblocking && <CheckCircle className="h-4 w-4 mr-2" />}
              {isBlocking ? 'Bloquer le compte' : isUnblocking ? 'Débloquer le compte' : 'Confirmer l\'action'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}