import path from "path"
import React from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins:[React()],
  resolve:{
    alias:{
      "@":path.resolve(__dirname,"./src"),
    },
  },
})