/* ==========================================================================
   Digital Impression — interactivity (vanilla JS, no framework)
   Premium interactive layer: scroll progress, hero constellation canvas,
   custom cursor + magnetic buttons, 3D tilt + spotlight cards, count-up
   stats, client marquee, before/after slider, FAQ accordion, reveals,
   contact form (no <form> tag).
   ========================================================================== */
(function () {
  "use strict";

  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FINE = window.matchMedia && window.matchMedia("(pointer: fine)").matches;

  /* ---- Lucide icons ---- */
  function renderIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  /* ---- Scroll progress bar ---- */
  function initProgress() {
    var bar = document.getElementById("scrollProgress");
    if (!bar) return;
    var update = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var pct = max > 0 ? (h.scrollTop || window.scrollY) / max : 0;
      bar.style.transform = "scaleX(" + pct + ")";
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  /* ---- Sticky header state ---- */
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
    toggle.addEventListener("click", function () { open(menu.hidden); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) open(false); });
  }

  /* ---- Reveal on scroll ---- */
  function initReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!items.length) return;
    if (REDUCED || !("IntersectionObserver" in window)) {
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

  /* ---- Count-up stats ---- */
  function initCountUp() {
    var nums = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
    if (!nums.length) return;

    var run = function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      if (REDUCED) { el.textContent = target + suffix; return; }
      var dur = 1500, start = null;
      var step = function (ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) { nums.forEach(run); return; }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { run(e.target); obs.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    nums.forEach(function (el) { obs.observe(el); });
  }

  /* ---- Hero constellation canvas ---- */
  function initHeroCanvas() {
    var canvas = document.getElementById("heroCanvas");
    if (!canvas || REDUCED) return;
    var ctx = canvas.getContext("2d");
    var dots = [], raf = null, w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var GOLD = "201,162,74";

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.min(70, Math.floor(w / 22));
      dots = [];
      for (var i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.6 + 0.6
        });
      }
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + GOLD + ",0.55)";
        ctx.fill();
        for (var j = i + 1; j < dots.length; j++) {
          var e = dots[j], dx = d.x - e.x, dy = d.y - e.y, dist = dx * dx + dy * dy;
          if (dist < 13000) {
            ctx.beginPath();
            ctx.moveTo(d.x, d.y); ctx.lineTo(e.x, e.y);
            ctx.strokeStyle = "rgba(" + GOLD + "," + (0.16 * (1 - dist / 13000)) + ")";
            ctx.lineWidth = 1; ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(frame);
    }

    resize();
    frame();
    window.addEventListener("resize", function () {
      if (raf) cancelAnimationFrame(raf);
      resize(); frame();
    });
  }

  /* ---- Custom cursor + magnetic buttons ---- */
  function initCursor() {
    if (!FINE || REDUCED) return;
    var dot = document.getElementById("cursorDot");
    var ring = document.getElementById("cursorRing");
    if (!dot || !ring) return;
    document.body.classList.add("has-cursor");

    var mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = "translate(" + mx + "px," + my + "px)";
    });
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = "translate(" + rx + "px," + ry + "px)";
      requestAnimationFrame(loop);
    })();

    var hot = "a, button, .work, .card, .price, input, textarea, select, .ba__handle";
    document.querySelectorAll(hot).forEach(function (el) {
      el.addEventListener("mouseenter", function () { document.body.classList.add("cursor-hot"); });
      el.addEventListener("mouseleave", function () { document.body.classList.remove("cursor-hot"); });
    });

    // magnetic buttons
    document.querySelectorAll(".btn").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = "translate(" + x * 0.25 + "px," + y * 0.35 + "px)";
      });
      btn.addEventListener("mouseleave", function () { btn.style.transform = ""; });
    });
  }

  /* ---- 3D tilt + cursor spotlight on cards ---- */
  function initTilt() {
    var cards = document.querySelectorAll(".card, .work, .price");
    cards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", (px * 100) + "%");
        card.style.setProperty("--my", (py * 100) + "%");
        if (!FINE || REDUCED) return;
        var rotX = (0.5 - py) * 6;
        var rotY = (px - 0.5) * 6;
        card.style.transform = "perspective(900px) rotateX(" + rotX + "deg) rotateY(" + rotY + "deg) translateY(-6px)";
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    });
  }

  /* ---- Before/After slider ---- */
  function initBeforeAfter() {
    var root = document.getElementById("ba");
    if (!root) return;
    var before = root.querySelector(".ba__before");
    var handle = root.querySelector(".ba__handle");
    var dragging = false;

    function syncW() { root.style.setProperty("--w", root.getBoundingClientRect().width + "px"); }
    syncW();
    window.addEventListener("resize", syncW);

    function setPos(clientX) {
      var r = root.getBoundingClientRect();
      var pct = ((clientX - r.left) / r.width) * 100;
      pct = Math.max(2, Math.min(98, pct));
      before.style.width = pct + "%";
      handle.style.left = pct + "%";
      handle.setAttribute("aria-valuenow", Math.round(pct));
    }

    var start = function () { dragging = true; root.classList.add("is-dragging"); };
    var end = function () { dragging = false; root.classList.remove("is-dragging"); };
    var move = function (e) {
      if (!dragging) return;
      var x = e.touches ? e.touches[0].clientX : e.clientX;
      setPos(x);
    };

    handle.addEventListener("mousedown", start);
    handle.addEventListener("touchstart", start, { passive: true });
    window.addEventListener("mouseup", end);
    window.addEventListener("touchend", end);
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move, { passive: true });
    // click anywhere on track to jump
    root.addEventListener("click", function (e) {
      if (e.target === handle || handle.contains(e.target)) return;
      setPos(e.clientX);
    });
    // keyboard
    handle.addEventListener("keydown", function (e) {
      var cur = parseFloat(before.style.width) || 50;
      if (e.key === "ArrowLeft") { e.preventDefault(); var r = root.getBoundingClientRect(); setPos(r.left + r.width * (cur - 4) / 100); }
      if (e.key === "ArrowRight") { e.preventDefault(); var r2 = root.getBoundingClientRect(); setPos(r2.left + r2.width * (cur + 4) / 100); }
    });
  }

  /* ---- FAQ accordion ---- */
  function initFaq() {
    var items = document.querySelectorAll(".faq__item");
    items.forEach(function (item) {
      var btn = item.querySelector(".faq__q");
      var panel = item.querySelector(".faq__a");
      if (!btn || !panel) return;
      btn.addEventListener("click", function () {
        var isOpen = item.classList.contains("open");
        // close siblings for a clean accordion feel
        items.forEach(function (other) {
          if (other !== item) {
            other.classList.remove("open");
            var ob = other.querySelector(".faq__q");
            var op = other.querySelector(".faq__a");
            if (ob) ob.setAttribute("aria-expanded", "false");
            if (op) op.style.maxHeight = null;
          }
        });
        item.classList.toggle("open", !isOpen);
        btn.setAttribute("aria-expanded", String(!isOpen));
        panel.style.maxHeight = !isOpen ? panel.scrollHeight + "px" : null;
      });
    });
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
    var showError = function (m) { if (errorEl) { errorEl.textContent = m; errorEl.hidden = false; } };
    var clearError = function () { if (errorEl) errorEl.hidden = true; };

    btn.addEventListener("click", function () {
      var naam = (document.getElementById("naam").value || "").trim();
      var email = (document.getElementById("email").value || "").trim();
      var bericht = (document.getElementById("bericht").value || "").trim();
      if (!naam || !email || !bericht) { showError("Vul a.u.b. uw naam, e-mailadres en bericht in."); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError("Vul a.u.b. een geldig e-mailadres in."); return; }
      clearError();
      fields.hidden = true;
      success.hidden = false;
      success.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "nearest" });
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        ids.forEach(function (id) { var el = document.getElementById(id); if (el) el.value = ""; });
        clearError();
        success.hidden = true;
        fields.hidden = false;
      });
    }
  }

  /* ---- init ---- */
  function init() {
    renderIcons();
    initProgress();
    initHeader();
    initMobileMenu();
    initReveal();
    initCountUp();
    initHeroCanvas();
    initCursor();
    initTilt();
    initBeforeAfter();
    initFaq();
    initContactForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
