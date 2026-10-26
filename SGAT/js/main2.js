
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- 1. Red de Nodos de Red y Activos Tecnológicos ---------- */
(function techNetworkCanvas() {
  const canvas = document.getElementById("butterflies"); // Mantiene el ID del HTML para evitar romper dependencias
  if (!canvas || reducedMotion) return;

  const ctx = canvas.getContext("2d");
  let width, height, nodes = [];

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
  }

  function makeNode() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4, // Velocidad horizontal lenta
      vy: (Math.random() - 0.5) * 0.4, // Velocidad vertical lenta
      radius: 1.5 + Math.random() * 2
    };
  }

  function step() {
    ctx.clearRect(0, 0, width, height);
    
    // Actualizar posiciones de nodos
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;

      // Rebotar en los bordes del Hero
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;

      // Dibujar el nodo (Punto de red)
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#10b981"; // Verde ciberseguridad / estado activo
      ctx.fill();
    });

    // Dibujar conexiones (Líneas de red con base en la cercanía espacial)
    ctx.strokeStyle = "rgba(37, 99, 235, 0.15)"; // Azul Cobalto muy suave
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) { // Distancia máxima de conexión
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(step);
  }

  resize();
  // Densidad de nodos balanceada según el tamaño de pantalla
  const count = Math.min(45, Math.max(15, Math.floor(width / 35)));
  nodes = Array.from({ length: count }, makeNode);
  window.addEventListener("resize", resize);
  step();
})();

/* ---------- 2. Aparición Controlada al Hacer Scroll (Fade-In) ---------- */
(function scrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target); // La animación se dispara una única vez
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -20px 0px" }
  );

  items.forEach((el) => observer.observe(el));
})();

/* ---------- 3. Contadores Animados de Métricas Core ---------- */
(function systemCounters() {
  const nums = document.querySelectorAll(".stat-num[data-count]");
  if (!nums.length) return;

  function animate(el) {
    const target = parseInt(el.dataset.count, 10);
    if (reducedMotion) { el.textContent = target + (target === 100 ? "%" : ""); return; }

    const duration = 1500;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Curva Ease-out cúbica
      const currentVal = Math.round(target * eased);
      
      // Si el objetivo es 100, le concatenamos el símbolo de porcentaje al renderizar
      el.textContent = currentVal + (target === 100 && progress === 1 ? "%" : "");
      
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  nums.forEach((el) => observer.observe(el));
})();

/* ---------- 4. Controlador de Menú de Navegación Móvil ---------- */
(function mobileMenu() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  // Colapsar el menú de forma automática al presionar cualquier enlace
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
})();

/* ---------- 5. Botón de Retorno de Desplazamiento (To Top) ---------- */
(function toTop() {
  const btn = document.getElementById("toTop");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 550);
  }, { passive: true });
})();
