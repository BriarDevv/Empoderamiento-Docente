import type { Metadata } from "next";
import { Inter, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { siteConfig } from "@/config/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500"],
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default:
      "Empoderamiento Docente — Transformamos la enseñanza de la matemática",
    template: "%s | Empoderamiento Docente",
  },
  description:
    "Consultora en educación especializada en Matemáticas. Acompañamos a equipos docentes con investigación, formación y acompañamiento situado.",
  keywords: [
    "enseñanza de la matemática",
    "desarrollo profesional docente",
    "matemática educativa",
    "consultora educativa",
    "formación docente",
  ],
  openGraph: {
    type: "website",
    locale: "es_ES",
    title:
      "Empoderamiento Docente — Transformamos la enseñanza de la matemática",
    description:
      "Consultora en educación especializada en Matemáticas. Investigación, formación y acompañamiento para equipos docentes.",
    siteName: siteConfig.name,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${manrope.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <CustomCursor />
        <LenisProvider>
          <Header />
          {children}
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
