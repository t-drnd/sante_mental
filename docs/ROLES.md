# Système de Rôles et Permissions

## Rôles disponibles

### 👤 User (Utilisateur)

- \*\*par défaut pour tous les nouveaux utilisateurs
- Peut accéder à son propre profil
- Peut modifier son propre profil
- Accès limité à ses propres données

### 👑 Admin (Administrateur)

- Accès complet à toutes les fonctionnalités
- Peut voir tous les utilisateurs
- Peut modifier/supprimer tous les utilisateurs
- Accès au panneau d'administration

## Création du compte admin

Pour créer le compte admin initial, exécutez :

```bash
pnpm db:create-admin
```

Par défaut, les identifiants sont :

- **Email** : `admin@example.com`
- **Mot de passe** : `admin123`

Vous pouvez personnaliser ces valeurs dans votre fichier `.env` :

```env
ADMIN_EMAIL="votre-email@example.com"
ADMIN_PASSWORD="votre-mot-de-passe-securise"
ADMIN_NAME="Votre Nom"
```

⚠️ **Important** : Changez le mot de passe après la première connexion !

## Utilisation du middleware

### Protéger une route nécessitant une authentification

```typescript
import { requireAuth } from "@/lib/middleware";

export default async function MyPage() {
  const session = await requireAuth();
  // L'utilisateur est authentifié
  return <div>Bienvenue {session.user.email}</div>;
}
```

### Protéger une route nécessitant le rôle admin

```typescript
import { requireRole } from "@/lib/middleware";

export default async function AdminPage() {
  const { session, role } = await requireRole("admin");
  // Seuls les admins peuvent accéder à cette page
  return <div>Panneau admin</div>;
}
```

### Vérifier l'accès à une ressource

```typescript
import { requireResourceAccess } from "@/lib/middleware";

export default async function UserResourcePage({
  params,
}: {
  params: { id: string };
}) {
  const { session } = await requireResourceAccess(
    parseInt(params.id), // ID du propriétaire de la ressource
    session.user.id // ID de l'utilisateur connecté
  );
  // L'utilisateur peut accéder à cette ressource
}
```

## Vérification des permissions

```typescript
import { getPermissions, hasRole } from "@/lib/permissions";

// Obtenir les permissions d'un rôle
const permissions = getPermissions("admin");
// permissions.canViewAllUsers === true
// permissions.canEditAllUsers === true

// Vérifier si un utilisateur a un rôle spécifique
if (hasRole(userRole, "admin")) {
  // L'utilisateur est admin
}
```

## Pages disponibles

- `/dashboard/profile` - Page de profil (accessible à tous les utilisateurs authentifiés)
- `/dashboard/admin` - Panneau d'administration (accessible uniquement aux admins)


Middleware de/middleware.ts : - requireAuth() : protège les routes nécessitant une authentification - requireRole() : protège les routes nécessitant un rôle spécifique - requireResourceAccess() : vérifie l'accès à une ressource5. Pages créées : - /dashboard/admin : panneau d'administration (admin uniquement) - /dashboard/profile : page de profil (tous les utilisateurs authentifiés)6. Scripts ajoutés : - pnpm db:create-admin : créer un compte admin - pnpm db:migrate : appliquer les migrations - pnpm db:generate : générer les migrations### Permissions**Rôle User** : - Peut voir/modifier son propre profil - Accès limité à ses propres données**Rôle Admin** : - Accès complet à toutes les fonctionnalités - Peut voir tous les utilisateurs - Peut modifier/supprimer tous les utilisateurs - Accès au panneau d'administration### Prochaines étapes1. Connectez-vous avec le compte admin (admin@example.com / admin123) 2. Changez le mot de passe après la première connexion 3. Utilisez les middlewares dans vos routes pour protéger les pages selon les rôlesDocumentation complète disponible dans docs/ROLES.md.
