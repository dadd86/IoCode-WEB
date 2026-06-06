import type { RouteKey } from "../i18n/routes";

export type LocalizedText = {
  es: string;
  en: string;
  de: string;
};

export type LocalizedList = {
  es: string[];
  en: string[];
  de: string[];
};

export type OfferCatalogItem = {
  name: LocalizedText;
  description: LocalizedText;
  routeKey: RouteKey;
};

export const siteConfig = {
  name: "IoCode SOLUTIONS",
  legalName: "IoCode SOLUTIONS",
  url: "https://iocode-solutions.com",
  email: "contact@iocode-solutions.com",
  logoPath: "/logo/iocode-logo.svg",
  logo3dPath: "/logo/3d/iocode_solutions_logo_extruded_3d.glb",
  location: {
    city: "Aachen",
    region: "North Rhine-Westphalia",
    country: "Germany"
  },
  availableLanguages: ["Spanish", "English", "German"],
  tagline: {
    es: "Automatización industrial, PLC, robótica y software para conectar máquinas, datos y procesos.",
    en: "Industrial automation, PLC, robotics and software to connect machines, data and processes.",
    de: "Industrielle Automatisierung, SPS, Robotik und Software zur Verbindung von Maschinen, Daten und Prozessen."
  },
  businessDescription: {
    es: "Empresa técnica especializada en automatización industrial, programación PLC, robótica, software industrial, datos e integración Industria 4.0.",
    en: "Technical company specialized in industrial automation, PLC programming, robotics, industrial software, data and Industry 4.0 integration.",
    de: "Technisches Unternehmen für industrielle Automatisierung, SPS-Programmierung, Industrierobotik, Industriesoftware, Datenintegration und Industrie-4.0-Lösungen."
  },
  contactPoint: {
    contactType: {
      es: "Consultas empresariales y diagnóstico técnico",
      en: "Business enquiries and technical diagnostics",
      de: "Geschäftliche Anfragen und technische Diagnose"
    }
  },
  serviceTypes: {
    es: [
      "Automatización industrial",
      "Programación PLC",
      "Robótica industrial",
      "Soluciones Industria 4.0",
      "Software industrial",
      "Integración OPC UA",
      "EtherCAT",
      "Profinet",
      "Desarrollo HMI",
      "Diagnóstico SCADA",
      "Motion Control",
      "Integración ERP",
      "Integración de datos industriales",
      "Docker",
      "Linux",
      "Windows Server"
    ],
    en: [
      "Industrial automation",
      "PLC programming",
      "Industrial robotics",
      "Industry 4.0 solutions",
      "Industrial software",
      "OPC UA integration",
      "EtherCAT",
      "Profinet",
      "HMI development",
      "SCADA diagnostics",
      "Motion Control",
      "ERP integration",
      "Industrial data integration",
      "Docker",
      "Linux",
      "Windows Server"
    ],
    de: [
      "Industrielle Automatisierung",
      "SPS-Programmierung",
      "Industrierobotik",
      "Industrie-4.0-Lösungen",
      "Industriesoftware",
      "OPC-UA-Integration",
      "EtherCAT",
      "Profinet",
      "HMI-Entwicklung",
      "SCADA-Diagnose",
      "Motion Control",
      "ERP-Integration",
      "Industriedatenintegration",
      "Docker",
      "Linux",
      "Windows Server"
    ]
  } satisfies Record<keyof LocalizedText, string[]>,
  offerCatalog: [
    {
      routeKey: "plc",
      name: {
        es: "Automatización PLC y HMI",
        en: "PLC and HMI automation",
        de: "SPS- und HMI-Automatisierung"
      },
      description: {
        es: "Programación, diagnóstico y optimización de sistemas PLC, HMI, motion control, safety y comunicaciones industriales.",
        en: "Programming, diagnostics and optimization of PLC, HMI, motion control, safety and industrial communication systems.",
        de: "Programmierung, Diagnose und Optimierung von SPS, HMI, Motion Control, Safety und industrieller Kommunikation."
      }
    },
    {
      routeKey: "robotics",
      name: {
        es: "Robótica industrial",
        en: "Industrial robotics",
        de: "Industrierobotik"
      },
      description: {
        es: "Programación, ajuste, calibración y diagnóstico de robots industriales y sistemas de manipulación.",
        en: "Programming, adjustment, calibration and diagnostics of industrial robots and handling systems.",
        de: "Programmierung, Einstellung, Kalibrierung und Diagnose von Industrierobotern und Handlingsystemen."
      }
    },
    {
      routeKey: "skills",
      name: {
        es: "Industria 4.0 e integración de datos",
        en: "Industry 4.0 and data integration",
        de: "Industrie 4.0 und Datenintegration"
      },
      description: {
        es: "Integración de sensores, PLCs, robots, bases de datos y aplicaciones para monitorización, trazabilidad y transparencia operativa.",
        en: "Integration of sensors, PLCs, robots, databases and applications for monitoring, traceability and operational transparency.",
        de: "Integration von Sensoren, SPS, Robotern, Datenbanken und Anwendungen für Monitoring, Traceability und operative Transparenz."
      }
    },
    {
      routeKey: "projects",
      name: {
        es: "Software industrial y ERP",
        en: "Industrial software and ERP",
        de: "Industriesoftware und ERP"
      },
      description: {
        es: "Aplicaciones técnicas, herramientas internas, bases de datos, integración ERP y automatización de procesos.",
        en: "Technical applications, internal tools, databases, ERP integration and process automation.",
        de: "Technische Anwendungen, interne Werkzeuge, Datenbanken, ERP-Integration und Prozessautomatisierung."
      }
    }
  ] satisfies OfferCatalogItem[],
  socialLinks: [],
  contactPerson: {
    name: "Diego Armando Diaz Devia",
    shortName: "Diego Diaz",
    role: {
      es: "Programador de PLC y desarrollador de aplicaciones especializado en automatización industrial e Industria 4.0.",
      en: "PLC programmer and application developer specializing in industrial automation and Industry 4.0.",
      de: "SPS-Programmierer und Applikationsentwickler mit Schwerpunkt industrielle Automatisierung und Industrie 4.0."
    },
    description: {
      es: "Soy la persona técnica detrás de IoCode SOLUTIONS. Combino experiencia real en planta industrial con programación PLC, robótica, comunicaciones industriales, bases de datos, ERP y desarrollo de aplicaciones.",
      en: "I am the technical person behind IoCode SOLUTIONS. I combine hands-on industrial production experience with PLC programming, robotics, industrial communication, databases, ERP and application development.",
      de: "Ich bin die technische Kontaktperson hinter IoCode SOLUTIONS. Ich verbinde praktische Industrieerfahrung mit SPS-Programmierung, Robotik, industrieller Kommunikation, Datenbanken, ERP und Applikationsentwicklung."
    },
    links: {
      github: "https://github.com/dadd86",
      linkedin: "https://www.linkedin.com/in/diegoarmandodiaz/"
    },
    knowsAbout: {
      es: [
        "Programación PLC",
        "Automatización industrial",
        "Robótica industrial",
        "Industria 4.0",
        "OPC UA",
        "EtherCAT",
        "Profinet",
        "HMI",
        "Motion Control",
        ".NET",
        "SQL Server",
        "ERP",
        "Python",
        "Java",
        "Kotlin"
      ],
      en: [
        "PLC programming",
        "Industrial automation",
        "Industrial robotics",
        "Industry 4.0",
        "OPC UA",
        "EtherCAT",
        "Profinet",
        "HMI",
        "Motion Control",
        ".NET",
        "SQL Server",
        "ERP",
        "Python",
        "Java",
        "Kotlin"
      ],
      de: [
        "SPS-Programmierung",
        "Industrielle Automatisierung",
        "Industrierobotik",
        "Industrie 4.0",
        "OPC UA",
        "EtherCAT",
        "Profinet",
        "HMI",
        "Motion Control",
        ".NET",
        "SQL Server",
        "ERP",
        "Python",
        "Java",
        "Kotlin"
      ]
    }
  }
};