/* =========================================================
   Namita & Kabir · Save the Date
   Edit the CONFIG block to change dates, venue or RSVP link.
   ========================================================= */

const CONFIG = {
  coupleNames: "Namita & Kabir",
  // Dates are local to the venue. Format: YYYY-MM-DD
  startDate: "2027-06-25",
  endDate: "2027-06-27",
  venue: "Aura, Bengaluru",
  // Paste your Google Form / RSVP link here when it's ready. Leave empty until then.
  rsvpUrl: "",
  events: [
    { title: "Haldi & Mehendi", date: "2027-06-25" },
    { title: "Sangeet",         date: "2027-06-26" },
    { title: "Wedding Ceremony", date: "2027-06-27" },
  ],
};

/* ---------- Intro curtain + LED lights ---------- */
(function () {
  const intro = document.getElementById("intro");
  if (!intro) return;
  const skip =
    document.documentElement.classList.contains("intro-skip") ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (skip) { intro.remove(); return; }

  document.body.classList.add("is-intro");

  function rand(a, b) { return a + Math.random() * (b - a); }

  // Flower clusters that overlap to cover the screen, each drifting away from the centre on open
  const BLOOMS = [
    { img: "corner-left",  cx: 50, cy: 50, w: "76vw", h: "76vh" },
    { img: "corner-left",  cx: 16, cy: 18, w: "72vw", h: "76vh" },
    { img: "corner-right", cx: 84, cy: 18, w: "68vw", h: "80vh" },
    { img: "corner-right", cx: 16, cy: 82, w: "68vw", h: "80vh", flip: true },
    { img: "corner-left",  cx: 84, cy: 82, w: "72vw", h: "76vh", flip: true },
    { img: "corner-right", cx: 50, cy: 6,  w: "64vw", h: "56vh", flip: true },
    { img: "corner-left",  cx: 50, cy: 94, w: "64vw", h: "56vh" },
    { img: "corner-right", cx: 4,  cy: 50, w: "60vw", h: "84vh" },
    { img: "corner-right", cx: 96, cy: 50, w: "60vw", h: "84vh", flip: true },
  ];
  const blooms = document.getElementById("intro-blooms");
  BLOOMS.forEach((b) => {
    const el = document.createElement("div");
    el.className = "intro__bloom" + (b.flip ? " intro__bloom--flip" : "");
    el.style.setProperty("--cx", b.cx + "%");
    el.style.setProperty("--cy", b.cy + "%");
    el.style.setProperty("--w", b.w);
    el.style.setProperty("--h", b.h);
    el.style.setProperty("--dx", ((b.cx - 50) / 50).toFixed(2));
    el.style.setProperty("--dy", ((b.cy - 50) / 50).toFixed(2));
    const img = document.createElement("img");
    img.src = "assets/images/" + b.img + ".jpg";
    img.alt = "";
    el.appendChild(img);
    blooms.appendChild(el);
  });

  // Draw sagging strings of fairy lights plus a few loose sparkles across the screen
  function buildLights(host) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("preserveAspectRatio", "none");
    host.appendChild(svg);

    const strings = [
      { x0: -5,  y0: 4,  x1: 105, y1: 12, sag: 14, n: 18 },
      { x0: -5,  y0: 24, x1: 105, y1: 18, sag: 12, n: 16 },
      { x0: -5,  y0: 42, x1: 105, y1: 50, sag: 11, n: 15 },
      { x0: -5,  y0: 68, x1: 105, y1: 62, sag: 10, n: 14 },
    ];
    strings.forEach((s) => {
      const pts = [];
      const steps = 24;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = s.x0 + (s.x1 - s.x0) * t;
        const y = s.y0 + (s.y1 - s.y0) * t + s.sag * 4 * t * (1 - t);
        pts.push([x, y]);
      }
      const path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", "M" + pts.map((p) => p[0].toFixed(2) + " " + p[1].toFixed(2)).join(" L"));
      svg.appendChild(path);

      for (let i = 1; i < s.n; i++) {
        const t = i / s.n;
        const x = s.x0 + (s.x1 - s.x0) * t;
        const y = s.y0 + (s.y1 - s.y0) * t + s.sag * 4 * t * (1 - t) + 1.2;
        addLed(host, x, y, Math.random() < 0.3 ? "led--lg" : "");
      }
    });

    // Loose sparkles tucked among the flowers
    for (let i = 0; i < 34; i++) {
      addLed(host, rand(2, 98), rand(4, 96), Math.random() < 0.6 ? "led--sm" : "");
    }
  }

  function addLed(host, x, y, cls) {
    const el = document.createElement("span");
    el.className = "led " + cls;
    el.style.left = x + "%";
    el.style.top = y + "%";
    el.style.setProperty("--dur", rand(1.6, 3.4).toFixed(2) + "s");
    el.style.setProperty("--delay", (-rand(0, 3)).toFixed(2) + "s");
    host.appendChild(el);
  }

  buildLights(document.getElementById("intro-lights"));

  function finish() {
    intro.classList.add("is-done");
    document.body.classList.remove("is-intro");
  }

  window.addEventListener("load", () => {
    setTimeout(() => {
      intro.classList.add("is-open");
      try { sessionStorage.setItem("introSeen", "1"); } catch (e) {}
      setTimeout(finish, 3000);
    }, 1800);
  });
})();

