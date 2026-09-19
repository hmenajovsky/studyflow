# StudyFlow

StudyFlow est une application pédagogique permettant de consulter des études cliniques et de gérer les inscriptions de participants.

Le projet sert de support aux ateliers de développement avec l'IA.

## Stack

* Next.js 14
* TypeScript
* Tailwind CSS
* Prisma 6
* SQLite
* npm

## Installation

Après avoir cloné le dépôt :

```bash
npm install
```

## Base de données

Le projet utilise SQLite avec Prisma.

Pour initialiser la base de données et charger les données de test :

```bash
npm run db:migrate
npm run db:seed
```

## Lancer l'application

Démarrer le serveur de développement :

```bash
npm run dev
```

Puis ouvrir :

http://localhost:3000

Si le port 3000 est déjà utilisé, Next.js proposera automatiquement un autre port. Utilisez alors l'adresse indiquée dans le terminal.

## Vérifications

Pour vérifier le code :

```bash
npm run lint
```

Pour construire l'application :

```bash
npm run build
```

> Pendant les ateliers, ne lancez pas systématiquement `npm run lint` ou `npm run build` après chaque modification. Ces commandes servent principalement aux vérifications finales.

## Structure

Les principaux éléments du projet sont :

* `app/` — pages et composants de l'application
* `prisma/schema.prisma` — modèle de données
* `prisma/migrations/` — migrations de la base de données
* `prisma/seed.ts` — données de test
* `public/` — fichiers statiques

## Données de test

La base de données contient des études, des participants et des inscriptions permettant de tester les principales fonctionnalités de l'application.
