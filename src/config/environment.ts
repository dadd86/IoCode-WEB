export type DeployEnvironment = "local" | "preview" | "production";

const allowedEnvironments = new Set<DeployEnvironment>([
  "local",
  "preview",
  "production"
]);

const rawEnvironment = import.meta.env.PUBLIC_DEPLOY_ENV || "local";

if (!allowedEnvironments.has(rawEnvironment as DeployEnvironment)) {
  throw new Error(`PUBLIC_DEPLOY_ENV no válido: ${rawEnvironment}`);
}

export const deployEnvironment = rawEnvironment as DeployEnvironment;
export const productionSiteUrl = "https://iocode-solutions.com";
export const siteUrl = (
  import.meta.env.PUBLIC_SITE_URL ||
  (deployEnvironment === "local" ? "http://localhost:4321" : productionSiteUrl)
).replace(/\/$/u, "");

const parsedSiteUrl = new URL(siteUrl);

if (
  deployEnvironment === "production" &&
  (siteUrl !== productionSiteUrl || parsedSiteUrl.protocol !== "https:")
) {
  throw new Error(`PUBLIC_SITE_URL debe ser exactamente ${productionSiteUrl} en producción.`);
}

export const allowSearchIndexing = deployEnvironment === "production";
export const defaultRobotsDirective = allowSearchIndexing
  ? "index, follow, max-image-preview:large"
  : "noindex, nofollow, noarchive";
