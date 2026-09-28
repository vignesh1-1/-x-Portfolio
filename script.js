lucide.createIcons();

// =============== LOGO CLICK EASTER EGG ===============
const navLogo = document.querySelector('.logo img');
let logoClicks = 0;
let logoClickTimer;

if (navLogo) {
    navLogo.addEventListener('click', (e) => {
        e.preventDefault(); 
        logoClicks++;
        
        if (logoClicks === 5) {
            triggerArcadeRedirect();
            logoClicks = 0; 
        }
        
        clearTimeout(logoClickTimer);
        logoClickTimer = setTimeout(() => {
            logoClicks = 0;
        }, 2000);
    });
}

function triggerArcadeRedirect() {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) overlay.classList.add("active");
    setTimeout(() => {
        window.location.href = 'game.html';
    }, 400); 
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
    const scrolled = (winScroll / height) * 100;
    const scrollBar = document.getElementById('scrollBar');
    if (scrollBar) {
        scrollBar.style.width = scrolled + "%";
    }
});

// =============== FLOATING BUTTONS LOGIC ===============
const scrollTopBtn = document.getElementById("scrollTopBtn");
const aiNavBtn = document.getElementById("aiNavBtn");
const aiSection = document.getElementById("ai-assistant");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  
  if (scrollY > 500) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }

  if (aiSection) {
    const aiRect = aiSection.getBoundingClientRect();
    if (aiRect.top < window.innerHeight * 0.7 && aiRect.bottom > window.innerHeight * 0.3) {
      aiNavBtn.classList.remove("show");
    } else {
      aiNavBtn.classList.add("show");
    }
  } else {
      aiNavBtn.classList.add("show");
  }
});

window.dispatchEvent(new Event('scroll'));

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

aiNavBtn.addEventListener("click", () => {
  if (aiSection) {
    aiSection.scrollIntoView({ behavior: "smooth" });
  }
});

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
    const timeoutId = setTimeout(() => controller.abort(), 700);
    
    const localRes = await fetch(`${LOCAL_API_URL}/`, {
      method: "GET",
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (localRes.ok) {
      ACTIVE_API_URL = LOCAL_API_URL;
      return ACTIVE_API_URL;
    }
  } catch (err) {
    // Localhost unavailable, fallback to Render
  }

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
      setTimeout(typeEffect, 400);
      revealElements.forEach(el => revealObserver.observe(el));
      initPointsPopup();
    }, 450);
  } else {
    document.body.classList.add("loaded");
    setTimeout(typeEffect, 400);
    revealElements.forEach(el => revealObserver.observe(el));
    initPointsPopup();
  }

  wakeUpBackend();
});

// ==========================================
// SNAPPY LINK CLICK TRANSITIONS
// ==========================================
document.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", function(e) {
    const target = this.getAttribute("href");
    if (!target || target === "#" || target.startsWith("#") || target.startsWith("mailto:") || target.startsWith("tel:") || this.hasAttribute('onclick')) {
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
    }, 350);
  });
});

// Active Link Observer
const sections = document.querySelectorAll("section");
const navLinksList = document.querySelectorAll("nav a");
const observerOptions = { root: null, rootMargin: "-20% 0px -60% 0px", threshold: 0 }; 

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinksList.forEach((link) => link.classList.remove("active"));
      const activeLink = document.querySelector(`nav a[href="#${entry.target.id}"]`);
      if (activeLink) activeLink.classList.add("active");
    }
  });
}, observerOptions);

