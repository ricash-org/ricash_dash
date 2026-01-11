# Charte Graphique - Ricash Dashboard

## 📋 Table des matières

1. [Palette de Couleurs](#palette-de-couleurs)
2. [Variables CSS](#variables-css)
3. [Thèmes (Clair & Sombre)](#thèmes-clair--sombre)
4. [Typographie](#typographie)
5. [Rayons de bordure](#rayons-de-bordure)
6. [Animations & Transitions](#animations--transitions)
7. [Commandes de lancement](#commandes-de-lancement)

---

## 🎨 Palette de Couleurs

### Couleurs Principales Ricash

La palette officielle de Ricash est définie dans `src/lib/palette.js` et `src/index.css`.

| Couleur | Nom | Code Hexadécimal | RGB | Usage Principal |
|---------|-----|------------------|-----|-----------------|
| **Bleu Foncé** | `bleuFonce` | `#29475B` | RGB(41, 71, 91) | Sidebar principale, titres |
| **Doré / Beige** | `dore` | `#B19068` | RGB(177, 144, 104) | Accents, hover, CTA principaux |
| **Turquoise** | `turquoise` | `#2B8286` | RGB(43, 130, 134) | Icônes actives, valeurs/KPIs |
| **Blanc Cassé** | `blancCasse` | `#F4F2EE` | RGB(244, 242, 238) | Fond global, texte sur fond sombre |
| **Bleu-Vert** | `bleuVert` | `#376470` | RGB(55, 100, 112) | Header, ombres douces |

### Variables CSS Ricash

Ces couleurs sont également disponibles sous forme de variables CSS :

```css
--ricash-blue-dark: #29475B;
--ricash-blue-green: #376470;
--ricash-turquoise: #2B8286;
--ricash-gold: #B19068;
--ricash-offwhite: #F4F2EE;
```

### Utilisation JavaScript

```javascript
import { RICASH_COLORS } from '@/lib/palette.js'

// Exemple d'utilisation
const primaryColor = RICASH_COLORS.bleuFonce; // #29475B
```

---

## 🎨 Variables CSS

### Couleurs Sémantiques

Le projet utilise un système de couleurs sémantiques basé sur HSL (Hue, Saturation, Lightness) pour le thème clair et sombre.

#### Thème Clair (`:root`)

| Variable | Valeur HSL | Usage |
|----------|------------|-------|
| `--background` | `0 0% 100%` | Fond principal de la page |
| `--foreground` | `222.2 84% 4.9%` | Texte principal |
| `--card` | `0 0% 100%` | Fond des cartes |
| `--card-foreground` | `222.2 84% 4.9%` | Texte sur cartes |
| `--primary` | `221.2 83.2% 53.3%` | Couleur primaire |
| `--primary-foreground` | `210 40% 98%` | Texte sur primaire |
| `--secondary` | `210 40% 96%` | Couleur secondaire |
| `--muted` | `210 40% 96%` | Éléments discrets |
| `--accent` | `210 40% 96%` | Accents |
| `--destructive` | `0 84.2% 60.2%` | Actions destructives |
| `--border` | `214.3 31.8% 91.4%` | Bordures |
| `--input` | `214.3 31.8% 91.4%` | Champs de saisie |

#### Variables Ricash Personnalisées

| Variable | Valeur (Thème Clair) | Valeur (Thème Sombre) |
|----------|---------------------|----------------------|
| `--sidebar-background` | `0 0% 98%` | `217.2 32.6% 15%` |
| `--sidebar-foreground` | `222.2 84% 4.9%` | `210 40% 98%` |
| `--header-background` | `0 0% 100%` | `222.2 84% 4.9%` |
| `--success` | `142.1 76.2% 36.3%` | `142.1 70.6% 45.3%` |
| `--warning` | `32.5 94.6% 43.7%` | `32.5 94.6% 63.7%` |
| `--info` | `221.2 83.2% 53.3%` | `217.2 91.2% 59.8%` |

---

## 🌓 Thèmes (Clair & Sombre)

Le projet supporte deux thèmes : **clair** et **sombre**.

### Thème Clair (Par défaut)

- **Fond principal** : Blanc cassé `#F4F2EE`
- **Sidebar** : Fond clair avec bleu foncé pour les éléments actifs
- **Header** : Bleu-vert `#376470` avec texte blanc cassé

### Thème Sombre (`.dark`)

- **Fond principal** : Bleu très foncé (proche de `#29475B`)
- **Sidebar** : Fond sombre avec turquoise pour les éléments actifs
- **Header** : Bleu foncé avec texte clair

### Classes Utilitaires Tailwind

Toutes les couleurs sont accessibles via des classes Tailwind :

```jsx
// Fond et texte
<div className="bg-background text-foreground">...</div>

// Cartes
<div className="bg-card text-card-foreground">...</div>

// Couleurs primaires
<button className="bg-primary text-primary-foreground">...</button>

// Couleurs secondaires
<div className="bg-secondary text-secondary-foreground">...</div>

// Éléments discrets
<div className="bg-muted text-muted-foreground">...</div>

// Accents
<div className="bg-accent text-accent-foreground">...</div>

// Actions destructives
<button className="bg-destructive text-destructive-foreground">...</button>

// Bordures
<div className="border-border">...</div>
```

### Classes Ricash Personnalisées

```jsx
// Sidebar
<div className="bg-sidebar text-sidebar-foreground">...</div>

// Header
<div className="bg-header">...</div>

// Statuts
<div className="bg-success text-success">...</div>
<div className="bg-warning text-warning">...</div>
<div className="bg-info text-info">...</div>
```

---

## ✍️ Typographie

### Police de caractères

Le projet utilise la police système native pour une meilleure performance et cohérence :

```css
font-family: system-ui, -apple-system, sans-serif;
```

- **system-ui** : Utilise la police système de l'OS (San Francisco sur macOS, Segoe UI sur Windows, etc.)
- **-apple-system** : Fallback pour les systèmes Apple
- **sans-serif** : Fallback générique

### Font Smoothing

```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

Ces propriétés améliorent le rendu des polices sur macOS et Linux.

---

## 📐 Rayons de bordure

Le projet utilise des rayons de bordure cohérents définis dans `App.css` :

| Variable | Valeur | Usage |
|----------|--------|-------|
| `--radius` | `0.5rem` (8px) | Rayon de base |
| `--radius-sm` | `calc(var(--radius) - 4px)` | Petits éléments |
| `--radius-md` | `calc(var(--radius) - 2px)` | Éléments moyens |
| `--radius-lg` | `var(--radius)` | Éléments grands |
| `--radius-xl` | `calc(var(--radius) + 4px)` | Très grands éléments |

### Guidelines UI/UX

- **Coins arrondis** : 8-12px pour les cartes et boutons
- **Effets visuels légers** : Ombres douces avec opacité 20% pour les cartes
- **Lisibilité optimale** : Fort contraste entre texte et fond

---

## 🎬 Animations & Transitions

### Transitions Globales

Toutes les interactions utilisent des transitions fluides :

```css
transition: background-color 0.3s ease, color 0.3s ease;
```

Pour les éléments interactifs (boutons, etc.) :

```css
transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
```

### Animations Keyframes

#### Spin (Rotation)
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```
Usage : Boutons de chargement

#### Animate In (Entrée)
```css
@keyframes animate-in {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
```
Usage : Modals, dropdowns, éléments qui apparaissent

#### Animate Out (Sortie)
```css
@keyframes animate-out {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}
```
Usage : Éléments qui disparaissent

### Classes Utilitaires

```jsx
<div className="animate-in">...</div>
<div className="animate-out">...</div>
<div className="animate-spin">...</div>
```

### Accessibilité

Le projet respecte les préférences utilisateur pour les animations réduites :

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📏 Variables OTP

Le projet définit des variables spécifiques pour les champs OTP :

| Variable | Valeur | Usage |
|----------|--------|-------|
| `--otp-size-sm` | `2.75rem` (44px) | Petite taille OTP |
| `--otp-size-md` | `3.5rem` (56px) | Taille moyenne OTP |
| `--otp-gap-sm` | `1.25rem` (20px) | Espacement petit |
| `--otp-gap-md` | `1.75rem` (28px) | Espacement moyen |

---

## 🎨 Guidelines d'Utilisation des Couleurs

### Sidebar

- **Fond principal** : Bleu Foncé `#29475B` (thème clair) / Fond sombre (thème sombre)
- **Icônes actives** : Turquoise `#2B8286`
- **Icônes inactives** : Blanc Cassé `#F4F2EE`
- **Hover & Sélection** : Doré/Beige `#B19068` avec léger effet d'ombre
- **Typographie** : Blanc Cassé pour les labels

### Header

- **Fond** : Bleu-Vert `#376470`
- **Texte & Icônes** : Blanc Cassé pour contraste
- **Éléments interactifs** : Turquoise en état actif, Doré/Beige en hover

### Dashboard Content

- **Fond global** : Blanc Cassé `#F4F2EE`
- **Cartes & Widgets** :
  - Fond : Blanc Cassé avec ombre douce bleu-vert `#37647033` (20% opacity)
  - Titres : Bleu Foncé `#29475B`
  - Valeurs/KPIs : Turquoise `#2B8286`
  - Actions : Doré/Beige pour CTA principal

### Tables & Listes

- **En-têtes** : Bleu Foncé, texte Blanc Cassé
- **Lignes alternées** : Blanc Cassé et Turquoise très clair (opacité 5%)
- **Hover ligne** : Fond Doré/Beige très doux

### Principes Généraux

- ✅ **Consistance chromatique** : Toujours utiliser les couleurs de la palette
- ✅ **Effets visuels légers** : Ombres douces, coins arrondis (radius 8-12px)
- ✅ **Lisibilité optimale** : Fort contraste entre texte et fond
- ✅ **Sensation premium** : Doré/Beige pour les accents, Turquoise pour la modernité

---

## 🚀 Commandes de lancement

Le projet utilise **Vite** comme outil de build et **pnpm** comme gestionnaire de paquets.

### Prérequis

- **Node.js** (version recommandée : 18+)
- **pnpm** (version : 10.4.1+)

### Installation des dépendances

Si c'est la première fois que vous clonez le projet :

```bash
pnpm install
```

### Commandes disponibles

#### Développement

```bash
pnpm dev
```

Lance le serveur de développement Vite. Le projet sera accessible à `http://localhost:5173` (ou un autre port si 5173 est occupé).

#### Build de production

```bash
pnpm build
```

Compile le projet pour la production. Les fichiers générés seront dans le dossier `dist/`.

#### Prévisualisation du build

```bash
pnpm preview
```

Lance un serveur local pour prévisualiser le build de production avant déploiement.

#### Linter

```bash
pnpm lint
```

Exécute ESLint pour vérifier la qualité du code.

### Commandes complètes

| Commande | Description |
|----------|-------------|
| `pnpm dev` | Lance le serveur de développement |
| `pnpm build` | Compile pour la production |
| `pnpm preview` | Prévisualise le build de production |
| `pnpm lint` | Exécute le linter |

---

## 📚 Ressources supplémentaires

- **Palette JavaScript** : `src/lib/palette.js`
- **Variables CSS globales** : `src/index.css`
- **Variables Tailwind** : `src/App.css`
- **Configuration UI** : `components.json` (shadcn/ui)

---

## 🎯 Notes importantes

- Toutes les couleurs sont disponibles via les classes Tailwind et les variables CSS
- Le système de thème supporte le mode clair et sombre automatiquement
- Les animations respectent les préférences d'accessibilité de l'utilisateur
- La palette Ricash doit être utilisée de manière cohérente dans tout le projet

---

**Dernière mise à jour** : Documentation générée automatiquement depuis le code source du projet.
