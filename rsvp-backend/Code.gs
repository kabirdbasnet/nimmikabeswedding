/**
 * Namita & Kabir · RSVP backend (Google Apps Script)
 *
 * The Google Sheet is the guest list and the RSVP store.
 *
 *   Guests tab (you maintain this) — header row, then one guest/party per row:
 *     A Email | B Name | C Haldi | D Sangeet | E Wedding | F Max guests
 *     Put Y (or yes / x / a ticked checkbox) in an event column to invite that guest to it.
 *     Max guests is the party size they may RSVP for; blank means 1.
 *
 *   Responses tab (created automatically) — one row per email, updated on re-submit.
 *
 * This is the real access check: the browser only shows what this script returns.
 * Setup: see rsvp-backend/README.md
 */

var GUEST_SHEET = "Guests";
var RESPONSE_SHEET = "Responses";

// Order matters: matches columns C, D, E of the Guests tab and the event keys in js/main.js.
var EVENTS = [
  { key: "haldi",   label: "Haldi" },
  { key: "sangeet", label: "Sangeet" },
  { key: "wedding", label: "Wedding" },
];

var RESPONSE_HEADERS = ["Submitted", "Email", "Name", "Haldi", "Sangeet", "Wedding", "Guests", "Dietary", "Message", "Updated"];

/* ---------- Lookup: GET ?email=... ---------- */
function doGet(e) {
  var email = normalize(e && e.parameter && e.parameter.email);
  if (!email) return reply({ ok: true, service: "rsvp" });

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var guest = findGuest(ss, email);
  if (!guest) return reply({ ok: true, invited: false });

  return reply({
    ok: true,
    invited: true,
    name: guest.name,
    events: guest.events,
    maxGuests: guest.maxGuests,
    response: findResponse(ss, email),
  });
}

/* ---------- Submit: POST JSON body ---------- */
function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply({ ok: false, error: "bad_request" });
  }

  var email = normalize(data.email);
  if (!email || email.indexOf("@") === -1) return reply({ ok: false, error: "missing_email" });

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var guest = findGuest(ss, email);
    if (!guest) return reply({ ok: false, error: "not_invited" });

    var sheet = ss.getSheetByName(RESPONSE_SHEET);
    if (!sheet) {
      sheet = ss.insertSheet(RESPONSE_SHEET);
      sheet.appendRow(RESPONSE_HEADERS);
      sheet.setFrozenRows(1);
    }

    var answers = (data.events && typeof data.events === "object") ? data.events : {};
    var eventCells = EVENTS.map(function (ev) {
      if (guest.events.indexOf(ev.key) === -1) return "Not invited";
      return answers[ev.key] === "yes" ? "Yes" : "No";
    });

    var now = new Date();
    var row = [now, email, guest.name]
      .concat(eventCells)
      .concat([
        Math.max(1, Math.min(guest.maxGuests, Number(data.guests) || 1)),
        clip(data.dietary, 200),
        clip(data.message, 500),
        now,
      ]);

    var existing = findRowByEmail(sheet, email);
    if (existing > 0) {
      row[0] = sheet.getRange(existing, 1).getValue(); // keep the original submit time
      sheet.getRange(existing, 1, 1, row.length).setValues([row]);
    } else {
      sheet.appendRow(row);
    }
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: "server_error", detail: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/* ---------- Helpers ---------- */
function findGuest(ss, email) {
  var sheet = ss.getSheetByName(GUEST_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return null;
  var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).getValues();
  for (var i = 0; i < rows.length; i++) {
    if (normalize(rows[i][0]) !== email) continue;
    var events = [];
    EVENTS.forEach(function (ev, idx) { if (truthy(rows[i][2 + idx])) events.push(ev.key); });
    return {
      name: String(rows[i][1] || "").trim(),
      events: events,
      maxGuests: Math.max(1, Number(rows[i][5]) || 1),
    };
  }
  return null;
}

function findResponse(ss, email) {
  var sheet = ss.getSheetByName(RESPONSE_SHEET);
  if (!sheet) return null;
  var rowIndex = findRowByEmail(sheet, email);
  if (rowIndex < 0) return null;
  var r = sheet.getRange(rowIndex, 1, 1, RESPONSE_HEADERS.length).getValues()[0];
  var events = {};
  EVENTS.forEach(function (ev, idx) {
    var v = String(r[3 + idx]);
    if (v === "Yes") events[ev.key] = "yes";
    else if (v === "No") events[ev.key] = "no";
  });
  return { events: events, guests: Number(r[6]) || 1, dietary: String(r[7] || ""), message: String(r[8] || "") };
}

function findRowByEmail(sheet, email) {
  var last = sheet.getLastRow();
  if (last < 2) return -1;
  var emails = sheet.getRange(2, 2, last - 1, 1).getValues();
  for (var i = 0; i < emails.length; i++) {
    if (normalize(emails[i][0]) === email) return i + 2;
  }
  return -1;
}

function truthy(v) {
  if (v === true) return true;
  return /^(y|yes|x|1|true)$/i.test(String(v == null ? "" : v).trim());
}

function normalize(v) {
  return String(v == null ? "" : v).trim().toLowerCase();
}

function clip(value, max) {
  return String(value == null ? "" : value).trim().slice(0, max);
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
