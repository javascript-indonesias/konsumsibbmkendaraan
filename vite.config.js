import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  // Multi-Page Application setup
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        riwayat: resolve(__dirname, "riwayat.html"),
        tambah: resolve(__dirname, "tambah.html"),
        statistik: resolve(__dirname, "statistik.html"),
        pengaturan: resolve(__dirname, "pengaturan.html"),
        kendaraan: resolve(__dirname, "kendaraan.html"),
      },
    },
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
  },

  // Development server
  server: {
    port: 3000,
    open: true,
    host: true,
  },

  // Preview server (for testing production build)
  preview: {
    port: 4173,
  },

  // Resolve aliases
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@modules": resolve(__dirname, "src/modules"),
      "@components": resolve(__dirname, "src/components"),
    },
  },
});
