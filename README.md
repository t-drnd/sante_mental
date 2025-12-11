# Application de Santé Mentale

Une application complète de suivi de santé mentale construite avec Next.js, permettant de consigner son humeur quotidienne, suivre sa productivité, pratiquer la méditation et générer des rapports hebdomadaires.

## Fonctionnalités

### 📝 Journal quotidien

- Consignation de l'humeur sur une échelle de 1 à 10
- Enregistrement des émotions principales
- Notes textuelles sur votre état
- Historique des entrées

### ✅ Suivi de productivité

- Création et gestion de tâches
- Suivi du temps passé
- Priorisation des tâches (basse, moyenne, haute)
- Statistiques de complétion

### 🧘 Méditation

- Timer de méditation intégré
- Différents types de méditation (guidée, silencieuse, respiration, etc.)
- Historique des sessions
- Suivi du temps total de méditation

### 📈 Rapports hebdomadaires

- Génération automatique de rapports
- Graphiques d'évolution de l'humeur
- Statistiques de productivité et méditation
- Insights et recommandations personnalisées

## Technologies utilisées

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Prisma** (ORM)
- **Better Auth** (authentification)
- **PostgreSQL** (base de données via Docker)
- **Recharts** (graphiques)
- **date-fns** (manipulation de dates)
- **Zod** (validation)

## Installation

1. Clonez le repository

```bash
git clone <repository-url>
cd sante_mental
```

2. Installez les dépendances

```bash
npm install
```

3. Démarrez PostgreSQL avec Docker

```bash
docker-compose up -d
```

4. Configurez les variables d'environnement
   Créez un fichier `.env` à la racine du projet :

```env
DATABASE_URL="postgresql://sante_mental:sante_mental_password@localhost:5432/sante_mental?schema=public"
BETTER_AUTH_SECRET="votre-secret-key-changez-en-production"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
```

5. Initialisez la base de données

```bash
npx prisma generate
npx prisma migrate dev
```

6. Lancez le serveur de développement

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## Structure du projet

```
sante_mental/
├── app/                    # Pages Next.js (App Router)
│   ├── (auth)/            # Routes d'authentification
│   ├── (dashboard)/       # Routes protégées
│   └── api/               # API routes
├── components/            # Composants React
│   ├── ui/                # Composants UI de base
│   ├── journal/           # Composants journal
│   ├── productivite/      # Composants productivité
│   ├── meditation/        # Composants méditation
│   └── rapports/          # Composants rapports
├── lib/                   # Utilitaires et configuration
├── prisma/                # Schéma et migrations Prisma
└── types/                 # Types TypeScript
```

## Utilisation

1. **Inscription/Connexion** : Créez un compte ou connectez-vous
2. **Dashboard** : Vue d'ensemble de votre état actuel
3. **Journal** : Enregistrez votre humeur quotidienne
4. **Productivité** : Gérez vos tâches et suivez votre productivité
5. **Méditation** : Pratiquez la méditation avec le timer intégré
6. **Rapports** : Consultez vos rapports hebdomadaires avec graphiques et statistiques

## Développement

### Commandes disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Compile l'application pour la production
- `npm run start` - Lance le serveur de production
- `npm run lint` - Vérifie le code avec ESLint

### Base de données

**Docker Commands:**

```bash
# Démarrer PostgreSQL
docker-compose up -d

# Arrêter PostgreSQL
docker-compose down

# Voir les logs
docker-compose logs -f postgres

# Redémarrer PostgreSQL
docker-compose restart postgres
```

**Prisma Commands:**

```bash
# Visualiser la base de données
npx prisma studio

# Créer une nouvelle migration
npx prisma migrate dev --name nom-de-la-migration

# Réinitialiser la base de données (ATTENTION: supprime toutes les données)
npx prisma migrate reset
```

## Notes

- L'application est conçue pour être mobile-first et responsive
- Toutes les routes du dashboard sont protégées et nécessitent une authentification
- Les rapports hebdomadaires sont générés automatiquement à la première consultation

## Licence

MIT
