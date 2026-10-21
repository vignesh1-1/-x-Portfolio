lucide.createIcons();

// =============== LOGO CLICK REDIRECT ===============
const navLogo = document.querySelector('.logo img');

if (navLogo) {
  navLogo.addEventListener('click', (e) => {
    e.preventDefault(); 
    triggerArcadeRedirect();
  });
}

function triggerArcadeRedirect() {
  const overlay = document.getElementById("loadingOverlay");
  if (overlay) overlay.classList.add("active");
  setTimeout(() => {
    window.location.href = 'game.html';
  }, 100); 
}

// =============== MOBILE MENU TOGGLE FIX ===============
const menuBtn = document.getElementById('mobileMenuBtn');
const navLinksContainer = document.querySelector('.nav-links');

if (menuBtn && navLinksContainer) {
  menuBtn.addEventListener('click', (event) => {
    navLinksContainer.classList.toggle('show-mobile');
    event.stopPropagation();
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('show-mobile');
    });
  });

  document.addEventListener('click', (event) => {
    if (!navLinksContainer.contains(event.target) && !menuBtn.contains(event.target)) {
      navLinksContainer.classList.remove('show-mobile');
    }
  });
}

// =============== SCROLL PROGRESS BAR ===============
window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
  const scrollBar = document.getElementById('scrollBar');
  if (scrollBar) {
    scrollBar.style.width = scrolled + "%";
  }
});

// =============== FLOATING BUTTONS & CYANX AI POPUP LOGIC ===============
const scrollTopBtn = document.getElementById("scrollTopBtn");
const aiNavBtn = document.getElementById("aiNavBtn");
const aiSection = document.getElementById("ai-assistant");
const aiFloatingPopup = document.getElementById("aiFloatingPopup");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  
  if (scrollY > 400) {
    scrollTopBtn?.classList.add("show");
  } else {
    scrollTopBtn?.classList.remove("show");
  }

  if (aiSection) {
    const aiRect = aiSection.getBoundingClientRect();
    if (aiRect.top < window.innerHeight * 0.7 && aiRect.bottom > window.innerHeight * 0.3) {
      aiNavBtn?.classList.remove("show");
      aiFloatingPopup?.classList.remove("visible");
    } else {
      aiNavBtn?.classList.add("show");
    }
  } else {
    aiNavBtn?.classList.add("show");
  }
});

window.dispatchEvent(new Event('scroll'));

if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

if (aiNavBtn && aiSection) {
  aiNavBtn.addEventListener("click", () => {
    aiSection.scrollIntoView({ behavior: "smooth" });
  });
}

function initAiFloatingPopup() {
  if (!aiFloatingPopup) return;

  aiFloatingPopup.addEventListener("click", () => {
    if (aiSection) {
      aiSection.scrollIntoView({ behavior: "smooth" });
      const chatInput = document.querySelector('.chat-input-area textarea');
      if (chatInput) chatInput.focus();
    }
  });
}

// =============== SYNCHRONIZED POPUPS CYCLE (SCORE & AI POPUP) ===============
let popupsCycleStarted = false;

function startSyncedPopupsCycle() {
  if (popupsCycleStarted) return;
  popupsCycleStarted = true;

  const navPopup = document.getElementById("navPointsPopup");
  const aiPopup = document.getElementById("aiFloatingPopup");

  function syncCycle() {
    if (navPopup) {
      navPopup.classList.add("visible");
    }
    if (aiPopup && aiNavBtn && aiNavBtn.classList.contains("show")) {
      aiPopup.classList.add("visible");
    } else if (aiPopup) {
      aiPopup.classList.remove("visible");
    }

    setTimeout(() => {
      if (navPopup) navPopup.classList.remove("visible");
      if (aiPopup) aiPopup.classList.remove("visible");
      setTimeout(syncCycle, 7000);
    }, 4500);
  }

  setTimeout(syncCycle, 600);
}

// ==========================================
// DYNAMIC BASE URL: LOCALHOST DETECTION & RENDER FALLBACK
// ==========================================
const LOCAL_API_URL = "http://127.0.0.1:8000";
const RENDER_API_URL = "https://portfolio-backend-iua6.onrender.com";
let ACTIVE_API_URL = LOCAL_API_URL;

async function resolveActiveBackend() {
  const isLocalEnv = window.location.hostname === "localhost" || 
                     window.location.hostname === "127.0.0.1" || 
                     window.location.protocol === "file:";

  if (isLocalEnv) {
    ACTIVE_API_URL = LOCAL_API_URL;
    return ACTIVE_API_URL;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 600);
    
    const localRes = await fetch(`${LOCAL_API_URL}/`, {
      method: "GET",
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (localRes.ok) {
      ACTIVE_API_URL = LOCAL_API_URL;
      return ACTIVE_API_URL;
    }
  } catch (err) {}

  ACTIVE_API_URL = RENDER_API_URL;
  return ACTIVE_API_URL;
}

// ==========================================
// AUTO-WAKE API LOGIC
// ==========================================
async function wakeUpBackend() {
  const apiBadge = document.getElementById('apiBadge');
  const faceText = document.getElementById('faceText');

  if (!apiBadge || !faceText) return;

  apiBadge.className = 'api-badge warning';
  apiBadge.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> CONNECTING...';
  faceText.textContent = '🌐';

  const baseUrl = await resolveActiveBackend();

  try {
    const response = await fetch(`${baseUrl}/`);
    if (response.ok) {
      apiBadge.className = 'api-badge success';
      const isLocal = baseUrl.includes("127.0.0.1") || baseUrl.includes("localhost");
      apiBadge.innerHTML = isLocal 
        ? '<i class="fa-solid fa-check"></i> LOCALHOST ACTIVE' 
        : '<i class="fa-solid fa-check"></i> API ACTIVE';
      faceText.textContent = '◕⁠‿⁠◕';
    } else {
      throw new Error("Server offline");
    }
  } catch (error) {
    apiBadge.className = 'api-badge error';
    apiBadge.innerHTML = '<i class="fa-solid fa-xmark"></i> ERROR FETCHING API';
    faceText.textContent = 'x_x';
  }
}

// ==========================================
// FAST INITIAL LOAD & OVERLAY SYNC
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("loadingOverlay");
  
  if (overlay) {
    overlay.classList.add("active");
    setTimeout(() => {
      overlay.classList.remove("active");
      document.body.classList.add("loaded"); 
      setTimeout(typeEffect, 120);
      revealElements.forEach(el => revealObserver.observe(el));
      initPointsPopup();
      initAiFloatingPopup();
      startSyncedPopupsCycle();
      loadStoredChatHistory();
    }, 100);
  } else {
    document.body.classList.add("loaded");
    setTimeout(typeEffect, 120);
    revealElements.forEach(el => revealObserver.observe(el));
    initPointsPopup();
    initAiFloatingPopup();
    startSyncedPopupsCycle();
    loadStoredChatHistory();
  }

  wakeUpBackend();
});

// ==========================================
// SNAPPY LINK CLICK TRANSITIONS
// ==========================================
document.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", function(e) {
    const target = this.getAttribute("href");
    if (!target || target === "#" || target.startsWith("#") || target.startsWith("javascript:") || target.startsWith("mailto:") || target.startsWith("tel:") || this.hasAttribute('onclick')) {
      return; 
    }

    e.preventDefault(); 
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) overlay.classList.add("active");

    const isNewTab = this.getAttribute("target") === "_blank";
    setTimeout(() => {
      if (isNewTab) {
        window.open(target, "_blank"); 
        if (overlay) overlay.classList.remove("active"); 
      } else {
        window.location.href = target; 
      }
    }, 80);
  });
});

// ==========================================
// ACTIVE LINK OBSERVER & AI CHAT CONTEXT CHIPS
// ==========================================
const sections = document.querySelectorAll("section");
const navLinksList = document.querySelectorAll(".nav-links a");
const chatContextChips = document.getElementById("chatContextChips");
const observerOptions = { root: null, rootMargin: "-15% 0px -50% 0px", threshold: 0 }; 

const sectionContextMap = {
  "home": ["What is your strongest AI project?", "How do you deploy models?"],
  "about": ["What are your core tech stack tools?", "How do you approach system engineering?"],
  "experience": ["Tell me about the Technglobal internship", "What was your role in BITS RADAR?"],
  "projects": ["Explain BITS RADAR's RBAC", "How does G+ use Gemini AI?"],
  "ai-assistant": ["What embedding model do you use?", "How does this semantic search work?"],
  "philosophy": ["What is your engineering core philosophy?", "How do you ensure system resilience?"],
  "contact": ["What kind of roles are you looking for?", "Are you open to contract work?"]
};

function updateContextChips(sectionId) {
  if (!chatContextChips) return;
  const recommendations = sectionContextMap[sectionId] || sectionContextMap["home"];
  chatContextChips.innerHTML = recommendations.map(rec => 
    `<span class="context-chip">${rec}</span>`
  ).join('');

  chatContextChips.querySelectorAll('.context-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const chatInput = document.querySelector('.chat-input-area textarea');
      if (chatInput) {
        chatInput.value = chip.textContent;
        chatInput.focus();
      }
    });
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (window.scrollY < 80 && entry.target.id !== "home") return;
      navLinksList.forEach((link) => link.classList.remove("active"));
      const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (activeLink) activeLink.classList.add("active");
      updateContextChips(entry.target.id);
    }
  });
}, observerOptions);

sections.forEach((section) => observer.observe(section));

