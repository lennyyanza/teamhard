# HARD — High-Speed Amphibious Responsive Drone

A public project website for Engineering Design VII, Department of Electrical and Computer Engineering, Stevens Institute of Technology, Class of 2027. Research and concept phase, Fall 2026. No advisor or sponsor is confirmed yet.

**Website:** https://lennyyanza.github.io/hard-drone/  
**Repository:** https://github.com/lennyyanza/hard-drone

## Start here: preview on your computer

1. Download this repository with GitHub’s **Code → Download ZIP**, then unzip it (or clone it with Git).
2. Open Terminal in the `hard-drone` folder. Python 3 must be installed.
3. Run:

   ```sh
   python3 -m http.server 8000
   ```

4. Open **http://localhost:8000** in your browser.
5. Edit a file, save it, and refresh the browser. Press Control+C in Terminal to stop the server.

Do not double-click an HTML file. A `file://` page cannot fetch the shared header, footer, or JSON. The console and page will explain how to start the local server. Once downloaded, this site runs locally without internet access; external LinkedIn, GitHub, and research links still need internet. No external fonts, libraries, analytics, or CDN assets are loaded. This is not a service-worker offline cache.

There is no framework, package manager, build step, or npm dependency. HTML defines pages, CSS defines appearance, and a small amount of JavaScript reads the data files.

## Where things live

| File or folder | What to change there |
| --- | --- |
| `index.html` | Home and hero |
| `about.html` | Problem, proposed approach, requirements, and cited precedents |
| `design.html` | Introduction and subsystem rendering container |
| `team.html`, `progress.html`, `gallery.html` | Page framing; their entries come from JSON |
| `contact.html` | Sponsorship and contact links |
| `data/team.json` | Team members and draft bios |
| `data/gallery.json` | Photos, captions, alt text, and categories |
| `data/timeline.json` | Milestones and statuses |
| `data/subsystems.json` | All seven subsystem descriptions and simulation pipeline |
| `partials/header.html`, `partials/footer.html` | Shared navigation and footer |
| `assets/css/theme.css` | Design tokens and light-mode overrides |
| `assets/css/main.css` | Layout and component styles |
| `assets/js/` | Shared partials, data rendering, reveals, gallery lightbox |
| `assets/docs/` | Future approved proposal, reports, and poster PDFs |

## Editing JSON safely

JSON is a list inside square brackets. Each item is an object inside braces. Put a comma **between** items, but not after the last item. Names and text need double quotes. Escape a quotation mark within text as `\"`. JSON cannot contain comments. You can check a file before publishing:

```sh
python3 -m json.tool data/gallery.json
```

To publish a change, save the file and commit it to `main` on GitHub. The website updates after Pages finishes deploying.

## Add a gallery photo

1. Prepare a photo using the guidance in `assets/img/README.md`.
2. Put it in `assets/img/gallery/`, for example `hull-v1-render.jpg`.
3. Add this object to `data/gallery.json`:

   ```json
   {
     "src": "assets/img/gallery/hull-v1-render.jpg",
     "alt": "Side view of the first tail-sitter hull showing the sealed electronics compartment",
     "caption": "Hull concept v1, October 2026",
     "category": "cad"
   }
   ```

4. Refresh the gallery. It appears automatically, including in its filter and the keyboard-accessible lightbox.

Use one of four categories: `cad`, `prototype`, `testing`, `team`. Alt text describes what is visually useful; captions provide context. Replace the initial placeholder entry when you have a real image for that category. The initial SVGs are explicitly labeled placeholders, not project renders or evidence of completed work. A missing file falls back to a technical grid. An empty category shows an explanatory message.

## Add or update a team member

Add an object to `data/team.json`:

```json
{
  "name": "First Last",
  "role": "Electrical Engineering",
  "focus": "Power systems",
  "bio": "Works on power systems and motor electronics.",
  "photo": "assets/img/team/first-last.jpg",
  "linkedin": "https://www.linkedin.com/in/profile-name/",
  "draft": true
}
```

Put the photo at the matching path. Cards are generated automatically. Initials appear when the image is unavailable. Each profile is linked, never scraped. The bio is displayed, with focus used as a fallback if bio is blank.

## Update progress and design content

Milestones in `data/timeline.json` display in the order you write them. `date` uses `YYYY-MM`; `period` is the visitor-facing season, such as `Spring 2027`. Seed month values are approximate sorting metadata, not promised deadlines. Status must be `complete`, `in-progress`, or `planned`. Edit `title`, `description`, and `draft` as needed.

