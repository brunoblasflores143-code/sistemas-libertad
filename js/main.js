/* ==========================================================
   main.js  |  Sistemas Informáticos - U.E. Plena Libertad
   Índice:
     1. Datos que puedes cambiar
     2. WhatsApp, mapa, redes y formulario
     3. Menú del celular y sección activa
     4. Barra de progreso
     5. Código animado del inicio
     6. Pestañas del plan de estudios
     7. Visor de promociones con flechas
   ========================================================== */

const reducirMovimiento = matchMedia("(prefers-reduced-motion: reduce)").matches;


/* ----------------------------------------------------------
   1. DATOS QUE PUEDES CAMBIAR
   ---------------------------------------------------------- */

// Número de WhatsApp: código de país (591) + número, sin "+" ni espacios.
const WHATSAPP = "59170000000";

// Mensaje inicial del botón flotante de WhatsApp.
const MENSAJE = "Hola, quisiera información sobre la carrera de Sistemas Informáticos";

// Lugar que muestran el mapa y el botón "Cómo llegar".
const LUGAR_MAPA = "Unidad Educativa Plena Libertad, Montero, Santa Cruz, Bolivia";

// Redes sociales: pega el enlace entre las comillas. Las vacías no aparecen.
const REDES = {
  Facebook: "",
  Instagram: "",
  TikTok: "",
  YouTube: ""
};


/* ----------------------------------------------------------
   2. WHATSAPP, MAPA, REDES Y FORMULARIO
   ---------------------------------------------------------- */
const enlaceWhatsapp = (texto) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;

document.getElementById("wa-flota").href = enlaceWhatsapp(MENSAJE);
document.getElementById("anio").textContent = new Date().getFullYear();
document.getElementById("mapa").href =
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(LUGAR_MAPA);
document.getElementById("mapa-embed").src =
  "https://maps.google.com/maps?q=" + encodeURIComponent(LUGAR_MAPA) + "&output=embed";

const listaRedes = document.getElementById("redes");
Object.entries(REDES).forEach(([nombre, enlace]) => {
  if (!enlace) return;
  listaRedes.insertAdjacentHTML("beforeend",
    `<li><a href="${enlace}" target="_blank" rel="noopener">${nombre}</a></li>`);
});

document.getElementById("form-contacto").addEventListener("submit", (e) => {
  e.preventDefault();
  const d = new FormData(e.target);
  const texto = `Hola, soy ${d.get("nombre")}, estoy en ${d.get("curso")}. Me interesa la carrera de Sistemas Informáticos.` +
    (d.get("mensaje") ? ` ${d.get("mensaje")}` : "");
  window.open(enlaceWhatsapp(texto), "_blank", "noopener");
});


/* ----------------------------------------------------------
   3. MENÚ DEL CELULAR Y SECCIÓN ACTIVA
   ---------------------------------------------------------- */
const botonMenu = document.querySelector(".burger");
const menu = document.getElementById("menu");

botonMenu.addEventListener("click", () => {
  botonMenu.setAttribute("aria-expanded", menu.classList.toggle("abierto"));
});
menu.addEventListener("click", () => {
  menu.classList.remove("abierto");
  botonMenu.setAttribute("aria-expanded", "false");
});

const enlacesMenu = [...menu.querySelectorAll("a")];
const observadorMenu = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (!entrada.isIntersecting) return;
    enlacesMenu.forEach((a) =>
      a.classList.toggle("activo", a.getAttribute("href") === "#" + entrada.target.id));
  });
}, { rootMargin: "-40% 0px -55% 0px" });
document.querySelectorAll("main section[id]").forEach((s) => observadorMenu.observe(s));


/* ----------------------------------------------------------
   4. BARRA DE PROGRESO (franja tricolor arriba)
   ---------------------------------------------------------- */
const barra = document.getElementById("progreso");
addEventListener("scroll", () => {
  const total = document.documentElement.scrollHeight - innerHeight;
  barra.style.width = (total > 0 ? (scrollY / total) * 100 : 0) + "%";
}, { passive: true });


/* ----------------------------------------------------------
   5. CÓDIGO ANIMADO DEL INICIO (aparece línea por línea)
   ---------------------------------------------------------- */
const lineasCodigo = [...document.querySelectorAll("#codigo .l")];
if (!reducirMovimiento) {
  lineasCodigo.forEach((linea) => (linea.style.visibility = "hidden"));
  lineasCodigo.forEach((linea, i) => setTimeout(() => (linea.style.visibility = "visible"), 500 + i * 450));
}


/* ----------------------------------------------------------
   6. PESTAÑAS DEL PLAN DE ESTUDIOS (4.º, 5.º y 6.º año)
   ---------------------------------------------------------- */
const pestanas = [...document.querySelectorAll(".tabs button")];
pestanas.forEach((pestana) => {
  pestana.addEventListener("click", () => {
    pestanas.forEach((p) => {
      const activa = p === pestana;
      p.setAttribute("aria-selected", activa);
      document.getElementById(p.getAttribute("aria-controls")).hidden = !activa;
    });
  });
});


/* ----------------------------------------------------------
   7. VISOR DE PROMOCIONES CON FLECHAS
   ---------------------------------------------------------- */
const visor = document.getElementById("visor");
const visorImagen = visor.querySelector("img");
const visorTexto = visor.querySelector("p");
const figuras = [...document.querySelectorAll(".promos figure")];
let posicion = 0;

function mostrarFoto(indice) {
  posicion = (indice + figuras.length) % figuras.length;
  const foto = figuras[posicion].querySelector("img");
  visorImagen.src = foto.src;
  visorImagen.alt = foto.alt;
  visorTexto.textContent = "Promoción " + figuras[posicion].querySelector("figcaption").firstChild.textContent.trim();
  visor.hidden = false;
}

figuras.forEach((figura, i) => figura.addEventListener("click", () => mostrarFoto(i)));

visor.addEventListener("click", (e) => {
  if (e.target === visor || e.target.classList.contains("cerrar")) visor.hidden = true;
  if (e.target.classList.contains("ant")) mostrarFoto(posicion - 1);
  if (e.target.classList.contains("sig")) mostrarFoto(posicion + 1);
});

document.addEventListener("keydown", (e) => {
  if (visor.hidden) return;
  if (e.key === "Escape") visor.hidden = true;
  if (e.key === "ArrowLeft") mostrarFoto(posicion - 1);
  if (e.key === "ArrowRight") mostrarFoto(posicion + 1);
});
