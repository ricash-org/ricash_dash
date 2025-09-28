# Refactorisation de la Page Transfers - Inspiration de la Page Agents

## 🎯 **Objectif**

Refactoriser la page `TransfersWithModals.jsx` en s'inspirant de la structure et du design de la page `Agents.jsx`, tout en gardant les modals `TransferDetailsModal` et `CreateTransferModal` intactes.

## 🔍 **Analyse de la Page Agents**

### **Structure Identifiée :**
1. **Header avec design Ricash** : Titre, description et boutons d'action
2. **Cartes de statistiques** : 8 cartes avec `RicashStatCard`
3. **Section de filtres** : `RicashCard` avec filtres avancés
4. **Tableau principal** : `RicashTableCard` avec `RicashTable`
5. **Design cohérent** : Palette de couleurs Ricash et animations

### **Composants Utilisés :**
- `RicashButton`, `RicashIconButton`
- `RicashInput`, `RicashSelect`
- `RicashCard`, `RicashStatCard`, `RicashTableCard`
- `RicashTable`, `RicashTableHeader`, `RicashTableBody`, `RicashTableRow`, `RicashTableCell`
- `RicashStatusBadge`

## ✅ **Refactorisation Appliquée**

### **1. Imports et Dépendances**
```jsx
// AVANT
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

// APRÈS
import { RicashButton, RicashIconButton } from '@/components/ui/ricash-button'
import { RicashInput } from '@/components/ui/ricash-input'
import { RicashSelect } from '@/components/ui/ricash-input'
import { RicashCard, RicashStatCard, RicashTableCard } from '@/components/ui/ricash-card'
import { RicashTable, RicashTableHeader, RicashTableBody, RicashTableRow, RicashTableCell, RicashStatusBadge } from '@/components/ui/ricash-table'
```

### **2. Palette de Couleurs Ricash**
```jsx
const RICASH_COLORS = {
  bleuFonce: '#29475B',
  dore: '#B19068',
  turquoise: '#2B8286',
  blancCasse: '#F4F2EE',
  bleuVert: '#376470'
}
```

### **3. Données Mock Enrichies**
```jsx
// AVANT - Données simples
expediteur: 'Jean Dupont',
destinataire: 'Marie Martin',
agence: 'Agence Dakar Centre',
agent: 'Amadou Diallo',

// APRÈS - Objets structurés
expediteur: {
  nom: 'Jean Dupont',
  telephone: '+33 6 12 34 56 78',
  email: 'jean.dupont@email.com',
  pays: 'France'
},
destinataire: {
  nom: 'Marie Martin',
  telephone: '+221 77 123 45 67',
  email: 'marie.martin@email.com',
  pays: 'Sénégal'
},
agence: {
  nom: 'Agence Dakar Centre',
  ville: 'Dakar',
  id: 'AGE001'
},
agent: {
  nom: 'Amadou Diallo',
  telephone: '+221 77 987 65 43',
  email: 'amadou.diallo@ricash.com'
}
```

### **4. Fonctions Utilitaires**
```jsx
const formatCurrency = (amount) => {
  if (amount === 0) return '€0'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const getStatusColor = (statut) => {
  switch (statut) {
    case 'complete': return 'success'
    case 'en_cours': return 'info'
    case 'en_attente': return 'warning'
    case 'annule': return 'error'
    case 'suspect': return 'warning'
    default: return 'default'
  }
}

const getStatusText = (statut) => {
  switch (statut) {
    case 'complete': return 'Complété'
    case 'en_cours': return 'En cours'
    case 'en_attente': return 'En attente'
    case 'annule': return 'Annulé'
    case 'suspect': return 'Suspect'
    default: return statut
  }
}
```

### **5. Header avec Design Ricash**
```jsx
// AVANT
<div className="flex justify-between items-center">
  <div>
    <h1 className="text-3xl font-bold tracking-tight">{pageContent.title}</h1>
    <p className="text-muted-foreground">{pageContent.description}</p>
  </div>
  <div className="flex gap-3">
    <Button onClick={handleCreateTransfer}>
      <Plus className="mr-2 h-4 w-4" />
      Nouveau transfert
    </Button>
  </div>
</div>

// APRÈS
<div className="bg-white rounded-2xl p-6 shadow-lg border border-[#376470]/10">
  <div className="flex justify-between items-center">
    <div>
      <h1 className="text-4xl font-bold tracking-tight text-[#29475B] mb-2">
        {pageContent.title}
      </h1>
      <p className="text-lg text-[#376470] font-medium">
        {pageContent.description}
      </p>
    </div>
    <div className="flex gap-3">
      <RicashButton
        variant="outline"
        size="lg"
        onClick={handleRefresh}
        loading={isLoading}
        loadingText="Actualisation..."
      >
        <RefreshCw className="mr-2 h-5 w-5" />
        Actualiser
      </RicashButton>
      <RicashButton 
        variant="accent"
        size="lg"
        onClick={handleCreateTransfer}
      >
        <Plus className="mr-2 h-5 w-5" />
        Nouveau transfert
      </RicashButton>
    </div>
  </div>
</div>
```

