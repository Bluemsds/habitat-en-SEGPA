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

/* Schémas des ouvrages, un par projet (clé = p.schema, sinon p.id). Sans schéma : image p.ouvrage.img, ou rien. */
const SCHEMAS={"mur-droit":mur,"mur-angle":murAngle,"enduit":enduit,"panneau-carreleur":panneau,"nichoir":nichoir};
function figOuvrage(){
  const f=SCHEMAS[p.schema||p.id];
  const art=f?f():(p.ouvrage.img?`<img src="${p.ouvrage.img}" alt="${esc(p.ouvrage.alt||p.t)}" loading="lazy">`:"");
  return art?`<figure class="plan">${art}<figcaption>${esc(p.ouvrage.dims)}</figcaption></figure>`:`<p class="plan-txt"><b>${esc(p.ouvrage.dims)}</b></p>`;
}

/* Mur d'angle : vue de dessus, poteau 20 × 20 dans l'angle, deux ailes de 1,22 m extérieur */
function murAngle(){
  const sc=3.6,P=20,e=15,A=101,j=1,T=(P+j+A)*sc;
  const x0=0,y0=0;
  return `<svg viewBox="-40 -30 ${T+90} ${T+80}" role="img" aria-label="Vue de dessus du mur d'angle : poteau dans l'angle, deux ailes à 90 degrés">
   <rect x="${x0}" y="${y0}" width="${P*sc}" height="${P*sc}" class="demi" rx="2"/>
   <text class="lg" x="${P*sc/2}" y="${P*sc/2+4}" style="font-size:11px;text-anchor:middle">poteau</text>
   <rect x="${(P+j)*sc}" y="0" width="${50*sc}" height="${e*sc}" class="bloc" rx="2"/><rect x="${(P+j+51)*sc}" y="0" width="${50*sc}" height="${e*sc}" class="bloc" rx="2"/>
   <rect x="0" y="${(P+j)*sc}" width="${e*sc}" height="${50*sc}" class="bloc" rx="2"/><rect x="0" y="${(P+j+51)*sc}" width="${e*sc}" height="${50*sc}" class="bloc" rx="2"/>
   <g class="cote"><path d="M0 -14H${T}M0 -22v16M${T} -22v16"/><text x="${T/2}" y="-20">1,22 m</text></g>
   <g class="cote"><path d="M-14 0V${T}M-22 0h16M-22 ${T}h16"/><text x="-24" y="${T/2}" transform="rotate(-90 -24 ${T/2})">1,22 m</text></g>
   <path d="M${e*sc+18} ${e*sc+18}h26M${e*sc+18} ${e*sc+18}v26" stroke="#8E44C9" stroke-width="2" fill="none"/><text class="lg" x="${e*sc+50}" y="${e*sc+50}">90°</text>
   <text class="lg" x="${(P+12)*sc}" y="${T*0.55}">Vue de dessus · rang 1</text>
   <text class="lg" x="${(P+12)*sc}" y="${T*0.55+22}" style="font-size:13px">Rangs 2 et 4 : demi-bloc contre le poteau,</text>
   <text class="lg" x="${(P+12)*sc}" y="${T*0.55+40}" style="font-size:13px">les joints sont croisés.</text></svg>`;
}
/* Enduit et chaperon : coupe verticale du haut du mur (schéma, épaisseurs exagérées) */
function enduit(){
  return `<svg viewBox="0 0 560 330" role="img" aria-label="Coupe du mur : enduit en deux couches sur une face, chaperon à deux pentes sur le dessus">
   <rect x="160" y="110" width="90" height="180" class="bloc"/>
   <rect x="250" y="110" width="16" height="180" fill="#E3C8F2" stroke="#5B5466" stroke-width="2"/>
   <rect x="266" y="110" width="7" height="180" fill="#F7E7C9" stroke="#5B5466" stroke-width="2"/>
   <rect x="160" y="100" width="90" height="10" fill="#C9C4CF" stroke="#5B5466" stroke-width="1.5"/>
   <path d="M135 100 L205 62 L285 100 L285 108 L135 108 Z" fill="#9C93A8" stroke="#5B5466" stroke-width="2"/>
   <path d="M143 108v8M277 108v8" stroke="#5B5466" stroke-width="3"/>
   <g class="cote"><path d="M270 160H340"/><text x="348" y="166" style="text-anchor:start">finition 5 mm</text></g>
   <g class="cote"><path d="M258 220H340"/><text x="348" y="226" style="text-anchor:start">corps d'enduit 15 mm</text></g>
   <g class="cote"><path d="M285 104H340"/><text x="348" y="110" style="text-anchor:start">chaperon 2 pentes</text></g>
   <g class="cote"><path d="M143 116 L100 150"/><text x="90" y="170">goutte d'eau</text></g>
   <g class="cote"><path d="M160 105 H110"/><text x="70" y="98">lit 1 cm</text></g>
   <g class="cote"><path d="M160 304H250M160 296v16M250 296v16"/><text x="205" y="326">mur 15 cm</text></g></svg>`;
}
/* Panneau 50 × 50 : calepinage depuis les deux axes, carreaux 10 × 10, joints 2 mm, coupes de 4,5 cm */
function panneau(){
  const sc=7,L=50;const pos=[[0,4.5],[4.7,10],[14.9,10],[25.1,10],[35.3,10],[45.5,4.5]];let r="";
  pos.forEach(([x,w])=>pos.forEach(([y,h])=>{const cut=w<10||h<10;r+=`<rect x="${x*sc}" y="${y*sc}" width="${w*sc}" height="${h*sc}" class="${cut?'demi':'bloc'}" rx="1.5"/>`}));
  const c=L/2*sc;
  return `<svg viewBox="-30 -34 ${L*sc+70} ${L*sc+74}" role="img" aria-label="Calepinage du panneau 50 par 50 : 16 carreaux entiers au centre, coupes de 4,5 cm sur le pourtour">
   <rect x="0" y="0" width="${L*sc}" height="${L*sc}" fill="#8A8193"/>${r}
   <path d="M${c} -8V${L*sc+8}M-8 ${c}H${L*sc+8}" stroke="#E07A1F" stroke-width="2" stroke-dasharray="8 5"/>
   <g class="cote"><path d="M0 -14H${L*sc}M0 -22v16M${L*sc} -22v16"/><text x="${c}" y="-20">50 cm</text></g>
   <g class="cote"><path d="M${L*sc+16} 0V${4.5*sc}M${L*sc+8} 0h16M${L*sc+8} ${4.5*sc}h16"/><text x="${L*sc+28}" y="${2.25*sc+6}" style="text-anchor:start">4,5</text></g>
   <text class="lg" x="0" y="${L*sc+28}">Axes en orange · gris : 16 entiers · mauve : coupes</text></svg>`;
}
/* Nichoir : vue de face cotée (mm) */
function nichoir(){
  const sc=1.1,W=145,F=220,D=330,ox=40,oy=30;
  const fy=oy+D*sc-80*sc-F*sc+20;
  return `<svg viewBox="0 0 ${W*sc+250} ${D*sc+130}" role="img" aria-label="Vue de face du nichoir : façade 145 par 220 mm, trou de 28 mm, dos qui dépasse en bas pour la fixation">
   <rect x="${ox}" y="${fy+F*sc-250*sc}" width="${W*sc}" height="${330*sc}" fill="#E8D3B0" stroke="#5B5466" stroke-width="2"/>
   <rect x="${ox}" y="${fy}" width="${W*sc}" height="${F*sc}" fill="#D9BC8C" stroke="#5B5466" stroke-width="2"/>
   <rect x="${ox-6}" y="${fy-(30+18)*sc}" width="${W*sc+12}" height="${(30+18)*sc}" fill="#9C93A8" stroke="#5B5466" stroke-width="2"/><text class="lg" x="${ox+W*sc/2}" y="${fy-20*sc}" style="text-anchor:middle;fill:#fff;font-size:13px">toit (ouvrable)</text>
   <circle cx="${ox+W*sc/2}" cy="${fy+F*sc-170*sc}" r="${14*sc}" fill="#2B2733"/>
   <circle cx="${ox+W*sc/2}" cy="${fy+F*sc+40*sc}" r="4" fill="#5B5466"/>
   <g class="cote"><path d="M${ox} ${fy+F*sc+96}H${ox+W*sc}M${ox} ${fy+F*sc+88}v16M${ox+W*sc} ${fy+F*sc+88}v16"/><text x="${ox+W*sc/2}" y="${fy+F*sc+118}">145</text></g>
   <g class="cote"><path d="M${ox+W*sc+18} ${fy}V${fy+F*sc}M${ox+W*sc+10} ${fy}h16M${ox+W*sc+10} ${fy+F*sc}h16"/><text x="${ox+W*sc+30}" y="${fy+F*sc/2}" style="text-anchor:start">220</text></g>
   <g class="cote"><path d="M${ox+W*sc/2+16*sc} ${fy+F*sc-170*sc}H${ox+W*sc+60}"/><text x="${ox+W*sc+68}" y="${fy+F*sc-170*sc+6}" style="text-anchor:start">Ø 28</text></g>
   <g class="cote"><path d="M${ox+W*sc+18} ${fy+F*sc}V${fy+F*sc+80*sc}M${ox+W*sc+10} ${fy+F*sc+80*sc}h16"/><text x="${ox+W*sc+30}" y="${fy+F*sc+50}" style="text-anchor:start">dos : +80 pour fixer</text></g>
   <text class="lg" x="${ox}" y="18">Vue de face · cotes en mm</text></svg>`;
}
/* Schéma du mur droit : élévation à l'échelle, rangs décalés d'un demi-bloc */
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
    ${figOuvrage()}
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
