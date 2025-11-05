// ===== Mobile nav =====
const hamburger = document.getElementById('hamburger');
const navList = document.getElementById('navList');
if (hamburger && navList) {
  hamburger.addEventListener('click', () => {
    const open = navList.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navList.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navList.classList.remove('is-open'); hamburger.classList.remove('is-open'); hamburger.setAttribute('aria-expanded','false');
  }));
}

// ===== Reveal on scroll =====
const reveals = document.querySelectorAll('.reveal-up');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
reveals.forEach(el => io.observe(el));

// ===== Scene transitions (background + blobs per section) =====
const sections = document.querySelectorAll(".section");
const blobA = document.querySelector(".blob-a");
const blobB = document.querySelector(".blob-b");

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const i = [...sections].indexOf(entry.target);
    updateScene(i);
  });
}, { threshold: 0.6 });
sections.forEach(sec => sectionObserver.observe(sec));

function updateScene(i) {
  const body = document.body;
  const blobA = document.querySelector(".blob-a");
  const blobB = document.querySelector(".blob-b");

  // Smooth transitions
  body.style.transition = "background 2s ease";
  blobA.style.transition = "all 2s ease";
  blobB.style.transition = "all 2s ease";

  // Function for moving blobs smoothly per section
  function moveBlobs(xOffset, yOffset) {
    const vw = window.innerWidth / 100;
    const vh = window.innerHeight / 100;

    blobA.style.transform = `translate(${xOffset * vw}px, ${yOffset * vh}px) scale(1.05)`;
    blobB.style.transform = `translate(${-xOffset * 0.8 * vw}px, ${-yOffset * 0.8 * vh}px) scale(1.1)`;
  }

  // Scene updates
  switch (i) {
    case 0:
  body.style.background = "linear-gradient(180deg,#0b0f1a,#0f1426)";
  blobA.style.background = "radial-gradient(circle, rgba(179, 0, 255, 0.5), transparent 70%)";
  blobB.style.background = "radial-gradient(circle, rgba(0, 30, 255, 0.5), transparent 70%)";
  particleSettings(100, 1.0);
  break;


    case 1:
      body.style.background = "linear-gradient(180deg,#0f1426,#121a32)";
      blobA.style.background = "radial-gradient(circle, rgba(65,146,255,.5), transparent 70%)";
      blobB.style.background = "radial-gradient(circle, rgba(99,255,198,.5), transparent 70%)";
      moveBlobs(8, -12);
      particleSettings(100, 0.8);
      blobA.style.opacity = "0.6";
      blobB.style.opacity = "0.5";
      break;

    case 2:
      body.style.background = "linear-gradient(180deg,#0f1426,#121a32)";
      blobA.style.background = "radial-gradient(circle, rgba(65,146,255,.5), transparent 70%)";
      blobB.style.background = "radial-gradient(circle, rgba(99,255,198,.5), transparent 70%)";
      moveBlobs(8, -12);
      particleSettings(100, 0.8);
      blobA.style.opacity = "0.6";
      blobB.style.opacity = "0.5";
      break;

    case 3:
      body.style.background = "linear-gradient(180deg,#0b0f1a,#101726)";
      blobA.style.background = "radial-gradient(circle, rgba(255,99,164,.5), transparent 70%)";
      blobB.style.background = "radial-gradient(circle, rgba(255,255,255,.3), transparent 70%)";
      moveBlobs(-10, 10);
      particleSettings(80, 0.5);
      blobA.style.opacity = "0.7";
      blobB.style.opacity = "0.4";
      break;
  }
}

