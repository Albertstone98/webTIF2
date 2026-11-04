/**
 * ============================================================================
 * SCRIPT PRINCIPAL MODULAR (Navegación, Accesibilidad, Reproductor y Chatbot)
 * Proyecto: "Git y GitHub como e-Portfolios: Trazabilidad y Evaluación de Proceso en Programación I"
 * Institución: UTN - Facultad Regional General Pacheco (UTN-FRGP)
 * Equipo Autor (Grupo 6): Alejandro Gómez Nieto, Javier Agustín Larroca,
 *                         Ignacio Olmos y José Alberto Rodríguez.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initCopyButtons();
  initTextComparisonTabs();
  initCustomAudioPlayer();
  initFeedbackForm();
  initChatbotWidget();
});

/* ==========================================================================
   1. NAVEGACIÓN RESPONSIVA (Menú Hamburguesa y Accesibilidad ARIA)
   ========================================================================== */
function initMobileNavigation() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('menu-icon-open');
  const iconClose = document.getElementById('menu-icon-close');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!isExpanded));
    mobileMenu.classList.toggle('hidden');

    if (iconOpen && iconClose) {
      iconOpen.classList.toggle('hidden');
      iconClose.classList.toggle('hidden');
    }
  });

  // Cerrar menú móvil con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
      if (iconOpen && iconClose) {
        iconOpen.classList.remove('hidden');
        iconClose.classList.add('hidden');
      }
      menuBtn.focus();
    }
  });
}

/* ==========================================================================
   2. BOTONES DE COPIADO DE PROMPTS Y CITAS APA AL PORTAPAPELES
   ========================================================================== */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('[data-copy-target]');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const targetId = btn.getAttribute('data-copy-target');
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      const textToCopy = targetEl.innerText.trim();
      const originalHTML = btn.innerHTML;

      try {
        await navigator.clipboard.writeText(textToCopy);
        btn.innerHTML = `
          <svg class="w-4 h-4 text-emerald-400 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>¡Copiado!</span>
        `;
        btn.classList.add('bg-emerald-900/60', 'border-emerald-500/50', 'text-emerald-200');

        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.classList.remove('bg-emerald-900/60', 'border-emerald-500/50', 'text-emerald-200');
        }, 2200);
      } catch (err) {
        console.error('Error al copiar texto:', err);
      }
    });
  });
}

/* ==========================================================================
   3. INTERACCIÓN DE PESTAÑAS EN TEXTO INTRODUCTORIO (Unidad 2)
   ========================================================================== */
function initTextComparisonTabs() {
  const tabButtons = document.querySelectorAll('[data-tab-target]');
  if (tabButtons.length === 0) return;

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetSelector = btn.getAttribute('data-tab-target');
      const group = btn.getAttribute('data-tab-group') || 'default';

      // Desactivar botones del mismo grupo
      document.querySelectorAll(`[data-tab-group="${group}"]`).forEach((b) => {
        b.classList.remove('bg-[#0284C7]', 'text-white', 'shadow-sm');
        b.classList.add('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');
        b.setAttribute('aria-selected', 'false');
      });

      // Activar botón seleccionado
      btn.classList.add('bg-[#0284C7]', 'text-white', 'shadow-sm');
      btn.classList.remove('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');
      btn.setAttribute('aria-selected', 'true');

      // Mostrar panel correspondiente
      document.querySelectorAll(`[data-tab-panel="${group}"]`).forEach((panel) => {
        panel.classList.add('hidden');
      });
      const activePanel = document.querySelector(targetSelector);
      if (activePanel) {
        activePanel.classList.remove('hidden');
      }
    });
  });
}

/* ==========================================================================
   4. REPRODUCTOR DE AUDIO HTML5 PERSONALIZADO (Unidad 4 - Podcast)
   ========================================================================== */
