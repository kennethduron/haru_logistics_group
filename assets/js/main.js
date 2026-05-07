const CRM_STORAGE = "haru_crm_shipments";
const LEAD_STORAGE = "haru_crm_leads";
const LANGUAGE_STORAGE = "haru_language";
const firebaseConfig = {
  apiKey: "AIzaSyB7y6EYPf4pXVVOyGdJlurfOx02uRwThyk",
  authDomain: "kennethlogisticsgroup.firebaseapp.com",
  projectId: "kennethlogisticsgroup",
  storageBucket: "kennethlogisticsgroup.firebasestorage.app",
  messagingSenderId: "994238477835",
  appId: "1:994238477835:web:3be9e83a9213bb5a17390e",
};

let firebaseApp = null;
let firebaseAuth = null;
let firestoreDb = null;

const reps = ["Andrea Mejia", "Carlos Rivera", "Daniel Santos"];

const statusFlow = ["booked", "docs", "transit", "customs", "delivered"];

const i18n = {
  es: {
    langLabel: "ES",
    langAria: "Cambiar idioma a ingles",
    title: {
      index: "Haru Logistics Group | Logistica internacional desde Honduras",
      servicios: "Servicios | Haru Logistics Group",
      rutas: "Rutas y Cobertura | Haru Logistics Group",
      seguimiento: "Seguimiento de Envios | Haru Logistics Group",
      nosotros: "Nosotros | Haru Logistics Group",
      contacto: "Contacto y Cotizacion | Haru Logistics Group",
      crm: "CRM Interno | Haru Logistics Group",
    },
    meta: {
      index: "Haru Logistics Group coordina transporte maritimo, aereo y terrestre, gestion aduanera, seguimiento y cotizaciones para carga internacional desde Honduras.",
      servicios: "Servicios de transporte maritimo, aereo, terrestre, aduana, seguros y distribucion para carga internacional.",
      rutas: "Cobertura logistica desde Honduras hacia Norteamerica, Centroamerica, Europa y Asia con rutas maritimas, aereas y terrestres.",
      seguimiento: "Consulta demostrativa de seguimiento de envios y explicacion de hitos logisticos para clientes de Haru Logistics Group.",
      nosotros: "Conoce a Haru Logistics Group, operador logistico enfocado en coordinacion internacional, servicio al cliente y trazabilidad de carga.",
      contacto: "Solicita una cotizacion logistica para transporte maritimo, aereo o terrestre con Haru Logistics Group.",
      crm: "CRM interno de demostracion para reps y dueno de Haru Logistics Group.",
    },
    status: {
      lead: "Lead nuevo",
      quoted: "Cotizado",
      booked: "Reservado",
      docs: "Documentos",
      transit: "En transito",
      customs: "En aduana",
      delivered: "Entregado",
    },
    service: {
      Maritimo: "Maritimo",
      "Maritimo": "Maritimo",
      Aereo: "Aereo",
      "Aereo": "Aereo",
      Terrestre: "Terrestre",
      Multimodal: "Multimodal",
      "Por definir": "Por definir",
    },
    dynamic: {
      demoCustomer: "Cliente web",
      noCompany: "Sin empresa",
      demoNotice: "Solicitud registrada en el CRM demo. Un rep puede verla en la pagina CRM y convertirla en envio con tracking number.",
      checkingStatus: "Consultando estado...",
      notFoundTitle: "No encontramos el tracking number {code}.",
      notFoundBody: "Verifica que el codigo este escrito igual al que te envio tu ejecutivo. Tambien puedes probar HLG-2026-1840.",
      toward: "hacia",
      etaUnknown: "Por confirmar",
      executive: "Ejecutivo",
      lastUpdate: "Ultima actualizacion:",
      firebaseAuthMissingTitle: "Firebase Auth no cargo.",
      firebaseAuthMissingBody: "Revisa la conexion a internet o los scripts de Firebase.",
      validatingAccess: "Validando acceso...",
      authEnableEmail: "Activa Email/Password en Firebase Authentication para poder iniciar sesion.",
      authWeakPassword: "La contrasena debe tener al menos 6 caracteres.",
      authFailed: "No se pudo iniciar sesion: {message}",
    },
    trackingMessages: {
      booked: "La reserva fue creada y el embarque esta registrado.",
      docs: "Documentos comerciales y datos de carga en revision.",
      transit: "La carga se encuentra moviendose por la ruta coordinada.",
      customs: "El envio esta en proceso de revision o liberacion aduanera.",
      delivered: "La entrega final fue completada o confirmada por el cliente.",
    },
    seedNotes: {
      s1: "Envio de prueba para Kenneth con documentacion validada.",
      s2: "Carga urgente en proceso de liberacion.",
      s3: "Entrega final confirmada por cliente.",
      l1: "Solicita costo para carga mensual.",
      l2: "Necesita importar repuestos pequenos.",
    },
    static: {
      common: [
        { selector: "nav", attr: "aria-label", text: "Navegacion principal" },
        { selector: ".nav-toggle", attr: "aria-label", text: "Abrir menu" },
        { selector: ".nav-toggle", text: "☰" },
        { selector: "a.nav-link[href='index.html']", text: "Inicio" },
        { selector: "a.nav-link[href='servicios.html']", text: "Servicios" },
        { selector: "a.nav-link[href='rutas.html']", text: "Rutas" },
        { selector: "a.nav-link[href='seguimiento.html']", text: "Seguimiento" },
        { selector: "a.nav-link[href='nosotros.html']", text: "Nosotros" },
        { selector: "a.nav-link[href='contacto.html']", text: "Contacto" },
        { selector: "a.btn[href='contacto.html#cotizar']", text: "Cotizar" },
        { selector: "a.btn[href='#cotizar']", text: "Cotizar" },
        { selector: ".whatsapp", attr: "aria-label", text: "Contactar por WhatsApp" },
      ],
      index: [
        { selector: ".hero .eyebrow", text: "Operador logistico internacional" },
        { selector: ".hero h1", text: "Carga segura, rutas claras y entregas con control." },
        { selector: ".hero p", index: 1, text: "Ayudamos a empresas e importadores a mover mercancia por mar, aire y carretera, coordinando proveedores, documentos, aduana y seguimiento desde un solo punto de contacto." },
        { selector: ".hero-actions .btn", index: 0, text: "Solicitar cotizacion" },
        { selector: ".hero-actions .btn", index: 1, text: "Rastrear envio" },
        { selector: ".hero-panel", attr: "aria-label", text: "Resumen operativo" },
        { selector: ".status-row span", index: 0, text: "Puertos y aeropuertos" },
        { selector: ".status-row span", index: 1, text: "Modos de transporte" },
        { selector: ".status-row strong", index: 1, text: "Mar, aire, tierra" },
        { selector: ".status-row span", index: 2, text: "Soporte documental" },
        { selector: ".status-row strong", index: 2, text: "Aduana y seguros" },
        { selector: ".status-row span", index: 3, text: "Base operativa" },
        { selector: ".section .eyebrow", index: 0, text: "Que resolvemos" },
        { selector: ".section-head h2", index: 0, text: "Una web logistica debe convertir dudas en solicitudes reales." },
        { selector: ".section-head .btn", index: 0, text: "Ver servicios" },
        { selector: ".card h3", index: 0, text: "Importacion y exportacion" },
        { selector: ".card p", index: 0, text: "Presenta rutas, modalidades y capacidad para mover carga de forma profesional." },
        { selector: ".card h3", index: 1, text: "Seguimiento de envios" },
        { selector: ".card p", index: 1, text: "Da confianza mostrando que la carga puede consultarse y recibir actualizaciones." },
        { selector: ".card h3", index: 2, text: "Cotizacion rapida" },
        { selector: ".card p", index: 2, text: "Convierte visitantes en prospectos con origen, destino, tipo de carga y datos de contacto." },
        { selector: ".section-dark .eyebrow", text: "Indicadores comerciales" },
        { selector: ".section-dark h2", text: "Datos que hacen que la empresa se vea seria." },
        { selector: ".metric span", index: 0, text: "visibilidad operativa y atencion por casos criticos." },
        { selector: ".metric span", index: 1, text: "modalidades coordinadas: maritima, aerea y terrestre." },
        { selector: ".metric span", index: 2, text: "ejecutivo central para documentos, ruta, ETA y cotizacion." },
        { selector: ".section-soft .eyebrow", text: "Proceso" },
        { selector: ".split h2", text: "De la cotizacion al cierre de entrega." },
        { selector: ".split p", index: 1, text: "El sitio comunica un flujo simple: el cliente solicita una cotizacion, Haru valida la ruta, coordina la operacion y mantiene informado al cliente hasta la entrega." },
        { selector: ".list-check li", index: 0, text: "Recepcion de datos de carga, peso, volumen, origen y destino." },
        { selector: ".list-check li", index: 1, text: "Seleccion de modalidad segun urgencia, costo y tipo de mercancia." },
        { selector: ".list-check li", index: 2, text: "Coordinacion documental, aduanera y seguimiento de hitos." },
        { selector: ".footer p", index: 0, text: "Soluciones logisticas internacionales para empresas que necesitan mover carga con orden, trazabilidad y soporte humano." },
        { selector: ".footer h3", index: 0, text: "Mapa" },
        { selector: ".footer h3", index: 1, text: "Contacto" },
        { selector: ".footer small", text: "© 2026 Haru Logistics Group. Todos los derechos reservados." },
      ],
      servicios: [
        { selector: ".page-hero .eyebrow", text: "Servicios" },
        { selector: ".page-hero h1", text: "Soluciones para mover carga sin improvisar." },
        { selector: ".page-hero p", index: 1, text: "El objetivo es que el cliente entienda rapido que puede contratar, para que sirve cada servicio y cuando conviene usarlo." },
        { selector: ".card h3", index: 0, text: "Transporte maritimo" },
        { selector: ".card p", index: 0, text: "Ideal para cargas voluminosas, contenedores completos, carga consolidada y operaciones donde el costo por volumen es clave." },
        { selector: ".card h3", index: 1, text: "Transporte aereo" },
        { selector: ".card p", index: 1, text: "Para mercancia urgente, repuestos, muestras, productos de alto valor o entregas con ventana de tiempo reducida." },
        { selector: ".card h3", index: 2, text: "Transporte terrestre" },
        { selector: ".card p", index: 2, text: "Distribucion local y regional, conexion puerto-bodega, recolecciones, entregas finales y movimientos fronterizos." },
        { selector: ".card h3", index: 3, text: "Gestion aduanera" },
        { selector: ".card p", index: 3, text: "Apoyo con documentacion, requisitos de importacion/exportacion, coordinacion con agentes y liberacion de carga." },
        { selector: ".card h3", index: 4, text: "Seguro de carga" },
        { selector: ".card p", index: 4, text: "Opciones para proteger mercancia ante danos, perdida o incidentes durante el traslado internacional." },
        { selector: ".card h3", index: 5, text: "Consultoria logistica" },
        { selector: ".card p", index: 5, text: "Revision de rutas, costos, tiempos, riesgos y documentos para tomar mejores decisiones antes de embarcar." },
        { selector: ".section-soft .eyebrow", text: "Como se trabaja" },
        { selector: ".section-soft h2", text: "Un proceso claro vende confianza." },
        { selector: ".process-step h3", index: 0, text: "Datos" },
        { selector: ".process-step p", index: 0, text: "Origen, destino, producto, peso, volumen y fecha objetivo." },
        { selector: ".process-step h3", index: 1, text: "Ruta" },
        { selector: ".process-step p", index: 1, text: "Se evalua modalidad, costo, tiempo, restricciones y documentacion." },
        { selector: ".process-step h3", index: 2, text: "Operacion" },
        { selector: ".process-step p", index: 2, text: "Se coordina transporte, aduana, seguro y proveedores involucrados." },
        { selector: ".process-step h3", index: 3, text: "Cierre" },
        { selector: ".process-step p", index: 3, text: "Se informa estado, entrega y documentos finales del embarque." },
        { selector: ".footer p", index: 0, text: "Transporte internacional, aduana y seguimiento para carga empresarial." },
        { selector: ".footer h3", index: 0, text: "Servicios" },
        { selector: ".footer p", index: 1, html: "Maritimo<br>Aereo<br>Terrestre<br>Aduana" },
        { selector: ".footer h3", index: 1, text: "Contacto" },
        { selector: ".footer a[href='contacto.html#cotizar']", text: "Solicitar cotizacion" },
        { selector: ".footer a[href='seguimiento.html']", text: "Rastrear envio" },
      ],
      rutas: [
        { selector: ".page-hero .eyebrow", text: "Rutas y cobertura" },
        { selector: ".page-hero h1", text: "Conectamos Honduras con mercados clave." },
        { selector: ".page-hero p", index: 1, text: "Esta pagina le muestra al cliente hacia donde puede mover carga y que tipo de ruta puede solicitar." },
        { selector: ".section-dark .eyebrow", text: "Cobertura" },
        { selector: ".section-dark h2", text: "Rutas maritimas, aereas y terrestres segun la urgencia del embarque." },
        { selector: ".section-dark p", index: 1, text: "La cobertura puede presentarse como red de socios y rutas frecuentes, sin prometer tiempos exactos hasta revisar la mercancia y los documentos." },
        { selector: ".route-map", attr: "aria-label", text: "Mapa visual de rutas" },
        { selector: ".route-map .us", text: "Norteamerica" },
        { selector: ".card h3", index: 0, text: "Centroamerica" },
        { selector: ".card p", index: 0, text: "Movimientos terrestres regionales, aduana fronteriza, recoleccion y entrega final." },
        { selector: ".card h3", index: 1, text: "Norteamerica" },
        { selector: ".card p", index: 1, text: "Importaciones y exportaciones por rutas maritimas, aereas y conexiones terrestres." },
        { selector: ".card h3", index: 2, text: "Europa" },
        { selector: ".card p", index: 2, text: "Coordinacion documental y transporte internacional para carga comercial y proyectos." },
        { selector: ".card h3", index: 3, text: "Asia" },
        { selector: ".card p", index: 3, text: "Apoyo para compras, consolidacion, embarque maritimo y seguimiento desde origen." },
        { selector: ".card h3", index: 4, text: "Puertos" },
        { selector: ".card p", index: 4, text: "Coordinacion con terminales, navieras, agentes y transporte hacia bodega." },
        { selector: ".card h3", index: 5, text: "Aeropuertos" },
        { selector: ".card p", index: 5, text: "Opciones para carga urgente, muestras comerciales y mercancia de alto valor." },
        { selector: ".footer p", index: 0, text: "Rutas internacionales con coordinacion logistica desde Honduras." },
        { selector: ".footer h3", index: 0, text: "Ir a" },
        { selector: ".footer h3", index: 1, text: "Cotizar" },
        { selector: ".footer a[href='contacto.html#cotizar']", text: "Enviar datos de carga" },
      ],
      seguimiento: [
        { selector: ".page-hero .eyebrow", text: "Seguimiento" },
        { selector: ".page-hero h1", text: "El cliente no solo quiere enviar: quiere saber donde esta su carga." },
        { selector: ".page-hero p", index: 1, text: "Esta seccion consulta los envios creados en el CRM demo. En produccion se conectaria a una base de datos para que funcione desde cualquier dispositivo." },
        { selector: ".tracking-box h2", text: "Rastrear envio" },
        { selector: ".tracking-box p", html: "Prueba con <strong>HLG-2026-1840</strong>. Cuando un ejecutivo crea un envio en el sistema interno, el cliente puede consultar aqui su tracking number." },
        { labelForSelector: "[data-tracking-form] input", text: "Codigo de rastreo" },
        { selector: "[data-tracking-form] input", attr: "placeholder", text: "HLG-2026-1840" },
        { selector: "[data-tracking-form] button", text: "Consultar estado" },
        { selector: ".split > div:nth-child(2) .eyebrow", text: "Por que importa" },
        { selector: ".split > div:nth-child(2) h2", text: "El seguimiento reduce llamadas, dudas y desconfianza." },
        { selector: ".split > div:nth-child(2) p", index: 1, text: "Para logistica, una web profesional sirve para mostrar trazabilidad: recepcion, salida, transito, aduana, llegada y entrega final." },
        { selector: ".list-check li", index: 0, text: "El cliente puede consultar avances sin esperar una llamada." },
        { selector: ".list-check li", index: 1, text: "El equipo comercial puede centralizar preguntas frecuentes." },
        { selector: ".list-check li", index: 2, text: "La empresa proyecta orden operativo y capacidad tecnologica." },
        { selector: ".footer p", index: 0, text: "Seguimiento demostrativo para comunicar trazabilidad y confianza." },
        { selector: ".footer h3", index: 0, text: "Cliente" },
        { selector: ".footer p", index: 1, html: "Consulta de estado<br>Hitos de carga<br>Soporte operativo" },
        { selector: ".footer h3", index: 1, text: "Contacto" },
        { selector: ".footer a[href='contacto.html']", text: "Hablar con un ejecutivo" },
      ],
      nosotros: [
        { selector: ".page-hero .eyebrow", text: "Nosotros" },
        { selector: ".page-hero h1", text: "Una logistica mas humana, ordenada y visible." },
        { selector: ".page-hero p", index: 1, text: "Esta pagina ayuda a vender confianza: explica quien es la empresa, como trabaja y por que un cliente deberia dejar su carga en sus manos." },
        { selector: ".split .eyebrow", text: "Perfil" },
        { selector: ".split h2", text: "Haru Logistics Group acompana operaciones de carga de principio a fin." },
        { selector: ".split p", index: 1, text: "La empresa se presenta como un aliado logistico para importadores, exportadores, distribuidores y negocios que necesitan coordinar transporte internacional con menos friccion." },
        { selector: ".list-check li", index: 0, text: "Comunicacion clara durante cada etapa del embarque." },
        { selector: ".list-check li", index: 1, text: "Coordinacion con proveedores, agentes, navieras y transportistas." },
        { selector: ".list-check li", index: 2, text: "Enfoque en seguridad documental, tiempos y experiencia del cliente." },
        { selector: ".card h3", index: 0, text: "Mision" },
        { selector: ".card p", index: 0, text: "Simplificar el movimiento de carga internacional con soluciones claras, trazables y adaptadas a cada cliente." },
        { selector: ".card h3", index: 1, text: "Vision" },
        { selector: ".card p", index: 1, text: "Ser una referencia logistica regional por confiabilidad, atencion y capacidad de coordinacion global." },
        { selector: ".card h3", index: 2, text: "Valores" },
        { selector: ".card p", index: 2, text: "Responsabilidad, comunicacion, puntualidad, transparencia y cuidado por la carga del cliente." },
        { selector: ".footer p", index: 0, text: "Aliado logistico para carga internacional desde Honduras." },
        { selector: ".footer h3", index: 0, text: "Empresa" },
        { selector: ".footer p", index: 1, html: "Mision<br>Vision<br>Valores" },
        { selector: ".footer h3", index: 1, text: "Siguiente paso" },
        { selector: ".footer a[href='contacto.html#cotizar']", text: "Solicitar cotizacion" },
      ],
      contacto: [
        { selector: ".page-hero .eyebrow", text: "Contacto" },
        { selector: ".page-hero h1", text: "Cotiza tu proximo embarque con datos claros." },
        { selector: ".page-hero p", index: 1, text: "Esta pagina es la mas importante comercialmente: convierte el interes del visitante en una solicitud que el equipo puede responder." },
        { selector: ".card h2", index: 0, text: "Solicitud de cotizacion" },
        { selector: ".card p", index: 0, text: "Mientras no exista backend, este formulario funciona como demostracion. Despues puede conectarse a correo, WhatsApp, Google Sheets, CRM o base de datos." },
        { labelFor: "nombre", text: "Nombre" },
        { labelFor: "empresa", text: "Empresa" },
        { labelFor: "correo", text: "Correo" },
        { labelFor: "telefono", text: "Telefono" },
        { labelFor: "origen", text: "Origen" },
        { selector: "input[name='origen']", attr: "placeholder", text: "Ciudad / pais" },
        { labelFor: "destino", text: "Destino" },
        { selector: "input[name='destino']", attr: "placeholder", text: "Ciudad / pais" },
        { labelFor: "tipo", text: "Tipo de flete" },
        { optionTexts: "select[name='tipo']", texts: ["Seleccionar", "Maritimo", "Aereo", "Terrestre", "Multimodal"] },
        { labelFor: "peso", text: "Peso o volumen" },
        { selector: "input[name='peso']", attr: "placeholder", text: "Ej. 500 kg / 4 m3" },
        { labelFor: "detalles", text: "Detalles de la carga" },
        { selector: "textarea[name='detalles']", attr: "placeholder", text: "Producto, medidas, fecha ideal, documentos disponibles..." },
        { selector: "[data-demo-form] button", text: "Enviar solicitud" },
        { selector: "aside .card h2", text: "Informacion directa" },
        { selector: "aside .card p", index: 0, html: "<strong>Ubicacion:</strong><br>Residencial Villanova, Villanueva, Cortes, Honduras" },
        { selector: "aside .card p", index: 1, html: "<strong>Correo:</strong><br><a href=\"mailto:info@harulogisticsgroup.com\">info@harulogisticsgroup.com</a>" },
        { selector: "aside .card p", index: 2, html: "<strong>WhatsApp:</strong><br><a href=\"https://wa.me/50499803341\">+504 9980-3341</a>" },
        { selector: "aside .card p", index: 3, html: "<strong>Horario:</strong><br>Lunes a viernes. Sabado hasta mediodia." },
        { selector: "aside .card h3", text: "Que debe enviar el cliente" },
        { selector: "aside .card p", index: 4, text: "Origen, destino, descripcion de mercancia, peso, volumen, fecha deseada y si requiere aduana, seguro o entrega final." },
        { selector: ".footer p", index: 0, text: "Contacto comercial y cotizaciones para operaciones logisticas." },
        { selector: ".footer h3", index: 0, text: "Responder rapido" },
        { selector: ".footer p", index: 1, html: "Origen<br>Destino<br>Peso<br>Tipo de carga" },
        { selector: ".footer h3", index: 1, text: "Enlaces" },
      ],
      crm: [
        { selector: "a.nav-link[href='crm.html']", text: "CRM interno" },
        { selector: "a.btn[href='index.html']", text: "Volver al sitio" },
        { selector: ".page-hero .eyebrow", text: "CRM interno" },
        { selector: ".page-hero h1", text: "Control comercial, operativo y ejecutivo en un solo panel." },
        { selector: ".page-hero p", index: 1, text: "Los reps administran leads y envios. El dueno ve toda la operacion: cargas activas, ventas estimadas, entregas y rendimiento por ejecutivo." },
        { selector: "[data-auth-login] .eyebrow", text: "Acceso privado" },
        { selector: "[data-auth-login] h2", text: "Entrar al CRM" },
        { selector: "[data-auth-login] p", index: 1, text: "Solo reps y dueno deben entrar aqui. Para la prueba puedes crear un usuario con tu correo y una contrasena de 6+ caracteres." },
        { labelFor: "email", text: "Email" },
        { labelFor: "password", text: "Contrasena" },
        { selector: "input[name='password']", attr: "placeholder", text: "Minimo 6 caracteres" },
        { selector: "[data-login-form] button", text: "Entrar al CRM" },
        { selector: ".crm-session strong", text: "Sesion activa:" },
        { selector: "[data-logout]", text: "Cerrar sesion" },
        { labelForSelector: "[data-role]", text: "Vista" },
        { optionTexts: "[data-role]", texts: ["Rep / Ejecutivo", "Dueno / Gerencia"] },
        { labelForSelector: "[data-rep-filter]", text: "Rep" },
        { optionTexts: "[data-rep-filter]", texts: ["Todos"] },
        { selector: "[data-reset-demo]", text: "Reiniciar datos demo" },
        { selector: ".crm-kpi span", index: 0, text: "Cargas activas" },
        { selector: ".crm-kpi span", index: 1, text: "Entregadas" },
        { selector: ".crm-kpi span", index: 2, text: "Leads" },
        { selector: ".crm-kpi span", index: 3, text: "Valor estimado" },
        { selector: ".crm-forms .card h2", index: 0, text: "Crear envio con tracking" },
        { selector: ".crm-forms .card p", index: 0, text: "Este formulario genera o registra el tracking number que el cliente usara en la pagina de seguimiento." },
        { labelFor: "tracking", text: "Tracking number" },
        { selector: "input[name='tracking']", attr: "placeholder", text: "Auto si se deja vacio" },
        { labelFor: "rep", text: "Rep asignado" },
        { labelFor: "customer", text: "Empresa cliente" },
        { labelFor: "contact", text: "Contacto" },
        { labelFor: "phone", text: "Telefono" },
        { labelFor: "origin", text: "Origen" },
        { labelFor: "destination", text: "Destino" },
        { labelFor: "service", text: "Servicio" },
        { optionTexts: "select[name='service']", texts: ["Maritimo", "Aereo", "Terrestre", "Multimodal"] },
        { labelFor: "status", text: "Estado" },
        { optionTexts: "select[name='status']", texts: ["Reservado", "Documentos", "En transito", "En aduana", "Entregado"] },
        { labelFor: "eta", text: "ETA" },
        { labelFor: "value", text: "Valor estimado USD" },
        { labelFor: "notes", text: "Notas operativas" },
        { selector: "textarea[name='notes']", attr: "placeholder", text: "Documentos, naviera, observaciones, siguiente paso..." },
        { selector: "[data-shipment-form] button", text: "Crear envio" },
        { selector: ".crm-forms .card h2", index: 1, text: "Registrar lead" },
        { selector: ".crm-forms .card p", index: 1, text: "Los leads vienen de llamadas, WhatsApp, referidos o el formulario publico de contacto." },
        { labelFor: "name", text: "Nombre" },
        { labelFor: "company", text: "Empresa" },
        { labelFor: "phone", text: "Telefono" },
        { optionTexts: "select[name='service']", index: 1, texts: ["Maritimo", "Aereo", "Terrestre", "Multimodal"] },
        { labelForSelector: "[data-lead-form] select[name='status']", text: "Etapa comercial" },
        { optionTexts: "[data-lead-form] select[name='status']", texts: ["Lead nuevo", "Cotizado", "Reservado"] },
        { selector: "[data-lead-form] textarea[name='notes']", attr: "placeholder", text: "Necesidad, presupuesto, fecha, objeciones..." },
        { selector: "[data-lead-form] button", text: "Guardar lead" },
        { selector: "[data-owner-panel] .eyebrow", text: "Vista del dueno" },
        { selector: "[data-owner-panel] h2", text: "Rendimiento por ejecutivo." },
        { tableHeaders: "[data-owner-panel] th", texts: ["Rep", "Leads", "Envios", "Entregados", "Valor estimado"] },
        { selector: ".crm-panel .eyebrow", index: 1, text: "Operaciones" },
        { selector: ".crm-panel h2", index: 1, text: "Envios y tracking numbers." },
        { tableHeaders: ".crm-panel:nth-of-type(2) th", texts: ["Tracking", "Cliente", "Ruta", "Rep", "Estado", "ETA", "Valor"] },
        { selector: ".crm-panel .eyebrow", index: 2, text: "Ventas" },
        { selector: ".crm-panel h2", index: 2, text: "Leads y oportunidades." },
        { tableHeaders: ".crm-panel:nth-of-type(3) th", texts: ["Empresa", "Contacto", "Ruta", "Servicio", "Rep", "Etapa"] },
        { selector: ".footer p", index: 0, text: "CRM demo para controlar leads, reps, envios, estados y tracking numbers." },
        { selector: ".footer h3", index: 0, text: "Paneles" },
        { selector: ".footer p", index: 1, html: "Rep<br>Dueno<br>Operaciones" },
        { selector: ".footer h3", index: 1, text: "Cliente" },
        { selector: ".footer a[href='seguimiento.html']", text: "Consultar tracking" },
      ],
    },
  },
  en: {
    langLabel: "EN",
    langAria: "Switch language to Spanish",
    title: {
      index: "Haru Logistics Group | International Logistics from Honduras",
      servicios: "Services | Haru Logistics Group",
      rutas: "Routes and Coverage | Haru Logistics Group",
      seguimiento: "Shipment Tracking | Haru Logistics Group",
      nosotros: "About Us | Haru Logistics Group",
      contacto: "Contact and Quotes | Haru Logistics Group",
      crm: "Internal CRM | Haru Logistics Group",
    },
    meta: {
      index: "Haru Logistics Group coordinates ocean, air, and ground transportation, customs support, tracking, and quotes for international cargo from Honduras.",
      servicios: "Ocean, air, ground, customs, insurance, and distribution services for international cargo.",
      rutas: "Logistics coverage from Honduras to North America, Central America, Europe, and Asia with ocean, air, and ground routes.",
      seguimiento: "Demo shipment tracking lookup and logistics milestone explanations for Haru Logistics Group clients.",
      nosotros: "Meet Haru Logistics Group, a logistics operator focused on international coordination, customer service, and cargo visibility.",
      contacto: "Request a logistics quote for ocean, air, or ground transportation with Haru Logistics Group.",
      crm: "Internal demo CRM for Haru Logistics Group reps and owner.",
    },
    status: {
      lead: "New lead",
      quoted: "Quoted",
      booked: "Booked",
      docs: "Documents",
      transit: "In transit",
      customs: "In customs",
      delivered: "Delivered",
    },
    service: {
      Maritimo: "Ocean freight",
      "Maritimo": "Ocean freight",
      Aereo: "Air freight",
      "Aereo": "Air freight",
      Terrestre: "Ground freight",
      Multimodal: "Multimodal",
      "Por definir": "To be defined",
    },
    dynamic: {
      demoCustomer: "Web customer",
      noCompany: "No company",
      demoNotice: "Request saved in the demo CRM. A rep can view it on the CRM page and convert it into a shipment with a tracking number.",
      checkingStatus: "Checking status...",
      notFoundTitle: "We could not find tracking number {code}.",
      notFoundBody: "Check that the code matches the one your account executive sent you. You can also try HLG-2026-1840.",
      toward: "to",
      etaUnknown: "To be confirmed",
      executive: "Executive",
      lastUpdate: "Last update:",
      firebaseAuthMissingTitle: "Firebase Auth did not load.",
      firebaseAuthMissingBody: "Check the internet connection or the Firebase scripts.",
      validatingAccess: "Validating access...",
      authEnableEmail: "Enable Email/Password in Firebase Authentication before signing in.",
      authWeakPassword: "The password must be at least 6 characters long.",
      authFailed: "Could not sign in: {message}",
    },
    trackingMessages: {
      booked: "The booking was created and the shipment is registered.",
      docs: "Commercial documents and cargo details are under review.",
      transit: "The cargo is moving along the coordinated route.",
      customs: "The shipment is under customs review or release.",
      delivered: "Final delivery was completed or confirmed by the client.",
    },
    seedNotes: {
      s1: "Test shipment for Kenneth with validated documentation.",
      s2: "Urgent cargo in release process.",
      s3: "Final delivery confirmed by the client.",
      l1: "Requests pricing for monthly cargo.",
      l2: "Needs to import small spare parts.",
    },
    static: {
      common: [
        { selector: "nav", attr: "aria-label", text: "Main navigation" },
        { selector: ".nav-toggle", attr: "aria-label", text: "Open menu" },
        { selector: ".nav-toggle", text: "☰" },
        { selector: "a.nav-link[href='index.html']", text: "Home" },
        { selector: "a.nav-link[href='servicios.html']", text: "Services" },
        { selector: "a.nav-link[href='rutas.html']", text: "Routes" },
        { selector: "a.nav-link[href='seguimiento.html']", text: "Tracking" },
        { selector: "a.nav-link[href='nosotros.html']", text: "About" },
        { selector: "a.nav-link[href='contacto.html']", text: "Contact" },
        { selector: "a.btn[href='contacto.html#cotizar']", text: "Quote" },
        { selector: "a.btn[href='#cotizar']", text: "Quote" },
        { selector: ".whatsapp", attr: "aria-label", text: "Contact on WhatsApp" },
      ],
      index: [
        { selector: ".hero .eyebrow", text: "International logistics operator" },
        { selector: ".hero h1", text: "Secure cargo, clear routes, and controlled deliveries." },
        { selector: ".hero p", index: 1, text: "We help companies and importers move goods by sea, air, and road while coordinating suppliers, documents, customs, and tracking from one point of contact." },
        { selector: ".hero-actions .btn", index: 0, text: "Request a quote" },
        { selector: ".hero-actions .btn", index: 1, text: "Track shipment" },
        { selector: ".hero-panel", attr: "aria-label", text: "Operations summary" },
        { selector: ".status-row span", index: 0, text: "Ports and airports" },
        { selector: ".status-row span", index: 1, text: "Transport modes" },
        { selector: ".status-row strong", index: 1, text: "Sea, air, road" },
        { selector: ".status-row span", index: 2, text: "Documentation support" },
        { selector: ".status-row strong", index: 2, text: "Customs and insurance" },
        { selector: ".status-row span", index: 3, text: "Operations base" },
        { selector: ".section .eyebrow", index: 0, text: "What we solve" },
        { selector: ".section-head h2", index: 0, text: "A logistics website should turn questions into real requests." },
        { selector: ".section-head .btn", index: 0, text: "View services" },
        { selector: ".card h3", index: 0, text: "Imports and exports" },
        { selector: ".card p", index: 0, text: "Present routes, modes, and the capacity to move cargo professionally." },
        { selector: ".card h3", index: 1, text: "Shipment tracking" },
        { selector: ".card p", index: 1, text: "Build trust by showing that cargo can be checked and updated." },
        { selector: ".card h3", index: 2, text: "Fast quotes" },
        { selector: ".card p", index: 2, text: "Convert visitors into prospects with origin, destination, cargo type, and contact details." },
        { selector: ".section-dark .eyebrow", text: "Commercial indicators" },
        { selector: ".section-dark h2", text: "Data that makes the company look serious." },
        { selector: ".metric span", index: 0, text: "operational visibility and attention for critical cases." },
        { selector: ".metric span", index: 1, text: "coordinated modes: ocean, air, and ground." },
        { selector: ".metric span", index: 2, text: "central executive for documents, route, ETA, and quote." },
        { selector: ".section-soft .eyebrow", text: "Process" },
        { selector: ".split h2", text: "From quote to delivery closeout." },
        { selector: ".split p", index: 1, text: "The site communicates a simple flow: the client requests a quote, Haru validates the route, coordinates the operation, and keeps the client informed until delivery." },
        { selector: ".list-check li", index: 0, text: "Receive cargo data, weight, volume, origin, and destination." },
        { selector: ".list-check li", index: 1, text: "Select the mode based on urgency, cost, and cargo type." },
        { selector: ".list-check li", index: 2, text: "Coordinate documents, customs, and milestone tracking." },
        { selector: ".footer p", index: 0, text: "International logistics solutions for companies that need to move cargo with order, visibility, and human support." },
        { selector: ".footer h3", index: 0, text: "Map" },
        { selector: ".footer h3", index: 1, text: "Contact" },
        { selector: ".footer small", text: "© 2026 Haru Logistics Group. All rights reserved." },
      ],
      servicios: [
        { selector: ".page-hero .eyebrow", text: "Services" },
        { selector: ".page-hero h1", text: "Solutions for moving cargo without improvising." },
        { selector: ".page-hero p", index: 1, text: "The goal is for clients to quickly understand what they can hire, what each service is for, and when to use it." },
        { selector: ".card h3", index: 0, text: "Ocean freight" },
        { selector: ".card p", index: 0, text: "Ideal for bulky cargo, full containers, consolidated cargo, and operations where volume cost is key." },
        { selector: ".card h3", index: 1, text: "Air freight" },
        { selector: ".card p", index: 1, text: "For urgent goods, spare parts, samples, high-value products, or deliveries with tight time windows." },
        { selector: ".card h3", index: 2, text: "Ground freight" },
        { selector: ".card p", index: 2, text: "Local and regional distribution, port-to-warehouse connections, pickups, final deliveries, and border movements." },
        { selector: ".card h3", index: 3, text: "Customs management" },
        { selector: ".card p", index: 3, text: "Support with documentation, import/export requirements, agent coordination, and cargo release." },
        { selector: ".card h3", index: 4, text: "Cargo insurance" },
        { selector: ".card p", index: 4, text: "Options to protect goods against damage, loss, or incidents during international transport." },
        { selector: ".card h3", index: 5, text: "Logistics consulting" },
        { selector: ".card p", index: 5, text: "Review routes, costs, timing, risks, and documents to make better decisions before shipping." },
        { selector: ".section-soft .eyebrow", text: "How we work" },
        { selector: ".section-soft h2", text: "A clear process sells trust." },
        { selector: ".process-step h3", index: 0, text: "Data" },
        { selector: ".process-step p", index: 0, text: "Origin, destination, product, weight, volume, and target date." },
        { selector: ".process-step h3", index: 1, text: "Route" },
        { selector: ".process-step p", index: 1, text: "Mode, cost, time, restrictions, and documentation are evaluated." },
        { selector: ".process-step h3", index: 2, text: "Operation" },
        { selector: ".process-step p", index: 2, text: "Transportation, customs, insurance, and involved providers are coordinated." },
        { selector: ".process-step h3", index: 3, text: "Closeout" },
        { selector: ".process-step p", index: 3, text: "Status, delivery, and final shipment documents are reported." },
        { selector: ".footer p", index: 0, text: "International transportation, customs, and tracking for business cargo." },
        { selector: ".footer h3", index: 0, text: "Services" },
        { selector: ".footer p", index: 1, html: "Ocean<br>Air<br>Ground<br>Customs" },
        { selector: ".footer h3", index: 1, text: "Contact" },
        { selector: ".footer a[href='contacto.html#cotizar']", text: "Request a quote" },
        { selector: ".footer a[href='seguimiento.html']", text: "Track shipment" },
      ],
      rutas: [
        { selector: ".page-hero .eyebrow", text: "Routes and coverage" },
        { selector: ".page-hero h1", text: "We connect Honduras with key markets." },
        { selector: ".page-hero p", index: 1, text: "This page shows clients where they can move cargo and what type of route they can request." },
        { selector: ".section-dark .eyebrow", text: "Coverage" },
        { selector: ".section-dark h2", text: "Ocean, air, and ground routes based on shipment urgency." },
        { selector: ".section-dark p", index: 1, text: "Coverage can be presented as a partner network and frequent routes, without promising exact times until the goods and documents are reviewed." },
        { selector: ".route-map", attr: "aria-label", text: "Visual route map" },
        { selector: ".route-map .us", text: "North America" },
        { selector: ".card h3", index: 0, text: "Central America" },
        { selector: ".card p", index: 0, text: "Regional ground movements, border customs, pickup, and final delivery." },
        { selector: ".card h3", index: 1, text: "North America" },
        { selector: ".card p", index: 1, text: "Imports and exports through ocean, air, and ground connections." },
        { selector: ".card h3", index: 2, text: "Europe" },
        { selector: ".card p", index: 2, text: "Document coordination and international transportation for commercial and project cargo." },
        { selector: ".card h3", index: 3, text: "Asia" },
        { selector: ".card p", index: 3, text: "Support for sourcing, consolidation, ocean shipping, and tracking from origin." },
        { selector: ".card h3", index: 4, text: "Ports" },
        { selector: ".card p", index: 4, text: "Coordination with terminals, carriers, agents, and transportation to warehouse." },
        { selector: ".card h3", index: 5, text: "Airports" },
        { selector: ".card p", index: 5, text: "Options for urgent cargo, commercial samples, and high-value goods." },
        { selector: ".footer p", index: 0, text: "International routes with logistics coordination from Honduras." },
        { selector: ".footer h3", index: 0, text: "Go to" },
        { selector: ".footer h3", index: 1, text: "Quote" },
        { selector: ".footer a[href='contacto.html#cotizar']", text: "Send cargo details" },
      ],
      seguimiento: [
        { selector: ".page-hero .eyebrow", text: "Tracking" },
        { selector: ".page-hero h1", text: "Clients do not only want to ship: they want to know where their cargo is." },
        { selector: ".page-hero p", index: 1, text: "This section looks up shipments created in the demo CRM. In production it would connect to a database so it works from any device." },
        { selector: ".tracking-box h2", text: "Track shipment" },
        { selector: ".tracking-box p", html: "Try <strong>HLG-2026-1840</strong>. When an executive creates a shipment in the internal system, the client can check the tracking number here." },
        { labelForSelector: "[data-tracking-form] input", text: "Tracking code" },
        { selector: "[data-tracking-form] input", attr: "placeholder", text: "HLG-2026-1840" },
        { selector: "[data-tracking-form] button", text: "Check status" },
        { selector: ".split > div:nth-child(2) .eyebrow", text: "Why it matters" },
        { selector: ".split > div:nth-child(2) h2", text: "Tracking reduces calls, questions, and uncertainty." },
        { selector: ".split > div:nth-child(2) p", index: 1, text: "For logistics, a professional website shows visibility: receipt, departure, transit, customs, arrival, and final delivery." },
        { selector: ".list-check li", index: 0, text: "Clients can check progress without waiting for a call." },
        { selector: ".list-check li", index: 1, text: "The commercial team can centralize frequent questions." },
        { selector: ".list-check li", index: 2, text: "The company projects operational order and technology capacity." },
        { selector: ".footer p", index: 0, text: "Demo tracking to communicate visibility and trust." },
        { selector: ".footer h3", index: 0, text: "Client" },
        { selector: ".footer p", index: 1, html: "Status lookup<br>Cargo milestones<br>Operational support" },
        { selector: ".footer h3", index: 1, text: "Contact" },
        { selector: ".footer a[href='contacto.html']", text: "Talk to an executive" },
      ],
      nosotros: [
        { selector: ".page-hero .eyebrow", text: "About us" },
        { selector: ".page-hero h1", text: "More human, organized, and visible logistics." },
        { selector: ".page-hero p", index: 1, text: "This page helps sell trust: it explains who the company is, how it works, and why a client should place cargo in its hands." },
        { selector: ".split .eyebrow", text: "Profile" },
        { selector: ".split h2", text: "Haru Logistics Group supports cargo operations from start to finish." },
        { selector: ".split p", index: 1, text: "The company is presented as a logistics ally for importers, exporters, distributors, and businesses that need to coordinate international transport with less friction." },
        { selector: ".list-check li", index: 0, text: "Clear communication during every shipment stage." },
        { selector: ".list-check li", index: 1, text: "Coordination with providers, agents, carriers, and transport companies." },
        { selector: ".list-check li", index: 2, text: "Focus on document security, timing, and client experience." },
        { selector: ".card h3", index: 0, text: "Mission" },
        { selector: ".card p", index: 0, text: "Simplify international cargo movement with clear, traceable solutions adapted to each client." },
        { selector: ".card h3", index: 1, text: "Vision" },
        { selector: ".card p", index: 1, text: "Become a regional logistics reference for reliability, service, and global coordination capacity." },
        { selector: ".card h3", index: 2, text: "Values" },
        { selector: ".card p", index: 2, text: "Responsibility, communication, punctuality, transparency, and care for the client's cargo." },
        { selector: ".footer p", index: 0, text: "Logistics ally for international cargo from Honduras." },
        { selector: ".footer h3", index: 0, text: "Company" },
        { selector: ".footer p", index: 1, html: "Mission<br>Vision<br>Values" },
        { selector: ".footer h3", index: 1, text: "Next step" },
        { selector: ".footer a[href='contacto.html#cotizar']", text: "Request a quote" },
      ],
      contacto: [
        { selector: ".page-hero .eyebrow", text: "Contact" },
        { selector: ".page-hero h1", text: "Quote your next shipment with clear details." },
        { selector: ".page-hero p", index: 1, text: "This is the most commercially important page: it turns visitor interest into a request the team can answer." },
        { selector: ".card h2", index: 0, text: "Quote request" },
        { selector: ".card p", index: 0, text: "While there is no backend, this form works as a demo. Later it can connect to email, WhatsApp, Google Sheets, CRM, or a database." },
        { labelFor: "nombre", text: "Name" },
        { labelFor: "empresa", text: "Company" },
        { labelFor: "correo", text: "Email" },
        { labelFor: "telefono", text: "Phone" },
        { labelFor: "origen", text: "Origin" },
        { selector: "input[name='origen']", attr: "placeholder", text: "City / country" },
        { labelFor: "destino", text: "Destination" },
        { selector: "input[name='destino']", attr: "placeholder", text: "City / country" },
        { labelFor: "tipo", text: "Freight type" },
        { optionTexts: "select[name='tipo']", texts: ["Select", "Ocean", "Air", "Ground", "Multimodal"] },
        { labelFor: "peso", text: "Weight or volume" },
        { selector: "input[name='peso']", attr: "placeholder", text: "Example: 500 kg / 4 m3" },
        { labelFor: "detalles", text: "Cargo details" },
        { selector: "textarea[name='detalles']", attr: "placeholder", text: "Product, dimensions, ideal date, available documents..." },
        { selector: "[data-demo-form] button", text: "Send request" },
        { selector: "aside .card h2", text: "Direct information" },
        { selector: "aside .card p", index: 0, html: "<strong>Location:</strong><br>Residencial Villanova, Villanueva, Cortes, Honduras" },
        { selector: "aside .card p", index: 1, html: "<strong>Email:</strong><br><a href=\"mailto:info@harulogisticsgroup.com\">info@harulogisticsgroup.com</a>" },
        { selector: "aside .card p", index: 2, html: "<strong>WhatsApp:</strong><br><a href=\"https://wa.me/50499803341\">+504 9980-3341</a>" },
        { selector: "aside .card p", index: 3, html: "<strong>Hours:</strong><br>Monday to Friday. Saturday until noon." },
        { selector: "aside .card h3", text: "What the client should send" },
        { selector: "aside .card p", index: 4, text: "Origin, destination, goods description, weight, volume, desired date, and whether customs, insurance, or final delivery is required." },
        { selector: ".footer p", index: 0, text: "Commercial contact and quotes for logistics operations." },
        { selector: ".footer h3", index: 0, text: "Reply quickly" },
        { selector: ".footer p", index: 1, html: "Origin<br>Destination<br>Weight<br>Cargo type" },
        { selector: ".footer h3", index: 1, text: "Links" },
      ],
      crm: [
        { selector: "a.nav-link[href='crm.html']", text: "Internal CRM" },
        { selector: "a.btn[href='index.html']", text: "Back to site" },
        { selector: ".page-hero .eyebrow", text: "Internal CRM" },
        { selector: ".page-hero h1", text: "Commercial, operational, and executive control in one panel." },
        { selector: ".page-hero p", index: 1, text: "Reps manage leads and shipments. The owner sees the whole operation: active cargo, estimated sales, deliveries, and performance by executive." },
        { selector: "[data-auth-login] .eyebrow", text: "Private access" },
        { selector: "[data-auth-login] h2", text: "Enter CRM" },
        { selector: "[data-auth-login] p", index: 1, text: "Only reps and owner should enter here. For the test, you can create a user with your email and a password of 6+ characters." },
        { labelFor: "email", text: "Email" },
        { labelFor: "password", text: "Password" },
        { selector: "input[name='password']", attr: "placeholder", text: "Minimum 6 characters" },
        { selector: "[data-login-form] button", text: "Enter CRM" },
        { selector: ".crm-session strong", text: "Active session:" },
        { selector: "[data-logout]", text: "Log out" },
        { labelForSelector: "[data-role]", text: "View" },
        { optionTexts: "[data-role]", texts: ["Rep / Executive", "Owner / Management"] },
        { labelForSelector: "[data-rep-filter]", text: "Rep" },
        { optionTexts: "[data-rep-filter]", texts: ["All"] },
        { selector: "[data-reset-demo]", text: "Reset demo data" },
        { selector: ".crm-kpi span", index: 0, text: "Active shipments" },
        { selector: ".crm-kpi span", index: 1, text: "Delivered" },
        { selector: ".crm-kpi span", index: 2, text: "Leads" },
        { selector: ".crm-kpi span", index: 3, text: "Estimated value" },
        { selector: ".crm-forms .card h2", index: 0, text: "Create shipment with tracking" },
        { selector: ".crm-forms .card p", index: 0, text: "This form generates or records the tracking number the client will use on the tracking page." },
        { labelFor: "tracking", text: "Tracking number" },
        { selector: "input[name='tracking']", attr: "placeholder", text: "Auto if left blank" },
        { labelFor: "rep", text: "Assigned rep" },
        { labelFor: "customer", text: "Client company" },
        { labelFor: "contact", text: "Contact" },
        { labelFor: "phone", text: "Phone" },
        { labelFor: "origin", text: "Origin" },
        { labelFor: "destination", text: "Destination" },
        { labelFor: "service", text: "Service" },
        { optionTexts: "select[name='service']", texts: ["Ocean freight", "Air freight", "Ground freight", "Multimodal"] },
        { labelFor: "status", text: "Status" },
        { optionTexts: "select[name='status']", texts: ["Booked", "Documents", "In transit", "In customs", "Delivered"] },
        { labelFor: "eta", text: "ETA" },
        { labelFor: "value", text: "Estimated value USD" },
        { labelFor: "notes", text: "Operations notes" },
        { selector: "textarea[name='notes']", attr: "placeholder", text: "Documents, carrier, observations, next step..." },
        { selector: "[data-shipment-form] button", text: "Create shipment" },
        { selector: ".crm-forms .card h2", index: 1, text: "Register lead" },
        { selector: ".crm-forms .card p", index: 1, text: "Leads come from calls, WhatsApp, referrals, or the public contact form." },
        { labelFor: "name", text: "Name" },
        { labelFor: "company", text: "Company" },
        { labelFor: "phone", text: "Phone" },
        { optionTexts: "select[name='service']", index: 1, texts: ["Ocean freight", "Air freight", "Ground freight", "Multimodal"] },
        { labelForSelector: "[data-lead-form] select[name='status']", text: "Sales stage" },
        { optionTexts: "[data-lead-form] select[name='status']", texts: ["New lead", "Quoted", "Booked"] },
        { selector: "[data-lead-form] textarea[name='notes']", attr: "placeholder", text: "Need, budget, date, objections..." },
        { selector: "[data-lead-form] button", text: "Save lead" },
        { selector: "[data-owner-panel] .eyebrow", text: "Owner view" },
        { selector: "[data-owner-panel] h2", text: "Performance by executive." },
        { tableHeaders: "[data-owner-panel] th", texts: ["Rep", "Leads", "Shipments", "Delivered", "Estimated value"] },
        { selector: ".crm-panel .eyebrow", index: 1, text: "Operations" },
        { selector: ".crm-panel h2", index: 1, text: "Shipments and tracking numbers." },
        { tableHeaders: ".crm-panel:nth-of-type(2) th", texts: ["Tracking", "Client", "Route", "Rep", "Status", "ETA", "Value"] },
        { selector: ".crm-panel .eyebrow", index: 2, text: "Sales" },
        { selector: ".crm-panel h2", index: 2, text: "Leads and opportunities." },
        { tableHeaders: ".crm-panel:nth-of-type(3) th", texts: ["Company", "Contact", "Route", "Service", "Rep", "Stage"] },
        { selector: ".footer p", index: 0, text: "Demo CRM to control leads, reps, shipments, statuses, and tracking numbers." },
        { selector: ".footer h3", index: 0, text: "Panels" },
        { selector: ".footer p", index: 1, html: "Rep<br>Owner<br>Operations" },
        { selector: ".footer h3", index: 1, text: "Client" },
        { selector: ".footer a[href='seguimiento.html']", text: "Check tracking" },
      ],
    },
  },
};