### **6. Cartes de Statistiques**
```jsx
// AVANT - 5 cartes simples
<div className="grid gap-4 md:grid-cols-5">
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Total transferts</CardTitle>
      <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{stats.total}</div>
    </CardContent>
  </Card>
</div>

// APRÈS - 7 cartes avec RicashStatCard
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
  <RicashStatCard
    title="Total transferts"
    value={stats.total.toString()}
    change="+12%"
    changeType="positive"
    description="Ce mois"
    icon={ArrowLeftRight}
    iconColor={RICASH_COLORS.turquoise}
    className="transform hover:scale-105 transition-transform duration-300"
  />
  <RicashStatCard
    title="Complétés"
    value={stats.completed.toString()}
    change="+8%"
    changeType="positive"
    description="Ce mois"
    icon={CheckCircle}
    iconColor={RICASH_COLORS.turquoise}
    className="transform hover:scale-105 transition-transform duration-300"
  />
  <RicashStatCard
    title="En attente"
    value={stats.pending.toString()}
    change="+2"
    changeType="neutral"
    description="Aujourd'hui"
    icon={Clock}
    iconColor={RICASH_COLORS.dore}
    className="transform hover:scale-105 transition-transform duration-300"
  />
  <RicashStatCard
    title="Suspects"
    value={stats.suspicious.toString()}
    change="-1"
    changeType="negative"
    description="Ce mois"
    icon={AlertTriangle}
    iconColor="#ef4444"
    className="transform hover:scale-105 transition-transform duration-300"
  />
  <RicashStatCard
    title="En cours"
    value={stats.enCours.toString()}
    change="+3"
    changeType="positive"
    description="Aujourd'hui"
    icon={ArrowLeftRight}
    iconColor={RICASH_COLORS.bleuVert}
    className="transform hover:scale-105 transition-transform duration-300"
  />
  <RicashStatCard
    title="Volume total"
    value={formatCurrency(stats.totalMontant)}
    change="+15%"
    changeType="positive"
    description="Ce mois"
    icon={DollarSign}
    iconColor={RICASH_COLORS.bleuFonce}
    className="transform hover:scale-105 transition-transform duration-300"
  />
  <RicashStatCard
    title="Revenus générés"
    value={formatCurrency(stats.revenusGeneres)}
    change="+12%"
    changeType="positive"
    description="Ce mois"
    icon={TrendingUp}
    iconColor={RICASH_COLORS.dore}
    className="transform hover:scale-105 transition-transform duration-300"
  />
</div>
```

### **7. Section de Filtres**
```jsx
// AVANT
<Card>
  <CardHeader>
    <CardTitle>Liste des transferts</CardTitle>
    <CardDescription>Recherchez et filtrez les transferts par statut et corridor</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par ID, expéditeur, destinataire..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  </CardContent>
</Card>

// APRÈS
<RicashCard className="overflow-hidden">
  <div className="p-6 border-b border-[#376470]/10">
    <h3 className="text-xl font-bold text-[#29475B] mb-4">
      Filtres et recherche
    </h3>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#376470]" />
        <RicashInput
          placeholder="Rechercher un transfert..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          className="pl-10"
        />
      </div>
      
      <RicashSelect
        value={filters.status}
        onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
      >
        <option value="all">Tous les statuts</option>
        <option value="complete">Complété</option>
        <option value="en_cours">En cours</option>
        <option value="en_attente">En attente</option>
        <option value="suspect">Suspect</option>
        <option value="annule">Annulé</option>
      </RicashSelect>

      <RicashSelect
        value={filters.corridor}
        onValueChange={(value) => setFilters(prev => ({ ...prev, corridor: value }))}
      >
        <option value="all">Tous les corridors</option>
        <option value="France → Sénégal">France → Sénégal</option>
        <option value="France → Mali">France → Mali</option>
        <option value="France → Côte d'Ivoire">France → Côte d'Ivoire</option>
        <option value="France → Burkina Faso">France → Burkina Faso</option>
      </RicashSelect>

      <RicashSelect
        value={filters.agence}
        onValueChange={(value) => setFilters(prev => ({ ...prev, agence: value }))}
      >
        <option value="all">Toutes les agences</option>
        <option value="Dakar">Dakar</option>
        <option value="Bamako">Bamako</option>
        <option value="Abidjan">Abidjan</option>
        <option value="Ouagadougou">Ouagadougou</option>
        <option value="Thiès">Thiès</option>
      </RicashSelect>

      <RicashSelect
        value={filters.canal}
        onValueChange={(value) => setFilters(prev => ({ ...prev, canal: value }))}
      >
        <option value="all">Tous les canaux</option>
        <option value="Mobile Money">Mobile Money</option>
        <option value="Comptoir">Comptoir</option>
      </RicashSelect>
    </div>
  </div>
</RicashCard>
```

