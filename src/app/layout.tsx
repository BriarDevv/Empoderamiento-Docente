import type { Metadata } from "next";
import { Inter, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { LenisProvider } from "@/lib/motion/LenisProvider";
// import { Navbar } from "@/components/layout/Navbar"; // TEMP: oculto durante la demo de réplica Blueprint

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
  weight: ["500", "700", "800"],
});

// Sustituto libre de "Saans Mono" (nav/labels del hero estilo Blueprint).
const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — Desarrollo profesional docente`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${manrope.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <LenisProvider>
          {/* <Navbar /> TEMP: oculto durante la demo de réplica Blueprint */}
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
