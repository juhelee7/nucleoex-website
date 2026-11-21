/* NucleoEX — site behaviour */
(function () {
  "use strict";

  var DICT = window.NUCLEOEX_I18N || { ko: {}, en: {} };
  var STORAGE_KEY = "nucleoex.lang";
  var currentLang = "ko";

  /* ---------------- Language ---------------- */
  function readLang() {
    try {
      var q = new URLSearchParams(window.location.search).get("lang");
      if (q && DICT[q]) return q;
      var saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && DICT[saved]) return saved;
    } catch (e) { /* ignore */ }
    return "ko";
  }

  function applyLang(lang, persist) {
    if (!DICT[lang]) lang = "ko";
    currentLang = lang;
    var t = DICT[lang];

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var val = t[key];
      if (typeof val !== "string") return;
      if (el.tagName === "META") { el.setAttribute("content", val); return; }
      if (el.hasAttribute("data-i18n-keep")) {
        el.setAttribute("aria-label", val);
      } else {
        el.innerHTML = val;
      }
    });

    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      var v = t[el.getAttribute("data-i18n-alt")];
      if (v) el.setAttribute("alt", v);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var v = t[el.getAttribute("data-i18n-aria")];
      if (v) el.setAttribute("aria-label", v);
    });

    document.documentElement.setAttribute("lang", lang);
    if (t["meta.title"]) document.title = t["meta.title"];
    var desc = document.querySelector('meta[name="description"]');
    if (desc && t["meta.desc"]) desc.setAttribute("content", t["meta.desc"]);
    var og = document.querySelector('meta[property="og:title"]');
    if (og && t["meta.title"]) og.setAttribute("content", t["meta.title"]);

    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      var on = b.getAttribute("data-lang") === lang;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });

    var menuBtn = document.getElementById("navToggle");
    if (menuBtn) {
      menuBtn.setAttribute("aria-label", lang === "en" ? "Open menu" : "메뉴 열기");
    }

    if (persist) {
      try { window.localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
      try {
        var url = new URL(window.location.href);
        if (lang === "ko") url.searchParams.delete("lang");
        else url.searchParams.set("lang", lang);
        window.history.replaceState({}, "", url);
      } catch (e) { /* ignore */ }
    }
  }

  document.querySelectorAll(".lang-switch button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var lang = btn.getAttribute("data-lang");
      if (lang === currentLang) return;
      applyLang(lang, true);
    });
  });

  /* ---------------- Header ---------------- */
  var header = document.getElementById("header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- Mobile menu ---------------- */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("mobileMenu");

  function closeMenu() {
    if (!menu || !toggle) return;
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("is-locked");
    toggle.setAttribute("aria-label", currentLang === "en" ? "Open menu" : "메뉴 열기");
  }
  function openMenu() {
    if (!menu || !toggle) return;
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("is-locked");
    toggle.setAttribute("aria-label", currentLang === "en" ? "Close menu" : "메뉴 닫기");
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      if (menu.classList.contains("is-open")) closeMenu();
      else openMenu();
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 880) closeMenu();
    });
  }

  /* ---------------- Reveal on scroll ---------------- */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && revealItems.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = el.parentElement ? Array.prototype.slice.call(el.parentElement.children) : [];
        var idx = siblings.indexOf(el);
        el.style.transitionDelay = Math.min(Math.max(idx, 0) * 60, 240) + "ms";
        el.classList.add("is-in");
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealItems.forEach(function (el) { io.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------------- Active nav link ---------------- */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".nav-desktop a");
  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute("id");
        navLinks.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------------- Copy to clipboard ---------------- */
  var toast = document.getElementById("toast");
  var toastTimer;
  function showToast(msg) {
    if (!toast || !msg) return;
    toast.textContent = msg;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2400);
  }

  function legacyCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy") || btn.textContent;
      var done = function () {
        var prev = btn.textContent;
        btn.classList.add("is-done");
        btn.textContent = currentLang === "en" ? "Copied" : "복사됨";
        showToast(DICT[currentLang]["toast.copied"]);
        window.setTimeout(function () {
          btn.classList.remove("is-done");
          btn.textContent = prev;
        }, 2000);
      };
      var fail = function () { showToast(DICT[currentLang]["toast.copyFail"]); };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done).catch(function () {
          if (legacyCopy(text)) done(); else fail();
        });
      } else if (legacyCopy(text)) {
        done();
      } else {
        fail();
      }
    });
  });

  /* ---------------- Year ---------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------------- Init ---------------- */
  applyLang(readLang(), false);
})();