const seedShipments = [
  {
    id: "s1",
    tracking: "HLG-2026-1840",
    customer: "Kenneth Logistics Test",
    contact: "Kenneth",
    email: "kenneth@example.com",
    phone: "+504 9980-3341",
    rep: "Andrea Mejia",
    service: "Maritimo",
    origin: "Puerto Cortes, Honduras",
    destination: "Miami, Estados Unidos",
    status: "transit",
    eta: "2026-05-12",
    value: 1850,
    notes: "Envio de prueba para Kenneth con documentacion validada.",
    updatedAt: "2026-05-06 09:30",
  },
  {
    id: "s2",
    tracking: "HLG-2026-2215",
    customer: "Pacific Imports",
    contact: "Maria Thompson",
    email: "maria@pacificimports.com",
    phone: "+1 305 555 0130",
    rep: "Carlos Rivera",
    service: "Aereo",
    origin: "San Pedro Sula, Honduras",
    destination: "Madrid, Espana",
    status: "customs",
    eta: "2026-05-09",
    value: 920,
    notes: "Carga urgente en proceso de liberacion.",
    updatedAt: "2026-05-06 11:10",
  },
  {
    id: "s3",
    tracking: "HLG-2026-3098",
    customer: "Rivera Foods",
    contact: "Jorge Rivera",
    email: "jorge@riverafoods.com",
    phone: "+504 2234-1000",
    rep: "Daniel Santos",
    service: "Terrestre",
    origin: "Villanueva, Honduras",
    destination: "Guatemala City, Guatemala",
    status: "delivered",
    eta: "2026-05-05",
    value: 640,
    notes: "Entrega final confirmada por cliente.",
    updatedAt: "2026-05-05 16:45",
  },
];

