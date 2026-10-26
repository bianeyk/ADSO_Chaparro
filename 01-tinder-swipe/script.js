
// Constantes de configuración
const DECISION_THRESHOLD = 80; // Píxeles necesarios para confirmar un swipe

// Variables de estado
let isDragging = false;
let startX = 0;
let currentX = 0;
let activeCard = null;
let lastRemovedCard = null; // Guarda la última tarjeta eliminada para la función "Undo"

// Inicialización del DOM
document.addEventListener('DOMContentLoaded', () => {
  initCards();
  initFooterButtons();
});

/**
 * Configura los event listeners para la tarjeta que está arriba del todo
 */
function initCards() {
  const cards = document.querySelectorAll('.cards article');
  if (cards.length === 0) {
    activeCard = null;
    return;
  }

  // La tarjeta activa siempre es la última en el DOM (la que queda arriba visible)
  activeCard = cards[cards.length - 1];

  if (activeCard) {
    // Eventos para Mouse
    activeCard.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);

    // Eventos para Pantallas Táctiles (Móviles)
    activeCard.addEventListener('touchstart', onDragStart, { passive: true });
    document.addEventListener('touchmove', onDragMove, { passive: true });
    document.addEventListener('touchend', onDragEnd);
  }
}

/**
 * Se ejecuta al iniciar el click o toque sobre la tarjeta
 */
function onDragStart(event) {
  if (isDragging) return;
  
  isDragging = true;
  activeCard.style.transition = 'none'; // Quitamos transiciones para que el movimiento sea fluido

  // Detectar si es evento táctil o de mouse
  startX = event.pageX || event.touches.pageX;
}

/**
 * Se ejecuta mientras el usuario arrastra la tarjeta
 */
function onDragMove(event) {
  if (!isDragging || !activeCard) return;

  currentX = event.pageX || event.touches.pageX;
  const distanceX = currentX - startX;

  // Calculamos la rotación proporcional al movimiento
  const rotation = distanceX / 10;

  // Aplicamos la transformación visual en tiempo real
  activeCard.style.transform = `translateX(${distanceX}px) rotate(${rotation}deg)`;
  activeCard.style.cursor = 'grabbing';

  // Controlar la opacidad de las etiquetas LIKE / NOPE
  const likeLabel = activeCard.querySelector('.choice.like');
  const nopeLabel = activeCard.querySelector('.choice.nope');

  if (distanceX > 0) {
    // Arrastrando a la derecha (LIKE)
    likeLabel.style.opacity = Math.min(distanceX / DECISION_THRESHOLD, 1);
    nopeLabel.style.opacity = 0;
  } else if (distanceX < 0) {
    // Arrastrando a la izquierda (NOPE)
    nopeLabel.style.opacity = Math.min(Math.abs(distanceX) / DECISION_THRESHOLD, 1);
    likeLabel.style.opacity = 0;
  }
}

/**
 * Se ejecuta cuando el usuario suelta la tarjeta
 */
function onDragEnd() {
  if (!isDragging || !activeCard) return;

  isDragging = false;
  const distanceX = currentX - startX;

  // Verificar si superó el umbral para tomar una decisión
  if (distanceX > DECISION_THRESHOLD) {
    executeSwipe('right');
  } else if (distanceX < -DECISION_THRESHOLD) {
    executeSwipe('left');
  } else {
    // Cancelar movimiento y regresar al centro
    activeCard.classList.add('reset');
    activeCard.style.transform = '';
    activeCard.style.cursor = 'grab';

    // Ocultar etiquetas de feedback
    activeCard.querySelectorAll('.choice').forEach(label => label.style.opacity = 0);

    // Limpiar clase de reset tras la animación
    setTimeout(() => {
      activeCard.classList.remove('reset');
      activeCard.style.transition = '';
    }, 300);
  }

  // Reiniciar variables de control de coordenadas
  startX = 0;
  currentX = 0;
}