/* ---------- Mobile nav ---------- */
(function () {
  const burger = document.getElementById("nav-burger");
  const links = document.getElementById("nav-links");
  if (!burger || !links) return;

  burger.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    })
  );
})();

/* ---------- Countdown ---------- */
(function () {
  const el = document.getElementById("countdown");
  if (!el) return;
  const target = new Date(CONFIG.startDate + "T00:00:00");
  const units = {
    days: el.querySelector('[data-unit="days"]'),
    hours: el.querySelector('[data-unit="hours"]'),
    minutes: el.querySelector('[data-unit="minutes"]'),
    seconds: el.querySelector('[data-unit="seconds"]'),
  };
  function tick() {
    let diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 864e5); diff -= d * 864e5;
    const h = Math.floor(diff / 36e5);  diff -= h * 36e5;
    const m = Math.floor(diff / 6e4);   diff -= m * 6e4;
    const s = Math.floor(diff / 1e3);
    units.days.textContent = d;
    units.hours.textContent = String(h).padStart(2, "0");
    units.minutes.textContent = String(m).padStart(2, "0");
    units.seconds.textContent = String(s).padStart(2, "0");
  }
  tick();
  setInterval(tick, 1000);
})();

/* ---------- Save the Date (.ics download) ---------- */
(function () {
  function icsDate(ymd) { return ymd.replace(/-/g, ""); }
  function nextDay(ymd) {
    const d = new Date(ymd + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + 1);
    return d.toISOString().slice(0, 10).replace(/-/g, "");
  }
  function esc(s) { return String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,"); }
  function stamp() { return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }

  function buildIcs() {
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Namita and Kabir//Save the Date//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
    ];
    // One all-day event spanning the whole weekend
    lines.push(
      "BEGIN:VEVENT",
      "UID:weekend-" + icsDate(CONFIG.startDate) + "@namita-kabir",
      "DTSTAMP:" + stamp(),
      "DTSTART;VALUE=DATE:" + icsDate(CONFIG.startDate),
      "DTEND;VALUE=DATE:" + nextDay(CONFIG.endDate),
      "SUMMARY:" + esc(CONFIG.coupleNames + " · Wedding Weekend"),
      "LOCATION:" + esc(CONFIG.venue),
      "DESCRIPTION:" + esc("Three days of love, culture and celebration. " + location.href),
      "END:VEVENT"
    );
    // Plus one per celebration
    CONFIG.events.forEach((ev, i) => {
      lines.push(
        "BEGIN:VEVENT",
        "UID:event-" + i + "-" + icsDate(ev.date) + "@namita-kabir",
        "DTSTAMP:" + stamp(),
        "DTSTART;VALUE=DATE:" + icsDate(ev.date),
        "DTEND;VALUE=DATE:" + nextDay(ev.date),
        "SUMMARY:" + esc(CONFIG.coupleNames + " · " + ev.title),
        "LOCATION:" + esc(CONFIG.venue),
        "END:VEVENT"
      );
    });
    lines.push("END:VCALENDAR");
    return lines.join("\r\n");
  }

  document.querySelectorAll(".js-ics").forEach((btn) =>
    btn.addEventListener("click", () => {
      const blob = new Blob([buildIcs()], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "namita-and-kabir-save-the-date.ics";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    })
  );
})();

/* ---------- Events accordion ---------- */
(function () {
  document.querySelectorAll(".event__row").forEach((row) => {
    const body = document.getElementById(row.getAttribute("aria-controls"));
    if (!body) return;
    row.addEventListener("click", () => {
      const open = row.getAttribute("aria-expanded") === "true";
      row.setAttribute("aria-expanded", String(!open));
      body.hidden = open;
    });
  });
})();

/* ---------- RSVP button ---------- */
(function () {
  const btn = document.getElementById("rsvp-btn");
  const note = document.getElementById("rsvp-note");
  if (!btn) return;
  if (CONFIG.rsvpUrl) {
    btn.href = CONFIG.rsvpUrl;
    btn.target = "_blank";
    btn.rel = "noopener";
    if (note) note.hidden = true;
  } else {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (note) {
        note.textContent = "Online RSVPs open with the formal invitation. Thank you for your patience!";
        note.style.color = "var(--rose)";
      }
    });
  }
})();

