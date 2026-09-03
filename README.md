# Sergio Visgarra — Portfolio

Landing page personal de Sergio Visgarra (Diseñador Gráfico / Web / UX-UI / 3D). Sitio estático, sin build step — HTML/CSS/JS plano.

## Estructura

```
index.html
css/style.css
js/main.js
assets/img/       → capturas reales de los proyectos del portfolio
assets/cv/        → CV en PDF (ya no se linkea desde el sitio, se sacó el botón de descarga)
```

## Ver en local

```bash
python -m http.server 8731
# abrir http://localhost:8731
```

## Deploy — GitHub Pages + Cloudflare Pages

1. **Crear el repo en GitHub** (podés usar el sitio o `gh repo create` si tenés el CLI instalado):
   - Nombre sugerido: `sergio-portfolio` o `portfolio`
   - Público

2. **Subir el código**:
   ```bash
   git init
   git add .
   git commit -m "Portfolio inicial"
   git branch -M main
   git remote add origin https://github.com/adsudo1990/<nombre-del-repo>.git
   git push -u origin main
   ```

3. **Conectar Cloudflare Pages** (recomendado, deploy automático en cada push):
   - Andá a [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create application** → pestaña **Pages** → **Connect to Git**
   - Elegí el repo `adsudo1990/<nombre-del-repo>`
   - Framework preset: **None**
   - Build command: *(vacío, no hace falta)*
   - Build output directory: `/` (la raíz del repo)
   - **Save and Deploy**
   - Con eso ya te da una URL tipo `<nombre-del-repo>.pages.dev`
   - Opcional: en **Custom domains**, sumale tu propio dominio si tenés uno en Cloudflare

4. Cada `git push` a `main` redeploya solo — no hay que tocar nada más.

## Pendientes / a completar

- [ ] Sumar capturas del proceso 3D (ZBrush/Substance Painter) a Behance y linkear desde la sección "3D como hobby"
- [ ] Si sumás un dominio propio en Cloudflare, actualizar el `og:url` / metadata si se agrega
- [ ] El formulario de contacto abre el cliente de mail del visitante (`mailto:`) — no hay backend. Si en algún momento querés un formulario real sin depender del cliente de mail, se puede armar con un Cloudflare Worker (mismo patrón que ya usás en el proyecto de Icon Digital)
