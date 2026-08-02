import type { Locale } from "../i18n/config";
import type { RouteKey } from "../i18n/routes";

export type CardContent = {
  title: string;
  text: string;
  items?: string[];
};

export type HeroHeadingContent = {
  lead: string;
  highlight: string;
  tail: string;
};

export type ServiceMapNode = {
  label: string;
  detail: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};

export type PageContent = {
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  intro: string;
  heroHeading?: HeroHeadingContent;
  proofPoints?: string[];
  serviceMap?: ServiceMapNode[];
  cards?: CardContent[];
};

export const pageContent: Record<Locale, Record<RouteKey, PageContent>> = {
  es: {
    home: {
      title: "IoCode SOLUTIONS | PLC, robótica, datos y software industrial",
      description:
        "Empresa técnica especializada en automatización industrial, PLC, robótica, software industrial, datos, ERP e integración IT/OT.",
      eyebrow: "Automatización industrial + software",
      heading: "Máquinas conectadas, datos útiles y producción estable.",
      heroHeading: {
        lead: "Máquinas conectadas.",
        highlight: "Datos útiles.",
        tail: "Producción estable."
      },
      intro:
        "De la señal de planta a la aplicación: diagnóstico, HMI, robótica, bases de datos, ERP e integración IT/OT para reducir paradas, mejorar trazabilidad y dar visibilidad operativa.",
      proofPoints: [
        "PLC / HMI",
        "Robótica",
        "OPC UA / EtherCAT",
        "Software industrial",
        "Datos + ERP"
      ],
      cards: [
        {
          title: "Experiencia industrial real",
          text: "Soluciones pensadas para maquinaria, HMI, robots, sensores, variadores, diagnóstico de fallos y procesos productivos reales."
        },
        {
          title: "Software conectado a planta",
          text: "Aplicaciones, bases de datos e integraciones para convertir datos técnicos en herramientas útiles para operación e ingeniería."
        },
        {
          title: "Visión IT/OT",
          text: "Automatización, datos, ERP, Docker, Linux, Windows Server y arquitectura software trabajando como un sistema coherente."
        }
      ]
    },
    services: {
      title: "Servicios técnicos | PLC, HMI, robótica, IoT y software industrial",
      description:
        "Servicios técnicos de automatización PLC, HMI, robótica industrial, integración IoT, datos industriales, software técnico y ERP.",
      eyebrow: "Servicios técnicos",
      heading: "Conectar planta, software y datos con criterio industrial.",
      intro:
        "Automatización, diagnóstico, robótica, sensores, bases de datos y aplicaciones para reducir paradas, mejorar trazabilidad y mantener sistemas industriales conectados.",
      serviceMap: [
        {
          label: "PLC / HMI",
          detail: "Control, diagnóstico y operación",
          position: "top-left"
        },
        {
          label: "Robótica",
          detail: "Movimiento, proceso y manipulación",
          position: "top-right"
        },
        {
          label: "IoT / Datos",
          detail: "Sensores, trazabilidad y señales",
          position: "bottom-left"
        },
        {
          label: "Software / ERP",
          detail: "Aplicaciones, bases de datos e integración",
          position: "bottom-right"
        }
      ],
      cards: [
        {
          title: "Automatización PLC y HMI",
          text: "Programación, diagnóstico y optimización de sistemas PLC, HMI, motion control, safety y comunicaciones industriales.",
          items: ["Siemens TIA Portal", "Step7", "WinCC", "Omron Sysmac Studio", "Rockwell Studio 5000", "Beckhoff TwinCAT"]
        },
        {
          title: "Robótica industrial",
          text: "Programación, ajuste, calibración y diagnóstico de robots industriales y sistemas de manipulación.",
          items: ["Fanuc", "OMRON", "Stäubli", "BRINK", "Wittmann", "Paletización", "Material handling"]
        },
        {
          title: "Industria 4.0 e IoT",
          text: "Integración de sensores, PLCs, robots, bases de datos y aplicaciones para monitorización y trazabilidad.",
          items: ["OPC UA", "EtherCAT", "Profinet", "Modbus", "TCP/IP", "IoT", "Datos industriales"]
        },
        {
          title: "Software industrial y ERP",
          text: "Aplicaciones técnicas, herramientas internas, bases de datos, integración ERP y automatización de procesos.",
          items: [".NET", "C#", "Python", "Java", "Kotlin", "SQL Server", "MySQL", "Odoo ERP"]
        }
      ]
    },
    plc: {
      title: "Programación PLC y HMI | Siemens, Omron, Rockwell, Beckhoff",
      description:
        "Programación PLC, HMI, diagnóstico industrial, motion control, safety, OPC UA, EtherCAT, Profinet y sistemas de automatización.",
      eyebrow: "Automatización PLC",
      heading: "Programación PLC, HMI y diagnóstico para sistemas industriales.",
      intro:
        "Diseño, modificación y optimización de lógica de control industrial con foco en estabilidad, diagnóstico, seguridad y mantenibilidad.",
      cards: [
        {
          title: "Control industrial",
          text: "Desarrollo, modificación y depuración de lógica de control para maquinaria y líneas automatizadas.",
          items: ["Ladder Logic", "SFC", "Structured Text", "TIA Portal", "Sysmac Studio", "Studio 5000", "TwinCAT"]
        },
        {
          title: "HMI, alarmas y diagnóstico",
          text: "Pantallas, estados, alarmas y lógica de diagnóstico para mejorar visibilidad y reducir paradas.",
          items: ["WinCC", "KTP-HMI", "SCADA", "Alarmas", "Estados", "Trazabilidad"]
        },
        {
          title: "Comunicaciones industriales",
          text: "Conexión de equipos, sensores, controladores, robots y sistemas de datos mediante protocolos industriales.",
          items: ["OPC UA", "EtherCAT", "Profinet", "Modbus", "TCP/IP"]
        }
      ]
    },
    robotics: {
      title: "Robótica industrial | Fanuc, OMRON, Stäubli, BRINK y Wittmann",
      description:
        "Robótica industrial, paletización, material handling, robots de 3 y 6 ejes, diagnóstico, calibración y optimización.",
      eyebrow: "Robótica industrial",
      heading: "Robots industriales y sistemas de manipulación conectados al proceso.",
      intro:
        "Programación, ajuste, diagnóstico y recuperación operativa de robots industriales en entornos de producción.",
      cards: [
        {
          title: "Robots industriales",
          text: "Trabajo con robots y sistemas de manipulación integrados en procesos productivos.",
          items: ["Fanuc", "OMRON", "Stäubli", "BRINK", "Wittmann"]
        },
        {
          title: "Paletización y handling",
          text: "Ajuste de movimientos, manipulación de materiales, recuperación de fallos y soporte a producción.",
          items: ["Paletización", "Material handling", "Robots de 3 ejes", "Robots de 6 ejes"]
        },
        {
          title: "Diagnóstico y mejora",
          text: "Análisis de fallos, calibración de parámetros y mejora de precisión, repetibilidad y calidad.",
          items: ["Diagnóstico", "Calibración", "Puesta en marcha", "Mantenimiento", "Soporte técnico"]
        }
      ]
    },
    about: {
      title: "Empresa | IoCode SOLUTIONS",
      description:
        "IoCode SOLUTIONS es una empresa técnica especializada en automatización industrial, PLC, robótica, software industrial e Industria 4.0.",
      eyebrow: "Empresa",
      heading: "Una empresa técnica entre planta industrial, automatización y software.",
      intro:
        "IoCode SOLUTIONS conecta experiencia industrial, programación PLC, robótica, comunicaciones industriales, bases de datos, ERP, DevOps y desarrollo de aplicaciones para crear soluciones mantenibles y orientadas a resultados.",
      cards: [
        {
          title: "Automatización y planta",
          text: "Trabajo técnico con PLCs Siemens, Omron, Rockwell y Beckhoff, HMI, safety, motion control, variadores y diagnóstico industrial."
        },
        {
          title: "Robótica y producción",
          text: "Integración y soporte de robots Fanuc, OMRON, Stäubli, BRINK y Wittmann para paletización, manipulación, calibración y recuperación de fallos."
        },
        {
          title: "Software, datos e IT",
          text: "Desarrollo con .NET, C#, Python, Java, Kotlin, SQL Server, MySQL, Docker, Linux, Windows Server, Odoo ERP y arquitectura por capas."
        },
        {
          title: "Mentalidad de negocio",
          text: "El objetivo es reducir paradas, mejorar diagnóstico, aumentar trazabilidad y conectar sistemas que normalmente trabajan aislados."
        }
      ]
    },
    projects: {
      title: "Proyectos | Software industrial, ERP, Android, Docker y datos",
      description:
        "Proyectos seleccionados de IoCode SOLUTIONS: .NET, SQL Server, Odoo ERP, Android, Firebase, Docker, OpenLDAP y software industrial.",
      eyebrow: "Proyectos",
      heading: "Proyectos seleccionados por valor profesional, no por cantidad.",
      intro:
        "El portafolio muestra criterio técnico, arquitectura, documentación, integración de sistemas y capacidad para convertir requisitos complejos en soluciones mantenibles."
    },
    skills: {
      title: "Habilidades | PLC, robótica, software, ERP, Docker e Industria 4.0",
      description:
        "Habilidades técnicas en programación PLC, robótica industrial, comunicaciones industriales, software, bases de datos, ERP, Docker y sistemas.",
      eyebrow: "Habilidades técnicas",
      heading: "Automatización industrial, software y datos en una misma propuesta técnica.",
      intro:
        "La combinación clave es entender el cuadro eléctrico, el PLC, el robot, la HMI, la base de datos y la aplicación."
    },
    process: {
      title: "Proceso técnico | Diagnóstico, propuesta, desarrollo y validación",
      description:
        "Método de trabajo de IoCode SOLUTIONS para proyectos industriales: diagnóstico técnico, propuesta, desarrollo modular, validación, control de riesgos y entrega verificable.",
      eyebrow: "Proceso",
      heading: "Método técnico para reducir incertidumbre antes de construir.",
      intro:
        "IoCode SOLUTIONS trabaja por fases para entender el problema real, controlar riesgos, definir criterios de aceptación y entregar soluciones industriales mantenibles."
    },
    contact: {
      title: "Contacto | IoCode SOLUTIONS",
      description:
        "Contacto empresarial para automatización industrial, PLC, robótica, software industrial, ERP, datos e Industria 4.0.",
      eyebrow: "Contacto",
      heading: "Hablemos de máquinas, datos, software o procesos.",
      intro:
        "Contacta con IoCode SOLUTIONS para proyectos técnicos de automatización, robótica, software industrial, integración de datos o sistemas Industria 4.0. En esta página también puedes verificar la persona técnica responsable mediante LinkedIn y GitHub."
    },
    imprint: {
      title: "Aviso legal | IoCode SOLUTIONS",
      description:
        "Información legal, identificación del proveedor y datos de contacto de IoCode SOLUTIONS conforme al § 5 DDG alemán.",
      eyebrow: "Información legal",
      heading: "Aviso legal",
      intro: "Identificación permanente del responsable de este servicio digital."
    },
    privacy: {
      title: "Política de privacidad | IoCode SOLUTIONS",
      description:
        "Información sobre el tratamiento de datos personales, registros técnicos, contacto y derechos conforme al artículo 13 del RGPD.",
      eyebrow: "Protección de datos",
      heading: "Política de privacidad",
      intro: "Información transparente sobre los datos tratados al visitar o contactar este sitio."
    }
  },

  en: {
    home: {
      title: "IoCode SOLUTIONS | PLC, robotics, data and industrial software",
      description:
        "Technical company specialized in industrial automation, PLC programming, robotics, industrial software, data, ERP and IT/OT integration.",
      eyebrow: "Industrial automation + software",
      heading: "Connected machines, useful data and stable production.",
      heroHeading: {
        lead: "Connected machines.",
        highlight: "Useful data.",
        tail: "Stable production."
      },
      intro:
        "From shop-floor signals to usable applications: diagnostics, HMI, robotics, databases, ERP and IT/OT integration to reduce downtime, improve traceability and increase operational visibility.",
      proofPoints: [
        "PLC / HMI",
        "Robotics",
        "OPC UA / EtherCAT",
        "Industrial software",
        "Data + ERP"
      ],
      cards: [
        {
          title: "Real industrial experience",
          text: "Solutions designed for machinery, HMIs, robots, sensors, drives, fault diagnostics and real production processes."
        },
        {
          title: "Software connected to the shop floor",
          text: "Applications, databases and integrations that turn technical signals into useful tools for production, maintenance and engineering."
        },
        {
          title: "IT/OT perspective",
          text: "Automation, data, ERP, Docker, Linux, Windows Server and software architecture working as one coherent technical system."
        }
      ]
    },
    services: {
      title: "Technical services | PLC, HMI, robotics, IoT and industrial software",
      description:
        "Technical services for PLC automation, HMI, industrial robotics, IoT integration, industrial data, technical software and ERP.",
      eyebrow: "Technical services",
      heading: "Connect the shop floor, software and data with industrial criteria.",
      intro:
        "Automation, diagnostics, robotics, sensors, databases and applications to reduce downtime, improve traceability and keep industrial systems connected.",
      serviceMap: [
        {
          label: "PLC / HMI",
          detail: "Control, diagnostics and operation",
          position: "top-left"
        },
        {
          label: "Robotics",
          detail: "Motion, process and handling",
          position: "top-right"
        },
        {
          label: "IoT / Data",
          detail: "Sensors, traceability and signals",
          position: "bottom-left"
        },
        {
          label: "Software / ERP",
          detail: "Applications, databases and integration",
          position: "bottom-right"
        }
      ],
      cards: [
        {
          title: "PLC and HMI automation",
          text: "Programming, diagnostics and optimization of PLC, HMI, motion control, safety and industrial communication systems.",
          items: ["Siemens TIA Portal", "Step7", "WinCC", "Omron Sysmac Studio", "Rockwell Studio 5000", "Beckhoff TwinCAT"]
        },
        {
          title: "Industrial robotics",
          text: "Programming, adjustment, calibration and diagnostics of industrial robots and handling systems.",
          items: ["Fanuc", "OMRON", "Stäubli", "BRINK", "Wittmann", "Palletizing", "Material handling"]
        },
        {
          title: "Industry 4.0 and industrial data",
          text: "Integration of sensors, PLCs, robots, databases and applications for monitoring, traceability and process transparency.",
          items: ["OPC UA", "EtherCAT", "Profinet", "Modbus", "TCP/IP", "IoT", "Industrial data"]
        },
        {
          title: "Industrial software and ERP",
          text: "Technical applications, internal tools, databases, ERP integration and process automation.",
          items: [".NET", "C#", "Python", "Java", "Kotlin", "SQL Server", "MySQL", "Odoo ERP"]
        }
      ]
    },
    plc: {
      title: "PLC and HMI Programming | Siemens, Omron, Rockwell, Beckhoff",
      description:
        "PLC programming, HMI, industrial diagnostics, motion control, safety, OPC UA, EtherCAT, Profinet and automation systems.",
      eyebrow: "PLC automation",
      heading: "PLC programming, HMI and diagnostics for industrial systems.",
      intro:
        "Design, modification and optimization of industrial control logic with focus on stability, diagnostics, safety and maintainability.",
      cards: [
        { title: "Industrial control", text: "Development, modification and debugging of control logic for machinery and automated lines.", items: ["Ladder Logic", "SFC", "Structured Text", "TIA Portal", "Sysmac Studio", "Studio 5000", "TwinCAT"] },
        { title: "HMI, alarms and diagnostics", text: "Screens, states, alarms and diagnostic logic to improve visibility and reduce downtime.", items: ["WinCC", "KTP-HMI", "SCADA", "Alarms", "States", "Traceability"] },
        { title: "Industrial communications", text: "Connection of equipment, sensors, controllers, robots and data systems through industrial protocols.", items: ["OPC UA", "EtherCAT", "Profinet", "Modbus", "TCP/IP"] }
      ]
    },
    robotics: {
      title: "Industrial Robotics | Fanuc, OMRON, Stäubli, BRINK and Wittmann",
      description:
        "Industrial robotics, palletizing, material handling, 3-axis and 6-axis robots, diagnostics, calibration and optimization.",
      eyebrow: "Industrial robotics",
      heading: "Industrial robots and handling systems connected to the process.",
      intro:
        "Programming, adjustment, diagnostics and operational recovery of industrial robots in production environments.",
      cards: [
        { title: "Industrial robots", text: "Work with robots and handling systems integrated into production processes.", items: ["Fanuc", "OMRON", "Stäubli", "BRINK", "Wittmann"] },
        { title: "Palletizing and handling", text: "Motion adjustment, material handling, fault recovery and production support.", items: ["Palletizing", "Material handling", "3-axis robots", "6-axis robots"] },
        { title: "Diagnostics and improvement", text: "Fault analysis, parameter calibration and improvement of precision, repeatability and quality.", items: ["Diagnostics", "Calibration", "Commissioning", "Maintenance", "Technical support"] }
      ]
    },
    about: {
      title: "Company | IoCode SOLUTIONS",
      description:
        "IoCode SOLUTIONS is a technical company specialized in industrial automation, PLC, robotics, industrial software and Industry 4.0.",
      eyebrow: "Company",
      heading: "A technical company between industrial production, automation and software.",
      intro:
        "IoCode SOLUTIONS connects industrial experience, PLC programming, robotics, industrial communication, databases, ERP, DevOps and application development to create maintainable, result-oriented solutions.",
      cards: [
        { title: "Automation and shop floor", text: "Technical work with Siemens, Omron, Rockwell and Beckhoff PLCs, HMI, safety, motion control, drives and industrial diagnostics." },
        { title: "Robotics and production", text: "Integration and support of Fanuc, OMRON, Stäubli, BRINK and Wittmann robots for palletizing, handling, calibration and fault recovery." },
        { title: "Software, data and IT", text: "Development with .NET, C#, Python, Java, Kotlin, SQL Server, MySQL, Docker, Linux, Windows Server, Odoo ERP and layered architecture." },
        { title: "Business mindset", text: "The goal is to reduce downtime, improve diagnostics, increase traceability and connect systems that normally work in isolation." }
      ]
    },
    projects: {
      title: "Projects | Industrial Software, ERP, Android, Docker and Data",
      description:
        "Selected projects by IoCode SOLUTIONS: .NET, SQL Server, Odoo ERP, Android, Firebase, Docker, OpenLDAP and industrial software.",
      eyebrow: "Projects",
      heading: "Projects selected by professional value, not quantity.",
      intro:
        "The portfolio shows technical judgment, architecture, documentation, system integration and the ability to turn complex requirements into maintainable solutions."
    },
    skills: {
      title: "Skills | PLC, Robotics, Software, ERP, Docker and Industry 4.0",
      description:
        "Technical skills in PLC programming, industrial robotics, industrial communications, software, databases, ERP, Docker and systems.",
      eyebrow: "Technical skills",
      heading: "Industrial automation, software and data in one technical proposal.",
      intro:
        "The key combination is understanding the electrical cabinet, the PLC, the robot, the HMI, the database and the application."
    },
    process: {
      title: "Technical Process | Diagnostics, Proposal, Development and Validation",
      description:
        "IoCode SOLUTIONS work method for industrial projects: technical diagnostics, proposal, modular development, validation, risk control and verifiable delivery.",
      eyebrow: "Process",
      heading: "A technical method to reduce uncertainty before building.",
      intro:
        "IoCode SOLUTIONS works in phases to understand the real problem, control risks, define acceptance criteria and deliver maintainable industrial solutions."
    },
    contact: {
      title: "Contact | IoCode SOLUTIONS",
      description:
        "Business contact for industrial automation, PLC, robotics, industrial software, ERP, data and Industry 4.0.",
      eyebrow: "Contact",
      heading: "Let us talk about machines, data, software or processes.",
      intro:
        "Contact IoCode SOLUTIONS for technical projects involving automation, robotics, industrial software, data integration or Industry 4.0 systems. This page also lets you verify the technical contact person through LinkedIn and GitHub."
    },
    imprint: {
      title: "Imprint | IoCode SOLUTIONS",
      description:
        "Provider identification, legal information and contact details for IoCode SOLUTIONS under section 5 of the German DDG.",
      eyebrow: "Legal information",
      heading: "Imprint",
      intro: "Permanent identification of the person responsible for this digital service."
    },
    privacy: {
      title: "Privacy policy | IoCode SOLUTIONS",
      description:
        "Information about personal-data processing, technical logs, contact and data-subject rights under Article 13 GDPR.",
      eyebrow: "Data protection",
      heading: "Privacy policy",
      intro: "Transparent information about data processed when visiting or contacting this website."
    }
  },

  de: {
    home: {
      title: "IoCode SOLUTIONS | SPS, Robotik, Daten und Industriesoftware",
      description:
        "Technisches Unternehmen für SPS-Programmierung, industrielle Automatisierung, Robotik, Industriesoftware, Daten, ERP und IT/OT-Integration.",
      eyebrow: "Automatisierung + Software",
      heading: "Vernetzte Maschinen, nutzbare Daten und stabile Produktion.",
      heroHeading: {
        lead: "Vernetzte Maschinen.",
        highlight: "Nutzbare Daten.",
        tail: "Stabile Produktion."
      },
      intro:
        "Von der SPS-Signalebene bis zur Anwendung: Diagnose, HMI, Robotik, Datenbanken, ERP und IT/OT-Integration für weniger Stillstände, mehr Traceability und klare operative Transparenz.",
      proofPoints: [
        "SPS / HMI",
        "Robotik",
        "OPC UA / EtherCAT",
        "Industriesoftware",
        "Daten + ERP"
      ],
      cards: [
        {
          title: "Reale Industrieerfahrung",
          text: "Lösungen für Maschinen, HMI, Roboter, Sensoren, Antriebe, Fehlerdiagnose und reale Produktionsprozesse."
        },
        {
          title: "Software mit Bezug zur Produktion",
          text: "Anwendungen, Datenbanken und Integrationen, die technische Signale in nützliche Werkzeuge für Produktion, Instandhaltung und Engineering verwandeln."
        },
        {
          title: "IT/OT-Perspektive",
          text: "Automatisierung, Daten, ERP, Docker, Linux, Windows Server und Softwarearchitektur als zusammenhängendes technisches System."
        }
      ]
    },
    services: {
      title: "Technische Services | SPS, HMI, Robotik, IoT und Industriesoftware",
      description:
        "Technische Services für SPS-Automatisierung, HMI, Industrierobotik, IoT-Integration, Industriedaten, Industriesoftware und ERP.",
      eyebrow: "Technische Services",
      heading: "Produktion, Software und Daten mit industriellem Blick verbinden.",
      intro:
        "Automatisierung, Diagnose, Robotik, Sensorik, Datenbanken und Anwendungen zur Reduzierung von Stillständen, besseren Rückverfolgbarkeit und verbundenen Industriesystemen.",
      serviceMap: [
        {
          label: "SPS / HMI",
          detail: "Steuerung, Diagnose und Bedienung",
          position: "top-left"
        },
        {
          label: "Robotik",
          detail: "Bewegung, Prozess und Handling",
          position: "top-right"
        },
        {
          label: "IoT / Daten",
          detail: "Sensorik, Rückverfolgbarkeit und Signale",
          position: "bottom-left"
        },
        {
          label: "Software / ERP",
          detail: "Anwendungen, Datenbanken und Integration",
          position: "bottom-right"
        }
      ],
      cards: [
        {
          title: "SPS- und HMI-Automatisierung",
          text: "Programmierung, Diagnose und Optimierung von SPS, HMI, Motion Control, Safety und industrieller Kommunikation.",
          items: ["Siemens TIA Portal", "Step7", "WinCC", "Omron Sysmac Studio", "Rockwell Studio 5000", "Beckhoff TwinCAT"]
        },
        {
          title: "Industrierobotik",
          text: "Programmierung, Einstellung, Kalibrierung und Diagnose von Industrierobotern und Handlingsystemen.",
          items: ["Fanuc", "OMRON", "Stäubli", "BRINK", "Wittmann", "Palettierung", "Material Handling"]
        },
        {
          title: "Industrie 4.0 und Industriedaten",
          text: "Integration von Sensoren, SPS, Robotern, Datenbanken und Anwendungen für Monitoring, Traceability und Prozesstransparenz.",
          items: ["OPC UA", "EtherCAT", "Profinet", "Modbus", "TCP/IP", "IoT", "Industriedaten"]
        },
        {
          title: "Industriesoftware und ERP",
          text: "Technische Anwendungen, interne Werkzeuge, Datenbanken, ERP-Integration und Prozessautomatisierung.",
          items: [".NET", "C#", "Python", "Java", "Kotlin", "SQL Server", "MySQL", "Odoo ERP"]
        }
      ]
    },
    plc: {
      title: "SPS- und HMI-Programmierung | Siemens, Omron, Rockwell, Beckhoff",
      description:
        "SPS-Programmierung, HMI, industrielle Diagnose, Motion Control, Safety, OPC UA, EtherCAT, Profinet und Automatisierungssysteme.",
      eyebrow: "SPS-Automatisierung",
      heading: "SPS-Programmierung, HMI und Diagnose für industrielle Systeme.",
      intro:
        "Entwurf, Änderung und Optimierung industrieller Steuerungslogik mit Fokus auf Stabilität, Diagnose, Sicherheit und Wartbarkeit.",
      cards: [
        { title: "Industrielle Steuerung", text: "Entwicklung, Änderung und Fehlersuche von Steuerungslogik für Maschinen und automatisierte Linien.", items: ["Ladder Logic", "SFC", "Structured Text", "TIA Portal", "Sysmac Studio", "Studio 5000", "TwinCAT"] },
        { title: "HMI, Alarme und Diagnose", text: "Bedienbilder, Zustände, Alarme und Diagnoselogik zur Verbesserung der Sichtbarkeit und Reduzierung von Stillständen.", items: ["WinCC", "KTP-HMI", "SCADA", "Alarme", "Zustände", "Traceability"] },
        { title: "Industrielle Kommunikation", text: "Verbindung von Geräten, Sensoren, Steuerungen, Robotern und Datensystemen über industrielle Protokolle.", items: ["OPC UA", "EtherCAT", "Profinet", "Modbus", "TCP/IP"] }
      ]
    },
    robotics: {
      title: "Industrierobotik | Fanuc, OMRON, Stäubli, BRINK und Wittmann",
      description:
        "Industrierobotik, Palettierung, Material Handling, 3-Achs- und 6-Achs-Roboter, Diagnose, Kalibrierung und Optimierung.",
      eyebrow: "Industrierobotik",
      heading: "Industrieroboter und Handlingsysteme mit Prozessbezug.",
      intro:
        "Programmierung, Einstellung, Diagnose und operative Wiederherstellung von Industrierobotern in Produktionsumgebungen.",
      cards: [
        { title: "Industrieroboter", text: "Arbeit mit Robotern und Handlingsystemen, die in Produktionsprozesse integriert sind.", items: ["Fanuc", "OMRON", "Stäubli", "BRINK", "Wittmann"] },
        { title: "Palettierung und Handling", text: "Bewegungsanpassung, Material Handling, Fehlerbehebung und Produktionsunterstützung.", items: ["Palettierung", "Material Handling", "3-Achs-Roboter", "6-Achs-Roboter"] },
        { title: "Diagnose und Verbesserung", text: "Fehleranalyse, Parameterkalibrierung und Verbesserung von Präzision, Wiederholbarkeit und Qualität.", items: ["Diagnose", "Kalibrierung", "Inbetriebnahme", "Wartung", "Technischer Support"] }
      ]
    },
    about: {
      title: "Unternehmen | IoCode SOLUTIONS",
      description:
        "IoCode SOLUTIONS ist ein technisches Unternehmen für industrielle Automatisierung, SPS, Robotik, Industriesoftware und Industrie 4.0.",
      eyebrow: "Unternehmen",
      heading: "Ein technisches Unternehmen zwischen Produktion, Automatisierung und Software.",
      intro:
        "IoCode SOLUTIONS verbindet Industrieerfahrung, SPS-Programmierung, Robotik, industrielle Kommunikation, Datenbanken, ERP, DevOps und Applikationsentwicklung für wartbare und ergebnisorientierte Lösungen.",
      cards: [
        { title: "Automatisierung und Produktion", text: "Technische Arbeit mit Siemens, Omron, Rockwell und Beckhoff SPS, HMI, Safety, Motion Control, Antrieben und industrieller Diagnose." },
        { title: "Robotik und Produktion", text: "Integration und Support von Fanuc, OMRON, Stäubli, BRINK und Wittmann Robotern für Palettierung, Handling, Kalibrierung und Fehlerbehebung." },
        { title: "Software, Daten und IT", text: "Entwicklung mit .NET, C#, Python, Java, Kotlin, SQL Server, MySQL, Docker, Linux, Windows Server, Odoo ERP und Schichtenarchitektur." },
        { title: "Business-Mentalität", text: "Ziel ist es, Stillstände zu reduzieren, Diagnose zu verbessern, Traceability zu erhöhen und isolierte Systeme zu verbinden." }
      ]
    },
    projects: {
      title: "Projekte | Industriesoftware, ERP, Android, Docker und Daten",
      description:
        "Ausgewählte Projekte von IoCode SOLUTIONS: .NET, SQL Server, Odoo ERP, Android, Firebase, Docker, OpenLDAP und Industriesoftware.",
      eyebrow: "Projekte",
      heading: "Projekte ausgewählt nach professionellem Wert, nicht nach Menge.",
      intro:
        "Das Portfolio zeigt technisches Urteilsvermögen, Architektur, Dokumentation, Systemintegration und die Fähigkeit, komplexe Anforderungen in wartbare Lösungen zu übertragen."
    },
    skills: {
      title: "Fähigkeiten | SPS, Robotik, Software, ERP, Docker und Industrie 4.0",
      description:
        "Technische Fähigkeiten in SPS-Programmierung, Industrierobotik, industrieller Kommunikation, Software, Datenbanken, ERP, Docker und Systemen.",
      eyebrow: "Technische Fähigkeiten",
      heading: "Industrielle Automatisierung, Software und Daten in einem technischen Angebot.",
      intro:
        "Die entscheidende Kombination ist das Verständnis von Schaltschrank, SPS, Roboter, HMI, Datenbank und Anwendung."
    },
    process: {
      title: "Technischer Prozess | Diagnose, Vorschlag, Entwicklung und Validierung",
      description:
        "Arbeitsmethode von IoCode SOLUTIONS für Industrieprojekte: technische Diagnose, Vorschlag, modulare Entwicklung, Validierung, Risikokontrolle und überprüfbare Übergabe.",
      eyebrow: "Prozess",
      heading: "Ein technischer Ablauf, um Unsicherheit vor der Umsetzung zu reduzieren.",
      intro:
        "IoCode SOLUTIONS arbeitet in Phasen, um das reale Problem zu verstehen, Risiken zu kontrollieren, Akzeptanzkriterien zu definieren und wartbare industrielle Lösungen zu liefern."
    },
    contact: {
      title: "Kontakt | IoCode SOLUTIONS",
      description:
        "Geschäftlicher Kontakt für industrielle Automatisierung, SPS, Robotik, Industriesoftware, ERP, Daten und Industrie 4.0.",
      eyebrow: "Kontakt",
      heading: "Sprechen wir über Maschinen, Daten, Software oder Prozesse.",
      intro:
        "Kontakt zu IoCode SOLUTIONS für technische Projekte in Automatisierung, Robotik, Industriesoftware, Datenintegration oder Industrie-4.0-Systemen. Auf dieser Seite kann die technische Kontaktperson über LinkedIn und GitHub geprüft werden."
    },
    imprint: {
      title: "Impressum | IoCode SOLUTIONS",
      description:
        "Anbieterkennzeichnung, Pflichtangaben und Kontaktinformationen von IoCode SOLUTIONS gemäß § 5 DDG.",
      eyebrow: "Rechtliche Angaben",
      heading: "Impressum",
      intro: "Ständig verfügbare Anbieterkennzeichnung für diesen digitalen Dienst."
    },
    privacy: {
      title: "Datenschutzerklärung | IoCode SOLUTIONS",
      description:
        "Informationen zur Verarbeitung personenbezogener Daten, Server-Protokollen, Kontaktaufnahme und Betroffenenrechten gemäß Artikel 13 DSGVO.",
      eyebrow: "Datenschutz",
      heading: "Datenschutzerklärung",
      intro: "Transparente Informationen zur Datenverarbeitung beim Besuch und bei der Kontaktaufnahme."
    }
  }
};