/* ---------- Falling petals ---------- */
(function () {
  const canvas = document.getElementById("petals");
  if (!canvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = canvas.getContext("2d");
  const hero = canvas.parentElement;
  const PALETTE = [
    ["#e58fb0", "#c4446f"], ["#f0a8c2", "#d0608a"], ["#d9668f", "#a8325c"],
    ["#f4bfd0", "#e07fa3"], ["#c9496f", "#8e2a4d"], ["#f7cdd8", "#e59bb7"],
  ];
  let W = 0, H = 0, dpr = 1, petals = [], running = false, last = 0, raf = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = hero.clientWidth; H = hero.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const target = Math.max(14, Math.min(42, Math.round(W / 38)));
    while (petals.length < target) petals.push(make(true));
    petals.length = target;
  }

  function make(anywhere) {
    const size = 8 + Math.random() * 10;
    const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    return {
      x: Math.random() * W,
      y: anywhere ? Math.random() * H : -size * 2,
      size,
      vy: 18 + Math.random() * 28,              // px per second
      drift: (Math.random() - 0.5) * 18,        // horizontal drift
      swayAmp: 12 + Math.random() * 22,
      swayFreq: 0.6 + Math.random() * 0.9,
      phase: Math.random() * Math.PI * 2,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 1.6,
      tilt: 0.45 + Math.random() * 0.5,         // flutter (fake 3D flip)
      tiltFreq: 1 + Math.random() * 1.5,
      alpha: 0.55 + Math.random() * 0.4,
      light: c[0], dark: c[1],
      t: Math.random() * 10,
    };
  }

  function drawPetal(p) {
    const s = p.size;
    const flip = Math.cos(p.t * p.tiltFreq) * p.tilt + (1 - p.tilt); // 1 → thin
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.scale(1, Math.max(0.25, Math.abs(flip)));
    ctx.globalAlpha = p.alpha;
    const g = ctx.createLinearGradient(-s, 0, s, 0);
    g.addColorStop(0, p.light);
    g.addColorStop(1, p.dark);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * 0.9, -s * 0.8, s * 0.95, s * 0.5, 0, s);
    ctx.bezierCurveTo(-s * 0.95, s * 0.5, -s * 0.9, -s * 0.8, 0, -s);
    ctx.fill();
    // soft vein
    ctx.globalAlpha = p.alpha * 0.35;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.7);
    ctx.quadraticCurveTo(s * 0.12, 0, 0, s * 0.75);
    ctx.stroke();
    ctx.restore();
  }

  function frame(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      p.t += dt;
      p.y += p.vy * dt;
      p.x += (p.drift + Math.cos(p.t * p.swayFreq + p.phase) * p.swayAmp) * dt;
      p.rot += p.rotV * dt;
      if (p.y > H + p.size * 2 || p.x < -40 || p.x > W + 40) petals[i] = make(false);
      drawPetal(p);
    }
    raf = requestAnimationFrame(frame);
  }

  function start() { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
  function stop() { running = false; cancelAnimationFrame(raf); }

  resize();
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((en) => (en[0].isIntersecting ? start() : stop()), { threshold: 0 }).observe(hero);
  } else {
    start();
  }
})();

/* ---------- Reveal on scroll ---------- */
(function () {
  const targets = document.querySelectorAll(
    ".section__head, .arch, .story__art, .story__text, .event, .card, .faq-list, .rsvp__frame"
  );
  if (!("IntersectionObserver" in window)) return;
  targets.forEach((t) => t.classList.add("reveal"));
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
    }),
    { threshold: 0.12 }
  );
  targets.forEach((t) => io.observe(t));
})();
