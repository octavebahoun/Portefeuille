  // Handle photo upload
    const photoInput = document.getElementById('photoInput');
    const photoContainer = document.querySelector('.photo-container');
    const photoPlaceholder = document.getElementById('photoPlaceholder');

    photoInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          // Remove placeholder
          photoPlaceholder.style.display = 'none';
          
          // Create and add image
          const img = document.createElement('img');
          img.src = event.target.result;
          photoContainer.appendChild(img);
          
          // Store in localStorage
          localStorage.setItem('cvPhoto', event.target.result);
        };
        reader.readAsDataURL(file);
      }
    });

    // Load saved photo on page load
    window.addEventListener('DOMContentLoaded', () => {
      const savedPhoto = localStorage.getItem('cvPhoto');
      if (savedPhoto) {
        photoPlaceholder.style.display = 'none';
        const img = document.createElement('img');
        img.src = savedPhoto;
        photoContainer.appendChild(img);
      }
    });

    // Smooth scroll for anchor links
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

    // Animation on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }
      });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
      observer.observe(section);
    });

    // Add hover animations to cards
    document.querySelectorAll('.project-card, .skill-category, .info-item').forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
      });
    });

    // Print optimization
    window.addEventListener('beforeprint', () => {
      document.body.style.background = 'white';
    });

    window.addEventListener('afterprint', () => {
      document.body.style.background = 'var(--light-gray)';
    });

    // Add ripple effect on buttons
    document.querySelectorAll('.action-btn').forEach(button => {
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

    // Dynamic year update
    const currentYear = new Date().getFullYear();
    document.querySelectorAll('.footer p').forEach(p => {
      if (p.textContent.includes('2024')) {
        p.textContent = p.textContent.replace('2024', currentYear);
      }
    });

    // Smooth scroll reveal effect
    const revealElements = document.querySelectorAll('.timeline-item, .project-card, .skill-category');
    
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.6s ease';
      revealObserver.observe(el);
    });

    // Add download CV functionality (optional)
    function downloadCV() {
      window.print();
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + P to print
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        window.print();
      }
      // Escape to scroll to top
      if (e.key === 'Escape') {
        window.scrollTo({top: 0, behavior: 'smooth'});
      }
    });

    // Add click to copy email
    const emailElements = document.querySelectorAll('.contact-item');
    emailElements.forEach(item => {
      if (item.textContent.includes('octavebahoun@gmail.com')) {
        item.style.cursor = 'pointer';
        item.title = 'Cliquer pour copier';
        item.addEventListener('click', () => {
          navigator.clipboard.writeText('octavebahoun@gmail.com').then(() => {
            const originalText = item.innerHTML;
            item.innerHTML = '<span class="icon">✅</span><span>Email copié !</span>';
            setTimeout(() => {
              item.innerHTML = originalText;
            }, 2000);
          });
        });
      }
    });

    // Progress bar on scroll
    const progressBar = document.createElement('div');
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.height = '3px';
    progressBar.style.background = 'linear-gradient(90deg, var(--primary), var(--secondary))';
    progressBar.style.width = '0%';
    progressBar.style.zIndex = '9999';
    progressBar.style.transition = 'width 0.1s ease';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      progressBar.style.width = scrolled + '%';
    });

    // Add loading animation
    window.addEventListener('load', () => {
      document.querySelector('.cv-container').style.opacity = '0';
      setTimeout(() => {
        document.querySelector('.cv-container').style.transition = 'opacity 0.8s ease';
        document.querySelector('.cv-container').style.opacity = '1';
      }, 100);
    });

    // Highlight active section in view
    const sections = document.querySelectorAll('.section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.02), transparent)';
          entry.target.style.borderRadius = '10px';
          entry.target.style.padding = '1rem';
          entry.target.style.transition = 'all 0.5s ease';
        }
      });
    }, {
      threshold: 0.5
    });

    sections.forEach(section => {
      sectionObserver.observe(section);
    });

    console.log('✨ CV chargé avec succès ! Made with ❤️ by Octave BAHOUN-HOUTOUKPE');
//

