# AGENTS.md — studyflow-workshop-0

## Objectif

L'application permet de **consulter des études cliniques** et de **gérer l'inscription
de participants** à ces études.

Volontairement **simple**, elle sert de **support pédagogique** pour travailler avec
un agent IA de développement : le code reste minimal, compréhensible et didactique.

## Entités principales (modèle Prisma en place)

- **Étude clinique (Study)** — un essai clinique consultable : titre, description, statut
  (recrutement ouvert / fermé…), matériel pédagogique associé.
  Champs : `id`, `title`, `description`, `startDate`, `location`, `category`,
  `maxParticipants`, `createdAt`.
- **Participant (Participant)** — une personne enregistrée dans l'application.
  Champs : `id`, `name`, `email` (`@unique`), `createdAt`.
- **Inscription (Enrollment)** — lien entre un participant et une étude (`@unique`
  sur `studyId` + `participantId`). Champs : `id`, `studyId`, `participantId`, `status`,
  `createdAt`.
- Relations : `Study` 1―N `Enrollment`, `Participant` 1―N `Enrollment` (cascade à la suppression).
- **EnrollmentStatus** (`enum`) : `CONFIRMED` | `WAITLISTED`.

## Stack (à conserver)

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- ESLint (`next/core-web-vitals`)
- npm
- **Prisma 6** (SQLite), Client généré via `prisma-client-js`

## Structure

- `app/` — routes et pages (App Router à la racine, pas de dossier `src/`)
- `app/layout.tsx` — layout racine
- `app/page.tsx` — page d'accueil
- `app/globals.css` — styles globaux Tailwind
- `app/fonts/` — polices locales Geist
- `prisma/schema.prisma` — modèle de données (source de vérité)
- `prisma/migrations/` — migrations appliquées, ne pas modifier à la main
- `prisma/seed.ts` — données de test
- `.env` — `DATABASE_URL` (SQLite `file:./dev.db`, ne pas committer)
- `public/` — fichiers statiques (s'il est créé)
- `next.config.mjs`, `postcss.config.mjs`, `tailwind.config.ts`, `tsconfig.json` — configuration

## Conventions de code

- Composants React en **fonction composant** + hooks
- Composants serveur par défaut ; `"use client"` uniquement si nécessaire
- Imports via l'alias `@/*`
- Composants UI supplémentaires dans `app/` ou un dossier dédié (à définir)
- Pas d'import d'images distantes sans configuré `next.config.mjs`
- Tailwind via classes utilitaires ; pas de CSS custom sauf exceptions (`globals.css`)
- TypeScript strict : typer props et retours, éviter `any`

## À ne pas toucher (sans besoin explicite)

- `app/fonts/` — police Geist locale (suppression/renommage possible, mais à conserver par défaut)
- `package.json` — nom et version du projet
- `next.config.mjs`, `postcss.config.mjs`, `tailwind.config.ts` — configuration de base
- Versionnement : `next@14` et `prisma@6` ne doivent PAS être migrés vers des versions majeures supérieures sans validation
- `.gitignore` — ne pas y committer de secrets ni node_modules

## Base de données

- SQLite via Prisma 6 ; migrations dans `prisma/migrations/`.
- Le client doit être régénéré après modification du schéma : `npx prisma generate`
  (automatique avec `npm run db:migrate`).

## Vérification

- `npm run dev` — serveur de développement
- `npm run build` — build de production validant compile, lint et types
- `npm run lint` — lint ESLint
- `npm run db:migrate` (ou `npx prisma migrate dev`) — créer/appliquer une migration
- `npm run db:seed` — réinitialiser et recharger les données de test
- `npm run db:studio` — explorer la base avec Prisma Studio

## Environnement de développement

- Un serveur de développement est déjà lancé pour le projet.
- Ne lance pas `npm run dev` de ta propre initiative.
- Pour vérifier l'application, utilise le serveur existant.
- Ne démarre un autre serveur que sur demande explicite de l'utilisateur.