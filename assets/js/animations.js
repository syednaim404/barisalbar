/* =====================================================================
   animations.js — স্ক্রল রিভিল, কাউন্টার
   HTML এ আলাদা করে ক্লাস বসাতে হয় না; নিচের তালিকা থেকেই বসে যায়।
   [selector, animation(up|left|right|zoom|flip), stagger(সেকেন্ড)]
   ===================================================================== */
(function () {
  "use strict";

  var MAP = [
    [".section-heading", "up", 0],
    ["#about .col-lg-6:nth-child(1)", "left", 0],
    ["#about .col-lg-6:nth-child(2)", "right", 0],
    [".stats-section .col-6", "zoom", 0.12],
    ["#services .row > div", "flip", 0.12],
    ["#messages .col-md-6:nth-child(1)", "left", 0],
    ["#messages .col-md-6:nth-child(2)", "right", 0],
        [".notice-card", "up", 0],
    ["#leaders .col-lg-6", "up", 0.15],
    ["#dlCol .dl-item", "left", 0.1],
    ["#links .link-card", "right", 0.1],
    [".notice-table tbody tr", "left", 0.14],
    ["#committee .row > .col", "zoom", 0.09],
    ["#memberCarousel", "up", 0],
    ["#events .row > div", "up", 0.13],
    [".gallery-six .gs", "clip", 0.12],
    ["#contact .contact-card", "left", 0],
    ["#contact .contact-item", "left", 0.12],
    ["#contact .map-frame", "right", 0],
    [".site-footer .footer-main > div", "up", 0.14]
  ];

  var targets = [];
  MAP.forEach(function (m) {
    var list = document.querySelectorAll(m[0]);
    list.forEach(function (el, i) {
      el.classList.add("rv");
      if (m[1] !== "clip") el.setAttribute("data-a", m[1]);
      if (m[2]) el.style.setProperty("--d", (i % 6) * m[2] + "s");
      targets.push(el);
    });
  });

  // ---------- Reveal on scroll ----------
  if (!("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (el) { io.observe(el); });
  }

  // ---------- Counter (বাংলা সংখ্যা সাপোর্ট) ----------
  var BN = "০১২৩৪৫৬৭৮৯";
  function toEn(s) { return s.replace(/[০-৯]/g, function (d) { return BN.indexOf(d); }); }
  function toBn(s) { return String(s).replace(/[0-9]/g, function (d) { return BN[d]; }); }

  function runCounter(el) {
    var raw = el.textContent.trim();
    var m = raw.match(/[০-৯0-9][০-৯0-9,]*/);
    if (!m) return;
    var target = parseInt(toEn(m[0]).replace(/,/g, ""), 10);
    if (isNaN(target)) return;
    var withComma = m[0].indexOf(",") > -1;
    var before = raw.slice(0, m.index), after = raw.slice(m.index + m[0].length);
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    var dur = 1800, t0 = null;
    function fmt(n) { return toBn(withComma ? n.toLocaleString("en-US") : n); }
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var ease = 1 - Math.pow(1 - p, 3);
      el.textContent = before + fmt(Math.round(target * ease)) + after;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = raw;
    }
    requestAnimationFrame(step);
  }

  var stats = document.querySelector(".stats-section");
  if (stats && "IntersectionObserver" in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          stats.querySelectorAll(".stat-item strong").forEach(runCounter);
          so.disconnect();
        }
      });
    }, { threshold: 0.4 });
    so.observe(stats);
  }
})();