window.addEventListener("scroll", () => {
  if (window.scrollY < 80) {
    navLinksList.forEach((link) => link.classList.remove("active"));
    const homeLink = document.querySelector('.nav-links a[href="#home"]');
    if (homeLink) homeLink.classList.add("active");
    updateContextChips("home");
  }
});

// ==========================================
// HARDWARE-ACCELERATED MOBILE CANVAS BACKGROUND
// ==========================================
(function() {
  const bgCanvas = document.getElementById("neural-network");
  if (!bgCanvas) return;
  const bgCtx = bgCanvas.getContext("2d");

  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;

  const isMobile = window.innerWidth < 768 || /Android|iPhone|iPad/i.test(navigator.userAgent);
  const count = isMobile ? 26 : 85;
  const maxDistSq = isMobile ? 7000 : 13000;
  const netParticles = [];

  class BgParticle {
    constructor() {
      this.x = Math.random() * bgCanvas.width;
      this.y = Math.random() * bgCanvas.height;
      this.vx = (Math.random() - 0.5) * (isMobile ? 0.5 : 0.8);
      this.vy = (Math.random() - 0.5) * (isMobile ? 0.5 : 0.8);
      this.size = 2;
    }
    move() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > bgCanvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > bgCanvas.height) this.vy *= -1;
    }
    draw(isDark) {
      bgCtx.beginPath();
      bgCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      bgCtx.fillStyle = isDark ? "#ffffff" : "#000000";
      bgCtx.fill();
    }
  }

  for (let i = 0; i < count; i++) {
    netParticles.push(new BgParticle());
  }

  function connectParticles(isDark) {
    bgCtx.lineWidth = 1;
    bgCtx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.12)";
    for (let a = 0; a < netParticles.length; a++) {
      for (let b = a + 1; b < netParticles.length; b++) {
        const dx = netParticles[a].x - netParticles[b].x;
        const dy = netParticles[a].y - netParticles[b].y;
        const distance = dx * dx + dy * dy;
        if (distance < maxDistSq) {
          bgCtx.beginPath();
          bgCtx.moveTo(netParticles[a].x, netParticles[a].y);
          bgCtx.lineTo(netParticles[b].x, netParticles[b].y);
          bgCtx.stroke();
        }
      }
    }
  }

  function renderLoop() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    const isDark = document.body.classList.contains('dark-mode');
    netParticles.forEach(p => { p.move(); p.draw(isDark); });
    connectParticles(isDark);
    requestAnimationFrame(renderLoop);
  }
  renderLoop();

  window.addEventListener("resize", () => {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
  });
})();

// =============== POPUPS WITH TAP-TO-DISMISS ===============
function showPopup(event) {
  event?.preventDefault();
  const popup = document.getElementById("glass-popup");
  if (popup) {
    popup.classList.add("show");
    popup.onclick = () => popup.classList.remove("show");
    setTimeout(() => popup.classList.remove("show"), 3500);
  }
}

function showLivePopup(event) {
  event?.preventDefault();
  const popup = document.getElementById("livePopup");
  if (popup) {
    popup.classList.add("show");
    popup.onclick = () => popup.classList.remove("show");
    setTimeout(() => popup.classList.remove("show"), 3500);
  }
}

function showPopupp(event, popupId) {
  event?.preventDefault();
  const popup = document.getElementById(popupId);
  if (popup) {
    popup.classList.add("show");
    popup.onclick = () => popup.classList.remove("show");
    setTimeout(() => popup.classList.remove("show"), 3500);
  }
}

// =============== TOOLBOX INFINITE SCROLLER ===============
const scrollers = document.querySelectorAll(".scroller");
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  scrollers.forEach((scroller) => {
    scroller.setAttribute("data-animated", true);
    const scrollerInner = scroller.querySelector(".scroller__inner");
    if (!scrollerInner) return;
    const scrollerContent = Array.from(scrollerInner.children);
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      duplicatedItem.setAttribute("aria-hidden", true); 
      scrollerInner.appendChild(duplicatedItem);
    });
  });
}

// =============== HIDE BROKEN IMAGES ===============
document.addEventListener('error', function(event) {
  if (event.target.tagName.toLowerCase() === 'img') {
    event.target.style.display = 'none';
  }
}, true); 

// =============== TYPING SOUND CONTROLLER & HOME EFFECT (SNAPPY) ===============
const typingWords = ["AI that ships software products.", "reliable backend API's.", "LLM powered products."];
let typingIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingTextElement = document.querySelector(".typing-text");

let audioCtx = null;
let isAudioEnabled = true;
let lastTypingTime = 0;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTypingSound() {
  if (!isAudioEnabled) return;

  const now = performance.now();
  if (now - lastTypingTime < 15) return;
  lastTypingTime = now;

  const ctx = getAudioContext();
  const t = ctx.currentTime;
  const pitchVar = 1 + (Math.random() - 0.5) * 0.12;

  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(580 * pitchVar, t);
  osc.frequency.exponentialRampToValueAtTime(320 * pitchVar, t + 0.011);

  oscGain.gain.setValueAtTime(0.18, t);
  oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.012);

  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.014);

  const bufferLen = Math.floor(ctx.sampleRate * 0.008);
  const noiseBuffer = ctx.createBuffer(1, bufferLen, ctx.sampleRate);
  const channelData = noiseBuffer.getChannelData(0);

  for (let i = 0; i < bufferLen; i++) {
    channelData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.0018));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.setValueAtTime(1850 * pitchVar, t);
  bandpass.Q.setValueAtTime(2.8, t);

  const shelf = ctx.createBiquadFilter();
  shelf.type = 'highshelf';
  shelf.frequency.setValueAtTime(4200, t);
  shelf.gain.setValueAtTime(-8, t);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.15, t);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.008);

  noise.connect(bandpass);
  bandpass.connect(shelf);
  shelf.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  noise.start(t);
  noise.stop(t + 0.01);
}

const audioToggleBtn = document.getElementById("audioToggleBtn");
if (audioToggleBtn) {
  audioToggleBtn.addEventListener("click", () => {
    isAudioEnabled = !isAudioEnabled;
    const icon = audioToggleBtn.querySelector("i");
    if (isAudioEnabled) {
      icon?.classList.remove("fa-volume-mute");
      icon?.classList.add("fa-volume-up");
      getAudioContext();
    } else {
      icon?.classList.remove("fa-volume-up");
      icon?.classList.add("fa-volume-mute");
    }
  });
}

['click', 'touchstart', 'keydown'].forEach(eventType => {
  document.body.addEventListener(eventType, () => {
    getAudioContext();
  }, { once: true });
});

let pauseIndices = [];

function typeEffect() {
  if (!typingTextElement) return;
  const currentWord = typingWords[typingIndex];
  
  if (!isDeleting && charIndex === 0 && pauseIndices.length === 0) {
    if (currentWord.length > 3) {
      let p1 = Math.floor(Math.random() * (currentWord.length - 2)) + 1;
      let p2 = Math.floor(Math.random() * (currentWord.length - 2)) + 1;
      pauseIndices.push(p1, p2);
    }
  }

  if (isDeleting) {
    typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
  }

  let typingSpeed = isDeleting ? 22 : 55;
  if (!isDeleting && pauseIndices.includes(charIndex)) {
    typingSpeed += 120; 
  }

  if (!isDeleting && charIndex === currentWord.length) {
    typingSpeed = 1200; 
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    typingIndex = (typingIndex + 1) % typingWords.length;
    typingSpeed = 260; 
    pauseIndices = []; 
  }

  setTimeout(typeEffect, typingSpeed);
}

// =============== FAST SCROLL REVEAL ANIMATIONS ===============
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target); 
    }
  });
}, { threshold: 0.05, rootMargin: "0px 0px -25px 0px" }); 

// =============== FAST NUMBER COUNTER ANIMATION ===============
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counter = entry.target;
      const target = +counter.getAttribute('data-target');
      const suffix = counter.getAttribute('data-suffix') || '';
      const prefix = counter.getAttribute('data-prefix') || '';
      const duration = 850; 
      
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * target);
        counter.innerText = prefix + current + suffix;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          counter.innerText = prefix + target + suffix;
        }
      };
      window.requestAnimationFrame(step);
      observer.unobserve(counter); 
    }
  });
}, { threshold: 0.2 }); 

counters.forEach(counter => counterObserver.observe(counter));

// ==========================================
// UNIFIED PROJECT FILTER (DESKTOP & MOBILE DROPDOWN)
// ==========================================
const filterBtns = document.querySelectorAll('.filter-btn');
const mobileFilterSelect = document.getElementById('projectFilterSelect');
const projectCardsGrid = document.querySelectorAll('.project-card[data-tags]');

function applyProjectFilter(filterValue) {
  filterBtns.forEach(btn => {
    if (btn.getAttribute('data-filter') === filterValue) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  if (mobileFilterSelect && mobileFilterSelect.value !== filterValue) {
    mobileFilterSelect.value = filterValue;
  }

  projectCardsGrid.forEach(card => {
    if (filterValue === 'all') {
      card.classList.remove('hidden-project');
    } else {
      const tags = (card.getAttribute('data-tags') || '').split(' ');
      if (tags.includes(filterValue)) {
        card.classList.remove('hidden-project');
      } else {
        card.classList.add('hidden-project');
      }
    }
  });
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filterValue = btn.getAttribute('data-filter') || 'all';
    applyProjectFilter(filterValue);
  });
});

if (mobileFilterSelect) {
  mobileFilterSelect.addEventListener('change', (e) => {
    applyProjectFilter(e.target.value || 'all');
  });
}

applyProjectFilter('all');

