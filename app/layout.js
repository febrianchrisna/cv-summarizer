import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "ACC Career — Recruitment Management System",
  description: "Manage and monitor all recruitment requests and published job listings from a centralized dashboard.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${inter.variable} h-full`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-background text-on-background antialiased">
        {children}
      </body>
    </html>
  );
}
