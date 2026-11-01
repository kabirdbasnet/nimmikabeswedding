# RSVP backend · Google Sheet + Apps Script

Free, nothing to host. The Google Sheet holds your invitation passwords *and* is where replies land.

## 1. Make the sheet

Create a new Google Sheet (e.g. **Wedding RSVPs**). Rename the first tab to **Passwords** and give it this header row, then one row per password:

| Password | Label | Haldi | Sangeet | Wedding |
| --- | --- | --- | --- | --- |
| aura2027 | All three celebrations | Y | Y | Y |
| jasmine2027 | Sangeet and Wedding | | Y | Y |
| marigold2027 | Wedding only | | | Y |

- Put **Y** in an event column to include that event (yes / x / a ticked checkbox also work).
- **Label** is what you'll see in the Responses tab next to each reply.
- These must be the same passwords whose hashes are in `CONFIG.passwords` in `js/main.js` (see the main README). The site decides what a guest sees from the hash; this script re-checks the hash against this tab before saving, so a reply can't be forged for events a password doesn't include.
- Only the sheet owner can see this tab. Passwords are never sent to the browser; the site only ever sends their hash.

## 2. Add the script

In the sheet open **Extensions → Apps Script**, delete the sample code, paste in `Code.gs`, and save. If you changed `hashSalt` in `js/main.js`, change `HASH_SALT` at the top of the script to match.

## 3. Deploy

**Deploy → New deployment**, type **Web app**:
- Execute as: **Me**
- Who has access: **Anyone**

Deploy, approve the permissions (it only reads and writes this one sheet), then copy the **Web app URL** (ends in `/exec`).

Open that URL in a browser; you should see `{"ok":true,"service":"rsvp"}`.

## 4. Connect the site

Paste the URL into `rsvpEndpoint` in `js/main.js`. Done.

## Day to day

- **See replies**: the **Responses** tab appears after the first RSVP. Each row has first name, last name, how many people they're bringing, the total including themselves, which invitation (label) they used, and a Yes under each event that invitation covers. A second submission with the same name and password updates the row.
- **Change a password**: update it in the Passwords tab *and* put its new hash in `js/main.js` (`.\tools\hash.ps1 "new-password"`). Guests signed in with the old one will be asked to sign in again.
- **Change the script**: edit in Apps Script, then **Deploy → Manage deployments → pencil icon → Version: New version → Deploy**. The URL stays the same.

## What guests see

1. A password screen. The password on their invitation unlocks the site and decides which events they see: the weekend cards, Events list, dates, countdown, FAQ answers and calendar download all follow it. There is nothing in the link they can change to see a different set.
2. The RSVP section names their events and asks for first name, last name and how many people they're bringing. All three are required.
3. They send. You see it in the sheet within seconds.
