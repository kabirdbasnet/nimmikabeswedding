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
| Dates, venue, invitation passwords, RSVP endpoint | `js/main.js` → the `CONFIG` block at the top |
| All page text (hero, events, travel, FAQ) | `index.html` |
| Colours and fonts | `css/styles.css` → the `:root` variables at the top |
| Pictures | `assets/images/` (see below) |

### Invitation passwords

Guests see a password screen before the site. There is one password per combination of events, and the password a guest types decides which events the whole site shows them: the weekend cards, the Events list, the dates in the hero and footer, the countdown, the FAQ answers about dates and dress code, the calendar download and the RSVP form all follow it. Nothing in the link can change that; the only thing stored in the browser is the hash of the password they typed, and the events are looked up from that hash on every visit.

The passwords themselves are never stored in the site, only salted hashes, in `CONFIG.passwords` in `js/main.js`. The defaults are placeholders — change them before sharing the link:

| Default password | Shows |
| --- | --- |
| aura2027 | All three celebrations |
| jasmine2027 | Sangeet and Wedding |
| marigold2027 | Wedding only |
| mogra2027 | Haldi and Wedding |
| lotus2027 | Haldi and Sangeet |
| tulsi2027 | Haldi only |
| champa2027 | Sangeet only |

To change one, make its hash and paste it over the old one in `CONFIG.passwords` (delete the combinations you won't use):

```powershell
.\tools\hash.ps1 "your-new-password"
```

Guests who signed in with an old password will be asked to sign in again. Pick passwords that can't be guessed from each other, so a guest with the "Wedding only" password can't work out the "all three" one.

Honest note: this keeps strangers and search engines from seeing the page, but anyone technical could read the page source and see that other combinations exist (not what their passwords are). It is not meant to protect secrets, just to keep each guest to their own invitation.

### RSVP

The RSVP form asks for first name, last name and how many people the guest is bringing. All three are required, and the events on the reply come from the password they signed in with. Replies go to a Google Sheet through a small Apps Script that checks the password again on its side; setup takes about ten minutes and is described in [`rsvp-backend/README.md`](rsvp-backend/README.md).

Until `rsvpEndpoint` is filled in, the form runs in **preview mode** (`preview: true` in `js/main.js`): it works but saves nothing. Connect the sheet (or set `preview: false`, which shows "RSVPs open with the formal invitation" instead) before sharing the link with guests.

"Have a different invitation? Sign in again" under the RSVP form returns to the password screen. Visiting `/?reset` does the same and replays the flowers.

### Images

The pictures in `assets/images/` were cropped from the design mockup, so they are low resolution. Replace each file with a higher-resolution version using the same filename and the site will pick it up automatically.

| File | Used for |
| --- | --- |
| `hero-scene.jpg` | The whole hero illustration: arch, pillars, lanterns and the couple by the lake. The page text is laid over the sky, so this file must have no text in it. |
| `corner-left.jpg`, `corner-right.jpg` | Bougainvillea and lanterns used by the opening flower curtain |
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
