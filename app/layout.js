import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "CV Summarizer — AI-Powered HR Recruitment Tool",
  description: "Analisis dan ranking CV kandidat secara otomatis menggunakan AI. Bantu HR memprioritaskan kandidat terbaik untuk diinterview.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-background text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
