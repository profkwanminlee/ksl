/**
 * Contemporary Korean Studies Lab (CKSL)
 * Nanyang Technological University, Singapore
 * Accessible Mobile Navigation (Modeled on Prof. Kwan Min Lee's Site) & Smooth Interactions
 */

(function () {
  'use strict';

  // 1. Accessibility & Motion Preference Checks
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 2. Mobile Navigation Overlay Handling (Identical to profkwanminlee.github.io)
  var mobileNavToggle = document.getElementById('mobileNavToggle');
  var mobileNavOverlay = document.getElementById('mobileNavOverlay');

  if (mobileNavToggle && mobileNavOverlay) {
    mobileNavToggle.addEventListener('click', function (e) {
      e.preventDefault();
      var isOpen = mobileNavOverlay.classList.contains('is-active');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    function openMobileNav() {
      mobileNavOverlay.classList.add('is-active');
      mobileNavToggle.classList.add('is-open');
      mobileNavOverlay.setAttribute('aria-hidden', 'false');
      mobileNavToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMobileNav() {
      mobileNavOverlay.classList.remove('is-active');
      mobileNavToggle.classList.remove('is-open');
      mobileNavOverlay.setAttribute('aria-hidden', 'true');
      mobileNavToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    // Close on clicking any link inside
    var mobileLinks = mobileNavOverlay.querySelectorAll('a');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMobileNav();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNavOverlay.classList.contains('is-active')) {
        closeMobileNav();
        mobileNavToggle.focus();
      }
    });

    // Reset on window resize above mobile breakpoint
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860 && mobileNavOverlay.classList.contains('is-active')) {
        closeMobileNav();
      }
    }, { passive: true });
  }

  // 3. Subtle Clamped Scroll Parallax (Gentle velocity, strictly non-intrusive)
  var supportsScrollDriven = window.CSS && CSS.supports && CSS.supports('(animation-timeline: view()) and (animation-range: entry)');

  if (!supportsScrollDriven && !prefersReducedMotion) {
    var parallaxWrappers = document.querySelectorAll('.parallax-wrapper');

    if (parallaxWrappers.length > 0) {
      var isTicking = false;

      function updateParallax() {
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;
        var windowHeight = window.innerHeight;

        parallaxWrappers.forEach(function (wrapper) {
          var rect = wrapper.getBoundingClientRect();
          var wrapperTop = rect.top + scrollY;
          var wrapperHeight = rect.height;

          if (scrollY + windowHeight > wrapperTop && scrollY < wrapperTop + wrapperHeight) {
            var progress = (scrollY - wrapperTop) / (wrapperHeight + windowHeight);
            var bgLayer = wrapper.querySelector('.hero-bg-layer');
            var latticeLayer = wrapper.querySelector('.hero-lattice-layer');

            if (bgLayer) {
              var bgSpeed = parseFloat(bgLayer.getAttribute('data-speed')) || 0.15;
              var clampedBg = Math.max(-25, Math.min(25, progress * 80 * bgSpeed));
              bgLayer.style.transform = 'translate3d(0, ' + clampedBg.toFixed(1) + 'px, 0)';
            }

            if (latticeLayer) {
              var latSpeed = parseFloat(latticeLayer.getAttribute('data-speed')) || -0.08;
              var clampedLat = Math.max(-15, Math.min(15, progress * 80 * latSpeed));
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

      updateParallax();
    }
  }

})();
