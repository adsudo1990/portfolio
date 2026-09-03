// Sergio Visgarra — Portfolio
document.getElementById('year').textContent = new Date().getFullYear();

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
// `fullMotion` gobierna el movimiento fuerte (escala/rotación del traspaso del hero),
// que sí puede molestar a quien pide reducir movimiento.
const fullMotion =
  motionParam === 'on' ? true :
  motionParam === 'off' ? false :
  !osWantsReducedMotion;
const animationsEnabled = motionParam !== 'off';
// El giro de la tarjeta es un elemento chico y contenido (no hay parallax ni
// desplazamiento de página), así que se mantiene en 3D salvo que se pida ?motion=off.
const flipIn3D = animationsEnabled;

const hasGsap = !!(window.gsap && window.ScrollTrigger);
if (hasGsap) gsap.registerPlugin(ScrollTrigger);

const heroEl = document.querySelector('.hero');
const heroPhoto = document.querySelector('.hero-photo');
const skillsVisual = document.querySelector('.skills-visual');
const flipCard = document.getElementById('skillsFlipCard');
const skillsGrid = document.querySelector('.skills-grid');

/* helper: 0→1 progress of how far we've scrolled through [startPx, endPx] */
const clamp01 = (n) => Math.min(Math.max(n, 0), 1);
const lerp = (a, b, t) => a + (b - a) * t;

const cardFront = document.querySelector('.skills-visual-front');
const cardBack = document.querySelector('.skills-visual-back');
if (!flipIn3D && flipCard) flipCard.classList.add('is-flat'); // cross-fade faces instead of rotating

if (animationsEnabled && heroEl && heroPhoto && skillsVisual && flipCard && skillsGrid) {
  if (hasGsap) {
    /* ---- 1. hero photo hands off into the skills card ---- */
    gsap.set([heroPhoto, skillsVisual], { transformOrigin: '50% 50%' });
    const handoff = gsap.timeline({
      scrollTrigger: {
        trigger: heroEl,
        start: () => 'top top-=' + heroEl.offsetHeight * 0.45,
        end: () => 'top top-=' + heroEl.offsetHeight * 1.05,
        scrub: 0.4,
        invalidateOnRefresh: true,
      },
    });
    if (fullMotion) {
      handoff
        .fromTo(heroPhoto, { scale: 1, rotate: 0, opacity: 1 }, { scale: 0.5, rotate: -14, opacity: 0, ease: 'none' }, 0)
        .fromTo(skillsVisual, { scale: 0.78, rotate: 10, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, ease: 'none' }, 0);
    } else {
      handoff
        .fromTo(heroPhoto, { opacity: 1 }, { opacity: 0, ease: 'none' }, 0)
        .fromTo(skillsVisual, { opacity: 0 }, { opacity: 1, ease: 'none' }, 0);
    }

    /* ---- 2. the card turns over to "Trabajemos juntos" ----
       El rango se define con `+=` y un mínimo garantizado. Con `end:'bottom bottom'`
       el rango colapsaba a 0 en ventanas más altas que la grilla (pantallas grandes),
       y el giro no llegaba a ejecutarse nunca. */
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
    /* ---- vanilla fallback: same two effects without GSAP ---- */
    console.warn('[portfolio] GSAP no disponible — usando animaciones en JS puro.');
    let ticking = false;
    const render = () => {
      ticking = false;
      const heroRect = heroEl.getBoundingClientRect();
      const heroH = heroEl.offsetHeight;
      const scrolledIntoHero = -heroRect.top;

      // 1. hand-off
      const handoff = clamp01((scrolledIntoHero - heroH * 0.45) / (heroH * 0.6));
      heroPhoto.style.opacity = String(1 - handoff);
      skillsVisual.style.opacity = String(handoff);
      if (fullMotion) {
        heroPhoto.style.transform = `scale(${lerp(1, 0.5, handoff)}) rotate(${lerp(0, -14, handoff)}deg)`;
        skillsVisual.style.transform = `scale(${lerp(0.78, 1, handoff)}) rotate(${lerp(10, 0, handoff)}deg)`;
      }

      // 2. turn the card over — mismo mínimo garantizado que en la versión GSAP,
      // si no en ventanas altas el divisor quedaba en 0 o negativo y no giraba nunca
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
   =================================================================== */
const statementText = document.getElementById('statementText');
if (statementText && animationsEnabled) {
  // wrap every word in its own span (keeps the HTML clean and the text selectable)
  const words = statementText.textContent.trim().split(/\s+/);
  statementText.innerHTML = words
    .map((w) => `<span class="word">${w}</span>`)
    .join(' ');
  const wordEls = statementText.querySelectorAll('.word');

  if (hasGsap) {
    gsap.to(wordEls, {
      opacity: 1,
      ease: 'none',
      stagger: 1,
      scrollTrigger: {
        trigger: statementText,
        start: 'top 80%',
        // rango explícito con mínimo garantizado: con 'bottom 55%' se achicaba
        // demasiado (o se invertía) en ventanas bajas
        end: () => '+=' + Math.max(420, statementText.offsetHeight + window.innerHeight * 0.2),
        scrub: 0.25,
        invalidateOnRefresh: true,
      },
    });
  } else {
    let ticking = false;
    const render = () => {
      ticking = false;
      const rect = statementText.getBoundingClientRect();
      const vh = window.innerHeight;
      const span = Math.max(420, statementText.offsetHeight + vh * 0.2);
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
}

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
      `foto hero: ${heroPhoto ? getComputedStyle(heroPhoto).opacity : '—'}<br>` +
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
