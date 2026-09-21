import type { Locale } from "../i18n/config";
import type { RouteKey } from "../i18n/routes";
import type { ProjectKey } from "./projects";

export type SkillKey =
  | "industrial-automation"
  | "industrial-communications"
  | "ot-it-security"
  | "modern-web-ui"
  | "cloud-devsecops"
  | "software-mobile"
  | "eu-data-governance"
  | "performance-qa";

export type SkillLevel =
  | "declared-professional"
  | "demonstrated-advanced"
  | "demonstrated-applied"
  | "transferable-foundation"
  | "technical-compliance";

// A Skill aggregates verified evidence across independent portfolio projects
// and, where a project can't demonstrate it, declared professional
// experience or certificates. It answers "what can be done", not "what was
// built" — that is the Project model's responsibility. `relatedProjects`
// must only cite projects the `evidence` text actually supports.
export type SkillGroup = {
  slug: SkillKey;
  title: string;
  proficiency: string;
  level: SkillLevel;
  searchIntent: string;
  businessProblem: string;
  businessValue: string;
  evidence: string;
  technologies: string[];
  useCases: string[];
  relatedServices: RouteKey[];
  relatedProjects: ProjectKey[];
  scope: string;
};

export type SkillsPageCopy = {
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  intro: string;
  imageAlt: string;
};

type SkillCopy = Omit<
  SkillGroup,
  "slug" | "level" | "technologies" | "relatedServices" | "relatedProjects"
>;

type SkillSeed = {
  slug: SkillKey;
  level: SkillLevel;
  technologies: string[];
  relatedServices: RouteKey[];
  relatedProjects: ProjectKey[];
  copy: Record<Locale, SkillCopy>;
};

export const skillsPageCopy: Record<Locale, SkillsPageCopy> = {
  es: {
    title: "Automatización industrial y desarrollo de software | IoCode",
    description:
      "Capacidades en automatización industrial y desarrollo de software para conectar planta, datos y aplicaciones: PLC, HMI, Motion Control, Docker, .NET, Kotlin y Astro.",
    eyebrow: "Automatización + software industrial",
    heading: "Automatización y software que conectan máquinas, datos y negocio.",
    intro:
      "De PLC y comunicaciones industriales a aplicaciones, datos y despliegue: capacidades técnicas aplicadas a sistemas mantenibles, conectados y preparados para evolucionar.",
    imageAlt: "Automatización industrial y desarrollo de software en IoCode SOLUTIONS"
  },
  en: {
    title: "Industrial automation & software development | IoCode",
    description:
      "Industrial automation and software capabilities that connect the shop floor, data and applications: PLC, HMI, Motion Control, Docker, .NET, Kotlin and Astro.",
    eyebrow: "Industrial automation + software",
    heading: "Automation and software that connect machines, data and business systems.",
    intro:
      "From PLCs and industrial networks to applications, data and delivery: engineering capabilities applied to maintainable, connected systems built to evolve.",
    imageAlt: "Industrial automation and software development at IoCode SOLUTIONS"
  },
  de: {
    title: "Industrieautomation & Softwareentwicklung | IoCode",
    description:
      "Kompetenzen in Industrieautomation und Softwareentwicklung, die Produktion, Daten und Anwendungen verbinden: SPS, HMI, Motion Control, Docker, .NET, Kotlin und Astro.",
    eyebrow: "Industrieautomation + Software",
    heading: "Automation und Software, die Maschinen, Daten und Geschäftsprozesse verbinden.",
    intro:
      "Von SPS und industrieller Kommunikation bis zu Anwendungen, Daten und Deployment: technische Kompetenz für wartbare, vernetzte und zukunftsfähige Systeme.",
    imageAlt: "Industrieautomation und Softwareentwicklung bei IoCode SOLUTIONS"
  }
};

