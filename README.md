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
| Dates, venue, RSVP link, calendar file | `js/main.js` → the `CONFIG` block at the top |
| All page text (hero, events, travel, FAQ) | `index.html` |
| Colours and fonts | `css/styles.css` → the `:root` variables at the top |
| Pictures | `assets/images/` (see below) |

### RSVP button

The RSVP button shows a "coming soon" note until you paste a link into `rsvpUrl` in `js/main.js`. A Google Form link works well.

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
