import type { NextConfig } from "next";

// Ekspor statis: bisa di-host di GitHub Pages / Vercel / Netlify tanpa server.
// Untuk GitHub Pages di subpath, jalankan: NEXT_PUBLIC_BASE_PATH=/nama-repo npm run build
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const config: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default config;