const seedLeads = [
  {
    id: "l1",
    name: "Laura Martinez",
    company: "Textiles Norte",
    email: "laura@textilesnorte.com",
    phone: "+504 9999-1001",
    origin: "Honduras",
    destination: "Mexico",
    service: "Maritimo",
    rep: "Andrea Mejia",
    status: "quoted",
    notes: "Solicita costo para carga mensual.",
    createdAt: "2026-05-06",
  },
  {
    id: "l2",
    name: "Roberto Diaz",
    company: "Repuestos RD",
    email: "roberto@repuestosrd.com",
    phone: "+504 9999-1002",
    origin: "Estados Unidos",
    destination: "Honduras",
    service: "Aereo",
    rep: "Carlos Rivera",
    status: "lead",
    notes: "Necesita importar repuestos pequenos.",
    createdAt: "2026-05-06",
  },
];

function readStore(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return [...fallback];
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(key, JSON.stringify(fallback));
    return [...fallback];
  }
}

function writeStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getShipments() {
  return readStore(CRM_STORAGE, seedShipments);
}

function setShipments(shipments) {
  writeStore(CRM_STORAGE, shipments);
}

function getLeads() {
  return readStore(LEAD_STORAGE, seedLeads);
}

function setLeads(leads) {
  writeStore(LEAD_STORAGE, leads);
}

