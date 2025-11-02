<script>
  // Theme: apply saved preference or system preference (runs immediately)
  (function() {
    try {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = saved || (prefersDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {
      // ignore storage errors
    }
  })();

  // Helper to update the theme toggle button (uses SVG icons)
  function updateThemeToggleButton() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    const moonSVG = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';
    const sunSVG = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="currentColor"/><path stroke="currentColor" stroke-width="2" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" fill="none"/></svg>';
    btn.innerHTML = theme === 'dark' ? moonSVG : sunSVG;
    btn.setAttribute('aria-pressed', theme === 'dark');
  }

  // Theme toggle WITH WAVE ANIMATION
  let isAnimating = false;
  let themeOverlay = null;

  function initThemeTransition() {
    if (!themeOverlay) {
      themeOverlay = document.createElement('div');
      themeOverlay.className = 'theme-transition-overlay';
      document.body.appendChild(themeOverlay);
    }
  }

  function toggleThemeWithWave() {
    if (isAnimating) return;
    
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    
    isAnimating = true;

    const wave = document.createElement('div');
    wave.className = 'theme-wave';
    
    if (next === 'light') {
      wave.classList.add('from-top');
      wave.style.background = '#ffffff';
    } else {
      wave.classList.add('from-bottom');
      wave.style.background = '#0f172a';
    }
    
    themeOverlay.appendChild(wave);

    setTimeout(() => {
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      updateThemeToggleButton();
    }, 400);

    setTimeout(() => {
      wave.remove();
      isAnimating = false;
    }, 1200);
  }

  // Update year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Active navigation link based on scroll position
  const sections = document.querySelectorAll('section[id]');
  const navLinkElements = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinkElements.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);

  // Scroll to top button
  const scrollTopBtn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.skill-card, .project-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    observer.observe(el);
  });

  // Form submission
  function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject') || 'Nouveau message';
    const message = formData.get('message');
    const mailtoLink = `mailto:octavebahoun@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    window.location.href = mailtoLink;
    alert(`Merci ${name} ! Votre client email va s'ouvrir pour envoyer le message.`);
    form.reset();
  }

  // Parallax effect on hero section
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  });

  // About section observer
  const aboutSection = document.getElementById('about');
  const aboutText = document.querySelector('.about-text');

  const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        aboutText.classList.add('visible');
        if (!entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
        }
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '-50px 0px'
  });

  if (aboutSection) {
    aboutObserver.observe(aboutSection);
  }

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    updateActiveLink();
    initThemeTransition();
    
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        toggleThemeWithWave();
      });
    }
    updateThemeToggleButton();

    // Button effects
    document.querySelectorAll('.btn').forEach(button => {
      button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    });
  });

  // Ripple animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
</script>
