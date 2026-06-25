import { existsSync, readFileSync } from "node:fs";

const sitemapPath = "dist/sitemap.xml";

if (!existsSync(sitemapPath)) {
  console.log("dist/sitemap.xml no existe. OK si estás creando un ZIP fuente limpio.");
  process.exit(0);
}

const sitemap = readFileSync(sitemapPath, "utf8");

if (sitemap.includes("<lastmod>")) {
  console.error("ERROR: dist/sitemap.xml contiene <lastmod> obsoleto o no verificado.");
  console.error("Elimina dist/ o vuelve a sincronizar dist desde la imagen Docker recién construida.");
  process.exit(1);
}

if (!sitemap.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"')) {
  console.error("ERROR: dist/sitemap.xml no contiene namespace xhtml.");
  process.exit(1);
}

console.log("OK: dist/sitemap.xml no contiene <lastmod> y conserva namespace xhtml.");