sections.forEach((section) => observer.observe(section));

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
      this.vx = (Math.random() - 0.5) * (isMobile ? 0.4 : 0.7);
      this.vy = (Math.random() - 0.5) * (isMobile ? 0.4 : 0.7);
      this.size = 2;
    }
    move() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > bgCanvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > bgCanvas.height) this.vy *= -1;
    }
    draw() {
      bgCtx.beginPath();
      bgCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      bgCtx.fillStyle = "#000000";
      bgCtx.fill();
    }
  }

  for (let i = 0; i < count; i++) {
    netParticles.push(new BgParticle());
  }

  function connectParticles() {
    for (let a = 0; a < netParticles.length; a++) {
      for (let b = a + 1; b < netParticles.length; b++) {
        const dx = netParticles[a].x - netParticles[b].x;
        const dy = netParticles[a].y - netParticles[b].y;
        const distance = dx * dx + dy * dy;
        if (distance < maxDistSq) {
          bgCtx.beginPath();
          bgCtx.strokeStyle = "rgba(0,0,0,0.12)";
          bgCtx.lineWidth = 1;
          bgCtx.moveTo(netParticles[a].x, netParticles[a].y);
          bgCtx.lineTo(netParticles[b].x, netParticles[b].y);
          bgCtx.stroke();
        }
      }
    }
  }

  function renderLoop() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    netParticles.forEach(p => { p.move(); p.draw(); });
    connectParticles();
    requestAnimationFrame(renderLoop);
  }
  renderLoop();

  window.addEventListener("resize", () => {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
  });
})();

// Popups
function showPopup(event) {
  event.preventDefault();
  const popup = document.getElementById("glass-popup");
  if (popup) {
    popup.classList.add("show");
    setTimeout(() => { popup.classList.remove("show"); }, 4000);
  }
}

function showLivePopup(event) {
  event.preventDefault();
  let popup = document.getElementById("livePopup");
  if (popup) {
    popup.classList.add("show");
    setTimeout(() => { popup.classList.remove("show"); }, 5000);
  }
}

function showPopupp(event, popupId) {
  event.preventDefault();
  let popup = document.getElementById(popupId);
  if (popup) {
    popup.classList.add("show");
    setTimeout(() => { popup.classList.remove("show"); }, 5000);
  }
}

// =============== PROCESS CARDS LOGIC ===============
const processData = {
  planning: {
    title: "Discover",
    icon: '<i class="fa-solid fa-compass"></i>',
    desc: "The foundation of any robust AI system. Here, I define the scope, identify the core problem the AI needs to solve, and establish clear technical requirements before writing any code.",
    list: [
      "Define project scope and business objectives.",
      "Identify the best AI models and frameworks for the use case.",
      "Assess technical feasibility and timeline constraints."
    ]
  },
  analysis: {
    title: "Analyze",
    icon: '<i class="fa-solid fa-chart-line"></i>',
    desc: "AI is only as good as the data it processes. During analysis, I collect necessary data, perform exploratory research, and decide on the metrics for success.",
    list: [
      "Data collection and system integrations mapping.",
      "Exploratory data analysis and formatting.",
      "Defining evaluation metrics (e.g., accuracy, latency)."
    ]
  },
  designing: {
    title: "Engineer",
    icon: '<i class="fa-solid fa-microchip"></i>',
    desc: "Drafting the blueprint. This involves mapping out the complete system architecture, choosing databases, and designing how the frontend, backend, and AI models communicate.",
    list: [
      "System architecture and API endpoint design.",
      "Database schema structuring (e.g., Vector DBs).",
      "Prompt engineering structures and UI wireframing."
    ]
  },
  testing: {
    title: "Prototype",
    icon: '<i class="fa-solid fa-vial"></i>',
    desc: "Ensuring the AI behaves consistently and safely. Testing includes evaluating edge cases, checking model hallucinations, and stress-testing the servers.",
    list: [
      "Model evaluation against baseline metrics.",
      "Unit testing API endpoints and database queries.",
      "User Acceptance Testing (UAT) and load testing."
    ]
  },
  deployment: {
    title: "Launch",
    icon: '<i class="fa-solid fa-rocket"></i>',
    desc: "Taking the system live. We containerize the application, set up cloud environments, and establish secure endpoints for users to interact with the model.",
    list: [
      "Containerizing applications using Docker.",
      "Deploying secure APIs (FastAPI/Flask) to cloud servers.",
      "Setting up CI/CD pipelines for automated updates."
    ]
  },
  maintainance: {
    title: "Maintain",
    icon: '<i class="fa-solid fa-brain"></i>',
    desc: "AI requires continuous oversight. I monitor system health, check for model drift, and scale infrastructure as the user base grows.",
    list: [
      "Monitoring API latency and server health.",
      "Tracking model performance and mitigating drift.",
      "Scaling infrastructure and regular database backups."
    ]
  }
};

