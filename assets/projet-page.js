/* Construit la fiche projet à partir de projets.js. Ordre de lecture pensé pour un collègue qui découvre :
   1. de quoi il s'agit (infos clés, présentation)   2. ce qu'il faut (ouvrage, matériaux, outils, EPI)
   3. comment faire (étapes avec ressources)          4. comment évaluer et préparer (grille, fiche péda, documents) */
(function(){
const id=new URLSearchParams(location.search).get('p');
const p=P.find(x=>x.id===id);
const $=s=>document.getElementById(s);
if(!p||!p.etapes){
  $('titre').textContent=p?p.t:"Projet introuvable";
  $('intro').textContent=p?p.court+" Ce projet est en préparation.":"Ce projet n'existe pas ou a changé d'adresse.";
  $('corps').innerHTML='<section style="padding-top:20px"><div class="wrap"><a class="go" href="index.html#ressources">Voir les ressources disponibles</a></div></section>';
  if(p) $('corps').insertAdjacentHTML('afterbegin',parcoursHTML(p));
  return;
}
const met=M.find(x=>x[0]===p.m);
document.title=p.t+" · L'habitat en SEGPA";
if(met){$('crumb').href="metier.html?m="+p.m;$('crumb').textContent="← "+met[1];}
$('kick').textContent="Projet d'atelier · "+(met?met[1]:"");
$('titre').textContent=p.t;
$('intro').textContent=p.intro;
const totalH=p.etapes.length;
$('facts').innerHTML=[["Classe",p.lv+(p.lvNote?` <small>(${esc(p.lvNote)})</small>`:"")],["Durée",esc(p.duree)],["Étapes",totalH+" étapes"],["Métier",esc(p.metiers.join(", "))],["Organisation",esc(p.orga)]]
  .map(([a,b])=>`<div><dt>${a}</dt><dd>${b}</dd></div>`).join("");

/* Schéma du mur : élévation à l'échelle, rangs décalés d'un demi-bloc */
function mur(){
  const L=152,R=4,bh=20,j=1,sc=4.2,W=L*sc,H=(R*(bh+j))*sc;let r="";
  for(let i=0;i<R;i++){
    const y=H-(i+1)*(bh+j)*sc;
    const parts=i%2===0?[50,50,50]:[24.5,50,50,24.5];let x=0;
    parts.forEach(w=>{r+=`<rect x="${x*sc}" y="${y}" width="${w*sc}" height="${bh*sc}" rx="3" class="${w<50?'demi':'bloc'}"/>`;x+=w+j;});
  }
  return `<svg viewBox="-30 -26 ${W+60} ${H+64}" role="img" aria-label="Vue de face du mur : 4 rangs de parpaings, joints croisés">
   ${r}
   <g class="cote"><path d="M0 ${H+18}H${W}M0 ${H+10}v16M${W} ${H+10}v16"/><text x="${W/2}" y="${H+36}">1,52 m</text></g>
   <g class="cote"><path d="M${W+16} 0V${H}M${W+8} 0h16M${W+8} ${H}h16"/><text x="${W+22}" y="${H/2}" transform="rotate(90 ${W+22} ${H/2})">0,84 m</text></g>
   <text class="lg" x="0" y="-10">Vue de face · 4 rangs · joints de 1 cm</text></svg>`;
}

function chipRes(x){
  return x.href?`<a class="res on" href="${x.href}"><b>${esc(x.k)}</b>${esc(x.t)}<span aria-hidden="true">→</span></a>`
              :`<span class="res"><b>${esc(x.k)}</b>${esc(x.t)}<i>en préparation</i></span>`;
}
const compTag=c=>{const k=COMPS[c];return k?`<span class="ct ${k[0]}">${esc(k[1])}</span>`:""};
const img=(path,alt)=>path?`<img src="img/${path.startsWith('epi')?'':'outils/'}${path}.jpg" alt="" loading="lazy">`:`<span class="noimg" aria-hidden="true">?</span>`;
const EPIN={chaussures:"Chaussures de sécurité",gants:"Gants",lunettes:"Lunettes",combinaison:"Tenue de travail",masque:"Masque",antibruit:"Anti-bruit",casque:"Casque",genouilleres:"Genouillères"};

/* Compétences du projet, regroupées par bloc */
const all=[...new Set(p.etapes.flatMap(e=>e.c))].filter(c=>COMPS[c]);
const blocs={metier:"Métier",secu:"Sécurité",socle:"Socle commun"};
const compsHTML=Object.entries(blocs).map(([b,n])=>{const L=all.filter(c=>COMPS[c][0]===b);return L.length?`<div class="cb"><h4><span class="dot ${b}"></span>${n}</h4><ul>${L.map(c=>`<li>${esc(COMPS[c][1])}</li>`).join("")}</ul></div>`:""}).join("");

$('corps').innerHTML=`
${parcoursHTML(p)}
<nav class="toc wrap" aria-label="Sommaire du projet">
  <a href="#fabrique">Ce qu'on fabrique</a><a href="#etapes">Les étapes</a><a href="#competences">Compétences</a><a href="#evaluation">Évaluation</a><a href="#prof">Pour le prof</a><a href="#documents">Documents</a>
</nav>

<section id="fabrique"><div class="wrap">
  <div class="sec-head"><div class="kicker">Ce qu'on fabrique</div><h2 class="h2s">L'ouvrage</h2></div>
  <div class="ouvr">
    <figure class="plan">${mur()}<figcaption>${esc(p.ouvrage.dims)}</figcaption></figure>
    <ul class="pts">${p.ouvrage.points.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
  </div>
  <div class="need">
    <div class="box"><h3>Matériaux</h3><ul class="mat">${p.materiaux.map(([a,b])=>`<li><span>${esc(a)}</span><small>${esc(b)}</small></li>`).join("")}</ul></div>
    <div class="box"><h3>Équipements de protection</h3><ul class="pics">${p.epi.map(e=>`<li>${img('epi/'+e)}<span>${esc(EPIN[e]||e)}</span></li>`).join("")}</ul></div>
  </div>
  <div class="box" style="margin-top:16px"><h3>Outils</h3><ul class="pics tools">${p.outils.map(([n,i])=>`<li>${img(i)}<span>${esc(n)}</span></li>`).join("")}</ul></div>
</div></section>

<section id="etapes" style="padding-top:20px"><div class="wrap">
  <div class="sec-head"><div class="kicker">Comment faire</div><h2 class="h2s">Les étapes, une par une</h2><p class="mute">Chaque étape donne l'objectif pour l'élève, le déroulé et les ressources à utiliser. Cliquez sur une étape pour l'ouvrir.</p></div>
  <ol class="steps-p">${p.etapes.map((e,i)=>`
    <li><details${i===0?" open":""}>
      <summary><span class="sn">${i+1}</span><span class="st"><b>${esc(e.t)}</b><small>${esc(e.h)} · ${esc(e.obj)}</small></span></summary>
      <div class="sb">
        <div><h4>Déroulé</h4><ol class="fa">${e.faire.map(x=>`<li>${esc(x)}</li>`).join("")}</ol>
        ${e.secu?`<p class="secu"><b>Sécurité</b>${esc(e.secu)}</p>`:""}</div>
        <div><h4>Ressources</h4><div class="rl">${e.res.map(chipRes).join("")}</div>
        <h4>Compétences travaillées</h4><div class="cts">${e.c.map(compTag).join("")}</div></div>
      </div>
    </details></li>`).join("")}
  </ol>
</div></section>

<section id="competences" style="padding-top:20px"><div class="wrap">
  <div class="sec-head"><div class="kicker">Compétences</div><h2 class="h2s">Ce que l'élève apprend</h2><p class="mute">Les mêmes compétences que dans <a href="suivi.html">Mon suivi</a> : vous pouvez les évaluer directement par élève.</p></div>
  <div class="cblocs">${compsHTML}</div>
</div></section>

<section id="evaluation" style="padding-top:20px"><div class="wrap">
  <div class="sec-head"><div class="kicker">Évaluation</div><h2 class="h2s">La grille de contrôle</h2><p class="mute">L'élève remplit la même grille en auto-évaluation avant le contrôle du prof.</p></div>
  <div class="tw"><table class="grille"><thead><tr><th>Critère</th><th>Ce qu'on vérifie</th><th>Attendu</th></tr></thead>
  <tbody>${p.eval.map(([a,b,c])=>`<tr><th>${esc(a)}</th><td>${esc(b)}</td><td>${esc(c)}</td></tr>`).join("")}</tbody></table></div>
</div></section>

<section id="prof" style="padding-top:20px"><div class="wrap">
  <div class="sec-head"><div class="kicker">Pour le prof</div><h2 class="h2s">Fiche pédagogique</h2></div>
  <div class="peda">
    ${[["Prérequis",p.peda.prerequis],["À prévoir",p.peda.besoin],["Points de vigilance",p.peda.vigilance],["Différencier",p.peda.diff]].map(([t,L])=>`<div class="box"><h3>${t}</h3><ul>${L.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`).join("")}
  </div>
</div></section>

<section id="documents" style="padding-top:20px"><div class="wrap">
  <div class="sec-head"><div class="kicker">Documents</div><h2 class="h2s">À télécharger</h2></div>
  <p class="mute">Le PDF s'imprime tel quel. Le Word se modifie pour l'adapter à votre atelier.</p>
  <ul class="dl-p">${p.docs.map(([n,f,pdfSeul,prof])=>{const l=(x,t)=>prof?`<a href="compte.html" data-prof="${x}" title="Réservé aux profs connectés">${ICO_LOCK}${t}</a>`:`<a href="${x}" download>${ICO_DL}${t}</a>`;
    return `<li${prof?' class="prof"':""}><b>${esc(n)}${prof?'<small>réservé aux profs connectés</small>':""}</b><span>${l(f+".pdf","PDF")}${pdfSeul?"":l(f+".docx","Word")}</span></li>`}).join("")}</ul>
</div></section>`;

function parcoursHTML(p){
  const pc=PARCOURS[p.parcours]; if(!pc) return "";
  return `<section class="pc-wrap"><div class="wrap"><div class="pc">
    <div class="pc-h"><b>${esc(pc.t)}</b><span>${esc(pc.d)}</span></div>
    <ol>${pc.etapes.map((k,i)=>{const q=P.find(x=>x.id===k);const cur=k===p.id;const ok=q&&q.etapes;
      const inner=`<span class="pn">${i+1}</span><span class="pt">${esc(q?q.t:k)}</span><small>${cur?"vous êtes ici":ok?"disponible":"en préparation"}</small>`;
      return `<li class="${cur?"cur":""} ${ok?"ok":""}">${ok&&!cur?`<a href="projet.html?p=${k}">${inner}</a>`:`<div>${inner}</div>`}</li>`}).join("")}</ol>
  </div></div></section>`;
}
})();
