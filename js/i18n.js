// Sergio Visgarra — Portfolio: traducción ES/EN
const I18N_DICT = {
  'h.eyebrow': { es: 'Diseñador Digital', en: 'Digital Designer' },
  'h.meta': { es: 'Puedo arrancar ya, híbrido o <span class="accent-text">100% remoto</span>', en: 'Available now, hybrid or <span class="accent-text">100% remote</span>' },
  'h.cta.portfolio': { es: 'Ver portfolio', en: 'View portfolio' },
  'h.cta.contact': { es: 'Contactar', en: 'Contact' },
  'h.cta.cv': { es: 'Descargar CV (.pdf)', en: 'Download CV (.pdf)' },

  'sk.eyebrow': { es: '/ Lo que hago', en: '/ What I do' },
  'sk.h2': { es: 'Áreas <span class="accent-text">de trabajo</span>', en: 'Areas <span class="accent-text">of work</span>' },
  'sk.lead': { es: 'Hace 14 años que voy del diseño de una pieza gráfica al render de un stand comercial, con IA generativa en el medio todos los días.', en: 'For 14 years I’ve gone from designing a print piece to rendering a commercial stand, with generative AI in the mix every day.' },

  'sk1.tag': { es: 'Punto de venta &amp; comunicación', en: 'Point of sale &amp; communication' },
  'sk1.title': { es: '01. Diseño Gráfico', en: '01. Graphic Design' },
  'sk1.desc': { es: 'Piezas para punto de venta y comunicación de marca: folletería, stickers, cartelería y arquigrafía.', en: 'Point-of-sale and brand communication pieces: flyers, stickers, signage and architectural graphics.' },

  'sk2.tag': { es: 'Landings &amp; sitios', en: 'Landings &amp; sites' },
  'sk2.title': { es: '02. Diseño Web', en: '02. Web Design' },
  'sk2.desc': { es: 'Sitios y landing pages responsive, catálogos y link-in-bio listos para publicar.', en: 'Responsive sites and landing pages, catalogs and link-in-bio pages ready to publish.' },

  'sk3.tag': { es: 'Prototipado', en: 'Prototyping' },
  'sk3.desc': { es: 'Dashboards y prototipos funcionales de apps, pensados desde el flujo real de uso.', en: 'Dashboards and functional app prototypes, designed around real usage flow.' },

  'sk4.tag': { es: 'Montajes para retail', en: 'Retail visualizations' },
  'sk4.desc': { es: 'Montajes y visualizaciones 3D de locales y stands comerciales, piezas audiovisuales y motion.', en: '3D visualizations of stores and commercial stands, plus audiovisual and motion pieces.' },

  'sk5.tag': { es: 'Flujo diario', en: 'Daily workflow' },
  'sk5.title': { es: '05. IA Generativa', en: '05. Generative AI' },
  'sk5.desc': { es: 'Diseño y generación de imágenes y video con IA, como una herramienta más del día a día.', en: 'Design and image/video generation with AI, as just another everyday tool.' },

  'sk6.tag': { es: 'Proyecto personal', en: 'Personal project' },
  'sk6.desc': { es: 'Modelado y texturizado de personajes, como exploración personal fuera del trabajo diario.', en: 'Character modeling and texturing, a personal exploration outside daily work.' },

  'sk.visual.role': { es: 'Diseñador Gráfico &amp; Web', en: 'Graphic &amp; Web Designer' },
  'sk.visual.back': { es: 'Trabajemos juntos', en: 'Let’s work together' },

  'st.text': { es: 'Diseño para generar una mejor comunicación creativa en distintos rubros de Latinoamérica.', en: 'I design to build better creative communication across different industries in Latin America.' },

  'ab.eyebrow': { es: '/ Sobre mí', en: '/ About me' },
  'ab.h2': { es: 'Creativo <span class="accent-text">de fondo</span>', en: 'A creative <span class="accent-text">at heart</span>' },
  'ab.text': { es: 'Ahora mismo ando metido en el diseño de personajes 3D y el vibecoding. Las uso para ayudar a pequeñas empresas a resolver el día a día, tanto en lo visual como en la forma de trabajar.', en: 'Right now I’m deep into 3D character design and vibecoding. I use them to help small businesses solve their day-to-day, both visually and in how they work.' },

  'pf.eyebrow': { es: '/ Proyectos', en: '/ Projects' },
  'pf.h2': { es: 'Trabajo <span class="accent-text">seleccionado</span>', en: 'Selected <span class="accent-text">work</span>' },
  'pf.viewall': { es: 'Portfolio completo →', en: 'Full portfolio →' },

  'proj.icondigital.tag': { es: 'Landing de agencia', en: 'Agency landing page' },
  'proj.icondigital.featured': { es: 'Landing completa para una agencia de marketing digital: identidad, textos y el orden de las secciones para llevar al visitante hasta el contacto.', en: 'Full landing page for a digital marketing agency: identity, copy and section flow designed to lead the visitor to contact.' },
  'proj.icondigital.stack': { es: 'Diseño Web · UX/UI · Branding', en: 'Web Design · UX/UI · Branding' },
  'proj.icondigital.grid': { es: 'Landing de agencia de marketing digital.', en: 'Landing page for a digital marketing agency.' },

  'proj.waldo.tag': { es: 'Catálogo 3D + WhatsApp', en: '3D Catalog + WhatsApp' },
  'proj.waldo.featured': { es: 'Catálogo de decoración impresa en 3D con pedidos por WhatsApp. Más de 50 productos, con renders propios.', en: '3D-printed decor catalog with WhatsApp ordering. Over 50 products, with original renders.' },
  'proj.waldo.stack': { es: 'Diseño Web · 3D · E-commerce', en: 'Web Design · 3D · E-commerce' },
  'proj.waldo.grid': { es: 'Catálogo 3D-print con pedidos por WhatsApp.', en: '3D-print catalog with WhatsApp ordering.' },

  'proj.mesacontenido.idx': { es: 'Panel de gestión de equipo y contenido para el estudio Icon Digital.', en: 'Team and content management panel for the Icon Digital studio.' },
  'proj.mesacontenido.grid': { es: 'Panel de gestión de equipo y contenido.', en: 'Team and content management panel.' },

  'proj.tiapote.idx': { es: 'Link-in-bio para pastelería moderna: pedidos, consultas y redes en un solo lugar.', en: 'Link-in-bio for a modern bakery: orders, inquiries and social links in one place.' },
  'proj.tiapote.grid': { es: 'Link-in-bio para pastelería moderna.', en: 'Link-in-bio for a modern bakery.' },

  'proj.feriasrauch.idx': { es: 'Link-in-bio para consignataria de hacienda: sucursales y contacto directo por WhatsApp.', en: 'Link-in-bio for a livestock auction house: branches and direct WhatsApp contact.' },
  'proj.feriasrauch.grid': { es: 'Link-in-bio para consignataria de hacienda.', en: 'Link-in-bio for a livestock auction house.' },

  'pf.sub.tag': { es: 'De mi Behance', en: 'From my Behance' },
  'pf.sub.h3': { es: 'Piezas y conceptos', en: 'Pieces &amp; concepts' },

  'pf.soon.badge': { es: 'Próximamente', en: 'Coming soon' },
  'pf.soon.title': { es: 'Piezas gráficas &amp; arquigrafía', en: 'Print pieces &amp; architectural graphics' },
  'pf.soon.desc': { es: 'Trabajo impreso real: cartelería, señalética y gráfica de punto de venta. Estoy subiendo las fotos a mi Behance.', en: 'Real printed work: signage and point-of-sale graphics. I’m uploading the photos to my Behance.' },

  'proj.puma.idx': { es: 'Concepto de home minimalista para e-commerce de indumentaria deportiva.', en: 'Minimalist homepage concept for a sportswear e-commerce site.' },
  'proj.puma.pf': { es: 'Concepto de home minimalista para e-commerce.', en: 'Minimalist e-commerce homepage concept.' },

  'proj.irishbakers.idx': { es: 'Landing para panadería artesanal: identidad, pedido online y catálogo de productos.', en: 'Landing page for an artisan bakery: identity, online ordering and product catalog.' },
  'proj.irishbakers.pf': { es: 'Landing para panadería artesanal.', en: 'Landing page for an artisan bakery.' },

  'proj.donraul.idx': { es: 'Identidad de marca y web de pedidos para una rotisería.', en: 'Brand identity and ordering site for a rotisería (deli).' },
  'proj.donraul.pf': { es: 'Identidad de marca y web de pedidos.', en: 'Brand identity and ordering site.' },

  'proj.electric.idx': { es: 'Render 3D para probar tipografía e iluminación.', en: '3D render to test typography and lighting.' },
  'proj.electric.pf': { es: 'Render 3D explorando tipografía e iluminación.', en: '3D render exploring typography and lighting.' },

  'proj.socialmedia.idx': { es: 'Flyers y piezas para redes de Kawasaki Navarro, SYM y UnoMotos.', en: 'Social media flyers for Kawasaki Navarro, SYM and UnoMotos.' },
  'proj.socialmedia.pf': { es: 'Flyers para Kawasaki Navarro, SYM y UnoMotos.', en: 'Flyers for Kawasaki Navarro, SYM and UnoMotos.' },

  'proj.videos.idx': { es: 'Reel de edición: motion, cortes y color para piezas de redes.', en: 'Editing reel: motion, cuts and color for social media pieces.' },
  'proj.videos.pf': { es: 'Reel de edición: motion, cortes y color.', en: 'Editing reel: motion, cuts and color.' },

  'proj.gamestorrent': { es: 'Concepto de UI para app de videojuegos.', en: 'UI concept for a video game app.' },
  'proj.infomusic': { es: 'Concepto de app/sitio sobre discografías.', en: 'App/site concept about music discographies.' },
  'proj.publicity': { es: 'Pieza publicitaria para Claro.', en: 'Ad piece for Claro.' },
  'proj.socialads': { es: 'Piezas de campaña para retail.', en: 'Campaign pieces for retail.' },

  'd3.eyebrow': { es: '/ Proyecto personal', en: '/ Personal project' },
  'd3.h2': { es: '3D <span class="accent-text">como hobby</span>', en: '3D <span class="accent-text">as a hobby</span>' },
  'd3.text': { es: 'Por fuera del trabajo vengo metiéndome en modelado y texturizado de personajes con ZBrush y Substance Painter. Todavía es un juego más que un servicio, pero el proceso de cada pieza lo voy subiendo a mi Behance.', en: 'Outside of work I’ve been getting into character modeling and texturing with ZBrush and Substance Painter. It’s still more of a hobby than a service, but I’m uploading the process for each piece to my Behance.' },
  'd3.cta': { es: 'Ver el proceso en Behance ↗', en: 'See the process on Behance ↗' },
  'd3.note.tag': { es: 'En desarrollo', en: 'In progress' },
  'd3.note.text': { es: 'La estoy armando de a poco. Voy a ir subiendo capturas del proceso a medida que termino piezas.', en: 'I’m building it up little by little. I’ll post process captures as I finish pieces.' },

  'ex.eyebrow': { es: '/ Trayectoria', en: '/ Background' },
  'ex.h2': { es: 'Mi <span class="accent-text">experiencia</span>', en: 'My <span class="accent-text">experience</span>' },

  'ex.job1.title': { es: 'Diseñador Gráfico y Web Freelance', en: 'Freelance Graphic &amp; Web Designer' },
  'ex.job1.company': { es: 'Trabajo independiente — Workana, Fiverr, contacto directo', en: 'Independent work — Workana, Fiverr, direct contact' },
  'ex.job1.date': { es: '2012 — Presente', en: '2012 — Present' },

  'ex.job2.title': { es: 'Diseñador Gráfico', en: 'Graphic Designer' },
  'ex.job2.date': { es: 'Jun. 2021 — Ago. 2026', en: 'Jun. 2021 — Aug. 2026' },

  'ex.job3.title': { es: 'Diseñador Gráfico / Web / UX-UI', en: 'Graphic / Web / UX-UI Designer' },
  'ex.job3.date': { es: 'Ago. 2020 — Ago. 2026', en: 'Aug. 2020 — Aug. 2026' },

  'ex.job4.title': { es: 'Diseñador Gráfico / Web', en: 'Graphic / Web Designer' },
  'ex.job4.date': { es: 'Ago. 2016 — Jul. 2020', en: 'Aug. 2016 — Jul. 2020' },
  'ex.job5.date': { es: 'Dic. 2015 — Jun. 2016', en: 'Dec. 2015 — Jun. 2016' },
  'ex.job6.company': { es: 'SoulFire — pasantía', en: 'SoulFire — internship' },
  'ex.job6.date': { es: 'Oct. — Dic. 2015', en: 'Oct. — Dec. 2015' },

  'co.eyebrow': { es: '/ Contacto', en: '/ Contact' },
  'co.h2': { es: 'Trabajemos <span class="accent-text">juntos</span>', en: 'Let’s work <span class="accent-text">together</span>' },
  'co.lead': { es: 'Contame de qué se trata y te respondo directo.', en: 'Tell me what it’s about and I’ll get back to you directly.' },

  'co.form.name.label': { es: 'Tu nombre *', en: 'Your name *' },
  'co.form.name.placeholder': { es: 'Nombre y apellido', en: 'First and last name' },
  'co.form.email.label': { es: 'Tu e-mail *', en: 'Your email *' },
  'co.form.status.legend': { es: 'Vos sos... *', en: 'You are... *' },
  'co.form.status.opt1': { es: 'Buscás talento (RRHH)', en: 'Looking for talent (HR)' },
  'co.form.status.opt2': { es: 'Tenés un proyecto freelance', en: 'You have a freelance project' },
  'co.form.message.label': { es: 'Contame más *', en: 'Tell me more *' },
  'co.form.message.placeholder': { es: '¿De qué se trata? Rol, proyecto, presupuesto, cuando lo necesitás...', en: 'What is it about? Role, project, budget, when you need it...' },
  'co.form.submit': { es: 'Enviar mensaje →', en: 'Send message →' },
  'co.form.note': { es: 'Te abre el mail con el mensaje ya escrito. Acá no se guarda nada.', en: 'This opens your mail app with the message already written. Nothing is stored here.' },

  'co.side.tag': { es: 'Directo', en: 'Direct' },
  'co.avail': { es: 'Puedo arrancar ya · Híbrido en CABA o 100% remoto', en: 'Available now · Hybrid in Buenos Aires or 100% remote' },

  'ct2.text': { es: 'Creemos algo juntos.', en: 'Let’s create something together.' },

  'cv.title': { es: '¿Querés el CV en PDF?', en: 'Want the CV in PDF?' },
  'cv.note': { es: 'La versión completa, para leer tranquilo o guardártela.', en: 'The full version, to read at your own pace or keep for later.' },
  'cv.btn': { es: 'Descargar CV en PDF', en: 'Download CV (PDF)' },

  'md.viewlive': { es: 'Ver en vivo ↗', en: 'View live ↗' },

  'dk.about': { es: 'Sobre mí', en: 'About' },
  'dk.experience': { es: 'Experiencia', en: 'Experience' },
  'dk.contact': { es: 'Contactar', en: 'Contact' },

  'ph.eyebrow': { es: '/ Portfolio completo', en: '/ Full portfolio' },
  'ph.h1': { es: 'Todos <span class="accent-text">los proyectos</span>', en: 'All <span class="accent-text">the projects</span>' },
  'ph.lead': { es: 'Sitios, dashboards, catálogos, piezas de marca, social media y 3D. Lo más pulido está en la <a href="index.html#portfolio" class="inline-link">página principal</a>.', en: 'Sites, dashboards, catalogs, brand pieces, social media and 3D. The most polished work is on the <a href="index.html#portfolio" class="inline-link">main page</a>.' },

  'pw.eyebrow': { es: '/ Sitios propios', en: '/ My own sites' },
  'pw.h2': { es: 'Web <span class="accent-text">&amp; GitHub</span>', en: 'Web <span class="accent-text">&amp; GitHub</span>' },

  'pb.eyebrow': { es: '/ Piezas y conceptos', en: '/ Pieces &amp; concepts' },
  'pb.h2': { es: 'De mi <span class="accent-text">Behance</span>', en: 'From my <span class="accent-text">Behance</span>' },

  'pr.eyebrow': { es: '/ Edición de video', en: '/ Video editing' },
  'pr.h2': { es: 'Reel <span class="accent-text">vertical</span>', en: 'Vertical <span class="accent-text">reel</span>' },
  'pr.lead': { es: 'Cortos de edición (After Effects, Premiere, CapCut). Los voy a ir sumando acá a medida que los suba.', en: 'Short edits (After Effects, Premiere, CapCut). I’ll add them here as I upload them.' },
};

