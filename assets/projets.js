/* Projets d'atelier : une fiche par projet, affichée par projet.html?p=<id>.
   Chaque projet suit le même plan : infos clés, présentation, ce qu'on fabrique, matériaux, outils, EPI,
   étapes (avec ressources et compétences), évaluation, fiche pédagogique.
   Ressource d'une étape : {t:titre, k:type, href:lien} ; sans href = « en préparation ».
   Document : [nom, chemin sans extension, pdfSeul] ; le site propose le PDF et le Word (.docx) du même nom.
   Compétences : identifiants de la page Mon suivi (CM-xx métier, S1 à S6 sécurité, D1 à D5 socle). */

/* Libellés des compétences, repris de Mon suivi */
const COMPS={
 "CM-11":["metier","Décoder un dossier technique (lire le plan)"],
 "CM-12":["metier","Déterminer les besoins en matériaux"],
 "CM-13":["metier","Choisir les matériels et les outillages"],
 "CM-21":["metier","Organiser son intervention"],
 "CM-22":["metier","Préparer les supports"],
 "CM-23":["metier","Implanter et tracer un ouvrage"],
 "CM-24":["metier","Réaliser l'ouvrage"],
 "CM-25":["metier","Contrôler le travail réalisé"],
 "CM-31":["metier","Échanger, rendre compte oralement"],
 "S1":["secu","Porter les EPI adaptés à la tâche"],
 "S2":["secu","Respecter le règlement de l'atelier"],
 "S3":["secu","Utiliser outils et machines en sécurité"],
 "S4":["secu","Repérer les risques"],
 "S5":["secu","Garder son poste propre et rangé"],
 "S6":["secu","Adopter les bons gestes et postures"],
 "D1.1":["socle","Comprendre, s'exprimer en français"],
 "D1.3":["socle","Langage mathématique : mesurer, calculer"],
 "D2":["socle","Méthodes et outils pour apprendre"],
 "D3":["socle","Travailler en équipe, respecter les règles"],
 "D4":["socle","Systèmes techniques et matériaux"]
};

/* Parcours : une base qui évolue, projet après projet */
const PARCOURS={
 maconnerie:{t:"Parcours maçonnerie",d:"On part d'un mur simple, puis on le fait évoluer : un angle, un enduit, une finition, un coffrage.",
  etapes:["mur-droit","mur-angle","enduit","chaperon","coffrage"]}
};