// ==============================================================
// AI CHATBOT LOGIC WITH NON-INTRUSIVE AUTO-SCROLL
// ==============================================================
const chatInputArea = document.querySelector('.chat-input-area textarea');
const sendButton = document.querySelector('.send-btn');
const chatWin = document.getElementById('chatScrollContent');
const chatErrorBanner = document.getElementById('chatError');
const quickPrompts = document.querySelectorAll('.sq-btn');

function canStoreAiHistory() {
  return localStorage.getItem("aiCookies") === "true";
}

function saveChatMessageToStorage(role, text, telemetryHtml = null) {
  if (!canStoreAiHistory()) return;
  try {
    const history = JSON.parse(localStorage.getItem("cyanx_chat_history") || "[]");
    history.push({ role, text, telemetryHtml });
    if (history.length > 50) history.shift();
    localStorage.setItem("cyanx_chat_history", JSON.stringify(history));
  } catch (e) {}
}

function loadStoredChatHistory() {
  if (!canStoreAiHistory() || !chatWin) return;
  try {
    const raw = localStorage.getItem("cyanx_chat_history");
    if (!raw) return;
    const history = JSON.parse(raw);
    if (!Array.isArray(history) || history.length === 0) return;

    chatWin.innerHTML = '';
    history.forEach(item => {
      const msgDiv = document.createElement('div');
      msgDiv.className = `chat-message ${item.role}`;
      msgDiv.textContent = item.text;
      if (item.telemetryHtml) {
        msgDiv.appendChild(document.createElement('br'));
        const telDiv = document.createElement('div');
        telDiv.innerHTML = item.telemetryHtml;
        msgDiv.appendChild(telDiv.firstElementChild);
      }
      chatWin.appendChild(msgDiv);
    });
    chatWin.scrollTop = chatWin.scrollHeight;
  } catch (e) {}
}

function clearChatHistory() {
  localStorage.removeItem("cyanx_chat_history");
  if (chatWin) {
    chatWin.innerHTML = `
      <div class="chat-message bot">
        Chat history cleared. Hey there! Ask me anything about projects, skills, or experience.
      </div>
    `;
    chatWin.scrollTop = 0;
  }
}