const processCards = document.querySelectorAll('.process-card');
const emptyState = document.getElementById('process-empty');
const processContentView = document.getElementById('process-content');
const processQuoteView = document.getElementById('process-quote');
const processIcon = document.getElementById('process-icon');
const processTitle = document.getElementById('process-title');
const processDesc = document.getElementById('process-desc');
const processList = document.getElementById('process-list');

processCards.forEach(card => {
  card.addEventListener('click', () => {
    processCards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');

    const phase = card.getAttribute('data-phase');

    if (phase === 'quote') {
      emptyState.style.display = 'none';
      processContentView.classList.remove('visible');
      processQuoteView.classList.remove('visible');
      void processQuoteView.offsetWidth;
      processQuoteView.classList.add('visible');
    } else {
      const data = processData[phase];

      processIcon.innerHTML = data.icon;
      processTitle.textContent = data.title;
      processDesc.textContent = data.desc;
      processList.innerHTML = data.list.map(item => `<li>${item}</li>`).join('');

      emptyState.style.display = 'none';
      processQuoteView.classList.remove('visible');
      processContentView.classList.remove('visible');
      void processContentView.offsetWidth;
      processContentView.classList.add('visible');
    }
  });
});

// =============== TOOLBOX INFINITE SCROLLER ===============
const scrollers = document.querySelectorAll(".scroller");
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  scrollers.forEach((scroller) => {
    scroller.setAttribute("data-animated", true);
    const scrollerInner = scroller.querySelector(".scroller__inner");
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

// =============== TYPING SOUND CONTROLLER & HOME EFFECT ===============
const typingWords = ["AI that ships software products.", "reliable backend API's.", "LLM powered products."];
let typingIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingTextElement = document.querySelector(".typing-text");

const keySound = new Audio("audiomass-output.mp3"); 
keySound.volume = 0.5;

let audioUnlocked = false;
let isAudioEnabled = true; 
let typingSoundTimer = null;
let lastTypingTime = 0;

function playTypingSound() {
  if (!isAudioEnabled) return;
  const now = performance.now();
  if (now - lastTypingTime < 30) return;
  lastTypingTime = now;

  clearTimeout(typingSoundTimer);
  try { keySound.currentTime = 0; } catch (e) {}

  keySound.play().then(() => {
    audioUnlocked = true;
  }).catch(() => {});

  typingSoundTimer = setTimeout(() => {
    keySound.pause();
    try { keySound.currentTime = 0; } catch (e) {}
  }, 140);
}

const audioToggleBtn = document.getElementById("audioToggleBtn");
if (audioToggleBtn) {
  audioToggleBtn.addEventListener("click", () => {
    isAudioEnabled = !isAudioEnabled;
    const icon = audioToggleBtn.querySelector("i");
    if (isAudioEnabled) {
      icon.classList.remove("fa-volume-mute");
      icon.classList.add("fa-volume-up");
    } else {
      icon.classList.remove("fa-volume-up");
      icon.classList.add("fa-volume-mute");
      if (!keySound.paused) {
        keySound.pause();
        keySound.currentTime = 0;
      }
    }
  });
}

['click', 'touchstart', 'keydown'].forEach(eventType => {
    document.body.addEventListener(eventType, () => {
        if (!audioUnlocked) {
            keySound.play().then(() => {
                keySound.pause(); 
                keySound.currentTime = 0;
                audioUnlocked = true;
            }).catch(() => {});
        }
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

    let typingSpeed = isDeleting ? 40 : 100;
    if (!isDeleting && pauseIndices.includes(charIndex)) {
        typingSpeed += 250; 
    }

    if (!isDeleting && charIndex === currentWord.length) {
        typingSpeed = 2000; 
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        typingIndex = (typingIndex + 1) % typingWords.length;
        typingSpeed = 500; 
        pauseIndices = []; 
    }

    setTimeout(typeEffect, typingSpeed);
}

// =============== SCROLL REVEAL ANIMATIONS ===============
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); 
        }
    });
}, { threshold: 0.1 }); 

