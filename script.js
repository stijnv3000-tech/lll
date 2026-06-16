/* ==========================================================================
   Digital Impression — interactivity (vanilla JS, no framework)
   - Lucide icons
   - Sticky-header scroll state
   - Mobile menu toggle
   - On-scroll reveals (IntersectionObserver, with stagger via data-delay)
   - Contact form (no <form> tag): validation + success state
   ========================================================================== */
(function () {
  "use strict";

  /* ---- Lucide icons ---- */
  function renderIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  /* ---- Sticky header: add .scrolled past a small threshold ---- */
  function initHeader() {
    var navbar = document.querySelector(".navbar");
    if (!navbar) return;
    var onScroll = function () {
      navbar.classList.toggle("scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Mobile menu ---- */
  function initMobileMenu() {
    var toggle = document.getElementById("navToggle");
    var menu = document.getElementById("mobileMenu");
    if (!toggle || !menu) return;

    var open = function (state) {
      menu.hidden = !state;
      toggle.setAttribute("aria-expanded", String(state));
      toggle.setAttribute("aria-label", state ? "Menu sluiten" : "Menu openen");
      toggle.innerHTML = '<i data-lucide="' + (state ? "x" : "menu") + '"></i>';
      renderIcons();
    };

    toggle.addEventListener("click", function () {
      open(menu.hidden);
    });

    // close when a link is tapped
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) open(false);
    });
  }

  /* ---- Reveal on scroll ---- */
  function initReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.getAttribute("data-delay") || "0", 10);
        el.style.transitionDelay = delay + "ms";
        el.classList.add("is-visible");
        obs.unobserve(el);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });

    items.forEach(function (el) { obs.observe(el); });
  }

  /* ---- Contact form (no <form> tag) ---- */
  function initContactForm() {
    var btn = document.getElementById("submitBtn");
    var fields = document.getElementById("formFields");
    var success = document.getElementById("formSuccess");
    var errorEl = document.getElementById("formError");
    var resetBtn = document.getElementById("resetBtn");
    if (!btn || !fields || !success) return;

    var ids = ["naam", "bedrijf", "email", "telefoon", "bericht", "type", "project", "gevonden"];

    var showError = function (msg) {
      if (!errorEl) return;
      errorEl.textContent = msg;
      errorEl.hidden = false;
    };
    var clearError = function () {
      if (errorEl) errorEl.hidden = true;
    };

    btn.addEventListener("click", function () {
      var naam = (document.getElementById("naam").value || "").trim();
      var email = (document.getElementById("email").value || "").trim();
      var bericht = (document.getElementById("bericht").value || "").trim();

      if (!naam || !email || !bericht) {
        showError("Vul a.u.b. uw naam, e-mailadres en bericht in.");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError("Vul a.u.b. een geldig e-mailadres in.");
        return;
      }
      clearError();
      // No backend — show success state.
      fields.hidden = true;
      success.hidden = false;
      success.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        ids.forEach(function (id) {
          var el = document.getElementById(id);
          if (el) el.value = "";
        });
        clearError();
        success.hidden = true;
        fields.hidden = false;
      });
    }
  }

  /* ---- init ---- */
  function init() {
    renderIcons();
    initHeader();
    initMobileMenu();
    initReveal();
    initContactForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
