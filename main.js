// Hamburger menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
  });
});

// Scroll reveal using standard IntersectionObserver
const reveals = document.querySelectorAll('.reveal, .reveal-stagger');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      // Add a slight delay for staggered elements
      e.target.classList.add('visible');
      // Only reveal once
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

reveals.forEach(el => observer.observe(el));

// Active nav link
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  } else {
    a.classList.remove('active');
  }
});

// Mouse tracking glow effect (Modern UI pattern)
const mouseGlow = document.getElementById('mouse-glow');
if (mouseGlow && window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener('mousemove', (e) => {
        // Use requestAnimationFrame for smooth performance
        requestAnimationFrame(() => {
            mouseGlow.style.left = `${e.clientX}px`;
            mouseGlow.style.top = `${e.clientY}px`;
        });
    });

    // Pulse effect when clicking
    document.addEventListener('mousedown', () => {
        mouseGlow.style.transform = 'translate(-50%, -50%) scale(0.8)';
        mouseGlow.style.background = 'radial-gradient(circle, rgba(186,104,200, 0.12) 0%, transparent 70%)';
    });
    
    document.addEventListener('mouseup', () => {
        mouseGlow.style.transform = 'translate(-50%, -50%) scale(1)';
        mouseGlow.style.background = 'radial-gradient(circle, rgba(0, 229, 255, 0.08) 0%, transparent 70%)';
    });
}

// Subtle Parallax effect on scroll for glowing orbs
const orbs = document.querySelectorAll('.glow-orb');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    requestAnimationFrame(() => {
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.1;
            // Only translate Y to not mess with the existing absolute positioning too much
            const currentTransform = orb.style.transform;
            // Apply slight vertical shift based on scroll
            orb.style.marginTop = `${scrollY * speed}px`;
        });
    });
});
