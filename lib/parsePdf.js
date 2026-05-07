import { extractText, getDocumentProxy } from 'unpdf';

export async function extractTextFromPdf(buffer) {
  try {
    const uint8Array = new Uint8Array(buffer);
    const pdf = await getDocumentProxy(uint8Array);
    const { text } = await extractText(pdf, { mergePages: true });
    // mergePages: true → text adalah string tunggal
    return String(text || '').trim();
  } catch (err) {
    console.error('PDF extraction error:', err);
    return '';
  }
}