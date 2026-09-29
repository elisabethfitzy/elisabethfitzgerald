# Deploying to GitHub Pages

The site is static, so GitHub Pages can host it for free. `npm run build` writes
everything to `dist/` with relative asset paths (`media/...`, `assets/...`), a
`.nojekyll` file, `robots.txt`, `sitemap.xml` and, for a custom domain, a `CNAME`
file. The workflow in `.github/workflows/pages.yml` builds and publishes `dist/`
on every push to `main`.

Two ways to host it. Option A is the one to aim for; Option B is fine while the
domain is being sorted out, and is the stepping stone to A.

## Before either option

```sh
cd fitzy-portfolio
git init -b main
git add -A
git commit -m "Portfolio site with real photos and trailer"
gh repo create fitzy-portfolio --public --source=. --push
```

`.gitignore` keeps `dist/`, `node_modules/` and every `.MOV`/`.mov` out of the
repo, so the 15 MB source video is never committed. The compressed 7.5 MB
trailer in `content/media/reel/` is committed; it is what the site serves.

Turn on Pages with the "GitHub Actions" source (once):

```sh
gh api -X POST "repos/{owner}/fitzy-portfolio/pages" -f build_type=workflow
```

(Or in the browser: repo Settings, Pages, Source: GitHub Actions.) The push
above already triggered the workflow; re-run it after enabling Pages:

```sh
gh workflow run "Deploy to GitHub Pages"
gh run watch
```

## Option A: custom domain, elisabethfitzgerald.com

This is what `content/site.js` is set up for (`meta.url`).

1. At the DNS provider for elisabethfitzgerald.com, add:

   | Type  | Name | Value                    |
   | ----- | ---- | ------------------------ |
   | A     | @    | 185.199.108.153          |
   | A     | @    | 185.199.109.153          |
   | A     | @    | 185.199.110.153          |
   | A     | @    | 185.199.111.153          |
   | CNAME | www  | `<owner>.github.io`      |

   (Optional AAAA records for IPv6: 2606:50c0:8000::153, 8001::153, 8002::153, 8003::153.)

2. Tell GitHub about the domain and enforce HTTPS:

   ```sh
   gh api -X PUT "repos/{owner}/fitzy-portfolio/pages" -f cname=elisabethfitzgerald.com
   # wait for the DNS check to pass (Settings, Pages shows it), then:
   gh api -X PUT "repos/{owner}/fitzy-portfolio/pages" -F https_enforced=true
   ```

3. Push (or `gh workflow run "Deploy to GitHub Pages"`). The workflow reads the
   Pages configuration, so `SITE_URL` becomes `https://elisabethfitzgerald.com`
   and the canonical link, Open Graph image URL, sitemap and `CNAME` all match.

The certificate can take up to an hour after DNS resolves. `www` redirects to
the apex once both are set.

## Option B: project URL, https://<owner>.github.io/fitzy-portfolio/

No DNS needed. After the "Before either option" steps the site is live at that
address. The workflow passes the Pages URL to the build, so the canonical link
and social image point at `https://<owner>.github.io/fitzy-portfolio/`, and no
`CNAME` file is written. All asset links are relative, so the `/fitzy-portfolio/`
sub-path just works.

To build the same thing locally:

```sh
SITE_URL=https://<owner>.github.io/fitzy-portfolio npm run build
```

Moving from B to A later is only the DNS and `cname` steps above; nothing in
the repo changes.

## Checks

- `npm run build` prints the URL it built for.
- `dist/index.html` should contain `<link rel="canonical" href="...">` with the
  address you expect.
- Repo size: `du -sh .git` after the first push should be well under 50 MB
  (media in `content/` is about 9 MB).
