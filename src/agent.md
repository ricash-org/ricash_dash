# Conception du Frontend du Dashboard Admin Back-Office RiCash (v2)

**Document :** `agent.md`
**Auteur :** Manus AI
**Date :** 03 Novembre 2025
**Objectif :** Mettre à jour l'architecture technique et les spécifications de conception (UX/UI) pour la refonte du frontend du dashboard admin back-office du projet RiCash, en intégrant les nouvelles fonctionnalités demandées par le client.

## 1. Définition de la Stack Technique Frontend

La stack technique reste basée sur les recommandations initiales du CCT [1] pour assurer la cohérence et la performance.

| Composant | Technologie | Justification |
| :--- | :--- | :--- |
| **Framework Principal** | **React.js** | Framework robuste et basé sur des composants, idéal pour les applications complexes. |
| **Langage** | **TypeScript** | Améliore la maintenabilité et la détection d'erreurs. |
| **Gestion d'État** | **Redux Toolkit (RTK)** | Solution éprouvée pour la gestion d'état globale, avec **RTK Query** pour les appels API. |
| **Styling** | **TailwindCSS** | Framework CSS utilitaire pour un développement rapide et un design responsive. |
| **Composants UI** | **Headless UI / Radix UI** | Bibliothèques de composants non stylisés pour l'accessibilité et la réutilisabilité. |
| **Routage** | **React Router** | Solution standard pour la navigation au sein de l'application. |
| **Tests** | **Jest / React Testing Library** | Assure la qualité et la non-régression du code. |

## 2. Architecture Frontend (Micro-Frontend)

L'architecture **Micro-Frontend** est maintenue pour s'aligner sur l'architecture backend en Microservices.

| Élément | Description | Rôle |
| :--- | :--- | :--- |
| **Shell (Host)** | Application principale légère. | Gère le layout global, l'authentification et le routage. |
| **Micro-Frontends (Remotes)** | Applications autonomes par domaine métier. | **MF-Utilisateurs**, **MF-Transactions**, **MF-KYC**, **MF-Agents**, **MF-Reporting**, **MF-Fonds**. |
| **Design System** | Bibliothèque de composants UI partagés. | Assure la cohérence visuelle et fonctionnelle. |

## 3. Spécifications de Conception (UX/UI) - Mises à Jour

### 3.1. Page d'Authentification (Login)

Conformément à la nouvelle exigence, la page de connexion sera adaptée.

*   **Méthode d'Identification :** Le formulaire de connexion utilisera le **numéro de téléphone** comme identifiant principal, associé au mot de passe.
*   **Interface :** Le champ de saisie du téléphone inclura un sélecteur de pays et un masque de formatage pour guider l'utilisateur.
*   **Sécurité :** La logique de récupération de mot de passe via OTP (SMS) sera mise en avant.

### 3.2. Mises à Jour des Composants Clés

Le tableau suivant intègre les nouvelles fonctionnalités dans les composants existants.

| Composant | Rôle et Fonctionnalité (avec Mises à Jour) | Exigences Associées |
| :--- | :--- | :--- |
| **Tableaux de Données (Data Grids)** | Gestion des listes (Agents, Agences). Ajout d'un **composant `Toggle`** dans la colonne "Statut" pour permettre l'activation ou la désactivation rapide d'un compte agent/agence. | Toggle Agent/Agence |
| **Module de Vérification KYC** | Création d'une **page dédiée `admin/kyc-verification`** pour l'examen des documents et le changement de statut. Cette page remplacera un simple formulaire modal pour offrir une meilleure expérience. | Page dédiée KYC |

### 3.3. Nouvelles Pages et Fonctionnalités

Les fonctionnalités suivantes seront implémentées sous forme de nouvelles pages dédiées au sein de l'application.

#### 3.3.1. Gestion des Agents

*   **Page d'Inscription des Agents (`admin/agents/register`) :** Un formulaire complet permettant à un administrateur d'enregistrer un nouvel agent ou une nouvelle agence. Il inclura la saisie des informations de profil, les coordonnées et le téléversement des documents KYC initiaux.
*   **Page de Validation des Inscriptions (`admin/agents/pending-validation`) :** Un tableau de bord affichant la liste de tous les agents dont l'inscription est en attente. Chaque ligne permettra de naviguer vers la page de vérification KYC pour cet agent.

#### 3.3.2. Gestion des Fonds (Float)

Un nouveau Micro-Frontend, **MF-Fonds**, sera créé pour gérer ce périmètre.

