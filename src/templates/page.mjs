// Renders the whole page from the content object. Pure functions returning HTML strings.
// Layout lives here and in src/styles/main.css; copy lives in content/site.js.

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const photoPath = (p, w, dir = "photos") => `media/${dir}/${p.base}-${w}.jpg`;
const srcset = (p, dir = "photos") => p.widths.map((w) => `${photoPath(p, w, dir)} ${w}w`).join(", ");
const smallest = (p) => Math.min(...p.widths);
const tel = (s) => `tel:${String(s).replace(/[^\d+]/g, "")}`;
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const icons = {
  play: `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path d="M7 4.5v15l12-7.5z" fill="currentColor"/></svg>`,
  prev: `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  next: `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  close: `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  check: `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path class="check__path" d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  open: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M14 5h5v5M19 5l-8 8M17 14v5H5V7h5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

const favicon = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="8" fill="#160B0F"/><text x="32" y="46" text-anchor="middle" font-family="Bodoni 72,Didot,Georgia,serif" font-size="40" fill="#F4EFE7">E</text></svg>`,
)}`;

export function renderPage(site, assets) {
  const name = `${site.person.firstName} ${site.person.lastName}`;
  const url = site.meta.url.replace(/\/$/, "") + "/";
  return `<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(site.meta.title)}</title>
<meta name="description" content="${esc(site.meta.description)}">
<meta name="theme-color" content="#160B0F">
<link rel="canonical" href="${esc(url)}">
<link rel="icon" href="${favicon}">
<meta property="og:type" content="profile">
<meta property="og:title" content="${esc(site.meta.title)}">
<meta property="og:description" content="${esc(site.meta.description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(url + site.meta.ogImage)}">
<meta property="og:locale" content="${esc(site.meta.locale)}">
<meta name="twitter:card" content="summary_large_image">
<script>
document.documentElement.classList.replace("no-js","js");
if(!location.hash&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("reveal");
</script>
<link rel="preload" href="assets/fonts/bodoni-moda-latin-opsz-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/hanken-grotesk-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" as="image" imagesrcset="${esc(srcset(site.hero.still.portrait))}" imagesizes="100vw" media="(orientation: portrait)">
<link rel="preload" as="image" imagesrcset="${esc(srcset(site.hero.still.landscape))}" imagesizes="100vw" media="(orientation: landscape)">
<link rel="stylesheet" href="${esc(assets.css)}">
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle: "Actor",
    url,
    image: url + site.meta.ogImage,
    ...(site.contact.socials?.length ? { sameAs: site.contact.socials.map((s) => s.url) } : {}),
  })}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${header(site, name)}
<main id="main">
${hero(site)}
${reach(site)}
${about(site)}
${reel(site)}
${work(site)}
${press(site)}
${contact(site)}
</main>
${footer(site, name)}
${lightbox()}
<script src="${esc(assets.js)}" defer></script>
</body>
</html>
`;
}

function header(site, name) {
  return `<header class="site-head">
  <a class="site-head__name" href="#top">${esc(name)}</a>
  <nav class="site-nav" aria-label="Sections">
    <ul>
      ${site.nav.map((n) => (n.external ? `<li><a href="${esc(n.href)}" target="_blank" rel="noopener">${esc(n.label)}<span class="visually-hidden"> (PDF, opens in a new tab)</span></a></li>` : `<li><a href="${esc(n.href)}">${esc(n.label)}</a></li>`)).join("\n      ")}
    </ul>
  </nav>
</header>`;
}

function hero(site) {
  const { portrait, landscape, alt } = site.hero.still;
  return `<section class="hero" id="top" aria-label="Introduction">
  <picture class="hero__still">
    <source media="(orientation: landscape)" srcset="${esc(srcset(landscape))}" sizes="100vw" width="${landscape.width}" height="${landscape.height}">
    <img src="${esc(photoPath(portrait, smallest(portrait)))}" srcset="${esc(srcset(portrait))}" sizes="100vw" width="${portrait.width}" height="${portrait.height}" alt="${esc(alt)}" fetchpriority="high" decoding="async">
  </picture>
  <div class="hero__bar hero__bar--top" aria-hidden="true"></div>
  <div class="hero__bar hero__bar--bottom" aria-hidden="true"></div>
  <div class="hero__content">
    <h1 class="hero__name"><span class="hero__line"><span>${esc(site.person.firstName)}</span></span>
<span class="hero__line"><span>${esc(site.person.lastName)}</span></span></h1>
    <p class="hero__tagline">${esc(site.person.tagline)}</p>
    <a class="hero__reel" href="#reel" data-play-reel>
      <span class="play-glyph" aria-hidden="true">${icons.play}</span>
      <span class="hero__reel-label">${esc(site.hero.reelLabel)}</span>
      <span class="hero__reel-duration">${esc(site.hero.reelDuration)}</span>
    </a>
  </div>
</section>`;
}

/* Slim bar under the hero: how to reach her and the resume, before anything else. */
function reach(site) {
  const c = site.contact;
  const d = c.direct || {};
  return `<section class="reach" aria-label="Contact and resume">
  <div class="wrap reach__row">
    <p class="reach__status"><span class="contact__light" aria-hidden="true"></span>${esc(c.status)}</p>
    <ul class="reach__links">
      ${d.email ? `<li><a href="mailto:${esc(d.email)}">${esc(d.email)}</a></li>` : ""}
      ${d.phone ? `<li><a href="${esc(tel(d.phone))}">${esc(d.phone)}</a></li>` : ""}
      <li><a class="reach__resume" href="${esc(site.resume.file)}" target="_blank" rel="noopener">${icons.open}<span>Resume<span class="visually-hidden"> (PDF, opens in a new tab)</span></span></a></li>
    </ul>
  </div>
</section>`;
}

function about(site) {
  const a = site.about;
  const h = a.headshot;
  return `<section class="section section--light about" id="about">
  <div class="wrap">
    <h2 class="section__title">About</h2>
    <div class="about__grid">
      <figure class="about__headshot">
        <img src="${esc(photoPath(h, smallest(h)))}" srcset="${esc(srcset(h))}" sizes="(min-width: 880px) 38vw, 100vw" width="${h.width}" height="${h.height}" alt="${esc(h.alt)}" loading="lazy" decoding="async">
        ${h.credit ? `<figcaption>${esc(h.credit)}</figcaption>` : ""}
      </figure>
      <div class="about__text">
        ${a.lead ? `<p class="about__lead">${esc(a.lead)}</p>` : ""}
        <div class="prose">
          ${a.bio.map((p) => `<p>${esc(p)}</p>`).join("\n          ")}
        </div>
      </div>
      <dl class="facts" aria-label="Casting details">
        ${a.facts.map((f) => `<div class="facts__row"><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join("\n        ")}
      </dl>
      <div class="training">
        <h3>Training</h3>
        <ul>
          ${a.training.map((t) => `<li><span class="training__when">${esc(t.when)}</span><span class="training__what">${esc(t.what)}<br><span class="training__where">${esc(t.where)}</span></span></li>`).join("\n          ")}
        </ul>
      </div>
    </div>
  </div>
</section>`;
}

function reel(site) {
  const r = site.reel;
  const p = r.poster;
  const posterSmall = photoPath(p, smallest(p), "reel");
  const media = r.vimeoId
    ? `<div class="player__embed" data-vimeo="${esc(r.vimeoId)}" data-title="${esc(r.title)}"></div>`
    : `<video class="player__video" preload="none" playsinline controls poster="${esc(posterSmall)}" width="${p.width}" height="${p.height}" aria-label="${esc(r.title)}">
        ${r.sources.map((s) => `<source src="${esc(s.src)}" type="${esc(s.type)}">`).join("\n        ")}
        ${r.captions ? `<track kind="captions" src="${esc(r.captions)}" srclang="en" label="English">` : ""}
        Your browser can't play this video. <a href="${esc(r.sources[0]?.src ?? "#")}">Download the reel</a>.
      </video>`;
  return `<section class="section section--dark reel" id="reel">
  <div class="wrap">
    <h2 class="section__title">${esc(r.heading || "Reel and photos")}</h2>
    <div class="player" data-player style="--ar: ${p.width} / ${p.height}; --player-w: ${p.width}px">
      ${media}
      <button class="player__cover" type="button" data-play aria-label="Play, ${esc(site.hero.reelDuration)}. ${esc(r.title)}">
        <img src="${esc(posterSmall)}" srcset="${esc(srcset(p, "reel"))}" sizes="(min-width: 1200px) 1140px, 100vw" width="${p.width}" height="${p.height}" alt="${esc(r.posterAlt)}" loading="lazy" decoding="async">
        <span class="player__cover-ui" aria-hidden="true"><span class="play-glyph play-glyph--large">${icons.play}</span><span class="player__cover-text">Play, ${esc(site.hero.reelDuration)}</span></span>
      </button>
    </div>
    <p class="player__meta">${esc(r.title)}. ${esc(r.description)}</p>
${photos(site)}
  </div>
</section>`;
}

function photos(site) {
  const items = site.photos.map((p, i) => {
    return `<li class="photos__item">
          <button class="photos__button" type="button" data-index="${i}" data-src="${esc(photoPath(p, Math.max(...p.widths)))}" data-srcset="${esc(srcset(p))}" data-alt="${esc(p.alt)}" data-caption="${esc(p.caption)}" data-credit="${esc(p.credit ?? "")}" data-w="${p.width}" data-h="${p.height}" aria-label="Open photo ${i + 1} of ${site.photos.length}: ${esc(p.caption)}">
            <img src="${esc(photoPath(p, smallest(p)))}" srcset="${esc(srcset(p))}" sizes="(min-width: 1200px) 280px, (min-width: 880px) 30vw, 50vw" width="${p.width}" height="${p.height}" alt="${esc(p.alt)}" loading="lazy" decoding="async">
          </button>
        </li>`;
  });
  return `    <div class="photos">
      <h3 class="photos__title">Photos</h3>
      <ul class="photos__grid">
        ${items.join("\n        ")}
      </ul>
    </div>`;
}

function work(site) {
  const w = site.work;
  const typeLabel = Object.fromEntries(site.creditTypes.map((t) => [t.key, t.label]));
  const cards = w.cards.map((c) => {
    const img = c.image;
    const wide = c.type === "film";
    const picture = img
      ? `<div class="card__art">
            <img src="${esc(photoPath(img, smallest(img), "cards"))}" srcset="${esc(srcset(img, "cards"))}" sizes="${wide ? "(min-width: 1200px) 760px, (min-width: 880px) 62vw, 100vw" : "(min-width: 1200px) 370px, (min-width: 880px) 30vw, (min-width: 600px) 50vw, 100vw"}" width="${img.width}" height="${img.height}" alt="${esc(img.alt)}" loading="lazy" decoding="async">
            ${img.credit ? `<p class="card__credit">${esc(img.credit)}</p>` : ""}
          </div>`
      : "";
    const where = [c.company, c.place].filter(Boolean).map(esc).join(". ");
    return `<li class="card${wide ? " card--wide" : ""}">
        <article aria-label="${esc(c.title)}, ${esc(c.role)}">
          ${picture}
          <div class="card__caption">
            <p class="card__type">${esc(typeLabel[c.type] ?? c.type)}</p>
            <h3 class="card__title">${esc(c.title)}</h3>
            <p class="card__role">${esc(c.role)}</p>
            ${where ? `<p class="card__where">${where}</p>` : ""}
            ${c.note ? `<p class="card__note">${esc(c.note)}</p>` : ""}
          </div>
        </article>
      </li>`;
  });
  return `<section class="section section--light work" id="work">
  <div class="wrap">
    <div class="work__head">
      <h2 class="section__title">Work</h2>
      <a class="button button--primary" href="${esc(site.resume.file)}" target="_blank" rel="noopener">${icons.open}<span>${esc(site.resume.label)}<span class="visually-hidden"> (opens in a new tab)</span></span></a>
    </div>
    ${w.intro ? `<p class="work__intro">${esc(w.intro)}</p>` : ""}
    <ol class="cards" aria-label="Credits">
      ${cards.join("\n      ")}
    </ol>
  </div>
</section>`;
}

function press(site) {
  if (!site.press?.quotes?.length && !site.press?.awards?.length) return "";
  const quotes = site.press.quotes.map((q, i) => {
    const stars = q.stars
      ? `<span class="quote__stars" role="img" aria-label="${q.stars} out of 5 stars">${"★".repeat(q.stars)}</span>`
      : "";
    const pub = q.url ? `<a class="quote__pub" href="${esc(q.url)}" rel="noopener">${esc(q.publication)}</a>` : `<span class="quote__pub">${esc(q.publication)}</span>`;
    return `<li class="quote${i === 0 ? " quote--lead" : ""}">
        <blockquote class="quote__text"${q.url ? ` cite="${esc(q.url)}"` : ""}><p>${esc(q.quote)}</p></blockquote>
        <p class="quote__source">${stars}${pub}<span class="quote__about">on ${esc(q.about)}</span></p>
      </li>`;
  });
  const awards = site.press.awards.map(
    (a) => `<li><span class="awards__year">${esc(a.year)}</span><span class="awards__what"><strong>${esc(a.result)}, ${esc(a.award)}</strong><br>${esc(a.body)}, for ${esc(a.for)}</span></li>`,
  );
  return `<section class="section section--dark press" id="press">
  <div class="wrap">
    <h2 class="section__title">Press</h2>
    ${quotes.length ? `<ul class="quotes">
      ${quotes.join("\n      ")}
    </ul>` : ""}
    ${awards.length ? `<div class="awards">
      <h3>Awards and nominations</h3>
      <ul>
        ${awards.join("\n        ")}
      </ul>
    </div>` : ""}
  </div>
</section>`;
}

function contact(site) {
  const c = site.contact;
  const reps = c.representation.map(
    (r) => `<div class="rep">
          <h3 class="rep__role">${esc(r.role)}</h3>
          <p class="rep__name">${esc(r.name)}</p>
          <p class="rep__company">${esc(r.company)}</p>
          <a class="rep__link" href="mailto:${esc(r.email)}">${esc(r.email)}</a>
          <a class="rep__link" href="${esc(tel(r.phone))}">${esc(r.phone)}</a>
        </div>`,
  );
  const f = c.form;
  const primary = c.representation[0];
  const d = c.direct;
  const direct = d
    ? `<div class="rep">
          <h3 class="rep__role">${esc(d.label || "Direct")}</h3>
          <p class="rep__name">${esc(d.name || `${site.person.firstName} ${site.person.lastName}`)}</p>
          ${d.note ? `<p class="rep__company">${esc(d.note)}</p>` : ""}
          ${d.email ? `<a class="rep__link" href="mailto:${esc(d.email)}">${esc(d.email)}</a>` : ""}
          ${d.phone ? `<a class="rep__link" href="${esc(tel(d.phone))}">${esc(d.phone)}</a>` : ""}
        </div>`
    : "";
  return `<section class="section section--dark contact" id="contact">
  <div class="wrap">
    <h2 class="section__title">Contact</h2>
    <p class="contact__status"><span class="contact__light" aria-hidden="true"></span>${esc(c.status)}</p>
    <p class="contact__detail">${esc(c.statusDetail)}</p>
    <div class="contact__grid">
      <div class="reps">
        ${[direct, ...reps].filter(Boolean).join("\n        ")}
      </div>
      <form class="contact-form" data-contact-form data-endpoint="${esc(f.endpoint)}" data-fallback="${esc(f.fallbackTo || d?.email || primary?.email || "")}" data-subject="${esc(f.subject)}" data-sending="${esc(f.sendingLabel || "Sending")}" action="${esc(f.endpoint || `mailto:${f.fallbackTo || d?.email || primary?.email || ""}`)}" method="post">
        <h3 class="contact-form__title">${esc(f.heading)}</h3>
        <input type="hidden" name="_subject" value="${esc(f.subject)}">
        <div class="field"><label for="cf-name">Your name</label><input id="cf-name" name="name" type="text" autocomplete="name" required></div>
        <div class="field"><label for="cf-email">Your email</label><input id="cf-email" name="email" type="email" autocomplete="email" inputmode="email" required></div>
        <div class="field"><label for="cf-message">Message</label><textarea id="cf-message" name="message" rows="5" required></textarea></div>
        <div class="field field--trap" aria-hidden="true"><label for="cf-company">Company</label><input id="cf-company" name="_gotcha" type="text" tabindex="-1" autocomplete="off"></div>
        <div class="contact-form__actions">
          <button class="button button--primary" type="submit">${esc(f.submitLabel)}</button>
          <p class="contact-form__status" data-status role="status" aria-live="polite"></p>
        </div>
        <div class="contact-form__done" data-done hidden tabindex="-1">
          <span class="contact-form__check" aria-hidden="true">${icons.check}</span>
          <p><strong>${esc(f.sentTitle || "Message sent")}</strong><br>${esc(f.sentMessage)}</p>
        </div>
      </form>
    </div>
    ${c.socials?.length ? `<ul class="socials" aria-label="Elsewhere">
      ${c.socials.map((s) => `<li><a href="${esc(s.url)}" rel="noopener"><span class="socials__label">${esc(s.label)}</span><span class="socials__handle">${esc(s.handle)}</span></a></li>`).join("\n      ")}
    </ul>` : ""}
  </div>
</section>`;
}

function footer(site, name) {
  return `<footer class="site-foot">
  <div class="wrap">
    <p class="site-foot__name">${esc(name)}</p>
    <p class="site-foot__line">${esc(site.footer.line)}</p>
    <p class="site-foot__meta">© ${new Date().getFullYear()} ${esc(name)}. <a href="#top">Back to top</a></p>
  </div>
</footer>`;
}

function lightbox() {
  return `<dialog class="lightbox" data-lightbox aria-label="Photo viewer">
  <button class="lightbox__close icon-button" type="button" data-close aria-label="Close photo viewer">${icons.close}</button>
  <figure class="lightbox__figure">
    <img class="lightbox__img" alt="" data-lb-img>
    <figcaption class="lightbox__caption"><span data-lb-caption></span><span class="lightbox__credit" data-lb-credit></span></figcaption>
  </figure>
  <div class="lightbox__controls">
    <button class="icon-button" type="button" data-prev aria-label="Previous photo">${icons.prev}</button>
    <span class="lightbox__count" data-lb-count aria-live="polite"></span>
    <button class="icon-button" type="button" data-next aria-label="Next photo">${icons.next}</button>
  </div>
</dialog>`;
}