function initCustomAudioPlayer() {
  const audio = document.getElementById('podcast-audio');
  if (!audio) return;

  const playBtn = document.getElementById('audio-play-btn');
  const playIcon = document.getElementById('audio-icon-play');
  const pauseIcon = document.getElementById('audio-icon-pause');
  const progressSlider = document.getElementById('audio-progress');
  const currentTimeEl = document.getElementById('audio-current-time');
  const durationEl = document.getElementById('audio-duration');
  const speedBtn = document.getElementById('audio-speed-btn');
  const muteBtn = document.getElementById('audio-mute-btn');
  const rewindBtn = document.getElementById('audio-rewind-btn');
  const forwardBtn = document.getElementById('audio-forward-btn');
  const visualizer = document.getElementById('audio-visualizer');
  const statusBadge = document.getElementById('audio-status-badge');
  const seekButtons = document.querySelectorAll('[data-audio-seek]');

  const speeds = [1, 1.25, 1.5, 0.9];
  let currentSpeedIndex = 0;

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function updatePlayUI(isPlaying) {
    if (isPlaying) {
      playIcon?.classList.add('hidden');
      pauseIcon?.classList.remove('hidden');
      visualizer?.classList.add('playing');
      if (statusBadge) {
        statusBadge.textContent = 'Reproduciendo episodio';
        statusBadge.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
      }
    } else {
      playIcon?.classList.remove('hidden');
      pauseIcon?.classList.add('hidden');
      visualizer?.classList.remove('playing');
      if (statusBadge) {
        statusBadge.textContent = 'En pausa';
        statusBadge.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30';
      }
    }
  }

  audio.addEventListener('loadedmetadata', () => {
    if (durationEl && audio.duration) {
      durationEl.textContent = formatTime(audio.duration);
      if (progressSlider) progressSlider.max = Math.floor(audio.duration);
    }
  });

  audio.addEventListener('timeupdate', () => {
    if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
    if (progressSlider && !progressSlider.matches(':active')) {
      progressSlider.value = Math.floor(audio.currentTime);
    }
  });

  audio.addEventListener('play', () => updatePlayUI(true));
  audio.addEventListener('pause', () => updatePlayUI(false));
  audio.addEventListener('ended', () => {
    updatePlayUI(false);
    if (statusBadge) statusBadge.textContent = 'Episodio finalizado';
  });

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().catch((err) => {
          console.warn('No se pudo reproducir el archivo local:', err);
        });
      } else {
        audio.pause();
      }
    });
  }

  if (progressSlider) {
    progressSlider.addEventListener('input', () => {
      audio.currentTime = Number(progressSlider.value);
      if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
    });
  }

  if (rewindBtn) {
    rewindBtn.addEventListener('click', () => {
      audio.currentTime = Math.max(0, audio.currentTime - 10);
    });
  }

  if (forwardBtn) {
    forwardBtn.addEventListener('click', () => {
      audio.currentTime = Math.min(audio.duration || 175, audio.currentTime + 10);
    });
  }

  if (speedBtn) {
    speedBtn.addEventListener('click', () => {
      currentSpeedIndex = (currentSpeedIndex + 1) % speeds.length;
      const newSpeed = speeds[currentSpeedIndex];
      audio.playbackRate = newSpeed;
      speedBtn.textContent = `${newSpeed}x`;
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      audio.muted = !audio.muted;
      muteBtn.classList.toggle('text-rose-400', audio.muted);
    });
  }

  // Saltar a marcas de tiempo desde el guion técnico-literario
  seekButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetSeconds = Number(btn.getAttribute('data-audio-seek')) || 0;
      audio.currentTime = targetSeconds;
      audio.play().catch(() => {});
      document.getElementById('reproductor-podcast')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}

/* ==========================================================================
   5. FORMULARIO INSTITUCIONAL DE CONTACTO Y FEEDBACK (Unidad 5/6 - Créditos)
   ========================================================================== */
