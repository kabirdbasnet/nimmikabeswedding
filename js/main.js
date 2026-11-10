/* =========================================================
   Namita & Kabir · Save the Date
   Edit the CONFIG block to change dates, venue, passwords or the RSVP link.
   ========================================================= */

const CONFIG = {
  coupleNames: "Namita & Kabir",
  // Dates are local to the venue. Format: YYYY-MM-DD
  startDate: "2027-06-25",
  endDate: "2027-06-27",
  venue: "Aura, Bengaluru",
  events: [
    { key: "haldi",   title: "Haldi & Mehendi",  date: "2027-06-25", dress: "Bright, festive colours. Yellows and florals welcome." },
    { key: "sangeet", title: "Sangeet",          date: "2027-06-26", dress: "Glamorous evening wear. Jewel tones and sparkle encouraged." },
    { key: "wedding", title: "Wedding Ceremony", date: "2027-06-27", dress: "Traditional formal. Pastels, ivory and gold." },
  ],

  /* ---- Invitation passwords ----
     One password per combination of events. The password a guest types decides which events
     the whole site shows them; nothing in the link can change that. Only salted SHA-256 hashes
     live here. Make a hash with tools/hash.ps1 "new-password" (or, in the browser console on
     this site: await weddingHash("new-password")) and paste it in.
     The defaults below are placeholders — change them before sharing the link!
       aura2027     → all three        jasmine2027 → Sangeet + Wedding
       marigold2027 → Wedding only     mogra2027   → Haldi + Wedding
       lotus2027    → Haldi + Sangeet  tulsi2027   → Haldi only
       champa2027   → Sangeet only
     Delete any combination you won't use. */
  hashSalt: "namita-kabir-2027",
  passwords: [
    { label: "All three celebrations", events: ["haldi", "sangeet", "wedding"], hash: "3ec5cc423f6f22f998678f98055d66ab618f5e59df28d14c55616c162e5c9b43" },
    { label: "Sangeet and Wedding",    events: ["sangeet", "wedding"],          hash: "fc14a06965bc29118ea46c7bb9bd06a96a3457cb1c7ff3ae37a7dca795405cca" },
    { label: "Wedding only",           events: ["wedding"],                     hash: "d7afb7db65faf26cfdc5ca91f384b792adeb2eb5868c6d70289107d6d94df809" },
    { label: "Haldi and Wedding",      events: ["haldi", "wedding"],            hash: "8b28e7cdb7e6b0bb7e585c8d64664acc63d36de3704cc0d18e865e2adde261f7" },
    { label: "Haldi and Sangeet",      events: ["haldi", "sangeet"],            hash: "5cd6622b36f4f7339dabcd42fac082c68b9604d60df612f96853df10daf3bae0" },
    { label: "Haldi only",             events: ["haldi"],                       hash: "73b519f69b0025edacb48f35d87c00bb844cac3a4620503cb33c193166deabc7" },
    { label: "Sangeet only",           events: ["sangeet"],                     hash: "c88e9dfcd5df88e47524c8ece4f0f0ce6fd8dc8d90e981b5e557f2495cfb2bde" },
  ],

  /* ---- RSVP ----
     Google Apps Script web-app URL (see rsvp-backend/README.md). Replies land in a Google Sheet,
     and the script checks the password again on its side before saving.
     Leave empty until it's deployed: the form then runs in preview mode and saves nothing. */
  rsvpEndpoint: "",

  // While rsvpEndpoint is empty, let the live site show the RSVP form in preview mode too
  // (nothing is saved). Set to false, or connect the sheet, before sharing the link with guests.
  preview: true,
};

/* ---------- Hashing helper (shared by the gate and the RSVP form) ---------- */
async function weddingHash(value) {
  const text = CONFIG.hashSalt + String(value).trim().toLowerCase();
  // Browsers only expose crypto.subtle on https/localhost; fall back to a JS SHA-256 elsewhere.
  if (window.crypto && crypto.subtle && window.TextEncoder) {
    try {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
      return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch (e) { /* fall through to the JS implementation */ }
  }
  return sha256Hex(text);
}

/* Pure-JS SHA-256 (FIPS 180-4) over the UTF-8 bytes of a string. Only used when crypto.subtle is unavailable. */
function sha256Hex(str) {
  const bytes = window.TextEncoder ? new TextEncoder().encode(str) : Uint8Array.from(unescape(encodeURIComponent(str)), (c) => c.charCodeAt(0));
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];
  let H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const len = bytes.length;
  const padded = new Uint8Array(((len + 9 + 63) >> 6) << 6);
  padded.set(bytes);
  padded[len] = 0x80;
  const bitLen = len * 8;
  padded[padded.length - 4] = (bitLen >>> 24) & 0xff;
  padded[padded.length - 3] = (bitLen >>> 16) & 0xff;
  padded[padded.length - 2] = (bitLen >>> 8) & 0xff;
  padded[padded.length - 1] = bitLen & 0xff;
  const w = new Uint32Array(64);
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));
  for (let off = 0; off < padded.length; off += 64) {
    for (let i = 0; i < 16; i++) {
      const j = off + i * 4;
      w[i] = (padded[j] << 24) | (padded[j + 1] << 16) | (padded[j + 2] << 8) | padded[j + 3];
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, h] = H;
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (h + S1 + ch + K[i] + w[i]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) >>> 0;
      h = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    H = [(H[0] + a) >>> 0, (H[1] + b) >>> 0, (H[2] + c) >>> 0, (H[3] + d) >>> 0, (H[4] + e) >>> 0, (H[5] + f) >>> 0, (H[6] + g) >>> 0, (H[7] + h) >>> 0];
  }
  return H.map((x) => x.toString(16).padStart(8, "0")).join("");
}
window.weddingHash = weddingHash;

