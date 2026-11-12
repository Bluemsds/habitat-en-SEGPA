/* Données du site : UNE seule liste à tenir à jour. L'accueil et les pages métier se construisent à partir d'elle.

   Ajouter une ressource = ajouter une ligne dans R :
     t     titre                      d    description courte
     th    thème (Sécurité, Métiers, Projets)        lv   niveau (5e, 4e, 3e)
     m     clé du métier dans M (facultatif)
     url   page de l'activité, ou lien externe https (vidéo YouTube : ouvre un nouvel onglet) ; facultatif si la ressource n'a que des documents
           Sans url ni docs, la ressource est rangée dans « En préparation ».
     go    texte du bouton violet
     incl  ce qui est déjà inclus dans l'activité (texte simple, rien à télécharger)
     docs  fichiers à télécharger : [nom, format, chemin, "prof" si réservé aux profs connectés (chemin dans l'espace « prof » de Supabase)] ; un « Word » doit avoir son PDF au même nom (bouton PDF ajouté)
     prevu formats prévus, pour une ressource en préparation */
const R=[
 {t:"Qui construit la maison ?",d:"Séance Parcours Avenir : la maison en coupe, gros œuvre et second œuvre, tri des métiers, « Qui suis-je ? ».",th:"Métiers",lv:"5e",m:"parcours",url:"activites/qui-construit-la-maison.html",go:"Ouvrir le diaporama",type:"Diaporama TNI",incl:"Notes prof et trace écrite incluses dans le diaporama."},
 {t:"Tour du monde des bâtisseurs · Étape 1 : Lisbonne, le carreleur",d:"Un jour, un métier : on part au Portugal découvrir les azulejos et le carreleur. Billet d'embarquement, questions sur la vidéo, lecture, calculs, symétrie et passeport à lettre mystère.",th:"Métiers",lv:"5e",m:"parcours",type:"Un jour, un métier",url:"https://youtu.be/IYl1Tr91nZA",go:"Voir la vidéo (1 min)",docs:[["Fiche élève","Word","fiches/parcours/ujum-01-carreleur-portugal-fiche-eleve.docx"],["Corrigé et déroulé","Word","parcours/ujum-01-carreleur-portugal-corrige-prof.docx","prof"]]},
 {t:"Tour du monde des bâtisseurs · Étape 2 : Marrakech, le maçon",d:"Un jour, un métier : direction le Maroc, la ville rouge et ses remparts en pisé. Questions sur la vidéo, lecture, calculs, symétrie et passeport à lettre mystère.",th:"Métiers",lv:"5e",m:"parcours",type:"Un jour, un métier",url:"https://youtu.be/FaA9_xcMxzs",go:"Voir la vidéo (1 min)",docs:[["Fiche élève","Word","fiches/parcours/ujum-02-macon-maroc-fiche-eleve.docx"],["Corrigé et déroulé","Word","parcours/ujum-02-macon-maroc-corrige-prof.docx","prof"]]},
 {t:"Tour du monde des bâtisseurs · Étape 3 : Rome, le plombier",d:"Un jour, un métier : direction l'Italie, les aqueducs romains et l'origine du mot « plombier ». Questions sur la vidéo, lecture, calculs, symétrie et passeport à lettre mystère.",th:"Métiers",lv:"5e",m:"parcours",type:"Un jour, un métier",url:"https://youtu.be/CR7KS6yUlw8",go:"Voir la vidéo (1 min)",docs:[["Fiche élève","Word","fiches/parcours/ujum-03-plombier-italie-fiche-eleve.docx"],["Corrigé et déroulé","Word","parcours/ujum-03-plombier-italie-corrige-prof.docx","prof"]]},
{t:"Tour du monde des bâtisseurs · Étape 4 : Bergen, le charpentier",d:"Un jour, un métier : direction la Norvège, les maisons colorées du vieux port et les églises en bois debout. Questions sur la vidéo, lecture, calculs, symétrie et passeport à lettre mystère.",th:"Métiers",lv:"5e",m:"parcours",type:"Un jour, un métier",url:"https://youtu.be/TnkNSOT1XPI",go:"Voir la vidéo (1 min)",docs:[["Fiche élève","Word","fiches/parcours/ujum-04-charpentier-norvege-fiche-eleve.docx"],["Corrigé et déroulé","Word","parcours/ujum-04-charpentier-norvege-corrige-prof.docx","prof"]]},
 {t:"La fiche métier du carreleur",d:"Le métier expliqué aux élèves : étapes du travail, lieux, qualités, EPI, formation après la 3e. Avec un questionnaire et le corrigé.",th:"Métiers",lv:"4e",m:"carreleur",type:"Fiche métier",docs:[["Fiche métier élève","Word","fiches/carreleur/carreleur-fiche-metier.docx"],["Fiche métier avec corrigé","Word","carreleur/carreleur-fiche-metier-corrige.docx","prof"]]},
 {t:"Les outils du carreleur",d:"Découvrir 12 outils, leur usage et leur famille. Jeu « Quel outil pour… ? » au TNI.",th:"Métiers",lv:"4e",m:"carreleur",url:"activites/outils-carreleur.html",go:"Ouvrir l'activité",type:"Activité TNI",docs:[["Fiche élève","Word","fiches/carreleur/carreleur-outils-fiche-eleve.docx"],["Fiche prof et corrigé","Word","carreleur/carreleur-outils-fiche-prof.docx","prof"]]},
 {t:"Quel EPI pour quelle tâche ?",d:"Associer les équipements de protection à 5 situations d'atelier, avec correction immédiate.",th:"Sécurité",lv:"4e",url:"activites/epi.html",go:"Ouvrir l'activité",type:"Activité TNI",incl:"Correction intégrée à l'activité."},
 {t:"Le règlement de l'atelier",d:"Les règles en images et le contrat d'atelier à signer en début d'année.",th:"Sécurité",lv:"5e",prevu:"Diaporama TNI, fiche élève, contrat"},
 {t:"Repérer les situations dangereuses",d:"Photos de chantier : entourer les dangers et proposer une prévention.",th:"Sécurité",lv:"4e",prevu:"Activité TNI, fiche élève, corrigé"},
 {t:"Le bruit et les décibels",d:"Placer machines et sons sur l'échelle des décibels. Seuil de danger à 80 dB.",th:"Sécurité",lv:"3e",prevu:"Activité TNI, évaluation"},
 {t:"Carreleur : poser un panneau 40 × 40",d:"Préparer, tracer, encoller, poser avec croisillons, faire les joints, contrôler.",th:"Métiers",lv:"4e",m:"carreleur",prevu:"Fiche procédure, grille d'évaluation"},
 {t:"Peintre : préparer un support",d:"Rebouchage, ponçage, impression : ordre des opérations et outils.",th:"Métiers",lv:"4e",m:"peintre",prevu:"Fiche élève, fiche prof"},
 {t:"Monter un mur droit en parpaings",d:"Projet complet en 8 étapes : lire le plan, gâcher, poser au cordeau, croiser les joints, contrôler. Première étape du parcours maçonnerie.",th:"Projets",lv:"3e",m:"macon",url:"projet.html?p=mur-droit",go:"Voir le projet",type:"Projet",incl:"Étapes, ressources, compétences et fiche pédagogique sur la page.",docs:[["Dossier élève","Word","fiches/macon/mur-droit-dossier-eleve.docx"],["Fiche pédagogique et corrigé","Word","macon/mur-droit-fiche-peda.docx","prof"],["Grille d'évaluation","Word","fiches/macon/mur-droit-grille.docx"],["Plan coté du mur","PDF","fiches/macon/mur-droit-plan.pdf"]]},
 {t:"Monter un mur en angle avec un poteau",d:"Suite du mur droit : deux murs à 90° et un poteau.",th:"Projets",lv:"3e",m:"macon",prevu:"Fiche projet, dossier élève, grille"},
 {t:"Enduire et couvrir le mur",d:"Enduit dressé à la règle, puis chaperon pour protéger le dessus du mur.",th:"Projets",lv:"3e",m:"macon",prevu:"Fiche projet, dossier élève, grille"},
 {t:"Projet nichoir",d:"Du plan coté à la réalisation : débit, assemblage, finition, auto-évaluation.",th:"Projets",lv:"4e",m:"menuisier",prevu:"Dossier élève, fiche prof, grille"},
 {t:"Projet cloison en plaques de plâtre",d:"Un module de cloison avec ossature métallique et bandes.",th:"Projets",lv:"3e",m:"plaquiste",prevu:"Dossier élève, fiche prof, grille"},
 {t:"Projet maquette de maison",d:"Relier chaque partie de la maison au métier qui la construit.",th:"Projets",lv:"5e",m:"parcours",prevu:"Dossier élève, diaporama TNI"}
];

