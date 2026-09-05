// Sergio Visgarra — Portfolio
document.getElementById('year').textContent = new Date().getFullYear();

/* ---- theme toggle (claro/oscuro) ---- */
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  const root = document.documentElement;
  const syncLabel = () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    themeToggle.setAttribute('aria-label', isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
  };
  syncLabel();
  themeToggle.addEventListener('click', () => {
    const goingLight = root.getAttribute('data-theme') !== 'light';
    if (goingLight) {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    try { localStorage.setItem('theme', goingLight ? 'light' : 'dark'); } catch (e) {}
    syncLabel();
  });
}

/* ---- active dock item on scroll ---- */
const sections = document.querySelectorAll('section[id], header[id]');
const dockItems = document.querySelectorAll('.dock-item[data-section]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      dockItems.forEach((item) => {
        item.classList.toggle('active', item.dataset.section === id);
      });
    }
  });
}, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

sections.forEach((s) => observer.observe(s));

/* ---- reveal-on-scroll ---- */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

revealEls.forEach((el) => revealObserver.observe(el));

/* ===================================================================
   SCROLL ANIMATIONS
   - ?motion=on  → forces animations on even if the OS asks to reduce motion
   - ?motion=off → forces them off
   - ?debug=1    → shows a diagnostic panel
   =================================================================== */
const params = new URLSearchParams(location.search);
const motionParam = params.get('motion');
const osWantsReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const animationsEnabled = motionParam !== 'off';
// El giro de la tarjeta es un elemento chico y contenido (no hay parallax ni
// desplazamiento de página), así que se mantiene en 3D salvo que se pida ?motion=off.
const flipIn3D = animationsEnabled;

const hasGsap = !!(window.gsap && window.ScrollTrigger);
if (hasGsap) gsap.registerPlugin(ScrollTrigger);

/* NOTA: el fondo del hero (antes un canvas 2D de constelación acá mismo)
   ahora es la galaxia en Three.js de js/galaxy.js, fija detrás de todo
   el sitio en vez de limitada al hero. */

const flipCard = document.getElementById('skillsFlipCard');
const skillsGrid = document.querySelector('.skills-grid');

/* helper: 0→1 progress of how far we've scrolled through [startPx, endPx] */
const clamp01 = (n) => Math.min(Math.max(n, 0), 1);

const cardFront = document.querySelector('.skills-visual-front');
const cardBack = document.querySelector('.skills-visual-back');
if (!flipIn3D && flipCard) flipCard.classList.add('is-flat'); // cross-fade faces instead of rotating

/* ---- the card turns over to "Trabajemos juntos" ----
   (antes esto vivía junto con el traspaso de la foto del hero, que se sacó al
   sacar la foto del hero; el giro de la tarjeta queda como efecto independiente).
   El rango se define con `+=` y un mínimo garantizado. Con `end:'bottom bottom'`
   el rango colapsaba a 0 en ventanas más altas que la grilla (pantallas grandes),
   y el giro no llegaba a ejecutarse nunca. */
