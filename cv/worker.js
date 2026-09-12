const LANDING_HTML = `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sergio Visgarra — CV Diseñador Gráfico, Web y UX/UI</title>
<meta name="description" content="Currículum de Sergio Visgarra: Diseñador Gráfico, Web y UX/UI con 14 años de trayectoria. Piezas gráficas, arquigrafía, branding, diseño web y UX/UI, con IA generativa en el flujo de trabajo diario.">
<link rel="canonical" href="https://sergio-cv.sergio-visgarra.workers.dev/">
<meta name="robots" content="index, follow">
<link rel="icon" type="image/png" href="https://adsudo1990.github.io/portfolio/assets/favicon.png">
<meta property="og:type" content="profile">
<meta property="og:title" content="Sergio Visgarra — CV Diseñador Gráfico, Web y UX/UI">
<meta property="og:description" content="14 años de trayectoria en diseño gráfico, web y UX/UI. Piezas listas para imprimir, arquigrafía, branding, merchandising e IA generativa aplicada al diseño.">
<meta property="og:image" content="https://adsudo1990.github.io/portfolio/assets/img/og-cover.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="https://sergio-cv.sergio-visgarra.workers.dev/">
<meta property="og:locale" content="es_AR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Sergio Visgarra — CV Diseñador Gráfico, Web y UX/UI">
<meta name="twitter:description" content="14 años de trayectoria en diseño gráfico, web y UX/UI. Piezas listas para imprimir, arquigrafía, branding, merchandising e IA generativa aplicada al diseño.">
<meta name="twitter:image" content="https://adsudo1990.github.io/portfolio/assets/img/og-cover.png">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"ProfilePage","mainEntity":{"@type":"Person","name":"Sergio Visgarra","jobTitle":"Diseñador Gráfico, Web y UX/UI","url":"https://adsudo1990.github.io/portfolio/","image":"https://adsudo1990.github.io/portfolio/assets/img/og-cover.png","address":{"@type":"PostalAddress","addressLocality":"Buenos Aires","addressCountry":"AR"},"email":"mailto:sergio_visgarra@hotmail.com","sameAs":["https://www.linkedin.com/in/sergio-visgarra","https://github.com/adsudo1990","https://www.behance.net/svdgw"],"knowsAbout":["Diseño Gráfico","Diseño Web","UX/UI","Arquigrafía","Branding","Merchandising","Motion","3D","IA Generativa"]}}
</script>
<style>
:root{--bg:#101a24;--ink:#eef3f6;--ink-soft:#aebdc9;--ink-faint:#7c8d9a;--accent:#35dcc6;--line:#2c3d4c;--panel:#16212c;--font-head:'Fira Sans',sans-serif;--font-body:'Inter',sans-serif;}
*{box-sizing:border-box;}
html,body{margin:0;padding:0;}
body{background:var(--bg);color:var(--ink);font-family:var(--font-body);min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:40px 20px 60px;}
.mark{width:56px;height:56px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;margin-bottom:18px;box-shadow:0 2px 14px rgba(0,0,0,.4);}
.mark img{width:64%;height:64%;object-fit:contain;}
h1{font-family:var(--font-head);font-weight:800;font-size:clamp(1.5rem,4vw,2.2rem);text-transform:uppercase;letter-spacing:.02em;margin:0 0 6px;text-align:center;}
.role{color:var(--accent);font-weight:600;font-size:.95rem;margin:0 0 26px;text-align:center;}
.actions{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;margin-bottom:32px;}
.btn{font-family:var(--font-body);font-weight:600;font-size:.9rem;padding:12px 22px;border-radius:8px;text-decoration:none;transition:transform .15s ease;}
.btn:hover{transform:translateY(-2px);}
.btn-primary{background:var(--accent);color:#0b1219;}
.btn-outline{background:transparent;color:var(--ink);border:1px solid var(--line);}
.viewer{width:100%;max-width:850px;aspect-ratio:210/297;background:var(--panel);border:1px solid var(--line);border-radius:10px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,.4);}
.viewer iframe{width:100%;height:100%;border:0;}
.links{margin-top:26px;font-size:.85rem;color:var(--ink-faint);}
.links a{color:var(--ink-faint);}
</style>
</head>
<body>
<div class="mark"><img src="https://adsudo1990.github.io/portfolio/assets/favicon.png" alt="Marca Sergio Visgarra"></div>
<h1>Sergio Visgarra</h1>
<p class="role">Diseñador Gráfico, Web y UX/UI · Abierto a nuevas oportunidades</p>
<div class="actions">
<a class="btn btn-primary" href="/cv" target="_blank" rel="noopener">Descargar CV (PDF)</a>
<a class="btn btn-outline" href="https://adsudo1990.github.io/portfolio/">Ver portfolio</a>
</div>
<div class="viewer"><iframe src="/cv" title="CV de Sergio Visgarra"></iframe></div>
<p class="links">LinkedIn: <a href="https://www.linkedin.com/in/sergio-visgarra">linkedin.com/in/sergio-visgarra</a> · Behance: <a href="https://www.behance.net/svdgw">behance.net/svdgw</a> · GitHub: <a href="https://github.com/adsudo1990">github.com/adsudo1990</a></p>
</body>
</html>`;

export default {
async fetch(request, env) {
const url = new URL(request.url);

if (url.pathname === "/cv-stats") {
const count = (await env.CV_STATS.get("downloads")) || "0";
return new Response(`Descargas/aperturas del CV: ${count}`, { headers: { "content-type": "text/plain; charset=utf-8" } });
}

if (url.pathname === "/cv") {
const object = await env.CV_BUCKET.get("Sergio_Visgarra_CV_Tecnico_2026.pdf");
if (!object) return new Response("CV no encontrado", { status: 404 });
const current = parseInt((await env.CV_STATS.get("downloads")) || "0", 10);
await env.CV_STATS.put("downloads", String(current + 1));
return new Response(object.body, { headers: { "content-type": "application/pdf", "content-disposition": 'inline; filename="Sergio_Visgarra_CV.pdf"', "cache-control": "no-store" } });
}

if (url.pathname === "/") {
return new Response(LANDING_HTML, { headers: { "content-type": "text/html; charset=utf-8" } });
}

return new Response("Not found", { status: 404 });
},
};
