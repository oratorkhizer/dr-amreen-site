// After `vite build`, write a real HTML file for every route with its own
// <title>, description, canonical and Open Graph tags, plus robots.txt and
// sitemap.xml. Vercel serves these static files before the SPA fallback,
// so crawlers and WhatsApp previews get correct metadata without running JS.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, "..", "dist");
const SITE = "https://dramreen.caspianhealthcare.in";

const { ROUTES: routes } = await import(
  new URL("../src/data/routes.js", import.meta.url).href
);

if (!existsSync(join(dist, "index.html"))) {
  console.error("build-routes: dist/index.html not found, did vite build run?");
  process.exit(1);
}

const shell = readFileSync(join(dist, "index.html"), "utf8");

const escape = (value) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

let written = 0;

for (const route of routes) {
  const canonical = route.path === "/" ? `${SITE}/` : `${SITE}${route.path}`;

  const html = shell
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(route.title)}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${escape(route.description)}" />`
    )
    .replace(
      /<link rel="canonical"[^>]*>/,
      `<link rel="canonical" href="${canonical}" />`
    )
    .replace(
      /<meta\s+property="og:title"[\s\S]*?\/>/,
      `<meta property="og:title" content="${escape(route.title)}" />`
    )
    .replace(
      /<meta\s+property="og:description"[\s\S]*?\/>/,
      `<meta property="og:description" content="${escape(route.description)}" />`
    )
    .replace(
      /<meta property="og:url"[^>]*>/,
      `<meta property="og:url" content="${canonical}" />`
    );

  if (route.path === "/") {
    writeFileSync(join(dist, "index.html"), html);
  } else {
    const dir = join(dist, route.path.replace(/^\//, ""));
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), html);
  }

  written += 1;
}

const today = new Date().toISOString().slice(0, 10);

writeFileSync(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
    .map(
      (route) =>
        `  <url>\n    <loc>${
          route.path === "/" ? `${SITE}/` : `${SITE}${route.path}`
        }</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${
          route.path === "/" ? "1.0" : "0.7"
        }</priority>\n  </url>`
    )
    .join("\n")}\n</urlset>\n`
);

writeFileSync(
  join(dist, "robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: /enquiries\n\nSitemap: ${SITE}/sitemap.xml\n`
);

console.log(`build-routes: wrote ${written} route shells, sitemap.xml, robots.txt`);