/* Métiers : clé, nom, phrase de présentation */
const M=[
 ["carreleur","Carreleur mosaïste","Il pose le carrelage, la faïence et la mosaïque sur les sols et les murs : il prépare le support, trace, coupe, colle et fait les joints."],
 ["macon","Maçon","Il construit les fondations, les murs et les dalles : c'est le gros œuvre, la structure de la maison."],
 ["peintre","Peintre","Il prépare les murs et les plafonds, puis applique la peinture et les revêtements. C'est lui qui donne la finition."],
 ["plaquiste","Plâtrier-plaquiste","Il monte les cloisons et les plafonds en plaques de plâtre, pose l'isolation et réalise les bandes."],
 ["menuisier","Menuisier","Il fabrique et pose les portes, les fenêtres, les placards et les escaliers, en bois ou en d'autres matériaux."],
 ["charpentier","Charpentier","Il fabrique et assemble la charpente, l'ossature qui porte le toit."],
 ["couvreur","Couvreur","Il pose la couverture du toit (tuiles, ardoises, zinc) et assure l'étanchéité."],
 ["plombier","Plombier","Il installe les canalisations d'eau, les sanitaires et le chauffage."],
 ["electricien","Électricien","Il installe les câbles, les prises, les éclairages et le tableau électrique, puis vérifie que tout est aux normes."],
 ["metallier","Métallier","Il fabrique et pose les ouvrages en métal : garde-corps, portails, escaliers, grilles."],
 ["dessin","Dessin technique","Lire un plan, coter, tracer : le langage commun à tous les métiers de l'habitat."],
 ["parcours","Parcours Avenir","Découvrir les métiers de l'habitat et commencer à réfléchir à son orientation."]
];

