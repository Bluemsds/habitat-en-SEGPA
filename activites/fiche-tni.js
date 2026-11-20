(function(){
"use strict";
const IMG='../img/';
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const nb=s=>s.replace(/ ([?!:;»])/g,' $1').replace(/« /g,'« ');

/* CONTENU : voir fiches-tni.js (window.FICHES), choisi par <body data-m="..."> */
const F=window.FICHES[document.body.dataset.m];
const DIAPOS=composer(F);

/* Compose les diapos à partir du contenu d'un métier */
function composer(F){
  const COL=['c-bleu','c-jaune','c-encre','c-rouge'];
  const D=[{type:'couv'}];
  D.push({type:'grille',n:'01',rub:'Le métier en une phrase',q:F.objets.q||'D’après vous, que fait '+F.un+' ?',aide:F.objets.aide,cls:'g-objets',ncol:F.objets.items.length,
    items:F.objets.items.map((h,j)=>({c:COL[j%4],idx:'0'+(j+1),h:h,fil:String(j+1)})).concat([{cl:'large',lab:'La phrase à retenir',html:'<div class="phrase">'+F.phrase+'</div><div class="famille">'+F.famille+'</div>'}])});
  D.push({type:'focus',n:'02',rub:'Ce qu’il fait, étape par étape',q:F.etapes.q||'D’après vous, par quoi commence '+F.le+' ? Et ensuite ?',aide:F.etapes.aide,suite:true,vide:'Quelle est la première étape ?',
    items:F.etapes.items.map(x=>Object.assign({etq:'Étape'},x))});
  if(F.mots.tenon)D.push({type:'mots',n:'02',rub:'Les mots du métier',q:F.mots.q,items:F.mots.items});
  else D.push({type:'grille',n:'02',rub:'Les mots du métier',q:F.mots.q,aide:F.mots.aide,cls:'g-mots3',
    items:F.mots.items.map((x,j)=>Object.assign({c:x.img?'':['c-bleu','c-jaune','c-encre'][j%3],idx:'0'+(j+1)},x))});
  const nimg=F.ou.items.filter(x=>x.img).length;
  D.push({type:'grille',n:'03',rub:'Où travaille-t-il ?',q:'Où travaille '+F.le+' ?',aide:'Il y a 4 réponses.',cls:nimg>1?'g-ou':'g-ou1',
    items:F.ou.items.map((x,j)=>Object.assign(x.img?{cl:'haut'}:{cl:'petit',c:['c-jaune','c-bleu','c-encre'][(j-nimg)%3]},{idx:'0'+(j+1)},x))});
  D.push({type:'grille',n:'03',rub:'Comment travaille-t-il ?',q:F.comment.q||'Seul ou à plusieurs ? Comment ?',aide:F.comment.aide||'Pensez à l’atelier du collège.',cls:'g-comment',
    items:F.comment.items.map((x,j)=>Object.assign(j===0?{img:'jeu-metiers/chefequipe.jpg',pos:'50% 30%'}:{cl:'affiche',c:j===1?'c-rouge':'c-encre'},{idx:'0'+(j+1)},x))});
  D.push({type:'grille',n:'04',rub:'Les qualités qu’il faut',q:'Pour vous, quelles qualités faut-il pour être '+F.titre+' ?',aide:F.qualAide||'Pensez à ce que vous faites à l’atelier.',cls:'g-qual',
    items:F.qualites.map((x,j)=>Object.assign({c:['c-bleu','c-jaune','','c-rouge'][j],idx:'0'+(j+1)},x))});
  D.push({type:'focus',n:'05',rub:'Sa sécurité : les EPI',q:'Comment '+F.le+' se protège-t-il ? Et contre quoi ?',aide:'EPI : équipement de protection individuelle.',vide:'Quel équipement ? Contre quel danger ?',
    items:F.epi.map(x=>Object.assign({etq:'EPI'},x))});
  D.push({type:'grille',n:'06',rub:'Comment apprendre ce métier ?',q:'Après la 3e, comment devenir '+F.titre+' ?',cls:'g-form',
    items:[{c:'c-bleu',badge:'Après la 3e',h:F.form[0][0],p:F.form[0][1]},{fleche:true},{c:'c-jaune',badge:'Après le CAP',h:'Je travaille… ou je continue',p:F.form[1]}]});
  D.push({type:'fin'});
  return D;
}

/* ======================= OUTILS ======================= */
document.querySelector('.barre a').href='../metier.html?m='+F.k;document.title=F.Le+' · Fiche métier au TNI';
const scene=document.getElementById('scene'), vue=document.getElementById('vue');
let S=1;
function el(tag,cls,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}
function mots(t){return nb(t).split(' ').map(w=>'<span class="mo"><span>'+w+'</span></span>').join(' ')}
function anim(node,kf,opt){if(!node||RM||!node.animate)return null;return node.animate(kf,Object.assign({fill:'backwards'},opt))}
function monte(nodes,base,pas){nodes.forEach((n,k)=>anim(n,[{transform:'translateY(110%)'},{transform:'none'}],{duration:700,delay:(base||0)+k*(pas||45),easing:'cubic-bezier(.2,.8,.2,1)'}))}
function apparait(nodes,base,pas,dy){nodes.forEach((n,k)=>anim(n,[{opacity:0,transform:'translateY('+(dy||24)+'px)'},{opacity:1,transform:'none'}],{duration:650,delay:(base||0)+k*(pas||80),easing:'cubic-bezier(.2,.8,.2,1)'}))}

/* ======================= CONSTRUCTION ======================= */
function bandeau(d){
  const q=el('header','qbar'+(d.aide?'':' sans-aide'));
  q.innerHTML='<div class="grand">'+d.n+'</div><div class="rub"><b>'+d.n+'</b>'+d.rub+'</div><h2>'+mots(d.q)+'</h2>'+(d.aide?'<div class="aide">'+nb(d.aide)+'</div>':'')+'<div class="touche">On en parle, puis <kbd>Espace</kbd> pour voir les réponses</div>';
  return q;
}
function carte(it,k){
  const c=el('div','carte '+(it.c||'')+' '+(it.cl||''));
  let h='<div class="ct">';
  if(it.fil)h+='<div class="fil">'+it.fil+'</div>';
  if(it.img)h+='<div class="photo"><img src="'+IMG+it.img+'" alt="" style="object-position:'+(it.pos||'50% 50%')+'"></div>';
  if(it.html)h+='<div class="txt">'+it.html+'</div>';
  else h+='<div class="txt">'+(it.badge?'<span class="badge">'+it.badge+'</span>':'')+(it.idx?'<span class="idx">'+it.idx+'</span>':'')+'<h3>'+nb(it.h)+'</h3><div class="trait"></div>'+(it.p?'<p>'+nb(it.p)+'</p>':'')+'</div>';
  h+='</div><button class="slot" type="button" aria-label="Dévoiler la réponse"><span class="pi">?</span><span class="lab">'+(it.lab||'Réponse '+(k+1))+'</span></button>';
  c.innerHTML=h;return c;
}
const FLECHE='<svg viewBox="0 0 48 48" fill="none" stroke="#101828" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 24h30M28 12l12 12-12 12"/></svg>';

const ctl=[]; // contrôleur par diapo
DIAPOS.forEach((d,i)=>{
  const s=el('section','diapo');s.hidden=true;scene.insertBefore(s,document.getElementById('volet'));
  const C={d,s,items:[],ordre:[],intro:false,docked:true,entree(){} };
  ctl.push(C);

  if(d.type==='couv'){
    s.classList.add('couv');
    s.innerHTML='<span class="tag">Fiche métier · Champ Habitat</span><div class="le">Le métier de</div><h1>'+mots(F.titre)+'</h1><p class="accroche">'+nb(F.accroche)+'</p><div class="go"><kbd>Espace</kbd>On commence</div>'
      +'<div class="heros"><img src="'+IMG+F.heros+'" alt="" style="object-position:'+(F.herosPos||'50% 30%')+'"></div>'
      +'<div class="vignette vg1"><img src="'+IMG+F.vg[0]+'" alt=""></div><div class="vignette vg2"><img src="'+IMG+F.vg[1]+'" alt=""></div>';
    C.entree=()=>{
      const h1=s.querySelector('h1');h1.style.fontSize='';const w=h1.offsetWidth;if(w>640)h1.style.fontSize=Math.floor(164*640/w)+'px';
      anim(s.querySelector('.heros'),[{opacity:0,transform:'translateY(60px) rotate(8deg) scale(.92)'},{opacity:1,transform:'rotate(2deg)'}],{duration:1000,easing:'cubic-bezier(.2,.8,.2,1)'});
      anim(s.querySelector('.vg1'),[{opacity:0,transform:'translate(-40px,80px) rotate(-30deg)'},{opacity:1,transform:'rotate(-7deg)'}],{duration:900,delay:350,easing:'cubic-bezier(.2,.8,.2,1)'});
      anim(s.querySelector('.vg2'),[{opacity:0,transform:'translate(40px,80px) rotate(30deg)'},{opacity:1,transform:'rotate(6deg)'}],{duration:900,delay:500,easing:'cubic-bezier(.2,.8,.2,1)'});
      apparait([s.querySelector('.tag'),s.querySelector('.le')],0,120);
      monte([...s.querySelectorAll('h1 .mo>span')],200);
      apparait([s.querySelector('.accroche'),s.querySelector('.go')],600,150);
    };
    s.addEventListener('click',()=>suivant());
    return;
  }
  if(d.type==='fin'){
    s.classList.add('fin');
    s.innerHTML='<h1>'+mots('À vous')+'<span>&nbsp;!</span></h1><p class="consigne">Sur votre fiche papier, faites la partie <b>7&nbsp;· Je vérifie que j’ai compris</b>, puis la partie <b>8&nbsp;· Et moi&nbsp;?</b></p>'+(F.fin.indice?'<div class="indice">'+nb(F.fin.indice)+'</div>':'')+'<div class="heros"><img src="'+IMG+F.fin.img+'" alt="" style="object-position:'+(F.fin.pos||'50% 25%')+'"></div>';
    C.entree=()=>{monte([...s.querySelectorAll('h1 .mo>span')],100);apparait([s.querySelector('.consigne'),s.querySelector('.indice')].filter(Boolean),400,180);
      anim(s.querySelector('.heros'),[{opacity:0,transform:'translateX(80px) rotate(6deg)'},{opacity:1,transform:'rotate(-2deg)'}],{duration:1000,easing:'cubic-bezier(.2,.8,.2,1)'});};
    return;
  }

  /* Diapos à question */
  C.intro=true;C.docked=false;
  const q=bandeau(d);s.appendChild(q);
  const zone=el('div','zone');s.appendChild(zone);
  const ombre=el('div','ombre');zone.appendChild(ombre);
  q.addEventListener('click',()=>{if(!C.docked)suivant()});
  C.entree=()=>{
    s.querySelectorAll('.g-objets .ct h3').forEach(h=>{h.style.fontSize='';let f=parseFloat(getComputedStyle(h).fontSize);while(h.scrollWidth>h.clientWidth+1&&f>24){f-=2;h.style.fontSize=f+'px'}});
    if(!C.docked){
      monte([...q.querySelectorAll('h2 .mo>span')],250,55);
      apparait([q.querySelector('.rub')],120);apparait([q.querySelector('.aide'),q.querySelector('.touche')].filter(Boolean),700,150);
      anim(q.querySelector('.grand'),[{opacity:0,transform:'translateX(160px)'},{opacity:1,transform:'none'}],{duration:1100,easing:'cubic-bezier(.2,.8,.2,1)'});
    }
  };

  if(d.type==='grille'){
    const g=el('div',d.cls);if(d.ncol)g.style.setProperty('--n',d.ncol);zone.appendChild(g);
    d.items.forEach((it,k)=>{
      if(it.fleche){g.appendChild(el('div','fleche',FLECHE));return}
      const c=carte(it,C.items.length);g.appendChild(c);
      const idx=C.items.length;
      c.querySelector('.slot').addEventListener('click',e=>{e.stopPropagation();devoiler(C,idx,true)});
      C.items.push({el:c,
        montrer(spot){c.classList.add('vu');if(spot&&!RM)projecteur(c,ombre);else anim(c,[{opacity:0,transform:'scale(.92)'},{opacity:1,transform:'none'}],{duration:450,easing:'cubic-bezier(.2,.8,.2,1)'})},
        cacher(){c.classList.remove('vu');c.getAnimations&&c.getAnimations().forEach(a=>a.cancel())}});
    });
  }

  if(d.type==='focus'){
    const f=el('div','focus');zone.appendChild(f);
    const pan=el('div','panneau');pan.innerHTML='<div class="vide"><b>?</b>'+nb(d.vide)+'</div>';f.appendChild(pan);
    const fr=el('div','frise'+(d.suite?' suite':''));f.appendChild(fr);
    C.voir=k=>{
      const it=d.items[k];
      fr.querySelectorAll('.tuile').forEach((t,j)=>t.classList.toggle('actif',j===k));
      if(k<0){pan.classList.remove('danger');pan.innerHTML='<div class="vide"><b>?</b>'+nb(d.vide)+'</div>';return}
      pan.classList.toggle('danger',!!it.alerte);
      pan.innerHTML='<div class="plein"><div class="ph"><img src="'+IMG+it.img+'" alt="'+it.nom+'"></div><div class="tx">'
        +'<div class="etq">'+(d.suite?'<b>'+(k+1)+'</b>':'')+it.etq+(d.suite?' '+(k+1)+' sur 6':'')+'</div><h3>'+nb(it.h)+'</h3><p>'+nb(it.p)+'</p>'
        +(it.outil?'<div class="outil"><b>'+it.outil+'</b><span>'+nb(it.def)+'</span></div>':'')
        +(it.alerte?'<div class="alerte">⚠ '+it.alerte+'</div>':'')+'</div></div>';
      const ph=pan.querySelector('.ph img');
      anim(ph,[{transform:'scale(1.25)',opacity:0},{transform:'none',opacity:1}],{duration:900,easing:'cubic-bezier(.2,.8,.2,1)'});
      anim(pan.querySelector('.ph'),[{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0)'}],{duration:700,easing:'cubic-bezier(.7,0,.2,1)'});
      apparait([...pan.querySelectorAll('.tx>*')],250,90,30);
    };
    d.items.forEach((it,k)=>{
      const t=el('div','tuile');
      t.innerHTML='<span class="n">'+(d.suite?k+1:'✓')+'</span><div class="im"><img src="'+IMG+it.img+'" alt=""></div><div class="nom">'+it.nom+'</div><button class="slot" type="button" aria-label="Dévoiler">'+(d.suite?k+1:'?')+'</button>';
      fr.appendChild(t);
      t.querySelector('.slot').addEventListener('click',e=>{e.stopPropagation();devoiler(C,k,true)});
      t.addEventListener('click',()=>{if(t.classList.contains('vu'))C.voir(k)});
      C.items.push({el:t,
        montrer(){t.classList.add('vu');C.voir(k);anim(t,[{transform:'translateY(30px) scale(.8)',opacity:0},{transform:'translateY(-8px)',opacity:1}],{duration:600,easing:'cubic-bezier(.2,.8,.2,1)',fill:'none'})},
        cacher(){t.classList.remove('vu');const r=C.ordre.filter(j=>j!==k);C.voir(r.length?r[r.length-1]:-1)}});
    });
  }

  if(d.type==='mots'){
    const g=el('div','g-mots');zone.appendChild(g);
    const des=el('div','dessin');des.innerHTML='<div class="attente">?</div>'+dessinTenon();g.appendChild(des);
    const defs=el('div','defs');g.appendChild(defs);
    const maj=()=>{const v=C.items.map(x=>x.el.classList.contains('vu'));
      des.classList.toggle('d-rail',v[0]||v[2]);des.classList.toggle('d-montant',v[1]||v[2]);des.classList.toggle('d-asm',v[2]);
      des.classList.toggle('d1',v.some(Boolean));};
    d.items.forEach((it,k)=>{
      const c=carte(it,k);defs.appendChild(c);
      c.querySelector('.slot').addEventListener('click',e=>{e.stopPropagation();devoiler(C,k,true)});
      C.items.push({el:c,montrer(){c.classList.add('vu');maj();anim(c,[{opacity:0,transform:'translateX(40px)'},{opacity:1,transform:'none'}],{duration:600,easing:'cubic-bezier(.2,.8,.2,1)'})},cacher(){c.classList.remove('vu');maj()}});
    });
  }
});

/* Dessin en perspective : une traverse couchée avec sa mortaise (dessus), un montant avec son tenon (dessous) */
function dessinTenon(){
  const c=Math.cos(Math.PI/6),sn=.5;
  const P=(x,y,z)=>[((x-z)*c).toFixed(1),((x+z)*sn-y).toFixed(1)];
  const pts=a=>a.map(p=>p.join(',')).join(' ');
  const poly=(a,fill,extra)=>'<polygon points="'+pts(a)+'" fill="'+fill+'" stroke="#101828" stroke-width="3" stroke-linejoin="round" '+(extra||'')+'/>';
  const boite=(x0,y0,z0,dx,dy,dz,col)=>{const x1=x0+dx,y1=y0+dy,z1=z0+dz;
    return poly([P(x0,y1,z0),P(x1,y1,z0),P(x1,y1,z1),P(x0,y1,z1)],col[0])
      +poly([P(x0,y0,z1),P(x1,y0,z1),P(x1,y1,z1),P(x0,y1,z1)],col[1])
      +poly([P(x1,y0,z0),P(x1,y0,z1),P(x1,y1,z1),P(x1,y1,z0)],col[2]);};
  const ligne=(a,b)=>'<line x1="'+a[0]+'" y1="'+a[1]+'" x2="'+b[0]+'" y2="'+b[1]+'" stroke="#B98A50" stroke-width="2.5" stroke-linecap="round"/>';
  const BOIS=['#F6DDB5','#E9BE83','#CF9A5E'], JAUNE=['#FFE38A','#FFC928','#E0A800'];
  const g=80; // hauteur du montant au-dessus avant assemblage
  // Traverse couchée : x 0..320, y 0..70, z 0..100 ; mortaise sur le dessus : x 125..195, z 35..65
  let m=boite(0,0,0,320,70,100,BOIS);
  for(const y of [18,36,54]) m+=ligne(P(12,y,100),P(308,y,100));
  const trou=[P(125,70,35),P(195,70,35),P(195,70,65),P(125,70,65)];
  m+='<clipPath id="cpTrou"><polygon points="'+pts(trou)+'"/></clipPath>'+poly(trou,'#2A1C10');
  m+='<g clip-path="url(#cpTrou)">'+poly([P(125,70,35),P(125,70,65),P(125,0,65),P(125,0,35)],'#7A5634','stroke-width="1.5"')+poly([P(125,70,35),P(195,70,35),P(195,0,35),P(125,0,35)],'#4E3620','stroke-width="1.5"')+'</g>'+poly(trou,'none');
  // Montant : x 110..210, z 15..85, y 70+g+60 .. +150 ; tenon : x 130..190, z 38..62, 60 de long vers le bas
  const yb=70+g;
  let r='<g class="tenon">'+boite(125,yb,35,70,70,30,JAUNE)+'</g>'+boite(105,yb+70,10,110,110,80,BOIS);
  for(const x of [124,148,172,196]) r+=ligne(P(x,yb+82,90),P(x,yb+168,90));
  const tT=P(160,yb+35,65), tM=P(160,70,50);
  const etiq=(cls,x,y,txt,f,fond,coul)=>{const w=txt.length*21+40;
    return '<g class="lab '+cls+'"><line x1="'+f[0]+'" y1="'+f[1]+'" x2="'+(x+w/2)+'" y2="'+y+'" stroke="#101828" stroke-width="3"/><circle cx="'+f[0]+'" cy="'+f[1]+'" r="7" fill="#101828" stroke="#fff" stroke-width="2"/>'
    +'<rect x="'+(x-w/2)+'" y="'+(y-26)+'" width="'+w+'" height="52" rx="12" fill="'+fond+'" stroke="#101828" stroke-width="3"/><text x="'+x+'" y="'+(y+11)+'" text-anchor="middle" font-family="Bricolage Grotesque, Arial Black, sans-serif" font-weight="800" font-size="31" fill="'+coul+'">'+txt+'</text></g>';};
  const labT=etiq('lab-tenon',-140,-120,'TENON',tT,'#FFC928','#101828');
  const labM=etiq('lab-mort',-150,40,'MORTAISE',tM,'#FFFFFF','#101828');
  const labA='<g class="lab lab-asm"><rect x="-245" y="-262" width="470" height="58" rx="14" fill="#101828"/><text x="-10" y="-223" text-anchor="middle" font-family="Bricolage Grotesque, Arial Black, sans-serif" font-weight="800" font-size="31" fill="#FFC928">Ça tient, sans une vis !</text></g>';
  return '<svg viewBox="-262 -282 552 500" aria-label="Dessin d’un assemblage à tenon et mortaise" style="--asx:0px;--asy:'+g+'px">'
    +'<g class="g-montant">'+m+'</g><g class="g-rail">'+r+'</g>'+labM+labT+labA+'</svg>';
}

/* Projecteur : la carte dévoilée arrive en grand au centre, puis rejoint sa place */
function projecteur(c,ombre){
  const sr=scene.getBoundingClientRect(),r=c.getBoundingClientRect();
  const x=(r.left-sr.left)/S,y=(r.top-sr.top)/S,w=r.width/S,h=r.height/S;
  const dx=640-(x+w/2),dy=380-(y+h/2),k=Math.max(1,Math.min(1.9,860/w,470/h));
  const T='translate('+dx+'px,'+dy+'px) ';
  c.classList.add('vole');
  const a=c.animate([
    {transform:T+'scale('+(k*.55)+')',opacity:0,easing:'cubic-bezier(.2,.8,.2,1)'},
    {transform:T+'scale('+k+')',opacity:1,offset:.17,easing:'linear'},
    {transform:T+'scale('+k+')',opacity:1,offset:.66,easing:'cubic-bezier(.7,0,.2,1)'},
    {transform:'none',opacity:1}],{duration:2500});
  ombre.animate([{opacity:0},{opacity:1,offset:.15},{opacity:1,offset:.64},{opacity:0}],{duration:2500});
  a.onfinish=a.oncancel=()=>c.classList.remove('vole');
  C_ANIM=a;
}
let C_ANIM=null;

/* ======================= NAVIGATION ======================= */
let i=0, occupe=false;
const pts=document.getElementById('points');
DIAPOS.forEach(()=>pts.appendChild(document.createElement('i')));
function echelle(){const r=vue.getBoundingClientRect();S=Math.min((r.width-36)/1280,(r.height-36)/720);scene.style.transform='scale('+S+')'}
addEventListener('resize',echelle);

function dock(C,on){C.docked=on;C.s.classList.toggle('dock',on);
  if(on&&!RM)apparait([...C.s.querySelectorAll('.zone .carte,.zone .tuile,.zone .panneau,.zone .dessin,.zone .fleche')],500,60,30);}
function devoiler(C,k,spot){
  if(C_ANIM&&C_ANIM.playState==='running')C_ANIM.finish();
  if(!C.docked){dock(C,true);C.ordre.push('dock')}
  const it=C.items[k];if(it.el.classList.contains('vu')){if(C.voir)C.voir(k);return}
  C.ordre.push(k);it.montrer(spot&&C.d.type==='grille'&&C.docked);maj();
}
function suivant(){
  if(occupe)return;const C=ctl[i];
  if(C_ANIM&&C_ANIM.playState==='running'){C_ANIM.finish();return}
  if(C.intro&&!C.docked){dock(C,true);C.ordre.push('dock');return maj()}
  const k=C.items.findIndex(x=>!x.el.classList.contains('vu'));
  if(k>=0)return devoiler(C,k,true);
  aller(i+1);
}
function precedent(){
  if(occupe)return;const C=ctl[i];
  if(C_ANIM&&C_ANIM.playState==='running')C_ANIM.finish();
  const z=C.ordre.pop();
  if(z==='dock'){dock(C,false);return maj()}
  if(z!=null){C.items[z].cacher();return maj()}
  aller(i-1,true);
}
function aller(n,retour){
  if(n<0||n>=ctl.length||n===i)return;
  const A=ctl[i],B=ctl[n];
  const chapitre=!retour&&B.d.n&&B.d.n!==A.d.n;
  const montrer=()=>{A.s.hidden=true;B.s.hidden=false;i=n;maj();B.entree()};
  if(RM){montrer();return}
  occupe=true;
  if(chapitre||n===0||B.d.type==='fin'){
    const v=document.getElementById('volet');document.getElementById('voletNum').textContent=B.d.n||'';
    v.style.visibility='visible';
    const kf=[{transform:'translateX(-101%)'},{transform:'translateX(0)',offset:.42},{transform:'translateX(0)',offset:.58},{transform:'translateX(101%)'}];
    v.children[0].animate(kf,{duration:1150,easing:'cubic-bezier(.7,0,.3,1)'});
    const a2=v.children[1].animate(kf,{duration:1150,delay:90,easing:'cubic-bezier(.7,0,.3,1)',fill:'backwards'});
    anim(v.querySelector('b'),[{opacity:0,transform:'scale(.8)'},{opacity:1,transform:'none',offset:.5},{opacity:0,transform:'scale(1.1)'}],{duration:1150,delay:90});
    setTimeout(montrer,560);
    a2.onfinish=()=>{v.style.visibility='hidden';occupe=false};
  }else{
    const s=retour?-1:1;
    anim(A.s,[{opacity:1,transform:'none'},{opacity:0,transform:'translateX('+(-60*s)+'px)'}],{duration:320,easing:'ease-in',fill:'none'});
    setTimeout(()=>{montrer();anim(B.s,[{opacity:0,transform:'translateX('+(80*s)+'px)'},{opacity:1,transform:'none'}],{duration:650,easing:'cubic-bezier(.2,.8,.2,1)',fill:'none'});occupe=false},300);
  }
}
function maj(){
  [...pts.children].forEach((p,k)=>p.className=k<i?'ok':k===i?'ici':'');
  const C=ctl[i],d=C.d;
  document.getElementById('chap').textContent=d.n?d.n+' · '+d.rub:(d.type==='couv'?F.Le:'À vous');
  const reste=C.items.some(x=>!x.el.classList.contains('vu'));
  const b=document.getElementById('suiv');
  b.textContent=d.type==='couv'?'Commencer ▶':(C.intro&&!C.docked)?'Voir les réponses ▶':reste?'Réponse suivante ▶':(i<ctl.length-1?'Diapo suivante ▶':'Terminé');
  try{history.replaceState(null,'','#'+(i+1))}catch(e){}
}
document.getElementById('suiv').onclick=()=>suivant();
document.getElementById('prec').onclick=()=>precedent();
document.getElementById('tout').onclick=()=>{const C=ctl[i];if(C.intro&&!C.docked){dock(C,true);C.ordre.push('dock')}
  C.items.forEach((x,k)=>{if(!x.el.classList.contains('vu')){C.ordre.push(k);x.montrer(false)}});maj()};
const plein=()=>{if(document.fullscreenElement)document.exitFullscreen();else if(document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().catch(()=>{})};
document.getElementById('plein').onclick=plein;
document.addEventListener('fullscreenchange',()=>setTimeout(echelle,60));
addEventListener('keydown',e=>{
  if(e.altKey||e.ctrlKey||e.metaKey)return;
  if([' ','ArrowRight','PageDown','Enter','ArrowDown'].includes(e.key)){e.preventDefault();suivant()}
  else if(['ArrowLeft','PageUp','Backspace','ArrowUp'].includes(e.key)){e.preventDefault();precedent()}
  else if(e.key==='f'||e.key==='F')plein();
  else if(e.key==='Home'){e.preventDefault();aller(0,true)}
});

const h=parseInt(location.hash.slice(1),10);
i=(h>=1&&h<=ctl.length)?h-1:0;
ctl[i].s.hidden=false;echelle();maj();
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(()=>ctl[i].entree());
})();
