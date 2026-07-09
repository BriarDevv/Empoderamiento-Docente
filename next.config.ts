import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // La sección se renombró en el sitemap: "Quiénes somos" → "Qué es ED".
      { source: "/quienes-somos", destination: "/que-es-ed", permanent: false },
    ];
  },
};

export default nextConfig;
