import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign,
  Shield,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Copy,
  Download,
  MessageSquare,
  Settings,
  CreditCard,
  Eye,
  RefreshCw,
  Edit,
  Ban,
  UserCheck,
  FileText,
  Bell,
  Globe
} from 'lucide-react';
import { RicashButton } from '@/components/ui/ricash-button';
import { RicashCard } from '@/components/ui/ricash-card';
import { RicashInput } from '@/components/ui/ricash-input';
import { RicashLabel } from '@/components/ui/ricash-label';
import { RicashTextarea } from '@/components/ui/ricash-textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useUserDetails } from '@/hooks/useUserDetails';

const getStatusBadge = (status) => {
  switch (status) {
    case 'actif':
      return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="h-3 w-3" />Actif</Badge>;
    case 'suspendu':
      return <Badge className="bg-red-100 text-red-800 flex items-center gap-1"><Ban className="h-3 w-3" />Suspendu</Badge>;
    case 'en_attente':
      return <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1"><Clock className="h-3 w-3" />En attente</Badge>;
    case 'valide':
      return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><UserCheck className="h-3 w-3" />Validé</Badge>;
    case 'VERIFIE':
      return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><UserCheck className="h-3 w-3" />Vérifié</Badge>;
    case 'EN_COURS':
      return <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1"><Clock className="h-3 w-3" />En cours</Badge>;
    case 'REJETE':
      return <Badge className="bg-red-100 text-red-800 flex items-center gap-1"><XCircle className="h-3 w-3" />Rejeté</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'actif':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'suspendu':
      return <Ban className="h-5 w-5 text-red-500" />;
    case 'en_attente':
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case 'valide':
      return <UserCheck className="h-5 w-5 text-green-500" />;
    case 'VERIFIE':
      return <UserCheck className="h-5 w-5 text-green-500" />;
    case 'EN_COURS':
      return <Clock className="h-5 w-5 text-blue-500" />;
    case 'REJETE':
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Clock className="h-5 w-5 text-gray-500" />;
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount || 0);
};