if (animationsEnabled && flipCard && skillsGrid) {
  if (hasGsap) {
    const flipST = {
      trigger: skillsGrid,
      start: 'top top',
      end: () => '+=' + Math.max(600, skillsGrid.offsetHeight - window.innerHeight),
      scrub: 0.3,
      invalidateOnRefresh: true,
    };
    if (flipIn3D) {
      gsap.fromTo(flipCard, { rotateY: 0 }, { rotateY: 180, ease: 'none', scrollTrigger: flipST });
    } else if (cardFront && cardBack) {
      gsap.timeline({ scrollTrigger: flipST })
        .fromTo(cardFront, { opacity: 1 }, { opacity: 0, ease: 'none' }, 0)
        .fromTo(cardBack, { opacity: 0 }, { opacity: 1, ease: 'none' }, 0);
    }
  } else {
    /* ---- vanilla fallback: same effect without GSAP ---- */
    console.warn('[portfolio] GSAP no disponible — usando animaciones en JS puro.');
    let ticking = false;
    const render = () => {
      ticking = false;
      // mismo mínimo garantizado que en la versión GSAP, si no en ventanas
      // altas el divisor quedaba en 0 o negativo y no giraba nunca
      const gridRect = skillsGrid.getBoundingClientRect();
      const scrollable = Math.max(600, gridRect.height - window.innerHeight);
      const flip = clamp01(-gridRect.top / scrollable);
      if (flipIn3D) {
        flipCard.style.transform = `rotateY(${flip * 180}deg)`;
      } else if (cardFront && cardBack) {
        cardFront.style.opacity = String(1 - flip);
        cardBack.style.opacity = String(flip);
      }
    };
    const onScroll = () => {
      if (!ticking) { requestAnimationFrame(render); ticking = true; }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    render();
  }
}

/* ===================================================================
   STATEMENT — words light up one by one as you scroll through the line
   (se aplica a todo .word-reveal, hay más de una frase con este efecto)
   =================================================================== */
document.querySelectorAll('.word-reveal').forEach((textEl) => {
  if (!animationsEnabled) return;
  // wrap every word in its own span (keeps the HTML clean and the text selectable)
  const words = textEl.textContent.trim().split(/\s+/);
  textEl.innerHTML = words.map((w) => `<span class="word">${w}</span>`).join(' ');
  const wordEls = textEl.querySelectorAll('.word');

  if (hasGsap) {
    gsap.to(wordEls, {
      opacity: 1,
      ease: 'none',
      stagger: 1,
      scrollTrigger: {
        trigger: textEl,
        start: 'top 80%',
        // rango explícito con mínimo garantizado: con 'bottom 55%' se achicaba
        // demasiado (o se invertía) en ventanas bajas
        end: () => '+=' + Math.max(420, textEl.offsetHeight + window.innerHeight * 0.2),
        scrub: 0.25,
        invalidateOnRefresh: true,
      },
    });
  } else {
    let ticking = false;
    const render = () => {
      ticking = false;
      const rect = textEl.getBoundingClientRect();
      const vh = window.innerHeight;
      const span = Math.max(420, textEl.offsetHeight + vh * 0.2);
      const progress = clamp01((vh * 0.8 - rect.top) / span);
      const lit = progress * wordEls.length;
      wordEls.forEach((el, i) => {
        el.style.opacity = i < lit ? '1' : '0.16';
      });
    };
    const onScroll = () => {
      if (!ticking) { requestAnimationFrame(render); ticking = true; }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    render();
  }
});

/* NOTA: el desenfoque de los títulos de sección se quitó a pedido —
   el único blur que queda es el del dock, hecho en CSS con backdrop-filter. */

/* ---- diagnostic panel (?debug=1) ---- */
if (params.get('debug') === '1') {
  const panel = document.createElement('div');
  panel.style.cssText =
    'position:fixed;top:10px;left:10px;z-index:9999;background:#000;color:#0f0;' +
    'font:12px/1.5 monospace;padding:12px 14px;border:1px solid #0f0;border-radius:8px;max-width:340px;';
  document.body.appendChild(panel);
  const paint = () => {
    const st = window.ScrollTrigger ? ScrollTrigger.getAll() : [];
    panel.innerHTML =
      `GSAP cargado: <b>${!!window.gsap}</b><br>` +
      `ScrollTrigger cargado: <b>${!!window.ScrollTrigger}</b><br>` +
      `OS pide reducir movimiento: <b>${osWantsReducedMotion}</b><br>` +
      `Animaciones activas: <b>${animationsEnabled}</b><br>` +
      `ScrollTriggers creados: <b>${st.length}</b><br>` +
      st.map((s, i) => `  [${i}] progreso: ${s.progress.toFixed(2)}`).join('<br>') +
      `<br>scrollY: ${Math.round(window.scrollY)}<br>` +
      `tarjeta: ${flipCard ? getComputedStyle(flipCard).transform.slice(0, 28) : '—'}`;
  };
  paint();
  window.addEventListener('scroll', paint, { passive: true });
}

/* ---- "Ver más" toggle for the About text (only shown if it actually overflows 6 lines) ---- */
const aboutText = document.getElementById('aboutText');
const aboutMoreBtn = document.getElementById('aboutMoreBtn');
if (aboutText && aboutMoreBtn) {
  const checkOverflow = () => {
    const overflowing = aboutText.scrollHeight > aboutText.clientHeight + 2;
    aboutMoreBtn.hidden = !overflowing && !aboutText.classList.contains('is-expanded');
  };
  window.addEventListener('load', checkOverflow);
  window.addEventListener('resize', checkOverflow);
  checkOverflow();
  aboutMoreBtn.addEventListener('click', () => {
    const expanded = aboutText.classList.toggle('is-expanded');
    aboutMoreBtn.textContent = expanded ? 'Ver menos ↑' : 'Ver más ↓';
  });
}

/* ---- contact form -> mailto (static site, no backend) ---- */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const nombre = data.get('nombre');
    const email = data.get('email');
    const status = data.get('status');
    const mensaje = data.get('mensaje');

    const subject = `Portfolio — ${status} — ${nombre}`;
    const body =
      `Nombre: ${nombre}\n` +
      `E-mail: ${email}\n` +
      `Perfil: ${status}\n\n` +
      `Mensaje:\n${mensaje}`;

    window.location.href =
      `mailto:sergio_visgarra@hotmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
