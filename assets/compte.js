/* Comptes profs, documents réservés et compteur de visites.
   Réglages : à remplir une fois les comptes Supabase et GoatCounter créés (voir supabase/LISEZMOI.md).
   La clé « anon » est publique par nature : la sécurité vient des règles de la base (supabase/installation.sql). */
const CONFIG={
  supabaseUrl:"https://bsopqwdeozzxmwduolys.supabase.co",      // ex. https://abcdefgh.supabase.co
  supabaseCle:"sb_publishable_nWAL5lmLKKF-9K2gMg3Rfw_BFapbmik", // clé publique (publishable)
  goatcounter:"habitat-segpa" // compteur de visites : habitat-segpa.goatcounter.com
};

const Compte=(()=>{
  const actif=!!(CONFIG.supabaseUrl&&CONFIG.supabaseCle);
  const racine=document.currentScript?document.currentScript.src.replace(/assets\/compte\.js.*$/,""):"";
  let client=null, pret=null;

  /* Compteur de visites : GoatCounter, sans cookie */
  if(CONFIG.goatcounter&&!/^(localhost|127\.)/.test(location.hostname)){
    const s=document.createElement("script");s.async=true;s.src="https://gc.zgo.at/count.js";
    s.dataset.goatcounter=`https://${CONFIG.goatcounter}.goatcounter.com/count`;document.head.appendChild(s);
  }

  function charger(){
    if(!actif) return Promise.resolve(null);
    if(pret) return pret;
    pret=new Promise((ok,ko)=>{
      const s=document.createElement("script");
      s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.3/dist/umd/supabase.js";
      s.onload=()=>{client=window.supabase.createClient(CONFIG.supabaseUrl,CONFIG.supabaseCle);ok(client)};
      s.onerror=()=>ko(new Error("Le service de comptes ne répond pas. Réessayez dans un instant."));
      document.head.appendChild(s);
    });
    return pret;
  }
  async function utilisateur(){const c=await charger();if(!c)return null;const {data}=await c.auth.getSession();return data.session?data.session.user:null}

  /* Document réservé : lien signé valable 60 s, téléchargement noté pour les statistiques */
  async function telecharger(chemin){
    if(!actif){alert("Les documents prof seront accessibles avec un compte prof. Cette partie du site est en cours d'installation.");return}
    const u=await utilisateur();
    if(!u){location.href=racine+"compte.html?retour="+encodeURIComponent(location.href);return}
    const {data,error}=await client.storage.from("prof").createSignedUrl(chemin,60,{download:true});
    if(error){alert("Document introuvable pour le moment. Prévenez l'auteur du site.");return}
    client.from("telechargements").insert({doc:chemin}).then(()=>{});
    location.href=data.signedUrl;
  }

  /* Lien « Mon compte » dans le menu, lien « Données personnelles » dans le pied de page */
  document.addEventListener("DOMContentLoaded",async()=>{
    const ul=document.querySelector(".top .nav ul");
    if(ul&&!ul.querySelector(".lien-compte")){
      const li=document.createElement("li");li.innerHTML=`<a class="lien-compte" href="${racine}compte.html">Espace prof</a>`;ul.appendChild(li);
      utilisateur().then(u=>{if(u)li.firstChild.textContent="Mon compte"}).catch(()=>{});
    }
    const f=document.querySelector("footer .wrap");
    if(f&&!f.querySelector(".lien-donnees")){const a=document.createElement("a");a.className="lien-donnees";a.href=racine+"donnees.html";a.textContent="Données personnelles et mentions légales";f.appendChild(a)}
  });
  /* Adresse de contact écrite en morceaux dans la page (moins lisible par les robots à spam), recomposée ici */
  document.addEventListener("DOMContentLoaded",()=>document.querySelectorAll(".contact[data-u]").forEach(el=>{
    const m=el.dataset.u+"@"+el.dataset.d, a=document.createElement("a");a.href="mailto:"+m;a.textContent=el.dataset.t||m;el.replaceWith(a)}));
  document.addEventListener("click",e=>{const a=e.target.closest("a[data-prof]");if(!a)return;e.preventDefault();telecharger(a.dataset.prof)});

  return {actif,charger,utilisateur,telecharger};
})();
