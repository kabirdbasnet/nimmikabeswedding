# Namita & Kabir · Save the Date

A single-page save-the-date website. Plain HTML, CSS and JavaScript, no build step, ready for GitHub Pages.

## Go live on GitHub Pages

1. Push this repository to GitHub (`main` branch).
2. On GitHub open **Settings → Pages**.
3. Under **Build and deployment**, set *Source* to **Deploy from a branch**, pick **main** and **/ (root)**, then save.
4. After a minute the site is live at `https://kabirdbasnet.github.io/nimmikabeswedding/`.

To use a custom domain later, add it under the same Pages settings and GitHub will create a `CNAME` file for you.

## Edit the content

| What | Where |
| --- | --- |
| Dates, venue, site password, guest emails, RSVP endpoint | `js/main.js` → the `CONFIG` block at the top |
| All page text (hero, events, travel, FAQ) | `index.html` |
| Colours and fonts | `css/styles.css` → the `:root` variables at the top |
| Pictures | `assets/images/` (see below) |

### Site password

Guests see a password screen before the site. The password itself is never stored, only a salted hash in `sitePasswordHash` in `js/main.js`. The default password is **aura2027** — change it before sharing the link:

```powershell
.\tools\hash.ps1 "your-new-password"
```

Paste the output into `sitePasswordHash`. Guests who already signed in with the old password will be asked again.

Honest note: this keeps strangers and search engines from seeing the page, but anyone technical could read the page source. It is not meant to protect secrets, just to keep the site among invited guests.

### RSVP

Guests enter the email their invitation was sent to. The site looks it up in your Google Sheet, greets them by name and shows only the events they're invited to (one, two or all three), each with accept / decline. Responses are saved back to the same sheet.

The guest list lives entirely in the sheet: email, name, a Y per invited event, and the party size they may RSVP for. Setup takes about ten minutes and is described in [`rsvp-backend/README.md`](rsvp-backend/README.md).

Until `rsvpEndpoint` is filled in, the live site tells guests RSVPs open with the formal invitation. On localhost the form runs in a preview mode instead (any email works, invited to everything, nothing saved) so you can see how it looks.

### Images

The pictures in `assets/images/` were cropped from the design mockup, so they are low resolution. Replace each file with a higher-resolution version using the same filename and the site will pick it up automatically.

| File | Used for |
| --- | --- |
| `hero-couple.jpg` | Couple by the lake at the bottom of the hero |
| `corner-left.jpg`, `corner-right.jpg` | Bougainvillea and lanterns in the hero corners |
| `arch-haldi.jpg`, `arch-sangeet.jpg`, `arch-wedding.jpg` | The three arch cards in "Our Wedding Weekend" |
| `ev-haldi.jpg`, `ev-sangeet.jpg`, `ev-wedding.jpg` | Thumbnails in the Events list |
| `story-couple.jpg` | "Our Story" illustration |
| `floral-bl.jpg`, `floral-br.jpg`, `rsvp-fl.jpg`, `rsvp-fr.jpg` | Lotus and foliage decorations |

## Preview locally

Open `index.html` in a browser, or run a tiny server so fonts and the calendar download behave exactly like the live site:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.
