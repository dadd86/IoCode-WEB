import type { APIRoute } from "astro";
import { siteConfig } from "../data/site";
import type { Locale } from "../i18n/config";
import { routeAlternates } from "../i18n/routes";

const locales: Locale[] = ["es", "en", "de"];

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export const GET: APIRoute = () => {
  const urls = Object.values(routeAlternates)
    .flatMap((route) =>
      locales.map((locale) => {
        const loc = `${siteConfig.url}${route.path[locale]}`;

        const alternates = locales
          .map(
            (alternateLocale) =>
              `    <xhtml:link rel="alternate" hreflang="${alternateLocale}" href="${escapeXml(
                `${siteConfig.url}${route.path[alternateLocale]}`
              )}" />`
          )
          .join("\n");

        const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(
          `${siteConfig.url}${route.path.es}`
        )}" />`;

        return [
          "  <url>",
          `    <loc>${escapeXml(loc)}</loc>`,
          alternates,
          xDefault,
          "  </url>"
        ].join("\n");
      })
    )
    .join("\n");

  return new Response(
    [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`,
      `        xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
      urls,
      `</urlset>`
    ].join("\n"),
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600"
      }
    }
  );
};