/* ---------- Invitation: which password was used, and so which events to show ----------
   The only thing stored in the browser is the hash of the password the guest typed (nk_access).
   On every load the events are looked up from that hash in CONFIG.passwords, never from the
   URL or from anything else a guest could edit. */
const ACCESS_KEY = "nk_access";
// With no backend, the RSVP form runs in preview mode: it looks and behaves the same but saves nothing.
const PREVIEW_MODE = !CONFIG.rsvpEndpoint && (CONFIG.preview || /^(localhost|127\.0\.0\.1)$/.test(location.hostname));
const RSVP_OPEN = Boolean(CONFIG.rsvpEndpoint) || PREVIEW_MODE;

function inviteForHash(hash) {
  const entry = CONFIG.passwords.find((p) => p.hash === hash);
  if (!entry) return null;
  const events = CONFIG.events.filter((ev) => entry.events.includes(ev.key)).map((ev) => ev.key);
  if (!events.length) return null;
  return { hash: entry.hash, label: entry.label || "", events };
}

window.NK_INVITE = null;
try { window.NK_INVITE = inviteForHash(localStorage.getItem(ACCESS_KEY)); } catch (e) {}

// The events to show: the signed-in guest's, or all of them before anyone has signed in.
function invitedEvents() {
  const inv = window.NK_INVITE;
  if (!inv) return CONFIG.events;
  const evs = CONFIG.events.filter((ev) => inv.events.includes(ev.key));
  return evs.length ? evs : CONFIG.events;
}

