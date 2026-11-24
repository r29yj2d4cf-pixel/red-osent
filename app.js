const $ = id => document.getElementById(id);
$("year").textContent = new Date().getFullYear();
const message = (text, error=false) => { $("message").textContent=text; $("message").className="message"+(error?" error":""); };
const clearResults = () => { $("results").replaceChildren(); };
const card = (title, tag, lines, url, linkText="Voir la source officielle ↗") => {
  const article=document.createElement("article"); article.className="result";
  const badge=document.createElement("span"); badge.className="tag"; badge.textContent=tag; article.append(badge);
  const h=document.createElement("h3"); h.textContent=title; article.append(h);
  for(const line of lines){const p=document.createElement("p");p.textContent=line;article.append(p);}
  if(url){const a=document.createElement("a");a.href=url;a.target="_blank";a.rel="noopener noreferrer";a.textContent=linkText;article.append(a);}
  $("results").append(article);
};
const validDomain = d => /^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z]{2,63}$/i.test(d);
const isPrivateIPv4 = ip => {
 const p=ip.split(".").map(Number);
 return p.length===4 && (p[0]===0 || p[0]===10 || p[0]===127 || (p[0]===169&&p[1]===254) || (p[0]===172&&p[1]>=16&&p[1]<=31) || (p[0]===192&&p[1]===168) || (p[0]===100&&p[1]>=64&&p[1]<=127) || p[0]>=224);
};
function validIPv4(ip){const p=ip.split(".");return p.length===4&&p.every(x=>/^\\d{1,3}$/.test(x)&&Number(x)>=0&&Number(x)<=255);}
function validIPv6(ip){return ip.includes(":")&&/^[0-9a-f:]+$/i.test(ip)&&ip.length<=45&&ip.split(":").length>=3;}
async function searchCompany(q){
 const url="https://recherche-entreprises.api.gouv.fr/search?q="+encodeURIComponent(q)+"&per_page=8";
 const response=await fetch(url,{headers:{Accept:"application/json"}});
 if(!response.ok) throw new Error(response.status===429?"Trop de recherches rapprochées. Attends une minute.":"Le service des entreprises a répondu avec une erreur ("+response.status+").");
 const data=await response.json(); const list=data.results||[];
 if(!list.length){$("results").innerHTML='<div class="empty">Aucune entreprise trouvée. Essaie un nom ou un numéro SIREN/SIRET.</div>';return 0;}
 for(const item of list){
   const name=item.nom_complet||item.nom_raison_sociale||"Entreprise sans nom affiché";
   const siren=item.siren||"Non indiqué";
   const status=item.etat_administratif==="A"?"Active":item.etat_administratif==="C"?"Cessée":"Non précisé";
   const naf=item.activite_principale||"Non précisé";
   const nature=item.nature_juridique||"Non précisée";
   const lines=["SIREN : "+siren,"État administratif : "+status,"Activité (code NAF) : "+naf,"Nature juridique : "+nature];
   card(name,"REGISTRE PUBLIC · FRANCE",lines,"https://annuaire-entreprises.data.gouv.fr/entreprise/"+encodeURIComponent(siren));
 }
 return list.length;
}
async function searchRdap(kind,q){
 const url="https://rdap.org/"+(kind==="domain"?"domain/":"ip/")+encodeURIComponent(q);
 const response=await fetch(url,{headers:{Accept:"application/rdap+json, application/json"}});
 if(!response.ok) throw new Error(response.status===404?"Aucune fiche RDAP trouvée pour cette cible.":"Le service RDAP a répondu avec une erreur ("+response.status+").");
 const d=await response.json();
 // N'afficher que les champs techniques/publics utiles; ne jamais afficher les objets entities/contact.
 const lines=[];
 if(kind==="domain"){
   lines.push("Nom du domaine : "+(d.ldhName||q));
   if(d.status?.length) lines.push("Statut : "+d.status.join(", "));
   if(d.events?.length) for(const e of d.events){if(["registration","expiration","last changed"].includes((e.eventAction||"").toLowerCase())) lines.push((e.eventAction||"Événement")+" : "+(e.eventDate||"date non fournie"));}
   if(d.nameservers?.length) lines.push("Serveurs DNS : "+d.nameservers.map(n=>n.ldhName).filter(Boolean).slice(0,8).join(", "));
   if(d.secureDNS?.delegationSigned!==undefined) lines.push("DNSSEC : "+(d.secureDNS.delegationSigned?"activé":"non indiqué"));
   card(d.ldhName||q,"RDAP · DOMAINE",lines,"https://rdap.org/domain/"+encodeURIComponent(q));
 } else {
   lines.push("Réseau : "+(d.name||d.handle||"Non indiqué"));
   if(d.startAddress&&d.endAddress) lines.push("Plage : "+d.startAddress+" – "+d.endAddress);
   if(d.ipVersion) lines.push("Version : IPv"+d.ipVersion);
   if(d.country) lines.push("Pays du registre : "+d.country);
   if(d.type) lines.push("Type : "+d.type);
   card(d.name||q,"RDAP · ADRESSE IP",lines,"https://rdap.org/ip/"+encodeURIComponent(q));
 }
 return 1;
}
async function runSearch(){
 const q=$("query").value.trim(), type=$("type").value;
 if(type==="selfcheck"){runSelfCheck();return;}
 clearResults();
 if(!q){message("Saisis une requête avant de lancer la recherche.",true);return;}
 if(q.length<2){message("La requête doit contenir au moins 2 caractères.",true);return;}
 if(type==="web"){
   const url="https://www.google.com/search?q="+encodeURIComponent(q);
   card("Recherche web : "+q,"RECHERCHE EXTERNE",["La recherche va s'ouvrir dans un nouvel onglet. Le moteur externe recevra ta requête."],url,"Ouvrir la recherche ↗");
   message("Recherche préparée. Clique sur « Ouvrir la recherche » pour consulter les résultats.");
   return;
 }
 if(type==="domain"&&!validDomain(q)){message("Entre un nom de domaine valide, par exemple exemple.fr.",true);return;}
 if(type==="ip"){
   if(!(validIPv4(q)||validIPv6(q))){message("Entre une adresse IPv4 ou IPv6 valide.",true);return;}
   if(validIPv4(q)&&isPrivateIPv4(q)){message("Les adresses IP privées, locales ou réservées ne sont pas prises en charge.",true);return;}
   const low=q.toLowerCase();
   if(validIPv6(q)&&(low==="::1"||low.startsWith("fe80:")||low.startsWith("fc")||low.startsWith("fd"))){message("Les adresses IPv6 locales ou privées ne sont pas prises en charge.",true);return;}
 }
 const btn=$("searchBtn");btn.disabled=true;btn.textContent="Recherche…";
 message("Interrogation de la source publique…");
 try{
   const count=type==="company"?await searchCompany(q):await searchRdap(type,q);
   message(count?count+" résultat(s) affiché(s). Les champs de contact personnels ne sont pas affichés.":"Aucun résultat.");
 }catch(err){
   message(err.message+" Tu peux aussi consulter le registre RDAP ou l'annuaire officiel directement.",true);
   const fallback=type==="company"?"https://annuaire-entreprises.data.gouv.fr/rechercher?terme="+encodeURIComponent(q):"https://rdap.org/"+(type==="domain"?"domain/":"ip/")+encodeURIComponent(q);
   card("Ouvrir la source directement","SOURCE EXTERNE",["La consultation directe permet de vérifier si le service est disponible."],fallback,"Ouvrir la source ↗");
 }finally{btn.disabled=false;btn.innerHTML="<span>⌕</span> Rechercher";}
}
$("searchBtn").addEventListener("click",runSearch);
$("query").addEventListener("keydown",e=>{if(e.key==="Enter")runSearch();});
$("type").addEventListener("change",()=>{$("query").placeholder=({web:"Ex. cybersécurité",company:"Ex. nom d'entreprise ou SIREN",domain:"Ex. exemple.fr",ip:"Ex. 1.1.1.1"})[$("type").value];});


