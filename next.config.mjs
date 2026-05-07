/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 16 pakai Turbopack by default.
  // Turbopack tidak support webpack config, jadi gunakan turbopack config kosong
  // untuk silence error. unpdf/WASM biasanya bekerja tanpa konfigurasi tambahan.
  turbopack: {},

  // serverExternalPackages: biarkan unpdf dijalankan sebagai native Node module
  serverExternalPackages: ['unpdf'],
};

export default nextConfig;
