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
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="min-h-full bg-background text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