// Mode local de vérification de ses propres informations : aucune donnée n'est transmise.
function updateSearchMode(){
  const isSelf = $("type").value === "selfcheck";
  $("selfCheckFields").hidden = !isSelf;
  document.querySelector('label[for="query"]').hidden = isSelf;
  $("query").parentElement.hidden = isSelf;
  document.querySelector(".searchbox > .hint").hidden = isSelf;
  $("searchBtn").textContent = isSelf ? "Vérifier mes données" : "⌕ Rechercher";
}
function runSelfCheck(){
  clearResults();
  const last = $("selfLastName").value.trim();
  const first = $("selfFirstName").value.trim();
  const dob = $("selfBirthDate").value;
  if(!last && !first && !dob){
    message("Renseigne au moins un champ concernant tes propres informations.", true);
    return;
  }
  const article = document.createElement("article");
  article.className = "result";
  const tag = document.createElement("span");
  tag.className = "tag";
  tag.textContent = "VÉRIFICATION LOCALE · AUCUN ENVOI";
  article.append(tag);
  const h = document.createElement("h3");
  h.textContent = "Conseils pour protéger tes informations";
  article.append(h);
  const p = document.createElement("p");
  p.textContent = "Les champs saisis restent dans cette page. Ils ne sont envoyés à aucun moteur de recherche ni enregistrés par RED OSINT.";
  article.append(p);
  const tips = [
    "Évite de publier ta date de naissance complète sur les réseaux sociaux.",
    "Vérifie les paramètres de confidentialité de tes profils et limite leur visibilité.",
    "Si une information personnelle apparaît sans ton accord, contacte le site pour demander sa suppression.",
    "En France, consulte la CNIL pour connaître tes droits d'accès, de rectification et d'effacement."
  ];
  for(const tip of tips){
    const line = document.createElement("p");
    line.textContent = "• " + tip;
    article.append(line);
  }
  const link = document.createElement("a");
  link.href = "https://www.cnil.fr/fr/maitriser-mes-donnees";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Consulter les conseils de la CNIL ↗";
  article.append(link);
  $("results").append(article);
  message("Vérification locale terminée. Aucune donnée personnelle n'a été transmise ou sauvegardée.");
}
$("type").addEventListener("change", updateSearchMode);
updateSearchMode();
