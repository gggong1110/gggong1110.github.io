import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
// import sitemap from "@astrojs/sitemap"; // ← 注释掉导入
import { SITE } from "./src/config";

// https://astro.build/config
export default defineConfig({
  site: 'https://gggong1110.github.io',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    // sitemap(), // ← 注释掉这个调用
  ],
  markdown: {
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "min-light", dark: "night-owl" },
      wrap: true,
    },
  },
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  scopedStyleStrategy: "where",
});