Subsystems live entirely in `data/subsystems.json`. Each needs a unique, kebab-case `id`, a `title`, a short `summary`, and a `details` list of paragraphs. Both the index and full sections render automatically through `assets/js/subsystems.js`. Add another object to add another subsystem; no HTML editing is needed.

## Draft content and engineering review

The supplied problem, approach, timeline, and bios are working copy. Static draft passages have `<!-- DRAFT: team to review -->` immediately above them. Data entries use `"draft": true`; JavaScript inserts that exact HTML comment immediately before each draft bio or milestone in the rendered DOM. Use browser developer tools to inspect those comments. JSON must remain valid, so do not put HTML comments into JSON files. When approved, remove a static draft comment or set the entry’s `draft` to `false`.

Subsystem text preserves the team’s provided research architecture. Validate component selections, control-module assumptions, RF depth figures, sealing processes, and performance targets before treating them as proven specifications. The site identifies these as research-stage assumptions. Precedent descriptions on About link to Rutgers and the AquaMAV research paper.

## Add a page

1. Copy `about.html` to a descriptive name, such as `reports.html`.
2. Keep the shared header/footer placeholders, skip link, stylesheet links, and `include.js`/`reveal.js` scripts.
3. Replace the main content. Use exactly one `h1`; follow it with `h2` section headings, then `h3` subsections.
4. Update the title, description, Open Graph title/description/URL, and canonical URL in the head.
5. Add a link once in `partials/header.html`. It appears on every page, and `include.js` marks it active automatically. Also update the no-JavaScript fallback navigation if you want the new page available there.
6. Preview and follow every new link. Add approved PDFs to `assets/docs/` and link them by their exact filename.

## Change the colors or typography

Open `assets/css/theme.css`. The first palette tokens define the canvas, surface, text, muted text, accent, rules, and navigation. Separate hero palette tokens keep its dark art direction legible in light mode. Font sizes, spacing, control sizes, radii, and motion durations also live here. The `prefers-color-scheme: light` block overrides only tokens; no duplicate component styles are needed.

Keep normal text at least 4.5:1 contrast against its background (3:1 for large text). Keyboard focus uses the accent token. Statuses also have words, so they do not depend on color. All animations and reveals stop under the visitor’s reduced-motion setting. The 768px navigation breakpoint is shared by `main.css` and `include.js`; change both together because CSS variables cannot be used in media-query conditions.

## Replace the hero with a video or photo

In `index.html`, find the single line beginning `<div class="hero-media"`. Replace that entire line with this one line for a video:

```html
<div class="hero-media" aria-hidden="true"><video autoplay muted loop playsinline poster="assets/img/gallery/hero-poster.jpg"><source src="assets/img/gallery/hero.mp4" type="video/mp4"></video></div>
```

Or replace it with one decorative image:

```html
<div class="hero-media" aria-hidden="true"><img src="assets/img/gallery/hero.jpg" alt=""></div>
```

Add the referenced files first. Keep this background decorative: describe meaningful engineering information in the visible page text. Choose a dark image with quiet space behind the headline and check contrast. The default mesh uses only CSS and a lightweight schematic SVG, labeled concept/not to scale. It is not a validated vehicle model.

For video, add a visible pause/play control and show the poster instead of autoplay for `prefers-reduced-motion: reduce` before publishing. The initial website has no video and its CSS motion already respects this preference. Keep footage short and compressed; the 300KB photo guideline does not apply to video.

## Deployment on GitHub Pages

This repository is public. In **Settings → Pages**, the source is **Deploy from a branch**, branch **main**, folder **/(root)**. The root `.nojekyll` file disables Jekyll processing. Pages serves these files directly; no build step or workflow file is needed in this repository.

After a commit reaches `main`, GitHub runs its Pages deployment. Check the repository’s **Actions** tab or **Settings → Pages** for status. The live address is:

https://lennyyanza.github.io/hard-drone/

All local references are relative so the `/hard-drone/` project path works. If the owner or repository name changes, update canonical and Open Graph URLs in each HTML file and the repository links in the footer and contact page.

## Before publishing an update

- Preview over HTTP and open all seven pages.
- Check that new file paths match capitalization exactly.
- Test navigation with keyboard and at a narrow mobile width.
- Try gallery filters, enlarge an image, navigate with arrows, and close with Escape. Focus should return to the image button.
- Confirm that planned work is not described as completed and replace only placeholders for which real images exist.
