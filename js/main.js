// ===== Tema claro / oscuro (se recuerda entre páginas) =====
(function () {
  const root = document.documentElement;
  let saved = null;
  try { saved = localStorage.getItem("tema"); } catch (e) {}
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = saved || (prefersDark ? "dark" : "light");

  document.querySelectorAll(".theme-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem("tema", root.dataset.theme); } catch (e) {}
    });
  });
})();

// ===== Menú en móvil =====
const menuBtn = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
if (menuBtn && nav) {
  menuBtn.addEventListener("click", function () {
    const abierto = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", abierto);
  });
}

// ===== Año del pie automático =====
document.querySelectorAll(".year").forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

// ===== Efecto máquina de escribir en la portada =====
const typed = document.querySelector(".typed");
if (typed) {
  const palabras = typed.dataset.words.split("|");
  let i = 0, letra = 0, borrando = false;

  function escribir() {
    const actual = palabras[i];
    typed.textContent = actual.slice(0, letra);

    if (!borrando && letra < actual.length) {
      letra++;
      setTimeout(escribir, 70);
    } else if (!borrando) {
      borrando = true;
      setTimeout(escribir, 1800);
    } else if (letra > 0) {
      letra--;
      setTimeout(escribir, 35);
    } else {
      borrando = false;
      i = (i + 1) % palabras.length;
      setTimeout(escribir, 300);
    }
  }
  escribir();
}

// ===== Filtro de proyectos =====
const filtros = document.querySelectorAll(".filter");
const proyectos = document.querySelectorAll(".project");
filtros.forEach(function (btn) {
  btn.addEventListener("click", function () {
    filtros.forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    const cat = btn.dataset.filter;
    proyectos.forEach(function (p) {
      p.classList.toggle("hidden", cat !== "todos" && p.dataset.cat !== cat);
    });
  });
});

// ===== Barras de idiomas animadas =====
document.querySelectorAll(".fill").forEach(function (barra) {
  setTimeout(function () { barra.style.width = barra.dataset.level + "%"; }, 200);
});

// ===== Aparición de tarjetas al hacer scroll =====
const animables = document.querySelectorAll(".card, .timeline-item");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  animables.forEach(function (el) {
    el.classList.add("reveal");
    observer.observe(el);
  });
}

// ===== Formulario de contacto (GitHub Pages no tiene servidor: usamos mailto) =====
const form = document.getElementById("contact-form");
if (form) {
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    let valido = true;

    function error(campo, msg) {
      form.querySelector('.error[data-for="' + campo + '"]').textContent = msg;
      if (msg) valido = false;
    }

    const nombre = form.nombre.value.trim();
    const correo = form.correo.value.trim();
    const mensaje = form.mensaje.value.trim();

    error("nombre", nombre ? "" : "Escribe tu nombre.");
    error("correo", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) ? "" : "Correo no válido.");
    error("mensaje", mensaje.length >= 10 ? "" : "El mensaje debe tener al menos 10 caracteres.");

    if (!valido) return;

    const destino = document.getElementById("email-link").textContent.trim();
    const asunto = encodeURIComponent("Contacto desde mi CV - " + nombre);
    const cuerpo = encodeURIComponent(mensaje + "\n\n" + nombre + " (" + correo + ")");
    window.location.href = "mailto:" + destino + "?subject=" + asunto + "&body=" + cuerpo;
  });
}