if (chatInputArea) {
  chatInputArea.addEventListener('input', playTypingSound);
  chatInputArea.addEventListener('keydown', (e) => {
    if (!['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) {
      playTypingSound();
    }
  });
}

quickPrompts.forEach(btn => {
  btn.addEventListener('click', () => {
    if (chatInputArea) {
      chatInputArea.value = btn.textContent.trim();
      chatInputArea.focus();
    }
  });
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function sendChatMessage() {
  if (!chatInputArea || !chatWin) return;
  const message = chatInputArea.value.trim();
  if (!message) return;

  if (message.toLowerCase() === "/clear") {
    chatInputArea.value = '';
    clearChatHistory();
    return;
  }

  if (chatErrorBanner) chatErrorBanner.style.display = 'none';

  const userMsg = document.createElement('div');
  userMsg.className = 'chat-message user';
  userMsg.textContent = message;
  chatWin.appendChild(userMsg);
  saveChatMessageToStorage("user", message);

  chatInputArea.value = '';
  chatWin.scrollTop = chatWin.scrollHeight;

  if (message.toLowerCase() === '/sudo download_resume') {
    const botMsg = document.createElement('div');
    botMsg.className = 'chat-message bot';
    botMsg.innerHTML = '<span style="color:#0969da;">> ROOT ACCESS GRANTED.</span><br>Downloading Resume...';
    chatWin.appendChild(botMsg);
    chatWin.scrollTop = chatWin.scrollHeight;

    setTimeout(() => {
      const link = document.createElement('a');
      link.href = 'resumeee.html'; 
      link.download = 'Vignesh_Resume.html'; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 800);
    return; 
  }

  const botMsg = document.createElement('div');
  botMsg.className = 'chat-message bot';
  botMsg.textContent = 'Thinking...';
  chatWin.appendChild(botMsg);
  chatWin.scrollTop = chatWin.scrollHeight;

  const faceText = document.getElementById('faceText');
  if (faceText) faceText.textContent = '🤔';

  const startTime = performance.now();

  try {
    const activeNav = document.querySelector('.nav-links a.active');
    const currentContext = activeNav ? activeNav.getAttribute('href').substring(1) : 'unknown';

    const targetUrl = await resolveActiveBackend();

    const response = await fetch(`${targetUrl}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message, context: currentContext })
    });

    if (!response.ok) throw new Error("Server offline");

    const data = await response.json();
    const replyText = data.reply;
    
    const calcTime = ((performance.now() - startTime) / 1000).toFixed(2);
    const responseTimeSec = data.time_ms ? (data.time_ms / 1000).toFixed(2) + "s" : calcTime + "s";
    
    let verifiedScore = "92.4% Match";
    if (data.score !== undefined && data.score !== null) {
      verifiedScore = `${data.score}% Match`;
    }

    const apiBadge = document.getElementById('apiBadge');
    if (apiBadge) {
      apiBadge.className = 'api-badge success';
      const isLocal = targetUrl.includes("127.0.0.1") || targetUrl.includes("localhost");
      apiBadge.innerHTML = isLocal 
        ? '<i class="fa-solid fa-check"></i> LOCALHOST ACTIVE' 
        : '<i class="fa-solid fa-check"></i> API ACTIVE';
    }

    botMsg.textContent = ''; 
    for (let i = 0; i < replyText.length; i++) {
      botMsg.textContent += replyText.charAt(i);

      const distanceFromBottom = chatWin.scrollHeight - chatWin.scrollTop - chatWin.clientHeight;
      if (distanceFromBottom <= 80) {
        chatWin.scrollTop = chatWin.scrollHeight;
      }
      await sleep(6); 
    }
    
    const telemetry = document.createElement('div');
    telemetry.className = 'ai-telemetry-badge';
    telemetry.innerHTML = `
      <span class="telemetry-item">⏱️ Response time: <strong>${responseTimeSec}</strong></span>
      <span class="telemetry-sep">|</span>
      <span class="telemetry-item">🧠 Search score: <strong>${verifiedScore}</strong></span>
    `;
    botMsg.appendChild(document.createElement('br'));
    botMsg.appendChild(telemetry);

    saveChatMessageToStorage("bot", replyText, telemetry.outerHTML);

    if (faceText) faceText.textContent = '◕⁠‿⁠◕';
    showNextNotification();
    
  } catch (error) {
    botMsg.remove(); 
    if (chatErrorBanner) {
      chatErrorBanner.style.display = 'block'; 
      chatErrorBanner.textContent = 'Failed to fetch API';
    }
    const apiBadge = document.getElementById('apiBadge');
    if (apiBadge) {
      apiBadge.className = 'api-badge error';
      apiBadge.innerHTML = '<i class="fa-solid fa-xmark"></i> ERROR FETCHING API';
    }
    if (faceText) faceText.textContent = 'x_x';
  }
  
  const finalDistance = chatWin.scrollHeight - chatWin.scrollTop - chatWin.clientHeight;
  if (finalDistance <= 120) {
    chatWin.scrollTop = chatWin.scrollHeight;
  }
}

if (sendButton) sendButton.addEventListener('click', sendChatMessage);

if (chatInputArea) {
  chatInputArea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  });
}

function showNextNotification() {
  const notif = document.getElementById('aiNotification');
  if (notif) {
    notif.classList.remove('slide-out');
    notif.classList.add('slide-in');
    setTimeout(() => {
      notif.classList.remove('slide-in');
      notif.classList.add('slide-out');
    }, 4000);
  }
}

// =============== COOKIES PREFERENCES PANEL ===============
document.addEventListener("DOMContentLoaded", () => {
  const cookiePanel = document.getElementById("cookiePreferencesPanel");
  const btnAcceptAll = document.getElementById("btn-accept-all");
  const btnAcceptNecessary = document.getElementById("btn-accept-necessary");
  const aiToggle = document.getElementById("cookie-ai");
  const themeToggleBtn = document.getElementById("cookie-theme");
  const openCookiePreferencesLink = document.getElementById("openCookiePreferencesLink");

  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  const lastPromptTime = parseInt(localStorage.getItem("cookie_last_prompt_time") || "0", 10);
  const now = Date.now();

  if (now - lastPromptTime > ONE_WEEK_MS) {
    setTimeout(() => {
      if (cookiePanel) cookiePanel.classList.add("show");
    }, 1000);
  }

  if (openCookiePreferencesLink) {
    openCookiePreferencesLink.addEventListener("click", () => {
      if (aiToggle) {
        aiToggle.checked = localStorage.getItem("aiCookies") === "true";
      }
      if (themeToggleBtn) {
        themeToggleBtn.checked = localStorage.getItem("themeCookies") === "true" || localStorage.getItem("cookieConsent") === "all";
      }
      if (cookiePanel) cookiePanel.classList.add("show");
    });
  }

  window.openCookieModal = function(title, description) {
    const t = document.getElementById("cookieInfoTitle");
    const d = document.getElementById("cookieInfoDesc");
    if (t) t.innerText = title;
    if (d) d.innerText = description;
    document.getElementById("cookieInfoModal")?.classList.add("show");
  };

  window.closeCookieModal = function() {
    document.getElementById("cookieInfoModal")?.classList.remove("show");
  };

  if (btnAcceptAll) {
    btnAcceptAll.addEventListener("click", () => {
      localStorage.setItem("cookieConsent", "all");
      localStorage.setItem("functionalCookies", "true");
      localStorage.setItem("aiCookies", "true");
      localStorage.setItem("themeCookies", "true");
      localStorage.setItem("cookie_last_prompt_time", Date.now().toString());
      if (aiToggle) aiToggle.checked = true;
      if (themeToggleBtn) themeToggleBtn.checked = true;
      if (cookiePanel) cookiePanel.classList.remove("show");
    });
  }

  if (btnAcceptNecessary) {
    btnAcceptNecessary.addEventListener("click", () => {
      localStorage.setItem("cookieConsent", "necessary");
      localStorage.setItem("functionalCookies", "false");
      localStorage.setItem("aiCookies", "false");
      localStorage.setItem("themeCookies", "false");
      localStorage.setItem("cookie_last_prompt_time", Date.now().toString());
      localStorage.removeItem("cyanx_chat_history");
      localStorage.removeItem("cyanx_theme");
      if (aiToggle) aiToggle.checked = false;
      if (themeToggleBtn) themeToggleBtn.checked = false;
      if (cookiePanel) cookiePanel.classList.remove("show");
    });
  }
});

// ==========================================
// DARK MODE TOGGLE & PERSISTENCE (CROSS-PAGE SYNC)
// ==========================================
const themeToggleCheckbox = document.getElementById('themeToggleCheckbox');
const cookieTheme = document.getElementById('cookie-theme');

function applyTheme(isDark) {
  if (isDark) {
    document.body.classList.add('dark-mode');
    document.documentElement.classList.add('dark-mode');
    if (themeToggleCheckbox) themeToggleCheckbox.checked = true;
  } else {
    document.body.classList.remove('dark-mode');
    document.documentElement.classList.remove('dark-mode');
    if (themeToggleCheckbox) themeToggleCheckbox.checked = false;
  }
}

function syncThemeState() {
  const stored = localStorage.getItem("cyanx_theme") || localStorage.getItem("theme") || localStorage.getItem("nv_theme");
  const isDark = (stored === "dark" || stored === "obsidian");
  applyTheme(isDark);
}

if (themeToggleCheckbox) {
  themeToggleCheckbox.addEventListener('change', (e) => {
    const isDark = e.target.checked;
    applyTheme(isDark);
    localStorage.setItem("cyanx_theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    localStorage.setItem("nv_theme", isDark ? "obsidian" : "minimal");
  });
}

document.addEventListener("DOMContentLoaded", syncThemeState);
window.addEventListener("pageshow", syncThemeState);
window.addEventListener("storage", syncThemeState);

if (cookieTheme) {
  cookieTheme.addEventListener('change', (e) => {
    if (e.target.checked) {
      localStorage.setItem("themeCookies", "true");
      if (themeToggleCheckbox) {
        localStorage.setItem("cyanx_theme", themeToggleCheckbox.checked ? "dark" : "light");
      }
    } else {
      localStorage.setItem("themeCookies", "false");
      localStorage.removeItem("cyanx_theme");
    }
  });
}

// =============== EXACT DEVICE GAME SCORES ===============
function getExactDeviceArcadeData() {
  const games = [
    { id: "snake", name: "Cyber Snake", key: "cyanx_snake_score", altKey: "cyanx_snake_best" },
    { id: "memory", name: "Memory Matrix", key: "cyanx_memory_score", altKey: "cyanx_memory_best" },
    { id: "dodge", name: "Neural Reflex", key: "cyanx_dodge_score", altKey: "cyanx_dodge_best" },
    { id: "pong", name: "Quantum Pong", key: "cyanx_pong_score", altKey: "cyanx_pong_best" }
  ];

  let totalExactScore = 0;
  const records = [];

  games.forEach(g => {
    const s1 = parseInt(localStorage.getItem(g.key), 10) || 0;
    const s2 = parseInt(localStorage.getItem(g.altKey), 10) || 0;
    const best = Math.max(s1, s2);
    totalExactScore += best;
    records.push({ name: g.name, score: best });
  });

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("cyanx_") && !games.some(g => g.key === key || g.altKey === key)) {
      if (key.includes("score") || key.includes("best")) {
        const val = parseInt(localStorage.getItem(key), 10) || 0;
        totalExactScore += val;
        records.push({ name: key.replace("cyanx_", "").replace(/_/g, " ").toUpperCase(), score: val });
      }
    }
  }

  return { totalScore: totalExactScore, records };
}

function initPointsPopup() {
  const popup = document.getElementById("navPointsPopup");
  const pointsText = document.getElementById("bubblePointsText");
  if (!popup) return;

  const data = getExactDeviceArcadeData();
  const displayScore = data.totalScore.toLocaleString();

  if (pointsText) {
    pointsText.textContent = `Arcade: ${displayScore} pts`;
  }

  popup.addEventListener("click", () => {
    const modal = document.getElementById("arcadeModal");
    if (modal) {
      const modalTotal = document.getElementById("arcadeModalTotal");
      if (modalTotal) modalTotal.textContent = `Total Record: ${displayScore} pts`;
      
      const recordsContainer = document.getElementById("arcadeGameRecords");
      if (recordsContainer) {
        recordsContainer.innerHTML = data.records.map(r => `
          <div class="game-record-row">
            <span class="game-record-name">${r.name}</span>
            <span class="game-record-score">${r.score.toLocaleString()} pts</span>
          </div>
        `).join('');
      }

      modal.classList.add("show");
    }
  });

  const closeArcadeModalBtn = document.getElementById("closeArcadeModal");
  if (closeArcadeModalBtn) {
    closeArcadeModalBtn.addEventListener("click", () => {
      document.getElementById("arcadeModal")?.classList.remove("show");
    });
  }
}

// =============== TERMINAL UI ===============
window.insertTerminalCmd = function(cmd) {
  const terminalInput = document.getElementById("terminalInput");
  if (terminalInput) {
    terminalInput.value = cmd;
    terminalInput.focus();
    terminalInput.selectionStart = terminalInput.selectionEnd = terminalInput.value.length;
  }
};

const terminalInput = document.getElementById("terminalInput");
const terminalBody = document.getElementById("terminalBody");

if (terminalInput && terminalBody) {
  const commandHistory = [];
  let historyIndex = -1;
  let savedCurrentInput = "";

  const terminalCommands = [
    "help", "about", "projects", "experience", "skills", "stats", "contact",
    "socials", "resume", "quote", "matrix", "date", "whoami",
    "open bits-radar", "open g-plus", "open exotic-hub", "open passport",
    "chat", "arcade", "play", "ping vignesh", "curl api/status",
    "./neural_vision", "ls", "cat", "echo", "history", "clear",
    "/sudo download_resume"
  ];
  const terminalFiles = ["g-plus.txt", "bits-radar.txt", "exotic-hub.txt", "resume.pdf"];

  terminalInput.addEventListener('input', playTypingSound);

  terminalBody.addEventListener("click", () => {
    if (window.getSelection().toString() === "") {
      terminalInput.focus();
    }
  });

  terminalInput.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      if (historyIndex === -1) {
        savedCurrentInput = terminalInput.value;
        historyIndex = commandHistory.length - 1;
      } else if (historyIndex > 0) {
        historyIndex--;
      }
      terminalInput.value = commandHistory[historyIndex];
      terminalInput.selectionStart = terminalInput.selectionEnd = terminalInput.value.length;
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex];
      } else {
        historyIndex = -1;
        terminalInput.value = savedCurrentInput;
      }
      terminalInput.selectionStart = terminalInput.selectionEnd = terminalInput.value.length;
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const currentVal = terminalInput.value;
      const lowerVal = currentVal.toLowerCase();

      if (lowerVal.startsWith("cat ")) {
        const filePrefix = lowerVal.slice(4).trim();
        const matchedFile = terminalFiles.find(f => f.startsWith(filePrefix));
        if (matchedFile) terminalInput.value = `cat ${matchedFile}`;
      } else if (lowerVal.trim().length > 0) {
        const trimmed = lowerVal.trim();
        const matchedCmd = terminalCommands.find(c => c.startsWith(trimmed));
        if (matchedCmd) terminalInput.value = matchedCmd;
      }
      return;
    }

    if (e.key === "Enter") {
      const command = terminalInput.value.trim();
      const inputLine = document.querySelector(".terminal-input-line");

      const cmdLine = document.createElement("div");
      cmdLine.className = "terminal-line";
      cmdLine.innerHTML = `<span class="terminal-prompt">guest@vignesh-os:~$></span> ${command}`;
      terminalBody.insertBefore(cmdLine, inputLine);

      if (command) {
        commandHistory.push(command);
        historyIndex = -1;
        savedCurrentInput = "";
      } else {
        terminalInput.value = "";
        terminalBody.scrollTop = terminalBody.scrollHeight;
        return; 
      }

      const responseLine = document.createElement("div");
      responseLine.className = "terminal-line";
      const lowerCmd = command.toLowerCase();
      
      if (lowerCmd === "help") {
        responseLine.innerHTML = `
          <div class="terminal-help-container">
            <div class="terminal-help-title">Click any command to autofill or type and press Enter:</div>
            <div class="terminal-cmd-grid">
              <div class="term-cmd-item" onclick="insertTerminalCmd('projects')">
                <span class="cmd-name">projects</span>
                <span class="cmd-desc">- Jump to projects section</span>
              </div>
              <div class="term-cmd-item" onclick="insertTerminalCmd('open bits-radar')">
                <span class="cmd-name">open bits-radar</span>
                <span class="cmd-desc">- Open BITS RADAR drawer</span>
              </div>
              <div class="term-cmd-item" onclick="insertTerminalCmd('open g-plus')">
                <span class="cmd-name">open g-plus</span>
                <span class="cmd-desc">- Open G+ Bengaluru drawer</span>
              </div>
              <div class="term-cmd-item" onclick="insertTerminalCmd('open exotic-hub')">
                <span class="cmd-name">open exotic-hub</span>
                <span class="cmd-desc">- Open Exotic Hub drawer</span>
              </div>
              <div class="term-cmd-item" onclick="insertTerminalCmd('skills')">
                <span class="cmd-name">skills</span>
                <span class="cmd-desc">- Inspect core tech stack</span>
              </div>
              <div class="term-cmd-item" onclick="insertTerminalCmd('experience')">
                <span class="cmd-name">experience</span>
                <span class="cmd-desc">- Jump to work history</span>
              </div>
              <div class="term-cmd-item" onclick="insertTerminalCmd('stats')">
                <span class="cmd-name">stats</span>
                <span class="cmd-desc">- Display live system telemetry</span>
              </div>
              <div class="term-cmd-item" onclick="insertTerminalCmd('contact')">
                <span class="cmd-name">contact</span>
                <span class="cmd-desc">- Jump to contact section</span>
              </div>
              <div class="term-cmd-item" onclick="insertTerminalCmd('socials')">
                <span class="cmd-name">socials</span>
                <span class="cmd-desc">- List verified web profiles</span>
              </div>
              <div class="term-cmd-item" onclick="insertTerminalCmd('resume')">
                <span class="cmd-name">resume</span>
                <span class="cmd-desc">- View official resume</span>
              </div>
              <div class="term-cmd-item" onclick="insertTerminalCmd('quote')">
                <span class="cmd-name">quote</span>
                <span class="cmd-desc">- Core engineering philosophy</span>
              </div>
              <div class="term-cmd-item" onclick="insertTerminalCmd('chat What is your strongest AI project?')">
                <span class="cmd-name">chat [msg]</span>
                <span class="cmd-desc">- Query CYANX AI assistant</span>
              </div>
              <div class="term-cmd-item" onclick="insertTerminalCmd('matrix')">
                <span class="cmd-name">matrix</span>
                <span class="cmd-desc">- Run matrix security scan</span>
              </div>
              <div class="term-cmd-item" onclick="insertTerminalCmd('arcade')">
                <span class="cmd-name">arcade</span>
                <span class="cmd-desc">- Launch Neural Arcade</span>
              </div>
              <div class="term-cmd-item" onclick="insertTerminalCmd('ping vignesh')">
                <span class="cmd-name">ping vignesh</span>
                <span class="cmd-desc">- Run connection health check</span>
              </div>
              <div class="term-cmd-item" onclick="insertTerminalCmd('clear')">
                <span class="cmd-name">clear</span>
                <span class="cmd-desc">- Clear terminal screen</span>
              </div>
            </div>
          </div>
        `;
      
      } else if (lowerCmd === "projects") {
        responseLine.innerHTML = `<span style="color:#0969da;">> Navigating to Projects section...</span>`;
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });

      } else if (lowerCmd.startsWith("open ")) {
        const proj = lowerCmd.split(" ")[1]?.trim();
        if (["bits-radar", "g-plus", "exotic-hub", "passport"].includes(proj)) {
          responseLine.innerHTML = `<span style="color:#0969da;">> Opening architecture drawer for ${proj}...</span>`;
          document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => openArchitectureDrawer(proj), 300);
        } else {
          responseLine.innerHTML = `Unknown project: ${proj}. Valid options: bits-radar, g-plus, exotic-hub, passport`;
          responseLine.style.color = "#ff5f56";
        }

      } else if (lowerCmd === "experience") {
        responseLine.innerHTML = `<span style="color:#0969da;">> Navigating to Career Experience timeline...</span>`;
        document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" });

      } else if (lowerCmd === "skills" || lowerCmd === "stack") {
        responseLine.innerHTML = `
          <strong>Core Technologies:</strong><br>
          • <strong>AI / ML:</strong> SentenceTransformers, Ollama, LLM Integration, Vector Search<br>
          • <strong>Backend:</strong> Python, FastAPI (ASGI), Flask, RESTful APIs, SQLite, MySQL, PostgreSQL<br>
          • <strong>Frontend:</strong> JavaScript (ES6+), Three.js, Responsive UI/UX, CSS Glassmorphism
        `;
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });

      } else if (lowerCmd === "stats") {
        responseLine.innerHTML = `
          <strong>TELEMETRY TELEMETRICS:</strong><br>
          [⚡] Latency P95: &lt; 50ms average API response<br>
          [🌐] API Reliability: 100% uptime<br>
          [📦] Software Systems: 5+ Engineered & Shipped<br>
          [🛠️] Core Stack Tools: 10+ Mastered
        `;

      } else if (lowerCmd === "socials") {
        responseLine.innerHTML = `
          <strong>Direct Links:</strong><br>
          • GitHub: <a href="https://github.com/vignesh1-1" target="_blank" style="color:#0969da;">github.com/vignesh1-1</a><br>
          • LinkedIn: <a href="https://linkedin.com/in/vigneshp05" target="_blank" style="color:#0969da;">linkedin.com/in/vigneshp05</a><br>
          • X (Twitter): <a href="https://x.com/Vignesh6622" target="_blank" style="color:#0969da;">x.com/Vignesh6622</a><br>
          • VSCO: <a href="https://vsco.co/vcenzo1" target="_blank" style="color:#0969da;">vsco.co/vcenzo1</a><br>
          • Instagram: <a href="https://www.instagram.com/viggh_____01" target="_blank" style="color:#0969da;">instagram.com/viggh_____01</a>
        `;

      } else if (lowerCmd === "resume") {
        responseLine.innerHTML = `<span style="color:#0969da;">> Opening resume view...</span>`;
        window.open('resumeee.html', '_blank');

      } else if (lowerCmd === "quote") {
        responseLine.innerHTML = `<span style="color:#0969da;">"Building dependable software means engineering systems that remain resilient when the unexpected happens."</span><br>— Vignesh P`;
        document.getElementById("philosophy")?.scrollIntoView({ behavior: "smooth" });

      } else if (lowerCmd === "matrix") {
        responseLine.innerHTML = `<span style="color:#27c93f;">[SEC-SCAN]: ACCESS GRANTED. OVERRIDE CODE: 0x9924. PROTOCOL VIGNESH-OS INITIALIZED.</span>`;
        terminalBody.style.transition = "background-color 0.3s ease, color 0.3s ease";
        terminalBody.style.backgroundColor = "#021a07";
        terminalBody.style.color = "#39ff14";
        setTimeout(() => {
          terminalBody.style.backgroundColor = "";
          terminalBody.style.color = "";
        }, 1400);

      } else if (lowerCmd === "date") {
        responseLine.innerHTML = `System Timestamp: ${new Date().toUTCString()} (Local: ${new Date().toLocaleString()})`;

      } else if (lowerCmd.startsWith("echo ")) {
        responseLine.textContent = command.slice(5);

      } else if (lowerCmd === "history") {
        responseLine.innerHTML = commandHistory.map((cmd, idx) => `&nbsp;&nbsp;${idx + 1}&nbsp;&nbsp;${cmd}`).join("<br>");

      } else if (lowerCmd === "about") {
        responseLine.innerHTML = `<span style="color:#0969da;">> Scrolling to Capabilities & Bio...</span>`;
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });

      } else if (lowerCmd === "contact") {
        responseLine.innerHTML = `<span style="color:#0969da;">> Scrolling to Contact section...</span>`;
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

      } else if (lowerCmd.startsWith("chat ")) {
        const chatPrompt = command.slice(5).trim();
        responseLine.innerHTML = `<span style="color:#0969da;">> Passing query to CYANX AI: "${chatPrompt}"...</span>`;
        const aiSec = document.getElementById("ai-assistant");
        aiSec?.scrollIntoView({ behavior: "smooth" });
        if (chatInputArea) {
          chatInputArea.value = chatPrompt;
          setTimeout(() => sendChatMessage(), 400);
        }

      } else if (lowerCmd === "arcade" || lowerCmd === "play") {
        responseLine.innerHTML = `<span style="color:#0969da;">> NEURAL ARCADE BRIDGE ENGAGED.</span><br>Initializing gaming protocol...`;
        triggerArcadeRedirect();

      } else if (lowerCmd === "ping vignesh") {
        responseLine.innerHTML = `PING vignesh-server (127.0.0.1): 56 data bytes<br>
          64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=1.234 ms<br>
          64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=1.192 ms<br>
          --- vignesh-server ping statistics ---<br>
          2 packets transmitted, 2 packets received, 0.0% packet loss`;
          
      } else if (lowerCmd === "sudo rm -rf /") {
        responseLine.innerHTML = "NICE TRY. System lockdown initiated... Just kidding.";
        responseLine.style.color = "#ff5f56";
        const termContainer = document.querySelector(".terminal-container");
        if (termContainer) {
          termContainer.classList.add("glitch-shake");
          setTimeout(() => termContainer.classList.remove("glitch-shake"), 400);
        }

      } else if (lowerCmd === "/sudo download_resume") {
        responseLine.innerHTML = `<span style="color:#0969da;">> ROOT ACCESS GRANTED.</span><br>Downloading Resume...`;
        setTimeout(() => {
          const link = document.createElement('a');
          link.href = 'resumeee.html'; 
          link.download = 'Vignesh_Resume.html';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, 800);
      
      } else if (lowerCmd === "clear") {
        const allLines = terminalBody.querySelectorAll(".terminal-line");
        allLines.forEach(line => line.remove());
        terminalInput.value = "";
        return; 
      
      } else if (lowerCmd === "ls") {
        responseLine.innerHTML = `<span style="color:#0969da">g-plus.txt</span>&nbsp;&nbsp;&nbsp;<span style="color:#0969da">bits-radar.txt</span>&nbsp;&nbsp;&nbsp;<span style="color:#0969da">exotic-hub.txt</span>&nbsp;&nbsp;&nbsp;<span style="color:#ff5f56">resume.pdf</span>`;
      
      } else if (lowerCmd.startsWith("cat ")) {
        const file = lowerCmd.split(" ")[1];
        if (file === "g-plus.txt") {
          responseLine.innerHTML = "G+ Bengaluru: Integrated smart city command center with real-time GIS mapping, AI query resolution, and Gemini API.";
        } else if (file === "bits-radar.txt") {
          responseLine.innerHTML = "BITS Radar: Python/Flask Bug Tracking System with RBAC, REST APIs, and bulk operations.";
        } else if (file === "exotic-hub.txt") {
          responseLine.innerHTML = "Exotic GB Hub: Firebase-powered E-commerce platform for premium aquarium supplies.";
        } else if (file === "resume.pdf") {
          responseLine.innerHTML = "Cannot output raw PDF data to terminal. Use 'resume' or '/sudo download_resume' instead.";
          responseLine.style.color = "#ffbd2e";
        } else {
          responseLine.innerHTML = `cat: ${file}: No such file or directory`;
        }
      
      } else if (lowerCmd === "./neural_vision.sh" || lowerCmd === "./neural_vision") {
        responseLine.innerHTML = "Executing Neural Vision protocol... Redirecting...";
        const overlay = document.getElementById("loadingOverlay");
        if (overlay) overlay.classList.add("active");
        setTimeout(() => window.location.href = 'rcb.html', 100);

      } else if (lowerCmd === "whoami") {
        responseLine.innerHTML = "guest_recruiter_looking_for_top_talent";

      } else if (lowerCmd === "curl api/status") {
        responseLine.innerHTML = `{<br>&nbsp;&nbsp;"developer": "Vignesh P",<br>&nbsp;&nbsp;"status": "available for hire",<br>&nbsp;&nbsp;"api_p95_latency": "&lt;50ms",<br>&nbsp;&nbsp;"coffee_level": "99%"<br>}`;
        responseLine.style.color = "#ffbd2e";

      } else {
        responseLine.innerHTML = `bash: ${command}: command not found. Type 'help' for available commands.`;
        responseLine.style.color = "#ff5f56";
      }

      terminalBody.insertBefore(responseLine, inputLine);
      terminalInput.value = "";
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  });
}

// =============== ESCAPE KEY MODAL CLOSING ===============
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeArchitectureDrawer();
    document.getElementById("arcadeModal")?.classList.remove("show");
    document.getElementById("cookiePreferencesPanel")?.classList.remove("show");
    window.closeCookieModal?.();
  }
});

// =============== FEED-FORWARD NETWORK CANVAS ===============
const ffCanvas = document.getElementById('ffNetworkCanvas');
if (ffCanvas) {
  const ffCtx = ffCanvas.getContext('2d');
  let ffWidth, ffHeight;

  const layers = [3, 6, 8, 8, 6, 2];
  const layerLabels = ["DATABASE", "CI/CD PIPELINES", "SERVER", "BACKEND & API'S", "CDN & SECURITY", "FRONTEND"];

  let nodes = [];
  let edges = [];
  let activePulses = [];
  let hoveredNode = null;

  function getPulseColor(layerIndex) {
    if (layerIndex === 0 || layerIndex === 1) return "#00e5ff"; 
    if (layerIndex === 2 || layerIndex === 3) return "#1d4ed8"; 
    return "#c084fc"; 
  }

  function getNodeGlowColor(layerIndex, alpha) {
    if (layerIndex <= 1) return `rgba(0, 229, 255, ${alpha})`; 
    if (layerIndex <= 3) return `rgba(29, 78, 216, ${alpha})`; 
    return `rgba(192, 132, 252, ${alpha})`; 
  }

  function resizeCanvas() {
    const containerW = ffCanvas.parentElement.clientWidth;
    const containerH = ffCanvas.parentElement.clientHeight;
    
    ffWidth = Math.max(800, containerW);
    ffHeight = Math.max(450, containerH);
    
    ffCanvas.width = ffWidth;
    ffCanvas.height = ffHeight;
    
    initNetwork();
  }

  window.addEventListener('resize', resizeCanvas);

  function initNetwork() {
    nodes = [];
    edges = [];
    activePulses = [];
    const layerSpacing = ffWidth / (layers.length + 1);
    
    let nodeIdCounter = 0;
    layers.forEach((nodeCount, layerIndex) => {
      const x = layerSpacing * (layerIndex + 1);
      const nodeSpacing = ffHeight / (nodeCount + 1);
      for (let i = 0; i < nodeCount; i++) {
        const y = nodeSpacing * (i + 1);
        const offsetX = (Math.random() - 0.5) * 8;
        const offsetY = (Math.random() - 0.5) * 8;
        nodes.push({
          id: nodeIdCounter++,
          x: x + offsetX,
          y: y + offsetY,
          layer: layerIndex,
          activationGlow: 0,
          radius: 4.2
        });
      }
    });

    for (let i = 0; i < layers.length - 1; i++) {
      const currentLayerNodes = nodes.filter(n => n.layer === i);
      const nextLayerNodes = nodes.filter(n => n.layer === i + 1);
      
      currentLayerNodes.forEach(n1 => {
        nextLayerNodes.forEach(n2 => {
          edges.push({ 
            start: n1, 
            end: n2, 
            layerIndex: i,
            particleProgress: Math.random(), 
            speed: 0.0035 + Math.random() * 0.0045 
          });
        });
      });
    }
  }

  function triggerForwardPass(startNode, intensity = 6) {
    startNode.activationGlow = 1.0;
    const outgoingEdges = edges.filter(e => e.start.id === startNode.id);
    if (outgoingEdges.length === 0) return;

    const count = Math.min(outgoingEdges.length, intensity);
    const chosen = outgoingEdges.sort(() => 0.5 - Math.random()).slice(0, count);

    chosen.forEach(edge => {
      activePulses.push({
        edge: edge,
        progress: 0,
        speed: 0.035 + Math.random() * 0.012,
        color: getPulseColor(edge.layerIndex)
      });
    });
  }

  function getCanvasCoords(event) {
    const rect = ffCanvas.getBoundingClientRect();
    const scaleX = ffCanvas.width / rect.width;
    const scaleY = ffCanvas.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  }

  ffCanvas.addEventListener('mousemove', (e) => {
    const coords = getCanvasCoords(e);
    let found = null;
    for (let n of nodes) {
      if (Math.hypot(n.x - coords.x, n.y - coords.y) <= 15) {
        found = n;
        break;
      }
    }
    hoveredNode = found;
    ffCanvas.style.cursor = hoveredNode ? "pointer" : "default";
  });

  ffCanvas.addEventListener('mouseleave', () => {
    hoveredNode = null;
  });

  ffCanvas.addEventListener('click', (e) => {
    if (hoveredNode) {
      triggerForwardPass(hoveredNode, 6);
    } else {
      const coords = getCanvasCoords(e);
      if (coords.x < ffWidth * 0.35) {
        const targetNodes = nodes.filter(n => n.layer === 0 || n.layer === 1);
        targetNodes.forEach(n => triggerForwardPass(n, 4));
      }
    }
  });

  function animateNetwork() {
    ffCtx.clearRect(0, 0, ffWidth, ffHeight);
    const isDark = document.body.classList.contains("dark-mode");

    edges.forEach(edge => {
      ffCtx.beginPath();
      ffCtx.moveTo(edge.start.x, edge.start.y);
      ffCtx.lineTo(edge.end.x, edge.end.y);
      ffCtx.strokeStyle = isDark ? "rgba(200, 210, 225, 0.25)" : "rgba(0, 0, 0, 0.08)"; 
      ffCtx.lineWidth = 0.8;
      ffCtx.stroke();

      edge.particleProgress += edge.speed;
      if (edge.particleProgress > 1) edge.particleProgress = 0; 

      const dotX = edge.start.x + (edge.end.x - edge.start.x) * edge.particleProgress;
      const dotY = edge.start.y + (edge.end.y - edge.start.y) * edge.particleProgress;
      
      ffCtx.beginPath();
      ffCtx.arc(dotX, dotY, 1.4, 0, Math.PI * 2);
      ffCtx.fillStyle = isDark ? "#e2e8f0" : "#cbd5e1"; 
      ffCtx.fill();
    });

    for (let i = activePulses.length - 1; i >= 0; i--) {
      const pulse = activePulses[i];
      pulse.progress += pulse.speed;

      const sx = pulse.edge.start.x;
      const sy = pulse.edge.start.y;
      const ex = pulse.edge.end.x;
      const ey = pulse.edge.end.y;

      const px = sx + (ex - sx) * pulse.progress;
      const py = sy + (ey - sy) * pulse.progress;

      const tailFraction = 0.38;
      const tx = sx + (ex - sx) * Math.max(0, pulse.progress - tailFraction);
      const ty = sy + (ey - sy) * Math.max(0, pulse.progress - tailFraction);

      ffCtx.beginPath();
      ffCtx.moveTo(tx, ty);
      ffCtx.lineTo(px, py);
      ffCtx.strokeStyle = pulse.color;
      ffCtx.lineWidth = 3.4;
      ffCtx.globalAlpha = 0.35;
      ffCtx.stroke();

      ffCtx.beginPath();
      ffCtx.moveTo(tx, ty);
      ffCtx.lineTo(px, py);
      ffCtx.strokeStyle = pulse.color;
      ffCtx.lineWidth = 1.8;
      ffCtx.globalAlpha = 1.0;
      ffCtx.stroke();

      ffCtx.beginPath();
      ffCtx.arc(px, py, 3.2, 0, Math.PI * 2);
      ffCtx.fillStyle = "#ffffff";
      ffCtx.fill();

      if (pulse.progress >= 1) {
        pulse.edge.end.activationGlow = 1.0;
        
        if (pulse.edge.end.layer < layers.length - 1 && activePulses.length < 120) {
          const nextEdges = edges.filter(e => e.start.id === pulse.edge.end.id);
          if (nextEdges.length > 0) {
            const branchCount = Math.min(nextEdges.length, Math.floor(Math.random() * 2) + 2);
            const nextChosen = nextEdges.sort(() => 0.5 - Math.random()).slice(0, branchCount);

            nextChosen.forEach(nEdge => {
              activePulses.push({
                edge: nEdge,
                progress: 0,
                speed: 0.035 + Math.random() * 0.01,
                color: getPulseColor(nEdge.layerIndex)
              });
            });
          }
        }
        activePulses.splice(i, 1);
      }
    }

    ffCtx.globalAlpha = 1.0;

    nodes.forEach(node => {
      if (node.activationGlow > 0.02) {
        ffCtx.beginPath();
        ffCtx.arc(node.x, node.y, node.radius + 6 * node.activationGlow, 0, Math.PI * 2);
        ffCtx.fillStyle = getNodeGlowColor(node.layer, node.activationGlow * 0.45);
        ffCtx.fill();
        node.activationGlow *= 0.94;
      }

      if (hoveredNode && hoveredNode.id === node.id) {
        ffCtx.beginPath();
        ffCtx.arc(node.x, node.y, node.radius + 4.5, 0, Math.PI * 2);
        ffCtx.strokeStyle = "#38bdf8";
        ffCtx.lineWidth = 1.8;
        ffCtx.stroke();
      }

      ffCtx.beginPath();
      ffCtx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ffCtx.fillStyle = isDark ? "#ffffff" : "#000000";
      ffCtx.fill();
    });

    ffCtx.font = "600 11.5px 'Inter', sans-serif";
    ffCtx.fillStyle = isDark ? "#cbd5e1" : "#475569";
    ffCtx.textAlign = "center";
    
    layers.forEach((nodeCount, layerIndex) => {
      const x = (ffWidth / (layers.length + 1)) * (layerIndex + 1);
      let textY = (ffHeight / (nodeCount + 1)) - 22; 
      textY = Math.max(15, textY); 
      ffCtx.fillText(layerLabels[layerIndex], x, textY);
    });

    requestAnimationFrame(animateNetwork);
  }

  resizeCanvas();
  animateNetwork();
}

// =============== ARCHITECTURE DRAWER (CYTOSCAPE TOPOLOGY & SIMULATOR) ===============
const architectureRegistry = {
  "exotic-hub": {
    title: "EXOTIC GB HUB | Architecture",
    technologies: ["Firebase Auth", "Firestore DB", "Vanilla JavaScript", "HTML5 & CSS3", "WhatsApp API", "Netlify"],
    graphData: [
      { data: { id: 'client', label: 'Client UI' } },
      { data: { id: 'cdn', label: 'Netlify Edge' } },
      { data: { id: 'auth', label: 'Firebase Auth' } },
      { data: { id: 'db', label: 'Firestore DB' } },
      { data: { id: 'order', label: 'Cart Engine' } },
      { data: { id: 'wa', label: 'WhatsApp API' } },
      { data: { id: 'e1', source: 'client', target: 'cdn' } },
      { data: { id: 'e2', source: 'cdn', target: 'auth' } },
      { data: { id: 'e3', source: 'auth', target: 'db' } },
      { data: { id: 'e4', source: 'db', target: 'order' } },
      { data: { id: 'e5', source: 'order', target: 'wa' } }
    ],
    tradeoffs: [
      { heading: "Why Firebase over Custom Backend", desc: "Opted for Google Firebase to eliminate cold-start container delays and manage zero-cost database persistence for an exotic aquarium catalog." },
      { heading: "WhatsApp Direct Ordering vs. Payment Gateway", desc: "Bypassed standard merchant payment processors to avoid drop-off in niche regional buyers." }
    ],
    routes: [
      { method: "GET", path: "/api/products/catalog", desc: "Realtime dynamic catalog fetching" },
      { method: "POST", path: "/auth/firebase-handshake", desc: "Client JWT token verification" }
    ],
    github: "https://github.com/vignesh1-1",
    live: "https://nandantechhub.github.io/EXOTIC-GB-HUB-PRO/"
  },
  "g-plus": {
    title: "G+ Bengaluru | Architecture",
    technologies: ["FastAPI", "Python 3", "GIS & Maps", "Gemini 1.5 API", "Spatial Postgres", "Leaflet.js"],
    graphData: [
      { data: { id: 'ui', label: 'Leaflet GIS UI' } },
      { data: { id: 'ingress', label: 'NGINX Ingress' } },
      { data: { id: 'api', label: 'FastAPI Async' } },
      { data: { id: 'llm', label: 'Gemini 1.5 LLM' } },
      { data: { id: 'db', label: 'Spatial Postgres' } },
      { data: { id: 'dispatch', label: 'Civic Dispatch' } },
      { data: { id: 'e1', source: 'ui', target: 'ingress' } },
      { data: { id: 'e2', source: 'ingress', target: 'api' } },
      { data: { id: 'e3', source: 'api', target: 'llm' } },
      { data: { id: 'e4', source: 'llm', target: 'db' } },
      { data: { id: 'e5', source: 'db', target: 'dispatch' } }
    ],
    tradeoffs: [
      { heading: "Asynchronous Python FastAPI Core", desc: "FastAPI with ASGI non-blocking event loops was selected over Django to stream high-density GeoJSON geospatial vectors with sub-20ms latency." },
      { heading: "Gemini 1.5 AI Query Triage", desc: "Offloaded citizen grievance routing to Google Gemini API, transforming unstructured complaint texts into categorized SQL spatial tags." }
    ],
    routes: [
      { method: "GET", path: "/api/v1/gis/wards", desc: "Stream municipal polygon boundaries" },
      { method: "POST", path: "/api/v1/grievance/ai-triage", desc: "LLM semantic sentiment and ticket dispatch" }
    ],
    github: "https://github.com/vignesh1-1",
    live: "https://joyful-sprite-4cc486.netlify.app"
  },
  "bits-radar": {
    title: "BITS RADAR | Architecture",
    technologies: ["Python", "Flask", "MySQL", "SQLite", "REST API", "Chart.JS", "Bootstrap 5", "Render"],
    graphData: [
      { data: { id: 'ui', label: 'Bootstrap UI' } },
      { data: { id: 'ingress', label: 'Render Gateway' } },
      { data: { id: 'api', label: 'Flask REST Core' } },
      { data: { id: 'rbac', label: 'RBAC Guard' } },
      { data: { id: 'db', label: 'SQLite / MySQL' } },
      { data: { id: 'audit', label: 'Audit & Telemetry' } },
      { data: { id: 'e1', source: 'ui', target: 'ingress' } },
      { data: { id: 'e2', source: 'ingress', target: 'api' } },
      { data: { id: 'e3', source: 'api', target: 'rbac' } },
      { data: { id: 'e4', source: 'rbac', target: 'db' } },
      { data: { id: 'e5', source: 'db', target: 'audit' } }
    ],
    tradeoffs: [
      { heading: "Why Python/Flask + SQLite / MySQL was chosen", desc: "For an agile bug and issue tracking system, Flask's lightweight micro-framework architecture eliminates redundant overhead found in heavier frameworks like Django." },
      { heading: "RBAC & Client Auditing Strategy", desc: "Session middleware enforces role-based endpoint permissions (Admin vs QA Engineer), preventing ticket manipulation while recording atomic audit trails." }
    ],
    routes: [
      { method: "GET", path: "/api/tickets/summary", desc: "Aggregate ticket metrics for Chart.js" },
      { method: "POST", path: "/api/tickets/create", desc: "Atomic ticket creation with audit log" },
      { method: "PATCH", path: "/api/tickets/bulk-update", desc: "Batch update ticket status" }
    ],
    github: "https://github.com/vignesh1-1",
    live: "https://bits-radar.onrender.com/"
  },
  "passport": {
    title: "Passport Automation System | Architecture",
    technologies: ["PHP 8", "MySQL", "Bootstrap", "Apache / XAMPP", "Admin Control Panel"],
    graphData: [
      { data: { id: 'ui', label: 'Citizen Portal' } },
      { data: { id: 'apache', label: 'Apache Gateway' } },
      { data: { id: 'php', label: 'PHP 8 Core' } },
      { data: { id: 'state', label: 'State Validator' } },
      { data: { id: 'sql', label: 'Prepared SQL' } },
      { data: { id: 'db', label: 'MySQL Database' } },
      { data: { id: 'e1', source: 'ui', target: 'apache' } },
      { data: { id: 'e2', source: 'apache', target: 'php' } },
      { data: { id: 'e3', source: 'php', target: 'state' } },
      { data: { id: 'e4', source: 'state', target: 'sql' } },
      { data: { id: 'e5', source: 'sql', target: 'db' } }
    ],
    tradeoffs: [
      { heading: "Prepared Statements for Citizen Data Protection", desc: "Implemented strict parameterized SQL queries across all verification routes to prevent SQL injection during citizen identity document verification." },
      { heading: "State-Machine Flow Validation", desc: "Enforced non-reversible progression steps guarded by server-side verification tokens." }
    ],
    routes: [
      { method: "POST", path: "/passport/apply.php", desc: "Multi-part document upload processing" },
      { method: "GET", path: "/passport/track.php", desc: "Citizen verification stage lookup" }
    ],
    github: "https://github.com/vignesh1-1",
    live: "#"
  }
};

const archDrawer = document.getElementById("archDrawer");
const archOverlay = document.getElementById("archDrawerOverlay");
const archCloseBtn = document.getElementById("archDrawerClose");
let cytoscapeInstance = null;

function renderCytoscape(graphData) {
  const container = document.getElementById("archDiagramContainer");
  if (!container) return;
  if (cytoscapeInstance) cytoscapeInstance.destroy();
  
  container.style.backgroundColor = '#000000';
  container.style.borderColor = '#ffffff';

  const serpentineCoords = [
    { x: 100, y: 55 },
    { x: 340, y: 55 },
    { x: 340, y: 155 },
    { x: 100, y: 155 },
    { x: 100, y: 255 },
    { x: 340, y: 255 }
  ];

  let nodeIndex = 0;
  const positionedElements = graphData.map(el => {
    if (!el.data.source) {
      const coord = serpentineCoords[nodeIndex] || { x: 100, y: 50 + nodeIndex * 40 };
      nodeIndex++;
      return {
        ...el,
        position: { x: coord.x, y: coord.y }
      };
    }
    return el;
  });

  cytoscapeInstance = cytoscape({
    container: container,
    elements: positionedElements,
    boxSelectionEnabled: false,
    autoungrabify: false,
    style: [
      {
        selector: 'node',
        style: {
          'background-color': '#000000',
          'label': 'data(label)',
          'color': '#ffffff',
          'text-valign': 'center',
          'text-halign': 'center',
          'font-size': '12.5px',
          'font-family': 'Space Grotesk, Inter, sans-serif',
          'font-weight': '700',
          'width': '145px',
          'height': '44px',
          'shape': 'round-rectangle',
          'border-width': 1.8,
          'border-color': '#ffffff',
          'text-max-width': '130px',
          'text-wrap': 'wrap'
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 2.2,
          'line-color': '#71717a',
          'target-arrow-color': '#ffffff',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
          'arrow-scale': 1.1
        }
      },
      {
        selector: 'node.packet',
        style: {
          'width': 12,
          'height': 12,
          'background-color': '#ffffff',
          'border-width': 2,
          'border-color': '#cbd5e1',
          'shape': 'ellipse',
          'label': '',
          'z-index': 9999,
          'shadow-blur': 16,
          'shadow-color': '#ffffff',
          'shadow-opacity': 1.0
        }
      }
    ],
    layout: {
      name: 'preset',
      padding: 24,
      fit: true
    }
  });

  cytoscapeInstance.ready(() => {
    cytoscapeInstance.resize();
    cytoscapeInstance.fit(undefined, 24);
  });
}

function simulatePacketHops() {
  if (!cytoscapeInstance) return;
  
  cytoscapeInstance.nodes('.packet').remove();
  
  const edges = cytoscapeInstance.edges();
  if (edges.length === 0) return;

  edges.forEach((edge, i) => {
    setTimeout(() => {
      if (!cytoscapeInstance) return;
      const srcPos = edge.source().position();
      const tgtPos = edge.target().position();
      
      const packet = cytoscapeInstance.add({
        group: 'nodes',
        classes: 'packet',
        position: { x: srcPos.x, y: srcPos.y }
      });
      
      packet.animate({
        position: { x: tgtPos.x, y: tgtPos.y },
        duration: 420,
        easing: 'ease-in-out'
      }).promise().then(() => {
        try {
          if (cytoscapeInstance && cytoscapeInstance.hasElementWithId(packet.id())) {
            cytoscapeInstance.remove(packet);
          }
        } catch (e) {}
      });

      setTimeout(() => {
        try {
          if (cytoscapeInstance && cytoscapeInstance.hasElementWithId(packet.id())) {
            cytoscapeInstance.remove(packet);
          }
        } catch (err) {}
      }, 550);

    }, i * 280); 
  });
}

const simBtn = document.getElementById('simulatePacketBtn');
if (simBtn) {
  simBtn.addEventListener('click', simulatePacketHops);
}

function openArchitectureDrawer(projectId) {
  const data = architectureRegistry[projectId];
  if (!data || !archDrawer) return;

  const titleEl = document.getElementById("archDrawerTitle");
  if (titleEl) titleEl.textContent = data.title;
  
  const techContainer = document.getElementById("archTechContainer");
  if (techContainer) {
    techContainer.innerHTML = data.technologies.map(t => `<span class="stack-tag">${t}</span>`).join('');
  }

  const tradeoffsContainer = document.getElementById("archTradeoffsContainer");
  if (tradeoffsContainer) {
    tradeoffsContainer.innerHTML = data.tradeoffs.map(t => `
      <div class="tradeoff-item">
        <h5>${t.heading}</h5>
        <p>${t.desc}</p>
      </div>
    `).join('');
  }

  const routesContainer = document.getElementById("archRoutesContainer");
  if (routesContainer) {
    routesContainer.innerHTML = data.routes.map(r => `
      <div class="arch-route-badge">
        <span class="arch-method ${r.method.toLowerCase()}">${r.method}</span>
        <span class="arch-path">${r.path}</span>
        <span class="arch-desc">${r.desc}</span>
      </div>
    `).join('');
  }

  const ghLink = document.getElementById("archGithubLink");
  const liveLink = document.getElementById("archLiveLink");
  if (ghLink) ghLink.href = data.github;
  if (liveLink) liveLink.href = data.live;

  archDrawer.classList.add("active");
  archOverlay?.classList.add("active");
  archDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  setTimeout(() => {
    renderCytoscape(data.graphData);
  }, 250);
}

function closeArchitectureDrawer() {
  if (!archDrawer) return;
  archDrawer.classList.remove("active");
  archOverlay?.classList.remove("active");
  archDrawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (cytoscapeInstance) {
    cytoscapeInstance.nodes('.packet').remove();
    cytoscapeInstance.destroy();
    cytoscapeInstance = null;
  }
}

document.querySelectorAll(".inspect-arch-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const projectId = btn.getAttribute("data-project");
    openArchitectureDrawer(projectId);
  });
});

if (archCloseBtn) archCloseBtn.addEventListener("click", closeArchitectureDrawer);
if (archOverlay) archOverlay.addEventListener("click", closeArchitectureDrawer);

// =============== CUSTOM SCROLLBAR FOR CHAT ===============
const chatContent = document.getElementById('chatScrollContent');
const trackWrap = document.querySelector('.scrollbar-track-wrap');
const trackBody = document.getElementById('trackBody');
const thumb = document.getElementById('scrollThumb');
const upBtn = document.getElementById('scrollUpBtn');
const downBtn = document.getElementById('scrollDownBtn');

let isDragging = false;
let startY = 0;
let startScrollTop = 0;
const SCROLL_STEP = 50;

function updateScrollbar() {
  if (!chatContent || !trackBody || !thumb || !trackWrap) return;
  const scrollHeight = chatContent.scrollHeight;
  const clientHeight = chatContent.clientHeight;
  const scrollTop = chatContent.scrollTop;
  const trackHeight = trackBody.clientHeight;

  const maxScroll = scrollHeight - clientHeight;
  
  if (maxScroll <= 0) {
    trackWrap.style.display = 'none';
    chatContent.style.paddingRight = '20px';
    return;
  }
  
  trackWrap.style.display = 'flex';
  chatContent.style.paddingRight = '32px';

  let thumbHeight = Math.max((clientHeight / scrollHeight) * trackHeight, 30);
  const maxThumbTop = trackHeight - thumbHeight;
  const thumbTop = (scrollTop / maxScroll) * maxThumbTop;

  thumb.style.height = `${thumbHeight}px`;
  thumb.style.top = `${thumbTop}px`;
}

if (chatContent && trackBody && thumb && upBtn && downBtn) {
  chatContent.addEventListener('scroll', updateScrollbar);
  upBtn.addEventListener('click', () => { chatContent.scrollTop -= SCROLL_STEP; });
  downBtn.addEventListener('click', () => { chatContent.scrollTop += SCROLL_STEP; });

  thumb.addEventListener('mousedown', (e) => {
    isDragging = true;
    startY = e.clientY;
    startScrollTop = chatContent.scrollTop;
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startY;
    const trackHeight = trackBody.clientHeight;
    const thumbHeight = thumb.clientHeight;
    const maxScroll = chatContent.scrollHeight - chatContent.clientHeight;
    const maxThumbTop = trackHeight - thumbHeight;

    if (maxThumbTop > 0) {
      const scrollDelta = (deltaY / maxThumbTop) * maxScroll;
      chatContent.scrollTop = startScrollTop + scrollDelta;
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      document.body.style.userSelect = '';
    }
  });

  window.addEventListener('resize', updateScrollbar);
  const observerScroll = new MutationObserver(updateScrollbar);
  observerScroll.observe(chatContent, { childList: true, subtree: true });
  updateScrollbar();
}

// Custom Cursor Copy Logic
document.addEventListener('mousedown', () => { document.body.classList.add('is-copying'); });
document.addEventListener('mouseup', () => { document.body.classList.remove('is-copying'); });