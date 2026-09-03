# Sergio Visgarra — Portfolio

Landing personal de Sergio Visgarra (Diseñador Digital / Web / UX-UI / 3D).
Sitio estático, sin build step — HTML/CSS/JS plano + GSAP para las animaciones de scroll.

**Repo:** https://github.com/adsudo1990/portfolio

## Estructura

```
index.html        → home (hero, skills, statement, sobre mí, portfolio, 3D, experiencia, contacto)
portfolio.html    → "Todos los proyectos" (GitHub + Behance + reel vertical)
css/style.css
js/main.js
assets/img/       → capturas reales de los proyectos
dev-server.py     → servidor local que NO cachea (solo para desarrollo)
```

## Ver en local

```bash
python dev-server.py 8731
# abrir http://localhost:8731
```

Usa `dev-server.py` en vez de `python -m http.server`: el servidor por defecto
cachea los archivos y los cambios no aparecen sin hard-refresh.

## Animaciones y accesibilidad

`js/main.js` maneja tres efectos ligados al scroll:

1. **Traspaso hero → tarjeta de skills**: la foto del hero se achica/rota/desvanece
   mientras la tarjeta del mosaico crece y se asienta.
2. **Giro 3D de la tarjeta**: al recorrer las fichas de skills, la tarjeta gira y
   muestra "Trabajemos juntos" (linkea a contacto).
3. **Statement palabra por palabra**: el texto grande se va encendiendo con el scroll.

Si el sistema pide reducir movimiento (`prefers-reduced-motion`), el **traspaso del
hero** pasa a un fundido simple. El **giro de la tarjeta se mantiene** por ser un
elemento chico y contenido (sin parallax ni desplazamiento de página).

### Parámetros de URL útiles para depurar

| Parámetro | Efecto |
|---|---|
| `?motion=on` | Fuerza movimiento completo aunque el SO pida reducirlo |
| `?motion=off` | Desactiva todas las animaciones de scroll |
| `?debug=1` | Panel con estado de GSAP, reduce-motion y progreso de cada ScrollTrigger |

> **Nota sobre los rangos de scroll:** los `ScrollTrigger` usan rangos explícitos con
> mínimo garantizado (`end: '+=' + Math.max(600, ...)`). Con `end: 'bottom bottom'` el
> rango colapsaba a 0 en ventanas más altas que la grilla de tarjetas (pantallas
> grandes) y la animación no corría nunca.

## Deploy

### GitHub Pages (actual)

En el repo → **Settings › Pages › Source: Deploy from a branch › `main` › `/(root)`**.
Queda publicado en `https://adsudo1990.github.io/portfolio/`.

### Cloudflare Pages (opcional)

[dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create
application** → **Pages** → **Connect to Git** → repo `adsudo1990/portfolio`.
Framework preset **None**, build command vacío, output directory `/`.
Permite sumar dominio propio y da deploy automático en cada push.

## Pendientes

- [ ] **Foto de Sergio** para el hero: hay un placeholder en `index.html`
      (buscar `hero-photo`). Reemplazar por `assets/img/sergio.jpg`.
- [ ] Subir capturas del proceso 3D (ZBrush / Substance Painter) a Behance
      y linkear desde la sección "3D como hobby".
- [ ] Reemplazar los 3 `.reel-slot` de `portfolio.html` por los videos verticales
      cuando estén subidos a Cloudflare.
- [ ] El formulario de contacto abre el cliente de mail del visitante (`mailto:`),
      no hay backend. Para un formulario real se puede usar un Cloudflare Worker.
- [ ] El CV en PDF **no** está en el repo a propósito (contiene domicilio y teléfono).
