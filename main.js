// Hamburger menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
  });
});

// Scroll reveal
const reveals = document.querySelectorAll('.reveal, .reveal-stagger');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
reveals.forEach(el => observer.observe(el));

// Mouse tracking glow
const mouseGlow = document.getElementById('mouse-glow');
if (mouseGlow && window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            mouseGlow.style.left = `${e.clientX}px`;
            mouseGlow.style.top = `${e.clientY}px`;
        });
    });
    document.addEventListener('mousedown', () => {
        mouseGlow.style.transform = 'translate(-50%, -50%) scale(0.8)';
        mouseGlow.style.background = 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)';
    });
    document.addEventListener('mouseup', () => {
        mouseGlow.style.transform = 'translate(-50%, -50%) scale(1)';
        mouseGlow.style.background = 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)';
    });
}

// Parallax orbs
const orbs = document.querySelectorAll('.glow-orb');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    requestAnimationFrame(() => {
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.1;
            orb.style.marginTop = `${scrollY * speed}px`;
        });
    });
});