function initFirebase() {
  if (!window.firebase || firebaseApp) return Boolean(firebaseApp);

  firebaseApp = window.firebase.initializeApp(firebaseConfig);
  firebaseAuth = window.firebase.auth ? window.firebase.auth() : null;
  firestoreDb = window.firebase.firestore ? window.firebase.firestore() : null;
  return true;
}

async function fetchShipmentsFromFirestore() {
  if (!firestoreDb) return null;
  const snap = await firestoreDb.collection("shipments").orderBy("updatedAt", "desc").get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function fetchLeadsFromFirestore() {
  if (!firestoreDb) return null;
  const snap = await firestoreDb.collection("leads").orderBy("createdAt", "desc").get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function saveShipmentToFirestore(shipment) {
  if (!firestoreDb) return;
  await firestoreDb.collection("shipments").doc(shipment.id).set(shipment, { merge: true });
}

async function saveLeadToFirestore(lead) {
  if (!firestoreDb || !firebaseAuth || !firebaseAuth.currentUser) return;
  await firestoreDb.collection("leads").doc(lead.id).set(lead, { merge: true });
}

async function findShipmentByTracking(code) {
  initFirebase();
  if (firestoreDb) {
    try {
      const snap = await firestoreDb.collection("shipments").where("tracking", "==", code).limit(1).get();
      if (!snap.empty) {
        const doc = snap.docs[0];
        return { id: doc.id, ...doc.data() };
      }
    } catch (error) {
      console.warn("Firestore tracking lookup failed, using local demo data.", error);
    }
  }

  return getShipments().find((item) => item.tracking.toUpperCase() === code);
}

function todayStamp() {
  const locale = getLanguage() === "en" ? "en-US" : "es-HN";
  return new Date().toLocaleString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function generateTracking() {
  const year = new Date().getFullYear();
  const code = Math.floor(1000 + Math.random() * 9000);
  return `HLG-${year}-${code}`;
}

function newId(prefix) {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function money(value) {
  const locale = getLanguage() === "en" ? "en-US" : "es-HN";
  return new Intl.NumberFormat(locale, { style: "currency", currency: "USD" }).format(Number(value || 0));
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function currentPage() {
  const file = window.location.pathname.split("/").pop() || "index.html";
  return file.replace(".html", "") || "index";
}

function getLanguage() {
  const stored = localStorage.getItem(LANGUAGE_STORAGE);
  return stored === "en" ? "en" : "es";
}

function setLanguage(language) {
  localStorage.setItem(LANGUAGE_STORAGE, language === "en" ? "en" : "es");
  applyLanguage();
}

function langText() {
  return i18n[getLanguage()] || i18n.es;
}

function phrase(key, replacements = {}) {
  const template = langText().dynamic[key] || i18n.es.dynamic[key] || key;
  return Object.entries(replacements).reduce((text, [name, value]) => {
    return text.replaceAll(`{${name}}`, value);
  }, template);
}

function statusLabel(status) {
  return langText().status[status] || status;
}

function serviceLabel(service) {
  return langText().service[service] || service;
}

function routeLabel(value) {
  const lang = getLanguage();
  const replacements = lang === "en"
    ? {
        "Estados Unidos": "United States",
        "Espana": "Spain",
        "Puerto Cortes": "Puerto Cortes",
        "Ciudad de Guatemala": "Guatemala City",
      }
    : {
        "United States": "Estados Unidos",
        "Spain": "Espana",
      };

  return Object.entries(replacements).reduce((text, [from, to]) => {
    return String(text || "").replaceAll(from, to);
  }, value);
}

function seedNote(item) {
  return langText().seedNotes[item.id] || item.notes || "";
}

function updateLabelText(label, text) {
  if (!label) return;
  const textNode = Array.from(label.childNodes).find((node) => (
    node.nodeType === Node.TEXT_NODE && node.textContent.trim()
  ));

  if (textNode) {
    textNode.textContent = `${text}\n              `;
  } else {
    label.insertBefore(document.createTextNode(`${text} `), label.firstChild);
  }
}

function applyTranslationItem(item) {
  if (item.labelFor) {
    document.querySelectorAll(`[name="${item.labelFor}"]`).forEach((field) => {
      updateLabelText(field.closest("label"), item.text);
    });
    return;
  }

  if (item.labelForSelector) {
    const field = document.querySelector(item.labelForSelector);
    updateLabelText(field ? field.closest("label") : null, item.text);
    return;
  }

  if (item.optionTexts) {
    const selects = Array.from(document.querySelectorAll(item.optionTexts));
    const select = item.index === undefined ? selects[0] : selects[item.index];
    if (!select) return;
    Array.from(select.options).forEach((option, optionIndex) => {
      if (item.texts[optionIndex] !== undefined) option.textContent = item.texts[optionIndex];
    });
    return;
  }

  if (item.tableHeaders) {
    document.querySelectorAll(item.tableHeaders).forEach((header, index) => {
      if (item.texts[index] !== undefined) header.textContent = item.texts[index];
    });
    return;
  }

  const elements = Array.from(document.querySelectorAll(item.selector));
  const element = item.index === undefined ? elements[0] : elements[item.index];
  if (!element) return;

  if (item.attr) {
    element.setAttribute(item.attr, item.text);
    return;
  }

  if (item.html !== undefined) {
    element.innerHTML = item.html;
    return;
  }

  element.textContent = item.text;
}

function ensureLanguageToggle() {
  document.querySelectorAll(".nav-menu").forEach((menu) => {
    if (menu.querySelector("[data-language-toggle]")) return;
    const button = document.createElement("button");
    button.className = "language-toggle";
    button.type = "button";
    button.dataset.languageToggle = "";
    const quoteButton = Array.from(menu.children).find((item) => item.classList.contains("btn"));
    menu.insertBefore(button, quoteButton || null);
  });
}

function applyLanguage() {
  const lang = getLanguage();
  const text = langText();
  const page = currentPage();
  const metaDescription = document.querySelector('meta[name="description"]');

  document.documentElement.lang = lang;
  if (text.title[page]) document.title = text.title[page];
  if (metaDescription && text.meta[page]) metaDescription.setAttribute("content", text.meta[page]);

  ensureLanguageToggle();
  document.querySelectorAll("[data-language-toggle]").forEach((button) => {
    button.textContent = text.langLabel;
    button.setAttribute("aria-label", text.langAria);
  });

  [...text.static.common, ...(text.static[page] || [])].forEach(applyTranslationItem);

  if (crmInitialized) renderCrm();
  if (lastTrackingCode && trackingResult && trackingResult.classList.contains("show")) {
    renderPublicTracking(lastTrackingCode);
  }
}

document.addEventListener("click", (event) => {
  if (!event.target.matches("[data-language-toggle]")) return;
  setLanguage(getLanguage() === "en" ? "es" : "en");
});

const toggle = document.querySelector(".nav-toggle");
const menu = document.querySelector(".nav-menu");

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll("[data-demo-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const leads = getLeads();
    const lead = {
      id: newId("lead"),
      name: data.nombre || data.name || phrase("demoCustomer"),
      company: data.empresa || phrase("noCompany"),
      email: data.correo || "",
      phone: data.telefono || "",
      origin: data.origen || "",
      destination: data.destino || "",
      service: data.tipo || "Por definir",
      rep: reps[0],
      status: "lead",
      notes: data.detalles || "",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    leads.unshift(lead);
    setLeads(leads);

    const notice = form.querySelector(".notice") || document.querySelector(`#${form.dataset.notice}`);
    if (notice) {
      notice.classList.add("show");
      notice.textContent = phrase("demoNotice");
    }
    form.reset();
  });
});

const trackingForm = document.querySelector("[data-tracking-form]");
const trackingResult = document.querySelector("[data-tracking-result]");
let lastTrackingCode = null;

if (trackingForm && trackingResult) {
  initFirebase();
  const params = new URLSearchParams(window.location.search);
  const trackParam = params.get("track");
  if (trackParam) {
    trackingForm.querySelector("input").value = trackParam.toUpperCase();
    renderPublicTracking(trackParam.toUpperCase());
  }

  trackingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const code = trackingForm.querySelector("input").value.trim().toUpperCase();
    if (!code) return;
    renderPublicTracking(code);
  });
}

async function renderPublicTracking(code) {
  lastTrackingCode = code;
  trackingResult.innerHTML = `<strong>${phrase("checkingStatus")}</strong>`;
  trackingResult.classList.add("show");
  const shipment = await findShipmentByTracking(code);

  if (!shipment) {
    trackingResult.innerHTML = `
      <strong>${escapeHtml(phrase("notFoundTitle", { code: escapeHtml(code) }))}</strong>
      <p>${phrase("notFoundBody")}</p>
    `;
    trackingResult.classList.add("show");
    return;
  }

  const currentIndex = statusFlow.indexOf(shipment.status);
  const steps = statusFlow.map((status, index) => {
    const done = index <= currentIndex;
    return `
      <div class="timeline-item ${done ? "is-done" : ""}">
        <span class="dot"></span>
        <div><strong>${statusLabel(status)}</strong><br><span>${trackingMessage(status, shipment)}</span></div>
      </div>
    `;
  }).join("");

  trackingResult.innerHTML = `
    <div class="tracking-summary">
      <strong>${escapeHtml(shipment.tracking)} - ${statusLabel(shipment.status)}</strong>
      <span>${escapeHtml(routeLabel(shipment.origin))} ${phrase("toward")} ${escapeHtml(routeLabel(shipment.destination))}</span>
      <span>ETA: ${escapeHtml(shipment.eta || phrase("etaUnknown"))} | ${phrase("executive")}: ${escapeHtml(shipment.rep)}</span>
    </div>
    <div class="timeline">${steps}</div>
    <p><strong>${phrase("lastUpdate")}</strong> ${escapeHtml(shipment.updatedAt)}</p>
  `;
  trackingResult.classList.add("show");
}

function trackingMessage(status, shipment) {
  return `${langText().trackingMessages[status]} ${seedNote(shipment)}`.trim();
}

const crmRoot = document.querySelector("[data-crm]");
let crmInitialized = false;

ensureLanguageToggle();
applyLanguage();

if (crmRoot) {
  initCrmAuth();
}

function initCrmAuth() {
  initFirebase();
  const loginPanel = document.querySelector("[data-auth-login]");
  const appPanel = document.querySelector("[data-auth-app]");
  const loginForm = document.querySelector("[data-login-form]");
  const logoutButton = document.querySelector("[data-logout]");
  const authEmail = document.querySelector("[data-auth-email]");

  if (!firebaseAuth) {
    loginPanel.innerHTML = `<h2>${phrase("firebaseAuthMissingTitle")}</h2><p>${phrase("firebaseAuthMissingBody")}</p>`;
    return;
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = loginForm.email.value.trim();
    const password = loginForm.password.value;
    const message = loginForm.querySelector(".notice");
    message.classList.add("show");
    message.textContent = phrase("validatingAccess");

    try {
      await firebaseAuth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      if (error.code === "auth/user-not-found" || error.code === "auth/invalid-credential") {
        try {
          await firebaseAuth.createUserWithEmailAndPassword(email, password);
        } catch (createError) {
          message.textContent = loginErrorMessage(createError);
        }
      } else {
        message.textContent = loginErrorMessage(error);
      }
    }
  });

  logoutButton.addEventListener("click", () => firebaseAuth.signOut());

  firebaseAuth.onAuthStateChanged(async (user) => {
    const loggedIn = Boolean(user);
    loginPanel.hidden = loggedIn;
    appPanel.hidden = !loggedIn;
    authEmail.textContent = user ? user.email : "";

    if (loggedIn) {
      await hydrateCrmFromFirestore();
      initCrm();
    }
  });
}

