import type { Locale } from "./config";

export type RouteKey =
  | "home"
  | "services"
  | "plc"
  | "robotics"
  | "projects"
  | "skills"
  | "process"
  | "contact";

export type LocalizedRoute = {
  key: RouteKey;
  label: Record<Locale, string>;
  slug: Record<Locale, string | undefined>;
  path: Record<Locale, string>;
};

export const routeAlternates: Record<RouteKey, LocalizedRoute> = {
  home: {
    key: "home",
    label: { es: "Inicio", en: "Home", de: "Start" },
    slug: { es: undefined, en: undefined, de: undefined },
    path: { es: "/es/", en: "/en/", de: "/de/" }
  },
  services: {
    key: "services",
    label: { es: "Servicios", en: "Services", de: "Leistungen" },
    slug: { es: "servicios", en: "services", de: "leistungen" },
    path: { es: "/es/servicios/", en: "/en/services/", de: "/de/leistungen/" }
  },
  plc: {
    key: "plc",
    label: { es: "PLC", en: "PLC", de: "SPS" },
    slug: { es: "automatizacion-plc", en: "plc-automation", de: "sps-automatisierung" },
    path: { es: "/es/automatizacion-plc/", en: "/en/plc-automation/", de: "/de/sps-automatisierung/" }
  },
  robotics: {
    key: "robotics",
    label: { es: "Robotica", en: "Robotics", de: "Robotik" },
    slug: { es: "robotica-industrial", en: "industrial-robotics", de: "industrierobotik" },
    path: { es: "/es/robotica-industrial/", en: "/en/industrial-robotics/", de: "/de/industrierobotik/" }
  },
  projects: {
    key: "projects",
    label: { es: "Proyectos", en: "Projects", de: "Projekte" },
    slug: { es: "proyectos", en: "projects", de: "projekte" },
    path: { es: "/es/proyectos/", en: "/en/projects/", de: "/de/projekte/" }
  },
  skills: {
    key: "skills",
    label: { es: "Habilidades", en: "Skills", de: "Faehigkeiten" },
    slug: { es: "habilidades", en: "skills", de: "faehigkeiten" },
    path: { es: "/es/habilidades/", en: "/en/skills/", de: "/de/faehigkeiten/" }
  },
  process: {
    key: "process",
    label: { es: "Proceso", en: "Process", de: "Prozess" },
    slug: { es: "proceso", en: "process", de: "prozess" },
    path: { es: "/es/proceso/", en: "/en/process/", de: "/de/prozess/" }
  },
  contact: {
    key: "contact",
    label: { es: "Contacto", en: "Contact", de: "Kontakt" },
    slug: { es: "contacto", en: "contact", de: "kontakt" },
    path: { es: "/es/contacto/", en: "/en/contact/", de: "/de/kontakt/" }
  }
};

export const navigationRouteKeys: RouteKey[] = [
  "home",
  "services",
  "plc",
  "robotics",
  "projects",
  "skills",
  "process",
  "contact"
];

export function getLocalizedPath(routeKey: RouteKey, locale: Locale): string {
  return routeAlternates[routeKey].path[locale];
}

export function getAlternatePaths(routeKey: RouteKey): Record<Locale, string> {
  return routeAlternates[routeKey].path;
}

export function getStaticRouteParams() {
  return Object.values(routeAlternates).flatMap((route) =>
    (["es", "en", "de"] as Locale[]).map((locale) => ({
      params: {
        locale,
        slug: route.slug[locale]
      },
      props: {
        locale,
        routeKey: route.key
      }
    }))
  );
}