### **8. Tableau Principal**
```jsx
// AVANT
<div className="rounded-md border">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Transaction</TableHead>
        <TableHead>Expéditeur → Destinataire</TableHead>
        <TableHead>Montant</TableHead>
        <TableHead>Corridor</TableHead>
        <TableHead>Statut</TableHead>
        <TableHead>Date</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {filteredTransfers.map((transfer) => (
        <TableRow key={transfer.id}>
          <TableCell>
            <div className="flex items-center space-x-3">
              {getStatusIcon(transfer.statut)}
              <div>
                <div className="font-medium">{transfer.id}</div>
                <div className="text-sm text-muted-foreground">{transfer.codeRetrait}</div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>

// APRÈS
<RicashTableCard
  title="Liste des transferts"
  description={`${filteredTransfers.length} transfert(s) trouvé(s)`}
  className="overflow-hidden"
>
  <RicashTable>
    <RicashTableHeader>
      <RicashTableRow>
        <RicashTableCell className="font-semibold text-[#29475B]">Transaction</RicashTableCell>
        <RicashTableCell className="font-semibold text-[#29475B]">Expéditeur → Destinataire</RicashTableCell>
        <RicashTableCell className="font-semibold text-[#29475B]">Montant</RicashTableCell>
        <RicashTableCell className="font-semibold text-[#29475B]">Corridor</RicashTableCell>
        <RicashTableCell className="font-semibold text-[#29475B]">Statut</RicashTableCell>
        <RicashTableCell className="font-semibold text-[#29475B]">Agence/Agent</RicashTableCell>
        <RicashTableCell className="font-semibold text-[#29475B]">Actions</RicashTableCell>
      </RicashTableRow>
    </RicashTableHeader>
    <RicashTableBody>
      {filteredTransfers.map((transfer) => (
        <RicashTableRow key={transfer.id} className="hover:bg-[#376470]/5 transition-colors">
          <RicashTableCell>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#2B8286]/20 flex items-center justify-center">
                <ArrowLeftRight className="h-5 w-5 text-[#2B8286]" />
              </div>
              <div>
                <div className="font-semibold text-[#29475B]">
                  {transfer.id}
                </div>
                <div className="text-sm text-[#376470]">{transfer.codeRetrait}</div>
                <div className="text-xs text-[#376470]/70">{transfer.dateCreation}</div>
              </div>
            </div>
          </RicashTableCell>
          
          <RicashTableCell>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm">
                <User className="h-3 w-3 text-[#376470]" />
                <span className="text-[#29475B]">{transfer.expediteur.nom}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <ArrowLeftRight className="h-3 w-3 text-[#376470]" />
                <span className="text-[#29475B]">{transfer.destinataire.nom}</span>
              </div>
            </div>
          </RicashTableCell>
          
          <RicashTableCell>
            <div className="space-y-1">
              <div className="font-semibold text-[#29475B]">
                {formatCurrency(transfer.montant)}
              </div>
              <div className="text-sm text-[#376470]">
                Frais: {formatCurrency(transfer.frais)}
              </div>
            </div>
          </RicashTableCell>
          
          <RicashTableCell>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-[#376470]" />
              <div className="text-sm text-[#29475B]">{transfer.pays}</div>
            </div>
          </RicashTableCell>
          
          <RicashTableCell>
            <RicashStatusBadge 
              status={getStatusColor(transfer.statut)} 
              text={getStatusText(transfer.statut)} 
            />
          </RicashTableCell>
          
          <RicashTableCell>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Building2 className="h-3 w-3 text-[#376470]" />
                <span className="text-sm text-[#29475B]">{transfer.agence.nom}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-3 w-3 text-[#376470]" />
                <span className="text-sm text-[#29475B]">{transfer.agent.nom}</span>
              </div>
            </div>
          </RicashTableCell>
          
          <RicashTableCell>
            <div className="flex items-center space-x-2">
              <RicashIconButton
                variant="ghost"
                size="sm"
                onClick={() => handleViewDetails(transfer)}
                className="text-[#2B8286] hover:bg-[#2B8286]/10"
              >
                <Eye className="h-4 w-4" />
              </RicashIconButton>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <RicashIconButton
                    variant="ghost"
                    size="sm"
                    className="text-[#376470] hover:bg-[#376470]/10"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </RicashIconButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="text-[#29475B]">Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleViewDetails(transfer)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Voir détails
                  </DropdownMenuItem>
                  {transfer.statut === 'en_attente' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-green-600"
                        onClick={() => handleApproveTransfer(transfer.id)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approuver
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleRejectTransfer(transfer.id)}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Rejeter
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger reçu
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </RicashTableCell>
        </RicashTableRow>
      ))}
    </RicashTableBody>
  </RicashTable>
</RicashTableCard>
```

