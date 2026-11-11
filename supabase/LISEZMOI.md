# Mise en service de l'espace prof

Ces étapes ne se font qu'une fois. Les étapes 1 et 2 sont faites par David. Pour les étapes 3 à 6, Claude guide.

1. **Créer le projet Supabase.** Choisir une région dans l'Union européenne.
2. **Créer le compte GoatCounter.** Dans les réglages du site, cocher « Allow adding visitor counts on your website » : la page Statistiques en a besoin pour afficher le total des visites.
3. **Préparer la base.**
   - Dans Supabase, ouvrir SQL Editor, puis New query.
   - Coller `installation.sql`.
   - Remplacer `ADRESSE_ADMIN` par l'adresse de David.
   - Cliquer sur Run.
4. **Régler les connexions.** Dans Authentication, ouvrir URL Configuration et remplir :
   - Site URL : l'adresse du site, par exemple `https://bluemsds.github.io/habitat-en-SEGPA/`.
   - Redirect URLs : ajouter `https://bluemsds.github.io/habitat-en-SEGPA/compte.html`, puis la même adresse avec le futur nom de domaine.
5. **Déposer les documents prof.**
   - Dans Storage, ouvrir l'espace `prof`.
   - Y déposer les dossiers `carreleur/` et `macon/` avec leur contenu (PDF et Word).
   - Les chemins doivent correspondre à ceux des fiches, par exemple `carreleur/carreleur-outils-fiche-prof.pdf`.
6. **Brancher le site.** Remplir `CONFIG` en haut de `assets/compte.js` :
   - l'URL du projet ;
   - la clé anon public ;
   - le code GoatCounter.

## À ne jamais faire

- Ne jamais mettre la clé `service_role`, ni une autre clé secrète, dans le site.
- Ne jamais remettre un corrigé dans le dossier `fiches/` : ce dossier est public.

## Ajouter un document prof plus tard

1. Déposer le PDF et le Word dans l'espace `prof` de Supabase.
2. Dans `assets/site.js`, ajouter la ligne du document avec `"prof"` en 4e valeur, par exemple :
   `["Fiche prof et corrigé","Word","carreleur/carreleur-outils-fiche-prof.docx","prof"]`.
