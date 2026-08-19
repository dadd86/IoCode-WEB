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
  caution: string;
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
    title: "Habilidades PLC, DevSecOps y QA | IoCode",
    description:
      "Matriz técnica en PLC, comunicaciones industriales, OT/IT, Astro, Docker, software, RGPD, Playwright, Axe y Core Web Vitals.",
    eyebrow: "Matriz de competencias con evidencia",
    heading: "Automatización, software y entrega técnica con límites explícitos.",
    intro:
      "Ocho áreas conectan planta, aplicaciones, infraestructura y calidad. Cada nivel distingue experiencia declarada, evidencia pública y capacidades transferibles.",
    imageAlt: "Matriz de habilidades PLC, software, Docker, cumplimiento y QA de IoCode SOLUTIONS"
  },
  en: {
    title: "PLC, DevSecOps and QA skills | IoCode",
    description:
      "Technical matrix covering PLCs, industrial networks, OT/IT, Astro, Docker, software, GDPR, Playwright, Axe and Core Web Vitals.",
    eyebrow: "Evidence-led skills matrix",
    heading: "Automation, software and technical delivery with explicit limits.",
    intro:
      "Eight areas connect the shop floor, applications, infrastructure and quality. Each level distinguishes declared experience, public evidence and transferable skills.",
    imageAlt: "IoCode SOLUTIONS PLC, software, Docker, compliance and QA skills matrix"
  },
  de: {
    title: "SPS-, DevSecOps- und QA-Kompetenzen | IoCode",
    description:
      "Technische Matrix für SPS, Industrienetze, OT/IT, Astro, Docker, Software, DSGVO, Playwright, Axe und Core Web Vitals.",
    eyebrow: "Evidenzbasierte Kompetenzmatrix",
    heading: "Automatisierung, Software und technische Lieferung mit klaren Grenzen.",
    intro:
      "Acht Bereiche verbinden Produktion, Anwendungen, Infrastruktur und Qualität. Die Stufen trennen deklarierte Erfahrung, öffentliche Evidenz und übertragbare Fähigkeiten.",
    imageAlt: "IoCode SOLUTIONS Kompetenzmatrix für SPS, Software, Docker, Compliance und QA"
  }
};

