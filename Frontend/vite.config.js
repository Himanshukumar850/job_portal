import path from "path"
import { fileURLToPath } from "url"
import React from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [React()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})