/**
 * Desplaza la tarjeta fuera de la pantalla basándose en la dirección elegida
 * @param {string} direction - 'left', 'right' o 'super'
 */
function executeSwipe(direction) {
  if (!activeCard) return;

  let className = '';
  const likeLabel = activeCard.querySelector('.choice.like');
  const nopeLabel = activeCard.querySelector('.choice.nope');

  // Forzar la aparición del letrero correspondiente según el botón oprimido
  if (direction === 'right') {
    className = 'go-right';
    if (likeLabel) likeLabel.style.opacity = 1;
  } else if (direction === 'left') {
    className = 'go-left';
    if (nopeLabel) nopeLabel.style.opacity = 1;
  } else if (direction === 'super') {
    // Efecto especial hacia arriba para el Super Like
    activeCard.style.transition = 'transform 0.5s ease';
    activeCard.style.transform = 'translateY(-150%) scale(0.5)';
    if (likeLabel) {
      likeLabel.innerText = "SUPER!";
      likeLabel.style.borderColor = "#1ab2ff";
      likeLabel.style.color = "#1ab2ff";
      likeLabel.style.opacity = 1;
    }
  }

  activeCard.classList.add(className);

  // Guardamos la referencia de la tarjeta antes de quitarla por si usan "Undo"
  lastRemovedCard = activeCard;
  const cardToRemove = activeCard;

  // Limpiar listeners del elemento antiguo
  cardToRemove.removeEventListener('mousedown', onDragStart);
  cardToRemove.removeEventListener('touchstart', onDragStart);

  setTimeout(() => {
    cardToRemove.remove();
    // Volvemos a inicializar para asignar la lógica a la siguiente tarjeta del montón
    initCards();
  }, 300);
}

/**
 * Configura las acciones asociadas a los botones del footer
 */
function initFooterButtons() {
  // Botón UNDO (Deshacer la última acción)
  document.querySelector('.is-undo').addEventListener('click', () => {
    if (lastRemovedCard) {
      // Restauramos valores visuales de la tarjeta guardada
      lastRemovedCard.className = ''; 
      lastRemovedCard.style.transform = '';
      lastRemovedCard.style.transition = 'transform 0.4s ease';
      
      const labels = lastRemovedCard.querySelectorAll('.choice');
      labels.forEach(label => label.style.opacity = 0);

      // Re-insertamos la tarjeta en el contenedor de cartas
      const cardsContainer = document.querySelector('.cards');
      cardsContainer.appendChild(lastRemovedCard);

      // Limpiamos el historial para que no se pueda duplicar infinitamente
      lastRemovedCard = null;

      // Reiniciamos el foco en la tarjeta recuperada
      initCards();
    } else {
      alert("No hay acciones recientes que deshacer.");
    }
  });

  // Botón REMOVE / NOPE (Rechazar con animación a la izquierda)
  document.querySelector('.is-remove').addEventListener('click', () => {
    executeSwipe('left');
  });

  // Botón STAR / SUPER LIKE (Animación hacia arriba)
  document.querySelector('.is-star').addEventListener('click', () => {
    executeSwipe('super');
  });

  // Botón FAV / LIKE (Aceptar con animación a la derecha)
  document.querySelector('.is-fav').addEventListener('click', () => {
    executeSwipe('right');
  });

  // Botón ZAP / BOOST (Efecto visual rápido en la pantalla)
  document.querySelector('.is-zap').addEventListener('click', () => {
    if (!activeCard) return;
    // Hace parpadear la tarjeta activa simulando un súper impulso de visibilidad
    activeCard.style.transition = 'filter 0.2s ease, transform 0.2s ease';
    activeCard.style.filter = 'drop-shadow(0 0 25px #ffd700) brightness(1.2)';
    activeCard.style.transform = 'scale(1.05)';
    
    setTimeout(() => {
      activeCard.style.filter = '';
      activeCard.style.transform = '';
    }, 400);
  });
}
