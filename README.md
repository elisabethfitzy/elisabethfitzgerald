# Elisabeth Fitzgerald, portfolio site

A single-page portfolio for a working actor. Static HTML, hand-written CSS, a small
script for the interactive bits, and no runtime dependencies. Build and dev server
are plain Node scripts, so there is nothing to install.

```
npm run dev      # builds, serves http://localhost:4173, rebuilds on change
npm run build    # writes the deployable site to dist/
```

Deploy by uploading `dist/` to any static host (Netlify, Vercel, Cloudflare Pages,
GitHub Pages, an S3 bucket, a shared server). There is no server code. For GitHub
Pages, a workflow is included; see `docs/GITHUB-PAGES.md` for the custom-domain
and project-URL options.

## Where everything lives

| What | Where |
| --- | --- |
| All copy, credits, quotes, contact details, image paths | `content/site.js` |
| Photos, reel, poster frame, resume PDF | `content/media/` |
| Layout templates | `src/templates/page.mjs` |
| Styles | `src/styles/main.css` |
| Behaviour (nav, reel, lightbox, form) | `src/scripts/main.js` |
| Self-hosted fonts | `src/assets/fonts/` |
| Build, dev server, resume PDF generator | `src/build.mjs`, `src/dev.mjs`, `src/pdf.mjs` |
| Placeholder media generator (needs ffmpeg) | `tools/make-placeholders.sh` |

The photos, hero, trailer, poster frame, social image and resume PDF in `content/`
are real, and the copy (bio, casting facts, training, credits, contact) was written
from the resume in September 2026. The bio is a first draft for Elisabeth to edit.
There is no press yet, so that section is hidden until `press.quotes` or
`press.awards` has an entry.

## Swapping in real content

**Copy.** Edit `content/site.js`. Each section of the page has a matching block.
The file is commented.

**Photos.** Save each image at two widths into `content/media/photos/`, named
`<base>-<width>.jpg`, for example `headshot-olive-top-big-smile-olive-bg-400.jpg` and
`...-739.jpg`. Then reference it in `content/site.js` with `base`, `widths`, the full
`width` and `height` (for aspect ratio), and `alt` text. The current originals are
726 to 755 pixels wide, so the large size is the native width (never upscaled) and
the small size is 400. Higher-resolution originals can go to 1200 and beyond. The
build writes `srcset` and `sizes` for you, and everything below the hero is lazy-loaded.
Files are sRGB JPEGs; the Display P3 originals in `photos/` were converted on export.

**Hero.** Two crops of the same still: a tall 3:4 one for phones and a 16:9 one for
desktop. The desktop frame keeps the figure at native resolution, right of centre,
on the photo's own backdrop extended sideways. See `hero.still` in the content file.

**Reel.** Drop an MP4 at `content/media/reel/showreel.mp4` and a poster frame at two
widths. The player takes its aspect ratio from the poster size in `content/site.js`
(the current trailer is 4:3). The video is set to `preload="none"`, so no video data
loads until someone taps play. The current file is the 1:29 trailer, H.264 960x720
at about 7.5 MB, encoded from `photos/trailor.MOV` with the editor's outro trimmed.
To use Vimeo instead, set `reel.vimeoId` and leave `reel.sources` empty; the embed is only created after the tap, so Vimeo's player script never loads on
page view.

**Photos.** All twelve studio photos in `photos`, shown as a grid (two across on
phones, three on tablets, four on desktop). Tapping one opens the lightbox, where the
caption shows. Keep the count a multiple of four so the desktop rows come out even.

**Contact up top.** A slim bar under the hero (`reach` in `src/templates/page.mjs`)
shows the availability line, email, phone and the resume link from `contact` and
`resume`, so a casting office never has to scroll for them. "Resume" is also in the
nav (`nav` entries with `external: true` open in a new tab).

**Work.** One card per production in `work.cards`, film first, then stage roles in
resume order. Cards sit in a grid: one column on phones, two on tablets, three on
desktop, with the film card taking two columns (art on the left, credit beside it).
Under each image: type, title, "as Role", company and town, plus an optional `note`.
Card images live in `content/media/cards/` as
`<base>-640.jpg` and `<base>-1280.jpg`, 3:2, tinted to the site palette. The current
ones are public-domain art and photographs from Wikimedia Commons (credited in the
card corner) plus a still from the trailer. To tint a new image the same way:

```
magick in.jpg -resize 1280x853^ -gravity center -extent 1280x853 -colorspace Gray -auto-level \
  -sigmoidal-contrast 2.5x45% +level-colors '#160b0f','#e9c48f' -modulate 92,90 -quality 74 card-<base>-1280.jpg
```

**Press.** `press.quotes` and `press.awards` are empty, so the section and its nav
link are not rendered. Add entries and uncomment the nav item to bring it back.

**Resume.** Put a real PDF at `content/media/Elisabeth-Fitzgerald-Resume.pdf` (the
path in `resume.file`) and it is used as-is. If that file is missing, the build
generates a clean two-page PDF from the cards, training, casting facts and awards in
the content file. The link opens the PDF in a new tab instead of forcing a download,
so it can be read on a phone without digging through a downloads folder.

**Contact form.** Paste the Formspree endpoint (`https://formspree.io/f/xxxxxxxx`)
into `contact.form.endpoint` and messages post in the background and land in
Elisabeth's inbox with the visitor's address as reply-to; the fields give way to a
"Message sent" panel with a drawn check. The subject line comes from
`contact.form.subject` via a hidden `_subject` field. While the endpoint is empty,
submitting opens the visitor's email app with the message pre-filled, addressed to
`contact.form.fallbackTo`. If the post fails, the button re-enables and a line under
it says to email directly. A honeypot field is included.

## Design notes

The site is built around one orchestrated moment: on first load the hero fades up
from black like a projector warming, the letterbox bars slide open, and her name
rises into place as a title card. Everything after that is deliberately still.
The sequence uses only `transform` and `opacity`, so it stays smooth on phones. It is
skipped entirely when the visitor prefers reduced motion or arrives at a deep link
such as `#work`, in which case the hero is simply there. The photo and work grids
have no scroll-triggered motion; the only movement is a slight lift of the image
under the cursor.

Typography is Bodoni Moda (a Didone, the fashion-magazine face) for her name, section
titles and pull quotes, and Hanken Grotesk for everything readable. Both are
self-hosted, subset to Latin, and the display face is preloaded. Dark sections use a
warm oxblood black with tungsten accents; the About and Work sections switch to a
matte silver-screen paper, so scrolling reads like cutting from a screening room to
a magazine feature.

Navigation sits at the bottom of the screen on phones so it is reachable with a
thumb, and moves to the top on larger screens.

## Regenerating placeholders

`FORCE=1 npm run placeholders` rebuilds every placeholder image, the poster frame, a
ten second placeholder reel and the social preview image. It needs `ffmpeg`. Real
media is in place now, so the script refuses to run without `FORCE=1`, because it
would overwrite the hero, poster, reel and social image.