*   **Page des Demandes de Fonds (`admin/fonds/requests`) :** Un tableau de bord (DataGrid) listant toutes les demandes de *float* émises par les agents. Les colonnes afficheront l'agent, le montant, la date et le statut (En attente, Acceptée, Rejetée). Des filtres permettront de trier par statut ou par agent.
*   **Page de Traitement d'une Demande (`admin/fonds/requests/:id`) :** Une vue détaillée accessible en cliquant sur une demande. Elle présentera les informations de l'agent, son solde actuel et l'historique de ses demandes. Des boutons "Accepter" et "Rejeter" (avec champ de motif) permettront à l'administrateur de traiter la demande, déclenchant les appels API correspondants.

## 4. Structure du Projet (Mise à Jour)

La structure du monorepo est mise à jour pour inclure le nouveau Micro-Frontend pour la gestion des fonds.

```
/ricash-admin-frontend
├── /apps
│   ├── /shell (Application Host)
│   ├── /mfe-users
│   ├── /mfe-transactions
│   ├── /mfe-kyc
│   ├── /mfe-agents
│   └── /mfe-fonds (NOUVEAU - Micro-Frontend Gestion des Fonds)
├── /packages
│   ├── /design-system
│   └── /api-client
└── package.json
```

## 5. Recommandations

Les recommandations initiales concernant l'**Atomic Design**, le **Code Splitting**, l'**Internationalisation (i18n)**, l'**Optimisation des Performances** et la **Documentation avec Storybook** restent valables et sont d'autant plus importantes avec l'ajout de ces nouvelles fonctionnalités.