## 🎨 **Améliorations du Design**

### **1. Layout et Espacement**
- **Background** : `bg-[#F4F2EE]` pour la cohérence avec Agents
- **Espacement** : `space-y-8` pour un espacement uniforme
- **Padding** : `p-6` pour un padding cohérent

### **2. Cartes de Statistiques**
- **7 cartes** au lieu de 5 pour plus de détails
- **Animations** : `transform hover:scale-105 transition-transform duration-300`
- **Couleurs** : Palette Ricash cohérente
- **Icônes** : Icônes Lucide React appropriées

### **3. Filtres Avancés**
- **5 filtres** : Recherche, Statut, Corridor, Agence, Canal
- **Layout** : `grid gap-4 md:grid-cols-2 lg:grid-cols-5`
- **Design** : `RicashCard` avec bordure et titre

### **4. Tableau Enrichi**
- **Colonnes** : Transaction, Expéditeur→Destinataire, Montant, Corridor, Statut, Agence/Agent, Actions
- **Icônes** : Icônes contextuelles pour chaque type d'information
- **Hover** : `hover:bg-[#376470]/5 transition-colors`
- **Status Badge** : `RicashStatusBadge` avec couleurs appropriées

## 🔧 **Fonctionnalités Préservées**

### **✅ Modals Intactes**
- **TransferDetailsModal** : Modal de détails des transferts
- **CreateTransferModal** : Modal de création de transferts
- **Handlers** : Tous les handlers de modals préservés

### **✅ Logique Métier**
- **Filtrage** : Logique de filtrage améliorée avec `useMemo`
- **Recherche** : Recherche dans ID, expéditeur, destinataire, code retrait
- **Actions** : Approuver, Rejeter, Voir détails, Télécharger reçu
- **États** : Gestion des états de chargement et d'erreur

### **✅ Navigation**
- **Routes** : Support des routes `/transfers/pending` et `/transfers/suspicious`
- **Contenu adaptatif** : Titre et description selon la route

## 📊 **Statistiques Enrichies**

### **Nouvelles Métriques**
```jsx
const stats = {
  total: transfers.length,
  completed: transfers.filter(t => t.statut === 'complete').length,
  pending: transfers.filter(t => t.statut === 'en_attente').length,
  suspicious: transfers.filter(t => t.statut === 'suspect').length,
  enCours: transfers.filter(t => t.statut === 'en_cours').length,        // ✅ NOUVEAU
  totalMontant: transfers.reduce((sum, t) => sum + (t.montant || 0), 0),
  revenusGeneres: transfers.reduce((sum, t) => sum + (t.frais || 0), 0), // ✅ NOUVEAU
  tauxReussite: Math.round((transfers.filter(t => t.statut === 'complete').length / transfers.length) * 100) // ✅ NOUVEAU
}
```

## 🎉 **Résultat Final**

### **✅ Cohérence Parfaite**
- **Design** : Identique à la page Agents
- **Composants** : Utilisation des composants Ricash
- **Couleurs** : Palette Ricash cohérente
- **Animations** : Transitions et effets identiques

### **✅ Fonctionnalités Améliorées**
- **7 cartes de statistiques** au lieu de 5
- **5 filtres avancés** au lieu de 3
- **Tableau enrichi** avec plus d'informations
- **Données structurées** avec objets complets

### **✅ Modals Préservées**
- **TransferDetailsModal** : Intacte et fonctionnelle
- **CreateTransferModal** : Intacte et fonctionnelle
- **Handlers** : Tous les handlers préservés

### **✅ Performance**
- **useMemo** : Optimisation du filtrage
- **useState** : Gestion d'état optimisée
- **Composants** : Composants Ricash optimisés

## 🚀 **Avantages de la Refactorisation**

### **1. Cohérence Visuelle**
- **Design uniforme** avec la page Agents
- **Palette de couleurs** Ricash cohérente
- **Animations** et transitions identiques

### **2. Expérience Utilisateur**
- **Interface moderne** et professionnelle
- **Navigation intuitive** avec filtres avancés
- **Feedback visuel** avec animations

### **3. Maintenabilité**
- **Composants réutilisables** Ricash
- **Code structuré** et organisé
- **Fonctions utilitaires** centralisées

### **4. Extensibilité**
- **Architecture modulaire** avec composants Ricash
- **Filtres configurables** facilement extensibles
- **Données structurées** pour futures fonctionnalités

**La refactorisation est maintenant complète et la page TransfersWithModals est parfaitement cohérente avec la page Agents !** ✨

