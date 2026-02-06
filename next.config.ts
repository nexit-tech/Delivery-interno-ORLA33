import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // <--- O SEGREDO DA ECONOMIA DE RAM
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Permite imagens de qualquer lugar (Supabase, etc)
      },
    ],
    // Se quiser economizar CPU ao máximo, descomente a linha abaixo (mas perde otimização de imagem)
    // unoptimized: true, 
  },
};

export default nextConfig;