import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Raleway } from "next/font/google";
import "./globals.css";
import StarBackgroundLoader from "./components/StarBackgroundLoader";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Персональный Прогноз на Год | Нумерология · Астрология · Таро · Руны",
  description:
    "Получите глубокий персональный прогноз на год: нумерологический, астрологический, тарологический и рунологический анализ специально для вас.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${cinzel.variable} ${cormorant.variable} ${raleway.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-mystic-950">
        <StarBackgroundLoader />
        {children}
      </body>
    </html>
  );
}
