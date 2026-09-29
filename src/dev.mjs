// Dev server: builds once, serves dist/ on http://localhost:4173, rebuilds when
// content/ or src/ change. Zero dependencies. Run with `npm run dev`.
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat, watch } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const port = Number(process.env.PORT) || 4173;

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".vtt": "text/vtt",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

let building = null;
function rebuild() {
  if (building) return building;
  building = new Promise((resolve) => {
    const child = spawn(process.execPath, [path.join(root, "src/build.mjs")], { stdio: "inherit" });
    child.on("exit", () => {
      building = null;
      resolve();
    });
  });
  return building;
}

const server = createServer(async (req, res) => {
  if (building) await building;
  let urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (urlPath.endsWith("/")) urlPath += "index.html";
  const file = path.normalize(path.join(dist, urlPath));
  if (!file.startsWith(dist)) return respond(res, 403, "Forbidden");
  let info;
  try {
    info = await stat(file);
  } catch {
    return respond(res, 404, "Not found");
  }
  if (!info.isFile()) return respond(res, 404, "Not found");

  const type = types[path.extname(file).toLowerCase()] || "application/octet-stream";
  const headers = { "Content-Type": type, "Accept-Ranges": "bytes", "Cache-Control": "no-cache" };

  // Range requests so the video element can seek.
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || "");
  if (range && (range[1] || range[2])) {
    const start = range[1] ? Number(range[1]) : Math.max(0, info.size - Number(range[2]));
    const end = range[1] && range[2] ? Math.min(Number(range[2]), info.size - 1) : info.size - 1;
    if (start > end || start >= info.size) {
      res.writeHead(416, { "Content-Range": `bytes */${info.size}` });
      return res.end();
    }
    res.writeHead(206, { ...headers, "Content-Range": `bytes ${start}-${end}/${info.size}`, "Content-Length": end - start + 1 });
    return createReadStream(file, { start, end }).pipe(res);
  }
  res.writeHead(200, { ...headers, "Content-Length": info.size });
  createReadStream(file).pipe(res);
});

function respond(res, code, text) {
  res.writeHead(code, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(text);
}

async function watchDir(dir) {
  let timer;
  try {
    for await (const event of watch(dir, { recursive: true })) {
      if (event.filename && /^dist\b/.test(event.filename)) continue;
      clearTimeout(timer);
      timer = setTimeout(() => {
        console.log(`Change in ${path.relative(root, dir)}/${event.filename ?? ""}, rebuilding`);
        rebuild();
      }, 120);
    }
  } catch (err) {
    console.error(`Watch failed for ${dir}:`, err.message);
  }
}

await rebuild();
server.listen(port, () => {
  console.log(`Serving dist/ at http://localhost:${port}`);
});
watchDir(path.join(root, "content"));
watchDir(path.join(root, "src"));