// ===== Parallax particles with “reveal near cursor” =====
const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let w, h, dpr, particles = [];
  let parallaxX = 0, parallaxY = 0, mouseX = 0, mouseY = 0, scrollY = 0;
  let DENSITY = 30, SPEED = 0.5;

  function particleSettings(density, speed){
    DENSITY = density; SPEED = speed;
    particles = makeParticles(DENSITY);
  }
  window.particleSettings = particleSettings; // used by updateScene()

  const resize = () => {
    dpr = window.devicePixelRatio || 1;
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = makeParticles(DENSITY);
  };
  window.addEventListener('resize', resize); resize();

  window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / w - 0.5;
    mouseY = (e.clientY - rect.top) / h - 0.5;
  });
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });

  function makeParticles(count){
    const arr = [];
    for (let i=0;i<count;i++){
      arr.push({
        x: Math.random()*w,
        y: Math.random()*h,
        vx: (Math.random()-0.5)*0.3,
        vy: (Math.random()-0.5)*0.3,
        r: Math.random()*1.6 + 0.4,
        hue: Math.random() < 0.5 ? 195 : 265
      });
    }
    return arr;
  }

  function step(){
    // ease parallax toward mouse
    parallaxX += (mouseX - parallaxX) * 0.05;
    parallaxY += (mouseY - parallaxY) * 0.05;

    const scrollOffset = Math.min(scrollY / 800, 1);
    const shiftX = parallaxX * 20;
    const shiftY = parallaxY * 20 + scrollOffset * 30;

    ctx.clearRect(0,0,w,h);

    // soft glow
    const grad = ctx.createRadialGradient(
      w * (0.7 - parallaxX * 0.5),
      h * (0.15 - parallaxY * 0.5),
      100, w/2, h/2, Math.max(w,h)
    );
    grad.addColorStop(0, "rgba(255,255,255,0.05)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad; ctx.fillRect(0,0,w,h);

    // links
    for (let i=0;i<particles.length;i++){
      for (let j=i+1;j<particles.length;j++){
        const a=particles[i], b=particles[j];
        const dx=a.x-b.x, dy=a.y-b.y, dist=Math.hypot(dx,dy);
        if (dist<90){
          ctx.globalAlpha = 0.05*(1 - dist/90);
          ctx.strokeStyle = "white";
          ctx.beginPath();
          ctx.moveTo(a.x + shiftX, a.y + shiftY);
          ctx.lineTo(b.x + shiftX, b.y + shiftY);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }

    // stars with reveal near cursor
    for (const p of particles){
      p.x += p.vx * SPEED; p.y += p.vy * SPEED;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      const dx = (p.x / w) - (mouseX + 0.5);
      const dy = (p.y / h) - (mouseY + 0.5);
      const dist = Math.hypot(dx, dy);
      const opacity = Math.max(0.12, 1 - dist * 4);
      const hueShift = 20 * (1 - Math.min(dist * 4, 1));
      const hue = p.hue + hueShift;

      ctx.beginPath();
      ctx.arc(p.x + shiftX, p.y + shiftY, p.r, 0, Math.PI*2);
      ctx.fillStyle = `hsla(${hue},90%,60%,${opacity})`;
      ctx.fill();
    }

    requestAnimationFrame(step);
  }
  step();
}

// ===== Utility =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== SNAP SCROLL PRESENTATION MODE =====
const allSections = document.querySelectorAll(".section");
let currentSection = 0;
let isScrolling = false;
let scrollTimeout;

// Scroll to a section index
function scrollToSection(index) {
  if (index < 0 || index >= allSections.length) return;
  isScrolling = true;
  allSections[index].scrollIntoView({ behavior: "smooth" });

  // Lock scrolling longer to absorb trackpad momentum
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    isScrolling = false;
  }, 1200); // wait ~1.2s before next scroll allowed
}

// Handle wheel events (mouse + trackpad)
window.addEventListener(
  "wheel",
  (e) => {
    // prevent tiny or repeated deltas from trackpads
    if (isScrolling || Math.abs(e.deltaY) < 40) return;
    e.preventDefault();

    if (e.deltaY > 0) {
      currentSection = Math.min(currentSection + 1, allSections.length - 1);
    } else {
      currentSection = Math.max(currentSection - 1, 0);
    }
    scrollToSection(currentSection);
  },
  { passive: false } // allow preventDefault()
);

// Handle arrow keys
window.addEventListener("keydown", (e) => {
  if (isScrolling) return;
  if (e.key === "ArrowDown" || e.key === "PageDown") {
    currentSection = Math.min(currentSection + 1, allSections.length - 1);
    scrollToSection(currentSection);
  } else if (e.key === "ArrowUp" || e.key === "PageUp") {
    currentSection = Math.max(currentSection - 1, 0);
    scrollToSection(currentSection);
  }
});

// Handle touch swipe (mobile)
let touchStartY = 0;
window.addEventListener("touchstart", (e) => {
  touchStartY = e.touches[0].clientY;
});
window.addEventListener("touchend", (e) => {
  if (isScrolling) return;
  const touchEndY = e.changedTouches[0].clientY;
  const deltaY = touchStartY - touchEndY;
  if (Math.abs(deltaY) < 40) return;
  if (deltaY > 0) {
    currentSection = Math.min(currentSection + 1, allSections.length - 1);
  } else {
    currentSection = Math.max(currentSection - 1, 0);
  }
  scrollToSection(currentSection);
});


// Fade-in animation when section is in view
function updateActiveSection() {
  sections.forEach((section, i) => {
    section.classList.toggle("active", i === currentSection);
  });
}
updateActiveSection();

window.addEventListener("wheel", () => updateActiveSection());
window.addEventListener("keydown", () => updateActiveSection());

// ===== Wireframe Reveal with Mouse Tracking =====
let gridX = 50, gridY = 50;

window.addEventListener("mousemove", (e) => {
  const targetX = (e.clientX / window.innerWidth) * 100;
  const targetY = (e.clientY / window.innerHeight) * 100;

  // Smooth easing toward mouse position
  gridX += (targetX - gridX) * 0.15;
  gridY += (targetY - gridY) * 0.15;

  document.documentElement.style.setProperty("--mx", `${gridX}%`);
  document.documentElement.style.setProperty("--my", `${gridY}%`);
});

// Optional: hide the grid if mouse is idle
let idleTimeout;
window.addEventListener("mousemove", () => {
  const grid = document.querySelector(".grid-overlay");
  grid.style.opacity = "0.3"; // show while moving
  clearTimeout(idleTimeout);
  idleTimeout = setTimeout(() => {
    grid.style.opacity = "0.05"; // fade back when idle
  }, 1000);
});
// ===== Fade-in footer when in view =====
const footer = document.querySelector('.section.footer, .footer');
if (footer) {
  const footerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          footer.classList.add('is-visible');
        }
      });
// Footer observer already configured above (duplicate removed)
    },
    { threshold: 0.3 }
  );
  footerObserver.observe(footer);
}


