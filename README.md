# RED OSINT

Prototype de site public OSINT en HTML/CSS/JavaScript, sans framework et sans coût d'hébergement obligatoire.

## Lancer en local
Ouvrir `index.html` dans un navigateur, ou lancer un serveur local :
```bash
python -m http.server 8000
```
Puis ouvrir `http://localhost:8000`.

## Publier gratuitement
- GitHub Pages : créer un dépôt, ajouter les fichiers et activer Pages dans Settings.
- Cloudflare Pages : importer le dépôt GitHub et choisir un déploiement statique.
Aucune étape de build n'est nécessaire.

## Fonctionnalités
- Recherche web générale sur un sujet non personnel.
- Annuaire officiel des entreprises françaises.
- Consultation RDAP de domaines et IP publiques via rdap.org.
- Guides vers les ressources officielles ANSSI, Cybermalveillance.gouv.fr et CNIL.
- Espace membre informatif : l'authentification n'est volontairement pas simulée.

## Confidentialité et limites
- Le site ne stocke pas les recherches et n'utilise pas de cookies ou d'analytics.
- Les recherches RDAP et les recherches web ouvrent un service tiers : le terme recherché lui est transmis. Ne jamais y saisir de donnée personnelle, secrète ou confidentielle.
- Ce prototype ne constitue pas un service d'enquête ni un moteur de personnes.
- Les validations côté navigateur sont une aide ergonomique, pas une barrière de sécurité.
- Les données d'enregistrement de domaines/IP peuvent être incomplètes, masquées ou inexactes. Vérifier les informations auprès des registres officiels.

## Comptes utilisateurs — avant mise en production
Ne jamais enregistrer des mots de passe dans `localStorage`, dans un fichier JSON ou directement dans le navigateur.
Pour activer les comptes :
1. Utiliser un fournisseur d'authentification hébergé (ex. Supabase Auth ou équivalent).
2. Activer la vérification d'adresse e-mail et la récupération sécurisée.
3. Activer la protection anti-abus et limiter les tentatives.
4. Configurer des règles d'accès côté serveur (RLS), jamais uniquement côté interface.
5. Collecter le minimum de données, définir une durée de conservation et publier une politique de confidentialité.
6. Prévoir une procédure de suppression de compte et de traitement des demandes RGPD.
7. Faire relire le traitement des données et les mentions légales avant ouverture au public.

## Règles de modération recommandées
Interdire les adresses privées, téléphones personnels, identifiants, données de connexion, documents d'identité, données de localisation personnelle, données fuitées et contenus visant à intimider ou harceler. Prévoir signalement, examen humain et retrait rapide.
