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
