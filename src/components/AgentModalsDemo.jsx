import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { 
  User, 
  TrendingUp, 
  Plus, 
  Eye, 
  BarChart3, 
  Award,
  Building2,
  Phone,
  Mail,
  Star
} from 'lucide-react'

export default function AgentModalsDemo() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Modales de Gestion des Agents</h1>
        <p className="text-muted-foreground">
          Aperçu des fonctionnalités avancées de gestion des agents Ricash
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* Agent Details Modal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              Détails de l'Agent
            </CardTitle>
            <CardDescription>
              Profil complet avec informations personnelles et professionnelles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Fonctionnalités :</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <User className="h-3 w-3" />
                  Informations personnelles complètes
                </li>
                <li className="flex items-center gap-2">
                  <Building2 className="h-3 w-3" />
                  Affectation et historique professionnel
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  Contacts d'urgence
                </li>
                <li className="flex items-center gap-2">
                  <Award className="h-3 w-3" />
                  Certifications et formations
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-3 w-3" />
                  Métriques de performance
                </li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-blue-100 text-blue-800">Calcul d'âge automatique</Badge>
              <Badge className="bg-green-100 text-green-800">Calcul d'expérience</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Create Agent Modal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-600" />
              Création d'Agent
            </CardTitle>
            <CardDescription>
              Formulaire complet de création avec validation avancée
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Fonctionnalités :</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <User className="h-3 w-3" />
                  Validation des données personnelles
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  Validation email et téléphone
                </li>
                <li className="flex items-center gap-2">
                  <Award className="h-3 w-3" />
                  Validation CNI sénégalaise (13 chiffres)
                </li>
                <li className="flex items-center gap-2">
                  <Building2 className="h-3 w-3" />
                  Affectation automatique aux agences
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  Gestion des contacts d'urgence
                </li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-red-100 text-red-800">Validation en temps réel</Badge>
              <Badge className="bg-purple-100 text-purple-800">Vérification d'âge</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Performance Modal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Analyse de Performance
            </CardTitle>
            <CardDescription>
              Dashboard avancé avec graphiques et objectifs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Fonctionnalités :</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <BarChart3 className="h-3 w-3" />
                  Graphiques interactifs (Recharts)
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3" />
                  Évolution sur 6 mois
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-3 w-3" />
                  Suivi des objectifs avec progression
                </li>
                <li className="flex items-center gap-2">
                  <Award className="h-3 w-3" />
                  Évaluation par compétences
                </li>
                <li className="flex items-center gap-2">
                  <Building2 className="h-3 w-3" />
                  Comparaison avec objectifs
                </li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-orange-100 text-orange-800">4 onglets thématiques</Badge>
              <Badge className="bg-cyan-100 text-cyan-800">Graphiques Recharts</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Fonctionnalités Techniques</CardTitle>
          <CardDescription>
            Technologies et composants utilisés dans les modales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 border rounded-lg">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-medium">Recharts</h4>
              <p className="text-sm text-muted-foreground">Graphiques interactifs</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <User className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h4 className="font-medium">Radix UI</h4>
              <p className="text-sm text-muted-foreground">Composants accessibles</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Award className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h4 className="font-medium">Validation</h4>
              <p className="text-sm text-muted-foreground">Contrôles avancés</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <h4 className="font-medium">Performance</h4>
              <p className="text-sm text-muted-foreground">Métriques temps réel</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Comment utiliser les modales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Badge className="bg-blue-100 text-blue-800 mt-0.5">1</Badge>
              <div>
                <p className="font-medium">Accès aux détails :</p>
                <p className="text-muted-foreground">Cliquez sur "Voir détails" dans le menu Actions de n'importe quel agent</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-green-100 text-green-800 mt-0.5">2</Badge>
              <div>
                <p className="font-medium">Création d'agent :</p>
                <p className="text-muted-foreground">Utilisez le bouton "Nouvel agent" en haut à droite de la page</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-purple-100 text-purple-800 mt-0.5">3</Badge>
              <div>
                <p className="font-medium">Analyse performance :</p>
                <p className="text-muted-foreground">Sélectionnez "Performance" dans le menu Actions pour voir les graphiques</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
