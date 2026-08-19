import type { APIRoute } from "astro";
import { siteConfig } from "../data/site";
import { getProjectAlternatePaths, projects } from "../data/projects";
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
  const createUrlEntry = (paths: Record<Locale, string>, locale: Locale) => {
    const loc = `${siteConfig.url}${paths[locale]}`;

    const alternates = locales
      .map(
        (alternateLocale) =>
          `    <xhtml:link rel="alternate" hreflang="${alternateLocale}" href="${escapeXml(
            `${siteConfig.url}${paths[alternateLocale]}`
          )}" />`
      )
      .join("\n");

    const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(
      `${siteConfig.url}${paths.es}`
    )}" />`;

    return [
      "  <url>",
      `    <loc>${escapeXml(loc)}</loc>`,
      alternates,
      xDefault,
      "  </url>"
    ].join("\n");
  };

  const routeUrls = Object.values(routeAlternates).flatMap((route) =>
    locales.map((locale) => createUrlEntry(route.path, locale))
  );
  const projectUrls = projects.es.flatMap((project) => {
    const paths = getProjectAlternatePaths(project.key);
    return locales.map((locale) => createUrlEntry(paths, locale));
  });
  const urls = [...routeUrls, ...projectUrls].join("\n");

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