function loginErrorMessage(error) {
  if (error.code === "auth/operation-not-allowed") {
    return phrase("authEnableEmail");
  }

  if (error.code === "auth/weak-password") {
    return phrase("authWeakPassword");
  }

  return phrase("authFailed", { message: error.message });
}

async function hydrateCrmFromFirestore() {
  initFirebase();
  if (!firestoreDb) return;

  try {
    let [shipments, leads] = await Promise.all([fetchShipmentsFromFirestore(), fetchLeadsFromFirestore()]);
    if (!shipments || shipments.length === 0) {
      await Promise.all(seedShipments.map((shipment) => saveShipmentToFirestore(shipment)));
      shipments = seedShipments;
    }
    if (!leads || leads.length === 0) {
      await Promise.all(seedLeads.map((lead) => saveLeadToFirestore(lead)));
      leads = seedLeads;
    }
    setShipments(shipments);
    setLeads(leads);
  } catch (error) {
    console.warn("Firestore CRM load failed, using local demo data.", error);
  }
}

function initCrm() {
  if (crmInitialized) {
    renderCrm();
    return;
  }
  crmInitialized = true;

  const roleSelect = document.querySelector("[data-role]");
  const repSelect = document.querySelector("[data-rep-filter]");
  const shipmentForm = document.querySelector("[data-shipment-form]");
  const leadForm = document.querySelector("[data-lead-form]");
  const resetButton = document.querySelector("[data-reset-demo]");

  reps.forEach((rep) => {
    repSelect.insertAdjacentHTML("beforeend", `<option>${rep}</option>`);
    shipmentForm.querySelector('[name="rep"]').insertAdjacentHTML("beforeend", `<option>${rep}</option>`);
    leadForm.querySelector('[name="rep"]').insertAdjacentHTML("beforeend", `<option>${rep}</option>`);
  });

  roleSelect.addEventListener("change", renderCrm);
  repSelect.addEventListener("change", renderCrm);

  shipmentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(shipmentForm).entries());
    const shipments = getShipments();
    const shipment = {
      id: newId("shipment"),
      tracking: (data.tracking || generateTracking()).toUpperCase(),
      customer: data.customer,
      contact: data.contact,
      email: data.email,
      phone: data.phone,
      rep: data.rep,
      service: data.service,
      origin: data.origin,
      destination: data.destination,
      status: data.status,
      eta: data.eta,
      value: Number(data.value || 0),
      notes: data.notes,
      updatedAt: todayStamp(),
    };
    shipments.unshift(shipment);
    setShipments(shipments);
    saveShipmentToFirestore(shipment).catch((error) => console.warn("Shipment sync failed.", error));
    shipmentForm.reset();
    renderCrm();
  });

  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(leadForm).entries());
    const leads = getLeads();
    const lead = {
      id: newId("lead"),
      name: data.name,
      company: data.company,
      email: data.email,
      phone: data.phone,
      origin: data.origin,
      destination: data.destination,
      service: data.service,
      rep: data.rep,
      status: data.status,
      notes: data.notes,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    leads.unshift(lead);
    setLeads(leads);
    saveLeadToFirestore(lead).catch((error) => console.warn("Lead sync failed.", error));
    leadForm.reset();
    renderCrm();
  });

  resetButton.addEventListener("click", () => {
    setShipments(seedShipments);
    setLeads(seedLeads);
    Promise.all([
      ...seedShipments.map((shipment) => saveShipmentToFirestore(shipment)),
      ...seedLeads.map((lead) => saveLeadToFirestore(lead)),
    ]).catch((error) => console.warn("Demo reset sync failed.", error));
    renderCrm();
  });

  document.addEventListener("change", (event) => {
    if (!event.target.matches("[data-status-update]")) return;
    const shipments = getShipments();
    const shipment = shipments.find((item) => item.id === event.target.dataset.statusUpdate);
    if (!shipment) return;
    shipment.status = event.target.value;
    shipment.updatedAt = todayStamp();
    setShipments(shipments);
    saveShipmentToFirestore(shipment).catch((error) => console.warn("Status sync failed.", error));
    renderCrm();
  });

  renderCrm();
}

