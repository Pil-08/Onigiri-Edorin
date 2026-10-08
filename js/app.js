/* ==========================================================================
   ONIGIRI EDORIN — app.js
   Idiomas (ES / EU / EN), horario en vivo (hora de Madrid), menú móvil,
   pase de fotos del inicio y el salto del onigiri.
   ========================================================================== */
(function () {
  'use strict';

  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };
  // Movimiento: manda el ajuste del sistema, salvo que el visitante lo cambie aqui
  var MOV_KEY = 'onigiri-movimiento';
  var movGuardado = null;
  try { movGuardado = localStorage.getItem(MOV_KEY); } catch (e) { movGuardado = null; }
  var motionOK = movGuardado ? movGuardado === 'on'
    : !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function guardaMovimiento(valor) {
    motionOK = valor === 'on';
    document.documentElement.setAttribute('data-movimiento', valor);
    try { localStorage.setItem(MOV_KEY, valor); } catch (e) {}
  }
  document.documentElement.setAttribute('data-movimiento', motionOK ? 'on' : 'off');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ------------------------------------------------------------------------
     Datos del negocio (Google Maps, sep-2026)
     ------------------------------------------------------------------------ */
  var SITE = { timezone: 'Europe/Madrid' };
  // d: 0 = domingo … 6 = sábado
  var HOURS = [
    { d: 1, ranges: [['11:00', '22:00']] },
    { d: 2, ranges: [['11:00', '22:00']] },
    { d: 3, ranges: [['11:00', '22:00']] },
    { d: 4, ranges: [['11:00', '22:00']] },
    { d: 5, ranges: [['11:00', '22:00']] },
    { d: 6, ranges: [['11:00', '22:00']] },
    { d: 0, ranges: [['11:00', '22:00']] }
  ];

  /* ------------------------------------------------------------------------
     Textos
     ------------------------------------------------------------------------ */
  var I18N = {
    es: {
      cta_glovo: 'Pedir por Glovo',
      c_glovo: 'Pedir a domicilio por Glovo',
      alt_ramen_coreano: 'Mesa con dos ramen coreanos recién hechos, onigiris y bebidas asiáticas',
      meta_title: 'Onigiri Edorin · Onigiris, sushi y ramen en Donostia',
      meta_desc: 'Onigiris y sushi preparados cada día y ramen coreano que te haces al momento. Reina Regente 4, Donostia. Abierto todos los días de 11:00 a 22:00.',
      skip: 'Saltar al contenido',
      nav_aria: 'Navegación principal',
      drawer_aria: 'Menú',
      brand_tag: 'Onigiris · sushi · ramen',
      nav_carta: 'Qué hay',
      nav_tienda: 'La tienda',
      nav_horario: 'Horario',
      nav_llegar: 'Cómo llegar',
      menu_open: 'Abrir menú',
      menu_close: 'Cerrar menú',
      drawer_social: 'Síguenos y encuéntranos',
      ig_aria: 'Instagram de Onigiri Edorin (se abre en otra pestaña)',
      hero_badge: 'Reina Regente 4 · Donostia',
      emblem_aria: 'Onigiri Edorin: pulsa el onigiri para que salte',
      hero_cat: 'Onigiris, sushi y ramen',
      hero_desc: 'Onigiris y sushi preparados cada día, y ramen coreano que te haces al momento. En el centro de Donostia, frente al Victoria Eugenia.',
      cta_llegar: 'Cómo llegar',
      cta_ig: 'Ver Instagram',
      status_checking: 'Comprobando horario…',
      status_open: 'Abierto ahora',
      status_closed: 'Cerrado ahora',
      closes_at: 'Cierra a las {h}',
      opens_at: 'Abre a las {h}',
      opens_tomorrow: 'Abre mañana a las {h}',
      opens_day: 'Abre el {d} a las {h}',
      kpi1_v: '4,5',
      kpi1_l: 'en Google',
      kpi2_v: '11:00–22:00',
      kpi2_l: 'todos los días',
      kpi3_v: 'Fresco',
      kpi3_l: 'hecho cada día',
      kpi4_v: 'Centro',
      kpi4_l: 'frente al Victoria Eugenia',
      fotos_pause: 'Parar el movimiento',
      fotos_play: 'Activar el movimiento',
      carta_eyebrow: 'Qué encontrarás',
      carta_title: 'Eliges en la vitrina y te lo llevas',
      carta_desc: 'Onigiris y sushi recién hechos, ramen que preparas tú en nuestra máquina y bebidas para acompañar. Todo listo para llevar.',
      p_onigiri_t: 'Onigiris',
      p_onigiri_d: 'Hechos a mano cada día. También hay opciones veganas.',
      p_sushi_t: 'Sushi',
      p_sushi_d: 'Nigiris, makis y bandejas surtidas.',
      p_sashimi_t: 'Sashimi',
      p_sashimi_d: 'Bandejas de salmón listas para llevar.',
      p_takoyaki_t: 'Takoyaki',
      p_takoyaki_d: 'Bolitas de pulpo con salsa y bonito seco.',
      p_inari_t: 'Inari',
      p_inari_d: 'Saquitos de tofu dulce rellenos de arroz, con toppings variados.',
      p_ramen_e: 'Hazlo tú',
      p_ramen_t: 'Ramen coreano',
      p_ramen_d: 'Elige tu ramen y prepáralo al momento en nuestra máquina.',
      p_dulces_t: 'Dulces japoneses',
      p_dulces_d: 'Taiyaki y dorayaki para el antojo dulce.',
      p_bebidas_t: 'Bebidas y snacks',
      p_bebidas_d: 'Refrescos y snacks asiáticos para acompañar.',
      alt_onigiri: 'Manos con guantes dando forma a un onigiri relleno de salmón',
      alt_sushi: 'Nigiri de salmón sujeto con palillos sobre una bandeja de sushi variado',
      alt_sashimi: 'Bandeja de sashimi de salmón con ensalada, cerrada y etiquetada',
      alt_takoyaki: 'Takoyaki con salsa y bonito seco sujeto con palillos',
      alt_inari: 'Inari rellenos de salmón con aguacate y mango, y uno de maíz con wakame, sobre papel de periódico en su bandeja de madera',
      alt_dulces: 'Taiyaki dorado con forma de pez sujeto con las manos',
      alt_bebidas: 'Refrescos japoneses, una caja de galletas y dos inari sobre la mesa',
      alergenos: '¿Alergias o intolerancias? Pregunta en la tienda antes de comprar.',
      caja_eyebrow: 'Cada noche',
      caja_title: 'Caja sorpresa desde 5,99 €',
      caja_desc: 'A partir de las 21:30 y hasta agotar unidades. Las novedades y los sorteos los contamos en Instagram.',
      caja_cta: 'Ver en Instagram',
      tienda_eyebrow: 'La tienda',
      tienda_title_a: 'Rótulo blanco,',
      tienda_title_b: 'onigiri rosa.',
      tienda_desc: 'Estamos en pleno centro, al final del Boulevard. Así nos reconocerás desde la calle.',
      foto_fachada: 'La entrada, en Reina Regente 4',
      foto_vitrina: 'La vitrina',
      foto_mostrador: 'El mostrador',
      alt_fachada: 'Entrada de Onigiri Edorin: arco de piedra con rótulo blanco y el onigiri rosa, con gente pasando por la acera',
      alt_vitrina: 'Vitrina de madera con bandejas de sushi y onigiris bajo lámparas de mimbre y un neón rosa con forma de onigiri',
      alt_mostrador: 'Mostrador de madera con el neón EDORIN y lámparas de mimbre',
      s1_t: 'Al final del Boulevard',
      s1_d: 'En Reina Regente 4, junto al puente de Zurriola y a un paso de la Parte Vieja.',
      s2_t: 'Frente al Victoria Eugenia',
      s2_d: 'El teatro queda justo enfrente. Si vienes del Kursaal, cruza el puente y ya estás.',
      s3_t: 'Busca el onigiri rosa',
      s3_d: 'Rótulo blanco bajo un arco de piedra. Dentro, la vitrina de madera y los neones.',
      h_eyebrow: 'Horario',
      h_title: 'Abrimos todos los días',
      today: 'Hoy',
      closed_day: 'Cerrado',
      w_title: 'Dónde estamos',
      addr_1: 'Calle Reina Regente, 4',
      addr_2: '20003 Donostia / San Sebastián',
      c_gmaps: 'Ver la ficha y las reseñas en Google Maps',
      map_title: 'Mapa con la ubicación de Onigiri Edorin',
      map_link: 'Abrir la ruta a Onigiri Edorin en Google Maps',
      f_visit: 'Visítanos',
      f_hours: 'Todos los días, de 11:00 a 22:00',
      f_follow: 'Síguenos',
      f_rights: 'Onigiris, sushi y ramen en Donostia.',
      f_top: 'Onigiri Edorin · Volver arriba',
      days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      days_in: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
    },

    eu: {
      cta_glovo: 'Glovon eskatu',
      c_glovo: 'Glovon etxera eskatu',
      alt_ramen_coreano: 'Mahaia bi ramen korear egin berrirekin, onigiriekin eta edari asiarrekin',
      meta_title: 'Onigiri Edorin · Onigiriak, sushia eta ramena Donostian',
      meta_desc: 'Egunero prestatutako onigiriak eta sushia, eta unean bertan egiten duzun ramen korearra. Erregina Erregeordea 4, Donostia. Egunero irekita, 11:00etatik 22:00etara.',
      skip: 'Edukira joan',
      nav_aria: 'Nabigazio nagusia',
      drawer_aria: 'Menua',
      brand_tag: 'Onigiriak · sushia · ramena',
      nav_carta: 'Zer dago',
      nav_tienda: 'Denda',
      nav_horario: 'Ordutegia',
      nav_llegar: 'Nola iritsi',
      menu_open: 'Menua ireki',
      menu_close: 'Menua itxi',
      drawer_social: 'Jarraitu eta aurkitu gaitzazu',
      ig_aria: 'Onigiri Edorinen Instagrama (beste fitxa batean irekitzen da)',
      hero_badge: 'Erregina Erregeordea 4 · Donostia',
      emblem_aria: 'Onigiri Edorin: sakatu onigiria salto egin dezan',
      hero_cat: 'Onigiriak, sushia eta ramena',
      hero_desc: 'Egunero prestatutako onigiriak eta sushia, eta zeuk unean bertan egiten duzun ramen korearra. Donostiako erdigunean, Victoria Eugenia antzokiaren parean.',
      cta_llegar: 'Nola iritsi',
      cta_ig: 'Instagram ikusi',
      status_checking: 'Ordutegia egiaztatzen…',
      status_open: 'Orain irekita',
      status_closed: 'Orain itxita',
      closes_at: '{h}etan ixten du',
      opens_at: '{h}etan irekitzen du',
      opens_tomorrow: 'Bihar {h}etan irekitzen du',
      opens_day: '{d} {h}etan irekitzen du',
      kpi1_v: '4,5',
      kpi1_l: 'Googlen',
      kpi2_v: '11:00–22:00',
      kpi2_l: 'egunero',
      kpi3_v: 'Freskoa',
      kpi3_l: 'egunero egina',
      kpi4_v: 'Erdigunea',
      kpi4_l: 'Victoria Eugeniaren parean',
      fotos_pause: 'Mugimendua gelditu',
      fotos_play: 'Mugimendua piztu',
      carta_eyebrow: 'Zer aurkituko duzu',
      carta_title: 'Erakusleihoan aukeratu eta eraman',
      carta_desc: 'Egunero egindako onigiriak eta sushia, zeuk gure makinan prestatzen duzun ramena eta laguntzeko edariak. Dena eramateko prest.',
      p_onigiri_t: 'Onigiriak',
      p_onigiri_d: 'Egunero eskuz eginak. Aukera beganoak ere badaude.',
      p_sushi_t: 'Sushia',
      p_sushi_d: 'Nigiriak, makiak eta askotariko erretiluak.',
      p_sashimi_t: 'Sashimia',
      p_sashimi_d: 'Izokin-erretiluak, eramateko prest.',
      p_takoyaki_t: 'Takoyakia',
      p_takoyaki_d: 'Olagarro-bolatxoak saltsarekin eta bonito lehorrarekin.',
      p_inari_t: 'Inaria',
      p_inari_d: 'Tofu gozozko poltsatxoak arrozez beteak, askotariko toppingekin.',
      p_ramen_e: 'Zeuk egina',
      p_ramen_t: 'Ramen korearra',
      p_ramen_d: 'Aukeratu zure ramena eta prestatu unean bertan gure makinan.',
      p_dulces_t: 'Gozoki japoniarrak',
      p_dulces_d: 'Taiyakia eta dorayakia, gozo-gogoa asetzeko.',
      p_bebidas_t: 'Edariak eta mokadutxoak',
      p_bebidas_d: 'Freskagarri eta mokadutxo asiarrak, laguntzeko.',
      alt_onigiri: 'Eskularruak dituzten eskuak izokinez betetako onigiri bati forma ematen',
      alt_sushi: 'Izokin-nigiria txotxinekin helduta, askotariko sushi-erretilu baten gainean',
      alt_sashimi: 'Izokin-sashimi erretilua entsaladarekin, itxita eta etiketatuta',
      alt_takoyaki: 'Takoyakia saltsarekin eta bonito lehorrarekin, txotxinekin helduta',
      alt_inari: 'Izokin eta alberakatez beteriko inariak, mangoarekin, eta artoa eta wakamea dituen bat, egunkari-paperaren gainean, zurezko erretiluan',
      alt_dulces: 'Arrain itxurako taiyaki urreztatua eskuetan',
      alt_bebidas: 'Freskagarri japoniarrak, gaileta-kutxa bat eta bi inari mahai gainean',
      alergenos: 'Alergiak edo intolerantziak? Galdetu dendan erosi aurretik.',
      caja_eyebrow: 'Gauero',
      caja_title: 'Ezusteko kutxa 5,99 €-tik aurrera',
      caja_desc: '21:30etik aurrera, unitateak agortu arte. Berritasunak eta zozketak Instagramen kontatzen ditugu.',
      caja_cta: 'Instagramen ikusi',
      tienda_eyebrow: 'Denda',
      tienda_title_a: 'Errotulu zuria,',
      tienda_title_b: 'onigiri arrosa.',
      tienda_desc: 'Donostiako erdigunean gaude, Boulevardaren amaieran. Honela ezagutuko gaituzu kaletik.',
      foto_fachada: 'Sarrera, Erregina Erregeordea 4an',
      foto_vitrina: 'Erakusleihoa',
      foto_mostrador: 'Mostradorea',
      alt_fachada: 'Onigiri Edorinen sarrera: harrizko arkua, errotulu zuria eta onigiri arrosa, espaloitik jendea pasatzen dela',
      alt_vitrina: 'Egurrezko erakusleihoa sushi- eta onigiri-erretiluekin, zumezko lanparen eta onigiri itxurako neoi arrosa baten azpian',
      alt_mostrador: 'Egurrezko mostradorea, EDORIN neoiarekin eta zumezko lanparekin',
      s1_t: 'Boulevardaren amaieran',
      s1_d: 'Erregina Erregeordea kaleko 4. zenbakian, Zurriola zubiaren ondoan eta Alde Zaharretik urrats batera.',
      s2_t: 'Victoria Eugeniaren parean',
      s2_d: 'Antzokia justu aurrean duzu. Kursaaletik bazatoz, zeharkatu zubia eta iritsi zara.',
      s3_t: 'Bilatu onigiri arrosa',
      s3_d: 'Errotulu zuria, harrizko arku baten azpian. Barruan, egurrezko erakusleihoa eta neoiak.',
      h_eyebrow: 'Ordutegia',
      h_title: 'Egunero irekita',
      today: 'Gaur',
      closed_day: 'Itxita',
      w_title: 'Non gauden',
      addr_1: 'Erregina Erregeordea kalea, 4',
      addr_2: '20003 Donostia',
      c_gmaps: 'Ikusi fitxa eta iritziak Google Mapsen',
      map_title: 'Onigiri Edorinen kokapenaren mapa',
      map_link: 'Ireki Onigiri Edorinerako ibilbidea Google Mapsen',
      f_visit: 'Etorri gurera',
      f_hours: 'Egunero, 11:00etatik 22:00etara',
      f_follow: 'Jarraitu gaitzazu',
      f_rights: 'Onigiriak, sushia eta ramena Donostian.',
      f_top: 'Onigiri Edorin · Gora itzuli',
      days: ['Igandea', 'Astelehena', 'Asteartea', 'Asteazkena', 'Osteguna', 'Ostirala', 'Larunbata'],
      days_in: ['Igandean', 'Astelehenean', 'Asteartean', 'Asteazkenean', 'Ostegunean', 'Ostiralean', 'Larunbatean']
    },

    en: {
      cta_glovo: 'Order on Glovo',
      c_glovo: 'Order delivery on Glovo',
      alt_ramen_coreano: 'A table with two freshly made Korean ramen, onigiri and Asian drinks',
      meta_title: 'Onigiri Edorin · Onigiri, sushi & ramen in San Sebastián',
      meta_desc: 'Onigiri and sushi made fresh every day, plus Korean ramen you cook on the spot. Reina Regente 4, San Sebastián. Open daily 11:00–22:00.',
      skip: 'Skip to content',
      nav_aria: 'Main navigation',
      drawer_aria: 'Menu',
      brand_tag: 'Onigiri · sushi · ramen',
      nav_carta: 'Food',
      nav_tienda: 'The shop',
      nav_horario: 'Hours',
      nav_llegar: 'Getting here',
      menu_open: 'Open menu',
      menu_close: 'Close menu',
      drawer_social: 'Follow & find us',
      ig_aria: 'Onigiri Edorin on Instagram (opens in a new tab)',
      hero_badge: 'Reina Regente 4 · San Sebastián',
      emblem_aria: 'Onigiri Edorin: tap the onigiri to make it jump',
      hero_cat: 'Onigiri, sushi and ramen',
      hero_desc: 'Onigiri and sushi made fresh every day, plus Korean ramen you cook yourself on the spot. In central San Sebastián, facing the Victoria Eugenia Theatre.',
      cta_llegar: 'Get directions',
      cta_ig: 'See Instagram',
      status_checking: 'Checking hours…',
      status_open: 'Open now',
      status_closed: 'Closed now',
      closes_at: 'Closes at {h}',
      opens_at: 'Opens at {h}',
      opens_tomorrow: 'Opens tomorrow at {h}',
      opens_day: 'Opens {d} at {h}',
      kpi1_v: '4.5',
      kpi1_l: 'on Google',
      kpi2_v: '11:00–22:00',
      kpi2_l: 'every day',
      kpi3_v: 'Fresh',
      kpi3_l: 'made daily',
      kpi4_v: 'Centre',
      kpi4_l: 'facing Victoria Eugenia',
      fotos_pause: 'Stop the motion',
      fotos_play: 'Turn the motion on',
      carta_eyebrow: 'What you’ll find',
      carta_title: 'Pick from the counter, take it with you',
      carta_desc: 'Freshly made onigiri and sushi, ramen you prepare yourself in our machine, and drinks to go with it. Everything ready to take away.',
      p_onigiri_t: 'Onigiri',
      p_onigiri_d: 'Handmade every day. Vegan options too.',
      p_sushi_t: 'Sushi',
      p_sushi_d: 'Nigiri, maki and mixed trays.',
      p_sashimi_t: 'Sashimi',
      p_sashimi_d: 'Salmon trays ready to take away.',
      p_takoyaki_t: 'Takoyaki',
      p_takoyaki_d: 'Octopus balls with sauce and bonito flakes.',
      p_inari_t: 'Inari',
      p_inari_d: 'Sweet tofu pouches filled with rice, with assorted toppings.',
      p_ramen_e: 'Make it yourself',
      p_ramen_t: 'Korean ramen',
      p_ramen_d: 'Pick your ramen and cook it on the spot in our machine.',
      p_dulces_t: 'Japanese sweets',
      p_dulces_d: 'Taiyaki and dorayaki for a sweet craving.',
      p_bebidas_t: 'Drinks & snacks',
      p_bebidas_d: 'Asian soft drinks and snacks to go with it.',
      alt_onigiri: 'Gloved hands shaping an onigiri filled with salmon',
      alt_sushi: 'Salmon nigiri held with chopsticks over a mixed sushi tray',
      alt_sashimi: 'Sealed, labelled tray of salmon sashimi with salad',
      alt_takoyaki: 'Takoyaki with sauce and bonito flakes held with chopsticks',
      alt_inari: 'Inari pouches filled with salmon, avocado and mango, and one with corn and wakame, on newspaper-print paper in their wooden tray',
      alt_dulces: 'Golden fish-shaped taiyaki held in two hands',
      alt_bebidas: 'Japanese soft drinks, a box of biscuits and two inari on the table',
      alergenos: 'Allergies or intolerances? Ask in store before you buy.',
      caja_eyebrow: 'Every night',
      caja_title: 'Surprise box from €5.99',
      caja_desc: 'From 21:30 while stocks last. We share news and giveaways on Instagram.',
      caja_cta: 'See on Instagram',
      tienda_eyebrow: 'The shop',
      tienda_title_a: 'White sign,',
      tienda_title_b: 'pink onigiri.',
      tienda_desc: 'Right in the city centre, at the end of the Boulevard. Here’s how to spot us from the street.',
      foto_fachada: 'The entrance, Reina Regente 4',
      foto_vitrina: 'The display counter',
      foto_mostrador: 'The front desk',
      alt_fachada: 'Onigiri Edorin’s entrance: a stone arch with a white sign and the pink onigiri, people walking past',
      alt_vitrina: 'Wooden display counter with sushi and onigiri trays under wicker lamps and a pink onigiri-shaped neon sign',
      alt_mostrador: 'Wooden counter with the EDORIN neon sign and wicker lamps',
      s1_t: 'End of the Boulevard',
      s1_d: 'At Reina Regente 4, next to the Zurriola bridge and a short walk from the Old Town.',
      s2_t: 'Facing Victoria Eugenia',
      s2_d: 'The theatre is right across the street. Coming from the Kursaal? Cross the bridge and you’re here.',
      s3_t: 'Look for the pink onigiri',
      s3_d: 'A white sign under a stone arch. Inside: the wooden display counter and neon lights.',
      h_eyebrow: 'Opening hours',
      h_title: 'Open every day',
      today: 'Today',
      closed_day: 'Closed',
      w_title: 'Where we are',
      addr_1: 'Calle Reina Regente, 4',
      addr_2: '20003 San Sebastián',
      c_gmaps: 'See our listing and reviews on Google Maps',
      map_title: 'Map showing where Onigiri Edorin is',
      map_link: 'Open directions to Onigiri Edorin in Google Maps',
      f_visit: 'Visit us',
      f_hours: 'Every day, 11:00–22:00',
      f_follow: 'Follow us',
      f_rights: 'Onigiri, sushi and ramen in San Sebastián.',
      f_top: 'Onigiri Edorin · Back to top',
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      days_in: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }
  };

  var LANGS = ['es', 'eu', 'en'];
  var lang = 'es';

  function t(key, vars) {
    var s = (I18N[lang] && I18N[lang][key] !== undefined) ? I18N[lang][key] : I18N.es[key];
    if (vars && typeof s === 'string') {
      Object.keys(vars).forEach(function (k) { s = s.split('{' + k + '}').join(vars[k]); });
    }
    return s;
  }

  function initialLang() {
    try {
      var q = new URLSearchParams(window.location.search).get('lang');
      if (q && LANGS.indexOf(q) > -1) return q;
    } catch (e) {}
    try {
      var saved = localStorage.getItem('onigiri-lang');
      if (saved && LANGS.indexOf(saved) > -1) return saved;
    } catch (e) {}
    return 'es';
  }

  function applyLang(next, remember) {
    lang = LANGS.indexOf(next) > -1 ? next : 'es';
    document.documentElement.lang = lang;
    document.title = t('meta_title');
    var md = $('meta[name="description"]');
    if (md) md.setAttribute('content', t('meta_desc'));

    $$('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    $$('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
    $$('[data-i18n-title]').forEach(function (el) { el.setAttribute('title', t(el.getAttribute('data-i18n-title'))); });
    $$('[data-i18n-alt]').forEach(function (el) { el.setAttribute('alt', t(el.getAttribute('data-i18n-alt'))); });
    $$('.lang-btn').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)); });

    syncMenuLabel();
    syncPauseLabel();
    renderHours();
    updateStatus();

    if (remember) {
      try { localStorage.setItem('onigiri-lang', lang); } catch (e) {}
    }
  }

  $$('.lang-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      applyLang(b.getAttribute('data-lang'), true);
      if (emblemJump) emblemJump();
    });
  });

  /* ------------------------------------------------------------------------
     Horario en vivo (hora de la tienda, no la del dispositivo)
     ------------------------------------------------------------------------ */
  function shopNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: SITE.timezone, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
      });
      var p = {};
      f.formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var d = map[p.weekday];
      if (d === undefined) throw new Error('weekday');
      return { day: d, min: (parseInt(p.hour, 10) % 24) * 60 + parseInt(p.minute, 10) };
    } catch (e) {
      var n = new Date();
      return { day: n.getDay(), min: n.getHours() * 60 + n.getMinutes() };
    }
  }

  function toMin(hhmm) { var a = hhmm.split(':'); return (+a[0]) * 60 + (+a[1]); }
  function dayEntry(d) {
    for (var i = 0; i < HOURS.length; i++) if (HOURS[i].d === d) return HOURS[i];
    return { d: d, ranges: [] };
  }
  function fmtRanges(ranges) {
    if (!ranges || !ranges.length) return t('closed_day');
    return ranges.map(function (r) { return r[0] + ' – ' + r[1]; }).join(' · ');
  }

  function computeStatus() {
    var now = shopNow(), today = dayEntry(now.day), i, r;
    for (i = 0; i < today.ranges.length; i++) {
      r = today.ranges[i];
      if (now.min >= toMin(r[0]) && now.min < toMin(r[1])) return { open: true, until: r[1] };
    }
    for (i = 0; i < today.ranges.length; i++) {
      r = today.ranges[i];
      if (now.min < toMin(r[0])) return { open: false, next: r[0], sameDay: true };
    }
    for (var k = 1; k <= 7; k++) {
      var d = (now.day + k) % 7, e = dayEntry(d);
      if (e.ranges.length) return { open: false, next: e.ranges[0][0], nextDay: d, tomorrow: k === 1 };
    }
    return { open: false };
  }

  function updateStatus() {
    var dot = $('#liveDot'), txt = $('#liveTxt');
    if (!dot || !txt) return;
    var s = computeStatus();
    txt.removeAttribute('data-i18n');
    dot.className = 'live-dot ' + (s.open ? 'is-open' : 'is-closed');
    if (s.open) txt.textContent = t('status_open') + ' · ' + t('closes_at', { h: s.until });
    else if (s.sameDay) txt.textContent = t('status_closed') + ' · ' + t('opens_at', { h: s.next });
    else if (s.tomorrow) txt.textContent = t('status_closed') + ' · ' + t('opens_tomorrow', { h: s.next });
    else if (s.nextDay !== undefined) txt.textContent = t('status_closed') + ' · ' + t('opens_day', { d: t('days_in')[s.nextDay], h: s.next });
    else txt.textContent = t('status_closed');
  }

  function renderHours() {
    var body = $('#hoursTableBody');
    if (!body) return;
    var today = shopNow().day;
    var frag = document.createDocumentFragment();
    [1, 2, 3, 4, 5, 6, 0].forEach(function (d) {
      var tr = document.createElement('tr');
      var tdDay = document.createElement('td');
      var tdHours = document.createElement('td');
      tdDay.textContent = t('days')[d];
      if (d === today) {
        tr.className = 'is-today';
        var tag = document.createElement('span');
        tag.className = 'today-tag';
        var dotEl = document.createElement('span');
        dotEl.className = 'today-dot';
        dotEl.setAttribute('aria-hidden', 'true');
        tag.appendChild(dotEl);
        tag.appendChild(document.createTextNode(t('today')));
        tdDay.appendChild(tag);
      }
      tdHours.textContent = fmtRanges(dayEntry(d).ranges);
      tr.appendChild(tdDay);
      tr.appendChild(tdHours);
      frag.appendChild(tr);
    });
    body.textContent = '';
    body.appendChild(frag);
  }

  /* ------------------------------------------------------------------------
     Cabecera y menú móvil
     ------------------------------------------------------------------------ */
  var nav = $('#site-nav');
  var menuBtn = $('.menu-movil');
  var cajon = $('#cajon');

  function syncNav() {
    if (nav) nav.classList.toggle('is-solida', window.scrollY > 24);
  }
  window.addEventListener('scroll', syncNav, { passive: true });
  syncNav();

  function syncMenuLabel() {
    if (!menuBtn) return;
    var open = menuBtn.getAttribute('aria-expanded') === 'true';
    var label = menuBtn.querySelector('.vh');
    if (label) {
      label.removeAttribute('data-i18n');
      label.textContent = t(open ? 'menu_close' : 'menu_open');
    }
  }

  function setMenu(open) {
    if (!menuBtn || !cajon) return;
    menuBtn.setAttribute('aria-expanded', String(open));
    cajon.hidden = !open;
    document.body.classList.toggle('cajon-abierto', open);
    syncMenuLabel();
    if (open) {
      var first = cajon.querySelector('a, button');
      if (first) first.focus({ preventScroll: true });
    }
  }

  if (menuBtn && cajon) {
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
    cajon.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menuBtn.focus();
      }
    });
    window.matchMedia('(min-width: 1025px)').addEventListener('change', function (m) {
      if (m.matches) setMenu(false);
    });
  }

  /* ------------------------------------------------------------------------
     Pase de fotos del inicio
     ------------------------------------------------------------------------ */
  var hero = $('#inicio');
  var slides = $$('.hero-foto');
  var dots = $$('.hero-puntos li');
  var pauseBtn = $('#heroPausa');
  var SLIDE_MS = 6000;
  var current = 0, timer = null, userPaused = false, inView = true;

  function parado() { return !motionOK || userPaused; }

  function syncPauseLabel() {
    if (!pauseBtn) return;
    pauseBtn.setAttribute('aria-label', t(parado() ? 'fotos_play' : 'fotos_pause'));
  }

  function loadSlide(slide) {
    return new Promise(function (resolve) {
      if (!slide || slide.getAttribute('data-cargada') === '1') return resolve();
      $$('source[data-srcset]', slide).forEach(function (s) {
        s.setAttribute('srcset', s.getAttribute('data-srcset'));
        s.removeAttribute('data-srcset');
      });
      var img = $('img', slide);
      if (img && img.getAttribute('data-src')) {
        img.setAttribute('src', img.getAttribute('data-src'));
        img.removeAttribute('data-src');
      }
      slide.setAttribute('data-cargada', '1');
      if (!img) return resolve();
      if (img.complete && img.naturalWidth) return resolve();
      var done = function () { resolve(); };
      if (img.decode) img.decode().then(done, done);
      else { img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true }); }
    });
  }

  function markDots() {
    dots.forEach(function (li, i) {
      li.classList.remove('is-activa', 'is-hecho');
      if (i < current) li.classList.add('is-hecho');
    });
    var active = dots[current];
    if (active) {
      void active.offsetWidth; // reinicia la barra
      active.classList.add('is-activa');
    }
  }

  function show(i) {
    var next = (i + slides.length) % slides.length;
    loadSlide(slides[next]).then(function () {
      slides[current].classList.remove('is-activa');
      current = next;
      slides[current].classList.add('is-activa');
      markDots();
      loadSlide(slides[(current + 1) % slides.length]);
      schedule();
    });
  }

  function schedule() {
    clearTimeout(timer);
    if (userPaused || !inView || document.hidden) return;
    timer = setTimeout(function () { show(current + 1); }, SLIDE_MS);
  }

  var fotosEnMarcha = false;

  function iniciaFotos() {
    if (fotosEnMarcha || !hero || slides.length < 2) return;
    fotosEnMarcha = true;
    hero.style.setProperty('--slide-ms', SLIDE_MS + 'ms');
    var start = function () {
      markDots();
      loadSlide(slides[1]);
      schedule();
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        hero.classList.toggle('is-fuera', !inView);
        if (inView) schedule(); else clearTimeout(timer);
      }, { threshold: 0.15 }).observe(hero);
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) clearTimeout(timer); else schedule();
    });
  }

  // El boton del inicio para y arranca todo el movimiento de la portada
  if (pauseBtn && hero && slides.length > 1) {
    pauseBtn.hidden = false;
    pauseBtn.addEventListener('click', function () {
      if (!motionOK) {                       // estaba todo quieto: lo encendemos
        guardaMovimiento('on');
        userPaused = false;
        hero.classList.remove('is-pausa');
        iniciaFotos();
        iniciaEmblema();
        syncPauseLabel();
        show(current + 1);
        return;
      }
      userPaused = !userPaused;
      hero.classList.toggle('is-pausa', userPaused);
      guardaMovimiento(userPaused ? 'off' : 'on');
      syncPauseLabel();
      if (userPaused) clearTimeout(timer);
      else show(current + 1);
    });
    syncPauseLabel();
  } else {
    var ctrls = $('.hero-controles');
    if (ctrls) ctrls.hidden = true;
  }

  if (motionOK) iniciaFotos();

  /* ------------------------------------------------------------------------
     El onigiri salta
     ------------------------------------------------------------------------ */
  var emblema = $('#emblema');
  var emblemJump = null;

  function restartClass(el, cls) {
    el.classList.remove(cls);
    void el.getBoundingClientRect();
    el.classList.add(cls);
  }

  var emblemaEnMarcha = false;

  function iniciaEmblema() {
    if (emblemaEnMarcha || !emblema) return;
    emblemaEnMarcha = true;
    var busy = false;
    var parts = $$('.em-salto', emblema);

    var jump = function (kind) {
      if (busy) return;
      busy = true;
      emblema.classList.remove('is-salto', 'is-voltereta', 'is-parpadeo');
      restartClass(emblema, kind === 'voltereta' ? 'is-voltereta' : 'is-salto');
    };
    emblemJump = function () { jump('salto'); };

    parts.forEach(function (p) {
      p.addEventListener('animationend', function (e) {
        if (e.animationName === 'og-salto' || e.animationName === 'og-salto-alto') {
          emblema.classList.remove('is-salto', 'is-voltereta');
          busy = false;
        }
      });
    });

    var blink = function () {
      if (busy || document.hidden) return;
      restartClass(emblema, 'is-parpadeo');
    };
    emblema.addEventListener('animationend', function (e) {
      if (e.animationName === 'og-parpadeo') emblema.classList.remove('is-parpadeo');
    });

    // Presentación: dos saltos y un parpadeo (menos de 5 segundos en total)
    setTimeout(function () { jump('salto'); }, 450);
    setTimeout(blink, 2300);
    setTimeout(function () { jump('salto'); }, 3100);

    emblema.addEventListener('click', function () { jump('voltereta'); });
    if (finePointer) emblema.addEventListener('mouseenter', function () { jump('salto'); });

    // De vez en cuando parpadea (sin moverse del sitio)
    setInterval(function () {
      if (inView && Math.random() < 0.6) blink();
    }, 5200);
  }

  if (motionOK) iniciaEmblema();

  /* ------------------------------------------------------------------------
     Entradas suaves al hacer scroll
     ------------------------------------------------------------------------ */
  if (motionOK && 'IntersectionObserver' in window) {
    var targets = $$('.sec-head, .bento-item, .nota-alergenos, .caja-inner, .tienda-foto, .step-card, .info-grid > div, .contact-card');
    targets.forEach(function (el) { el.classList.add('revela'); });
    document.documentElement.classList.add('js-motion');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------------
     Arranque
     ------------------------------------------------------------------------ */
  var year = $('#footerYear');
  if (year) year.textContent = String(new Date().getFullYear());

  applyLang(initialLang(), false);
  setInterval(function () { updateStatus(); }, 60000);
})();