/* Une ressource est disponible si elle a une activité à ouvrir ou des documents à télécharger */
const dispo=r=>!!(r.url||r.docs);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const ICO_DL='<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M9 2v9m0 0L5.5 7.5M9 11l3.5-3.5M3 14.5h12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ICO_LOCK='<svg width="14" height="14" viewBox="0 0 22 22" aria-hidden="true"><rect x="4" y="10" width="14" height="10" rx="2" fill="currentColor"/><path d="M7 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
const ICO_PLAY='<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5v11l9-5.5z" fill="currentColor"/></svg>';

/* Carte d'une ressource disponible. Règle d'affichage : tout ce qui ressemble à un bouton ou à un lien se clique.
   base = préfixe des chemins ; num = numéro de séance (page métier). */
function carte(r,base="",num){
  /* Un document Word est toujours accompagné de son PDF (même nom, extension .pdf) : imprimer tel quel ou modifier.
     4e valeur "prof" : document rangé dans l'espace réservé (compte prof), chemin relatif à fiches/ */
  const lien=(h,f,prof)=>prof?`<a href="${base}compte.html" data-prof="${h}" title="Réservé aux profs connectés">${ICO_LOCK}${f}</a>`:`<a href="${base+h}" download>${ICO_DL}${f}</a>`;
  const docs=(r.docs||[]).map(([n,f,h,prof])=>`<li class="two${prof?" prof":""}"><span>${esc(n)}</span>${f==="Word"?lien(h.replace(/\.docx$/,".pdf"),"PDF",prof)+lien(h,"Word",prof):lien(h,esc(f),prof)}</li>`).join("");
  return `<article class="card live">
    <div class="meta">${num?`<span class="num">Séance ${num}</span>`:""}<span class="tg lv">${r.lv}</span><span class="tg">${esc(r.th)}</span><span class="tg">${esc(r.type)}</span></div>
    <h3>${esc(r.t)}</h3><p>${esc(r.d)}</p>
    ${r.url?(/^https?:/.test(r.url)?`<a class="go" href="${r.url}" target="_blank" rel="noopener">${ICO_PLAY}${esc(r.go)}</a>`:`<a class="go" href="${base+r.url}">${ICO_PLAY}${esc(r.go)}</a>`):""}
    ${r.incl?`<p class="incl">${esc(r.incl)}</p>`:""}
    ${docs?`<div class="docs"><div class="docs-t">À télécharger</div><ul>${docs}</ul></div>`:""}
  </article>`;
}
/* Liste compacte des ressources en préparation */
function aVenir(L){
  return `<ul class="soon-list">${L.map(r=>`<li><span class="tg">${r.lv}</span><b>${esc(r.t)}</b><small>${esc(r.th)} · prévu : ${esc(r.prevu.toLowerCase())}</small></li>`).join("")}</ul>`;
}
/* Cartes métier : cliquables dès qu'il y a au moins une ressource, disponible ou en préparation */
function cartesMetiers(courant){
  return M.map(([k,n])=>{
    const L=R.filter(r=>r.m===k), ok=L.filter(dispo).length, av=L.length-ok;
    if(!L.length) return `<div class="metier">${esc(n)}<small>à venir</small></div>`;
    const txt=[ok?`${ok} disponible${ok>1?"s":""}`:"",av?`${av} en préparation`:""].filter(Boolean).join(" · ");
    return `<a class="metier${ok?" on":""}" href="metier.html?m=${k}"${k===courant?' aria-current="page"':""}><span>${esc(n)}</span><small>${txt}</small></a>`;
  }).join("");
}
