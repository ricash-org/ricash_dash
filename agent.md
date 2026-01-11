# Ricash – Cahier des charges technique (synthèse et guide d’implémentation)

Document: agent.md
Auteur: Manus AI
Date: 03 Novembre 2025

## 1) Objectif global

Mettre en place Ricash, une plateforme de transfert et de paiement accessible via:
- Réseau d’agents physiques
- Application mobile (Android/iOS)
- Interfaces web (clients, agents, administrateurs)

Cibles fonctionnelles clés:
- Transferts (cash-to-cash, mobile, web)
- Paiements (marchand, factures)
- Dépôts/retraits chez agents
- Sécurité, traçabilité, scalabilité, haute disponibilité

## 2) Architecture générale (Microservices sur AWS)

- Paradigme: Microservices, communication via REST + Event Bus (SNS/SQS ou Kafka)
- Entrée: API Gateway (AWS API Gateway) + Auth (AWS Cognito ou Keycloak)
- Orchestration: ECS/Fargate ou EKS (Kubernetes)
- Stockage: PostgreSQL (RDS), DynamoDB (accès rapides clef-valeur), S3 (fichiers)
- Messagerie: SNS/SQS (ou Kafka MSK) pour traitements asynchrones
- Observabilité: CloudWatch (logs/metrics), X-Ray (traces), Grafana/Metabase (reporting)
- Sécurité: WAF + Shield, Secrets Manager, KMS (chiffrement), IAM fine-grained

Schéma logique haut-niveau:
- Clients (Mobile, Web) -> API Gateway -> Services (Auth, Utilisateurs/KYC, Agents/Float, Wallet/Ledger, Transferts/Paiements, Notifications, Compliance/AML, Administration) -> Data stores (RDS/DynamoDB/S3) -> Event bus (SNS/SQS/Kafka)

## 3) Services (rôles, technos, API)

3.1 Authentification & Sécurité (Java/Spring Boot)
- JWT + refresh tokens, RBAC, MFA/OTP (SMS/Email)
- Intégrations: AWS Cognito ou Keycloak
- API: /auth/login (phone+otp ou email+pwd), /auth/refresh, /auth/logout, /auth/otp/request

3.2 Utilisateurs & KYC (Node.js/NestJS)
- Profils (clients/agents), stockage documents sur S3
- OCR ou intégration KYC (Onfido/Smile Identity)
- API: /users, /kyc (charge, statut, validation)

3.3 Agents & Float (Node.js)
- Gestion agents, activation, soldes float, commissions
- Tableau de bord agent (web)
- API: /agents, /float (requêtes, validation, historique)

3.4 Wallet & Ledger (Go)
- Comptes virtuels, débit/crédit, soldes temps réel
- Ledger immuable (audit), éventuellement Event Sourcing/CQRS
- API: /wallets, /ledger (mouvements)

3.5 Transfert & Paiement (Node.js/NestJS)
- Envoi/réception, code retrait (PIN/QR), paiements marchands
- Double validation (OTP client + confirmation agent)
- API: /transfers, /payments, webhooks

3.6 Notifications (Python/FastAPI)
- SMS/Email/WhatsApp, templates multilingues
- File de messages pour fiabilité (SQS/RabbitMQ)
- API: /notify (SMS, Email), workers asynchrones

3.7 Compliance & AML (Python/FastAPI)
- Détection transactions suspectes, règles (plafonds/volumes/géo)
- Alertes temps réel, rapports périodiques
- API: /aml/rules, /aml/alerts, /aml/reports

