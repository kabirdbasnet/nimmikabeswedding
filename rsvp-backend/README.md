# RSVP backend · Google Sheet + Apps Script

Free, nothing to host. The Google Sheet is your guest list *and* where responses land.

## 1. Make the sheet

Create a new Google Sheet (e.g. **Wedding RSVPs**). Rename the first tab to **Guests** and give it this header row, then one row per guest or household:

| Email | Name | Haldi | Sangeet | Wedding | Max guests |
| --- | --- | --- | --- | --- | --- |
| priya@example.com | Priya & Arjun | Y | Y | Y | 2 |
| uncle@example.com | Rao Uncle & Aunty | | | Y | 2 |
| college@example.com | Sam | | Y | Y | 1 |

- Put **Y** in an event column to invite that guest to it (yes / x / a ticked checkbox also work). Leave it blank to not invite.
- **Max guests** is the party size they may RSVP for. Blank means 1, and the party-size field is then hidden on the site.
- **Name** is used in the greeting: "Hello, Priya & Arjun! You're invited to all three celebrations."
- Emails are matched case-insensitively. Use the address you'll send the invitation to.

## 2. Add the script

In the sheet open **Extensions → Apps Script**, delete the sample code, paste in `Code.gs`, and save.

## 3. Deploy

**Deploy → New deployment**, type **Web app**:
- Execute as: **Me**
- Who has access: **Anyone**

Deploy, approve the permissions (it only reads and writes this one sheet), then copy the **Web app URL** (ends in `/exec`).

Open that URL in a browser; you should see `{"ok":true,"service":"rsvp"}`.

## 4. Connect the site

Paste the URL into `rsvpEndpoint` in `js/main.js`. Done.

## Day to day

- **Add or change a guest**: edit the Guests tab. No code change, takes effect immediately.
- **See replies**: the **Responses** tab appears after the first RSVP. One row per email, with Yes / No / Not invited per event, party size, dietary notes and message. A second submission from the same email updates the row, and the site pre-fills their previous answers.
- **Change the script**: edit in Apps Script, then **Deploy → Manage deployments → pencil icon → Version: New version → Deploy**. The URL stays the same.

## What guests see

1. They enter their email. If it isn't on the Guests tab they're told to check the address or contact you.
2. They're greeted by name and shown only the events they're invited to, each with "Joyfully accept" or "Regretfully decline".
3. They send. You see it in the sheet within seconds.
