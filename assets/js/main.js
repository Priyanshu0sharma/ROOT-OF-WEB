// Preloader - Instant Millisecond Load Optimization
document.body.style.overflow = 'hidden';
function removePreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader && !preloader.classList.contains('done')) {
    preloader.classList.add('done');
    document.body.style.overflow = '';
    window.dispatchEvent(new Event('scroll'));
  }
}

if (document.readyState === 'interactive' || document.readyState === 'complete') {
  setTimeout(removePreloader, 150);
} else {
  document.addEventListener('DOMContentLoaded', () => setTimeout(removePreloader, 150));
  window.addEventListener('load', () => setTimeout(removePreloader, 150));
  setTimeout(removePreloader, 350);
}


    // Nav scroll
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 60); });

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    if (mobileBtn && navMenu) {
      mobileBtn.addEventListener('click', () => {
        mobileBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
      });
      // Close menu when clicking a link
      document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
          mobileBtn.classList.remove('active');
          navMenu.classList.remove('active');
        });
      });
    }

    // Scroll reveal
    const reveals = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), e.target.dataset.delay || 0);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el, i) => {
      el.dataset.delay = (i % 3) * 80;
      io.observe(el);
    });

    // 3D Interactive Card Tilt Engine (Flutter-style Motion)
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rx = (y / (rect.height / 2)) * -6;
        const ry = (x / (rect.width / 2)) * 6;
        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.015, 1.015, 1.015)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      });
    });

    // Counter animation
    function animCount(el, target, suffix = '') {
      let start = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        start += step;
        if (start >= target) { el.textContent = target + suffix; clearInterval(timer); }
        else el.textContent = Math.floor(start) + suffix;
      }, 16);
    }

    // Form submit
    const formSubmit = document.querySelector('.form-submit');
    if (formSubmit) {
      formSubmit.addEventListener('click', function () {
        this.textContent = 'Message Sent ✓';
        this.style.background = '#2d4a39';
        this.style.color = '#B8922A';
        setTimeout(() => { this.textContent = 'Send Message'; this.style.background = ''; this.style.color = ''; }, 3000);
      });
    }
