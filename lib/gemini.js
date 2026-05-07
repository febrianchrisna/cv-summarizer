import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Berdasarkan dokumentasi Mei 2026:
 * - gemini-2.0-flash: Deprecated (Shut down June 2026)
 * - gemini-3-flash-preview: Model terbaru dengan Free Tier (Gratis)
 */
export const model = genAI.getGenerativeModel({ 
  model: 'gemini-3-flash-preview' 
});