---
**Références**
[1] CAHIER DES CHARGES TECHNIQUE – PROJET RICASH. (Document fourni par l'utilisateur).

## 6. Routage et Navigation

- **Espace Admin (Shell)**
  - `/admin` : tableau de bord global (cards KPI, liens rapides)
  - `/admin/login` : authentification (téléphone + mot de passe, OTP reset)
  - `/admin/profile` : profil administrateur et préférences

- **MF-Agents**
  - `/admin/agents` : liste des agents/agences (DataGrid + filtres)
  - `/admin/agents/register` : formulaire d’inscription (agent/agence)
  - `/admin/agents/pending-validation` : inscriptions en attente
  - `/admin/agents/:id` : fiche agent (détails, KYC, historique)

- **MF-KYC**
  - `/admin/kyc-verification` : hub de vérification (file + recherche)
  - `/admin/kyc/:id` : page dédiée de vérification d’un dossier (statuts, pièces, actions)

- **MF-Fonds**
  - `/admin/fonds/requests` : liste des demandes de float (filtres, export)
  - `/admin/fonds/requests/:id` : traitement d’une demande (accepter/rejeter + motif)

- **Règles de navigation**
  - Breadcrumbs systématiques (jusqu’à 3 niveaux max)
  - Conservation des filtres/l’état de pagination via query params
  - Protection de routes via Guard + redirection vers `/admin/login` si session expirée

## 7. Gestion d’État (Redux Toolkit) & RTK Query

- **Slices principaux**
  - `authSlice`: `user`, `roles`, `token`, `status`
  - `uiSlice`: `toasts`, `modals`, `theme`, `loadingOverlays`
  - `agentsSlice`: `filters`, `pagination`, `selection`, `lastUpdatedAt`
  - `kycSlice`: `queueFilters`, `currentCase`, `decisionDraft`
  - `fondsSlice`: `filters`, `pagination`, `currentRequest`, `decisionDraft`

- **API (RTK Query)**
  - `authApi`: `login`, `logout`, `refreshToken`, `requestOtp`, `resetPassword`
  - `agentsApi`: `listAgents`, `getAgent`, `createAgent`, `toggleAgentStatus`, `listPending`
  - `kycApi`: `listCases`, `getCase`, `updateStatus`, `uploadEvidence`
  - `fondsApi`: `listRequests`, `getRequest`, `approveRequest`, `rejectRequest`

- **Conventions**
  - Invalidation par tags: `['Auth','Agents','KYC','Fonds']`
  - Gestion d’erreurs centralisée via `baseQuery` + mapping code->message
  - Retrys exponentiels (max 3) pour erreurs réseau, jamais pour 4xx

## 8. Contrats API (extraits)

- **Authentification**
  - POST `/api/admin/auth/login`
    - Request: `{ phone: string, password: string }`
    - Response: `{ token: string, refreshToken: string, user: { id, name, roles } }`

- **Agents**
  - GET `/api/admin/agents?status&search&page&limit`
    - Response: `{ data: Agent[], page, total, pageSize }`
  - POST `/api/admin/agents`
    - Request: `{ type: 'AGENT'|'AGENCY', profile, contacts, kycInitDocs[] }`
    - Response: `{ id, ... }`
  - PATCH `/api/admin/agents/:id/toggle`
    - Request: `{ enabled: boolean, reason?: string }`
    - Response: `{ id, enabled, updatedAt }`
  - GET `/api/admin/agents/pending`
    - Response: `{ data: Agent[], page, total }`

- **KYC**
  - GET `/api/admin/kyc?status&agentId&page&limit`
  - GET `/api/admin/kyc/:id`
  - PATCH `/api/admin/kyc/:id/status`
    - Request: `{ status: 'APPROVED'|'REJECTED'|'MORE_INFO', comment?: string }`
    - Response: `{ id, status, decidedBy, decidedAt }`

- **Fonds (Float)**
  - GET `/api/admin/funds/requests?status&agentId&page&limit`
    - Response: `{ data: Request[], page, total }`
  - GET `/api/admin/funds/requests/:id`
  - POST `/api/admin/funds/requests/:id/approve`
    - Request: `{ note?: string }`
  - POST `/api/admin/funds/requests/:id/reject`
    - Request: `{ reason: string }`

## 9. UI: Structures & Composants

- **Design System**: `Button`, `Input`, `SelectCountryPhone`, `Toggle`, `Badge`, `Table`, `Modal`, `Drawer`, `Tabs`, `Toast`
- **DataGrid**: colonnes configurables, persistance largeur/ordre, sélection multiple, export CSV
- **Toggle statut**: accès rapide dans colonne `Statut`, confirmation si désactivation avec `reason` optionnel
- **KYC Page dédiée**: viewer documents, zoom, timeline événements, panneau décision
- **Fonds Détail**: carte agent, solde, historique demandes, actions primaires secondaires

## 10. Accès & Sécurité

- Rôles: `SUPER_ADMIN`, `KYC_ADMIN`, `FUNDS_ADMIN`, `VIEWER`
- Matrice d’accès:
  - Agents: `VIEW` (VIEWER+), `CREATE` (SUPER_ADMIN), `TOGGLE` (SUPER_ADMIN)
  - KYC: `VIEW` (KYC_ADMIN+), `DECIDE` (KYC_ADMIN+)
  - Fonds: `VIEW` (FUNDS_ADMIN+), `DECIDE` (FUNDS_ADMIN+)
- Journaux d’audit pour décisions KYC et fonds (qui, quand, quoi)

## 11. i18n, Thème & Accessibilité

- i18n: `fr` par défaut, structure prête pour `en`
- Thème: clair/sombre, tokens Tailwind via CSS variables
- A11y: focus-visible, rôles ARIA pour modals, contraste AA minimum

## 12. Tests & Qualité

- Unit: slices RTK, sélecteurs, utilitaires formatage
- Integration: composants critiques (Login, DataGrid, KYC, Fonds)
- E2E (option): scénarios clés (connexion, toggles statut, décision KYC, approbation fonds)
- Critères de performance: TTI < 2.5s sur réseau 3G rapide pour pages listes

## 13. Observabilité & Erreurs

- Tracking: événements d’usage (filtres, exports, décisions)
- Error boundary par MF + page fallback
- Notifications: mapping erreurs API -> toasts actionnables

## 14. Plan de Livraison (Phases)

1. Base Shell + Auth + DS minimal
2. MF-Agents (liste, register, pending + toggle)
3. MF-KYC (hub + détail + décisions)
4. MF-Fonds (liste + détail + décisions)
5. i18n, thèmes, optimisations perfs, Storybook

## 15. Critères d’Acceptation (extraits)

- Login: saisie téléphone avec sélecteur pays, masque dynamique, OTP reset opérationnel
- Agents: DataGrid avec filtres, pagination, export; toggle statut avec confirmation; création agent réussie
- KYC: page dédiée avec visualisation documents, changement de statut persistant et journalisé
- Fonds: liste filtrable, détail avec solde/historique, acceptation/rejet avec retour API et mise à jour immédiate

## 16. Risques & Points Ouverts

- Normalisation des formats de téléphone et gestion des indicatifs pays
- Volumétrie DataGrid (virtualisation, pagination serveur)
- Cohérence des statuts inter-domaines (Agents/KYC/Fonds)
