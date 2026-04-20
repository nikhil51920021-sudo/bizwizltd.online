/* ============================================================
   BizWiz Ltd - main.js
   Mobile menu, smooth scroll, scroll-spy, counters, back-to-top,
   reveal-on-scroll. Pure vanilla, no dependencies.
   ============================================================ */
(function () {
    'use strict';

    /* ---------------- Mobile menu toggle ---------------- */
    const menuBtn  = document.getElementById('menu-btn');
    const menuIcon = document.getElementById('menu-icon');
    const mobile   = document.getElementById('mobile-menu');

    const closeMobile = () => {
        if (!mobile) return;
        mobile.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuIcon.classList.remove('fa-xmark');
        menuIcon.classList.add('fa-bars');
    };

    if (menuBtn && mobile) {
        menuBtn.addEventListener('click', () => {
            const isOpen = !mobile.classList.contains('hidden');
            if (isOpen) {
                closeMobile();
            } else {
                mobile.classList.remove('hidden');
                menuBtn.setAttribute('aria-expanded', 'true');
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-xmark');
            }
        });

        mobile.querySelectorAll('a').forEach((a) => {
            a.addEventListener('click', closeMobile);
        });
    }

    /* ---------------- Scroll-spy: highlight active nav link ---------------- */
    const sections = Array.from(document.querySelectorAll('section[id], header[id]'));
    const navLinks = Array.from(document.querySelectorAll('.nav-link, .mobile-link'));

    const setActive = (id) => {
        navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === '#' + id) link.classList.add('active');
            else link.classList.remove('active');
        });
    };

    if ('IntersectionObserver' in window && sections.length) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActive(entry.target.id);
                });
            },
            { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
        );
        sections.forEach((s) => observer.observe(s));
    }

    /* ---------------- Back-to-top button ---------------- */
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        const toggleBtt = () => {
            if (window.scrollY > 300) {
                backToTop.classList.remove('opacity-0', 'pointer-events-none');
                backToTop.classList.add('opacity-100');
            } else {
                backToTop.classList.add('opacity-0', 'pointer-events-none');
                backToTop.classList.remove('opacity-100');
            }
        };
        window.addEventListener('scroll', toggleBtt, { passive: true });
        toggleBtt();

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---------------- Counter animation for stats ---------------- */
    const counters = document.querySelectorAll('.counter');
    const animateCounter = (el) => {
        const target   = parseInt(el.dataset.target, 10) || 0;
        const duration = 1600;
        const start    = performance.now();
        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased    = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            el.textContent = Math.floor(eased * target).toString();
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target.toString();
        };
        requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window && counters.length) {
        const counterObs = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        counterObs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.4 }
        );
        counters.forEach((c) => counterObs.observe(c));
    } else {
        counters.forEach(animateCounter);
    }

    /* ---------------- Reveal-on-scroll for cards ---------------- */
    const revealTargets = document.querySelectorAll(
        '.service-card, .testimonial-card, .stat-card, .why-row, .contact-info-card'
    );
    revealTargets.forEach((el) => el.classList.add('reveal'));

    if ('IntersectionObserver' in window) {
        const revealObs = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in');
                        revealObs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );
        revealTargets.forEach((el) => revealObs.observe(el));
    } else {
        revealTargets.forEach((el) => el.classList.add('in'));
    }

    /* ---------------- Year in footer ---------------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
