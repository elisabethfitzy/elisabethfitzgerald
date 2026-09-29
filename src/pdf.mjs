// Generates a clean one-or-two page acting resume as a PDF from content/site.js.
// Used only when the PDF named in site.resume.file is absent from content/. No dependencies: writes raw PDF.

const PAGE_W = 595.28; // A4 in points
const PAGE_H = 841.89;
const MARGIN = 52;

// Map common Unicode punctuation to WinAnsi (cp1252) bytes so Helvetica renders it.
const WINANSI = { "‘": 0x91, "’": 0x92, "“": 0x93, "”": 0x94, "–": 0x96, "—": 0x97, "…": 0x85, "•": 0x95, "€": 0x80, "′": 0x27, "″": 0x22 };
function toWinAnsi(text) {
  let out = "";
  for (const ch of String(text)) {
    const code = ch.codePointAt(0);
    if (code < 0x80 || (code >= 0xa0 && code <= 0xff)) out += ch;
    else if (WINANSI[ch]) out += String.fromCharCode(WINANSI[ch]);
    else out += "?";
  }
  return out.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

// Rough Helvetica width estimate (points per point of font size) for wrapping.
function textWidth(text, size) {
  let w = 0;
  for (const ch of text) {
    if ("iljtfI.,;:'|!".includes(ch)) w += 0.28;
    else if ("mwMW".includes(ch)) w += 0.85;
    else if (ch === " ") w += 0.28;
    else if (ch >= "A" && ch <= "Z") w += 0.68;
    else w += 0.53;
  }
  return w * size;
}

function wrap(text, size, maxWidth) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (textWidth(next, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

export function buildResumePdf(site) {
  const pages = [];
  let ops = [];
  let y = PAGE_H - MARGIN;

  const F = { regular: "/F1", bold: "/F2", italic: "/F3" };
  const text = (str, x, yy, size, font = F.regular, gray = 0) => {
    ops.push(`BT ${font} ${size} Tf ${gray} g ${x.toFixed(2)} ${yy.toFixed(2)} Td (${toWinAnsi(str)}) Tj ET`);
  };
  const rule = (yy, gray = 0.75) => {
    ops.push(`${gray} G 0.5 w ${MARGIN} ${yy.toFixed(2)} m ${(PAGE_W - MARGIN).toFixed(2)} ${yy.toFixed(2)} l S`);
  };
  const newPage = () => {
    pages.push(ops.join("\n"));
    ops = [];
    y = PAGE_H - MARGIN;
  };
  const ensure = (needed) => {
    if (y - needed < MARGIN) newPage();
  };

  const name = `${site.person.firstName} ${site.person.lastName}`;
  text(name, MARGIN, y - 18, 22, F.bold);
  y -= 26;
  text(site.person.tagline, MARGIN, y - 10, 10, F.italic, 0.3);
  y -= 22;
  if (site.contact.direct) {
    const d = site.contact.direct;
    text([d.email, d.phone].filter(Boolean).join("  "), MARGIN, y - 9, 8.5, F.regular, 0.25);
    y -= 12;
  }
  for (const rep of site.contact.representation ?? []) {
    text(`${rep.role}: ${rep.name}, ${rep.company}. ${rep.email}  ${rep.phone}`, MARGIN, y - 9, 8.5, F.regular, 0.25);
    y -= 12;
  }
  y -= 6;
  rule(y);
  y -= 14;

  // Casting facts: label column, wrapped values.
  const factLabelW = 110;
  for (const f of site.about.facts) {
    const lines = wrap(f.value, 8.5, PAGE_W - MARGIN * 2 - factLabelW);
    ensure(12 * lines.length + 8);
    text(f.label, MARGIN, y - 8, 8.5, F.bold);
    lines.forEach((line, i) => {
      text(line, MARGIN + factLabelW, y - 8, 8.5);
      if (i < lines.length - 1) y -= 11;
    });
    y -= 12;
  }
  y -= 4;
  rule(y);
  y -= 18;

  // Credits grouped by type (same cards as the Work section).
  for (const type of site.creditTypes) {
    const rows = site.work.cards.filter((c) => c.type === type.key);
    if (!rows.length) continue;
    ensure(40);
    text(type.label, MARGIN, y - 10, 12, F.bold);
    y -= 20;
    for (const c of rows) {
      ensure(30);
      if (c.year) text(String(c.year), MARGIN, y - 8, 9, F.regular, 0.35);
      text(c.title, MARGIN + 40, y - 8, 9.5, F.bold);
      const roleX = MARGIN + 40 + textWidth(c.title, 9.5) + 8;
      text(c.role, roleX, y - 8, 9, F.italic, 0.2);
      y -= 11.5;
      text([c.company, c.place].filter(Boolean).join(". "), MARGIN + 40, y - 8, 8.5, F.regular, 0.4);
      y -= 15;
    }
    y -= 6;
  }

  // Training.
  ensure(60);
  rule(y);
  y -= 18;
  text("Training", MARGIN, y - 10, 12, F.bold);
  y -= 20;
  for (const t of site.about.training) {
    ensure(20);
    text(t.when, MARGIN, y - 8, 9, F.regular, 0.35);
    text(`${t.what}, ${t.where}`, MARGIN + 70, y - 8, 9);
    y -= 13;
  }

  // Awards.
  if (site.press.awards?.length) {
    y -= 8;
    ensure(60);
    rule(y);
    y -= 18;
    text("Awards", MARGIN, y - 10, 12, F.bold);
    y -= 20;
    for (const a of site.press.awards) {
      ensure(20);
      text(String(a.year), MARGIN, y - 8, 9, F.regular, 0.35);
      text(`${a.result}, ${a.award}, ${a.body}. ${a.for}`, MARGIN + 40, y - 8, 9);
      y -= 13;
    }
  }
  newPage();

  // Assemble the PDF.
  const objects = [];
  const add = (body) => {
    objects.push(body);
    return objects.length;
  };
  const catalog = add(null);
  const pagesObj = add(null);
  const f1 = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  const f2 = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
  const f3 = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>");
  const pageIds = [];
  for (const content of pages) {
    const stream = add(`<< /Length ${Buffer.byteLength(content, "latin1")} >>\nstream\n${content}\nendstream`);
    const page = add(
      `<< /Type /Page /Parent ${pagesObj} 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 ${f1} 0 R /F2 ${f2} 0 R /F3 ${f3} 0 R >> >> /Contents ${stream} 0 R >>`,
    );
    pageIds.push(page);
  }
  objects[catalog - 1] = `<< /Type /Catalog /Pages ${pagesObj} 0 R >>`;
  objects[pagesObj - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;
  const info = add(`<< /Title (${toWinAnsi(`${name}, acting resume`)}) /Author (${toWinAnsi(name)}) /Producer (site build) >>`);

  const parts = [Buffer.from("%PDF-1.4\n%\xe2\xe3\xcf\xd3\n", "latin1")];
  const offsets = [];
  let length = parts[0].length;
  objects.forEach((body, i) => {
    offsets.push(length);
    const buf = Buffer.from(`${i + 1} 0 obj\n${body}\nendobj\n`, "latin1");
    parts.push(buf);
    length += buf.length;
  });
  const xref = [`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`];
  for (const off of offsets) xref.push(`${String(off).padStart(10, "0")} 00000 n \n`);
  parts.push(Buffer.from(xref.join(""), "latin1"));
  parts.push(Buffer.from(`trailer\n<< /Size ${objects.length + 1} /Root ${catalog} 0 R /Info ${info} 0 R >>\nstartxref\n${length}\n%%EOF\n`, "latin1"));
  return Buffer.concat(parts);
}