// =============== NUMBER COUNTER ANIMATION ===============
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = +counter.getAttribute('data-target');
            const suffix = counter.getAttribute('data-suffix') || '';
            const prefix = counter.getAttribute('data-prefix') || '';
            const duration = 2000; 
            
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
}, { threshold: 0.5 }); 

counters.forEach(counter => counterObserver.observe(counter));

// ==============================================================
// ACCURATE AI ASSISTANT LOGIC (DYNAMIC SCORE BINDING)
// ==============================================================
const chatInputArea = document.querySelector('.chat-input-area textarea');
const sendButton = document.querySelector('.send-btn');
const chatWin = document.getElementById('chatScrollContent');
const chatErrorBanner = document.getElementById('chatError');
const quickPrompts = document.querySelectorAll('.sq-btn');
const apiBadge = document.getElementById('apiBadge');

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
    chatInputArea.value = btn.textContent.trim();
    chatInputArea.focus();
  });
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function sendChatMessage() {
  const message = chatInputArea.value.trim();
  if (!message) return;

  chatErrorBanner.style.display = 'none';

  const userMsg = document.createElement('div');
  userMsg.className = 'chat-message user';
  userMsg.textContent = message;
  chatWin.appendChild(userMsg);

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
    }, 1200);
    return; 
  }

  const botMsg = document.createElement('div');
  botMsg.className = 'chat-message bot';
  botMsg.textContent = 'Thinking...';
  chatWin.appendChild(botMsg);
  chatWin.scrollTop = chatWin.scrollHeight;

  const faceText = document.getElementById('faceText');
  faceText.textContent = '🤔';

  const startTime = performance.now();

  try {
    const activeNav = document.querySelector('nav a.active');
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

    apiBadge.className = 'api-badge success';
    const isLocal = targetUrl.includes("127.0.0.1") || targetUrl.includes("localhost");
    apiBadge.innerHTML = isLocal 
      ? '<i class="fa-solid fa-check"></i> LOCALHOST ACTIVE' 
      : '<i class="fa-solid fa-check"></i> API ACTIVE';

    botMsg.textContent = ''; 
    for (let i = 0; i < replyText.length; i++) {
      botMsg.textContent += replyText.charAt(i);
      chatWin.scrollTop = chatWin.scrollHeight;
      await sleep(12); 
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

    faceText.textContent = '◕⁠‿⁠◕';
    showNextNotification();
    
  } catch (error) {
    botMsg.remove(); 
    chatErrorBanner.style.display = 'block'; 
    chatErrorBanner.textContent = 'Failed to fetch API';
    apiBadge.className = 'api-badge error';
    apiBadge.innerHTML = '<i class="fa-solid fa-xmark"></i> ERROR FETCHING API';
    faceText.textContent = 'x_x';
  }
  
  chatWin.scrollTop = chatWin.scrollHeight;
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
    }, 5000);
  }
}

