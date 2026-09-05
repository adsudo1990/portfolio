// Sergio Visgarra — Portfolio
// Fondo de galaxia con Three.js: reemplaza el fondo plano del sitio por un
// campo de partículas en espiral (estilo Vía Láctea) fijo detrás de todo el
// contenido. A medida que se scrollea toda la página, la cámara se acerca al
// centro de la galaxia. Cada sección (menos el Hero, que queda flotando
// directo sobre la galaxia, y Skills, que ya tiene su propio efecto de
// tarjetas apiladas con position:sticky) sube como un panel de vidrio con
// un tilt 3D — la referencia visual es el crawl de la intro de Star Wars.
//
// Todo esto es progresivo: si Three.js no cargó, si se pidió ?motion=off o
// si el tema está en claro, el sitio se queda con los fondos sólidos de
// siempre (ver las reglas .galaxy-active en css/style.css).
(function () {
  const canvas = document.getElementById('galaxyCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const params = new URLSearchParams(location.search);
  const animationsEnabled = params.get('motion') !== 'off';
  if (!animationsEnabled) return;

  const root = document.documentElement;
  const isLight = () => root.getAttribute('data-theme') === 'light';
  const clamp01 = (n) => Math.min(Math.max(n, 0), 1);

  /* ---- escena ---- */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0.6, 9);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) {
    return; // sin WebGL disponible, se queda con el fondo sólido de siempre
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  /* ---- generador de galaxia espiral (variación del algoritmo clásico de
     Three.js Journey/"galaxy generator"), con la paleta de marca en vez de
     colores realistas ---- */
  const g = {
    count: 13000,
    // lo bastante grandes para sobrevivir al blur del CSS, pero no tanto que
    // al acercarse la cámara se vean como bloques en vez de puntos
    size: 0.028,
    // radio chico = galaxia compacta, que entra entera en cuadro desde arriba
    radius: 3.6,
    branches: 4,
    spin: 1.3,
    randomness: 0.35,
    randomnessPower: 3,
    insideColor: new THREE.Color('#8FF3E4'),
    outsideColor: new THREE.Color('#1B2A63'),
  };

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(g.count * 3);
  const colors = new Float32Array(g.count * 3);

  for (let i = 0; i < g.count; i++) {
    const i3 = i * 3;
    const radius = Math.random() * g.radius;
    const spinAngle = radius * g.spin;
    const branchAngle = ((i % g.branches) / g.branches) * Math.PI * 2;

    const rand = (scale) => Math.pow(Math.random(), g.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * g.randomness * radius * scale;
    const randomX = rand(1);
    const randomY = rand(0.4);
    const randomZ = rand(1);

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    const mixedColor = g.insideColor.clone().lerp(g.outsideColor, radius / g.radius);
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: g.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    transparent: true,
  });

  const galaxy = new THREE.Points(geometry, material);
  galaxy.rotation.x = 0.35;
  scene.add(galaxy);

  /* ---- estrellas dispersas detrás de la galaxia, para dar profundidad ---- */
  const starCount = 800;
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i++) starPositions[i] = (Math.random() - 0.5) * 40;
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const stars = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({ size: 0.02, color: 0xffffff, transparent: true, opacity: 0.5, depthWrite: false })
  );
  scene.add(stars);

  /* ---- scroll: progreso 0→1 de toda la página, no solo del hero ---- */
  function scrollProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? clamp01(window.scrollY / max) : 0;
  }

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', resize);

  let raf = null;
  let targetZ = camera.position.z;
  let lastBlur = null;
  const MAX_BLUR = 2.5; // en px, igual al valor por defecto del CSS
  const clock = new THREE.Clock();

  function tick() {
    const elapsed = clock.getElapsedTime();
    galaxy.rotation.y = elapsed * 0.035;
    stars.rotation.y = elapsed * 0.008;

    // acercamiento progresivo a la galaxia a medida que se scrollea toda la página
    const p = scrollProgress();
    // de z=9 (lejos, en el Hero) a z=4.2 (cerca, pero sin meterse dentro del
    // disco: más cerca que eso las partículas se ven como bloques)
    targetZ = 9 - p * 4.8;
    camera.position.z += (targetZ - camera.position.z) * 0.06;
    camera.position.y = 0.6 - p * 0.3;
    camera.lookAt(0, 0, 0);

    // el desenfoque se va despejando con el zoom: arriba la galaxia es una
    // mancha en segundo plano, abajo se ve que está hecha de partículas
    const blur = Math.round(MAX_BLUR * (1 - p) * 10) / 10;
    if (blur !== lastBlur) {
      canvas.style.filter = blur > 0.05 ? `blur(${blur}px)` : 'none';
      lastBlur = blur;
    }

    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (isLight() || !animationsEnabled) return;
    canvas.hidden = false;
    root.classList.add('galaxy-active');
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function stop() {
    if (raf) { cancelAnimationFrame(raf); raf = null; }
    canvas.hidden = true;
    root.classList.remove('galaxy-active');
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (raf) { cancelAnimationFrame(raf); raf = null; } }
    else start();
  });

  // el tema se cambia con el botón del header (ver main.js); un MutationObserver
  // evita depender del orden en que se registran los listeners de click
  new MutationObserver(() => (isLight() ? stop() : start())).observe(root, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  /* ---- cada sección sube como un panel con tilt 3D al entrar en vista
     (Skills queda afuera: su tarjeta con position:sticky se rompería si el
     contenedor padre recibe un transform) ---- */
  function initCardReveals() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    const cards = document.querySelectorAll(
      '.section:not(#skills) > .wrap, .statement > .wrap, .page-header > .wrap'
    );
    cards.forEach((card) => {
      card.parentElement.style.perspective = '1200px';
      gsap.fromTo(
        card,
        { rotateX: 20, y: 90, opacity: 0.25, transformOrigin: '50% 100%' },
        {
          rotateX: 0,
          y: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: card, start: 'top 92%', end: 'top 45%', scrub: 0.4 },
        }
      );
    });
  }

  start();
  initCardReveals();
})();
