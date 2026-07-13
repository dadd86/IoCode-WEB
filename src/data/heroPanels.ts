import type { Locale } from "../i18n/config";
import type { RouteKey } from "../i18n/routes";

export type HeroPanelId =
  | "plc"
  | "robots"
  | "software"
  | "hmi"
  | "iot"
  | "data";

export type HeroPanelPriority = "primary" | "secondary" | "tertiary";

export type HeroPanelRouteKey = Extract<
  RouteKey,
  "plc" | "robotics" | "services" | "projects" | "skills"
>;

export type HeroPanelCopy = {
  title: string;
  text: string;
  description: string;
  ariaLabel: string;
};

export type HeroPanelMotion = {
  parallax: number;
};

export type HeroPanelScreenFallback = {
  x: number;
  y: number;
};

export type HeroPanel = {
  id: HeroPanelId;
  routeKey: HeroPanelRouteKey;
  priority: HeroPanelPriority;
  desktopVisible: boolean;
  tabletVisible: boolean;
  mobileVisible: boolean;
  anchor: HeroPanelAnchor;
  screenFallback: HeroPanelScreenFallback;
  motion: HeroPanelMotion;
  copy: Record<Locale, HeroPanelCopy>;
};

export type LocalizedHeroPanel = Omit<HeroPanel, "copy"> & {
  copy: HeroPanelCopy;
};