// =============== COOKIES PREFERENCES ===============
document.addEventListener("DOMContentLoaded", () => {
  const cookiePanel = document.getElementById("cookiePreferencesPanel");
  const btnAcceptAll = document.getElementById("btn-accept-all");
  const btnAcceptNecessary = document.getElementById("btn-accept-necessary");
  const aiToggle = document.getElementById("cookie-ai");

  setTimeout(() => {
    if (cookiePanel) cookiePanel.classList.add("show");
  }, 2000); 

  window.openCookieModal = function(title, description) {
    document.getElementById("cookieInfoTitle").innerText = title;
    document.getElementById("cookieInfoDesc").innerText = description;
    document.getElementById("cookieInfoModal").classList.add("show");
  };

  window.closeCookieModal = function() {
    document.getElementById("cookieInfoModal").classList.remove("show");
  };

  if (btnAcceptAll) {
    btnAcceptAll.addEventListener("click", () => {
      localStorage.setItem("cookieConsent", "all");
      localStorage.setItem("functionalCookies", "true");
      localStorage.setItem("aiCookies", "true");
      if (aiToggle) aiToggle.checked = true;
      if (cookiePanel) cookiePanel.classList.remove("show");
    });
  }

  if (btnAcceptNecessary) {
    btnAcceptNecessary.addEventListener("click", () => {
      localStorage.setItem("cookieConsent", "necessary");
      localStorage.setItem("functionalCookies", "false");
      localStorage.setItem("aiCookies", "false");
      if (aiToggle) aiToggle.checked = false;
      if (cookiePanel) cookiePanel.classList.remove("show");
    });
  }
});

// =============== COMIC POINTS POPUP ===============
function initPointsPopup() {
  const popup = document.getElementById("navPointsPopup");
  const pointsText = document.getElementById("bubblePointsText");
  if (!popup) return;

  let totalScore = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("cyanx_") && (key.includes("best") || key.includes("score"))) {
      const score = parseInt(localStorage.getItem(key), 10) || 0;
      totalScore += score;
    }
  }

  const displayScore = totalScore > 0 ? totalScore.toLocaleString() : "11,235";
  if (pointsText) {
    pointsText.textContent = `Arcade: ${displayScore} pts`;
  }

  popup.addEventListener("click", () => {
    const modal = document.getElementById("arcadeModal");
    if (modal) {
      const modalTotal = document.getElementById("arcadeModalTotal");
      if (modalTotal) modalTotal.textContent = `Total Record: ${displayScore} pts`;
      modal.classList.add("show");
    }
  });

  function popupCycle() {
    popup.classList.add("visible");
    setTimeout(() => {
      popup.classList.remove("visible");
      setTimeout(popupCycle, 10000);
    }, 5000);
  }

  setTimeout(popupCycle, 600);
}