3.8 Administration (Back-Office) (Frontend React + Backend Node)
- Dashboard global, KYC, réconciliation, exports
- API: /admin/* (agrégations, reporting, gestion)

3.9 Intégrations (connecteurs) (Node.js)
- Orange Money, MTN MoMo, Airtel Money, banques (virements)
- Auth: OAuth2/HMAC
- API: /integrations/* (drivers encapsulés)

## 4) Interfaces utilisateurs

4.1 Mobile (Client) – Flutter (Android/iOS)
- Onboarding, dépôt/retrait/transfert, QR paiements, historique
- Push notifications, support/messagerie

4.2 Web Agent – React + TailwindCSS
- Enregistrement client, opérations, gestion du float
- Historique, impression/partage de reçus

4.3 Web Admin (Back-Office) – React + TailwindCSS
- Tableau de bord, gestion utilisateurs/agents/transactions/KYC
- Monitoring temps réel, exports CSV/PDF

## 5) Données principales (PostgreSQL + S3 + DynamoDB)

- Relations RDS (PostgreSQL): users, agents, wallets, transactions, commissions, kyc_documents, audit_logs
- Ledger: tables append-only (immutables) + vues matérialisées lecture
- Stockage fichiers: S3 (documents KYC, reçus)
- Caching/lecture rapide: Redis (solde, sessions), DynamoDB (métadonnées à accès intensif)

Invariants clés:
- Toute opération critique journalisée (ledger immuable)
- Idempotence des écritures (clé de déduplication via messages/commandes)
- Référentiels protégés via contraintes/transactions

## 6) Sécurité

- TLS partout, WAF + DDoS Shield, rate limiting API Gateway
- MFA/OTP, RBAC (rôles: client, agent, admin), principe du moindre privilège
- Chiffrement au repos (KMS) et en transit; AES‑256 pour données sensibles applicatives
- Sécrets dans Secrets Manager, rotation des clés
- Journaux d’audit signés, horodatés

## 7) Performance & Scalabilité

- Conteneurs (ECS/EKS) avec autoscaling horizontal
- Caches (Redis), files asynchrones (SQS/Kafka)
- SLOs cibles: p95 API < 300ms (lecture), p95 < 800ms (écriture), uptime ≥ 99.9%
- Tests charge & chaos (Gatling/k6 + fault injection)

## 8) Livrables

- Microservices backend (OpenAPI/Swagger par service)
- Frontend web (Agent, Admin) + Mobile (Flutter)
- Documentation technique (API, déploiement, sécurité)
- Guides utilisateurs (agent, admin)
- Environnements AWS: DEV, STAGING, PROD

## 9) DevOps, CI/CD & Environnements

- CI: GitHub Actions (build, tests, lint, SCA)
- CD: GitHub Actions -> ECR -> ECS/EKS (blue/green ou canary)
- Infra as Code: Terraform (réseaux, RDS, S3, IAM, ECS/EKS, API Gateway, WAF)
- Observabilité: CloudWatch metrics/logs + alarms, X-Ray, dashboards Grafana/Metabase
- Sécurité pipeline: scans SAST/DAST, policies IaC, image scanning (Trivy)

Environnements:
- DEV: déploiement rapide, logs verbeux, données mock
- STAGING: mirroring PROD (sans données sensibles), tests e2e
- PROD: durci (WAF, quotas, sauvegardes, rotation clés)

## 10) Modèle de données (extraits, conceptuel)

- users(id, type, phone/email, kyc_level, status, created_at)
- agents(id, user_id FK, agency_ref, float_balance, status)
- wallets(id, owner_type, owner_id, currency, balance_cached)
- transactions(id, type, amount, currency, from_wallet, to_wallet, status, created_at)
- ledger_entries(id, transaction_id, account, debit, credit, created_at, immutable_flag)
- kyc_documents(id, user_id, type, s3_key, status, checked_by, checked_at)
- audit_logs(id, actor, action, entity, payload_hash, created_at)

Notes:
- ledger_entries: append-only; hash chaîne possible (Merkle/chainage) pour audit renforcé
- balances: source de vérité = somme ledger; balance_cached cohérente via événements

## 11) Frontend: design système & UX clés

- Stack: React 19, React Router 7, TailwindCSS 4, Radix UI, sonner
- Palette Ricash: bleu foncé (#29475B), bleu‑vert (#376470), turquoise (#2B8286), doré (#B19068), blanc cassé (#F4F2EE)
- Accessibilité: focus-visible, contrastes AA, aria-* sur composants interactifs
- Composants: Button, Input, SelectCountryPhone, Toggle, Badge, Table, Modal, Drawer, Tabs, Toast

Login (Admin/Agent) – OTP par téléphone:
- Flux: entrer téléphone -> clic « Se connecter » => envoi OTP + affichage champ OTP (4 chiffres) -> validation
- OTP UI: 4 cases 14–16px (responsive), inter-case gap-5/md:gap-7, anneau focus turquoise, message d’aide, bouton « Coller », renvoi code + timer
- Erreurs: messages clairs, état bordure rouge + aria-live

Admin – routes principales (exemples):
- /app/dashboard, /app/users, /app/agents, /app/transfers, /app/reports, /app/funds/approval, /app/funds/approval/:id, /app/users/kyc/:id

DataGrids:
- Pagination serveur, filtres persistés (query params), export CSV
- Toggle statut en ligne (confirmations sur désactivation)

## 12) API (contrats résumés)

Auth:
- POST /auth/login { phone+otp | email+password } -> { tokens, user }
- POST /auth/otp/request { phone } -> { success }
- POST /auth/refresh -> { tokens }

Agents & Float:
- GET /agents?status&search&page&limit -> { data, page, total }
- PATCH /agents/:id/toggle { enabled, reason? } -> { id, enabled }
- GET /float/requests -> { data }
- POST /float/requests/:id/approve { note? }
- POST /float/requests/:id/reject { reason }

KYC:
- GET /kyc?status&userId&page&limit
- GET /kyc/:id -> { dossier, documents }
- PATCH /kyc/:id/status { status, comment? }

Transferts/Payments:
- POST /transfers { from, to, amount, channel }
- POST /withdrawals/code { amount, receiver } -> { pin|qr }
- POST /payments { payer, merchant, amount }

## 13) Sécurité applicative & conformité

- MFA/OTP pour opérations sensibles (ex: retraits, montants élevés)
- Journaux d’audit inviolables pour décisions KYC, fonds, suspensions
- Politique de rétention journaux + masquage PII
- DLP minimal (empêcher exfiltration logs sensibles)

## 14) Plan de livraison (phases)

1. Base infra + Auth + Observabilité minimale
2. Wallet/Ledger + Transferts fondamentaux
3. Agents/Float + Admin (listes, décisions)
4. KYC complet + Compliance/AML (règles de base)
5. Intégrations paiements et opérateurs
6. Optimisations perfs/sécurité, audits, documentation finale

## 15) Tests & Qualité

- Unitaires par service; contrats API (tests OpenAPI)
- Intégration: flux critiques (transferts, OTP, KYC, float)
- E2E: Cypress/Playwright (Web), Flutter tests (Mobile)
- Non-fonctionnels: charge, résilience, sécurité (SAST/DAST), accessibilité

---
Références
- Cahier des charges fourni (extraits inclus)
- Normes internes de sécurité et qualité Ricash

