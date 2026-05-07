const CRM_STORAGE = "haru_crm_shipments";
const LEAD_STORAGE = "haru_crm_leads";
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

const statusLabels = {
  lead: "Lead nuevo",
  quoted: "Cotizado",
  booked: "Reservado",
  docs: "Documentos",
  transit: "En transito",
  customs: "En aduana",
  delivered: "Entregado",
};

const statusFlow = ["booked", "docs", "transit", "customs", "delivered"];

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
  return new Date().toLocaleString("es-HN", {
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
  return new Intl.NumberFormat("es-HN", { style: "currency", currency: "USD" }).format(Number(value || 0));
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

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
      name: data.nombre || data.name || "Cliente web",
      company: data.empresa || "Sin empresa",
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
      notice.textContent = "Solicitud registrada en el CRM demo. Un rep puede verla en la pagina CRM y convertirla en envio con tracking number.";
    }
    form.reset();
  });
});

const trackingForm = document.querySelector("[data-tracking-form]");
const trackingResult = document.querySelector("[data-tracking-result]");

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
  trackingResult.innerHTML = "<strong>Consultando estado...</strong>";
  trackingResult.classList.add("show");
  const shipment = await findShipmentByTracking(code);

  if (!shipment) {
    trackingResult.innerHTML = `
      <strong>No encontramos el tracking number ${escapeHtml(code)}.</strong>
      <p>Verifica que el codigo este escrito igual al que te envio tu ejecutivo. Tambien puedes probar HLG-2026-1840.</p>
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
        <div><strong>${statusLabels[status]}</strong><br><span>${trackingMessage(status, shipment)}</span></div>
      </div>
    `;
  }).join("");

  trackingResult.innerHTML = `
    <div class="tracking-summary">
      <strong>${escapeHtml(shipment.tracking)} - ${statusLabels[shipment.status]}</strong>
      <span>${escapeHtml(shipment.origin)} hacia ${escapeHtml(shipment.destination)}</span>
      <span>ETA: ${escapeHtml(shipment.eta || "Por confirmar")} | Ejecutivo: ${escapeHtml(shipment.rep)}</span>
    </div>
    <div class="timeline">${steps}</div>
    <p><strong>Ultima actualizacion:</strong> ${escapeHtml(shipment.updatedAt)}</p>
  `;
  trackingResult.classList.add("show");
}

function trackingMessage(status, shipment) {
  const messages = {
    booked: "La reserva fue creada y el embarque esta registrado.",
    docs: "Documentos comerciales y datos de carga en revision.",
    transit: "La carga se encuentra moviendose por la ruta coordinada.",
    customs: "El envio esta en proceso de revision o liberacion aduanera.",
    delivered: "La entrega final fue completada o confirmada por el cliente.",
  };
  return `${messages[status]} ${shipment.notes || ""}`.trim();
}

const crmRoot = document.querySelector("[data-crm]");

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
    loginPanel.innerHTML = "<h2>Firebase Auth no cargo.</h2><p>Revisa la conexion a internet o los scripts de Firebase.</p>";
    return;
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = loginForm.email.value.trim();
    const password = loginForm.password.value;
    const message = loginForm.querySelector(".notice");
    message.classList.add("show");
    message.textContent = "Validando acceso...";

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
    return "Activa Email/Password en Firebase Authentication para poder iniciar sesion.";
  }

  if (error.code === "auth/weak-password") {
    return "La contrasena debe tener al menos 6 caracteres.";
  }

  return `No se pudo iniciar sesion: ${error.message}`;
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

let crmInitialized = false;

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
      <td><strong><a href="seguimiento.html?track=${encodeURIComponent(item.tracking)}">${escapeHtml(item.tracking)}</a></strong><br><span>${escapeHtml(item.service)}</span></td>
      <td>${escapeHtml(item.customer)}<br><span>${escapeHtml(item.contact)}</span></td>
      <td>${escapeHtml(item.origin)}<br><span>${escapeHtml(item.destination)}</span></td>
      <td>${escapeHtml(item.rep)}</td>
      <td>
        <select data-status-update="${escapeHtml(item.id)}">
          ${statusFlow.map((status) => `<option value="${status}" ${item.status === status ? "selected" : ""}>${statusLabels[status]}</option>`).join("")}
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
      <td>${escapeHtml(item.origin)}<br><span>${escapeHtml(item.destination)}</span></td>
      <td>${escapeHtml(item.service)}</td>
      <td>${escapeHtml(item.rep)}</td>
      <td>${statusLabels[item.status] || item.status}</td>
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
