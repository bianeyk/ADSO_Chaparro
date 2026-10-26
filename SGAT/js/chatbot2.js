
(function chatbot() {
  const fab = document.getElementById("chatFab");
  const win = document.getElementById("chatWindow");
  const closeBtn = document.getElementById("chatClose");
  const messages = document.getElementById("chatMessages");
  const chipsBox = document.getElementById("chatChips");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  if (!fab || !win) return;

  /* ---------- Base de conocimiento ---------- */
  /* Cada regla evalúa palabras clave en minúscula y sin tildes. */
  const KB = [
    {
      keys: ["modulos", "modulo", "estructura", "aplicativo"],
      reply:
        "💻 El sistema <strong>SGAT</strong> cuenta con 3 módulos principales integrados de manera centralizada:<br>" +
        "• <strong>Módulo Administrativo:</strong> Gestión de proveedores, bases de datos de clientes y control estructurado de insumos TIC.<br>" +
        "• <strong>Módulo Operativo:</strong> Control técnico de equipos en reparación, plazos de entrega y trazabilidad de estados.<br>" +
        "• <strong>Módulo Comercial:</strong> Facturación, registro de ventas y manejo automatizado de alertas de stock mínimo.<br>" +
        'Puedes ver más detalles en la sección de <a href="#modulos">Módulos</a>.'
    },
    {
      keys: ["roles", "rol", "usuario", "permisos", "jerarquia", "responsabilidades"],
      reply:
        "🛡️ El aplicativo implementa un control de accesos con <strong>roles diferenciados</strong> para garantizar la seguridad de la información:<br>" +
        "• <strong>Administrador:</strong> Acceso global a configuraciones del sistema, auditorías y gestión de usuarios.<br>" +
        "• <strong>Gerente:</strong> Supervisión en tiempo real de reportes de ventas, stock financiero y análisis operativo.<br>" +
        "• <strong>Técnico Soporte:</strong> Registro de diagnósticos, órdenes de trabajo y consumo de materiales de inventario.<br>" +
        'Consulta la matriz completa en la sección <a href="#roles">Roles de Usuario</a>.'
    },
    {
      keys: ["luke", "luke computadores", "empresa", "microempresa", "caso de estudio"],
      reply:
        "🏢 <strong>LUKE COMPUTADORES</strong> es la microempresa que sirve como modelo de implementación para este software [3.1]. " +
        "El sistema centraliza y automatiza sus operaciones administrativas y comerciales, eliminando los registros manuales en planillas físicas dispersas " +
        'y optimizando el control interno. Más información en <a href="#luke-computadores">Sobre la Empresa</a>.'
    },
    {
      keys: ["problema", "problematica", "dificultades", "manual", "inventario"],
      reply:
        "⚠️ Las MiPymes del sector técnico enfrentan pérdidas de información, duplicidad de datos y falta de trazabilidad en las reparaciones " +
        "debido a la gestión manual. El <strong>SGAT</strong> soluciona esto automatizando el control de stock, el historial de los clientes " +
        'y el estado de los trabajos. Revisa la justificación en la sección <a href="#problematica">Problemática</a>.'
    },
    {
      keys: ["metodologia", "desarrollo", "fases", "objetivos"],
      reply:
        "🚀 El desarrollo sigue el ciclo de vida clásico de la ingeniería de software enfocado en la optimización de procesos [3.2]:<br>" +
        "1. <strong>Identificación:</strong> Levantamiento de requerimientos operacionales directos en la microempresa [3.2].<br>" +
        "2. <strong>Diseño:</strong> Modelado técnico de los módulos e interfaces de usuario diferenciadas [3.2].<br>" +
        "3. <strong>Evaluación:</strong> Pruebas de usabilidad y validación de desempeño en tiempo real [3.2].<br>" +
        'Conoce más en la sección de <a href="#metodologia">Metodología</a>.'
    },
    {
      keys: ["actualizaciones", "noticias", "historial", "versiones", "changelog"],
      reply:
        "📊 Actualmente el aplicativo se encuentra en la <strong>Fase de Validación y Usabilidad</strong> [3.2], realizando pruebas logísticas en entornos controlados " +
        'para medir la reducción de tiempos de atención al cliente. Consulta las bitácoras en la sección <a href="#noticias">Actualizaciones</a>.'
    },
    {
      keys: ["hola", "buenas", "hey", "saludos", "hi", "ayuda"],
      reply:
        "🤖 ¡Hola! Bienvenido al asistente virtual del **SGAT**. Estoy aquí para explicarte las características técnicas de nuestra plataforma " +
        "para LUKE COMPUTADORES. Puedes consultarme acerca de nuestros <strong>módulos</strong>, los <strong>roles de usuario</strong>, " +
        "nuestra <strong>metodología</strong> de software o sobre la <strong>problemática</strong> que resolvemos."
    }
  ];

  /* ---------- Lógica de Control e Interacción ---------- */
  function normalizeText(text) {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function appendMessage(sender, htmlContent) {
    const msg = document.createElement("div");
    msg.className = `chat-msg msg-${sender}`;
    msg.innerHTML = `<div class="msg-bubble">${htmlContent}</div>`;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function showBotReply(inputText) {
    const cleanText = normalizeText(inputText);
    let matchedReply = "🤖 No logré identificar el módulo o requerimiento consultado. Prueba preguntándome por 'módulos', 'roles', 'inventario' o 'metodología'.";

    for (const rule of KB) {
      if (rule.keys.some(k => cleanText.includes(k))) {
        matchedReply = rule.reply;
        break;
      }
    }

    appendMessage("loading", "⏳ Analizando estructura del sistema...");
    
    setTimeout(() => {
      const loaders = messages.querySelectorAll(".msg-loading");
      loaders.forEach(l => l.remove());
      appendMessage("bot", matchedReply);
    }, 800);
  }

  // Eventos de apertura y cierre de ventana
  fab.addEventListener("click", () => {
    const isHidden = win.hasAttribute("hidden");
    if (isHidden) {
      win.removeAttribute("hidden");
      fab.setAttribute("aria-expanded", "true");
      if (messages.children.length === 0) {
        appendMessage("bot", "🤖 **Asistente de Soporte Técnico SGAT activo.** ¿En qué área o módulo del aplicativo deseas profundizar hoy?");
      }
    } else {
      win.setAttribute("hidden", "");
      fab.setAttribute("aria-expanded", "false");
    }
  });

  closeBtn.addEventListener("click", () => {
    win.setAttribute("hidden", "");
    fab.setAttribute("aria-expanded", "false");
  });

  // Envío del formulario de texto
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const txt = input.value.trim();
    if (!txt) return;

    appendMessage("user", txt);
    input.value = "";
    showBotReply(txt);
  });

  // Renderizado dinámico opcional de chips de sugerencia rápida
  if (chipsBox) {
    const internalSuggestions = ["Módulos", "Roles de Usuario", "Metodología", "Luke Computadores"];
    chipsBox.innerHTML = "";
    internalSuggestions.forEach(sug => {
      const btnChip = document.createElement("button");
      btnChip.className = "chat-chip";
      btnChip.type = "button";
      btnChip.textContent = sug;
      btnChip.addEventListener("click", () => {
        appendMessage("user", sug);
        showBotReply(sug);
      });
      chipsBox.appendChild(btnChip);
    });
  }
})();
