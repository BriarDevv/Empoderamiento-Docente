import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LenisProvider } from "@/components/providers/LenisProvider";

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

export const metadata: Metadata = {
  title: {
    default:
      "Empoderamiento Docente — Investigamos para transformar la matemática escolar",
    template: "%s | Empoderamiento Docente",
  },
  description:
    "Desarrollo profesional docente y resignificación del conocimiento matemático escolar. Investigación, acción y reflexión en Chile, México y Argentina.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${manrope.variable} antialiased`}
    >
      {/* min-h-screen + flex-col en body (NO h-full en html) — patrón
          sticky footer estándar que NO confunde a Lenis. El bug clásico
          "scroll vuelve hacia arriba después de cierto punto" se debe
          a h-full en html: el body crece más que el html y Lenis lee
          documentElement.scrollHeight mal. */}
      <body className="flex min-h-screen flex-col">
        <LenisProvider>
          <Header />
          {children}
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
