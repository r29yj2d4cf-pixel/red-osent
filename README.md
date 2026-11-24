# RED OSINT — moteur de recherche public

## Ce que fait cette version
- Recherche web générale : ouvre une recherche externe (Google).
- Entreprises françaises : interroge l'API ouverte Recherche d'entreprises de la DINUM.
- Domaines et IP publiques : interroge RDAP via rdap.org.
- Affichage filtré : les objets de contact RDAP ne sont jamais affichés; les résultats d'entreprises n'affichent pas les dirigeants ni les adresses détaillées.
- Aucun compte, cookie, historique ou stockage local dans cette version.

## Mise à jour sur GitHub
Dans le dépôt `red-osent` :
1. Code → Add file → Upload files.
2. Glisser les trois fichiers `index.html`, `styles.css`, `app.js` de ce dossier à la racine.
3. Accepter le remplacement des fichiers existants si GitHub le demande.
4. Cliquer `Commit changes`.
5. GitHub Pages redéploie automatiquement le site après quelques minutes.

## Limites importantes
Ce MVP interroge des sources externes à la demande; ce n'est pas un crawler ni un index web propriétaire. Les recherches web sont transmises au moteur externe. Les requêtes entreprises sont transmises à l'API publique de la DINUM; les requêtes domaine/IP sont transmises à rdap.org. Ne jamais saisir de données personnelles ou confidentielles. Les données publiques peuvent être incomplètes, masquées ou anciennes.

L'API Recherche d'entreprises est ouverte, avec des limites d'appels. Respecter les quotas et ne pas automatiser de collecte massive.
Sources :
- https://recherche-entreprises.api.gouv.fr/docs/
- https://rdap.org/
- https://annuaire-entreprises.data.gouv.fr/


## Vérification locale de ses propres informations
Le mode « Vérifier mes propres informations » affiche des conseils de protection. Le nom, le prénom et la date de naissance ne sont envoyés à aucun service externe et ne sont pas sauvegardés. Ce mode ne permet pas de rechercher ou profiler une autre personne.
