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
    const notice = form.querySelector(".notice") || document.querySelector(`#${form.dataset.notice}`);
    if (notice) {
      notice.classList.add("show");
      notice.textContent = "Solicitud registrada para demostración. En un sitio publicado, este formulario puede conectarse a correo, WhatsApp, CRM o una base de datos.";
    }
    form.reset();
  });
});

const trackingForm = document.querySelector("[data-tracking-form]");
const trackingResult = document.querySelector("[data-tracking-result]");

if (trackingForm && trackingResult) {
  trackingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const code = trackingForm.querySelector("input").value.trim().toUpperCase();
    if (!code) return;

    trackingResult.innerHTML = `
      <div class="timeline">
        <div class="timeline-item">
          <span class="dot"></span>
          <div><strong>${code} recibido en sistema</strong><br><span>Documentación y datos de carga validados.</span></div>
        </div>
        <div class="timeline-item">
          <span class="dot"></span>
          <div><strong>En tránsito internacional</strong><br><span>Última actualización: conexión marítima/aérea confirmada.</span></div>
        </div>
        <div class="timeline-item">
          <span class="dot"></span>
          <div><strong>Entrega estimada</strong><br><span>El ejecutivo asignado confirmará fecha final al completar aduana.</span></div>
        </div>
      </div>
    `;
    trackingResult.classList.add("show");
  });
}
