/**
 * Namita & Kabir · RSVP backend (Google Apps Script)
 *
 * The Google Sheet holds the invitation passwords and collects the replies.
 *
 *   Passwords tab (you maintain this) — header row, then one row per password:
 *     A Password | B Label | C Haldi | D Sangeet | E Wedding
 *     Put Y (or yes / x / a ticked checkbox) in an event column to include that event.
 *     The same passwords, hashed, live in CONFIG.passwords in js/main.js: the site uses them
 *     to decide what a guest sees, and this script checks them again before saving a reply.
 *
 *   Responses tab (created automatically) — one row per guest name per password,
 *     updated when the same guest submits again.
 *
 * Setup: see rsvp-backend/README.md
 */

var PASSWORD_SHEET = "Passwords";
var RESPONSE_SHEET = "Responses";
var HASH_SALT = "namita-kabir-2027"; // must match CONFIG.hashSalt in js/main.js

// Order matters: matches columns C, D, E of the Passwords tab and the event keys in js/main.js.
var EVENTS = [
  { key: "haldi",   label: "Haldi" },
  { key: "sangeet", label: "Sangeet" },
  { key: "wedding", label: "Wedding" },
];

var RESPONSE_HEADERS = ["Submitted", "First name", "Last name", "Bringing", "Total people", "Invitation", "Haldi", "Sangeet", "Wedding", "Updated"];

/* ---------- GET: health check ---------- */
function doGet() {
  return reply({ ok: true, service: "rsvp" });
}

/* ---------- Submit: POST JSON body { hash, firstName, lastName, bringing } ---------- */
function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply({ ok: false, error: "bad_request" });
  }

  var firstName = clip(data.firstName, 60);
  var lastName = clip(data.lastName, 60);
  if (!firstName || !lastName) return reply({ ok: false, error: "missing_name" });
  var bringing = Math.max(0, Math.min(20, Math.round(Number(data.bringing) || 0)));

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var invite = findInvite(ss, String(data.hash || ""));
    if (!invite) return reply({ ok: false, error: "bad_password" });

    var sheet = ss.getSheetByName(RESPONSE_SHEET);
    if (!sheet) {
      sheet = ss.insertSheet(RESPONSE_SHEET);
      sheet.appendRow(RESPONSE_HEADERS);
      sheet.setFrozenRows(1);
    }

    var now = new Date();
    var row = [now, firstName, lastName, bringing, bringing + 1, invite.label]
      .concat(EVENTS.map(function (ev) { return invite.events.indexOf(ev.key) === -1 ? "" : "Yes"; }))
      .concat([now]);

    var existing = findRow(sheet, firstName, lastName, invite.label);
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
// Hash every password in the Passwords tab the same way the site does and look for a match.
function findInvite(ss, hash) {
  if (!/^[0-9a-f]{64}$/.test(hash)) return null;
  var sheet = ss.getSheetByName(PASSWORD_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return null;
  var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();
  for (var i = 0; i < rows.length; i++) {
    var password = normalize(rows[i][0]);
    if (!password || weddingHash(password) !== hash) continue;
    var events = [];
    EVENTS.forEach(function (ev, idx) { if (truthy(rows[i][2 + idx])) events.push(ev.key); });
    if (!events.length) return null;
    return { label: String(rows[i][1] || "").trim() || events.join(" + "), events: events };
  }
  return null;
}

function weddingHash(password) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, HASH_SALT + password, Utilities.Charset.UTF_8);
  return bytes.map(function (b) { return ("0" + (b & 0xff).toString(16)).slice(-2); }).join("");
}

function findRow(sheet, firstName, lastName, label) {
  var last = sheet.getLastRow();
  if (last < 2) return -1;
  var rows = sheet.getRange(2, 2, last - 1, 5).getValues(); // First name, Last name, Bringing, Total, Invitation
  for (var i = 0; i < rows.length; i++) {
    if (normalize(rows[i][0]) === normalize(firstName) && normalize(rows[i][1]) === normalize(lastName) && String(rows[i][4]) === label) return i + 2;
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