const formatDate = (dateString) => {
  if (!dateString) return 'Non défini';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Fonction pour mapper les données de l'API vers le format attendu par le composant
const mapApiDataToComponent = (apiData) => {
  if (!apiData) return null;
  
  return {
    ...apiData,
    // Statut actif
    statut: apiData.actif ? 'actif' : 'suspendu',
    // Données financières
    solde: apiData.portefeuille?.solde || 0,
    limiteJournaliere: 100000, // Valeur par défaut
    limiteMensuelle: 1000000, // Valeur par défaut
    montantTotalTransactions: 0, // À implémenter si disponible
    // Documents
    documents: apiData.documentsIdentite || [],
    // Adresse formatée
    adresseText: apiData.adresse ? 
      `${apiData.adresse.ligne1}${apiData.adresse.ligne2 ? ', ' + apiData.adresse.ligne2 : ''}\n${apiData.adresse.codePostal} ${apiData.adresse.ville}\n${apiData.adresse.pays}` 
      : 'Non renseignée',
    // Préférences par défaut
    preferences: {
      notifications: true,
      sms: true,
      email: true,
      langue: 'fr'
    },
    // Données manquantes avec valeurs par défaut
    nombreTransactions: 0,
    transactions: [],
    historique: []
  };
};

export default function UserDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  
  const { user: apiUser, loading, error, fetchUser, updateUserStatus } = useUserDetails();

  // Mapper les données de l'API
  const user = mapApiDataToComponent(apiUser);

  useEffect(() => {
    if (id) {
      fetchUser(id);
    }
  }, [id, fetchUser]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papiers!');
  };

  const handleStatusChange = async (newStatus, reason, duration, comment) => {
    try {
      await updateUserStatus(id, {
        newStatus,
        reason,
        duration,
        comment
      });
      toast.success('Statut mis à jour avec succès');
    } catch (err) {
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B8286] mx-auto"></div>
          <p className="mt-4 text-[#376470]">Chargement des détails utilisateur...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <RicashButton
            variant="outline"
            onClick={() => navigate('/app/users')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux utilisateurs
          </RicashButton>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 text-red-800">
            <AlertTriangle className="h-6 w-6" />
            <div>
              <h3 className="font-semibold">Erreur</h3>
              <p>{error}</p>
            </div>
          </div>
          <RicashButton onClick={() => fetchUser(id)} className="mt-4">
            Réessayer
          </RicashButton>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <RicashButton
            variant="outline"
            onClick={() => navigate('/app/users')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux utilisateurs
          </RicashButton>
        </div>
        <div className="text-center py-12">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Utilisateur non trouvé</h2>
          <p className="text-gray-600">L'utilisateur avec l'ID {id} n'existe pas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <RicashButton
            variant="outline"
            onClick={() => navigate('/app/users')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux utilisateurs
          </RicashButton>
          <div>
            <h1 className="text-3xl font-bold text-[#29475B]">
              {user.prenom} {user.nom}
            </h1>
            {/* L'ID a été supprimé comme demandé */}
          </div>
        </div>
        <div className="flex gap-2">
          <RicashButton variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </RicashButton>
          <RicashButton variant="outline" onClick={() => fetchUser(id)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </RicashButton>
          <RicashButton>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </RicashButton>
        </div>
      </div>

      {/* Statut et informations principales */}
      <div className="grid gap-6 md:grid-cols-3">
        <RicashCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#29475B]">Statut</h3>
            {getStatusIcon(user.statut)}
          </div>
          <div className="space-y-3">
            {getStatusBadge(user.statut)}
            <div className="text-sm text-[#376470]">
              <p>Créé le: {formatDate(user.dateCreation)}</p>
              <p>Dernière connexion: {formatDate(user.dernierLogin)}</p>
            </div>
          </div>
        </RicashCard>

        <RicashCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#29475B]">Solde</h3>
            <DollarSign className="h-5 w-5 text-[#2B8286]" />
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-[#29475B]">
              {formatCurrency(user.solde)}
            </div>
            <div className="text-sm text-[#376470]">
              Devise: {user.portefeuille?.devise || 'XOF'}
            </div>
            <div className="text-sm font-semibold text-[#2B8286]">
              Dernière mise à jour: {formatDate(user.portefeuille?.dateDerniereMAJ)}
            </div>
          </div>
        </RicashCard>

        <RicashCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#29475B]">Informations</h3>
            <Shield className="h-5 w-5 text-[#B19068]" />
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Type de compte:</span> {user.role}</p>
            <p><span className="font-medium">KYC:</span> {getStatusBadge(user.kycStatut)}</p>
            <p><span className="font-medium">Transactions:</span> {user.nombreTransactions || 0}</p>
            <p><span className="font-medium">Volume total:</span> {formatCurrency(user.montantTotalTransactions)}</p>
          </div>
        </RicashCard>
      </div>

      {/* Onglets pour les détails */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Informations financières */}
            <RicashCard className="p-6">
              <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Détails financiers
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-[#376470]">Solde actuel</span>
                  <span className="font-semibold text-[#29475B]">{formatCurrency(user.solde)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-[#376470]">Devise</span>
                  <span className="font-semibold text-[#29475B]">{user.portefeuille?.devise || 'XOF'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-[#376470]">Limite journalière</span>
                  <span className="font-semibold text-[#29475B]">{formatCurrency(user.limiteJournaliere)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-[#376470]">Limite mensuelle</span>
                  <span className="font-semibold text-[#29475B]">{formatCurrency(user.limiteMensuelle)}</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-[#2B8286]/10 rounded-lg px-3">
                  <span className="font-semibold text-[#29475B]">Dernière mise à jour</span>
                  <span className="font-bold text-lg text-[#2B8286]">{formatDate(user.portefeuille?.dateDerniereMAJ)}</span>
                </div>
              </div>
            </RicashCard>

            {/* Documents */}
            <RicashCard className="p-6">
              <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents KYC
              </h3>
              <div className="space-y-3">
                {(user.documents || []).map((doc, index) => (
                  <div key={doc.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-[#29475B]">{doc.type}</p>
                      <p className="text-sm text-[#376470]">Numéro: {doc.numero}</p>
                      {doc.dateExpiration && (
                        <p className="text-sm text-[#376470]">Expire: {formatDate(doc.dateExpiration)}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={
                        doc.dateValidation ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }>
                        {doc.dateValidation ? 'Validé' : 'En attente'}
                      </Badge>
                      <RicashButton variant="outline" size="sm">
                        <a href={doc.imageRectoUrl} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4" />
                        </a>
                      </RicashButton>
                    </div>
                  </div>
                ))}
                {(!user.documents || user.documents.length === 0) && (
                  <p className="text-[#376470] text-center py-4">Aucun document disponible</p>
                )}
              </div>
            </RicashCard>
          </div>

          {/* Dernières transactions */}
          <RicashCard className="p-6">
            <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Dernières transactions
            </h3>
            <div className="space-y-3">
              {(user.transactions || []).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-[#29475B]">
                      {transaction.type === 'envoi' ? 'Envoi vers' : 'Réception de'} {transaction.destinataire || transaction.expediteur}
                    </p>
                    <p className="text-sm text-[#376470]">{formatDate(transaction.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#29475B]">{formatCurrency(transaction.montant)}</p>
                    <Badge className={
                      transaction.statut === 'complété' ? 'bg-green-100 text-green-800' :
                      transaction.statut === 'suspendu' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {transaction.statut}
                    </Badge>
                  </div>
                </div>
              ))}
              {(!user.transactions || user.transactions.length === 0) && (
                <p className="text-[#376470] text-center py-4">Aucune transaction disponible</p>
              )}
            </div>
          </RicashCard>
        </TabsContent>

        <TabsContent value="personal" className="space-y-6">
          <RicashCard className="p-6">
            <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations personnelles
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <RicashLabel className="text-sm font-medium text-[#376470]">Nom complet</RicashLabel>
                <p className="text-[#29475B] font-medium">{user.prenom} {user.nom}</p>
              </div>
              <div>
                <RicashLabel className="text-sm font-medium text-[#376470]">Téléphone</RicashLabel>
                <div className="flex items-center gap-2">
                  <p className="text-[#29475B]">{user.telephone}</p>
                  <RicashButton
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(user.telephone)}
                  >
                    <Copy className="h-3 w-3" />
                  </RicashButton>
                </div>
              </div>
              <div>
                <RicashLabel className="text-sm font-medium text-[#376470]">Email</RicashLabel>
                <div className="flex items-center gap-2">
                  <p className="text-[#29475B]">{user.email}</p>
                  <RicashButton
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(user.email)}
                  >
                    <Copy className="h-3 w-3" />
                  </RicashButton>
                </div>
              </div>
              <div>
                <RicashLabel className="text-sm font-medium text-[#376470]">Pays</RicashLabel>
                <p className="text-[#29475B]">{user.adresse?.pays || 'Non renseigné'}</p>
              </div>
              <div>
                <RicashLabel className="text-sm font-medium text-[#376470]">Ville</RicashLabel>
                <p className="text-[#29475B]">{user.adresse?.ville || 'Non renseigné'}</p>
              </div>
              <div>
                <RicashLabel className="text-sm font-medium text-[#376470]">Date de naissance</RicashLabel>
                <p className="text-[#29475B]">{formatDate(user.dateNaissance)}</p>
              </div>
              <div className="md:col-span-2">
                <RicashLabel className="text-sm font-medium text-[#376470]">Adresse</RicashLabel>
                <p className="text-[#29475B] whitespace-pre-line">{user.adresseText}</p>
              </div>
            </div>
          </RicashCard>

          {/* Préférences */}
          <RicashCard className="p-6">
            <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Préférences
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-[#376470]" />
                  <span className="text-[#29475B]">Notifications</span>
                </div>
                <Badge className={user.preferences?.notifications ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {user.preferences?.notifications ? 'Activé' : 'Désactivé'}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#376470]" />
                  <span className="text-[#29475B]">SMS</span>
                </div>
                <Badge className={user.preferences?.sms ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {user.preferences?.sms ? 'Activé' : 'Désactivé'}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#376470]" />
                  <span className="text-[#29475B]">Email</span>
                </div>
                <Badge className={user.preferences?.email ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {user.preferences?.email ? 'Activé' : 'Désactivé'}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-[#376470]" />
                  <span className="text-[#29475B]">Langue</span>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  {(user.preferences?.langue || 'fr').toUpperCase()}
                </Badge>
              </div>
            </div>
          </RicashCard>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <RicashCard className="p-6">
            <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Documents KYC
            </h3>
            <div className="space-y-4">
              {(user.documents || []).map((doc, index) => (
                <div key={doc.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-[#376470]" />
                    <div>
                      <p className="font-medium text-[#29475B]">{doc.type} - {doc.numero}</p>
                      <div className="text-sm text-[#376470]">
                        <p>Recto: {doc.imageRectoUrl ? 'Disponible' : 'Manquant'}</p>
                        <p>Verso: {doc.imageVersoUrl ? 'Disponible' : 'Manquant'}</p>
                        {doc.dateExpiration && (
                          <p>Expire le: {formatDate(doc.dateExpiration)}</p>
                        )}
                        {doc.dateValidation && (
                          <p>Validé le: {formatDate(doc.dateValidation)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={
                      doc.dateValidation ? 'bg-green-100 text-green-800' : 
                      doc.dateExpiration && new Date(doc.dateExpiration) < new Date() ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {doc.dateValidation ? 'Validé' : 
                       doc.dateExpiration && new Date(doc.dateExpiration) < new Date() ? 'Expiré' : 
                       'En attente'}
                    </Badge>
                    <div className="flex gap-1">
                      {doc.imageRectoUrl && (
                        <RicashButton variant="outline" size="sm">
                          <a href={doc.imageRectoUrl} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4" />
                          </a>
                        </RicashButton>
                      )}
                      {doc.imageVersoUrl && (
                        <RicashButton variant="outline" size="sm">
                          <a href={doc.imageVersoUrl} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4" />
                          </a>
                        </RicashButton>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {(!user.documents || user.documents.length === 0) && (
                <p className="text-[#376470] text-center py-8">Aucun document disponible</p>
              )}
            </div>
          </RicashCard>
        </TabsContent>

        <TabsContent value="historique" className="space-y-6">
          <RicashCard className="p-6">
            <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Historique des actions
            </h3>
            <div className="space-y-4">
              {(user.historique || []).map((action, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[#2B8286] flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#29475B]">{action.action}</p>
                    <p className="text-sm text-[#376470]">{formatDate(action.date)}</p>
                  </div>
                  <Badge className={
                    action.statut === 'succes' ? 'bg-green-100 text-green-800' :
                    action.statut === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    action.statut === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {action.statut}
                  </Badge>
                </div>
              ))}
              {(!user.historique || user.historique.length === 0) && (
                <p className="text-[#376470] text-center py-8">Aucun historique disponible</p>
              )}
            </div>
          </RicashCard>

          {/* Commentaires */}
          <RicashCard className="p-6">
            <h3 className="text-lg font-semibold text-[#29475B] mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Commentaires
            </h3>
            <div className="space-y-4">
              <RicashTextarea
                placeholder="Ajouter un commentaire sur cet utilisateur..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <RicashButton>
                <MessageSquare className="h-4 w-4 mr-2" />
                Ajouter commentaire
              </RicashButton>
            </div>
          </RicashCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}