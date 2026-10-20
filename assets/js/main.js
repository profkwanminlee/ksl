/**
 * Contemporary Korea Studies Lab (KSL)
 * Nanyang Technological University, Singapore
 * Accessible Mobile Navigation & Clamped Parallax Scroll Script
 */

(function () {
  'use strict';

  // 1. Accessibility & Motion Preference Checks
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 2. Mobile Navigation Drawer Handling
  const mobileToggleBtn = document.getElementById('mobileNavToggle');
  const mobileNavMenu = document.getElementById('mobileNavMenu');
  const mobileNavClose = document.getElementById('mobileNavClose');
  const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');

  function openMobileNav() {
    if (!mobileNavMenu || !mobileNavBackdrop) return;
    mobileNavMenu.classList.add('open');
    mobileNavBackdrop.classList.add('open');
    mobileNavMenu.setAttribute('aria-hidden', 'false');
    if (mobileToggleBtn) {
      mobileToggleBtn.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';

    // Focus on close button
    if (mobileNavClose) {
      mobileNavClose.focus();
    }
  }

  function closeMobileNav() {
    if (!mobileNavMenu || !mobileNavBackdrop) return;
    mobileNavMenu.classList.remove('open');
    mobileNavBackdrop.classList.remove('open');
    mobileNavMenu.setAttribute('aria-hidden', 'true');
    if (mobileToggleBtn) {
      mobileToggleBtn.setAttribute('aria-expanded', 'false');
      mobileToggleBtn.focus();
    }
    document.body.style.overflow = '';
  }

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const isOpen = mobileNavMenu && mobileNavMenu.classList.contains('open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', function (e) {
      e.preventDefault();
      closeMobileNav();
    });
  }

  if (mobileNavBackdrop) {
    mobileNavBackdrop.addEventListener('click', function () {
      closeMobileNav();
    });
  }

  // Keyboard accessibility: ESC key closes mobile menu
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNavMenu && mobileNavMenu.classList.contains('open')) {
      closeMobileNav();
    }
  });

  // 3. Clamped Subtle Parallax Fallback for Browsers lacking CSS Scroll-Driven Animations
  const supportsScrollDriven = window.CSS && CSS.supports && CSS.supports('(animation-timeline: view()) and (animation-range: entry)');

  if (!supportsScrollDriven && !prefersReducedMotion) {
    const parallaxWrappers = document.querySelectorAll('.parallax-wrapper');

    if (parallaxWrappers.length > 0) {
      let isTicking = false;

      function updateParallax() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;

        parallaxWrappers.forEach(function (wrapper) {
          const rect = wrapper.getBoundingClientRect();
          const wrapperTop = rect.top + scrollY;
          const wrapperHeight = rect.height;

          // Check if wrapper is in or near viewport
          if (scrollY + windowHeight > wrapperTop && scrollY < wrapperTop + wrapperHeight) {
            // Normalized scroll offset (-1 to 1)
            const progress = (scrollY - wrapperTop) / (wrapperHeight + windowHeight);
            
            const bgLayer = wrapper.querySelector('.hero-bg-layer');
            const latticeLayer = wrapper.querySelector('.hero-lattice-layer');

            if (bgLayer) {
              const bgSpeed = parseFloat(bgLayer.getAttribute('data-speed')) || 0.2;
              // Clamp translation between -35px and +35px
              const clampedBg = Math.max(-35, Math.min(35, progress * 100 * bgSpeed));
              bgLayer.style.transform = 'translate3d(0, ' + clampedBg.toFixed(1) + 'px, 0)';
            }

            if (latticeLayer) {
              const latSpeed = parseFloat(latticeLayer.getAttribute('data-speed')) || -0.12;
              // Counter movement clamped between -20px and +20px
              const clampedLat = Math.max(-20, Math.min(20, progress * 100 * latSpeed));
              latticeLayer.style.transform = 'translate3d(0, ' + clampedLat.toFixed(1) + 'px, 0)';
            }
          }
        });

        isTicking = false;
      }

      window.addEventListener('scroll', function () {
        if (!isTicking) {
          window.requestAnimationFrame(updateParallax);
          isTicking = true;
        }
      }, { passive: true });

      // Run once on load
      updateParallax();
    }
  }

})();
