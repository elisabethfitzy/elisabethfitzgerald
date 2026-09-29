// Build: renders content/site.js through src/templates into dist/.
// Zero dependencies. Run with `npm run build` (or `node src/build.mjs`).
import { readFile, writeFile, mkdir, cp, rm, access } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { renderPage } from "./templates/page.mjs";
import { buildResumePdf } from "./pdf.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

const exists = (p) => access(p).then(() => true, () => false);
const hash = (s) => createHash("md5").update(s).digest("hex").slice(0, 8);

export async function build() {
  const started = performance.now();
  // Fresh import so a watch loop always sees the latest content.
  const site = (await import(pathToFileURL(path.join(root, "content/site.js")).href + `?t=${Date.now()}`)).default;
  // SITE_URL overrides content/site.js meta.url, so one content file can build for
  // a custom domain or a username.github.io/repo address (see docs/GITHUB-PAGES.md).
  if (process.env.SITE_URL?.trim()) site.meta.url = process.env.SITE_URL.trim();
  const siteUrl = site.meta.url.replace(/\/$/, "");

  await rm(dist, { recursive: true, force: true });
  await mkdir(path.join(dist, "assets"), { recursive: true });
  await cp(path.join(root, "content/media"), path.join(dist, "media"), { recursive: true });
  await cp(path.join(root, "src/assets"), path.join(dist, "assets"), { recursive: true });

  const css = await readFile(path.join(root, "src/styles/main.css"), "utf8");
  const js = await readFile(path.join(root, "src/scripts/main.js"), "utf8");
  const cssFile = `site.${hash(css)}.css`;
  const jsFile = `site.${hash(js)}.js`;
  await writeFile(path.join(dist, "assets", cssFile), css);
  await writeFile(path.join(dist, "assets", jsFile), js);

  // Resume: use the PDF at content/<site.resume.file> if the client supplied one, else generate from the credits.
  const resumeOut = path.join(dist, site.resume.file);
  let resumeGenerated = false;
  if (!(await exists(path.join(root, "content", site.resume.file)))) {
    await mkdir(path.dirname(resumeOut), { recursive: true });
    await writeFile(resumeOut, buildResumePdf(site));
    resumeGenerated = true;
  }

  const html = renderPage(site, { css: `assets/${cssFile}`, js: `assets/${jsFile}` });
  await writeFile(path.join(dist, "index.html"), html);
  await writeFile(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
  await writeFile(
    path.join(dist, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${siteUrl}/</loc></url></urlset>\n`,
  );
  // GitHub Pages: .nojekyll stops Jekyll processing; CNAME pins a custom domain
  // (only written when the site URL is not a github.io address).
  await writeFile(path.join(dist, ".nojekyll"), "");
  const host = new URL(siteUrl).host;
  if (!host.endsWith("github.io")) await writeFile(path.join(dist, "CNAME"), `${host}\n`);

  const ms = Math.round(performance.now() - started);
  console.log(`Built dist/ for ${siteUrl}/ in ${ms} ms (resume ${resumeGenerated ? "generated from content" : "copied from content/media"})`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  build().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