function crmContext() {
  const role = document.querySelector("[data-role]").value;
  const rep = document.querySelector("[data-rep-filter]").value;
  const owner = role === "owner";
  return { role, rep, owner };
}

function visibleRecords(records) {
  const { owner, rep } = crmContext();
  if (owner || rep === "Todos") return records;
  return records.filter((item) => item.rep === rep);
}

function renderCrm() {
  const shipments = visibleRecords(getShipments());
  const leads = visibleRecords(getLeads());
  renderKpis(shipments, leads);
  renderShipmentTable(shipments);
  renderLeadTable(leads);
  renderOwnerPanel(getShipments(), getLeads());
}

function renderKpis(shipments, leads) {
  const totalValue = shipments.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const active = shipments.filter((item) => item.status !== "delivered").length;
  const delivered = shipments.filter((item) => item.status === "delivered").length;

  document.querySelector("[data-kpi-active]").textContent = active;
  document.querySelector("[data-kpi-delivered]").textContent = delivered;
  document.querySelector("[data-kpi-leads]").textContent = leads.length;
  document.querySelector("[data-kpi-value]").textContent = money(totalValue);
}

function renderShipmentTable(shipments) {
  const tbody = document.querySelector("[data-shipments-table]");
  tbody.innerHTML = shipments.map((item) => `
    <tr>
      <td><strong><a href="seguimiento.html?track=${encodeURIComponent(item.tracking)}">${escapeHtml(item.tracking)}</a></strong><br><span>${escapeHtml(serviceLabel(item.service))}</span></td>
      <td>${escapeHtml(item.customer)}<br><span>${escapeHtml(item.contact)}</span></td>
      <td>${escapeHtml(routeLabel(item.origin))}<br><span>${escapeHtml(routeLabel(item.destination))}</span></td>
      <td>${escapeHtml(item.rep)}</td>
      <td>
        <select data-status-update="${escapeHtml(item.id)}">
          ${statusFlow.map((status) => `<option value="${status}" ${item.status === status ? "selected" : ""}>${statusLabel(status)}</option>`).join("")}
        </select>
      </td>
      <td>${escapeHtml(item.eta)}</td>
      <td>${money(item.value)}</td>
    </tr>
  `).join("");
}

