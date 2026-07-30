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

  /* ---- Contact form endpoint ----
     Paste your Formspree endpoint here to receive submissions by e-mail,
     e.g. "https://formspree.io/f/abcdwxyz". Leave empty to keep demo mode
     (shows the success message without sending). */
  var FORM_ENDPOINT = "";

  /* ---- Language state (used by count-up + i18n) ---- */
  var currentLang = "nl";
  function sufOf(el) {
    if (currentLang === "en" && el.getAttribute("data-suffix-en") != null) return el.getAttribute("data-suffix-en");
    return el.getAttribute("data-suffix") || "";
  }

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
      if (REDUCED) { el.textContent = target + sufOf(el); el.classList.add("counted"); return; }
      var dur = 1500, start = null;
      var step = function (ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + sufOf(el);
        if (p < 1) requestAnimationFrame(step);
        else { el.textContent = target + sufOf(el); el.classList.add("counted"); }
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
      if (card.closest(".carousel--portfolio")) return; // no tilt on full-width slides
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

  /* ---- Services carousel: draggable + auto-rotating ---- */
  function initCarousel() {
    document.querySelectorAll("[data-carousel]").forEach(function (root) {
      var viewport = root.querySelector(".carousel__viewport");
      var track = root.querySelector(".carousel__track");
      var cards = Array.prototype.slice.call(track.children);
      var dotsWrap = root.querySelector(".carousel__dots");
      var arrows = root.querySelectorAll(".carousel__arrow");
      if (!viewport || !track || !cards.length) return;

      var gap = parseFloat(getComputedStyle(track).columnGap) || 24;
      var index = 0, perView = 3, maxIndex = 0, step = 0;
      var autoplay = parseInt(root.getAttribute("data-autoplay") || "0", 10);
      var timer = null;

      function calcPerView() {
        var forced = parseInt(root.getAttribute("data-per-view") || "0", 10);
        if (forced > 0) {
          // forced count is for tablet/desktop; show 1 on small screens
          return Math.min(viewport.clientWidth < 640 ? 1 : forced, cards.length);
        }
        var w = viewport.clientWidth;
        var n = w >= 1024 ? 3 : w >= 640 ? 2 : 1;
        return Math.min(n, cards.length);
      }

      function layout() {
        perView = calcPerView();
        maxIndex = Math.max(0, cards.length - perView);
        var cw = (viewport.clientWidth - gap * (perView - 1)) / perView;
        step = cw + gap;
        cards.forEach(function (c) { c.style.width = cw + "px"; });
        buildDots();
        if (index > maxIndex) index = maxIndex;
        goTo(index, true);
      }

      function buildDots() {
        if (!dotsWrap) return;
        dotsWrap.innerHTML = "";
        for (var i = 0; i <= maxIndex; i++) {
          (function (i) {
            var d = document.createElement("button");
            d.className = "carousel__dot" + (i === index ? " is-active" : "");
            d.setAttribute("aria-label", "Ga naar groep " + (i + 1));
            d.addEventListener("click", function () { stop(); goTo(i); });
            dotsWrap.appendChild(d);
          })(i);
        }
      }

      function updateDots() {
        if (!dotsWrap) return;
        Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
          d.classList.toggle("is-active", i === index);
        });
      }

      function goTo(i, instant) {
        index = Math.max(0, Math.min(i, maxIndex));
        if (instant) track.style.transition = "none";
        track.style.transform = "translateX(" + (-index * step) + "px)";
        if (instant) { void track.offsetWidth; track.style.transition = ""; }
        updateDots();
      }

      arrows.forEach(function (btn) {
        btn.addEventListener("click", function () {
          stop();
          var dir = parseInt(btn.getAttribute("data-dir"), 10);
          var next = index + dir;
          if (next < 0) next = maxIndex;
          if (next > maxIndex) next = 0;
          goTo(next);
        });
      });

      /* drag / swipe */
      var dragging = false, startX = 0, base = 0, moved = false;
      function down(e) {
        dragging = true; moved = false;
        startX = e.clientX != null ? e.clientX : (e.touches && e.touches[0].clientX);
        base = -index * step;
        if (autoplay) stop();
      }
      function move(e) {
        if (!dragging) return;
        var x = e.clientX != null ? e.clientX : (e.touches && e.touches[0].clientX);
        var dx = x - startX;
        if (Math.abs(dx) > 6 && !moved) { moved = true; root.classList.add("is-dragging"); }
        if (moved) { track.style.transition = "none"; track.style.transform = "translateX(" + (base + dx) + "px)"; }
      }
      function up(e) {
        if (!dragging) return;
        dragging = false;
        if (moved) {
          var x = (e.clientX != null ? e.clientX : (e.changedTouches && e.changedTouches[0].clientX));
          var dx = x - startX;
          track.style.transition = "";
          goTo(Math.round((-base - dx) / step));
          setTimeout(function () { root.classList.remove("is-dragging"); }, 0);
        }
      }

      viewport.addEventListener("pointerdown", down);
      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("pointerup", up);

      /* autoplay */
      function play() {
        if (!autoplay || REDUCED) return;
        stop();
        timer = setInterval(function () { goTo(index >= maxIndex ? 0 : index + 1); }, autoplay);
      }
      function stop() { if (timer) { clearInterval(timer); timer = null; } }

      root.addEventListener("mouseenter", stop);
      root.addEventListener("mouseleave", play);
      root.addEventListener("focusin", stop);
      root.addEventListener("focusout", play);
      document.addEventListener("visibilitychange", function () { document.hidden ? stop() : play(); });

      var rid = null;
      window.addEventListener("resize", function () {
        if (rid) cancelAnimationFrame(rid);
        rid = requestAnimationFrame(layout);
      });

      layout();
      play();
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

    var msg = function (nl, en) { return currentLang === "en" ? en : nl; };
    var showSuccess = function () {
      fields.hidden = true;
      success.hidden = false;
      success.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "nearest" });
    };

    btn.addEventListener("click", function () {
      var naam = (document.getElementById("naam").value || "").trim();
      var email = (document.getElementById("email").value || "").trim();
      var bericht = (document.getElementById("bericht").value || "").trim();
      if (!naam || !email || !bericht) { showError(msg("Vul a.u.b. uw naam, e-mailadres en bericht in.", "Please fill in your name, email and message.")); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError(msg("Vul a.u.b. een geldig e-mailadres in.", "Please enter a valid email address.")); return; }
      clearError();

      if (!FORM_ENDPOINT) { showSuccess(); return; } // demo mode

      var payload = {};
      ids.forEach(function (id) { var el = document.getElementById(id); if (el) payload[id] = el.value; });
      btn.disabled = true;
      var original = btn.textContent;
      btn.textContent = msg("Verzenden…", "Sending…");
      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).then(function (r) {
        if (!r.ok) throw new Error("bad status");
        showSuccess();
      }).catch(function () {
        showError(msg("Er ging iets mis. Probeer opnieuw of mail ons rechtstreeks.", "Something went wrong. Please try again or email us directly."));
      }).finally(function () {
        btn.disabled = false;
        btn.textContent = original;
      });
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

  /* ---- i18n: NL default in the DOM, EN from dictionary ---- */
  var I18N_EN = {
    meta_title: "Digital Impression — Premium Websites for Belgian Entrepreneurs",
    meta_desc: "We build professional websites for Belgian entrepreneurs — fast, beautiful and built to attract customers. Get a tailored quote within 24h plus a free homepage design.",
    ph_address: "[Address]", ph_email: "[Email]", ph_phone: "[Phone]",
    nav_home: "Home", nav_services: "Services", nav_work: "Work", nav_pricing: "Pricing", nav_about: "About",
    cta_quote: "Get a Quote",
    hero_eyebrow: "Belgian Web Design Studio",
    hero_title: "Your Business Deserves A Website That Works <em>As Hard As You Do</em>",
    hero_sub: "We build professional websites for Belgian entrepreneurs — fast, beautiful and built to attract customers. Get a tailored quote within 24h plus a free homepage design.",
    hero_cta1: "Get a Quote &amp; Free Design",
    hero_cta2: "See Our Work",
    hero_trust1: "Website live in 2 weeks", hero_trust2: "Free homepage design", hero_trust3: "Dedicated contact person",
    rd_eyebrow: "The Difference A Redesign Makes",
    rd_title: "From Outdated To <em>Stunning</em>",
    rd_lead: "Your website is your digital storefront — and for most businesses it works against them. An outdated site drives customers away before they ever call. Drag the handle and see how we turn the same content into something that builds trust and wins enquiries.",
    rd_hint: "Drag to compare before &amp; after",
    rd_from1: "Slow &amp; outdated", rd_to1: "Lightning-fast &amp; modern",
    rd_from2: "Invisible on Google", rd_to2: "Found higher up",
    rd_from3: "Not mobile-friendly", rd_to3: "Perfect on every screen",
    rd_from4: "Visitors bounce", rd_to4: "Visitors become customers",
    rd_cta: "Request a free redesign proposal",
    ba_before: "Before", ba_after: "After",
    marquee_label: "Trusted by entrepreneurs across Belgium &amp; Europe",
    svc_eyebrow: "Our Services", svc_title: "What We <em>Build</em>",
    svc_aside: "Not sure what you need?<br /><a href=\"#contact\" class=\"link-gold\">We'll figure it out together</a>",
    svc_cta: "Request a quote",
    svc1_title: "Business websites", svc1_body: "Sleek, professional websites that build trust and generate leads.",
    svc1_f1: "Trust-building design", svc1_f2: "Built SEO-ready", svc1_f3: "Smart lead forms",
    svc2_title: "Landing pages", svc2_body: "Single pages designed for one goal: conversions. Perfect for campaigns and product launches.",
    svc2_f1: "One clear goal", svc2_f2: "Built for conversion", svc2_f3: "Ideal for campaigns",
    svc3_title: "Webshops", svc3_body: "Sell online with a webshop built to convert — beautiful product pages and seamless checkout.",
    svc3_f1: "Beautiful product pages", svc3_f2: "Seamless checkout", svc3_f3: "Secure payments",
    svc4_title: "Redesigns", svc4_body: "Transform your existing website into something you're proud of. Same content, a completely new impression.",
    svc4_f1: "Fresh, modern look", svc4_f2: "Keep your content", svc4_f3: "Faster &amp; mobile",
    work_eyebrow: "Portfolio", work_title: "Our <em>Work</em>",
    work_aside: "A selection of the websites we built for Belgian and European entrepreneurs — from wholesale to tourism.",
    work_live: "View live",
    work_tag_simonta: "B2B Wholesale", work_desc_simonta: "Wholesale in fresh carrots, B2B, delivery across Europe.",
    work_tag_mergel: "Tourism &amp; Culture", work_desc_mergel: "Guided cave tours, atmospheric &amp; historic.",
    work_tag_tuin: "Garden &amp; Landscape", work_desc_tuin: "Garden design &amp; maintenance, elegant and green.",
    work_tag_fadim: "Artist &amp; Events", work_desc_fadim: "Artist/singer with agenda, fan shop &amp; bookings.",
    fi_eyebrow: "First Impressions",
    fi_title: "First Impressions Happen Online, Before You Even Pick Up The <em>Phone</em>",
    fi_stat1: "judge a company's credibility based on its website, before reading a single word.",
    fi_stat2: "That's all the time you get. A slow or outdated website sends customers straight to your competitors.",
    fi_stat3: "You only get one shot at a great first impression. Don't waste it.",
    proc_eyebrow: "How It Works", proc_title: "From Request To Live Website In Less Than <em>2 Weeks</em>",
    proc_step: "Step 1", proc_step2: "Step 2", proc_step3: "Step 3", proc_step4: "Step 4",
    proc1_title: "Tell us about your project", proc1_body: "A short 3-minute chat — you tell us your goals and wishes.",
    proc2_title: "Quote &amp; design", proc2_body: "Within 24h you receive a tailored quote plus a free homepage design.",
    proc3_title: "We build your website", proc3_body: "In 10–14 days we build your site — you're kept in the loop at every step.",
    proc4_title: "You go live", proc4_body: "Your website goes online — with ongoing support and one dedicated contact.",
    proc_band: "<strong>No obligation, no deposit.</strong> Your free homepage design costs nothing and commits you to nothing. We earn your trust before we ask for anything.",
    about_badge: "Based in Belgium", about_eyebrow: "About Us", about_title: "Who's Behind <em>Digital Impression?</em>",
    about_intro: "Digital Impression is a Belgian web design studio, founded by <strong>[Name]</strong>. We help local entrepreneurs get a website that doesn't just look beautiful, but actually wins customers. No anonymous supplier — one familiar face who thinks along with you, from first conversation to launch and beyond.",
    about_l1: "One dedicated contact", about_l2: "Transparent pricing", about_l3: "Local &amp; involved", about_l4: "Results-driven",
    about_cta: "Discuss your project",
    why_eyebrow: "Why Choose Digital Impression", why_title: "Belgian Entrepreneurs Choose <em>Us</em>",
    why1_title: "Based in Belgium", why1_body: "A local team that understands the Belgian market and entrepreneur — no anonymous foreign supplier.",
    why2_title: "Fast delivery", why2_body: "Your website live in 10–14 days, without endless waiting.",
    why3_title: "Personal approach", why3_body: "One dedicated contact, from first conversation to launch and beyond.",
    price_eyebrow: "Pricing", price_title: "Simple, Transparent <em>Pricing</em>", price_lead: "No hidden costs. No surprises.",
    price_from: "from", price_badge: "⭐ Most Popular",
    price_incl: "Included", price_ideal: "Ideal for",
    price1_amount: "<span class=\"price__old\">€1,200</span><span class=\"price__now\">€999</span>",
    price2_amount: "<span class=\"price__old\">€1,799</span><span class=\"price__now\">€1,249</span>",
    price3_amount: "<span class=\"price__old\">€2,499</span><span class=\"price__now\">€1,899</span>",
    price1_sub: "Perfect for freelancers, local businesses and startups that need a professional online presence.",
    price2_sub: "Designed for businesses that want to generate leads and convert visitors into customers.",
    price3_sub: "A complete e-commerce solution built to maximize online sales.",
    b_incl1: "Custom website design", b_incl2: "Up to 3 pages", b_incl3: "Mobile-responsive design", b_incl4: "Contact form", b_incl5: "Basic SEO setup",
    b_ideal1: "Restaurants", b_ideal2: "Consultants", b_ideal3: "Small businesses", b_ideal4: "Personal brands",
    p_incl1: "Everything from Website Basic", p_incl2: "Up to 5 pages", p_incl3: "Advanced SEO setup", p_incl4: "Blog/news section", p_incl5: "Booking or quote system",
    p_ideal1: "Growing companies", p_ideal2: "Service businesses", p_ideal3: "Agencies", p_ideal4: "Professional firms",
    s_incl1: "Everything from Website Premium", s_incl2: "Online store setup", s_incl3: "Up to 50 products uploaded", s_incl4: "Payment integration", s_incl5: "Shopping cart and checkout",
    s_ideal1: "Clothing brands", s_ideal2: "Food and beverage brands", s_ideal3: "Beauty products", s_ideal4: "E-commerce businesses",
    feat_pages: "Up to 5 pages", feat_responsive: "Mobile-responsive design", feat_form: "Contact form",
    feat_seo: "Basic SEO", feat_online: "Online within 10–14 days", feat_free: "Free homepage design",
    cta_request: "Request a quote", cta_contact: "Get in touch",
    price_note: "Every project includes a free homepage design — sent within 24 hours of your request, with no obligation whatsoever.",
    faq_eyebrow: "Frequently Asked Questions", faq_title: "Everything You Want To <em>Know</em>",
    faq_lead: "No answer found? <a href=\"#contact\" class=\"link-gold\">Ask your question</a> — we reply within 24 hours.",
    faq_q1: "How fast will my website be online?",
    faq_a1: "Most projects go live within 10 to 14 days. After your request you receive a tailored quote plus a free homepage design within 24 hours.",
    faq_q2: "How much does a website cost exactly?",
    faq_a2: "A professional website starts from €999. The exact price depends on your wishes — you always get a transparent quote with no hidden costs or surprises.",
    faq_q3: "Is the free design really no-obligation?",
    faq_a3: "Absolutely. Your free homepage design costs nothing and commits you to nothing. No deposit, no obligation — we earn your trust first.",
    faq_q4: "Can I update my website myself later?",
    faq_a4: "Yes. We build your site so you can easily manage text and images, and you get one dedicated contact for support — even after launch.",
    faq_q5: "Do you also handle hosting and domain?",
    faq_a5: "Certainly. If you wish, we arrange hosting, domain name and the technical setup, so you don't have to worry about anything.",
    contact_eyebrow: "Start Your Project Today", contact_title: "Let's Build Something <em>Beautiful Together</em>",
    contact_lead: "Tell us about your project and we'll send you a tailored quote plus a free <span class=\"gold\">homepage design</span> within 24 hours. Completely without obligation.",
    contact_pt1: "Tailored quote + free design within 24 hours",
    contact_pt2: "No deposit — you only pay when you're 100% satisfied",
    f_naam: "Name", f_naam_ph: "Your name", f_bedrijf: "Company name", f_bedrijf_ph: "Your company",
    f_email: "Email", f_email_ph: "you@company.be", f_tel: "Phone number",
    f_bericht: "Message", f_bericht_ph: "How can we help you?",
    f_type: "Website type", f_select: "Select...",
    f_opt1: "Business website", f_opt2: "Landing page", f_opt3: "Webshop", f_opt4: "Redesign", f_opt5: "Other",
    f_project: "Tell us about your project", f_project_ph: "Goals, examples, deadlines...",
    f_found: "How did you find us?", f_found_ph: "Google, referral, social media...",
    f_submit: "Send", f_fine: "By submitting you agree to a no-obligation contact.",
    f_success_title: "Thank you for your request!",
    f_success_body: "We've received your message. You'll hear from us within 24 hours with a tailored quote plus your free homepage design.",
    f_again: "Send another request",
    footer_tagline: "Premium websites for Belgian entrepreneurs — fast, beautiful and built to attract customers.",
    footer_company: "Company", footer_contact: "Contact",
    footer_stay: "Stay In The Loop", footer_stay_sub: "Tips &amp; insights on web design for entrepreneurs.",
    footer_rights: "© 2026 Digital Impression — All rights reserved.",
    footer_privacy: "Privacy policy", footer_terms: "Terms & conditions"
  };

  function initI18n() {
    var nl = {};
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      nl[el.getAttribute("data-i18n")] = el.innerHTML;
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      nl["__ph_" + el.getAttribute("data-i18n-ph")] = el.getAttribute("placeholder") || "";
    });
    nl.meta_title = document.title;
    var metaDesc = document.querySelector('meta[name="description"]');
    nl.meta_desc = metaDesc ? metaDesc.getAttribute("content") : "";

    function apply(lang, isToggle) {
      currentLang = lang;
      document.documentElement.lang = lang;
      document.querySelectorAll("[data-i18n]").forEach(function (el) {
        var k = el.getAttribute("data-i18n");
        var val = lang === "en" ? I18N_EN[k] : nl[k];
        if (val != null) el.innerHTML = val;
      });
      document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
        var k = el.getAttribute("data-i18n-ph");
        var val = lang === "en" ? I18N_EN[k] : nl["__ph_" + k];
        if (val != null) el.setAttribute("placeholder", val);
      });
      document.title = lang === "en" ? I18N_EN.meta_title : nl.meta_title;
      if (metaDesc) metaDesc.setAttribute("content", lang === "en" ? I18N_EN.meta_desc : nl.meta_desc);
      // already-counted stats: re-render with the right suffix
      document.querySelectorAll("[data-count].counted").forEach(function (el) {
        el.textContent = el.getAttribute("data-count") + sufOf(el);
      });
      var dl = document.getElementById("langLabel"); if (dl) dl.textContent = lang === "nl" ? "EN" : "NL";
      var ml = document.getElementById("langLabelMobile"); if (ml) ml.textContent = lang === "nl" ? "English" : "Nederlands";
      try { localStorage.setItem("di_lang", lang); } catch (e) {}
      renderIcons();
    }

    var saved = "nl";
    try { saved = localStorage.getItem("di_lang") || "nl"; } catch (e) {}
    if (saved === "en") apply("en", false); else currentLang = "nl";

    function toggle() { apply(currentLang === "nl" ? "en" : "nl", true); }
    var t1 = document.getElementById("langToggle"); if (t1) t1.addEventListener("click", toggle);
    var t2 = document.getElementById("langToggleMobile"); if (t2) t2.addEventListener("click", toggle);
  }

  /* ---- init ---- */
  function init() {
    renderIcons();
    initProgress();
    initHeader();
    initMobileMenu();
    initReveal();
    initI18n();
    initCountUp();
    initHeroCanvas();
    initCursor();
    initTilt();
    initBeforeAfter();
    initFaq();
    initCarousel();
    initContactForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