const skillSeeds: SkillSeed[] = [
  {
    slug: "industrial-automation",
    level: "declared-professional",
    technologies: ["Siemens TIA Portal", "Step7", "WinCC", "Omron Sysmac Studio", "CX-One", "Rockwell Studio 5000", "Beckhoff TwinCAT", "IEC 61131-3", "Motion Control", "HMI"],
    relatedServices: ["plc", "robotics", "services"],
    relatedProjects: ["iocode-web"],
    copy: {
      es: {
        title: "Automatización y control industrial",
        proficiency: "Experiencia profesional declarada",
        searchIntent: "Programación PLC, HMI, motion control, puesta en marcha, diagnóstico y control de maquinaria industrial.",
        businessProblem: "Una máquina necesita lógica de control mantenible, estados visibles y diagnóstico útil para producción y mantenimiento.",
        businessValue: "Conecta secuencias, señales, alarmas, movimiento y operación con una estructura comprensible para planta.",
        evidence: "El perfil público declara trabajo con Siemens, Omron, Rockwell, Beckhoff, Motion Control y variadores; GitHub no publica código PLC propio verificable.",
        useCases: ["SPS/PLC y HMI", "Diagnóstico de secuencias y señales", "Motion Control y accionamientos", "Commissioning y recuperación de fallos"],
        caution: "Nivel basado en experiencia profesional declarada, no en un repositorio público de Sysmac, TIA Portal o TwinCAT. No implica certificación de fabricante ni validación de safety."
      },
      en: {
        title: "Industrial automation and control",
        proficiency: "Declared professional experience",
        searchIntent: "PLC and HMI programming, motion control, commissioning, diagnostics and industrial machine control.",
        businessProblem: "Machines need maintainable control logic, visible states and actionable diagnostics for production and maintenance.",
        businessValue: "Connects sequences, signals, alarms, motion and operations in a structure the shop floor can understand.",
        evidence: "The public profile declares Siemens, Omron, Rockwell, Beckhoff, Motion Control and drive experience; GitHub exposes no verifiable proprietary PLC code.",
        useCases: ["PLC and HMI engineering", "Sequence and signal diagnostics", "Motion Control and drives", "Commissioning and fault recovery"],
        caution: "Level is based on declared professional experience, not a public Sysmac, TIA Portal or TwinCAT repository. It does not imply vendor or functional-safety certification."
      },
      de: {
        title: "Automatisierungs- und Steuerungstechnik",
        proficiency: "Deklarierte Berufserfahrung",
        searchIntent: "SPS- und HMI-Programmierung, Motion Control, Inbetriebnahme, Diagnose und industrielle Maschinensteuerung.",
        businessProblem: "Maschinen benötigen wartbare Steuerungslogik, sichtbare Zustände und nutzbare Diagnose für Produktion und Instandhaltung.",
        businessValue: "Verbindet Abläufe, Signale, Alarme, Bewegung und Bedienung in einer für die Produktion nachvollziehbaren Struktur.",
        evidence: "Das öffentliche Profil nennt Siemens, Omron, Rockwell, Beckhoff, Motion Control und Antriebstechnik; öffentlich prüfbarer eigener SPS-Code fehlt.",
        useCases: ["SPS- und HMI-Engineering", "Ablauf- und Signaldiagnose", "Motion Control und Antriebstechnik", "Inbetriebnahme und Fehlerbehebung"],
        caution: "Die Stufe basiert auf deklarierter Berufserfahrung, nicht auf einem öffentlichen Sysmac-, TIA-Portal- oder TwinCAT-Repository. Keine Hersteller- oder Safety-Zertifizierung."
      }
    }
  },
  {
    slug: "industrial-communications",
    level: "declared-professional",
    technologies: ["EtherCAT", "OPC UA", "Profinet", "Modbus", "Industrial Ethernet", "TCP/IP", "Fieldbus", "IT/OT integration"],
    relatedServices: ["plc", "services", "projects"],
    relatedProjects: ["iocode-web", "hotelsol"],
    copy: {
      es: {
        title: "Buses de campo y comunicaciones industriales",
        proficiency: "Experiencia declarada con base IT/OT demostrada",
        searchIntent: "EtherCAT, OPC UA, Profinet, Modbus, buses de campo, datos de máquina e integración IT/OT.",
        businessProblem: "PLCs, variadores, robots y aplicaciones deben intercambiar datos sin perder diagnóstico, temporización ni trazabilidad.",
        businessValue: "Permite diseñar límites claros entre comunicación determinista de control, telemetría y aplicaciones empresariales.",
        evidence: "EtherCAT, OPC UA y Profinet figuran en el perfil; el repositorio IoCode-WEB demuestra arquitectura IT/OT documental, no tramas de campo reales.",
        useCases: ["Intercambio PLC-dispositivo", "Lectura de datos de máquina", "Diagnóstico de red", "Puentes entre OT, APIs y bases de datos"],
        caution: "MECHATROLINK no aparece en las fuentes públicas inspeccionadas y no se atribuye. Toda red industrial requiere validación sobre hardware y topología reales."
      },
      en: {
        title: "Fieldbuses and industrial communications",
        proficiency: "Declared experience with demonstrated IT/OT foundations",
        searchIntent: "EtherCAT, OPC UA, Profinet, Modbus, fieldbuses, machine data and IT/OT integration.",
        businessProblem: "PLCs, drives, robots and applications must exchange data without losing diagnostics, timing or traceability.",
        businessValue: "Helps separate deterministic control communication, telemetry and enterprise applications through explicit boundaries.",
        evidence: "EtherCAT, OPC UA and Profinet appear in the profile; IoCode-WEB demonstrates documented IT/OT architecture, not live fieldbus frames.",
        useCases: ["PLC-to-device exchange", "Machine-data acquisition", "Network diagnostics", "OT-to-API and database bridges"],
        caution: "MECHATROLINK is absent from the inspected public sources and is not claimed. Every industrial network requires real hardware and topology validation."
      },
      de: {
        title: "Feldbusse und industrielle Kommunikation",
        proficiency: "Deklarierte Erfahrung mit nachgewiesener IT/OT-Basis",
        searchIntent: "EtherCAT, OPC UA, Profinet, Modbus, Feldbusse, Maschinendaten und IT/OT-Integration.",
        businessProblem: "SPS, Antriebe, Roboter und Anwendungen müssen Daten austauschen, ohne Diagnose, Timing oder Traceability zu verlieren.",
        businessValue: "Trennt deterministische Steuerungskommunikation, Telemetrie und Unternehmensanwendungen durch klare Grenzen.",
        evidence: "EtherCAT, OPC UA und Profinet stehen im Profil; IoCode-WEB belegt dokumentierte IT/OT-Architektur, keine realen Feldbustelegramme.",
        useCases: ["SPS-Geräte-Datenaustausch", "Maschinendatenerfassung", "Netzwerkdiagnose", "Brücken zwischen OT, APIs und Datenbanken"],
        caution: "MECHATROLINK fehlt in den geprüften öffentlichen Quellen und wird nicht beansprucht. Industrienetze benötigen Validierung auf realer Hardware und Topologie."
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
        proficiency: "Fundamentos transferibles demostrados; producto OT no verificado",
        searchIntent: "Acceso remoto industrial, VPN, mínimo privilegio, segmentación, TLS, gestión de secretos y recuperación operativa.",
        businessProblem: "El soporte remoto aumenta superficie de ataque y exige identidad, segmentación, registro mínimo y un camino de revocación.",
        businessValue: "Aplica controles verificables de seguridad web y DevSecOps como base antes de diseñar acceso remoto para activos OT.",
        evidence: "IoCode-WEB contiene TLS, CSP, secretos, contenedores sin privilegios, logs mínimos, monitorización y rollback.",
        useCases: ["Diseño de acceso con mínimo privilegio", "Separación OT/IT", "Revocación y rollback", "Inventario de secretos y accesos"],
        caution: "Secomea, GateManager y SiteManager no aparecen en el código o perfil público inspeccionado. No se atribuye experiencia de producto ni se diseña acceso OT sin análisis de riesgo."
      },
      en: {
        title: "OT/IT remote access and operational security",
        proficiency: "Demonstrated transferable foundations; OT product unverified",
        searchIntent: "Industrial remote access, VPNs, least privilege, segmentation, TLS, secret management and operational recovery.",
        businessProblem: "Remote support expands the attack surface and requires identity, segmentation, minimal logging and a revocation path.",
        businessValue: "Applies verifiable web-security and DevSecOps controls as a baseline before designing access to OT assets.",
        evidence: "IoCode-WEB contains TLS, CSP, secrets, unprivileged containers, minimal logs, monitoring and rollback controls.",
        useCases: ["Least-privilege access design", "OT/IT separation", "Revocation and rollback", "Secret and access inventory"],
        caution: "Secomea, GateManager and SiteManager do not appear in the inspected public code or profile. Product experience is not claimed, and OT access requires a risk assessment."
      },
      de: {
        title: "OT/IT-Fernzugriff und Betriebssicherheit",
        proficiency: "Nachgewiesene übertragbare Grundlagen; OT-Produkt nicht verifiziert",
        searchIntent: "Industrieller Fernzugriff, VPN, Least Privilege, Segmentierung, TLS, Secrets und operative Wiederherstellung.",
        businessProblem: "Remote Support vergrößert die Angriffsfläche und benötigt Identität, Segmentierung, minimale Logs und einen Sperrpfad.",
        businessValue: "Überträgt prüfbare Web-Security- und DevSecOps-Kontrollen als Basis auf die Planung von OT-Zugängen.",
        evidence: "IoCode-WEB enthält TLS, CSP, Secrets, unprivilegierte Container, minimale Logs, Monitoring und Rollback.",
        useCases: ["Least-Privilege-Zugriff", "OT/IT-Segmentierung", "Sperrung und Rollback", "Secrets- und Zugriffsinventar"],
        caution: "Secomea, GateManager und SiteManager erscheinen nicht im geprüften öffentlichen Code oder Profil. Produkterfahrung wird nicht beansprucht; OT-Zugriff braucht Risikoanalyse."
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
      es: { title: "Desarrollo web moderno y UI/UX", proficiency: "Avanzado y verificable en código", searchIntent: "Astro, TypeScript, Three.js, WebGL, CSS responsive, accesibilidad, i18n y SEO semántico.", businessProblem: "Una web técnica debe explicar sistemas complejos, cargar rápido y funcionar con teclado, móvil, buscadores y fallback gráfico.", businessValue: "Combina contenido tipado, render estático, interacción sin framework cliente y 3D progresivo con degradación accesible.", evidence: "IoCode-WEB publica componentes Astro, runtime Three.js, rutas ES/EN/DE, tokens CSS, metadatos y pruebas WCAG.", useCases: ["Web industrial multilingüe", "Visualización 3D progresiva", "Componentes accesibles", "SEO y datos estructurados"], caution: "El nivel se limita al repositorio público; no implica métricas de conversión ni Core Web Vitals de campo." },
      en: { title: "Modern web development and UI/UX", proficiency: "Advanced and publicly verifiable", searchIntent: "Astro, TypeScript, Three.js, WebGL, responsive CSS, accessibility, i18n and semantic SEO.", businessProblem: "Technical websites must explain complex systems, load quickly and work with keyboards, mobile devices, search engines and visual fallbacks.", businessValue: "Combines typed content, static rendering, framework-free client interaction and progressive 3D with accessible degradation.", evidence: "IoCode-WEB publishes Astro components, a Three.js runtime, ES/EN/DE routes, CSS tokens, metadata and WCAG tests.", useCases: ["Multilingual industrial websites", "Progressive 3D visualization", "Accessible components", "SEO and structured data"], caution: "Level is limited to public repository evidence; it does not imply conversion metrics or field Core Web Vitals." },
      de: { title: "Moderne Webentwicklung und UI/UX", proficiency: "Fortgeschritten und öffentlich prüfbar", searchIntent: "Astro, TypeScript, Three.js, WebGL, Responsive CSS, Barrierefreiheit, i18n und semantisches SEO.", businessProblem: "Technische Websites müssen komplexe Systeme erklären, schnell laden und per Tastatur, mobil, in Suchmaschinen und mit Fallback funktionieren.", businessValue: "Verbindet typisierte Inhalte, statisches Rendering, frameworkfreie Interaktion und progressives 3D mit barrierefreier Degradation.", evidence: "IoCode-WEB veröffentlicht Astro-Komponenten, Three.js-Runtime, ES/EN/DE-Routen, CSS-Tokens, Metadaten und WCAG-Tests.", useCases: ["Mehrsprachige Industriewebsites", "Progressive 3D-Visualisierung", "Barrierefreie Komponenten", "SEO und strukturierte Daten"], caution: "Die Stufe gilt nur für öffentliche Repository-Evidenz; keine Aussage zu Conversion oder Feld-Core-Web-Vitals." }
    }
  },
  {
    slug: "cloud-devsecops",
    level: "demonstrated-advanced",
    technologies: ["Docker Compose", "OCI digests", "Nginx", "Linux", "GitHub Actions", "CI/CD", "CSP", "HSTS", "Read-only filesystem", "Non-root containers"],
    relatedServices: ["process", "projects", "contact"],
    relatedProjects: ["iocode-web", "hotelsol"],
    copy: {
      es: { title: "Cloud, Docker y DevSecOps", proficiency: "Avanzado y verificable en repositorios", searchIntent: "Docker hardening, Nginx, Linux, CI/CD, imágenes OCI inmutables, cabeceras HTTP y rollback.", businessProblem: "Un build correcto no basta si el runtime es mutable, privilegiado, opaco o imposible de revertir.", businessValue: "Convierte build, imagen, configuración, healthcheck, límites y rollback en contratos revisables.", evidence: "IoCode-WEB contiene Compose endurecido, digests, Nginx, workflows y scripts de release; HotelSOL demuestra orquestación multisericio.", useCases: ["Contenedores no-root y read-only", "CI/CD por digest", "Reverse proxy y seguridad HTTP", "Healthcheck, observabilidad y rollback"], caution: "Los controles del repositorio no prueban que la infraestructura pública esté desplegada o administrada conforme al diseño." },
      en: { title: "Cloud, Docker and DevSecOps", proficiency: "Advanced and repository-verifiable", searchIntent: "Docker hardening, Nginx, Linux, CI/CD, immutable OCI images, HTTP headers and rollback.", businessProblem: "A passing build is insufficient when the runtime is mutable, privileged, opaque or impossible to roll back.", businessValue: "Turns builds, images, configuration, health checks, limits and rollback into reviewable contracts.", evidence: "IoCode-WEB contains hardened Compose, digests, Nginx, workflows and release scripts; HotelSOL demonstrates multi-service orchestration.", useCases: ["Non-root read-only containers", "Digest-based CI/CD", "Reverse proxy and HTTP security", "Health checks, observability and rollback"], caution: "Repository controls do not prove that public infrastructure is deployed or operated according to the design." },
      de: { title: "Cloud, Docker und DevSecOps", proficiency: "Fortgeschritten und im Repository prüfbar", searchIntent: "Docker Hardening, Nginx, Linux, CI/CD, unveränderliche OCI-Images, HTTP-Header und Rollback.", businessProblem: "Ein erfolgreicher Build reicht nicht, wenn die Laufzeit veränderbar, privilegiert, undurchsichtig oder nicht rücksetzbar ist.", businessValue: "Macht Build, Image, Konfiguration, Healthcheck, Limits und Rollback zu prüfbaren Verträgen.", evidence: "IoCode-WEB enthält gehärtetes Compose, Digests, Nginx, Workflows und Release-Skripte; HotelSOL zeigt Multi-Service-Orchestrierung.", useCases: ["Non-root- und Read-only-Container", "Digest-basierte CI/CD", "Reverse Proxy und HTTP-Sicherheit", "Healthcheck, Observability und Rollback"], caution: "Repository-Kontrollen belegen nicht, dass die öffentliche Infrastruktur entsprechend betrieben wird." }
    }
  },
  {
    slug: "software-mobile",
    level: "demonstrated-applied",
    technologies: ["Kotlin", "Android", "Jetpack Compose", "C#", ".NET", "Python", "Java", "JavaFX", "Node.js", "SQL"],
    relatedServices: ["projects", "services", "contact"],
    relatedProjects: ["techwizards", "hotelsol", "the-javengers", "break-boxes-game"],
    copy: {
      es: { title: "Desarrollo de software y mobile", proficiency: "Aplicado y verificable", searchIntent: "Kotlin Android, C# .NET, Python, Java, JavaFX, Node.js y arquitectura de aplicaciones.", businessProblem: "Las aplicaciones empresariales necesitan separar interfaz, dominio, datos, identidad y configuración para poder evolucionar.", businessValue: "Aplica capas, casos de uso, DAO, APIs y módulos pequeños según el problema y la plataforma.", evidence: "TechWizards, HotelSOL, The Javengers y JuegoRompeCajas aportan fuentes públicas Kotlin, C#, Python y Java.", useCases: ["Aplicaciones Android", "APIs y módulos ERP", "Herramientas Java de escritorio", "Automatización y utilidades Python"], caution: "Flutter no aparece en los repositorios públicos inspeccionados y no se atribuye como competencia demostrada." },
      en: { title: "Software and mobile development", proficiency: "Applied and publicly verifiable", searchIntent: "Kotlin Android, C# .NET, Python, Java, JavaFX, Node.js and application architecture.", businessProblem: "Business applications must separate UI, domain, data, identity and configuration so they can evolve safely.", businessValue: "Applies layers, use cases, DAO, APIs and small modules according to the problem and platform.", evidence: "TechWizards, HotelSOL, The Javengers and Break Boxes provide public Kotlin, C#, Python and Java sources.", useCases: ["Android applications", "APIs and ERP modules", "Java desktop tools", "Python automation and utilities"], caution: "Flutter does not appear in the inspected public repositories and is not claimed as a demonstrated skill." },
      de: { title: "Software- und Mobile-Entwicklung", proficiency: "Angewandt und öffentlich prüfbar", searchIntent: "Kotlin Android, C# .NET, Python, Java, JavaFX, Node.js und Applikationsarchitektur.", businessProblem: "Geschäftsanwendungen müssen UI, Domäne, Daten, Identität und Konfiguration trennen, um sicher weiterentwickelt zu werden.", businessValue: "Nutzt Schichten, Use Cases, DAO, APIs und kleine Module passend zu Problem und Plattform.", evidence: "TechWizards, HotelSOL, The Javengers und Kistenbrechen liefern öffentliche Kotlin-, C#-, Python- und Java-Quellen.", useCases: ["Android-Anwendungen", "APIs und ERP-Module", "Java-Desktop-Werkzeuge", "Python-Automatisierung und Utilities"], caution: "Flutter erscheint nicht in den geprüften öffentlichen Repositories und wird nicht als nachgewiesene Kompetenz beansprucht." }
    }
  },
  {
    slug: "eu-data-governance",
    level: "technical-compliance",
    technologies: ["GDPR Art. 13/14", "GDPR Art. 28", "§5 DDG", "§25 TDDDG", "ROPA", "DPA register", "Data minimization", "Retention gates", "Privacy by design"],
    relatedServices: ["process", "contact", "privacy"],
    relatedProjects: ["iocode-web"],
    copy: {
      es: { title: "Gobernanza de datos y cumplimiento UE", proficiency: "Implementación técnica; aprobación jurídica pendiente", searchIntent: "RGPD, Art. 13/14/28, §5 DDG, §25 TDDDG, ROPA, DPA, minimización y privacidad desde el diseño.", businessProblem: "Un sitio puede publicar afirmaciones jurídicas incorrectas si código, inventarios y aprobaciones no comparten el mismo estado.", businessValue: "Introduce gates explícitos para identidad, tratamientos, proveedores, DPA, transferencias, retención y publicación legal.", evidence: "IoCode-WEB contiene páginas trilingües, inventario ROPA, registro DPA, DSAR, logs mínimos y bloqueo de producción.", useCases: ["Inventario de tratamientos", "Gates de publicación legal", "Minimización y retención", "Registro de proveedores y DPA"], caution: "Es ingeniería de cumplimiento, no asesoramiento jurídico. `controllerApproval` y determinaciones X-LEGAL siguen pendientes." },
      en: { title: "EU data governance and compliance", proficiency: "Technical implementation; legal approval pending", searchIntent: "GDPR Articles 13/14/28, section 5 DDG, section 25 TDDDG, ROPA, DPA, minimization and privacy by design.", businessProblem: "A website can publish incorrect legal claims when code, inventories and approvals do not share the same state.", businessValue: "Introduces explicit gates for identity, processing, providers, DPAs, transfers, retention and legal publication.", evidence: "IoCode-WEB contains trilingual notices, a ROPA inventory, DPA register, DSAR process, minimal logs and a production block.", useCases: ["Processing inventory", "Legal-publication gates", "Minimization and retention", "Provider and DPA register"], caution: "This is compliance engineering, not legal advice. Controller approval and X-LEGAL determinations remain pending." },
      de: { title: "EU-Datengovernance und Compliance", proficiency: "Technische Umsetzung; juristische Freigabe ausstehend", searchIntent: "DSGVO Art. 13/14/28, §5 DDG, §25 TDDDG, VVT, AV-Verträge, Minimierung und Privacy by Design.", businessProblem: "Eine Website kann falsche Rechtsaussagen veröffentlichen, wenn Code, Inventare und Freigaben unterschiedliche Zustände haben.", businessValue: "Führt explizite Gates für Identität, Verarbeitung, Anbieter, AV-Verträge, Transfers, Aufbewahrung und Veröffentlichung ein.", evidence: "IoCode-WEB enthält dreisprachige Hinweise, VVT, DPA-Register, DSAR-Prozess, minimale Logs und einen Produktionsblock.", useCases: ["Verzeichnis von Verarbeitungstätigkeiten", "Gates für Rechtstexte", "Minimierung und Aufbewahrung", "Anbieter- und DPA-Register"], caution: "Compliance Engineering ist keine Rechtsberatung. Controller-Freigabe und X-LEGAL-Entscheidungen stehen aus." }
    }
  },
  {
    slug: "performance-qa",
    level: "demonstrated-advanced",
    technologies: ["Playwright", "Axe", "Lighthouse", "Core Web Vitals", "Astro check", "TypeScript", "Node test", "Resource budgets", "WebGL lifecycle"],
    relatedServices: ["process", "projects", "skills"],
    relatedProjects: ["iocode-web", "techwizards"],
    copy: {
      es: { title: "Rendimiento web y QA automatizado", proficiency: "Avanzado y verificable en código", searchIntent: "Playwright, Axe, Lighthouse, Core Web Vitals, presupuestos, WebGL, accesibilidad y cero flaky tests.", businessProblem: "Una interfaz puede parecer correcta y aun fallar por teclado, viewport, idioma, memoria, metadatos o regresiones de rendimiento.", businessValue: "Convierte rutas, accesibilidad, SEO, recursos, contexto WebGL y release en contratos automatizados y repetibles.", evidence: "IoCode-WEB publica suites Node y Playwright, Axe, Lighthouse, presupuestos y gestión explícita del ciclo WebGL.", useCases: ["E2E multiperfil", "Auditoría WCAG", "Presupuestos LCP/CLS/TBT", "Context loss, memoria y fallback 3D"], caution: "Los resultados de laboratorio no sustituyen dispositivos físicos, monitorización de campo ni evidencia del mismo SHA desplegado." },
      en: { title: "Web performance and automated QA", proficiency: "Advanced and publicly verifiable", searchIntent: "Playwright, Axe, Lighthouse, Core Web Vitals, budgets, WebGL, accessibility and zero-flaky testing.", businessProblem: "An interface can look correct and still fail on keyboard use, viewports, languages, memory, metadata or performance regressions.", businessValue: "Turns routes, accessibility, SEO, resources, WebGL lifecycle and releases into automated, repeatable contracts.", evidence: "IoCode-WEB publishes Node and Playwright suites, Axe, Lighthouse, budgets and explicit WebGL lifecycle management.", useCases: ["Multi-profile E2E", "WCAG auditing", "LCP/CLS/TBT budgets", "3D context loss, memory and fallback"], caution: "Laboratory results do not replace physical devices, field monitoring or evidence from the same deployed SHA." },
      de: { title: "Web-Performance und automatisierte QA", proficiency: "Fortgeschritten und öffentlich prüfbar", searchIntent: "Playwright, Axe, Lighthouse, Core Web Vitals, Budgets, WebGL, Barrierefreiheit und stabile Tests.", businessProblem: "Eine Oberfläche kann korrekt aussehen und bei Tastatur, Viewport, Sprache, Speicher, Metadaten oder Performance trotzdem versagen.", businessValue: "Macht Routen, Accessibility, SEO, Ressourcen, WebGL-Lebenszyklus und Releases zu automatisierten, wiederholbaren Verträgen.", evidence: "IoCode-WEB veröffentlicht Node- und Playwright-Suiten, Axe, Lighthouse, Budgets und explizites WebGL-Lifecycle-Management.", useCases: ["E2E mit mehreren Profilen", "WCAG-Audit", "LCP-/CLS-/TBT-Budgets", "3D Context Loss, Speicher und Fallback"], caution: "Laborwerte ersetzen keine physischen Geräte, Feldmessung oder Evidenz desselben deployten SHA." }
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
