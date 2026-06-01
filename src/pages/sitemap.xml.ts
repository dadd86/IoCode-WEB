import type { APIRoute } from "astro";
import { siteConfig } from "../data/site";
import { routeAlternates } from "../i18n/routes";

export const GET: APIRoute = () => {
  const urls = Object.values(routeAlternates)
    .flatMap((route) => Object.values(route.path))
    .map((path) => `  <url><loc>${siteConfig.url}${path}</loc></url>`)
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } }
  );
};