/* ---------- Date helpers ---------- */
function shiftDate(ymd, days) {
  const d = new Date(ymd + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
function fmtDay(ymd) {
  return new Date(ymd + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric" });
}
function dayOnly(ymd) { return String(Number(ymd.slice(8))); }
// "June 25 – 27, 2027" for consecutive days, "June 25 & 27, 2027" otherwise, "June 27, 2027" for one.
function dateRangeText(evs) {
  const dates = evs.map((ev) => ev.date).sort();
  const year = dates[0].slice(0, 4);
  if (dates.length === 1) return fmtDay(dates[0]) + ", " + year;
  const first = dates[0], last = dates[dates.length - 1];
  const sameMonth = first.slice(0, 7) === last.slice(0, 7);
  const consecutive = dates.every((d, i) => i === 0 || shiftDate(dates[i - 1], 1) === d);
  if (consecutive) return fmtDay(first) + " – " + (sameMonth ? dayOnly(last) : fmtDay(last)) + ", " + year;
  return dates.map((d, i) => (i === 0 || !sameMonth) ? fmtDay(d) : dayOnly(d)).join(" & ") + ", " + year;
}
function joinNames(items) {
  if (items.length <= 1) return items.join("");
  return items.slice(0, -1).join(", ") + " and " + items[items.length - 1];
}

/* ---------- Personalise the page to the signed-in guest ---------- */
function applyInvite() {
  const evs = invitedEvents();
  const keys = evs.map((ev) => ev.key);
  const n = evs.length;
  const words = ["", "One", "Two", "Three"];
  document.documentElement.classList.toggle("is-personalised", Boolean(window.NK_INVITE));

  // Anything tagged data-event="haldi|sangeet|wedding" is shown only to guests invited to it.
  document.querySelectorAll("[data-event]").forEach((el) => {
    el.hidden = !keys.includes(el.getAttribute("data-event"));
  });
  document.querySelectorAll("[data-dates]").forEach((el) => { el.textContent = dateRangeText(evs); });

  const tagline = document.getElementById("hero-tagline");
  if (tagline) tagline.innerHTML = (n === 1 ? "A day" : words[n] + " days") + " of love, culture<br>and celebration";

  const lede = document.getElementById("events-lede");
  if (lede) lede.innerHTML = n === 1
    ? "One day. One celebration.<br>A beautiful journey."
    : words[n] + " days. " + words[n] + " celebrations.<br>One beautiful journey.";

  const faqDates = document.getElementById("faq-dates");
  if (faqDates) {
    const first = evs[0].date, last = evs[n - 1].date;
    faqDates.textContent = (n === 1
      ? "Your celebration is on " + fmtDay(first) + "."
      : "Your celebrations begin on the morning of " + fmtDay(first) + " and wrap up on " + fmtDay(last) + ".")
      + " We suggest arriving by " + fmtDay(shiftDate(first, -1)) + " and leaving on " + fmtDay(shiftDate(last, 1))
      + " to enjoy everything without rushing.";
  }

  const faqWear = document.getElementById("faq-wear");
  if (faqWear) {
    faqWear.textContent = (n > 1 ? "Each event has its own mood. " : "")
      + evs.map((ev) => ev.title + ": " + ev.dress).join(" ")
      + (n > 1 ? " Dress codes are also listed under each event above." : " The dress code is also listed under the event above.");
  }
}
applyInvite();

/* ---------- Password gate ---------- */
(function () {
  const gate = document.getElementById("gate");
  if (!gate) return;
  const form = document.getElementById("gate-form");
  const input = document.getElementById("gate-password");
  const msg = document.getElementById("gate-msg");
  const btn = form.querySelector('button[type="submit"]');

  function unlock() {
    gate.classList.add("is-open");
    document.body.classList.remove("is-gated");
    setTimeout(() => gate.remove(), 700);
    window.dispatchEvent(new Event("nk:unlocked"));
  }

  // Already signed in with a password that still exists: skip the gate.
  if (window.NK_INVITE) {
    gate.remove();
    document.body.classList.remove("is-gated");
    document.documentElement.classList.add("gate-skip");
    return;
  }

  // Not signed in (or the password was changed): show the gate with the flower curtain behind it.
  try { localStorage.removeItem(ACCESS_KEY); } catch (e) {}
  document.documentElement.classList.remove("gate-skip");
  document.documentElement.classList.remove("intro-skip");
  document.body.classList.add("is-gated");
  setTimeout(() => input.focus(), 50);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    msg.textContent = "";
    btn.disabled = true;
    try {
      const invite = inviteForHash(await weddingHash(input.value));
      if (!invite) {
        msg.textContent = "That password doesn't match. Please check your invitation.";
        input.select();
        return;
      }
      window.NK_INVITE = invite;
      try { localStorage.setItem(ACCESS_KEY, invite.hash); } catch (e) {}
      applyInvite();
      unlock();
    } catch (err) {
      msg.textContent = "Something went wrong. Please try again in a moment.";
    } finally {
      btn.disabled = false;
    }
  });
})();

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

  function play(delay) {
    setTimeout(() => {
      intro.classList.add("is-open");
      try { sessionStorage.setItem("introSeen", "1"); } catch (e) {}
      setTimeout(finish, 3000);
    }, delay);
  }

  // If the password gate is showing, the flowers stay closed behind it and bloom open on sign-in.
  if (document.body.classList.contains("is-gated")) {
    window.addEventListener("nk:unlocked", () => play(250), { once: true });
  } else {
    window.addEventListener("load", () => play(1800));
  }
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
  // Counts down to the first event the guest is invited to.
  function targetDate() { return new Date(invitedEvents()[0].date + "T00:00:00"); }
  const units = {
    days: el.querySelector('[data-unit="days"]'),
    hours: el.querySelector('[data-unit="hours"]'),
    minutes: el.querySelector('[data-unit="minutes"]'),
    seconds: el.querySelector('[data-unit="seconds"]'),
  };
  function tick() {
    let diff = Math.max(0, targetDate() - Date.now());
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
    const evs = invitedEvents();
    const start = evs[0].date, end = evs[evs.length - 1].date;
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Namita and Kabir//Save the Date//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
    ];
    // One all-day event spanning the guest's whole stay (skipped when they have a single event)
    if (evs.length > 1) lines.push(
      "BEGIN:VEVENT",
      "UID:weekend-" + icsDate(start) + "@namita-kabir",
      "DTSTAMP:" + stamp(),
      "DTSTART;VALUE=DATE:" + icsDate(start),
      "DTEND;VALUE=DATE:" + nextDay(end),
      "SUMMARY:" + esc(CONFIG.coupleNames + " · Wedding Weekend"),
      "LOCATION:" + esc(CONFIG.venue),
      "DESCRIPTION:" + esc(evs.length + " days of love, culture and celebration. " + location.origin + location.pathname),
      "END:VEVENT"
    );
    // Plus one per celebration the guest is invited to
    evs.forEach((ev, i) => {
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

/* ---------- RSVP: name + party size, for the events the password unlocked ---------- */
(function () {
  const form = document.getElementById("rsvp-form");
  const closed = document.getElementById("rsvp-closed");
  if (!form || !closed) return;

  const msg = document.getElementById("rsvp-msg");
  const submitBtn = form.querySelector('button[type="submit"]');
  const greeting = document.getElementById("rsvp-greeting");
  const back = document.getElementById("rsvp-back");
  const FAILED = "Something went wrong. Please try again in a moment, or message us directly.";
  const DONE_KEY = "nk_rsvp";

  function say(text, kind) {
    msg.textContent = text || "";
    msg.className = "form__msg" + (kind ? " is-" + kind : "");
  }

  // Runs on load and again when the guest signs in at the gate.
  function setup() {
    const invite = window.NK_INVITE;
    form.hidden = !invite || !RSVP_OPEN;
    closed.hidden = !invite || RSVP_OPEN;
    if (form.hidden) return;

    const invitedEvs = CONFIG.events.filter((ev) => invite.events.includes(ev.key));
    greeting.textContent = invitedEvs.length === CONFIG.events.length
      ? "You're invited to all three celebrations: " + joinNames(invitedEvs.map((e) => e.title)) + "."
      : "You're invited to the " + joinNames(invitedEvs.map((e) => e.title)) + ".";

    // Pre-fill a previous reply from this browser.
    let previous = null;
    try { previous = JSON.parse(localStorage.getItem(DONE_KEY)); } catch (e) {}
    if (previous && previous.hash === invite.hash) {
      form.elements.firstName.value = previous.firstName || "";
      form.elements.lastName.value = previous.lastName || "";
      form.elements.bringing.value = previous.bringing == null ? "" : previous.bringing;
      say("We already have your reply. Send again to update it.", "ok");
    } else {
      say(PREVIEW_MODE ? "Preview mode: nothing is saved." : "");
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const invite = window.NK_INVITE;
    if (!invite || !form.reportValidity()) return;

    const data = {
      hash: invite.hash,
      firstName: form.elements.firstName.value.trim(),
      lastName: form.elements.lastName.value.trim(),
      bringing: Math.max(0, Math.min(20, Math.round(Number(form.elements.bringing.value)))),
    };
    if (!data.firstName || !data.lastName) {
      say("Please enter your first and last name.", "error");
      return;
    }

    submitBtn.disabled = true;
    say("Sending your RSVP…");
    try {
      let out = { ok: true };
      if (!PREVIEW_MODE) {
        const res = await fetch(CONFIG.rsvpEndpoint, { method: "POST", body: JSON.stringify(data) });
        out = await res.json();
      }
      if (out.ok) {
        try { localStorage.setItem(DONE_KEY, JSON.stringify(data)); } catch (e) {}
        say("Thank you, " + data.firstName + "! We can't wait to celebrate with you."
          + (PREVIEW_MODE ? " (Preview mode: nothing was saved.)" : ""), "ok");
      } else if (out.error === "bad_password") {
        say("Your sign-in has expired. Please sign in again with the password from your invitation.", "error");
      } else {
        say(FAILED, "error");
      }
    } catch (err) {
      say(FAILED, "error");
    } finally {
      submitBtn.disabled = false;
    }
  });

  // "Different invitation?" signs the guest out and returns to the password screen.
  back.addEventListener("click", () => {
    try { localStorage.removeItem(ACCESS_KEY); } catch (e) {}
    location.href = location.pathname;
  });

  setup();
  window.addEventListener("nk:unlocked", setup);
})();

/* ---------- Falling petals (hero and RSVP) ---------- */
const ROSE_PETALS = [
  ["#e58fb0", "#c4446f"], ["#f0a8c2", "#d0608a"], ["#d9668f", "#a8325c"],
  ["#f4bfd0", "#e07fa3"], ["#c9496f", "#8e2a4d"], ["#f7cdd8", "#e59bb7"],
];
const RED_PETALS = [
  ["#d9506d", "#8e1f3a"], ["#c43a55", "#6e1428"],
];

function startPetals(canvas, PALETTE) {
  if (!canvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = canvas.getContext("2d");
  const hero = canvas.parentElement;
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
}
startPetals(document.getElementById("petals"), ROSE_PETALS);
startPetals(document.getElementById("rsvp-petals"), ROSE_PETALS.concat(RED_PETALS));

/* ---------- Reveal on scroll ---------- */
(function () {
  const targets = document.querySelectorAll(
    ".section__head, .arch, .proposal__frame, .event, .card, .faq-list, .rsvp__frame"
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