export const heroPanels = [
  {
    id: "plc",
    routeKey: "plc",
    priority: "primary",
    desktopVisible: true,
    tabletVisible: true,
    mobileVisible: true,
    anchor: {
      x: -2.55,
      y: 1.32,
      z: 0.72
    },
    screenFallback: {
      x: 24,
      y: 25
    },
    motion: {
      parallax: 1
    },
    copy: {
      es: {
        title: "PLC",
        text: "Automatización industrial",
        description:
          "Control, diagnóstico y automatización robusta para plantas industriales.",
        ariaLabel: "Abrir automatización industrial PLC"
      },
      en: {
        title: "PLC",
        text: "Industrial automation",
        description:
          "Robust control, diagnostics and automation for industrial plants.",
        ariaLabel: "Open PLC industrial automation"
      },
      de: {
        title: "SPS",
        text: "Industrieautomatisierung",
        description:
          "Robuste Steuerung, Diagnose und Automatisierung für Industrieanlagen.",
        ariaLabel: "SPS Industrieautomatisierung öffnen"
      }
    }
  },
  {
    id: "data",
    routeKey: "skills",
    priority: "secondary",
    desktopVisible: true,
    tabletVisible: true,
    mobileVisible: false,
    anchor: {
      x: 0,
      y: 1.78,
      z: 0.86
    },
    screenFallback: {
      x: 24,
      y: 50
    },
    motion: {
      parallax: 0.82
    },
    copy: {
      es: {
        title: "DATA",
        text: "Industria 4.0",
        description:
          "Datos operativos, analítica e integración para decisiones trazables.",
        ariaLabel: "Abrir habilidades de datos e Industria 4.0"
      },
      en: {
        title: "DATA",
        text: "Industry 4.0",
        description:
          "Operational data, analytics and integration for traceable decisions.",
        ariaLabel: "Open data and Industry 4.0 skills"
      },
      de: {
        title: "DATA",
        text: "Industrie 4.0",
        description:
          "Betriebsdaten, Analytik und Integration für nachvollziehbare Entscheidungen.",
        ariaLabel: "Daten und Industrie 4.0 Fähigkeiten öffnen"
      }
    }
  },
  {
    id: "hmi",
    routeKey: "plc",
    priority: "secondary",
    desktopVisible: true,
    tabletVisible: true,
    mobileVisible: false,
    anchor: {
      x: 2.45,
      y: 1.34,
      z: 0.7
    },
    screenFallback: {
      x: 76,
      y: 25
    },
    motion: {
      parallax: 0.92
    },
    copy: {
      es: {
        title: "HMI",
        text: "Diagnóstico y operación",
        description:
          "Interfaces industriales claras para operación, alarmas y mantenimiento.",
        ariaLabel: "Abrir diagnóstico y operación HMI"
      },
      en: {
        title: "HMI",
        text: "Diagnostics and operation",
        description:
          "Clear industrial interfaces for operation, alarms and maintenance.",
        ariaLabel: "Open HMI diagnostics and operation"
      },
      de: {
        title: "HMI",
        text: "Diagnose und Bedienung",
        description:
          "Klare Industrieoberflächen für Betrieb, Alarme und Wartung.",
        ariaLabel: "HMI Diagnose und Bedienung öffnen"
      }
    }
  },
  {
    id: "robots",
    routeKey: "robotics",
    priority: "primary",
    desktopVisible: true,
    tabletVisible: true,
    mobileVisible: true,
    anchor: {
      x: 2.72,
      y: 0.05,
      z: 0.95
    },
    screenFallback: {
      x: 76,
      y: 50
    },
    motion: {
      parallax: 1.05
    },
    copy: {
      es: {
        title: "ROBOTS",
        text: "Robótica y motion",
        description:
          "Integración de robots, movimiento, seguridad y puesta en marcha.",
        ariaLabel: "Abrir robótica industrial y motion"
      },
      en: {
        title: "ROBOTS",
        text: "Robotics and motion",
        description:
          "Robot integration, motion, safety and commissioning.",
        ariaLabel: "Open industrial robotics and motion"
      },
      de: {
        title: "ROBOTS",
        text: "Robotik und Motion",
        description:
          "Roboterintegration, Motion, Sicherheit und Inbetriebnahme.",
        ariaLabel: "Industrierobotik und Motion öffnen"
      }
    }
  },
  {
    id: "software",
    routeKey: "services",
    priority: "primary",
    desktopVisible: true,
    tabletVisible: true,
    mobileVisible: true,
    anchor: {
      x: -2.25,
      y: -1.42,
      z: 0.76
    },
    screenFallback: {
      x: 24,
      y: 75
    },
    motion: {
      parallax: 0.88
    },
    copy: {
      es: {
        title: "SOFTWARE",
        text: "Datos y aplicaciones",
        description:
          "Aplicaciones web, backend, APIs y sistemas para datos industriales.",
        ariaLabel: "Abrir servicios de software, datos y aplicaciones"
      },
      en: {
        title: "SOFTWARE",
        text: "Data and applications",
        description:
          "Web apps, backend, APIs and systems for industrial data.",
        ariaLabel: "Open software services, data and applications"
      },
      de: {
        title: "SOFTWARE",
        text: "Daten und Anwendungen",
        description:
          "Webanwendungen, Backend, APIs und Systeme für Industriedaten.",
        ariaLabel: "Softwareleistungen, Daten und Anwendungen öffnen"
      }
    }
  },
  {
    id: "iot",
    routeKey: "projects",
    priority: "tertiary",
    desktopVisible: true,
    tabletVisible: false,
    mobileVisible: false,
    anchor: {
      x: 2.02,
      y: -1.38,
      z: 0.68
    },
    screenFallback: {
      x: 76,
      y: 75
    },
    motion: {
      parallax: 0.84
    },
    copy: {
      es: {
        title: "IOT",
        text: "Sensores y trazabilidad",
        description:
          "Captura de señales, trazabilidad y conexión entre planta y nube.",
        ariaLabel: "Abrir proyectos IoT de sensores y trazabilidad"
      },
      en: {
        title: "IOT",
        text: "Sensors and traceability",
        description:
          "Signal capture, traceability and plant-to-cloud connection.",
        ariaLabel: "Open IoT projects for sensors and traceability"
      },
      de: {
        title: "IOT",
        text: "Sensoren und Rückverfolgbarkeit",
        description:
          "Signalerfassung, Rückverfolgbarkeit und Verbindung von Anlage und Cloud.",
        ariaLabel: "IoT Projekte für Sensoren und Rückverfolgbarkeit öffnen"
      }
    }
  }
] satisfies readonly HeroPanel[];

export function getHeroPanels(locale: Locale): LocalizedHeroPanel[] {
  return heroPanels.map((panel) => ({
    ...panel,
    copy: panel.copy[locale]
  }));
}