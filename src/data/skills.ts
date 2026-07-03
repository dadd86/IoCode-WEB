import type { Locale } from "../i18n/config";
import type { RouteKey } from "../i18n/routes";

export type SkillGroupType =
  | "industrial-automation"
  | "robotics"
  | "industrial-communications"
  | "industrial-software"
  | "data-databases"
  | "erp-business-systems"
  | "devops-systems"
  | "documentation-qa";

export type SkillApplicationLevel =
  | "applied-experience"
  | "technical-case"
  | "local-lab"
  | "academic"
  | "documented-knowledge";

export type SkillGroup = {
  slug: SkillGroupType;
  title: string;
  searchIntent: string;
  businessProblem: string;
  technologies: string[];
  businessValue: string;
  useCases: string[];
  relatedServices: RouteKey[];
  relatedProjects: string[];
  applicationLevel: SkillApplicationLevel;
  caution: string;
};

export const skillGroups: Record<Locale, SkillGroup[]> = {
  es: [
    {
      slug: "industrial-automation",
      title: "Automatización PLC/HMI",
      searchIntent:
        "Programación PLC, integración HMI, diagnóstico de máquinas, lógica de control industrial y mantenimiento técnico.",
      businessProblem:
        "Las máquinas necesitan lógica de control mantenible, trazable y entendible por mantenimiento, producción e ingeniería.",
      technologies: [
        "Siemens TIA Portal",
        "Step7",
        "WinCC",
        "Omron Sysmac Studio",
        "CX-One",
        "Rockwell Studio 5000",
        "Beckhoff TwinCAT",
        "ST",
        "Ladder",
        "SFC",
        "Motion Control"
      ],
      businessValue:
        "Permite estructurar automatización industrial con diagnóstico, documentación y menor dependencia de conocimiento informal.",
      useCases: [
        "Control de estaciones automáticas",
        "Integración HMI-operador",
        "Diagnóstico de secuencias y señales",
        "Modificación segura de lógica existente"
      ],
      relatedServices: ["plc", "services", "contact"],
      relatedProjects: ["maceta-inteligente", "ad-wsus"],
      applicationLevel: "applied-experience",
      caution:
        "La capacidad se presenta como experiencia técnica aplicada; no se prometen mejoras productivas medibles sin evidencia del caso concreto."
    },
    {
      slug: "robotics",
      title: "Robótica industrial",
      searchIntent:
        "Programación de robots industriales, ajuste de movimientos, diagnóstico, manipulación y automatización de estaciones.",
      businessProblem:
        "Los sistemas robotizados requieren movimientos fiables, integración con señales de máquina y diagnóstico claro de fallos.",
      technologies: [
        "Fanuc",
        "OMRON",
        "Stäubli",
        "BRINK",
        "Wittmann",
        "Robots de 3 ejes",
        "Robots de 6 ejes",
        "Manipulación",
        "Palletizing"
      ],
      businessValue:
        "Ayuda a integrar robots con máquinas, sensores y lógica de proceso para reducir dependencia de ajustes manuales poco documentados.",
      useCases: [
        "Manipulación de piezas",
        "Secuencias robot-máquina",
        "Diagnóstico de estaciones robotizadas",
        "Ajuste de posiciones y ciclos"
      ],
      relatedServices: ["robotics", "services", "contact"],
      relatedProjects: ["maceta-inteligente"],
      applicationLevel: "applied-experience",
      caution:
        "La descripción no implica certificación de marca ni validación de seguridad funcional; cada célula debe evaluarse según su riesgo real."
    },
    {
      slug: "industrial-communications",
      title: "Comunicaciones industriales",
      searchIntent:
        "OPC UA, EtherCAT, Profinet, Modbus, TCP/IP industrial, integración IT/OT e intercambio de datos de máquina.",
      businessProblem:
        "Los equipos industriales, PLCs, HMIs, bases de datos y aplicaciones necesitan comunicarse sin perder trazabilidad ni estabilidad.",
      technologies: ["OPC UA", "EtherCAT", "Profinet", "Modbus", "TCP/IP", "IoT", "Fieldbus", "Industrial Ethernet"],
      businessValue:
        "Facilita conectar producción, datos y software para diagnóstico, reporting e integración entre OT e IT.",
      useCases: [
        "Lectura de datos de PLC",
        "Comunicación máquina-software",
        "Integración de sensores y actuadores",
        "Base para trazabilidad industrial"
      ],
      relatedServices: ["plc", "services", "projects"],
      relatedProjects: ["maceta-inteligente", "odoo-erp-deployment"],
      applicationLevel: "technical-case",
      caution:
        "Cada red industrial debe validarse con la arquitectura real, requisitos de seguridad, latencia, disponibilidad y fabricante."
    },
    {
      slug: "industrial-software",
      title: "Software industrial",
      searchIntent:
        "Herramientas de software para industria, integración con máquinas, aplicaciones internas y arquitectura mantenible.",
      businessProblem:
        "Muchas empresas necesitan herramientas internas que conecten operación, datos y automatización sin crear soluciones difíciles de mantener.",
      technologies: ["C#", ".NET", "Python", "Java", "Kotlin", "C++", "OOP", "MVC", "MVVM", "APIs"],
      businessValue:
        "Permite crear aplicaciones y utilidades técnicas para conectar procesos industriales con software mantenible.",
      useCases: [
        "Aplicaciones internas de soporte técnico",
        "Herramientas de diagnóstico",
        "Interfaces entre datos y operación",
        "Prototipos técnicos para validar procesos"
      ],
      relatedServices: ["services", "projects", "contact"],
      relatedProjects: ["techwizards", "hotelsol", "java-mvc-dao-javafx"],
      applicationLevel: "applied-experience",
      caution:
        "Las tecnologías se presentan como stack técnico aplicable; no se promete una solución SaaS productiva sin alcance, pruebas y despliegue definidos."
    },
    {
      slug: "data-databases",
      title: "Datos y bases de datos",
      searchIntent:
        "SQL, PostgreSQL, MySQL, modelado de datos, trazabilidad, reporting técnico y persistencia para aplicaciones.",
      businessProblem:
        "Los datos técnicos pierden valor si no están modelados, normalizados, documentados y conectados con el proceso que los genera.",
      technologies: ["PostgreSQL", "MySQL", "SQL Server", "SQL", "DAO", "ETL básico", "Modelado de datos", "Trazabilidad"],
      businessValue:
        "Ayuda a convertir datos técnicos en información consultable para mantenimiento, reporting, análisis y toma de decisiones.",
      useCases: [
        "Modelado de tablas",
        "Trazabilidad de eventos",
        "Persistencia para aplicaciones",
        "Preparación de datos para análisis"
      ],
      relatedServices: ["services", "projects", "contact"],
      relatedProjects: ["neuronaprediccion", "maceta-inteligente", "hotelsol"],
      applicationLevel: "technical-case",
      caution:
        "No se prometen resultados analíticos, predicciones o calidad de datos sin datasets, criterios de validación y contexto real."
    },
    {
      slug: "erp-business-systems",
      title: "ERP y sistemas de negocio",
      searchIntent:
        "Odoo, ERP, integración de procesos, despliegue local, PostgreSQL, documentación y sistemas empresariales.",
      businessProblem:
        "Las empresas necesitan validar sistemas ERP reproducibles antes de conectarlos con procesos reales, usuarios y datos sensibles.",
      technologies: ["Odoo", "PostgreSQL", "Docker", "ERP", "Procesos de negocio", "Documentación operativa"],
      businessValue:
        "Permite preparar entornos ERP técnicos, documentados y reproducibles antes de una implantación formal.",
      useCases: [
        "Despliegue local de ERP",
        "Validación de servicios dependientes",
        "Documentación de arranque",
        "Preparación para integración con datos"
      ],
      relatedServices: ["services", "projects", "contact"],
      relatedProjects: ["odoo-erp-deployment", "hotelsol"],
      applicationLevel: "local-lab",
      caution:
        "Se presenta como caso técnico local; no como implantación productiva ni como proyecto de cliente."
    },
    {
      slug: "devops-systems",
      title: "DevOps, Docker y sistemas",
      searchIntent:
        "Docker, Windows Server, Linux, Active Directory, OpenLDAP, WSUS, despliegue y entornos reproducibles.",
      businessProblem:
        "Los proyectos técnicos necesitan entornos reproducibles, documentación de ejecución y separación clara entre desarrollo, prueba y operación.",
      technologies: ["Docker", "Linux", "Windows Server", "Active Directory", "OpenLDAP", "WSUS", "DNS", "GPO", "GitHub"],
      businessValue:
        "Reduce fricción al validar entornos técnicos y facilita reproducibilidad, documentación y revisión por otros técnicos.",
      useCases: [
        "Contenedores de prueba",
        "Laboratorios de identidad",
        "Entornos de validación",
        "Documentación de ejecución"
      ],
      relatedServices: ["services", "projects", "contact"],
      relatedProjects: ["openldap-docker", "ad-wsus", "odoo-erp-deployment"],
      applicationLevel: "technical-case",
      caution:
        "No se publican credenciales, IPs internas, dominios internos ni datos reales. Cada entorno productivo requiere revisión de seguridad."
    },
    {
      slug: "documentation-qa",
      title: "Documentación, QA y validación",
      searchIntent:
        "Documentación técnica, QA web, validación de builds, Playwright, Lighthouse, accesibilidad y criterios de cierre.",
      businessProblem:
        "Los proyectos pierden credibilidad si no tienen evidencias de validación, documentación actualizada y criterios claros de cierre.",
      technologies: ["Playwright", "Lighthouse", "Astro check", "TypeScript", "QA artifacts", "Markdown", "UML", "Release checklist"],
      businessValue:
        "Permite entregar trabajo técnico con evidencia, trazabilidad y menos ambigüedad para clientes, equipos y auditorías internas.",
      useCases: [
        "Validación de rutas",
        "Revisión de claims",
        "Pruebas de accesibilidad",
        "Documentación de cierre de fases"
      ],
      relatedServices: ["process", "projects", "contact"],
      relatedProjects: ["hotelsol", "techwizards"],
      applicationLevel: "applied-experience",
      caution:
        "La validación automatizada reduce riesgos, pero no sustituye revisión legal, seguridad productiva o pruebas con usuarios reales cuando apliquen."
    }
  ],
  en: [
    {
      slug: "industrial-automation",
      title: "PLC/HMI automation",
      searchIntent: "PLC programming, HMI integration, machine diagnostics, industrial control logic and technical maintenance.",
      businessProblem: "Machines need maintainable, traceable control logic that can be understood by maintenance, production and engineering teams.",
      technologies: ["SPS/PLC","Siemens TIA Portal", "Step7", "WinCC", "Omron Sysmac Studio", "CX-One", "Rockwell Studio 5000", "Beckhoff TwinCAT", "ST", "Ladder", "SFC", "Motion Control"],
      businessValue: "Helps structure industrial automation with diagnostics, documentation and less dependence on informal knowledge.",
      useCases: ["Automatic station control", "Operator HMI integration", "Sequence and signal diagnostics", "Safe modification of existing logic"],
      relatedServices: ["plc", "services", "contact"],
      relatedProjects: ["maceta-inteligente", "ad-wsus"],
      applicationLevel: "applied-experience",
      caution: "This is presented as applied technical capability; measurable production improvements are not promised without case-specific evidence."
    },
    {
      slug: "robotics",
      title: "Industrial robotics",
      searchIntent: "Industrial robot programming, motion adjustment, diagnostics, handling and automated stations.",
      businessProblem: "Robotized systems require reliable movements, machine-signal integration and clear fault diagnostics.",
      technologies: ["Fanuc", "OMRON", "Stäubli", "BRINK", "Wittmann", "3-axis robots", "6-axis robots", "Handling", "Palletizing"],
      businessValue: "Supports integration of robots with machines, sensors and process logic while reducing undocumented manual adjustments.",
      useCases: ["Part handling", "Robot-machine sequences", "Robotized station diagnostics", "Position and cycle adjustment"],
      relatedServices: ["robotics", "services", "contact"],
      relatedProjects: ["maceta-inteligente"],
      applicationLevel: "applied-experience",
      caution: "This does not imply brand certification or functional safety validation; each cell must be assessed according to its actual risk."
    },
    {
      slug: "industrial-communications",
      title: "Industrial communications",
      searchIntent: "OPC UA, EtherCAT, Profinet, Modbus, industrial TCP/IP, IT/OT integration and machine data exchange.",
      businessProblem: "Industrial equipment, PLCs, HMIs, databases and applications need to communicate without losing traceability or stability.",
      technologies: ["OPC UA", "EtherCAT", "Profinet", "Modbus", "TCP/IP", "IoT", "Fieldbus", "Industrial Ethernet"],
      businessValue: "Helps connect production, data and software for diagnostics, reporting and IT/OT integration.",
      useCases: ["PLC data reading", "Machine-software communication", "Sensor and actuator integration", "Industrial traceability base"],
      relatedServices: ["plc", "services", "projects"],
      relatedProjects: ["maceta-inteligente", "odoo-erp-deployment"],
      applicationLevel: "technical-case",
      caution: "Each industrial network must be validated against the real architecture, safety needs, latency, availability and vendor constraints."
    },
    {
      slug: "industrial-software",
      title: "Industrial software",
      searchIntent: "Software tools for industry, machine integration, internal applications and maintainable architecture.",
      businessProblem: "Many companies need internal tools that connect operations, data and automation without creating hard-to-maintain solutions.",
      technologies: ["C#", ".NET", "Python", "Java", "Kotlin", "C++", "OOP", "MVC", "MVVM", "APIs"],
      businessValue: "Enables technical applications and utilities that connect industrial processes with maintainable software.",
      useCases: ["Internal technical support applications", "Diagnostic tools", "Interfaces between data and operations", "Technical prototypes to validate processes"],
      relatedServices: ["services", "projects", "contact"],
      relatedProjects: ["techwizards", "hotelsol", "java-mvc-dao-javafx"],
      applicationLevel: "applied-experience",
      caution: "The stack is presented as applicable technical capability; no production SaaS solution is promised without defined scope, tests and deployment."
    },
    {
      slug: "data-databases",
      title: "Data and databases",
      searchIntent: "SQL, PostgreSQL, MySQL, data modeling, traceability, technical reporting and persistence for applications.",
      businessProblem: "Technical data loses value if it is not modeled, normalized, documented and connected to the process that generates it.",
      technologies: ["PostgreSQL", "MySQL", "SQL Server", "SQL", "DAO", "Basic ETL", "Data modeling", "Traceability"],
      businessValue: "Helps turn technical data into queryable information for maintenance, reporting, analysis and decisions.",
      useCases: ["Table modeling", "Event traceability", "Application persistence", "Data preparation for analysis"],
      relatedServices: ["services", "projects", "contact"],
      relatedProjects: ["neuronaprediccion", "maceta-inteligente", "hotelsol"],
      applicationLevel: "technical-case",
      caution: "No analytical results, predictions or data quality outcomes are promised without datasets, validation criteria and real context."
    },
    {
      slug: "erp-business-systems",
      title: "ERP and business systems",
      searchIntent: "Odoo, ERP, process integration, local deployment, PostgreSQL, documentation and business systems.",
      businessProblem: "Companies need reproducible ERP environments before connecting them with real processes, users and sensitive data.",
      technologies: ["Odoo", "PostgreSQL", "Docker", "ERP", "Business processes", "Operational documentation"],
      businessValue: "Supports technical, documented and reproducible ERP environments before a formal implementation.",
      useCases: ["Local ERP deployment", "Dependent service validation", "Startup documentation", "Preparation for data integration"],
      relatedServices: ["services", "projects", "contact"],
      relatedProjects: ["odoo-erp-deployment", "hotelsol"],
      applicationLevel: "local-lab",
      caution: "Presented as a local technical case, not as a production deployment or client implementation."
    },
    {
      slug: "devops-systems",
      title: "DevOps, Docker and systems",
      searchIntent: "Docker, Windows Server, Linux, Active Directory, OpenLDAP, WSUS, deployment and reproducible environments.",
      businessProblem: "Technical projects need reproducible environments, execution documentation and separation between development, testing and operation.",
      technologies: ["Docker", "Linux", "Windows Server", "Active Directory", "OpenLDAP", "WSUS", "DNS", "GPO", "GitHub"],
      businessValue: "Reduces friction when validating technical environments and improves reproducibility, documentation and technical review.",
      useCases: ["Test containers", "Identity labs", "Validation environments", "Execution documentation"],
      relatedServices: ["services", "projects", "contact"],
      relatedProjects: ["openldap-docker", "ad-wsus", "odoo-erp-deployment"],
      applicationLevel: "technical-case",
      caution: "No credentials, internal IPs, internal domains or real data are published. Production environments require security review."
    },
    {
      slug: "documentation-qa",
      title: "Documentation, QA and validation",
      searchIntent: "Technical documentation, web QA, build validation, Playwright, Lighthouse, accessibility and phase closure criteria.",
      businessProblem: "Projects lose credibility without validation evidence, updated documentation and clear closure criteria.",
      technologies: ["Playwright", "Lighthouse", "Astro check", "TypeScript", "QA artifacts", "Markdown", "UML", "Release checklist"],
      businessValue: "Supports technical delivery with evidence, traceability and less ambiguity for clients, teams and internal reviews.",
      useCases: ["Route validation", "Claims review", "Accessibility checks", "Phase closure documentation"],
      relatedServices: ["process", "projects", "contact"],
      relatedProjects: ["hotelsol", "techwizards"],
      applicationLevel: "applied-experience",
      caution: "Automated validation reduces risk, but does not replace legal review, production security or real user testing when required."
    }
  ],
  de: [
    {
      slug: "industrial-automation",
      title: "SPS/PLC/HMI-Automatisierung",
      searchIntent: "SPS-Programmierung, HMI-Integration, Maschinendiagnose, industrielle Steuerungslogik und technische Instandhaltung.",
      businessProblem: "Maschinen benötigen wartbare und nachvollziehbare Steuerungslogik, die Instandhaltung, Produktion und Engineering verstehen können.",
      technologies: ["Siemens TIA Portal", "Step7", "WinCC", "Omron Sysmac Studio", "CX-One", "Rockwell Studio 5000", "Beckhoff TwinCAT", "ST", "Ladder", "SFC", "Motion Control"],
      businessValue: "Hilft, industrielle Automatisierung mit Diagnose, Dokumentation und weniger Abhängigkeit von informellem Wissen zu strukturieren.",
      useCases: ["Steuerung automatischer Stationen", "HMI-Integration für Bediener", "Diagnose von Sequenzen und Signalen", "Sichere Anpassung bestehender Logik"],
      relatedServices: ["plc", "services", "contact"],
      relatedProjects: ["maceta-inteligente", "ad-wsus"],
      applicationLevel: "applied-experience",
      caution: "Die Fähigkeit wird als angewandte technische Erfahrung beschrieben; messbare Produktionsverbesserungen werden ohne projektspezifische Evidenz nicht versprochen."
    },
    {
      slug: "robotics",
      title: "Industrierobotik",
      searchIntent: "Programmierung von Industrierobotern, Bewegungsanpassung, Diagnose, Handling und automatisierte Stationen.",
      businessProblem: "Robotersysteme benötigen zuverlässige Bewegungen, Integration mit Maschinensignalen und klare Fehlerdiagnose.",
      technologies: ["Fanuc", "OMRON", "Stäubli", "BRINK", "Wittmann", "3-Achs-Roboter", "6-Achs-Roboter", "Handling", "Palletizing"],
      businessValue: "Unterstützt die Integration von Robotern mit Maschinen, Sensoren und Prozesslogik und reduziert undokumentierte manuelle Anpassungen.",
      useCases: ["Teilehandling", "Roboter-Maschine-Sequenzen", "Diagnose robotisierter Stationen", "Positions- und Zyklusanpassung"],
      relatedServices: ["robotics", "services", "contact"],
      relatedProjects: ["maceta-inteligente"],
      applicationLevel: "applied-experience",
      caution: "Dies bedeutet keine Herstellerzertifizierung oder funktionale Sicherheitsvalidierung; jede Zelle muss nach realem Risiko bewertet werden."
    },
    {
      slug: "industrial-communications",
      title: "Industrielle Kommunikation",
      searchIntent: "OPC UA, EtherCAT, Profinet, Modbus, industrielles TCP/IP, IT/OT-Integration und Maschinendatenaustausch.",
      businessProblem: "Industrieanlagen, SPS, HMIs, Datenbanken und Anwendungen müssen kommunizieren, ohne Nachvollziehbarkeit oder Stabilität zu verlieren.",
      technologies: ["OPC UA", "EtherCAT", "Profinet", "Modbus", "TCP/IP", "IoT", "Fieldbus", "Industrial Ethernet"],
      businessValue: "Hilft, Produktion, Daten und Software für Diagnose, Reporting und IT/OT-Integration zu verbinden.",
      useCases: ["SPS-Daten lesen", "Maschine-Software-Kommunikation", "Sensor- und Aktor-Integration", "Basis für industrielle Traceability"],
      relatedServices: ["plc", "services", "projects"],
      relatedProjects: ["maceta-inteligente", "odoo-erp-deployment"],
      applicationLevel: "technical-case",
      caution: "Jedes industrielle Netzwerk muss anhand realer Architektur, Sicherheitsanforderungen, Latenz, Verfügbarkeit und Herstellerbedingungen validiert werden."
    },
    {
      slug: "industrial-software",
      title: "Industriesoftware",
      searchIntent: "Softwarewerkzeuge für Industrie, Maschinenintegration, interne Anwendungen und wartbare Architektur.",
      businessProblem: "Viele Unternehmen benötigen interne Werkzeuge, die Betrieb, Daten und Automatisierung verbinden, ohne schwer wartbare Lösungen zu erzeugen.",
      technologies: ["C#", ".NET", "Python", "Java", "Kotlin", "C++", "OOP", "MVC", "MVVM", "APIs"],
      businessValue: "Ermöglicht technische Anwendungen und Werkzeuge, die industrielle Prozesse mit wartbarer Software verbinden.",
      useCases: ["Interne technische Support-Anwendungen", "Diagnosewerkzeuge", "Schnittstellen zwischen Daten und Betrieb", "Technische Prototypen zur Prozessvalidierung"],
      relatedServices: ["services", "projects", "contact"],
      relatedProjects: ["techwizards", "hotelsol", "java-mvc-dao-javafx"],
      applicationLevel: "applied-experience",
      caution: "Der Stack wird als anwendbare technische Fähigkeit beschrieben; eine produktive SaaS-Lösung wird ohne definierten Umfang, Tests und Deployment nicht versprochen."
    },
    {
      slug: "data-databases",
      title: "Daten und Datenbanken",
      searchIntent: "SQL, PostgreSQL, MySQL, Datenmodellierung, Traceability, technisches Reporting und Persistenz für Anwendungen.",
      businessProblem: "Technische Daten verlieren Wert, wenn sie nicht modelliert, normalisiert, dokumentiert und mit dem erzeugenden Prozess verbunden sind.",
      technologies: ["PostgreSQL", "MySQL", "SQL Server", "SQL", "DAO", "Basis-ETL", "Datenmodellierung", "Traceability"],
      businessValue: "Hilft, technische Daten in abfragbare Informationen für Instandhaltung, Reporting, Analyse und Entscheidungen zu verwandeln.",
      useCases: ["Tabellenmodellierung", "Event-Traceability", "Persistenz für Anwendungen", "Datenvorbereitung für Analyse"],
      relatedServices: ["services", "projects", "contact"],
      relatedProjects: ["neuronaprediccion", "maceta-inteligente", "hotelsol"],
      applicationLevel: "technical-case",
      caution: "Analytische Ergebnisse, Prognosen oder Datenqualität werden ohne Datensätze, Validierungskriterien und realen Kontext nicht versprochen."
    },
    {
      slug: "erp-business-systems",
      title: "ERP und Geschäftssysteme",
      searchIntent: "Odoo, ERP, Prozessintegration, lokales Deployment, PostgreSQL, Dokumentation und Geschäftssysteme.",
      businessProblem: "Unternehmen benötigen reproduzierbare ERP-Umgebungen, bevor sie diese mit realen Prozessen, Benutzern und sensiblen Daten verbinden.",
      technologies: ["Odoo", "PostgreSQL", "Docker", "ERP", "Geschäftsprozesse", "Operative Dokumentation"],
      businessValue: "Unterstützt technische, dokumentierte und reproduzierbare ERP-Umgebungen vor einer formalen Einführung.",
      useCases: ["Lokales ERP-Deployment", "Validierung abhängiger Dienste", "Startdokumentation", "Vorbereitung für Datenintegration"],
      relatedServices: ["services", "projects", "contact"],
      relatedProjects: ["odoo-erp-deployment", "hotelsol"],
      applicationLevel: "local-lab",
      caution: "Dargestellt als lokaler technischer Fall, nicht als produktives Deployment oder Kundenimplementierung."
    },
    {
      slug: "devops-systems",
      title: "DevOps, Docker und Systeme",
      searchIntent: "Docker, Windows Server, Linux, Active Directory, OpenLDAP, WSUS, Deployment und reproduzierbare Umgebungen.",
      businessProblem: "Technische Projekte benötigen reproduzierbare Umgebungen, Ausführungsdokumentation und Trennung zwischen Entwicklung, Test und Betrieb.",
      technologies: ["Docker", "Linux", "Windows Server", "Active Directory", "OpenLDAP", "WSUS", "DNS", "GPO", "GitHub"],
      businessValue: "Reduziert Reibung bei der Validierung technischer Umgebungen und verbessert Reproduzierbarkeit, Dokumentation und technische Prüfung.",
      useCases: ["Testcontainer", "Identity-Labore", "Validierungsumgebungen", "Ausführungsdokumentation"],
      relatedServices: ["services", "projects", "contact"],
      relatedProjects: ["openldap-docker", "ad-wsus", "odoo-erp-deployment"],
      applicationLevel: "technical-case",
      caution: "Es werden keine Zugangsdaten, internen IPs, internen Domains oder realen Daten veröffentlicht. Produktivumgebungen benötigen Sicherheitsreview."
    },
    {
      slug: "documentation-qa",
      title: "Dokumentation, QA und Validierung",
      searchIntent: "Technische Dokumentation, Web-QA, Build-Validierung, Playwright, Lighthouse, Accessibility und Phasenabschlusskriterien.",
      businessProblem: "Projekte verlieren Glaubwürdigkeit ohne Validierungsnachweise, aktuelle Dokumentation und klare Abschlusskriterien.",
      technologies: ["Playwright", "Lighthouse", "Astro check", "TypeScript", "QA-Artefakte", "Markdown", "UML", "Release-Checkliste"],
      businessValue: "Unterstützt technische Lieferung mit Evidenz, Nachvollziehbarkeit und weniger Mehrdeutigkeit für Kunden, Teams und interne Reviews.",
      useCases: ["Routenvalidierung", "Claim-Review", "Accessibility-Prüfungen", "Dokumentation von Phasenabschlüssen"],
      relatedServices: ["process", "projects", "contact"],
      relatedProjects: ["hotelsol", "techwizards"],
      applicationLevel: "applied-experience",
      caution: "Automatisierte Validierung reduziert Risiken, ersetzt aber keine juristische Prüfung, produktive Sicherheit oder echte Nutzertests, wenn diese erforderlich sind."
    }
  ]
};