import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3006,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
      config: `${path.resolve(__dirname, "./src/config/")}`,
      utils: `${path.resolve(__dirname, "./src/utils/")}`,
      store: `${path.resolve(__dirname, "./src/store/")}`,
      components: `${path.resolve(__dirname, "./src/components/")}`,
      public: `${path.resolve(__dirname, "./public/")}`,
      pages: path.resolve(__dirname, "./src/pages/"),
      images: `${path.resolve(__dirname, "./public/assets/images/")}`,
      types: `${path.resolve(__dirname, "./src/@types")}`,
    },
  },
})
