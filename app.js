const $ = (id) => document.getElementById(id);
$("year").textContent = new Date().getFullYear();
$("generalForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const q = $("generalQuery").value.trim();
  if (!q) return;
  // Recherche générique uniquement : pas de recherche de personnes.
  window.open("https://www.google.com/search?q=" + encodeURIComponent(q), "_blank", "noopener,noreferrer");
});
$("domainForm").addEventListener("submit", (e) => {
  e.preventDefault();
  let domain = $("domainQuery").value.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0];
  if (!/^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z]{2,63}$/.test(domain)) {
    alert("Entre un nom de domaine valide, par exemple exemple.fr."); return;
  }
  window.open("https://rdap.org/domain/" + encodeURIComponent(domain), "_blank", "noopener,noreferrer");
});
$("ipForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const ip = $("ipQuery").value.trim();
  // Validation IPv4/IPv6 simplifiée; l'utilisateur doit utiliser uniquement des IP publiques autorisées.
  const ipv4 = /^(?:(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)$/.test(ip);
  const ipv6 = /^[0-9a-fA-F:]{2,45}$/.test(ip) && ip.includes(":");
  if (!(ipv4 || ipv6)) { alert("Entre une adresse IPv4 ou IPv6 valide."); return; }
  if (/^(10\\.|127\\.|192\\.168\\.|169\\.254\\.|172\\.(1[6-9]|2\\d|3[01])\\.)/.test(ip) || ip === "::1" || ip.toLowerCase().startsWith("fe80:") || ip.toLowerCase().startsWith("fc") || ip.toLowerCase().startsWith("fd")) {
    alert("Les adresses IP privées ou locales ne sont pas prises en charge."); return;
  }
  window.open("https://rdap.org/ip/" + encodeURIComponent(ip), "_blank", "noopener,noreferrer");
});
$("accountBtn").addEventListener("click", () => $("accountDialog").showModal());
$("accountDialog").addEventListener("click", (e) => { if (e.target === $("accountDialog")) $("accountDialog").close(); });
