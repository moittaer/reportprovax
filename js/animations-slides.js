// ===== ANIMATIONS & INTERACTIONS — ESQUINA LIGHT =====

// ===== FADE IN ON SCROLL =====
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// ===== COUNT-UP ANIMATION =====
function animateCountUp(element) {
  const target = parseFloat(element.dataset.target);
  const prefix = element.dataset.prefix || '';
  const suffix = element.dataset.suffix || '';
  const decimals = parseInt(element.dataset.decimals) || 0;
  const format = element.dataset.format || 'number';
  const duration = 2000;
  const startTime = performance.now();

  function formatNumber(num) {
    if (format === 'compact') {
      if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.', ',') + 'MI';
      if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
      return Math.round(num).toLocaleString('pt-BR');
    }
    if (decimals > 0) {
      return num.toLocaleString('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
    }
    return Math.round(num).toLocaleString('pt-BR');
  }

  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const currentValue = target * easeOutQuart(progress);
    element.textContent = prefix + formatNumber(currentValue) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCountUp(entry.target);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.count-up').forEach(el => countObserver.observe(el));

// ===== PROGRESS BARS ANIMATION =====
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      const targetWidth = bar.dataset.width;
      setTimeout(() => { bar.style.width = targetWidth; }, 200);
      progressObserver.unobserve(bar);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.progress-bar-fill, .meta-progress-bar-fill').forEach(bar => {
  bar.style.width = '0%';
  progressObserver.observe(bar);
});

// ===== SMOOTH SCROLL NAV =====
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      const offset = 80;
      const top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      document.querySelector('.nav-links').classList.remove('active');
    }
  });
});

// ===== NAV SHADOW ON SCROLL =====
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  if (window.pageYOffset > 60) {
    nav.style.boxShadow = '0 2px 16px rgba(0,0,0,0.1)';
  } else {
    nav.style.boxShadow = '0 1px 8px rgba(0,0,0,0.06)';
  }
}, { passive: true });

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.querySelector('.nav-toggle');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
  });
}

// ===== KPI CARD HOVER PARALLAX =====
document.querySelectorAll('.kpi-card, .hero-kpi-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-2px) perspective(600px) rotateX(${-y * 2.5}deg) rotateY(${x * 2.5}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0) perspective(600px) rotateX(0) rotateY(0)';
  });
});

// ===== EXPORT PDF =====
const btnExport = document.querySelector('.btn-export');
if (btnExport) {
  btnExport.addEventListener('click', () => window.print());
}
