# Configuration du projet

## Génération du token secret

Pour générer un token secret sécurisé pour l'authentification JWT, tu peux utiliser une des méthodes suivantes :

### Méthode 1 : Node.js

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Méthode 2 : OpenSSL

```bash
openssl rand -hex 32
```

### Méthode 3 : En ligne

Tu peux aussi utiliser un générateur en ligne comme https://generate-secret.vercel.app/32

Une fois le token généré, ajoute-le dans ton fichier `.env` :

```
BETTER_AUTH_SECRET=ton_token_genere_ici
```

## Configuration de la base de données

1. Copie le fichier `ENV.example` vers `.env`
2. Configure `DATABASE_URL` avec tes identifiants PostgreSQL
3. Lance Docker : `docker-compose up -d`
4. Crée les tables : `npm run db:migrate`
5. Crée le compte admin : `npm run db:create-admin`

## Variables d'environnement

- `DATABASE_URL` : URL de connexion PostgreSQL
- `BETTER_AUTH_SECRET` : Token secret pour JWT (généré avec une des méthodes ci-dessus)
- `ADMIN_EMAIL` : Email du compte admin
- `ADMIN_PASSWORD` : Mot de passe du compte admin
- `ADMIN_NAME` : Nom du compte admin
