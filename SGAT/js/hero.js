
(function animateHeroStats() {
  const stats = document.querySelectorAll(".stat-num");
  if (stats.length === 0) return;

  // Lógica de conteo incremental
  stats.forEach((stat) => {
    const target = parseInt(stat.getAttribute("data-count"), 10);
    if (isNaN(target) || target === 0) {
      // Si el objetivo es 0 (como en Errores Manuales), lo dejamos fijo
      stat.textContent = "0";
      return;
    }

    let count = 0;
    const duration = 1500; // Duración total de la animación en milisegundos
    const increment = target / (duration / 16); // Estimación a ~60fps

    const updateCount = () => {
      count += increment;
      if (count >= target) {
        stat.textContent = target + (target === 100 ? "%" : ""); // Añade % si es el indicador de 100
      } else {
        stat.textContent = Math.floor(count);
        requestAnimationFrame(updateCount);
      }
    };

    // Pequeño retraso al cargar para coordinar con las animaciones de CSS (class reveal)
    setTimeout(() => {
      requestAnimationFrame(updateCount);
    }, 300);
  });
})();
