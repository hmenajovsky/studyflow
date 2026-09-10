Nous allons préparer un exercice de debugging pour la User Story **« Rechercher et filtrer les études »**.

Je veux introduire volontairement un **bug fonctionnel réaliste** dans l’implémentation actuelle.

Le comportement attendu est le suivant :

* l’utilisateur peut rechercher une étude par son titre ;
* il peut filtrer les études selon leur période de début ;
* avec le filtre **« Cette semaine »**, seules les études dont la date de début appartient à la semaine en cours doivent être affichées ;
* avec le filtre **« Ce mois »**, seules les études dont la date de début appartient au mois en cours doivent être affichées ;
* la recherche et le filtre peuvent être utilisés simultanément.

Introduis le bug fonctionnel suivant :

**Le filtre « Cette semaine » affiche également au moins une étude dont la date de début est située en dehors de la semaine en cours.**

Le bug doit être reproductible et suffisamment subtil pour nécessiter une investigation.

Contraintes :

* préserver le reste du fonctionnement de l’US2 ;
* ne pas casser la recherche par titre ;
* ne pas modifier le filtre « Ce mois » sauf si cela est strictement nécessaire pour introduire le bug ;
* ne modifier aucune autre User Story ;
* ne pas modifier inutilement l’architecture ;
* effectuer uniquement les changements nécessaires pour introduire ce bug ;
* vérifier que le bug est bien reproductible dans l’application ;
* **ne corrige pas le bug**.

À la fin, indique :

* les fichiers modifiés ;
* comment reproduire précisément le bug ;
* le comportement attendu et le comportement observé ;
* comment revenir à l’état précédent.

Ne révèle pas la cause technique du bug dans le scénario destiné aux participants.
