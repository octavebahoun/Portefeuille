


// Theme: apply saved preference or system preference (runs immediately)
      (function () {
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

      function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) { }
        updateThemeToggleButton();
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
        }

        else {
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
        }

        else {
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
      }

        ;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }

        , observerOptions);

      // Observe all cards and sections
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

        // Create mailto link
        const mailtoLink = `mailto:octavebahoun@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

        window.location.href = mailtoLink;

        // Show success message
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

      // Animated counter for stats
      function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);

        const timer = setInterval(() => {
          start += increment;

          if (start >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
          }

          else {
            element.textContent = Math.floor(start) + '+';
          }
        }

          , 16);
      }

      // Trigger animations when about section is visible
      const aboutSection = document.getElementById('about');
      const aboutText = document.querySelector('.about-text');

      const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Animate the text
            aboutText.classList.add('visible');

            // Animate counters if not already done
            if (!entry.target.dataset.animated) {
              entry.target.dataset.animated = 'true';
              // Trigger counter animations here if needed
            }
          }
        });
      }, {
        threshold: 0.2,
        rootMargin: '-50px 0px'
      }); if (aboutSection) {
        aboutObserver.observe(aboutSection);
      }

      // Cursor trail effect (optional - can be removed if too much)
      let mouseX = 0;
      let mouseY = 0;
      let cursorX = 0;
      let cursorY = 0;

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      // Add particle effect on scroll (optional)
      function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '5px';
        particle.style.height = '5px';
        particle.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.opacity = '1';
        particle.style.transition = 'all 1s ease-out';

        document.body.appendChild(particle);

        setTimeout(() => {
          particle.style.opacity = '0';
          particle.style.transform = 'translateY(-50px) scale(0)';
        }

          , 10);

        setTimeout(() => {
          particle.remove();
        }

          , 1000);
      }

      // Typing effect for hero text (optional)
      function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';

        function type() {
          if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
          }
        }

        type();
      }

      // Initialize
      document.addEventListener('DOMContentLoaded', () => {
        updateActiveLink();
        // Theme toggle setup
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) {
          themeBtn.addEventListener('click', function (e) {
            e.preventDefault();
            toggleTheme();
          });
        }
        updateThemeToggleButton();

        // Add hover effect to project cards
        document.querySelectorAll('.project-card').forEach(card => {
          card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-15px) scale(1.02)';
          });

          card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
          });
        });

        // Add ripple effect on buttons
        document.querySelectorAll('.btn').forEach(button => {
          button.addEventListener('click', function (e) {
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

      // Add ripple animation
      const style = document.createElement('style');

      style.textContent = ` @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }

      `;
      document.head.appendChild(style);


      if ('WebSocket' in window) {
        (function () {
          function refreshCSS() {
            var sheets = [].slice.call(document.getElementsByTagName("link"));
            var head = document.getElementsByTagName("head")[0];
            for (var i = 0; i < sheets.length; ++i) {
              var elem = sheets[i];
              var parent = elem.parentElement || head;
              parent.removeChild(elem);
              var rel = elem.rel;
              if (elem.href && typeof rel != "string" || rel.length == 0 || rel.toLowerCase() == "stylesheet") {
                var url = elem.href.replace(/(&|\?)_cacheOverride=\d+/, '');
                elem.href = url + (url.indexOf('?') >= 0 ? '&' : '?') + '_cacheOverride=' + (new Date().valueOf());
              }
              parent.appendChild(elem);
            }
          }
          var protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
          var address = protocol + window.location.host + window.location.pathname + '/ws';
          var socket = new WebSocket(address);
          socket.onmessage = function (msg) {
            if (msg.data == 'reload') window.location.reload();
            else if (msg.data == 'refreshcss') refreshCSS();
          };
          if (sessionStorage && !sessionStorage.getItem('IsThisFirstTime_Log_From_LiveServer')) {
            console.log('Live reload enabled.');
            sessionStorage.setItem('IsThisFirstTime_Log_From_LiveServer', true);
          }
        })();
      }
      else {
        console.error('Upgrade your browser. This Browser is NOT supported WebSocket for Live-Reloading.');
      }