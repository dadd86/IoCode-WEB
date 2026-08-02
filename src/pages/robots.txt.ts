import type { APIRoute } from "astro";
import { allowSearchIndexing, siteUrl } from "../config/environment";

export const GET: APIRoute = () => {
  const body = allowSearchIndexing
    ? [
        "User-agent: *",
        "Allow: /",
        "",
        "User-agent: OAI-SearchBot",
        "Allow: /",
        "",
        "User-agent: ChatGPT-User",
        "Allow: /",
        "",
        "User-agent: PerplexityBot",
        "Allow: /",
        "",
        "User-agent: Perplexity-User",
        "Allow: /",
        "",
        "User-agent: Claude-SearchBot",
        "Allow: /",
        "",
        "User-agent: Claude-User",
        "Allow: /",
        "",
        "User-agent: GPTBot",
        "Allow: /",
        "",
        "User-agent: ClaudeBot",
        "Allow: /",
        "",
        "User-agent: Google-Extended",
        "Allow: /",
        "",
        `Sitemap: ${siteUrl}/sitemap-index.xml`,
        `Sitemap: ${siteUrl}/sitemap.xml`,
        ""
      ].join("\n")
    : "User-agent: *\nDisallow: /\n";

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
};