(function () {
  const root = document.documentElement;
  let lang = 'es';
  try { lang = localStorage.getItem('lang') === 'en' ? 'en' : 'es'; } catch (e) {}

  function applyLang(newLang) {
    lang = newLang;
    root.setAttribute('lang', lang === 'en' ? 'en' : 'es');
    if (lang === 'en') root.setAttribute('data-lang', 'en');
    else root.removeAttribute('data-lang');

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const entry = I18N_DICT[key];
      if (!entry) return;
      el.innerHTML = entry[lang] || entry.es;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      const entry = I18N_DICT[key];
      if (!entry) return;
      el.setAttribute('placeholder', entry[lang] || entry.es);
    });

    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
      const label = langToggle.querySelector('.lang-toggle-label');
      if (label) label.textContent = lang === 'en' ? 'EN' : 'ES';
      langToggle.setAttribute('aria-label', lang === 'en' ? 'Cambiar a español' : 'Switch to English');
    }
  }

  window.i18nGetLang = () => lang;
  window.i18nApply = applyLang;

  document.addEventListener('DOMContentLoaded', () => {
    applyLang(lang);
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
      langToggle.addEventListener('click', () => {
        const next = window.i18nGetLang() === 'en' ? 'es' : 'en';
        try { localStorage.setItem('lang', next); } catch (e) {}
        applyLang(next);
      });
    }
  });
})();
