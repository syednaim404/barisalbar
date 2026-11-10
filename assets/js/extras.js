/* =====================================================================
   extras.js — (১) শোক সংবাদ ক্যারোসেল  (২) সাইট সার্চ
   ===================================================================== */

/* ---------- ১. শোক সংবাদ ক্যারোসেল (একসাথে একটি কার্ড, অটো স্লাইড) ---------- */
(function () {
  var root = document.getElementById("cdCarousel");
  if (!root) return;
  var track = root.querySelector(".cd-track");
  var slides = Array.prototype.slice.call(track.children);
  var n = slides.length, i = 0, timer = null, DELAY = 6000;

  function show(k) {
    i = (k + n) % n;
    track.style.transform = "translateX(" + (-100 * i) + "%)";
    slides.forEach(function (s, idx) {
      var on = idx === i;
      s.setAttribute("aria-hidden", on ? "false" : "true");
      if ("inert" in s) s.inert = !on;           // লুকানো কার্ডের লিংকে ট্যাব যাবে না
    });
  }
  function play() { stop(); if (n > 1) timer = setInterval(function () { show(i + 1); }, DELAY); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  show(0);
  if (n < 2) return;
  play();

  // মাউস/ফোকাস থাকলে থামবে, সরে গেলে আবার চলবে
  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", play);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", play);
  document.addEventListener("visibilitychange", function () { document.hidden ? stop() : play(); });

  // মোবাইলে সোয়াইপ
  var sx = 0, sy = 0;
  root.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; stop(); }, { passive: true });
  root.addEventListener("touchend", function (e) {
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) show(i + (dx < 0 ? 1 : -1));
    play();
  });
})();

/* ---------- ২. সাইট সার্চ ---------- */
(function () {
  var form = document.getElementById("siteSearchForm");
  var input = document.getElementById("siteSearch");
  var box = document.getElementById("searchResults");
  if (!form || !input || !box) return;

  var BN = "০১২৩৪৫৬৭৮৯";
  function norm(s) {
    return String(s || "").replace(/[০-৯]/g, function (d) { return BN.indexOf(d); })
      .replace(/\s+/g, " ").trim().toLowerCase();
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function txt(el) { return el ? el.textContent.replace(/\s+/g, " ").trim() : ""; }

  // পেজের কনটেন্ট থেকে নিজে নিজে ইনডেক্স বানায় — নতুন কার্ড যোগ করলে আলাদা কিছু করতে হয় না
  var index = [];
  function add(type, icon, title, sub, href, ext) {
    if (!title) return;
    index.push({ type: type, icon: icon, title: title, sub: sub || "", href: href || "#", ext: !!ext, key: norm(title + " " + sub) });
  }
  document.querySelectorAll("#committee .person-card").forEach(function (c) {
    var a = c.closest("a");
    add("কমিটি", "fa-user-tie", txt(c.querySelector("h5")), txt(c.querySelector("span")), a ? a.getAttribute("href") : "#committee");
  });
  document.querySelectorAll("#members .member-card").forEach(function (c) {
    var a = c.closest("a");
    add("সদস্য", "fa-user", txt(c.querySelector("h6")), txt(c.querySelector("small")), a ? a.getAttribute("href") : "#members");
  });
  document.querySelectorAll("#notice .notice-table tbody tr").forEach(function (r) {
    var a = r.querySelector("a"), t = r.querySelectorAll("td");
    add("নোটিশ", "fa-file-pdf", txt(r.querySelector(".notice-title")), t[0] ? txt(t[0]) : "", a ? a.getAttribute("href") : "#notice", true);
  });
  document.querySelectorAll("#events .event-card").forEach(function (c) {
    var a = c.querySelector("a");
    add("ইভেন্ট", "fa-calendar-days", txt(c.querySelector("h5")), txt(c.querySelector(".event-meta")), a ? a.getAttribute("href") : "#events");
  });
  document.querySelectorAll("#leaders .leader-card").forEach(function (c) {
    var role = txt(c.querySelector("h5"));
    c.querySelectorAll("li").forEach(function (li) {
      add("সাবেক", "fa-award", txt(li.querySelector(".ld-name")), role + " · " + txt(li.querySelector(".ld-year")), "#leaders");
    });
  });
  document.querySelectorAll("#downloads .dl-item").forEach(function (a) {
    add("ডাউনলোড", "fa-download", txt(a.querySelector("span")), "PDF", a.getAttribute("href"), true);
  });
  document.querySelectorAll("#condolence .cd-slide").forEach(function (s) {
    var a = s.querySelector("a");
    add("শোক সংবাদ", "fa-dove", txt(s.querySelector(".cd-dua")), txt(s.querySelector("p")), a ? a.getAttribute("href") : "#condolence");
  });

  function mark(text, words) {
    // শব্দ হাইলাইট (বাংলা/ইংরেজি দুটোই; সংখ্যা ইংরেজি-বাংলা মিলিয়ে)
    var out = esc(text), low = norm(text);
    if (low.length !== text.length) return out;      // ইনডেক্স না মিললে হাইলাইট বাদ
    words.forEach(function (w) {
      if (!w) return;
      var re = new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
      var res = "", last = 0, m;
      while ((m = re.exec(low))) {
        res += esc(text.slice(last, m.index)) + "<mark>" + esc(text.slice(m.index, m.index + m[0].length)) + "</mark>";
        last = m.index + m[0].length;
        if (m[0].length === 0) re.lastIndex++;
      }
      out = last ? res + esc(text.slice(last)) : out;
    });
    return out;
  }

  function run() {
    var q = norm(input.value);
    if (!q) { box.hidden = true; box.innerHTML = ""; return; }
    var words = q.split(" ");
    var hits = index.filter(function (it) { return words.every(function (w) { return it.key.indexOf(w) > -1; }); });
    var html;
    if (!hits.length) {
      html = '<div class="sr-empty"><i class="fa-regular fa-face-frown me-2"></i>“' + esc(input.value.trim()) + '” এর জন্য কিছু পাওয়া যায়নি। নামের অংশ বা পদবি দিয়ে আবার চেষ্টা করুন।</div>';
    } else {
      var shown = hits.slice(0, 30);
      html = '<div class="sr-count">' + hits.length.toString().replace(/[0-9]/g, function (d) { return BN[d]; }) + 'টি ফলাফল পাওয়া গেছে</div><ul class="sr-list">' +
        shown.map(function (it) {
          return '<li><a class="sr-item" href="' + esc(it.href) + '"' + (it.ext ? ' target="_blank" rel="noopener"' : "") + '>' +
            '<i class="fa-solid ' + it.icon + '"></i><span class="sr-text"><strong>' + mark(it.title, words) + '</strong>' +
            (it.sub ? "<small>" + mark(it.sub, words) + "</small>" : "") + '</span><span class="sr-tag">' + it.type + "</span></a></li>";
        }).join("") + "</ul>";
    }
    box.innerHTML = html;
    box.hidden = false;
  }

  var t;
  input.addEventListener("input", function () { clearTimeout(t); t = setTimeout(run, 120); });
  form.addEventListener("submit", function (e) { e.preventDefault(); run(); });
  input.addEventListener("keydown", function (e) { if (e.key === "Escape") { input.value = ""; run(); } });
})();