function renderLeadTable(leads) {
  const tbody = document.querySelector("[data-leads-table]");
  tbody.innerHTML = leads.map((item) => `
    <tr>
      <td><strong>${escapeHtml(item.company)}</strong><br><span>${escapeHtml(item.name)}</span></td>
      <td>${escapeHtml(item.email)}<br><span>${escapeHtml(item.phone)}</span></td>
      <td>${escapeHtml(routeLabel(item.origin))}<br><span>${escapeHtml(routeLabel(item.destination))}</span></td>
      <td>${escapeHtml(serviceLabel(item.service))}</td>
      <td>${escapeHtml(item.rep)}</td>
      <td>${statusLabel(item.status)}</td>
    </tr>
  `).join("");
}

function renderOwnerPanel(allShipments, allLeads) {
  const panel = document.querySelector("[data-owner-panel]");
  const { owner } = crmContext();
  panel.hidden = !owner;
  if (!owner) return;

  const rows = reps.map((rep) => {
    const repShipments = allShipments.filter((item) => item.rep === rep);
    const repLeads = allLeads.filter((item) => item.rep === rep);
    const revenue = repShipments.reduce((sum, item) => sum + Number(item.value || 0), 0);
    return `
      <tr>
        <td><strong>${rep}</strong></td>
        <td>${repLeads.length}</td>
        <td>${repShipments.length}</td>
        <td>${repShipments.filter((item) => item.status === "delivered").length}</td>
        <td>${money(revenue)}</td>
      </tr>
    `;
  }).join("");

  panel.querySelector("tbody").innerHTML = rows;
}
