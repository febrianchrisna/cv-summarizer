import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { createReadStream, mkdirSync, writeFileSync } from 'fs';
import { createInterface } from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, 'sample-cvs');
mkdirSync(OUT_DIR, { recursive: true });

// Parse CSV manually (file is too large for full load)
function parseCSVLine(line) {
  const result = [];
  let cur = '';
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuote && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuote = !inQuote;
    } else if (ch === ',' && !inQuote) {
      result.push(cur); cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur);
  return result;
}

async function createPDF(name, category, resumeText) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 595;
  const pageHeight = 842;
  const margin = 50;
  const maxWidth = pageWidth - margin * 2;
  const fontSize = 10;
  const lineHeight = 14;

  let page = doc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  // Header
  page.drawText(name, { x: margin, y, font: boldFont, size: 16, color: rgb(0, 0.22, 0.43) });
  y -= 20;
  page.drawText(`Category: ${category}`, { x: margin, y, font, size: 11, color: rgb(0.25, 0.25, 0.25) });
  y -= 8;
  page.drawLine({ start: { x: margin, y }, end: { x: pageWidth - margin, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
  y -= 18;

  // Body text
  const lines = resumeText.replace(/\r/g, '').split('\n');
  for (const rawLine of lines) {
    if (rawLine.trim() === '') { y -= lineHeight / 2; continue; }

    // Word-wrap
    const words = rawLine.trim().split(' ');
    let lineText = '';
    for (const word of words) {
      const test = lineText ? `${lineText} ${word}` : word;
      const w = font.widthOfTextAtSize(test, fontSize);
      if (w > maxWidth && lineText) {
        if (y < margin + lineHeight) {
          page = doc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }
        page.drawText(lineText, { x: margin, y, font, size: fontSize, color: rgb(0.1, 0.1, 0.1) });
        y -= lineHeight;
        lineText = word;
      } else {
        lineText = test;
      }
    }
    if (lineText) {
      if (y < margin + lineHeight) {
        page = doc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      page.drawText(lineText, { x: margin, y, font, size: fontSize, color: rgb(0.1, 0.1, 0.1) });
      y -= lineHeight;
    }
  }

  return doc.save();
}

// Read CSV and pick 20 random rows
const rl = createInterface({ input: createReadStream('D:/QC/Project_challenge/Resume.csv', 'utf8') });
let headerSkipped = false;
const rows = [];

rl.on('line', (line) => {
  if (!headerSkipped) { headerSkipped = true; return; }
  if (rows.length >= 2484) return;
  rows.push(line);
});

rl.on('close', async () => {
  // Shuffle and pick 20
  for (let i = rows.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rows[i], rows[j]] = [rows[j], rows[i]];
  }
  const selected = rows.slice(0, 20);

  const names = [
    'Andi Pratama', 'Budi Santoso', 'Citra Dewi', 'Dian Rahayu', 'Eko Wahyudi',
    'Fajar Nugroho', 'Gita Permata', 'Hendra Kusuma', 'Indah Lestari', 'Joko Widodo',
    'Kartika Sari', 'Lestari Wulandari', 'Muhammad Rizki', 'Nina Agustin', 'Oscar Firmansyah',
    'Putri Handayani', 'Qori Amalia', 'Rudi Hermawan', 'Sinta Maharani', 'Taufik Hidayat'
  ];

  console.log('Generating 20 PDFs...');
  for (let i = 0; i < selected.length; i++) {
    try {
      const parts = parseCSVLine(selected[i]);
      const category = (parts[3] || 'GENERAL').trim();
      const resumeText = (parts[1] || '').trim()
        .replace(/[\u2013\u2014\uFF0D]/g, '-')   // em-dash, en-dash, fullwidth hyphen → -
        .replace(/[\u2018\u2019]/g, "'")           // smart single quotes
        .replace(/[\u201C\u201D]/g, '"')           // smart double quotes
        .replace(/\t/g, '  ')                      // tab → spaces
        .replace(/[^\x00-\x7F]/g, '?');            // remaining non-ASCII → ?
      const personName = names[i];
      const safeCat = category.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `CV_${String(i + 1).padStart(2, '0')}_${personName.replace(/ /g, '_')}_${safeCat}.pdf`;

      const pdfBytes = await createPDF(personName, category, resumeText);
      writeFileSync(path.join(OUT_DIR, fileName), pdfBytes);
      console.log(`✓ ${fileName}`);
    } catch (err) {
      console.error(`✗ Row ${i + 1}: ${err.message}`);
    }
  }
  console.log(`\nDone! PDFs saved to: ${OUT_DIR}`);
});
