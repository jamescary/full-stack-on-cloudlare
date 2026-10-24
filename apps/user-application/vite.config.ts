import { defineConfig, lazyPlugins } from "vite-plus";

// https://viteplus.dev/config/
export default defineConfig(({ mode }) => ({
  fmt: {
    ignorePatterns: [
      "dist/**",
      ".wrangler/**",
      "src/routeTree.gen.ts",
      "worker-configuration.d.ts",
      "service-bindings.d.ts",
    ],
    printWidth: 80,
    useTabs: false,
  },
  lint: {
    ignorePatterns: [
      "dist/**",
      ".wrangler/**",
      "src/routeTree.gen.ts",
      "worker-configuration.d.ts",
      "service-bindings.d.ts",
    ],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: {
      "vite-plus/prefer-vite-plus-imports": "error",
    },
  },
  test: {
    environment: "jsdom",
    passWithNoTests: true,
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
      "@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs",
    },
  },
  server: {
    watch: {
      ignored: ["**/.wrangler/state/**"],
    },
  },
  plugins: lazyPlugins(async () => {
    const [
      { default: viteReact },
      { tanstackRouter },
      { default: tailwindcss },
      { cloudflare },
    ] = await Promise.all([
      import("@vitejs/plugin-react"),
      import("@tanstack/router-plugin/vite"),
      import("@tailwindcss/vite"),
      import("@cloudflare/vite-plugin"),
    ]);
    return [
      tanstackRouter({ autoCodeSplitting: true }),
      viteReact(),
      tailwindcss(),
      // The Cloudflare plugin starts its own dev server, which conflicts with Vitest.
      ...(mode === "test" ? [] : [cloudflare()]),
    ];
  }),
}));
