// Worker que sirve el CV en PDF directo (un clic, sin pasos intermedios)
// y lleva la cuenta de cuántas veces se abrió, usando un contador en KV.
//
// Rutas:
//   /cv        -> sirve el PDF (y suma 1 al contador)
//   /cv-stats  -> te muestra cuántas veces se abrió (dejala sin compartir)

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/cv-stats") {
      const count = (await env.CV_STATS.get("downloads")) || "0";
      return new Response(`Descargas/aperturas del CV: ${count}`, {
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }

    if (url.pathname === "/cv") {
      const object = await env.CV_BUCKET.get("Sergio_Visgarra_CV_Tecnico_2026.pdf");
      if (!object) return new Response("CV no encontrado", { status: 404 });

      // suma 1 al contador (no bloquea la respuesta al usuario)
      const current = parseInt((await env.CV_STATS.get("downloads")) || "0", 10);
      await env.CV_STATS.put("downloads", String(current + 1));

      return new Response(object.body, {
        headers: {
          "content-type": "application/pdf",
          // "inline" = se abre en una pestaña del navegador (recomendado).
          // Si preferís que fuerce la descarga directa, cambiá "inline" por "attachment".
          "content-disposition": 'inline; filename="Sergio_Visgarra_CV.pdf"',
          "cache-control": "no-store",
        },
      });
    }

    return new Response("Not found", { status: 404 });
  },
};