const skillSeeds: SkillSeed[] = [
  {
    slug: "industrial-automation",
    level: "declared-professional",
    technologies: ["Siemens TIA Portal", "Step7", "WinCC", "Omron Sysmac Studio", "CX-One", "Rockwell Studio 5000", "Beckhoff TwinCAT", "IEC 61131-3", "Motion Control", "HMI"],
    relatedServices: ["plc", "robotics", "services"],
    // No portfolio project genuinely demonstrates PLC/HMI/Motion Control
    // competence; this skill's evidence is professional experience and
    // vendor certificates only (see `evidence` below), so it intentionally
    // has no related project rather than citing an unsupported one.
    relatedProjects: [],
    copy: {
      es: {
        title: "Automatización y control industrial",
        proficiency: "Experiencia profesional en automatización industrial",
        searchIntent: "Programación PLC, HMI, motion control, puesta en marcha, diagnóstico y control de maquinaria industrial.",
        businessProblem: "Una máquina necesita lógica de control mantenible, estados visibles y diagnóstico útil para producción y mantenimiento.",
        businessValue: "Conecta secuencias, señales, alarmas, movimiento y operación con una estructura comprensible para planta.",
        evidence: "Experiencia profesional con sistemas PLC/HMI y Motion Control en Siemens, Omron, Rockwell y Beckhoff, complementada con formación de fabricante en Siemens S7-300/400, Rockwell Studio 5000 (Nivel 1 y 2) y Omron Motion Control, HMI y Control Basic.",
        useCases: ["SPS/PLC y HMI", "Diagnóstico de secuencias y señales", "Motion Control y accionamientos", "Commissioning y recuperación de fallos"],
        scope: "Aplicación profesional en programación PLC/HMI, diagnóstico de secuencias y Motion Control, con experiencia industrial en Siemens, Omron y Rockwell."
      },
      en: {
        title: "Industrial automation and control",
        proficiency: "Professional industrial automation experience",
        searchIntent: "PLC and HMI programming, motion control, commissioning, diagnostics and industrial machine control.",
        businessProblem: "Machines need maintainable control logic, visible states and actionable diagnostics for production and maintenance.",
        businessValue: "Connects sequences, signals, alarms, motion and operations in a structure the shop floor can understand.",
        evidence: "Professional experience with PLC/HMI systems and Motion Control across Siemens, Omron, Rockwell and Beckhoff, complemented by vendor training including Siemens S7-300/400, Rockwell Studio 5000 (Level 1 and 2), and Omron Motion Control, HMI and Control Basic.",
        useCases: ["PLC and HMI engineering", "Sequence and signal diagnostics", "Motion Control and drives", "Commissioning and fault recovery"],
        scope: "Professional application of PLC/HMI programming, sequence diagnostics and Motion Control, with industrial experience in Siemens, Omron and Rockwell."
      },
      de: {
        title: "Automatisierungs- und Steuerungstechnik",
        proficiency: "Berufserfahrung in der Automatisierungstechnik",
        searchIntent: "SPS- und HMI-Programmierung, Motion Control, Inbetriebnahme, Diagnose und industrielle Maschinensteuerung.",
        businessProblem: "Maschinen benötigen wartbare Steuerungslogik, sichtbare Zustände und nutzbare Diagnose für Produktion und Instandhaltung.",
        businessValue: "Verbindet Abläufe, Signale, Alarme, Bewegung und Bedienung in einer für die Produktion nachvollziehbaren Struktur.",
        evidence: "Berufserfahrung mit SPS-/HMI-Systemen und Motion Control bei Siemens, Omron, Rockwell und Beckhoff, ergänzt durch Herstellerschulungen zu Siemens S7-300/400, Rockwell Studio 5000 (Level 1 und 2) sowie Omron Motion Control, HMI und Control Basic.",
        useCases: ["SPS- und HMI-Engineering", "Ablauf- und Signaldiagnose", "Motion Control und Antriebstechnik", "Inbetriebnahme und Fehlerbehebung"],
        scope: "Professionelle Anwendung von SPS-/HMI-Programmierung, Ablaufdiagnose und Motion Control, mit Industrieerfahrung bei Siemens, Omron und Rockwell."
      }
    }
  },
  {
    slug: "industrial-communications",
    level: "declared-professional",
    technologies: ["EtherCAT", "OPC UA", "Profinet", "Modbus", "Industrial Ethernet", "TCP/IP", "Fieldbus", "IT/OT integration"],
    relatedServices: ["plc", "services", "projects"],
    // IoCode-WEB's "IT/OT bridge" content is business positioning copy, not
    // a technical artefact of the site itself (no EtherCAT/OPC UA/Profinet
    // implementation exists in the codebase), so it is not cited as project
    // evidence here — this skill relies on professional experience alone.
    relatedProjects: [],
    copy: {
      es: {
        title: "Buses de campo y comunicaciones industriales",
        proficiency: "Experiencia profesional en comunicaciones industriales IT/OT",
        searchIntent: "EtherCAT, OPC UA, Profinet, Modbus, buses de campo, datos de máquina e integración IT/OT.",
        businessProblem: "PLCs, variadores, robots y aplicaciones deben intercambiar datos sin perder diagnóstico, temporización ni trazabilidad.",
        businessValue: "Permite diseñar límites claros entre comunicación determinista de control, telemetría y aplicaciones empresariales.",
        evidence: "Experiencia profesional con EtherCAT, OPC UA y Profinet para integración y diagnóstico de sistemas industriales.",
        useCases: ["Intercambio PLC-dispositivo", "Lectura de datos de máquina", "Diagnóstico de red", "Puentes entre OT, APIs y bases de datos"],
        scope: "Experiencia con EtherCAT, OPC UA, Profinet y comunicación IT/OT aplicada a la integración y diagnóstico de sistemas industriales, considerando el hardware, la topología y los requisitos reales de cada aplicación."
      },
      en: {
        title: "Fieldbuses and industrial communications",
        proficiency: "Professional experience in industrial IT/OT communications",
        searchIntent: "EtherCAT, OPC UA, Profinet, Modbus, fieldbuses, machine data and IT/OT integration.",
        businessProblem: "PLCs, drives, robots and applications must exchange data without losing diagnostics, timing or traceability.",
        businessValue: "Helps separate deterministic control communication, telemetry and enterprise applications through explicit boundaries.",
        evidence: "Professional experience with EtherCAT, OPC UA and Profinet for industrial system integration and diagnostics.",
        useCases: ["PLC-to-device exchange", "Machine-data acquisition", "Network diagnostics", "OT-to-API and database bridges"],
        scope: "Experience with EtherCAT, OPC UA, Profinet and IT/OT communication applied to industrial system integration and diagnostics, taking the hardware, topology and application requirements into account."
      },
      de: {
        title: "Feldbusse und industrielle Kommunikation",
        proficiency: "Berufserfahrung in industrieller IT/OT-Kommunikation",
        searchIntent: "EtherCAT, OPC UA, Profinet, Modbus, Feldbusse, Maschinendaten und IT/OT-Integration.",
        businessProblem: "SPS, Antriebe, Roboter und Anwendungen müssen Daten austauschen, ohne Diagnose, Timing oder Traceability zu verlieren.",
        businessValue: "Trennt deterministische Steuerungskommunikation, Telemetrie und Unternehmensanwendungen durch klare Grenzen.",
        evidence: "Berufserfahrung mit EtherCAT, OPC UA und Profinet für Integration und Diagnose industrieller Systeme.",
        useCases: ["SPS-Geräte-Datenaustausch", "Maschinendatenerfassung", "Netzwerkdiagnose", "Brücken zwischen OT, APIs und Datenbanken"],
        scope: "Erfahrung mit EtherCAT, OPC UA, Profinet und IT/OT-Kommunikation für die Integration und Diagnose industrieller Systeme unter Berücksichtigung von Hardware, Topologie und den Anforderungen der jeweiligen Anwendung."
      }
    }
  },
  {
    slug: "ot-it-security",
    level: "transferable-foundation",
    technologies: ["TLS 1.2/1.3", "Nginx", "CSP", "VPN principles", "Least privilege", "Secrets management", "Network segmentation", "Incident rollback"],
    relatedServices: ["services", "process", "contact"],
    relatedProjects: ["iocode-web"],
    copy: {
      es: {
        title: "Acceso remoto y seguridad operacional OT/IT",
        proficiency: "Fundamentos aplicados de seguridad OT/IT",
        searchIntent: "Acceso remoto industrial, VPN, mínimo privilegio, segmentación, TLS, gestión de secretos y recuperación operativa.",
        businessProblem: "El soporte remoto aumenta superficie de ataque y exige identidad, segmentación, registro mínimo y un camino de revocación.",
        businessValue: "Aplica controles de seguridad web y DevSecOps como base antes de diseñar acceso remoto para activos OT.",
        evidence: "IoCode-WEB contiene TLS, CSP, gestión de secretos, contenedores sin privilegios, logs mínimos, monitorización y rollback.",
        useCases: ["Diseño de acceso con mínimo privilegio", "Separación OT/IT", "Revocación y rollback", "Inventario de secretos y accesos"],
        scope: "Fundamentos de seguridad IT/OT aplicados a segmentación, mínimo privilegio, TLS, gestión de secretos y recuperación operativa, con diseño de acceso remoto sujeto siempre a análisis de riesgo previo."
      },
      en: {
        title: "OT/IT remote access and operational security",
        proficiency: "Applied OT/IT security foundations",
        searchIntent: "Industrial remote access, VPNs, least privilege, segmentation, TLS, secret management and operational recovery.",
        businessProblem: "Remote support expands the attack surface and requires identity, segmentation, minimal logging and a revocation path.",
        businessValue: "Applies web-security and DevSecOps controls as a baseline before designing access to OT assets.",
        evidence: "IoCode-WEB contains TLS, CSP, secret management, unprivileged containers, minimal logs, monitoring and rollback controls.",
        useCases: ["Least-privilege access design", "OT/IT separation", "Revocation and rollback", "Secret and access inventory"],
        scope: "IT/OT security fundamentals applied to segmentation, least privilege, TLS, secret management and operational recovery, with remote-access design always subject to a prior risk assessment."
      },
      de: {
        title: "OT/IT-Fernzugriff und Betriebssicherheit",
        proficiency: "Angewandte OT/IT-Sicherheitsgrundlagen",
        searchIntent: "Industrieller Fernzugriff, VPN, Least Privilege, Segmentierung, TLS, Secrets und operative Wiederherstellung.",
        businessProblem: "Remote Support vergrößert die Angriffsfläche und benötigt Identität, Segmentierung, minimale Logs und einen Weg zur Sperrung.",
        businessValue: "Überträgt Web-Security- und DevSecOps-Kontrollen als Basis auf die Planung von OT-Zugängen.",
        evidence: "IoCode-WEB enthält TLS, CSP, Secrets-Management, unprivilegierte Container, minimale Logs, Monitoring und Rollback.",
        useCases: ["Least-Privilege-Zugriff", "OT/IT-Segmentierung", "Sperrung und Rollback", "Secrets- und Zugriffsinventar"],
        scope: "IT/OT-Sicherheitsgrundlagen für Segmentierung, Least Privilege, TLS, Secrets-Management und operative Wiederherstellung, mit Fernzugriffsdesign stets nach vorheriger Risikoanalyse."
      }
    }
  },
  {
    slug: "modern-web-ui",
    level: "demonstrated-advanced",
    technologies: ["Astro 7", "TypeScript", "Three.js", "WebGL", "HTML", "CSS", "Responsive design", "i18n", "WCAG 2.1 AA", "Schema.org"],
    relatedServices: ["projects", "skills", "contact"],
    relatedProjects: ["iocode-web"],
    copy: {
      es: { title: "Desarrollo web moderno y UI/UX", proficiency: "Avanzado y verificable en código", searchIntent: "Astro, TypeScript, Three.js, WebGL, CSS responsive, accesibilidad, i18n y SEO semántico.", businessProblem: "Una web técnica debe explicar sistemas complejos, cargar rápido y funcionar con teclado, móvil, buscadores y fallback gráfico.", businessValue: "Convierte contenido técnico complejo en un sitio rápido y accesible que funciona bien en distintos dispositivos, con visuales 3D que degradan de forma accesible en lugar de fallar.", evidence: "IoCode-WEB publica componentes Astro, runtime Three.js, rutas ES/EN/DE, tokens CSS, metadatos y pruebas WCAG.", useCases: ["Web industrial multilingüe", "Visualización 3D progresiva", "Componentes accesibles", "SEO y datos estructurados"], scope: "Competencia demostrada en el propio repositorio público de IoCode-WEB, con Core Web Vitals medidos en laboratorio mediante el script Lighthouse incluido en el repositorio." },
      en: { title: "Modern web development and UI/UX", proficiency: "Advanced and publicly verifiable", searchIntent: "Astro, TypeScript, Three.js, WebGL, responsive CSS, accessibility, i18n and semantic SEO.", businessProblem: "Technical websites must explain complex systems, load quickly and work with keyboards, mobile devices, search engines and visual fallbacks.", businessValue: "Turns complex technical content into a fast, accessible site that works well across devices, with 3D visuals that degrade gracefully instead of breaking.", evidence: "IoCode-WEB publishes Astro components, a Three.js runtime, ES/EN/DE routes, CSS tokens, metadata and WCAG tests.", useCases: ["Multilingual industrial websites", "Progressive 3D visualization", "Accessible components", "SEO and structured data"], scope: "Demonstrated directly in the public IoCode-WEB repository, with lab-measured Core Web Vitals via the repository's own Lighthouse script." },
      de: { title: "Moderne Webentwicklung und UI/UX", proficiency: "Fortgeschritten und öffentlich prüfbar", searchIntent: "Astro, TypeScript, Three.js, WebGL, Responsive CSS, Barrierefreiheit, i18n und semantisches SEO.", businessProblem: "Technische Websites müssen komplexe Systeme erklären, schnell laden und per Tastatur, mobil, in Suchmaschinen und mit Fallback funktionieren.", businessValue: "Macht komplexe technische Inhalte zu einer schnellen, barrierefreien Website, die auf verschiedenen Geräten gut funktioniert, mit 3D-Visuals, die bei Bedarf kontrolliert auf eine einfachere Darstellung zurückfallen, statt komplett zu versagen.", evidence: "IoCode-WEB veröffentlicht Astro-Komponenten, Three.js-Runtime, ES/EN/DE-Routen, CSS-Tokens, Metadaten und WCAG-Tests.", useCases: ["Mehrsprachige Industriewebsites", "Progressive 3D-Visualisierung", "Barrierefreie Komponenten", "SEO und strukturierte Daten"], scope: "Direkt im öffentlichen IoCode-WEB-Repository nachgewiesen, mit laborgemessenen Core Web Vitals über das im Repository enthaltene Lighthouse-Skript." }
    }
  },
  {
    slug: "cloud-devsecops",
    level: "demonstrated-advanced",
    technologies: ["Docker Compose", "OCI digests", "Nginx", "Linux", "GitHub Actions", "CI/CD", "CSP", "HSTS", "Read-only filesystem", "Non-root containers"],
    relatedServices: ["process", "projects", "contact"],
    relatedProjects: ["iocode-web", "hotelsol"],
    copy: {
      es: { title: "Cloud, Docker y DevSecOps", proficiency: "Avanzado y verificable en repositorios", searchIntent: "Docker hardening, Nginx, Linux, CI/CD, imágenes OCI inmutables, cabeceras HTTP y rollback.", businessProblem: "Un build correcto no basta si el runtime es mutable, privilegiado, opaco o imposible de revertir.", businessValue: "Convierte build, imagen, configuración, healthcheck, límites y rollback en contratos revisables.", evidence: "IoCode-WEB contiene Compose endurecido, digests, Nginx, workflows y scripts de release; HotelSOL demuestra orquestación multisericio.", useCases: ["Contenedores no-root y read-only", "CI/CD por digest", "Reverse proxy y seguridad HTTP", "Healthcheck, observabilidad y rollback"], scope: "Controles de hardening, imágenes inmutables y rollback aplicados y verificados en el propio repositorio, listos para gobernar el despliegue cuando se provisione la infraestructura." },
      en: { title: "Cloud, Docker and DevSecOps", proficiency: "Advanced and verifiable in the repository", searchIntent: "Docker hardening, Nginx, Linux, CI/CD, immutable OCI images, HTTP headers and rollback.", businessProblem: "A passing build is insufficient when the runtime is mutable, privileged, opaque or impossible to roll back.", businessValue: "Turns builds, images, configuration, health checks, limits and rollback into reviewable contracts.", evidence: "IoCode-WEB contains hardened Compose, digests, Nginx, workflows and release scripts; HotelSOL demonstrates multi-service orchestration.", useCases: ["Non-root read-only containers", "Digest-based CI/CD", "Reverse proxy and HTTP security", "Health checks, observability and rollback"], scope: "Hardening, immutable-image and rollback controls applied and verified directly in the repository, ready to govern deployment once infrastructure is provisioned." },
      de: { title: "Cloud, Docker und DevSecOps", proficiency: "Fortgeschritten und im Repository prüfbar", searchIntent: "Docker Hardening, Nginx, Linux, CI/CD, unveränderliche OCI-Images, HTTP-Header und Rollback.", businessProblem: "Ein erfolgreicher Build reicht nicht, wenn die Laufzeit veränderbar, privilegiert, undurchsichtig oder nicht rücksetzbar ist.", businessValue: "Macht Build, Image, Konfiguration, Healthcheck, Limits und Rollback zu prüfbaren Verträgen.", evidence: "IoCode-WEB enthält gehärtetes Compose, Digests, Nginx, Workflows und Release-Skripte; HotelSOL zeigt Multi-Service-Orchestrierung.", useCases: ["Non-root- und Read-only-Container", "Digest-basierte CI/CD", "Reverse Proxy und HTTP-Sicherheit", "Healthcheck, Observability und Rollback"], scope: "Hardening-, Image-Immutability- und Rollback-Kontrollen, direkt im Repository umgesetzt und verifiziert, bereit, das Deployment zu steuern, sobald die Infrastruktur bereitsteht." }
    }
  },
  {
    slug: "software-mobile",
    level: "demonstrated-applied",
    technologies: ["Kotlin", "Android", "Jetpack Compose", "C#", ".NET", "Python", "Java", "JavaFX", "Node.js", "SQL"],
    relatedServices: ["projects", "services", "contact"],
    relatedProjects: ["techwizards", "hotelsol", "the-javengers", "break-boxes-game", "woodshops", "vehicle-rental"],
    copy: {
      es: { title: "Desarrollo de software y aplicaciones móviles", proficiency: "Aplicado y verificable", searchIntent: "Kotlin Android, C# .NET, Python, Java, JavaFX, Node.js y arquitectura de aplicaciones.", businessProblem: "Las aplicaciones empresariales necesitan separar interfaz, dominio, datos, identidad y configuración para poder evolucionar.", businessValue: "Aplica capas, casos de uso, DAO, APIs y módulos pequeños según el problema y la plataforma.", evidence: "TechWizards, HotelSOL, The Javengers, JuegoRompeCajas, WoodShops y AlquilerVehiculos aportan fuentes públicas Kotlin, C#, Python y Java con distintos estilos de arquitectura orientada a objetos.", useCases: ["Aplicaciones Android", "APIs y módulos ERP", "Herramientas Java de escritorio", "Automatización y utilidades Python"], scope: "Competencia aplicada y verificable en Kotlin/Android, C#/.NET, Python y Java, con arquitectura en capas y modelado orientado a objetos demostrados en TechWizards, HotelSOL, The Javengers, RompeCajas, WoodShops y AlquilerVehiculos." },
      en: { title: "Software and mobile development", proficiency: "Applied and publicly verifiable", searchIntent: "Kotlin Android, C# .NET, Python, Java, JavaFX, Node.js and application architecture.", businessProblem: "Business applications must separate UI, domain, data, identity and configuration so they can evolve safely.", businessValue: "Applies layers, use cases, DAO, APIs and small modules according to the problem and platform.", evidence: "TechWizards, HotelSOL, The Javengers, Break Boxes, WoodShops and AlquilerVehiculos provide public Kotlin, C#, Python and Java sources across several object-oriented architecture styles.", useCases: ["Android applications", "APIs and ERP modules", "Java desktop tools", "Python automation and utilities"], scope: "Applied, publicly verifiable competence in Kotlin/Android, C#/.NET, Python and Java, with layered architecture and object-oriented modelling demonstrated across TechWizards, HotelSOL, The Javengers, Break Boxes, WoodShops and AlquilerVehiculos." },
      de: { title: "Software- und Mobile-Entwicklung", proficiency: "Angewandt und öffentlich prüfbar", searchIntent: "Kotlin Android, C# .NET, Python, Java, JavaFX, Node.js und Applikationsarchitektur.", businessProblem: "Geschäftsanwendungen müssen UI, Domäne, Daten, Identität und Konfiguration trennen, um sicher weiterentwickelt zu werden.", businessValue: "Nutzt Schichten, Use Cases, DAO, APIs und kleine Module passend zu Problem und Plattform.", evidence: "TechWizards, HotelSOL, The Javengers, Kistenbrechen, WoodShops und AlquilerVehiculos liefern öffentliche Kotlin-, C#-, Python- und Java-Quellen in unterschiedlichen objektorientierten Architekturstilen.", useCases: ["Android-Anwendungen", "APIs und ERP-Module", "Java-Desktop-Werkzeuge", "Python-Automatisierung und Utilities"], scope: "Angewandte, öffentlich prüfbare Kompetenz in Kotlin/Android, C#/.NET, Python und Java, mit Schichtenarchitektur und objektorientierter Modellierung, nachgewiesen in TechWizards, HotelSOL, The Javengers, Kistenbrechen, WoodShops und AlquilerVehiculos." }
    }
  },
  {
    slug: "eu-data-governance",
    level: "technical-compliance",
    technologies: ["GDPR Art. 13/14", "GDPR Art. 28", "§5 DDG", "§25 TDDDG", "ROPA", "DPA register", "Data minimization", "Retention gates", "Privacy by design"],
    relatedServices: ["process", "contact", "privacy"],
    relatedProjects: ["iocode-web"],
    copy: {
      es: { title: "Gobernanza de datos y cumplimiento UE", proficiency: "Implementación técnica; contenido legal publicado y aprobado", searchIntent: "RGPD, Art. 13/14/28, §5 DDG, §25 TDDDG, ROPA, DPA, minimización y privacidad desde el diseño.", businessProblem: "Un sitio puede publicar afirmaciones jurídicas incorrectas si código, inventarios y aprobaciones no comparten el mismo estado.", businessValue: "Introduce gates explícitos para identidad, tratamientos, proveedores, DPA, transferencias y retención, versionados como fuente única de verdad.", evidence: "IoCode-WEB contiene páginas trilingües, inventario ROPA, registro DPA, DSAR y logs mínimos, todos publicados.", useCases: ["Inventario de tratamientos", "Contenido legal versionado", "Minimización y retención", "Registro de proveedores y DPA"], scope: "Ingeniería de cumplimiento aplicada al código y a la gobernanza técnica del sitio; el asesoramiento jurídico corresponde a un profesional del derecho." },
      en: { title: "EU data governance and compliance", proficiency: "Technical implementation; legal content published and approved", searchIntent: "GDPR Articles 13/14/28, section 5 DDG, section 25 TDDDG, ROPA, DPA, minimization and privacy by design.", businessProblem: "A website can publish incorrect legal claims when code, inventories and approvals do not share the same state.", businessValue: "Introduces explicit gates for identity, processing, providers, DPAs, transfers and retention, versioned as a single source of truth.", evidence: "IoCode-WEB contains trilingual notices, a ROPA inventory, DPA register, DSAR process and minimal logs, all published.", useCases: ["Processing inventory", "Versioned legal content", "Minimization and retention", "Provider and DPA register"], scope: "Compliance engineering applied to the codebase and the site's technical governance; legal advice remains the remit of a qualified lawyer." },
      de: { title: "EU-Datengovernance und Compliance", proficiency: "Technische Umsetzung; Rechtstexte veröffentlicht und freigegeben", searchIntent: "DSGVO Art. 13/14/28, §5 DDG, §25 TDDDG, VVT, AV-Verträge, Minimierung und Privacy by Design.", businessProblem: "Eine Website kann falsche Rechtsaussagen veröffentlichen, wenn Code, Inventare und Freigaben unterschiedliche Zustände haben.", businessValue: "Führt explizite Gates für Identität, Verarbeitung, Anbieter, AV-Verträge, Transfers und Aufbewahrung ein, versioniert als einzige verbindliche Quelle.", evidence: "IoCode-WEB enthält dreisprachige Hinweise, VVT, DPA-Register, DSAR-Prozess und minimale Logs, alle veröffentlicht.", useCases: ["Verzeichnis von Verarbeitungstätigkeiten", "Versionierte Rechtstexte", "Minimierung und Aufbewahrung", "Anbieter- und DPA-Register"], scope: "Compliance-Engineering, angewendet auf den Code und die technische Governance der Website; Rechtsberatung bleibt Aufgabe einer qualifizierten Rechtsanwältin oder eines Rechtsanwalts." }
    }
  },
  {
    slug: "performance-qa",
    level: "demonstrated-advanced",
    technologies: ["Playwright", "Axe", "Lighthouse", "Core Web Vitals", "Astro check", "TypeScript", "Node test", "Resource budgets", "WebGL lifecycle"],
    relatedServices: ["process", "projects", "skills"],
    relatedProjects: ["iocode-web", "techwizards"],
    copy: {
      es: { title: "Rendimiento web y QA automatizado", proficiency: "Avanzado y verificable en código", searchIntent: "Playwright, Axe, Lighthouse, Core Web Vitals, presupuestos, WebGL, accesibilidad y cero flaky tests.", businessProblem: "Una interfaz puede parecer correcta y aun fallar por teclado, viewport, idioma, memoria, metadatos o regresiones de rendimiento.", businessValue: "Da confianza antes de cada release: comprobaciones automatizadas de accesibilidad, rendimiento y regresiones, ejecutadas sobre el mismo build candidato.", evidence: "IoCode-WEB publica suites Node y Playwright, Axe, Lighthouse, presupuestos y gestión explícita del ciclo WebGL; TechWizards aporta pruebas instrumentadas Android como evidencia complementaria de práctica de testing.", useCases: ["E2E multiperfil", "Auditoría WCAG", "Presupuestos LCP/CLS/TBT", "Context loss, memoria y fallback 3D"], scope: "Contratos de accesibilidad automatizados en cada release vía CI, con Playwright y Axe ejecutados sobre el mismo artefacto candidato, y presupuestos de rendimiento medidos con Lighthouse en laboratorio sobre ese mismo build." },
      en: { title: "Web performance and automated QA", proficiency: "Advanced and publicly verifiable", searchIntent: "Playwright, Axe, Lighthouse, Core Web Vitals, budgets, WebGL, accessibility and zero-flaky testing.", businessProblem: "An interface can look correct and still fail on keyboard use, viewports, languages, memory, metadata or performance regressions.", businessValue: "Gives confidence before every release: automated checks for accessibility, performance and regressions, run against the same candidate build.", evidence: "IoCode-WEB publishes Node and Playwright suites, Axe, Lighthouse, budgets and explicit WebGL lifecycle management; TechWizards adds Android instrumented tests as complementary evidence of testing practice.", useCases: ["Multi-profile E2E", "WCAG auditing", "LCP/CLS/TBT budgets", "3D context loss, memory and fallback"], scope: "Automated accessibility contracts on every CI release, with Playwright and Axe run against the same candidate build, plus Lighthouse performance budgets measured in the lab on that same build." },
      de: { title: "Web-Performance und automatisierte QA", proficiency: "Fortgeschritten und öffentlich prüfbar", searchIntent: "Playwright, Axe, Lighthouse, Core Web Vitals, Budgets, WebGL, Barrierefreiheit und stabile Tests.", businessProblem: "Eine Oberfläche kann korrekt aussehen und bei Tastatur, Viewport, Sprache, Speicher, Metadaten oder Performance trotzdem versagen.", businessValue: "Schafft Vertrauen vor jedem Release: automatisierte Prüfungen für Barrierefreiheit, Performance und Regressionen, ausgeführt gegen denselben Kandidaten-Build.", evidence: "IoCode-WEB veröffentlicht Node- und Playwright-Suiten, Axe, Lighthouse, Budgets und explizites WebGL-Lifecycle-Management; TechWizards liefert instrumentierte Android-Tests als ergänzenden Beleg für die Testpraxis.", useCases: ["E2E mit mehreren Profilen", "WCAG-Audit", "LCP-/CLS-/TBT-Budgets", "3D Context Loss, Speicher und Fallback"], scope: "Automatisierte Accessibility-Verträge bei jedem CI-Release, mit Playwright und Axe gegen denselben Kandidaten-Build ausgeführt, sowie Lighthouse-Performance-Budgets, im Labor gegen denselben Build gemessen." }
    }
  }
];

function createSkill(seed: SkillSeed, locale: Locale): SkillGroup {
  return {
    slug: seed.slug,
    level: seed.level,
    technologies: seed.technologies,
    relatedServices: seed.relatedServices,
    relatedProjects: seed.relatedProjects,
    ...seed.copy[locale]
  };
}

export const skillGroups: Record<Locale, SkillGroup[]> = {
  es: skillSeeds.map((seed) => createSkill(seed, "es")),
  en: skillSeeds.map((seed) => createSkill(seed, "en")),
  de: skillSeeds.map((seed) => createSkill(seed, "de"))
};
