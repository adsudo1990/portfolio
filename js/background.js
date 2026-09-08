// Sergio Visgarra — Portfolio
// Fondo de campo de partículas ondulado (referencia: malla de puntos cyan
// formando olas, tipo terreno de datos) fijo detrás de todo el sitio,
// reemplaza a la galaxia anterior. La malla se mueve sola (olas viajando) y
// además avanza sutilmente al scrollear. El mouse aparta las partículas
// cercanas en un pequeño radio (por eso no es un mesh sólido: son puntos
// sueltos que se pueden separar). Cada sección sube como un panel con tilt
// 3D al entrar en vista — la referencia visual es el crawl de Star Wars,
// eso no cambió.
//
// Todo esto es progresivo: si Three.js no cargó, si se pidió ?motion=off o
// si el tema está en claro, el sitio se queda con los fondos sólidos de
// siempre (ver las reglas .galaxy-active en css/style.css — el nombre de la
// clase quedó de la versión anterior, pero ahora activa este fondo).
(function () {
  const canvas = document.getElementById('galaxyCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const params = new URLSearchParams(location.search);
  const animationsEnabled = params.get('motion') !== 'off';
  if (!animationsEnabled) return;

  const root = document.documentElement;
  const isLight = () => root.getAttribute('data-theme') === 'light';
  const clamp01 = (n) => Math.min(Math.max(n, 0), 1);
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---- escena ---- */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  // más baja y mirando más "de frente" que desde arriba: a ras del terreno
  // las crestas se recortan unas contra otras (como en la referencia) en vez
  // de verse como un plano con textura
  camera.position.set(0, 1.5, 6.5);
  camera.lookAt(0, 0.2, -14);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) {
    return; // sin WebGL disponible, se queda con el fondo sólido de siempre
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  /* ---- textura de punto redondo: sin esto, los Points de Three.js se
     dibujan como cuadrados ---- */
  function makeDotTexture() {
    const size = 64;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const cx = c.getContext('2d');
    const grad = cx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.35, 'rgba(255,255,255,.85)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    cx.fillStyle = grad;
    cx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(c);
  }
  const dotTexture = makeDotTexture();

  /* ---- malla de puntos: grilla plana en XZ, cada punto se levanta en Y
     según una suma de senoidales (da el patrón de olas/crestas de la
     referencia sin necesitar una librería de ruido aparte) ---- */
  // +30% de partículas (125x89 ≈ 110x70 * 1.3) — el juego con el mouse se
  // luce más con una malla más densa
  const GRID_COLS = 125;
  const GRID_ROWS = 89;
  const GRID_W = 34; // ancho total en unidades de mundo
  const GRID_D = 46; // profundidad: se extiende hacia -Z, lejos de cámara
  const count = GRID_COLS * GRID_ROWS;

  const basePos = new Float32Array(count * 2); // (x, z) fijos, no cambian
  const positions = new Float32Array(count * 3); // (x, y, z) — y se anima
  const colors = new Float32Array(count * 3);

  for (let iz = 0; iz < GRID_ROWS; iz++) {
    for (let ix = 0; ix < GRID_COLS; ix++) {
      const i = iz * GRID_COLS + ix;
      const x = (ix / (GRID_COLS - 1) - 0.5) * GRID_W;
      const z = -(iz / (GRID_ROWS - 1)) * GRID_D + 3; // arranca un poco por delante de la cámara
      basePos[i * 2] = x;
      basePos[i * 2 + 1] = z;
      positions[i * 3] = x;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = z;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    map: dotTexture,
    size: 0.11,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    transparent: true,
  });
  const field = new THREE.Points(geometry, material);
  scene.add(field);

  // paleta de marca: valle oscuro → cresta brillante (mismos colores que
  // veníamos usando: teal claro y el accent, sobre una base casi negra)
  const deepColor = new THREE.Color('#0c1a2e');
  const midColor = new THREE.Color('#35dcc6');
  const peakColor = new THREE.Color('#c8fff6');
  const AMPLITUDE = 1.5; // suma máxima aproximada de las 3 senoidales de abajo (bajó junto con el movimiento, más leve)

  /* ---- dispersión con el mouse: raycast contra el plano y=0 para saber en
     qué punto del "piso" está apuntando el cursor, y apartar las partículas
     cercanas radialmente (no es un bump para arriba, es un "hueco" en la
     malla, que es lo que pidió: que se "esparzan") ---- */
  const raycaster = new THREE.Raycaster();
  const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const mouseNDC = new THREE.Vector2(-2, -2);
  let mouseWorld = null;
  const MOUSE_RADIUS = 3.2;
  const MOUSE_PUSH = 1.6;

  if (hasFinePointer) {
    window.addEventListener('mousemove', (e) => {
      mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    document.addEventListener('mouseleave', () => { mouseNDC.set(-2, -2); });
  }

  /* ---- scroll: progreso 0→1 de toda la página ---- */
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
  const clock = new THREE.Clock();
  let elapsedTotal = 0;
  const posAttr = geometry.attributes.position;
  const colorAttr = geometry.attributes.color;

  function tick() {
    const delta = Math.min(clock.getDelta(), 0.1);
    elapsedTotal += delta;

    // el scroll suma fase a la ola: al bajar la página, el patrón fluye un
    // poco más rápido durante ese tramo — "se mueve sutilmente" con el scroll
    // en vez de solo con el tiempo
    const p = scrollProgress();
    const t = elapsedTotal + p * 6;

    // mouse → mundo, sobre el plano y=0 (solo con puntero fino)
    if (hasFinePointer && mouseNDC.x > -1.5) {
      raycaster.setFromCamera(mouseNDC, camera);
      const hit = new THREE.Vector3();
      mouseWorld = raycaster.ray.intersectPlane(groundPlane, hit) ? hit : null;
    } else {
      mouseWorld = null;
    }

    for (let i = 0; i < count; i++) {
      const x = basePos[i * 2];
      const z = basePos[i * 2 + 1];
      const h =
        Math.sin(x * 0.35 + t * 0.42) * 0.7 +
        Math.sin(z * 0.22 - t * 0.55) * 0.5 +
        Math.sin((x + z) * 0.16 + t * 0.25) * 0.25;

      let px = x;
      let pz = z;
      if (mouseWorld) {
        const dx = x - mouseWorld.x;
        const dz = z - mouseWorld.z;
        const d = Math.sqrt(dx * dx + dz * dz);
        if (d < MOUSE_RADIUS && d > 0.0001) {
          const falloff = 1 - d / MOUSE_RADIUS;
          const push = (falloff * falloff) * MOUSE_PUSH;
          px += (dx / d) * push;
          pz += (dz / d) * push;
        }
      }

      const i3 = i * 3;
      posAttr.array[i3] = px;
      posAttr.array[i3 + 1] = h;
      posAttr.array[i3 + 2] = pz;

      const tone = clamp01((h + AMPLITUDE) / (AMPLITUDE * 2));
      const c = tone < 0.5 ? deepColor.clone().lerp(midColor, tone * 2) : midColor.clone().lerp(peakColor, (tone - 0.5) * 2);
      colorAttr.array[i3] = c.r;
      colorAttr.array[i3 + 1] = c.g;
      colorAttr.array[i3 + 2] = c.b;
    }
    posAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;

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
