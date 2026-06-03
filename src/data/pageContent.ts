import type { Locale } from "../i18n/config";
import type { RouteKey } from "../i18n/routes";

export type CardContent = {
  title: string;
  text: string;
  items?: string[];
};

export type PageContent = {
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  intro: string;
  cards?: CardContent[];
};

export const pageContent: Record<Locale, Record<RouteKey, PageContent>> = {
  es: {
    home: {
      title: "IoCode SOLUTIONS | Automatización industrial, PLC, robótica e Industria 4.0",
      description:
        "Empresa técnica en Aachen especializada en automatización industrial, PLC, robótica, software industrial, datos, ERP e Industria 4.0.",
      eyebrow: "IoCode SOLUTIONS",
      heading: "Automatización industrial, robótica y software para conectar máquinas, datos y procesos.",
      intro:
        "IoCode SOLUTIONS desarrolla soluciones técnicas para unir planta industrial, PLCs, robots, bases de datos, ERP y aplicaciones. El foco es mejorar diagnóstico, trazabilidad, estabilidad y visibilidad operativa.",
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
      title: "Servicios | PLC, robótica, software industrial e Industria 4.0",
      description:
        "Servicios empresariales de automatización PLC, HMI, robótica industrial, software técnico, integración IoT, datos industriales y ERP.",
      eyebrow: "Servicios",
      heading: "Soluciones técnicas para conectar planta industrial, software y datos.",
      intro:
        "Los servicios se orientan a resolver problemas operativos reales: paradas, falta de diagnóstico, datos aislados, integración entre sistemas y software difícil de mantener.",
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
      title: "Proceso | Diagnóstico, arquitectura, desarrollo y validación",
      description:
        "Proceso de trabajo para proyectos de automatización, software industrial, IoT, datos, ERP e integración técnica.",
      eyebrow: "Proceso",
      heading: "Trabajo por fases, con claridad técnica y foco en resultados.",
      intro:
        "Un buen proyecto técnico empieza entendiendo el problema real, los riesgos, los datos disponibles y los criterios de aceptación.",
      cards: [
        { title: "Diagnóstico", text: "Objetivos, usuarios, máquinas, datos, restricciones, riesgos, entorno técnico y alcance real." },
        { title: "Propuesta técnica", text: "Arquitectura, entregables, tecnologías, fases, dependencias y criterios de aceptación." },
        { title: "Desarrollo modular", text: "Construcción por partes pequeñas, mantenibles, documentadas y revisables." },
        { title: "Validación", text: "Pruebas funcionales, revisión de enlaces, build, responsive, accesibilidad básica y riesgos pendientes." }
      ]
    },
    contact: {
      title: "Contacto | IoCode SOLUTIONS",
      description:
        "Contacto empresarial para automatización industrial, PLC, robótica, software industrial, ERP, datos e Industria 4.0.",
      eyebrow: "Contacto",
      heading: "Hablemos de máquinas, datos, software o procesos.",
      intro:
        "Contacta con IoCode SOLUTIONS para proyectos técnicos de automatización, robótica, software industrial, integración de datos o sistemas Industria 4.0. En esta página también puedes verificar la persona técnica responsable mediante LinkedIn y GitHub."
    }
  },

  en: {
    home: {
      title: "IoCode SOLUTIONS | Industrial Automation, PLC, Robotics & Industry 4.0",
      description:
        "Technical company in Aachen for industrial automation, PLC programming, robotics, industrial software, data integration, ERP and Industry 4.0.",
      eyebrow: "IoCode SOLUTIONS",
      heading: "Industrial automation, robotics and software to connect machines, data and processes.",
      intro:
        "IoCode SOLUTIONS builds technical solutions that connect shop-floor systems, PLCs, robots, databases, ERP platforms and applications. The focus is clearer diagnostics, traceability, process stability and operational visibility.",
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
      title: "Services | PLC, Robotics, Industrial Software & Industry 4.0",
      description:
        "Business services for PLC automation, HMI, industrial robotics, technical software, IoT integration, industrial data and ERP systems.",
      eyebrow: "Services",
      heading: "Technical solutions that connect the shop floor, software and data.",
      intro:
        "The services focus on real operational problems: downtime, insufficient diagnostics, isolated data, system integration and software that must remain maintainable.",
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
      title: "Process | Diagnostics, Architecture, Development and Validation",
      description:
        "Work process for automation, industrial software, IoT, data, ERP and technical integration projects.",
      eyebrow: "Process",
      heading: "Work in phases, with technical clarity and focus on results.",
      intro:
        "A good technical project starts by understanding the real problem, risks, available data and acceptance criteria.",
      cards: [
        { title: "Diagnostics", text: "Goals, users, machines, data, constraints, risks, technical environment and real scope." },
        { title: "Technical proposal", text: "Architecture, deliverables, technologies, phases, dependencies and acceptance criteria." },
        { title: "Modular development", text: "Small, maintainable, documented and reviewable parts." },
        { title: "Validation", text: "Functional tests, link review, build, responsive behavior, basic accessibility and remaining risks." }
      ]
    },
    contact: {
      title: "Contact | IoCode SOLUTIONS",
      description:
        "Business contact for industrial automation, PLC, robotics, industrial software, ERP, data and Industry 4.0.",
      eyebrow: "Contact",
      heading: "Let us talk about machines, data, software or processes.",
      intro:
        "Contact IoCode SOLUTIONS for technical projects involving automation, robotics, industrial software, data integration or Industry 4.0 systems. This page also lets you verify the technical contact person through LinkedIn and GitHub."
    }
  },

  de: {
    home: {
      title: "IoCode SOLUTIONS | SPS, Automatisierung, Robotik und Industrie 4.0",
      description:
        "Technisches Unternehmen in Aachen für industrielle Automatisierung, SPS-Programmierung, Robotik, Industriesoftware, Datenintegration, ERP und Industrie 4.0.",
      eyebrow: "IoCode SOLUTIONS",
      heading: "Industrielle Automatisierung, Robotik und Software zur Verbindung von Maschinen, Daten und Prozessen.",
      intro:
        "IoCode SOLUTIONS entwickelt technische Lösungen, die Produktionsanlagen, SPS, Roboter, Datenbanken, ERP-Systeme und Anwendungen verbinden. Im Fokus stehen klare Diagnose, Traceability, Prozessstabilität und operative Transparenz.",
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
      title: "Leistungen | SPS, Robotik, Industriesoftware und Industrie 4.0",
      description:
        "Unternehmensleistungen für SPS-Automatisierung, HMI, Industrierobotik, technische Software, IoT-Integration, Industriedaten und ERP-Systeme.",
      eyebrow: "Leistungen",
      heading: "Technische Lösungen, die Produktion, Software und Daten verbinden.",
      intro:
        "Die Leistungen fokussieren reale operative Probleme: Stillstand, unzureichende Diagnose, isolierte Daten, Systemintegration und Software, die wartbar bleiben muss.",
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
      title: "Prozess | Diagnose, Architektur, Entwicklung und Validierung",
      description:
        "Arbeitsprozess für Automatisierung, Industriesoftware, IoT, Daten, ERP und technische Integrationsprojekte.",
      eyebrow: "Prozess",
      heading: "Arbeit in Phasen, mit technischer Klarheit und Fokus auf Ergebnisse.",
      intro:
        "Ein gutes technisches Projekt beginnt mit dem Verständnis des realen Problems, der Risiken, der verfügbaren Daten und der Akzeptanzkriterien.",
      cards: [
        { title: "Diagnose", text: "Ziele, Benutzer, Maschinen, Daten, Einschränkungen, Risiken, technische Umgebung und realer Umfang." },
        { title: "Technischer Vorschlag", text: "Architektur, Lieferobjekte, Technologien, Phasen, Abhängigkeiten und Akzeptanzkriterien." },
        { title: "Modulare Entwicklung", text: "Kleine, wartbare, dokumentierte und überprüfbare Teile." },
        { title: "Validierung", text: "Funktionale Tests, Link-Prüfung, Build, Responsive-Verhalten, grundlegende Barrierefreiheit und verbleibende Risiken." }
      ]
    },
    contact: {
      title: "Kontakt | IoCode SOLUTIONS",
      description:
        "Geschäftlicher Kontakt für industrielle Automatisierung, SPS, Robotik, Industriesoftware, ERP, Daten und Industrie 4.0.",
      eyebrow: "Kontakt",
      heading: "Sprechen wir über Maschinen, Daten, Software oder Prozesse.",
      intro:
        "Kontakt zu IoCode SOLUTIONS für technische Projekte in Automatisierung, Robotik, Industriesoftware, Datenintegration oder Industrie-4.0-Systemen. Auf dieser Seite kann die technische Kontaktperson über LinkedIn und GitHub geprüft werden."
    }
  }
};