function initFeedbackForm() {
  const form = document.getElementById('institutional-feedback-form');
  const feedbackAlert = document.getElementById('feedback-success-alert');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('fb-nombre')?.value || 'Docente / Estudiante';
    const rol = document.getElementById('fb-rol')?.value || 'Comunidad UTN';

    if (feedbackAlert) {
      feedbackAlert.classList.remove('hidden');
      feedbackAlert.innerHTML = `
        <div class="flex items-start gap-3">
          <svg class="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h4 class="font-bold text-emerald-950">¡Gracias por tu aporte, ${escapeHTML(nombre)} (${escapeHTML(rol)})!</h4>
            <p class="text-sm text-emerald-800 mt-1">
              Tu valoración pedagógica fue registrada por el <strong>Equipo Grupo 6 (UTN-FRGP)</strong> para continuar mejorando la implementación de e-Portfolios en <em>Programación I</em>.
            </p>
          </div>
        </div>
      `;
      form.reset();
    }
  });
}

/* ==========================================================================
   6. COMPONENTE TRANSVERSAL: CHATBOT INTERACTIVO FLOTANTE (Unidad 6)
   ========================================================================== */
function initChatbotWidget() {
  const toggleBtn = document.getElementById('chatbot-toggle');
  const closeBtn = document.getElementById('chatbot-close');
  const resetBtn = document.getElementById('chatbot-reset');
  const chatWindow = document.getElementById('chatbot-window');
  const badge = document.getElementById('chatbot-badge');
  const chatForm = document.getElementById('chatbot-form');
  const chatInput = document.getElementById('chatbot-input');
  const messagesContainer = document.getElementById('chatbot-messages');
  const quickChips = document.querySelectorAll('.chatbot-chip');

  if (!toggleBtn || !chatWindow || !messagesContainer) return;

  const STORAGE_KEY = 'utn_prog1_chatbot_history_v1';

  // Mensaje inicial de bienvenida
  const defaultWelcomeMessages = [
    {
      sender: 'bot',
      text: '¡Hola! 👋 Soy el <strong>Asistente Virtual de Programación I (UTN-FRGP)</strong>, diseñado por el <strong>Grupo 6</strong>.',
      time: 'Ahora'
    },
    {
      sender: 'bot',
      text: 'Puedo ayudarte con dudas sobre <strong>Git y GitHub como e-Portfolios</strong>, el flujo de entregas (<em>Issue → Commits → Pull Request → Merge</em>), coevaluación o guiarte por los 5 recursos con IA de este sitio. ¿Qué te gustaría consultar?',
      time: 'Ahora'
    }
  ];

  // Cargar historial desde sessionStorage o usar bienvenida
  let chatHistory = [];
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    chatHistory = saved ? JSON.parse(saved) : [...defaultWelcomeMessages];
  } catch {
    chatHistory = [...defaultWelcomeMessages];
  }

  function saveHistory() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory.slice(-20)));
    } catch {
      // Ignorar si sessionStorage está restringido
    }
  }

  function renderMessages() {
    messagesContainer.innerHTML = '';
    chatHistory.forEach((msg) => {
      appendMessageElement(msg.sender, msg.text, msg.time, false);
    });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function appendMessageElement(sender, htmlText, timeStr = obtenerHoraActual(), animate = true) {
    const wrapper = document.createElement('div');
    wrapper.className = sender === 'user'
      ? 'flex justify-end items-end gap-2'
      : 'flex justify-start items-end gap-2';

    if (sender === 'bot') {
      wrapper.innerHTML = `
        <div class="w-7 h-7 rounded-full bg-[#003366] text-sky-300 flex items-center justify-center shrink-0 text-xs font-bold border border-sky-400/40" aria-hidden="true">
          UTN
        </div>
        <div class="max-w-[82%] bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-xs sm:text-sm shadow-sm leading-relaxed">
          <div>${htmlText}</div>
          <span class="block text-[10px] text-slate-400 mt-1 text-right">${timeStr}</span>
        </div>
      `;
    } else {
      wrapper.innerHTML = `
        <div class="max-w-[82%] bg-[#0284C7] text-white rounded-2xl rounded-br-sm px-3.5 py-2.5 text-xs sm:text-sm shadow-sm leading-relaxed">
          <div>${escapeHTML(htmlText)}</div>
          <span class="block text-[10px] text-sky-100 mt-1 text-right">${timeStr}</span>
        </div>
      `;
    }

    messagesContainer.appendChild(wrapper);
    if (animate) {
      messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' });
    }
  }

  function showTypingIndicator() {
    const typingEl = document.createElement('div');
    typingEl.id = 'chatbot-typing';
    typingEl.className = 'flex justify-start items-center gap-2';
    typingEl.innerHTML = `
      <div class="w-7 h-7 rounded-full bg-[#003366] text-sky-300 flex items-center justify-center shrink-0 text-xs font-bold">
        UTN
      </div>
      <div class="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;
    messagesContainer.appendChild(typingEl);
    messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' });
  }

  function removeTypingIndicator() {
    const typingEl = document.getElementById('chatbot-typing');
    if (typingEl) typingEl.remove();
  }

  function toggleChat(forceState) {
    const isCurrentlyHidden = chatWindow.classList.contains('hidden-chat');
    const shouldOpen = typeof forceState === 'boolean' ? forceState : isCurrentlyHidden;

    if (shouldOpen) {
      chatWindow.classList.remove('hidden-chat');
      chatWindow.classList.add('visible-chat');
      toggleBtn.setAttribute('aria-expanded', 'true');
      if (badge) badge.classList.add('hidden');
      setTimeout(() => chatInput?.focus(), 150);
    } else {
      chatWindow.classList.add('hidden-chat');
      chatWindow.classList.remove('visible-chat');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  }

  toggleBtn.addEventListener('click', () => toggleChat());
  closeBtn?.addEventListener('click', () => toggleChat(false));

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      chatHistory = [...defaultWelcomeMessages];
      saveHistory();
      renderMessages();
    });
  }

  function handleUserQuery(rawQuery) {
    const query = rawQuery.trim();
    if (!query) return;

    const timeNow = obtenerHoraActual();
    chatHistory.push({ sender: 'user', text: query, time: timeNow });
    saveHistory();
    appendMessageElement('user', query, timeNow, true);

    if (chatInput) chatInput.value = '';
    showTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator();
      const botResponse = generateBotAnswer(query);
      const replyTime = obtenerHoraActual();
      chatHistory.push({ sender: 'bot', text: botResponse, time: replyTime });
      saveHistory();
      appendMessageElement('bot', botResponse, replyTime, true);
    }, 550);
  }

  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleUserQuery(chatInput?.value || '');
    });
  }

  quickChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const question = chip.getAttribute('data-question') || chip.textContent;
      handleUserQuery(question);
    });
  });

  renderMessages();
}

/**
 * Motor de respuestas pedagógicas del Asistente Virtual de Programación I (Unidad 6)
 */
function generateBotAnswer(input) {
  const q = input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // 1. Diferencia entre Git y GitHub
  if ((q.includes('diferencia') && (q.includes('git') || q.includes('github'))) || q.includes('git vs github') || q.includes('que es git')) {
    return `
      <strong>Diferencia clave entre Git y GitHub:</strong><br>
      • <strong>Git</strong> es el sistema de control de versiones local que registra cada cambio en tu código mediante <em>commits</em>.<br>
      • <strong>GitHub</strong> es la plataforma en la nube donde alojás ese repositorio, colaborás con tus compañeros y construís tu <strong>e-Portfolio académico</strong>.<br>
      👉 Podés profundizar en la <a href="texto-introductorio.html" class="text-[#0284C7] underline font-semibold">Guía Introductoria (Unidad 2)</a>.
    `;
  }

  // 2. Evaluación de proceso vs entregas ZIP / e-Portfolio
  if (q.includes('evalua') || q.includes('zip') || q.includes('entrega') || q.includes('nota') || q.includes('aprobar') || q.includes('portafolio') || q.includes('portfolio')) {
    return `
      <strong>Evaluación de Proceso en Programación I:</strong><br>
      Dejamos atrás la entrega estática de un archivo <code>.ZIP</code> al final del cuatrimestre. Con tu <strong>e-Portfolio en GitHub</strong>, la cátedra valora tu <em>trazabilidad formativa</em>:<br>
      1️⃣ <strong>Issue:</strong> Detectás y documentás el problema.<br>
      2️⃣ <strong>Commits:</strong> Resolvés paso a paso mostrando tu evolución.<br>
      3️⃣ <strong>Pull Request:</strong> Argumentás tu solución y reflexionás en el <code>README.md</code>.<br>
      4️⃣ <strong>Merge Docente:</strong> Validación y retroalimentación formativa.<br>
      👉 Mirá el flujo completo en <a href="video-trazabilidad.html" class="text-[#0284C7] underline font-semibold">Video de Trazabilidad (Unidad 5)</a>.
    `;
  }

  // 3. Commits y Cultura del Error Documentado / README
  if (q.includes('commit') || q.includes('error') || q.includes('readme') || q.includes('historial')) {
    return `
      <strong>Los Commits como Evidencia y el Error Documentado:</strong><br>
      Cada <code>git commit -m "..."</code> es una fotografía pedagógica de tu razonamiento. En lugar de ocultar los errores o copiar código final sin comprenderlo, en el archivo <code>README.md</code> promovemos la <strong>cultura del error documentado</strong>: explicar qué falló, qué modificaste y por qué.<br>
      Ejemplos de buenos commits:<br>
      • <code>"Creo estructura inicial del algoritmo de búsqueda"</code><br>
      • <code>"Corrijo condición de corte en ciclo while"</code>
    `;
  }

  // 4. Coevaluación, Fork, Issues, Pull Requests, Social Coding
  if (q.includes('fork') || q.includes('issue') || q.includes('pull request') || q.includes('pr') || q.includes('coevalua') || q.includes('colabora') || q.includes('zorro')) {
    return `
      <strong>Ética Colaborativa y Social Coding (Unidad 3):</strong><br>
      En la <em>Pedagogía del Estudiante Contribuyente</em> interactuamos con empatía y respeto por el código ajeno:<br>
      • <strong>Issue:</strong> Espacio de diálogo para reportar mejoras o dudas con respeto.<br>
      • <strong>Fork:</strong> Tu laboratorio seguro para experimentar y refactorizar sin romper el proyecto de tu compañero.<br>
      • <strong>Pull Request (PR):</strong> Propuesta formal documentada donde justificás tu aporte.<br>
      👉 Mirá la animación estilo <em>Night in the Woods</em> en <a href="animacion-coevaluacion.html" class="text-[#0284C7] underline font-semibold">Animación Coevaluación (Unidad 3)</a>.
    `;
  }

  // 5. Podcast, Audio, DUA, ElevenLabs
  if (q.includes('podcast') || q.includes('audio') || q.includes('dua') || q.includes('accesibilidad') || q.includes('elevenlabs') || q.includes('voz')) {
    return `
      <strong>Cápsulas Sonoras y Accesibilidad DUA (Unidad 4):</strong><br>
      Utilizamos síntesis de voz neuronal (<em>Text-to-Speech</em> con <strong>ElevenLabs Modelo V3</strong> y edición en <strong>Filmora</strong>) para crear cápsulas de menos de 3 minutos que acompañan la lectura de código y el <code>README.md</code>, cumpliendo con el <strong>Diseño Universal para el Aprendizaje (DUA)</strong>.<br>
      👉 Escuchá el episodio en <a href="podcast-sonoro.html" class="text-[#0284C7] underline font-semibold">Podcast Sonoro (Unidad 4)</a>.
    `;
  }

  // 6. Video retroinformática / Años 90 / Veo / Flow
  if (q.includes('video') || q.includes('retro') || q.includes('90') || q.includes('veo') || q.includes('flow') || q.includes('kdenlive')) {
    return `
      <strong>Video de Trazabilidad con Estética Retro 90s (Unidad 5):</strong><br>
      Producido mediante <strong>Google Flow (Veo)</strong> y ensamblado en <strong>Kdenlive</strong> con estética de monitores CRT y herramientas CASE de Windows 95. Muestra por qué usar IA como atajo sin comprensión invalida el aprendizaje, mientras que la trazabilidad en Git visibiliza el proceso real.<br>
      👉 Ver en <a href="video-trazabilidad.html" class="text-[#0284C7] underline font-semibold">Video Trazabilidad (Unidad 5)</a>.
    `;
  }

  // 7. Autores, Grupo 6, Créditos, Ética, APA
  if (q.includes('autor') || q.includes('grupo 6') || q.includes('equipo') || q.includes('integrante') || q.includes('etica') || q.includes('apa') || q.includes('credito') || q.includes('ia')) {
    return `
      <strong>Equipo Autor (Grupo 6 - UTN-FRGP) y Marco Ético:</strong><br>
      Proyecto desarrollado por <strong>Alejandro Gómez Nieto, Javier Agustín Larroca, Ignacio Olmos y José Alberto Rodríguez</strong> para <em>Gestión de Recursos Digitales con IA Generativa</em>.<br>
      Todas las herramientas de IA (ChatGPT, Nano Banana Pro, Google Flow/Veo, ElevenLabs) están acreditadas bajo <strong>Normas APA 7ma edición</strong> y lineamientos UNESCO.<br>
      👉 Consultá las referencias en <a href="creditos-etica.html" class="text-[#0284C7] underline font-semibold">Créditos y Marco Ético</a>.
    `;
  }

  // 8. Estructura del sitio / Mapa de navegación
  if (q.includes('sitio') || q.includes('mapa') || q.includes('pagina') || q.includes('recurso') || q.includes('menu') || q.includes('donde')) {
    return `
      <strong>Mapa de Navegación del Espacio Digital (6 páginas):</strong><br>
      1. <a href="index.html" class="text-[#0284C7] underline font-medium">Inicio (Planteo y Mapa Conceptual)</a><br>
      2. <a href="texto-introductorio.html" class="text-[#0284C7] underline font-medium">Unidad 2: Guía Textual con IA</a><br>
      3. <a href="animacion-coevaluacion.html" class="text-[#0284C7] underline font-medium">Unidad 3: Animación 2D Coevaluación</a><br>
      4. <a href="podcast-sonoro.html" class="text-[#0284C7] underline font-medium">Unidad 4: Podcast Sonoro DUA</a><br>
      5. <a href="video-trazabilidad.html" class="text-[#0284C7] underline font-medium">Unidad 5: Video Trazabilidad Retro 90s</a><br>
      6. <a href="creditos-etica.html" class="text-[#0284C7] underline font-medium">Créditos, APA 7ma ed. y Ética IA</a>
    `;
  }

  // Respuesta orientadora por defecto
  return `
    ¡Excelente consulta! En <strong>Programación I (UTN-FRGP)</strong> utilizamos <strong>Git y GitHub como e-Portfolios</strong> para evaluar tu proceso real de aprendizaje en lugar de un único archivo final.<br><br>
    Podés preguntarme sobre:<br>
    • <strong>"¿Cuál es la diferencia entre Git y GitHub?"</strong><br>
    • <strong>"¿Cómo se evalúan las entregas y los Commits?"</strong><br>
    • <strong>"¿Qué son Fork, Issues y Pull Requests?"</strong><br>
    • <strong>"¿Qué herramientas de IA y normas APA usó el Grupo 6?"</strong>
  `;
}

function obtenerHoraActual() {
  const d = new Date();
  return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
