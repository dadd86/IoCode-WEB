import type { Locale } from "../i18n/config";
import type { RouteKey } from "../i18n/routes";

export type BusinessOutcome = {
  label: string;
  title: string;
  text: string;
};

export type ServicePath = {
  title: string;
  text: string;
  routeKey: RouteKey;
  ctaLabel: string;
  points: string[];
};

export type EvidencePoint = {
  title: string;
  text: string;
};

export type Phase1SectionContent = {
  eyebrow: string;
  title: string;
  text: string;
  outcomesTitle: string;
  outcomes: BusinessOutcome[];
  pathsTitle: string;
  pathsText: string;
  servicePaths: ServicePath[];
  evidenceTitle: string;
  evidenceText: string;
  evidence: EvidencePoint[];
};

export const phase1Sections: Record<
  Locale,
  Record<"home" | "services", Phase1SectionContent>
> = {
  es: {
    home: {
      eyebrow: "Valor industrial",
      title:
        "Del dato de máquina a decisiones útiles: automatización industrial con impacto operativo.",
      text:
        "IoCode SOLUTIONS no se limita a programar PLCs o desarrollar software. La propuesta es conectar planta industrial, datos y aplicaciones para mejorar decisiones, reducir paradas, facilitar mantenimiento y aumentar la visibilidad del proceso.",
      outcomesTitle: "Resultados operativos que busca cada solución",
      outcomes: [
        {
          label: "01",
          title: "Menos paradas",
          text:
            "Diagnóstico más claro, lógica de errores mantenible y mejor visibilidad para producción, mantenimiento e ingeniería."
        },
        {
          label: "02",
          title: "Más trazabilidad",
          text:
            "Datos industriales estructurados para entender qué ocurre, cuándo ocurre, dónde ocurre y cómo afecta al proceso."
        },
        {
          label: "03",
          title: "Sistemas conectados",
          text:
            "PLCs, HMIs, robots, sensores, bases de datos, ERP y aplicaciones trabajando como un flujo técnico coherente."
        }
      ],
      pathsTitle: "Áreas técnicas principales",
      pathsText:
        "Cada línea de servicio parte de una necesidad real de planta: control, operación, diagnóstico, datos, software o integración.",
      servicePaths: [
        {
          title: "PLC y HMI",
          text:
            "Programación, diagnóstico y optimización de sistemas de control industrial para maquinaria, líneas automatizadas y procesos productivos.",
          routeKey: "plc",
          ctaLabel: "Ver PLC",
          points: [
            "Siemens",
            "Omron",
            "Rockwell",
            "Beckhoff",
            "HMI",
            "Safety"
          ]
        },
        {
          title: "Robótica industrial",
          text:
            "Robots y sistemas de manipulación conectados al proceso productivo, con foco en estabilidad, precisión y recuperación de fallos.",
          routeKey: "robotics",
          ctaLabel: "Ver robótica",
          points: [
            "Fanuc",
            "OMRON",
            "Stäubli",
            "BRINK",
            "Wittmann",
            "Handling"
          ]
        },
        {
          title: "Datos e Industria 4.0",
          text:
            "Integración de señales, sensores, PLCs, robots y datos para monitorización, trazabilidad y transparencia operativa.",
          routeKey: "skills",
          ctaLabel: "Ver habilidades",
          points: [
            "OPC UA",
            "EtherCAT",
            "Profinet",
            "IoT",
            "MySQL",
            "Datos"
          ]
        },
        {
          title: "Software industrial",
          text:
            "Aplicaciones técnicas, bases de datos, ERP e interfaces para convertir procesos reales en herramientas mantenibles.",
          routeKey: "projects",
          ctaLabel: "Ver proyectos",
          points: [
            ".NET",
            "SQL Server",
            "Odoo ERP",
            "Python",
            "Java",
            "Kotlin"
          ]
        }
      ],
      evidenceTitle: "Por qué esta propuesta técnica es diferente",
      evidenceText:
        "La fortaleza no está en una sola tecnología, sino en la intersección entre automatización industrial, realidad de producción, ingeniería de software e integración de datos.",
      evidence: [
        {
          title: "Experiencia de planta",
          text:
            "Trabajo orientado a maquinaria, robots, sensores, variadores, HMI, fallos reales, mantenimiento y presión operativa."
        },
        {
          title: "Criterio software",
          text:
            "Capacidad para estructurar aplicaciones, persistencia, documentación, arquitectura por capas e integración con sistemas existentes."
        },
        {
          title: "Puente IT/OT",
          text:
            "Comprensión del control industrial y de las aplicaciones que procesan, documentan y explotan los datos de producción."
        }
      ]
    },
    services: {
      eyebrow: "Servicios orientados a resultados",
      title:
        "Servicios técnicos enfocados en estabilidad, diagnóstico, trazabilidad e integración.",
      text:
        "La automatización industrial moderna no termina en el PLC. Necesita diagnóstico, datos, documentación, software y sistemas conectados para que producción, mantenimiento e ingeniería trabajen con información fiable.",
      outcomesTitle: "Problemas que IoCode SOLUTIONS ayuda a resolver",
      outcomes: [
        {
          label: "A",
          title: "Diagnóstico insuficiente",
          text:
            "Cuando una máquina falla, el equipo necesita entender rápido qué ocurre, dónde ocurre y qué acción técnica tiene prioridad."
        },
        {
          label: "B",
          title: "Datos aislados",
          text:
            "Muchos procesos generan señales, pero no las convierten en información útil para trazabilidad, mantenimiento o mejora continua."
        },
        {
          label: "C",
          title: "Software desconectado",
          text:
            "Aplicaciones, ERP, bases de datos y automatización deben intercambiar información de forma clara, segura y mantenible."
        }
      ],
      pathsTitle: "Líneas de servicio para entornos industriales",
      pathsText:
        "Estas áreas pueden trabajarse por separado o como una solución integrada según el alcance técnico, los sistemas existentes y el riesgo operativo.",
      servicePaths: [
        {
          title: "Automatización PLC",
          text:
            "Control industrial, modificación de lógica, integración de señales, motion control, safety, HMI y diagnóstico.",
          routeKey: "plc",
          ctaLabel: "Profundizar en PLC",
          points: [
            "TIA Portal",
            "Step7",
            "Sysmac Studio",
            "Studio 5000",
            "TwinCAT"
          ]
        },
        {
          title: "Robótica y handling",
          text:
            "Ajuste, diagnóstico y soporte técnico para robots industriales, paletización y sistemas de manipulación.",
          routeKey: "robotics",
          ctaLabel: "Profundizar en robótica",
          points: [
            "Paletización",
            "Material handling",
            "3 ejes",
            "6 ejes",
            "Calibración"
          ]
        },
        {
          title: "Integración de datos",
          text:
            "Conexión entre planta, protocolos industriales, bases de datos y herramientas de visualización o análisis.",
          routeKey: "skills",
          ctaLabel: "Ver capacidades",
          points: [
            "OPC UA",
            "EtherCAT",
            "Profinet",
            "Modbus",
            "TCP/IP",
            "SQL"
          ]
        },
        {
          title: "Aplicaciones técnicas",
          text:
            "Herramientas internas, aplicaciones de escritorio o móviles, integración ERP y software de soporte a operación.",
          routeKey: "projects",
          ctaLabel: "Ver evidencia",
          points: [
            ".NET",
            "SQL Server",
            "Odoo ERP",
            "Docker",
            "Linux",
            "Windows Server"
          ]
        }
      ],
      evidenceTitle: "Criterio de entrega",
      evidenceText:
        "Cada intervención debe ser útil para producción, mantenible por el equipo técnico y verificable mediante criterios de aceptación claros.",
      evidence: [
        {
          title: "Claridad técnica",
          text:
            "Definición de alcance, riesgos, señales, usuarios, datos, restricciones y criterios de aceptación antes de construir."
        },
        {
          title: "Mantenibilidad",
          text:
            "Soluciones comprensibles, documentación mínima útil, separación de responsabilidades y reducción de complejidad innecesaria."
        },
        {
          title: "Validación",
          text:
            "Comprobación de build, rutas, enlaces, comportamiento básico, seguridad de datos y límites conocidos antes de cerrar una fase."
        }
      ]
    }
  },

  en: {
    home: {
      eyebrow: "Industrial value",
      title:
        "From machine signals to useful industrial data: automation with operational impact.",
      text:
        "IoCode SOLUTIONS is not just about PLC programming or software development. The goal is to connect shop-floor systems, data and applications so industrial teams can improve decisions, reduce downtime, support maintenance and increase process visibility.",
      outcomesTitle: "Operational outcomes",
      outcomes: [
        {
          label: "01",
          title: "Less downtime",
          text:
            "Clearer diagnostics, maintainable error logic and better visibility for production, maintenance and engineering teams."
        },
        {
          label: "02",
          title: "More traceability",
          text:
            "Structured industrial data to understand what happens, when it happens, where it happens and how it affects the process."
        },
        {
          label: "03",
          title: "Connected systems",
          text:
            "PLCs, HMIs, robots, sensors, databases, ERP platforms and applications working as one coherent technical flow."
        }
      ],
      pathsTitle: "Core technical areas",
      pathsText:
        "Each service starts from a real industrial need: control, operation, diagnostics, data, software or integration.",
      servicePaths: [
        {
          title: "PLC and HMI",
          text:
            "Programming, diagnostics and optimization of industrial control systems for machinery, automated lines and production processes.",
          routeKey: "plc",
          ctaLabel: "View PLC",
          points: [
            "Siemens",
            "Omron",
            "Rockwell",
            "Beckhoff",
            "HMI",
            "Safety"
          ]
        },
        {
          title: "Industrial robotics",
          text:
            "Robots and handling systems connected to the production process, with focus on stability, precision and fault recovery.",
          routeKey: "robotics",
          ctaLabel: "View robotics",
          points: [
            "Fanuc",
            "OMRON",
            "Stäubli",
            "BRINK",
            "Wittmann",
            "Handling"
          ]
        },
        {
          title: "Data and Industry 4.0",
          text:
            "Integration of signals, sensors, PLCs, robots and data for monitoring, traceability and operational transparency.",
          routeKey: "skills",
          ctaLabel: "View skills",
          points: [
            "OPC UA",
            "EtherCAT",
            "Profinet",
            "IoT",
            "MySQL",
            "Data"
          ]
        },
        {
          title: "Industrial software",
          text:
            "Technical applications, databases, ERP and interfaces that turn real processes into maintainable tools.",
          routeKey: "projects",
          ctaLabel: "View projects",
          points: [
            ".NET",
            "SQL Server",
            "Odoo ERP",
            "Python",
            "Java",
            "Kotlin"
          ]
        }
      ],
      evidenceTitle: "Why this technical approach is different",
      evidenceText:
        "The strength is not a single technology, but the intersection between industrial automation, production reality, software engineering and data integration.",
      evidence: [
        {
          title: "Shop-floor experience",
          text:
            "Work focused on machinery, robots, sensors, drives, HMIs, real faults, maintenance needs and operational pressure."
        },
        {
          title: "Software judgment",
          text:
            "Ability to structure applications, persistence, documentation, layered architecture and integration with existing systems."
        },
        {
          title: "IT/OT bridge",
          text:
            "Understanding of both industrial control and the applications that process, document and use production data."
        }
      ]
    },
    services: {
      eyebrow: "Result-oriented services",
      title:
        "Technical services focused on stability, diagnostics, traceability and integration.",
      text:
        "Modern industrial automation does not end at the PLC. It needs diagnostics, data, documentation, software and connected systems so production, maintenance and engineering can work with the same reliable information.",
      outcomesTitle: "Problems IoCode SOLUTIONS helps solve",
      outcomes: [
        {
          label: "A",
          title: "Insufficient diagnostics",
          text:
            "When a machine fails, the team needs to understand quickly what is happening, where it is happening and which technical action has priority."
        },
        {
          label: "B",
          title: "Isolated data",
          text:
            "Many processes generate signals but do not turn them into useful information for traceability, maintenance or continuous improvement."
        },
        {
          label: "C",
          title: "Disconnected software",
          text:
            "Applications, ERP platforms, databases and automation systems should exchange information clearly, safely and maintainably."
        }
      ],
      pathsTitle: "Service lines for industrial environments",
      pathsText:
        "These areas can be delivered separately or as an integrated solution depending on the technical scope, existing systems and operational risk.",
      servicePaths: [
        {
          title: "PLC automation",
          text:
            "Industrial control, logic modification, signal integration, motion control, safety, HMI and diagnostics.",
          routeKey: "plc",
          ctaLabel: "Explore PLC",
          points: [
            "TIA Portal",
            "Step7",
            "Sysmac Studio",
            "Studio 5000",
            "TwinCAT"
          ]
        },
        {
          title: "Robotics and handling",
          text:
            "Adjustment, diagnostics and technical support for industrial robots, palletizing and handling systems.",
          routeKey: "robotics",
          ctaLabel: "Explore robotics",
          points: [
            "Palletizing",
            "Material handling",
            "3-axis",
            "6-axis",
            "Calibration"
          ]
        },
        {
          title: "Data integration",
          text:
            "Connection between shop-floor systems, industrial protocols, databases and visualization or analysis tools.",
          routeKey: "skills",
          ctaLabel: "View capabilities",
          points: [
            "OPC UA",
            "EtherCAT",
            "Profinet",
            "Modbus",
            "TCP/IP",
            "SQL"
          ]
        },
        {
          title: "Technical applications",
          text:
            "Internal tools, desktop or mobile applications, ERP integration and software supporting operations.",
          routeKey: "projects",
          ctaLabel: "View evidence",
          points: [
            ".NET",
            "SQL Server",
            "Odoo ERP",
            "Docker",
            "Linux",
            "Windows Server"
          ]
        }
      ],
      evidenceTitle: "Delivery criteria",
      evidenceText:
        "Every intervention should be useful for production, maintainable by the technical team and verifiable through clear acceptance criteria.",
      evidence: [
        {
          title: "Technical clarity",
          text:
            "Define scope, risks, signals, users, data, constraints and acceptance criteria before building."
        },
        {
          title: "Maintainability",
          text:
            "Understandable solutions, useful documentation, separation of responsibilities and reduced unnecessary complexity."
        },
        {
          title: "Validation",
          text:
            "Check build, routes, links, basic behavior, data safety and known limits before closing a phase."
        }
      ]
    }
  },

  de: {
    home: {
      eyebrow: "Industrieller Wert",
      title:
        "Vom Maschinensignal zu nutzbaren Industriedaten: Automatisierung mit operativer Wirkung.",
      text:
        "IoCode SOLUTIONS steht nicht nur für SPS-Programmierung oder Softwareentwicklung. Ziel ist es, Produktionsanlagen, Daten und Anwendungen zu verbinden, damit industrielle Teams bessere Entscheidungen treffen, Stillstände reduzieren, Instandhaltung unterstützen und mehr Prozesstransparenz gewinnen können.",
      outcomesTitle: "Operative Ergebnisse",
      outcomes: [
        {
          label: "01",
          title: "Weniger Stillstand",
          text:
            "Klarere Diagnose, wartbare Fehlerlogik und bessere Sichtbarkeit für Produktion, Instandhaltung und Engineering."
        },
        {
          label: "02",
          title: "Mehr Traceability",
          text:
            "Strukturierte Industriedaten, um zu verstehen, was passiert, wann es passiert, wo es passiert und wie es den Prozess beeinflusst."
        },
        {
          label: "03",
          title: "Vernetzte Systeme",
          text:
            "SPS, HMI, Roboter, Sensoren, Datenbanken, ERP-Systeme und Anwendungen als zusammenhängender technischer Ablauf."
        }
      ],
      pathsTitle: "Zentrale technische Bereiche",
      pathsText:
        "Jede Leistung beginnt mit einem realen industriellen Bedarf: Steuerung, Betrieb, Diagnose, Daten, Software oder Integration.",
      servicePaths: [
        {
          title: "SPS und HMI",
          text:
            "Programmierung, Diagnose und Optimierung industrieller Steuerungssysteme für Maschinen, automatisierte Linien und Produktionsprozesse.",
          routeKey: "plc",
          ctaLabel: "SPS ansehen",
          points: [
            "Siemens",
            "Omron",
            "Rockwell",
            "Beckhoff",
            "HMI",
            "Safety"
          ]
        },
        {
          title: "Industrierobotik",
          text:
            "Roboter und Handlingsysteme mit direktem Bezug zum Produktionsprozess, mit Fokus auf Stabilität, Präzision und Fehlerbehebung.",
          routeKey: "robotics",
          ctaLabel: "Robotik ansehen",
          points: [
            "Fanuc",
            "OMRON",
            "Stäubli",
            "BRINK",
            "Wittmann",
            "Handling"
          ]
        },
        {
          title: "Daten und Industrie 4.0",
          text:
            "Integration von Signalen, Sensoren, SPS, Robotern und Daten für Monitoring, Traceability und operative Transparenz.",
          routeKey: "skills",
          ctaLabel: "Fähigkeiten ansehen",
          points: [
            "OPC UA",
            "EtherCAT",
            "Profinet",
            "IoT",
            "MySQL",
            "Daten"
          ]
        },
        {
          title: "Industriesoftware",
          text:
            "Technische Anwendungen, Datenbanken, ERP und Schnittstellen, die reale Prozesse in wartbare Werkzeuge übertragen.",
          routeKey: "projects",
          ctaLabel: "Projekte ansehen",
          points: [
            ".NET",
            "SQL Server",
            "Odoo ERP",
            "Python",
            "Java",
            "Kotlin"
          ]
        }
      ],
      evidenceTitle: "Warum dieser technische Ansatz anders ist",
      evidenceText:
        "Die Stärke liegt nicht in einer einzelnen Technologie, sondern in der Schnittstelle zwischen industrieller Automatisierung, Produktionsrealität, Softwareentwicklung und Datenintegration.",
      evidence: [
        {
          title: "Produktionserfahrung",
          text:
            "Arbeit mit Maschinen, Robotern, Sensoren, Antrieben, HMI, realen Fehlern, Instandhaltungsanforderungen und operativem Druck."
        },
        {
          title: "Softwareverständnis",
          text:
            "Fähigkeit, Anwendungen, Persistenz, Dokumentation, Schichtenarchitektur und Integration in bestehende Systeme zu strukturieren."
        },
        {
          title: "IT/OT-Brücke",
          text:
            "Verständnis für industrielle Steuerung und für Anwendungen, die Produktionsdaten verarbeiten, dokumentieren und nutzbar machen."
        }
      ]
    },
    services: {
      eyebrow: "Ergebnisorientierte Leistungen",
      title:
        "Technische Leistungen mit Fokus auf Stabilität, Diagnose, Traceability und Integration.",
      text:
        "Moderne industrielle Automatisierung endet nicht an der SPS. Sie braucht Diagnose, Daten, Dokumentation, Software und vernetzte Systeme, damit Produktion, Instandhaltung und Engineering mit denselben zuverlässigen Informationen arbeiten können.",
      outcomesTitle: "Probleme, bei denen IoCode SOLUTIONS unterstützen kann",
      outcomes: [
        {
          label: "A",
          title: "Unzureichende Diagnose",
          text:
            "Wenn eine Maschine ausfällt, muss das Team schnell verstehen, was passiert, wo es passiert und welche technische Maßnahme Priorität hat."
        },
        {
          label: "B",
          title: "Isolierte Daten",
          text:
            "Viele Prozesse erzeugen Signale, wandeln sie aber nicht in nutzbare Informationen für Traceability, Instandhaltung oder kontinuierliche Verbesserung um."
        },
        {
          label: "C",
          title: "Nicht vernetzte Software",
          text:
            "Anwendungen, ERP-Systeme, Datenbanken und Automatisierung sollten Informationen klar, sicher und wartbar austauschen."
        }
      ],
      pathsTitle: "Leistungslinien für industrielle Umgebungen",
      pathsText:
        "Diese Bereiche können einzeln oder als integrierte Lösung umgesetzt werden, abhängig vom technischen Umfang, den vorhandenen Systemen und dem operativen Risiko.",
      servicePaths: [
        {
          title: "SPS-Automatisierung",
          text:
            "Industrielle Steuerung, Logikänderung, Signalintegration, Motion Control, Safety, HMI und Diagnose.",
          routeKey: "plc",
          ctaLabel: "SPS vertiefen",
          points: [
            "TIA Portal",
            "Step7",
            "Sysmac Studio",
            "Studio 5000",
            "TwinCAT"
          ]
        },
        {
          title: "Robotik und Handling",
          text:
            "Einstellung, Diagnose und technischer Support für Industrieroboter, Palettierung und Handlingsysteme.",
          routeKey: "robotics",
          ctaLabel: "Robotik vertiefen",
          points: [
            "Palettierung",
            "Material Handling",
            "3 Achsen",
            "6 Achsen",
            "Kalibrierung"
          ]
        },
        {
          title: "Datenintegration",
          text:
            "Verbindung zwischen Produktion, industriellen Protokollen, Datenbanken und Visualisierungs- oder Analysewerkzeugen.",
          routeKey: "skills",
          ctaLabel: "Fähigkeiten ansehen",
          points: [
            "OPC UA",
            "EtherCAT",
            "Profinet",
            "Modbus",
            "TCP/IP",
            "SQL"
          ]
        },
        {
          title: "Technische Anwendungen",
          text:
            "Interne Werkzeuge, Desktop- oder Mobile-Anwendungen, ERP-Integration und Software zur Unterstützung des Betriebs.",
          routeKey: "projects",
          ctaLabel: "Evidenz ansehen",
          points: [
            ".NET",
            "SQL Server",
            "Odoo ERP",
            "Docker",
            "Linux",
            "Windows Server"
          ]
        }
      ],
      evidenceTitle: "Lieferkriterien",
      evidenceText:
        "Jede technische Umsetzung soll für die Produktion nützlich, für das technische Team wartbar und durch klare Akzeptanzkriterien überprüfbar sein.",
      evidence: [
        {
          title: "Technische Klarheit",
          text:
            "Umfang, Risiken, Signale, Benutzer, Daten, Einschränkungen und Akzeptanzkriterien vor der Umsetzung definieren."
        },
        {
          title: "Wartbarkeit",
          text:
            "Verständliche Lösungen, nützliche Dokumentation, Trennung von Verantwortlichkeiten und Reduzierung unnötiger Komplexität."
        },
        {
          title: "Validierung",
          text:
            "Build, Routen, Links, Grundverhalten, Datensicherheit und bekannte Grenzen prüfen, bevor eine Phase abgeschlossen wird."
        }
      ]
    }
  }
};