/* Données du site : UNE seule liste à tenir à jour. L'accueil et les pages métier se construisent à partir d'elle.

   Ajouter une ressource = ajouter une ligne dans R :
     t     titre                      d    description courte
     th    thème (Sécurité, Métiers, Projets)        lv   niveau (5e, 4e, 3e)
     m     clé du métier dans M (facultatif)
     url   page de l'activité. Sans url, la ressource est rangée dans « En préparation ».
     go    texte du bouton violet
     incl  ce qui est déjà inclus dans l'activité (texte simple, rien à télécharger)
     docs  fichiers à télécharger : [nom, format, chemin]
     prevu formats prévus, pour une ressource en préparation */
const R=[
 {t:"Qui construit la maison ?",d:"Séance Parcours Avenir : la maison en coupe, gros œuvre et second œuvre, tri des métiers, « Qui suis-je ? ».",th:"Métiers",lv:"5e",m:"parcours",url:"activites/qui-construit-la-maison.html",go:"Ouvrir le diaporama",type:"Diaporama TNI",incl:"Notes prof et trace écrite incluses dans le diaporama."},
 {t:"Les outils du carreleur",d:"Découvrir 12 outils, leur usage et leur famille. Jeu « Quel outil pour… ? » au TNI.",th:"Métiers",lv:"4e",m:"carreleur",url:"activites/outils-carreleur.html",go:"Ouvrir l'activité",type:"Activité TNI",docs:[["Fiche élève","Word","fiches/carreleur/carreleur-outils-fiche-eleve.docx"],["Fiche prof et corrigé","Word","fiches/carreleur/carreleur-outils-fiche-prof.docx"]]},
 {t:"Quel EPI pour quelle tâche ?",d:"Associer les équipements de protection à 5 situations d'atelier, avec correction immédiate.",th:"Sécurité",lv:"4e",url:"activites/epi.html",go:"Ouvrir l'activité",type:"Activité TNI",incl:"Correction intégrée à l'activité."},
 {t:"Le règlement de l'atelier",d:"Les règles en images et le contrat d'atelier à signer en début d'année.",th:"Sécurité",lv:"5e",prevu:"Diaporama TNI, fiche élève, contrat"},
 {t:"Repérer les situations dangereuses",d:"Photos de chantier : entourer les dangers et proposer une prévention.",th:"Sécurité",lv:"4e",prevu:"Activité TNI, fiche élève, corrigé"},
 {t:"Le bruit et les décibels",d:"Placer machines et sons sur l'échelle des décibels. Seuil de danger à 80 dB.",th:"Sécurité",lv:"3e",prevu:"Activité TNI, évaluation"},
 {t:"Carreleur : poser un panneau 40 × 40",d:"Préparer, tracer, encoller, poser avec croisillons, faire les joints, contrôler.",th:"Métiers",lv:"4e",m:"carreleur",prevu:"Fiche procédure, grille d'évaluation"},
 {t:"Peintre : préparer un support",d:"Rebouchage, ponçage, impression : ordre des opérations et outils.",th:"Métiers",lv:"4e",m:"peintre",prevu:"Fiche élève, fiche prof"},
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

const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const ICO_DL='<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M9 2v9m0 0L5.5 7.5M9 11l3.5-3.5M3 14.5h12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ICO_PLAY='<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5v11l9-5.5z" fill="currentColor"/></svg>';

/* Carte d'une ressource disponible. Règle d'affichage : tout ce qui ressemble à un bouton ou à un lien se clique.
   base = préfixe des chemins ; num = numéro de séance (page métier). */
function carte(r,base="",num){
  const docs=(r.docs||[]).map(([n,f,h])=>`<li><a href="${base+h}" download>${ICO_DL}<span>${esc(n)}</span><small>${esc(f)}</small></a></li>`).join("");
  return `<article class="card live">
    <div class="meta">${num?`<span class="num">Séance ${num}</span>`:""}<span class="tg lv">${r.lv}</span><span class="tg">${esc(r.th)}</span><span class="tg">${esc(r.type)}</span></div>
    <h3>${esc(r.t)}</h3><p>${esc(r.d)}</p>
    <a class="go" href="${base+r.url}">${ICO_PLAY}${esc(r.go)}</a>
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
    const L=R.filter(r=>r.m===k), ok=L.filter(r=>r.url).length, av=L.length-ok;
    if(!L.length) return `<div class="metier">${esc(n)}<small>à venir</small></div>`;
    const txt=[ok?`${ok} disponible${ok>1?"s":""}`:"",av?`${av} en préparation`:""].filter(Boolean).join(" · ");
    return `<a class="metier${ok?" on":""}" href="metier.html?m=${k}"${k===courant?' aria-current="page"':""}><span>${esc(n)}</span><small>${txt}</small></a>`;
  }).join("");
}
