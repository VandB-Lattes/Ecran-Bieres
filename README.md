# Écran bières pression · V and B Lattes

Affichage dynamique des 12 tireuses du V and B Montpellier Lattes, hébergé sur GitHub Pages.

- **Écran** : la carte pour la TV (drapeaux animés, fond animé, happy hour automatique, par défaut tous les jours de 17h à 19h).
- **Gestion** : recherche d'une bière par son nom (catalogue vandb.fr complet), choix de la tireuse, prix 33 cl / 50 cl, grilles de prix, 6 bières en happy hour, horaires et jours du happy hour.

## Mise en ligne (une seule fois)

1. Sur GitHub, ouvrez le dépôt › **Settings › Pages**.
   Source : **Deploy from a branch**, branche `main`, dossier `/ (root)`. Enregistrez.
2. Au bout d'une minute, le site est à l'adresse
   `https://<votre-compte>.github.io/<nom-du-depot>/`.
3. **Sur la TV** : ouvrez cette adresse, puis le bouton **Plein écran (TV)**.
   La TV relit la carte chaque minute, aucun compte n'est nécessaire.

## Accès staff

L'onglet **Gestion** est protégé par un identifiant et un mot de passe :

| Identifiant | Mot de passe |
|---|---|
| `staff` | `HappyHour-17h19` |

Cochez « Rester connecté sur cet appareil » sur le téléphone ou l'ordinateur du bar pour ne pas le retaper.
Le mot de passe se change dans **Gestion › Accès staff et GitHub** (en bas de la page).

## Configuration une seule fois (responsable)

Pour que la Gestion puisse envoyer la carte à la TV, il faut un jeton GitHub. Il est enregistré **chiffré avec le mot de passe staff** dans `data/acces.json` : le staff n'a jamais besoin de le connaître.

1. GitHub › photo de profil › **Settings › Developer settings › Personal access tokens › Fine-grained tokens › Generate new token**.
2. *Repository access* : **Only select repositories** › ce dépôt.
3. *Permissions* › **Contents : Read and write** et **Actions : Read and write** (pour le bouton de mise à jour du catalogue). Choisissez une date d'expiration, puis générez.
4. Sur le site : **Gestion**, connectez-vous (`staff` / `HappyHour-17h19`), ouvrez **Accès staff et GitHub** en bas de la page.
5. Saisissez le mot de passe actuel, collez le jeton, et si vous voulez un nouveau mot de passe, tapez-le deux fois. Cliquez **Enregistrer l'accès**.

Ensuite, n'importe quel appareil se connecte avec l'identifiant et le mot de passe, sans jeton. **Enregistrer et afficher** met la TV à jour en 1 à 2 minutes (le temps que GitHub Pages republie).

Quand le jeton expire, refaites les étapes 1 à 5 avec un nouveau jeton.

Sans jeton, le bouton **Télécharger carte.json** donne le fichier à déposer à la main dans `data/` sur GitHub.

## Catalogue des bières

`data/catalogue.json` contient le catalogue de https://www.vandb.fr/biere (50 pages). Pour le mettre à jour :

- dans **Gestion**, bouton **Mettre à jour le catalogue depuis vandb.fr** (2 à 4 minutes, le résultat s'affiche dans la page) ;
- automatiquement chaque lundi matin ;
- ou dans GitHub : onglet **Actions › Catalogue V and B › Run workflow**.

Les bières de la carte actuelle (avec leurs descriptions et prix) sont aussi intégrées dans la page.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | L'application (écran + gestion) |
| `data/carte.json` | La carte affichée : 12 tireuses, prix, happy hour, grilles de prix |
| `data/catalogue.json` | Catalogue V and B pour la recherche |
| `data/acces.json` | Accès staff : mot de passe vérifié et jeton GitHub chiffrés |
| `assets/logo.png` | Logo V and B |
| `scripts/scrape-vandb.mjs` | Lecture du catalogue sur vandb.fr |
| `.github/workflows/catalogue.yml` | Mise à jour hebdomadaire du catalogue |
