import { defineConfig } from "vite";

export default defineConfig({
  // Build to standard dist directory
  build: {
    rollupOptions: {
      input: "index.html", // Vite will find src/index.ts from the HTML
      output: {
        entryFileNames: "main.js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
  // Development server configuration
  server: {
    port: 3000,
    open: true,
    historyApiFallback: true,
  },
  // Resolve TypeScript files
  resolve: {
    extensions: [".ts", ".js"],
  },
});
