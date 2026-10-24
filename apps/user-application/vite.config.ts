import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  resolve: {
    tsconfigPaths: true,
    alias: {
      // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
      "@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs",
    },
  },
  plugins: [
    tanstackRouter({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
    // The Cloudflare plugin starts its own dev server, which conflicts with Vitest.
    ...(mode === "test" ? [] : [cloudflare()]),
  ],
  server: {
    watch: {
      ignored: ["**/.wrangler/state/**"],
    },
  },
  test: {
    environment: "jsdom",
    passWithNoTests: true,
  },
}));
