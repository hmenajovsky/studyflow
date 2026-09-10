# Analyse des données — cas de test

Objectif : vérifier la page d'analyse (`/studies/[id]/analyse`) et l'import CSV.

## Données de référence

- Étude : **« Évaluation d'un nouveau vaccin contre la grippe saisonnière »**
- Trois participants avec mesures importées via `npm run data:import -- prisma/measurements-sample.csv`
- Valeurs volontairement incohérentes : tension 345 mmHg (> 260) et fréquence 18 bpm (< 30) pour Nathan.

## Second jeu de données (atelier)

- Étude : **« Atelier : suivi des indices corporels »** (seed) + `npm run data:import -- prisma/measurements-workshop.csv`
- Métriques actives : `weight` (kg, plage **30–300**) et `height` (cm, plage **100–220**)
- Valeur incohérente : poids -4 kg (Julien) → signalée ; **donnée absente** : pas de ligne `height` pour Sofia → cellule « — ».

## Cas de test

| # | Cas | Résultat attendu |
|---|-----|------------------|
| 1 | Ouvrir la page d'analyse de l'étude vaccin | Tableau : 3 lignes participants ; indicateurs des métriques `systolic` et `heart_rate` ; graphique de la métrique la plus fournie. |
| 2 | Données saines (Camille, Léa) | Aucun signalement rouge ; TAS ~124/118, FC ~72/69. |
| 3 | Valeurs incohérentes (Nathan) | Cellules TAS 345 et FC 18 en rouge ; barres du graphique rouges ; compteur « X valeur(s) hors plage » dans la carte d'indicateurs. |
| 4 | Indicateurs avec incohérences | Les valeurs incohérentes **restent incluses** dans les calculs : moyenne TAS = (124+118+345)/3 ≈ 195,7 ; max = 345 ; écart type > 0. |
| 5 | Étude sans données (ex. « Étude de biodisponibilité… ») | Message « Aucune donnée de mesure pour cette étude » + rappel de la commande d'import. |
| 6 | Métrique manquante pour un participant | Cellule « — », la ligne est exclue des calculs de cette métrique uniquement. |
| 7 | Ré-import du CSV sans nouvelle ligne | Écart type inchangé (voir test fumée ci-dessous). |

## Cas liés à l'import

| # | Cas | Résultat attendu |
|---|-----|------------------|
| 8 | Ligne avec titre d'étude introuvable | Erreur listée « étude introuvable », **aucun** enregistrement inséré (tout-ou-rien). |
| 9 | Ligne avec e-mail d'un participant non inscrit à l'étude | Erreur « n'est pas inscrit(e) à … ». |
| 10 | Valeur non numérique ou colonne vide | Erreur « colonnes attendues ». |
| 11 | Séparateur `;`, virgule décimale (`118,5`), BOM UTF-8 (export Excel) | Valeur acceptée ; décimale convertie. |
| 12 | En-tête présent | Ligne d'en-tête ignorée (message affiché). |

## Test de fumée des fonctions statistiques

```bash
npx tsx -e "const {mean,min,max,standardDeviation}=require('./lib/statistics'); console.log({mean:mean([1,2,3]), min:min([1,2,3]), max:max([1,2,3]), sd:standardDeviation([10,10,10]), sd2:standardDeviation([1,2,3])})"
```

Résultats attendus : `mean 2`, `min 1`, `max 3`, `sd 0`, `sd2 1`.