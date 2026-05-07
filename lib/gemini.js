import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Model comparison (Free Tier, May 2026):
 * - gemini-3-flash-preview: 20 req/hari → TERLALU SEDIKIT
 * - gemini-2.0-flash-lite:  1500 req/hari, 30 req/menit → DIGUNAKAN
 * - gemini-1.5-flash:       1500 req/hari, 15 req/menit
 */
export const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.0-flash-lite' 
});