// =============== ADVANCED TERMINAL (v2.4.0) ===============
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
          setTimeout(() => openArchitectureDrawer(proj), 400);
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
          • VSCO: <a href="https://vsco.co/vcenzo1" target="_blank" style="color:#0969da;">vsco.co/vcenzo1</a>
        `;

      } else if (lowerCmd === "resume") {
        responseLine.innerHTML = `<span style="color:#0969da;">> Opening resume view...</span>`;
        window.open('resumeee.html', '_blank');

      } else if (lowerCmd === "quote") {
        responseLine.innerHTML = `<span style="color:#0969da;">"Building dependable software means engineering systems that remain resilient when the unexpected happens."</span><br>— Vignesh P // Engineering Core Philosophy`;
        const quoteBtn = document.querySelector('.card.process-card.quote-card');
        if (quoteBtn) quoteBtn.click();
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });

      } else if (lowerCmd === "matrix") {
        responseLine.innerHTML = `<span style="color:#27c93f;">[SEC-SCAN]: ACCESS GRANTED. OVERRIDE CODE: 0x9924. PROTOCOL VIGNESH-OS INITIALIZED.</span>`;
        terminalBody.style.transition = "background-color 0.4s ease, color 0.4s ease";
        terminalBody.style.backgroundColor = "#021a07";
        terminalBody.style.color = "#39ff14";
        setTimeout(() => {
          terminalBody.style.backgroundColor = "#ffffff";
          terminalBody.style.color = "#24292f";
        }, 1800);

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
          setTimeout(() => sendChatMessage(), 600);
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
            setTimeout(() => termContainer.classList.remove("glitch-shake"), 500);
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
        }, 1200);
      
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
        setTimeout(() => window.location.href = 'rcb.html', 400);

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
    if (layerIndex === 0 || layerIndex === 1) {
      return "#00e5ff"; 
    } else if (layerIndex === 2 || layerIndex === 3) {
      return "#1d4ed8"; 
    } else {
      return "#c084fc"; 
    }
  }

  function getNodeGlowColor(layerIndex, alpha) {
    if (layerIndex <= 1) {
      return `rgba(0, 229, 255, ${alpha})`; 
    } else if (layerIndex <= 3) {
      return `rgba(29, 78, 216, ${alpha})`; 
    } else {
      return `rgba(192, 132, 252, ${alpha})`; 
    }
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
            speed: 0.0025 + Math.random() * 0.0035 
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
        speed: 0.024 + Math.random() * 0.009,
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

    edges.forEach(edge => {
      ffCtx.beginPath();
      ffCtx.moveTo(edge.start.x, edge.start.y);
      ffCtx.lineTo(edge.end.x, edge.end.y);
      ffCtx.strokeStyle = "rgba(0, 0, 0, 0.08)"; 
      ffCtx.lineWidth = 0.8;
      ffCtx.stroke();

      edge.particleProgress += edge.speed;
      if (edge.particleProgress > 1) edge.particleProgress = 0; 

      const dotX = edge.start.x + (edge.end.x - edge.start.x) * edge.particleProgress;
      const dotY = edge.start.y + (edge.end.y - edge.start.y) * edge.particleProgress;
      
      ffCtx.beginPath();
      ffCtx.arc(dotX, dotY, 1.4, 0, Math.PI * 2);
      ffCtx.fillStyle = "#cbd5e1"; 
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
                speed: 0.026 + Math.random() * 0.009,
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
      ffCtx.fillStyle = "#000000";
      ffCtx.fill();
    });

    ffCtx.font = "600 11.5px 'Inter', sans-serif";
    ffCtx.fillStyle = "#64748b";
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

// =============== ARCHITECTURE DRAWER ===============
const architectureRegistry = {
  "exotic-hub": {
    title: "EXOTIC GB HUB | Architecture",
    technologies: ["Firebase Auth", "Firestore DB", "Vanilla JavaScript", "HTML5 & CSS3", "WhatsApp API", "Netlify"],
    diagramSvg: `
      <svg viewBox="0 0 460 130" fill="none" class="diagram-svg">
        <rect x="10" y="45" width="90" height="40" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="55" y="70" fill="#ffffff" font-size="11" font-weight="700" text-anchor="middle">CLIENT UI</text>
        <path d="M 100 65 L 145 65" stroke="#64748b" stroke-width="1.5"/>
        <rect x="150" y="15" width="130" height="40" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="215" y="39" fill="#ffffff" font-size="10.5" font-weight="700" text-anchor="middle">FIREBASE AUTH</text>
        <rect x="150" y="75" width="130" height="40" rx="8" fill="#1e293b" stroke="#10b981" stroke-width="1.5"/>
        <text x="215" y="99" fill="#ffffff" font-size="10.5" font-weight="700" text-anchor="middle">STORAGE / DB</text>
        <path d="M 280 95 L 325 95" stroke="#64748b" stroke-width="1.5"/>
        <rect x="330" y="45" width="120" height="40" rx="8" fill="#1e293b" stroke="#22c55e" stroke-width="1.5"/>
        <text x="390" y="70" fill="#ffffff" font-size="10" font-weight="700" text-anchor="middle">WHATSAPP API</text>
      </svg>
    `,
    tradeoffs: [
      {
        heading: "Why Firebase over Custom Backend",
        desc: "Opted for Google Firebase to eliminate cold-start container delays and manage zero-cost database persistence for an exotic aquarium catalog. Client-side authentication hooks handle token lifecycles out-of-the-box."
      },
      {
        heading: "WhatsApp Direct Ordering vs. Payment Gateway",
        desc: "Bypassed standard merchant payment processors to avoid drop-off in niche regional buyers. WhatsApp ordering directly transmits sanitized order metadata into an encrypted messaging thread."
      }
    ],
    routes: [
      { method: "GET", path: "/api/products/catalog", desc: "Realtime dynamic catalog fetching" },
      { method: "POST", path: "/auth/firebase-handshake", desc: "Client JWT token verification" }
    ],
    github: "https://github.com/vignesh1-1",
    live: "https://exotic-gb-hub.netlify.app/"
  },
  "g-plus": {
    title: "G+ Bengaluru | Architecture",
    technologies: ["FastAPI", "Python 3", "GIS & Maps", "Gemini 1.5 API", "Spatial Postgres", "Leaflet.js"],
    diagramSvg: `
      <svg viewBox="0 0 460 130" fill="none" class="diagram-svg">
        <rect x="10" y="45" width="90" height="40" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="55" y="70" fill="#ffffff" font-size="10" font-weight="700" text-anchor="middle">GIS / LEAFLET</text>
        <path d="M 100 65 L 140 65" stroke="#64748b" stroke-width="1.5"/>
        <rect x="145" y="45" width="130" height="40" rx="8" fill="#1e293b" stroke="#0284c7" stroke-width="1.5"/>
        <text x="210" y="70" fill="#ffffff" font-size="10.5" font-weight="700" text-anchor="middle">FASTAPI ASYNC</text>
        <path d="M 275 65 L 320 35" stroke="#64748b" stroke-width="1.5"/>
        <path d="M 275 65 L 320 95" stroke="#64748b" stroke-width="1.5"/>
        <rect x="325" y="15" width="125" height="38" rx="8" fill="#1e293b" stroke="#a855f7" stroke-width="1.5"/>
        <text x="387" y="39" fill="#ffffff" font-size="10.5" font-weight="700" text-anchor="middle">GEMINI 1.5 LLM</text>
        <rect x="325" y="75" width="125" height="38" rx="8" fill="#1e293b" stroke="#f43f5e" stroke-width="1.5"/>
        <text x="387" y="99" fill="#ffffff" font-size="10.5" font-weight="700" text-anchor="middle">SPATIAL POSTGRES</text>
      </svg>
    `,
    tradeoffs: [
      {
        heading: "Asynchronous Python FastAPI Core",
        desc: "FastAPI with ASGI non-blocking event loops was selected over Django to stream high-density GeoJSON geospatial vectors with sub-20ms latency to city telemetry dashboards."
      },
      {
        heading: "Gemini 1.5 AI Query Triage",
        desc: "Offloaded citizen grievance routing to Google Gemini API, transforming unstructured complaint texts into categorized SQL spatial tags without manual human dispatchers."
      }
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
    diagramSvg: `
      <svg viewBox="0 0 460 130" fill="none" class="diagram-svg">
        <rect x="10" y="45" width="100" height="40" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="60" y="70" fill="#ffffff" font-size="10" font-weight="700" text-anchor="middle">BOOTSTRAP UI</text>
        <path d="M 110 65 L 155 65" stroke="#64748b" stroke-width="1.5"/>
        <rect x="160" y="45" width="120" height="40" rx="8" fill="#1e293b" stroke="#d97706" stroke-width="1.5"/>
        <text x="220" y="70" fill="#ffffff" font-size="10.5" font-weight="700" text-anchor="middle">FLASK REST API</text>
        <path d="M 280 65 L 325 65" stroke="#64748b" stroke-width="1.5"/>
        <rect x="330" y="45" width="120" height="40" rx="8" fill="#1e293b" stroke="#10b981" stroke-width="1.5"/>
        <text x="390" y="70" fill="#ffffff" font-size="10.5" font-weight="700" text-anchor="middle">SQLITE / MYSQL</text>
      </svg>
    `,
    tradeoffs: [
      {
        heading: "Why Python/Flask + SQLite / MySQL was chosen",
        desc: "For an agile bug and issue tracking system, Flask's lightweight micro-framework architecture eliminates redundant overhead found in heavier frameworks like Django, allowing low-latency sub-15ms request dispatching. SQLite was utilized for zero-configuration, ACID-compliant local embedded storage during testing and rapid triage sprints, with seamless migration to MySQL for multi-tenant production RBAC security."
      },
      {
        heading: "RBAC & Client Auditing Strategy",
        desc: "Session middleware enforces role-based endpoint permissions (Admin vs QA Engineer), preventing ticket manipulation while recording atomic audit trails into the database."
      }
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
    diagramSvg: `
      <svg viewBox="0 0 460 130" fill="none" class="diagram-svg">
        <rect x="10" y="45" width="95" height="40" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="57" y="70" fill="#ffffff" font-size="10" font-weight="700" text-anchor="middle">CITIZEN PORTAL</text>
        <path d="M 105 65 L 155 65" stroke="#64748b" stroke-width="1.5"/>
        <rect x="160" y="45" width="120" height="40" rx="8" fill="#1e293b" stroke="#818cf8" stroke-width="1.5"/>
        <text x="220" y="70" fill="#ffffff" font-size="10.5" font-weight="700" text-anchor="middle">PHP CORE APP</text>
        <path d="M 280 65 L 330 65" stroke="#64748b" stroke-width="1.5"/>
        <rect x="335" y="45" width="115" height="40" rx="8" fill="#1e293b" stroke="#0ea5e9" stroke-width="1.5"/>
        <text x="392" y="70" fill="#ffffff" font-size="10.5" font-weight="700" text-anchor="middle">MYSQL DATABASE</text>
      </svg>
    `,
    tradeoffs: [
      {
        heading: "Prepared Statements for Citizen Data Protection",
        desc: "Implemented strict parameterized SQL queries across all verification routes to prevent SQL injection during citizen identity document verification."
      },
      {
        heading: "State-Machine Flow Validation",
        desc: "Enforced non-reversible progression steps (Submission -> Verification -> Biometric Scheduling -> Issuance) guarded by server-side verification tokens."
      }
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

function openArchitectureDrawer(projectId) {
  const data = architectureRegistry[projectId];
  if (!data || !archDrawer) return;

  document.getElementById("archDrawerTitle").textContent = data.title;
  
  const techContainer = document.getElementById("archTechContainer");
  if (techContainer) {
    techContainer.innerHTML = data.technologies.map(t => `<span class="stack-tag">${t}</span>`).join('');
  }

  document.getElementById("archDiagramContainer").innerHTML = data.diagramSvg;
  
  document.getElementById("archTradeoffsContainer").innerHTML = data.tradeoffs.map(t => `
    <div class="tradeoff-item">
      <h5>${t.heading}</h5>
      <p>${t.desc}</p>
    </div>
  `).join('');

  document.getElementById("archRoutesContainer").innerHTML = data.routes.map(r => `
    <div class="arch-route-badge">
      <span class="arch-method ${r.method.toLowerCase()}">${r.method}</span>
      <span class="arch-path">${r.path}</span>
      <span class="arch-desc">${r.desc}</span>
    </div>
  `).join('');

  const ghLink = document.getElementById("archGithubLink");
  const liveLink = document.getElementById("archLiveLink");
  ghLink.href = data.github;
  liveLink.href = data.live;

  archDrawer.classList.add("active");
  archOverlay.classList.add("active");
  archDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeArchitectureDrawer() {
  if (!archDrawer) return;
  archDrawer.classList.remove("active");
  archOverlay.classList.remove("active");
  archDrawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
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

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeArchitectureDrawer();
    const arcadeModal = document.getElementById("arcadeModal");
    if (arcadeModal) arcadeModal.classList.remove("show");
  }
});

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