# Écran bières pression · V and B Lattes

Affichage dynamique des 12 tireuses du V and B Montpellier Lattes, hébergé sur GitHub Pages.

- **Écran** : la carte pour la TV (drapeaux animés, fond animé, happy hour automatique, par défaut tous les jours de 17h à 19h).
- **Gestion** : recherche d'une bière par son nom (catalogue vandb.fr complet), choix de la tireuse, prix 33 cl / 50 cl, grilles de prix, 6 bières en happy hour, horaires et jours du happy hour.

## Mise en ligne (une seule fois)

1. Sur GitHub, ouvrez le dépôt › **Settings › Pages**.
   Source : **Deploy from a branch**, branche `main`, dossier `/ (root)`. Enregistrez.
2. Au bout d'une minute, le site est à l'adresse
   `https://<votre-compte>.github.io/<nom-du-depot>/`.
3. **Sur la TV** : ouvrez cette adresse **en ajoutant `#ecran` à la fin** (ex. `https://<compte>.github.io/<depot>/#ecran`). Un clic n'importe où sur l'écran passe en plein écran ; si quelqu'un en sort, le clic suivant y revient.

Chaque appareil retient ensuite son mode :

| Appareil | Ce qui s'ouvre |
|---|---|
| TV (ouverte une fois avec `#ecran`) | la carte seule, plein écran, sans onglet ni connexion — même si le lien perd son `#ecran` |
| Téléphone, ordinateur | la Gestion (connexion demandée) |

Pour repasser un appareil en Gestion, ouvrez-y le lien avec `#gestion` à la fin.

## Accès staff

L'onglet **Gestion** est protégé par un identifiant et un mot de passe.

| Identifiant | Mot de passe |
|---|---|
| `staff` | transmis au responsable, hors de ce fichier |

Cochez « Rester connecté sur cet appareil » sur le téléphone ou l'ordinateur du bar pour ne pas le retaper.
Le mot de passe se change dans **Gestion › Accès staff et GitHub** (en bas de la page).

**La TV n'a aucun identifiant à saisir** : elle ouvre le lien terminé par `#ecran` et n'affiche que la carte.

## Jeton GitHub

Le jeton qui permet d'envoyer la carte à la TV est déjà enregistré, **chiffré avec le mot de passe staff**, dans `data/acces.json`. Le staff n'a donc jamais à le connaître ni à le saisir : il se connecte simplement avec l'identifiant et le mot de passe, depuis n'importe quel appareil.

> **Important** : ce dépôt est public (GitHub Pages l'exige). Le jeton n'est lisible qu'avec le mot de passe staff, donc **ce mot de passe ne doit jamais être écrit dans ce dépôt**, ni dans ce README, ni dans un commit.

Quand le jeton expire, ou pour le remplacer :

1. GitHub › photo de profil › **Settings › Developer settings › Personal access tokens › Fine-grained tokens › Generate new token**.
2. *Repository access* : **Only select repositories** › ce dépôt.
3. *Permissions* › **Contents : Read and write** et **Actions : Read and write** (pour le bouton de mise à jour du catalogue).
4. Sur le site : **Gestion**, connectez-vous, ouvrez **Accès staff et GitHub** en bas de la page.
5. Saisissez le mot de passe actuel, collez le nouveau jeton, puis cliquez **Enregistrer l'accès**.

**Enregistrer et afficher** met la TV à jour en 1 à 2 minutes (le temps que GitHub Pages republie).

Sans jeton valide, le bouton **Télécharger carte.json** donne le fichier à déposer à la main dans `data/` sur GitHub.

## Fonds animés et fêtes

Dans **Gestion › Écran › Fond animé** : 5 fonds habituels (Classique, Soirée disco, Mousse, Nuit étoilée, Vagues de Lattes), un mode **Aléatoire**, et 16 fonds de fêtes.

Avec la case **« Passer automatiquement au fond de la fête du moment »** (cochée par défaut), la TV affiche seule le fond de la fête aux dates suivantes, puis revient au fond choisi :

| Fête | Période affichée |
|---|---|
| Réveillon du Nouvel An | 30 décembre → 1er janvier |
| Saint-Valentin | 10 → 14 février |
| Saint-Patrick | 14 → 17 mars |
| Poisson d'avril | 1er avril |
| Pâques | jeudi → lundi de Pâques (calculé chaque année) |
| Fête des Mères | 3 jours avant → dernier dimanche de mai (1er dimanche de juin si Pentecôte) |
| Fête des Pères | 3 jours avant → 3e dimanche de juin |
| Fête de la Musique | 20 → 21 juin |
| 14 juillet | 12 → 14 juillet |
| Oktoberfest | dates de Munich (mi-septembre → début octobre) |
| Halloween | 25 → 31 octobre |
| Beaujolais Nouveau | 3e jeudi de novembre → dimanche |
| Noël | 1er → 26 décembre |

**Fête de l'Apéro**, **Football (Euro / Coupe du monde)** et **Tour de France** n'ont pas de date fixe : choisissez-les dans la liste pendant l'événement.

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