const P=[
{
 id:"mur-droit", parcours:"maconnerie", m:"macon", metiers:["Maçon"],
 t:"Monter un mur droit en parpaings", lv:"3e", lvNote:"adaptable en 4e (2 rangs)",
 duree:"12 h environ", orga:"en binôme, un mur par binôme",
 intro:"Les élèves construisent un vrai mur de 4 rangs, du plan au contrôle final. Ils apprennent les gestes de base du maçon : tracer, gâcher, poser au cordeau, croiser les joints, contrôler au niveau. Le mur est monté au mortier de chaux : on le démonte en fin de projet et les blocs servent au groupe suivant.",
 ouvrage:{
  dims:"Longueur 1,52 m · hauteur 0,84 m (lit de pose compris) · épaisseur 15 cm",
  points:["4 rangs de parpaings creux 50 × 20 × 15 cm","Joints de 1 cm, verticaux et horizontaux","Joints croisés : chaque rang est décalé d'un demi-bloc","Quantités : 10 blocs entiers et 4 demi-blocs"]
 },
 materiaux:[["Parpaings creux 50 × 20 × 15 cm","10 entiers + 2 à couper en deux"],["Chaux hydraulique","1 volume"],["Sable 0/4","3 volumes"],["Eau","au besoin, consistance pâteuse"]],
 outils:[["Truelle de maçon","macon/truelle"],["Auge","macon/auge"],["Seau","macon/seau"],["Cordeau et broches","macon/cordeau"],["Niveau à bulle","carreleur/niveau"],["Règle de maçon","macon/regle"],["Mètre ruban","carreleur/metre"],["Massette","macon/massette"],["Burin","macon/burin"],["Brouette","macon/brouette"],["Fil à plomb",null]],
 epi:["chaussures","gants","lunettes","combinaison"],
 etapes:[
  {t:"Découvrir le projet et lire le plan",h:"1 h",obj:"Je comprends ce que je vais construire et je lis les cotes du plan.",
   faire:["Présenter le mur fini (photo ou mur témoin) et le métier de maçon.","Lire le plan : vue de face, vue de dessus, cotes.","Calculer le nombre de blocs par rang, puis pour tout le mur."],
   res:[{t:"Diaporama : le mur en parpaings",k:"TNI"},{t:"Dossier élève, pages 1 et 2",k:"PDF",href:"fiches/macon/mur-droit-dossier-eleve.pdf"},{t:"Plan coté du mur",k:"PDF",href:"fiches/macon/mur-droit-plan.pdf"}],
   c:["CM-11","CM-12","D1.3"]},
  {t:"Préparer son poste",h:"1 h",obj:"Je choisis mes outils, mes matériaux et mes équipements de protection.",
   faire:["Lister les outils et les matériaux à partir du dossier.","Préparer le poste : aire dégagée, outils rangés sur le côté.","Choisir ses EPI : chaussures de sécurité, gants, lunettes."],
   res:[{t:"Quel EPI pour quelle tâche ?",k:"TNI",href:"activites/epi.html"},{t:"Dossier élève, page 2 : je prépare mon poste",k:"PDF",href:"fiches/macon/mur-droit-dossier-eleve.pdf"},{t:"Les outils du maçon",k:"TNI"}],
   c:["CM-13","CM-21","S1","S5"],secu:"Un parpaing de 15 cm pèse environ 15 kg : on le porte près du corps, dos droit, jambes fléchies."},
  {t:"Implanter le mur",h:"1 h",obj:"Je trace l'emplacement exact du mur au sol.",
   faire:["Repérer les deux extrémités du mur à partir d'un point de départ.","Tendre le cordeau entre les deux repères et tracer la ligne.","Vérifier la longueur au mètre : 1,52 m."],
   res:[{t:"Dossier élève, page 3 : j'implante le mur",k:"PDF",href:"fiches/macon/mur-droit-dossier-eleve.pdf"}],
   c:["CM-23","D1.3","D3"]},
  {t:"Gâcher le mortier",h:"1 h",obj:"Je prépare un mortier à la bonne consistance.",
   faire:["Doser : 1 volume de chaux pour 3 volumes de sable, au seau.","Mélanger à sec, creuser un cratère, ajouter l'eau petit à petit.","Tester : le mortier tient sur la truelle retournée sans couler."],
   res:[{t:"Dossier élève, page 3 : je gâche le mortier",k:"PDF",href:"fiches/macon/mur-droit-dossier-eleve.pdf"},{t:"Vidéo : le bon geste",k:"Vidéo"}],
   c:["CM-22","CM-24","D1.3","S1"],secu:"Chaux et ciment brûlent la peau et les yeux : gants et lunettes obligatoires pendant le gâchage."},
  {t:"Poser le premier rang",h:"2 h",obj:"Je pose le premier rang droit, de niveau et aligné.",
   faire:["Étaler un lit de mortier sur la ligne tracée.","Poser les deux blocs d'extrémité, les régler au niveau.","Tendre le cordeau en haut des blocs, poser les blocs du milieu en suivant le cordeau.","Contrôler : niveau, alignement, joints de 1 cm."],
   res:[{t:"Dossier élève, page 4 : je pose le premier rang",k:"PDF",href:"fiches/macon/mur-droit-dossier-eleve.pdf"}],
   c:["CM-24","CM-25","S6"]},
  {t:"Monter les rangs suivants",h:"3 h",obj:"Je monte les rangs en croisant les joints.",
   faire:["Couper deux blocs en deux (massette et burin) pour les demi-blocs.","Commencer chaque rang pair par un demi-bloc : les joints ne sont jamais l'un au-dessus de l'autre.","Remonter le cordeau à chaque rang.","Contrôler à chaque rang : niveau sur le dessus, aplomb sur les côtés."],
   res:[{t:"Dossier élève, page 4 : je croise les joints",k:"PDF",href:"fiches/macon/mur-droit-dossier-eleve.pdf"}],
   c:["CM-24","CM-25","S3","D2"],secu:"Couper un bloc : lunettes, gants, et personne dans l'axe des éclats."},
  {t:"Finir et ranger",h:"1 h",obj:"Je finis mes joints et je rends un poste propre.",
   faire:["Lisser les joints au fer à joint quand le mortier commence à durcir.","Gratter les bavures de mortier.","Laver les outils et l'auge, ranger, balayer."],
   res:[{t:"Dossier élève, page 5 : je finis et je range",k:"PDF",href:"fiches/macon/mur-droit-dossier-eleve.pdf"}],
   c:["CM-24","S5","D3"]},
  {t:"Contrôler et présenter son mur",h:"1 h",obj:"Je contrôle mon mur avec la grille et je le présente.",
   faire:["Mesurer longueur et hauteur, vérifier niveau et aplomb.","Remplir la grille d'auto-évaluation.","Présenter son mur en 2 minutes : ce qui a marché, ce qu'on referait autrement."],
   res:[{t:"Grille d'évaluation",k:"PDF",href:"fiches/macon/mur-droit-grille.pdf"}],
   c:["CM-25","CM-31","D1.1"]}
 ],
 eval:[
  ["Dimensions","Longueur 1,52 m et hauteur 0,84 m","écart de 1 cm au plus"],
  ["Niveau","Le dessus de chaque rang est horizontal","bulle centrée"],
  ["Aplomb","Les côtés du mur sont verticaux","bulle centrée"],
  ["Alignement","Le mur suit la ligne tracée","écart de 5 mm au plus"],
  ["Joints","Épaisseur régulière, joints croisés","1 cm, décalage d'un demi-bloc"],
  ["Sécurité","EPI portés, bons gestes de port de charge","pendant toute la séance"],
  ["Poste","Outils lavés, poste propre et rangé","en fin de séance"]
 ],
 peda:{
  prerequis:["Connaître les EPI et le règlement de l'atelier.","Savoir lire une cote et utiliser le mètre."],
  besoin:["Une aire de 2 m × 1,5 m par binôme, au sol plat.","Par binôme : 12 parpaings, 1 truelle chacun, 1 auge, 1 niveau, 1 cordeau, 1 seau."],
  vigilance:["Mortier de chaux plutôt que ciment : le mur se démonte et les blocs se réutilisent.","Blocs de 15 cm (environ 15 kg) plutôt que 20 cm (environ 20 kg) pour des élèves de collège.","Prévoir un temps de nettoyage réel : 20 minutes en fin de séance."],
  diff:["Élève en difficulté : 2 rangs au lieu de 4, gabarit de joint de 1 cm.","Élève à l'aise : chef d'équipe sur le contrôle, ou mur de 5 rangs."]
 },
 docs:[["Dossier élève","fiches/macon/mur-droit-dossier-eleve"],["Fiche pédagogique et corrigé","fiches/macon/mur-droit-fiche-peda"],["Grille d'évaluation","fiches/macon/mur-droit-grille"],["Plan coté du mur (A4 paysage, à imprimer à 100 %)","fiches/macon/mur-droit-plan",true]]
},
{id:"mur-angle",parcours:"maconnerie",m:"macon",t:"Monter un mur en angle avec un poteau",lv:"3e",court:"Deux murs à 90° qui se croisent dans l'angle, et un poteau en blocs d'angle."},
{id:"enduit",parcours:"maconnerie",m:"macon",t:"Enduire le mur",lv:"3e",court:"Préparer le support, projeter l'enduit, dresser à la règle, talocher."},
{id:"chaperon",parcours:"maconnerie",m:"macon",t:"Couvrir le mur : le chaperon",lv:"3e",court:"Protéger le dessus du mur de la pluie avec un chaperon ou une couvertine."},
{id:"coffrage",parcours:"maconnerie",m:"macon",t:"Coffrer et couler un linteau",lv:"3e",court:"Fabriquer un coffrage en bois, placer les armatures, couler le béton."}
];
