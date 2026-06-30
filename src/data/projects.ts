import type { Locale } from "../i18n/config";

export type ProjectStatus =
  | "public"
  | "private"
  | "academic"
  | "technical-case"
  | "local-demo"
  | "documentation-only"
  | "in-progress";

export type EvidenceLevel =
  | "public-demo"
  | "public-repository"
  | "private-project"
  | "academic-project"
  | "technical-case"
  | "local-demo"
  | "documentation-only"
  | "not-publicly-verifiable";

export type ClaimLevel =
  | "verified"
  | "user-provided"
  | "technical-demonstration"
  | "inferred-capability"
  | "not-publicly-verifiable";

export type ProjectCapability =
  | "erp-deployment"
  | "web-development"
  | "mobile-development"
  | "devops-docker"
  | "identity-access-management"
  | "windows-server-administration"
  | "java-desktop"
  | "iot-automation"
  | "machine-learning"
  | "database-design"
  | "industrial-automation"
  | "software-architecture";

export type ProjectLink = {
  label: string;
  href: string;
  type: "demo" | "repository" | "documentation" | "case-study";
  external: boolean;
};

export type Project = {
  slug: string;
  title: string;
  type: string;
  summary: string;
  problem: string;
  solution: string;
  technicalRole: string;
  businessValue: string;
  technologies: string[];
  capabilities: ProjectCapability[];
  status: ProjectStatus;
  evidenceLevel: EvidenceLevel;
  claimLevel: ClaimLevel;
  caution: string;
  publicLinks: ProjectLink[];
  featured: boolean;
};

type LocalizedProjectCopy = Record<
  Locale,
  {
    title: string;
    type: string;
    summary: string;
    problem: string;
    solution: string;
    technicalRole: string;
    businessValue: string;
    caution: string;
  }
>;

type ProjectSeed = {
  slug: string;
  technologies: string[];
  capabilities: ProjectCapability[];
  status: ProjectStatus;
  evidenceLevel: EvidenceLevel;
  claimLevel: ClaimLevel;
  publicLinks: ProjectLink[];
  featured: boolean;
  copy: LocalizedProjectCopy;
};

function toProject(seed: ProjectSeed, locale: Locale): Project {
  const copy = seed.copy[locale];

  return {
    slug: seed.slug,
    title: copy.title,
    type: copy.type,
    summary: copy.summary,
    problem: copy.problem,
    solution: copy.solution,
    technicalRole: copy.technicalRole,
    businessValue: copy.businessValue,
    technologies: seed.technologies,
    capabilities: seed.capabilities,
    status: seed.status,
    evidenceLevel: seed.evidenceLevel,
    claimLevel: seed.claimLevel,
    caution: copy.caution,
    publicLinks: seed.publicLinks,
    featured: seed.featured
  };
}

const projectSeeds: ProjectSeed[] = [
  {
    slug: "techwizards",
    technologies: ["Kotlin", "Android", "Firebase", "Jetpack Compose", "Layered architecture"],
    capabilities: ["mobile-development", "database-design", "software-architecture"],
    status: "technical-case",
    evidenceLevel: "public-repository",
    claimLevel: "technical-demonstration",
    featured: true,
    publicLinks: [
      {
        label: "GitHub",
        href: "https://github.com/dadd86/TechWizards",
        type: "repository",
        external: true
      }
    ],
    copy: {
      es: {
        title: "TechWizards",
        type: "Aplicación Android",
        summary:
          "Aplicación Android documentada con arquitectura por capas, persistencia y separación de responsabilidades.",
        problem:
          "Estructurar una aplicación móvil mantenible evitando mezclar interfaz, lógica, datos y configuración.",
        solution:
          "Organización por capas con Kotlin, Firebase y Jetpack Compose, separando componentes de UI, persistencia y lógica de aplicación.",
        technicalRole:
          "Diseño de estructura técnica, organización del código, integración de Firebase y documentación del enfoque de arquitectura.",
        businessValue:
          "Demuestra capacidad para construir aplicaciones móviles organizadas, mantenibles y preparadas para evolucionar sin depender de improvisación.",
        caution:
          "Repositorio público usado como evidencia técnica. No se presenta como producto comercial validado ni como aplicación en producción."
      },
      en: {
        title: "TechWizards",
        type: "Android application",
        summary:
          "Documented Android application with layered architecture, persistence and separation of responsibilities.",
        problem:
          "Structure a maintainable mobile application without mixing interface, logic, data and configuration.",
        solution:
          "Layered organization with Kotlin, Firebase and Jetpack Compose, separating UI components, persistence and application logic.",
        technicalRole:
          "Technical structure design, code organization, Firebase integration and architecture documentation.",
        businessValue:
          "Demonstrates the ability to build organized, maintainable mobile applications that can evolve without improvisation.",
        caution:
          "Public repository used as technical evidence. It is not presented as a validated commercial product or production application."
      },
      de: {
        title: "TechWizards",
        type: "Android-Anwendung",
        summary:
          "Dokumentierte Android-Anwendung mit Schichtenarchitektur, Persistenz und klarer Trennung der Verantwortlichkeiten.",
        problem:
          "Eine wartbare mobile Anwendung strukturieren, ohne Oberfläche, Logik, Daten und Konfiguration zu vermischen.",
        solution:
          "Schichtenstruktur mit Kotlin, Firebase und Jetpack Compose, getrennt nach UI-Komponenten, Persistenz und Anwendungslogik.",
        technicalRole:
          "Technische Strukturierung, Code-Organisation, Firebase-Integration und Dokumentation des Architekturansatzes.",
        businessValue:
          "Zeigt die Fähigkeit, organisierte und wartbare mobile Anwendungen aufzubauen, die ohne Improvisation erweitert werden können.",
        caution:
          "Öffentliches Repository als technischer Nachweis. Es wird nicht als validiertes kommerzielles Produkt oder produktive Anwendung dargestellt."
      }
    }
  },
  {
    slug: "neuronaprediccion",
    technologies: ["Python", "SQL", "YAML", "DAO", "Machine learning"],
    capabilities: ["machine-learning", "database-design", "software-architecture"],
    status: "private",
    evidenceLevel: "private-project",
    claimLevel: "not-publicly-verifiable",
    featured: true,
    publicLinks: [],
    copy: {
      es: {
        title: "NeuronaPrediccion",
        type: "Caso privado de datos y ML",
        summary:
          "Caso privado orientado a arquitectura de datos, configuración YAML, SQL, DAO y componentes de análisis.",
        problem:
          "Organizar datos, configuración y lógica de análisis de forma trazable sin exponer código privado ni métricas no reproducibles.",
        solution:
          "Separación de capas para acceso a datos, configuración y componentes de análisis usando Python, SQL, YAML y patrón DAO.",
        technicalRole:
          "Diseño de estructura de datos, separación de responsabilidades, organización de configuración y documentación técnica.",
        businessValue:
          "Demuestra capacidad para trabajar con datos, trazabilidad y componentes analíticos sin prometer precisión predictiva no verificada.",
        caution:
          "Repositorio privado. No se publica enlace ni se prometen métricas de precisión, impacto económico o resultados productivos."
      },
      en: {
        title: "NeuronaPrediccion",
        type: "Private data and ML case",
        summary:
          "Private case focused on data architecture, YAML configuration, SQL, DAO and analysis components.",
        problem:
          "Organize data, configuration and analysis logic in a traceable way without exposing private code or non-reproducible metrics.",
        solution:
          "Layer separation for data access, configuration and analysis components using Python, SQL, YAML and the DAO pattern.",
        technicalRole:
          "Data structure design, separation of responsibilities, configuration organization and technical documentation.",
        businessValue:
          "Demonstrates the ability to work with data, traceability and analytical components without promising unverified predictive accuracy.",
        caution:
          "Private repository. No link is published and no accuracy, economic impact or production result is promised."
      },
      de: {
        title: "NeuronaPrediccion",
        type: "Privater Daten- und ML-Fall",
        summary:
          "Privater Fall mit Fokus auf Datenarchitektur, YAML-Konfiguration, SQL, DAO und Analysekomponenten.",
        problem:
          "Daten, Konfiguration und Analyselogik nachvollziehbar organisieren, ohne privaten Code oder nicht reproduzierbare Metriken offenzulegen.",
        solution:
          "Schichtentrennung für Datenzugriff, Konfiguration und Analysekomponenten mit Python, SQL, YAML und DAO-Muster.",
        technicalRole:
          "Datenstrukturierung, Trennung der Verantwortlichkeiten, Organisation der Konfiguration und technische Dokumentation.",
        businessValue:
          "Zeigt die Fähigkeit, mit Daten, Traceability und Analysekomponenten zu arbeiten, ohne nicht verifizierte Prognosegenauigkeit zu versprechen.",
        caution:
          "Privates Repository. Es wird kein Link veröffentlicht und keine Genauigkeit, wirtschaftliche Wirkung oder produktives Ergebnis versprochen."
      }
    }
  },
  {
    slug: "maceta-inteligente",
    technologies: ["IoT", "Sensors", "Python", "SQL", "Automation"],
    capabilities: ["iot-automation", "database-design", "industrial-automation"],
    status: "private",
    evidenceLevel: "private-project",
    claimLevel: "technical-demonstration",
    featured: true,
    publicLinks: [],
    copy: {
      es: {
        title: "MacetaInteligente",
        type: "Caso privado IoT",
        summary:
          "Caso privado de automatización e IoT con integración de sensores, datos físicos y lógica de seguimiento.",
        problem:
          "Conectar señales de sensores con datos persistentes y lógica de automatización sin exponer información interna del proyecto.",
        solution:
          "Modelo técnico para capturar datos de sensores, almacenarlos y relacionarlos con estados físicos de una maceta o proceso controlado.",
        technicalRole:
          "Diseño de estructura de datos, integración conceptual de sensores y organización de lógica de automatización.",
        businessValue:
          "Demuestra capacidad para conectar mundo físico, datos y software en casos de trazabilidad e IoT.",
        caution:
          "Caso privado. Solo debe publicarse descripción general, sin credenciales, IPs, capturas sensibles ni datos internos."
      },
      en: {
        title: "MacetaInteligente",
        type: "Private IoT case",
        summary:
          "Private automation and IoT case with sensor integration, physical data and monitoring logic.",
        problem:
          "Connect sensor signals with persistent data and automation logic without exposing internal project information.",
        solution:
          "Technical model to capture sensor data, store it and relate it to physical states of a pot or controlled process.",
        technicalRole:
          "Data structure design, conceptual sensor integration and organization of automation logic.",
        businessValue:
          "Demonstrates the ability to connect the physical world, data and software in traceability and IoT cases.",
        caution:
          "Private case. Only a general description should be published, without credentials, IPs, sensitive screenshots or internal data."
      },
      de: {
        title: "MacetaInteligente",
        type: "Privater IoT-Fall",
        summary:
          "Privater Automatisierungs- und IoT-Fall mit Sensorintegration, physischen Daten und Monitoring-Logik.",
        problem:
          "Sensorsignale mit persistenten Daten und Automatisierungslogik verbinden, ohne interne Projektinformationen offenzulegen.",
        solution:
          "Technisches Modell zur Erfassung, Speicherung und Zuordnung von Sensordaten zu physischen Zuständen einer Pflanze oder eines kontrollierten Prozesses.",
        technicalRole:
          "Datenstrukturierung, konzeptionelle Sensorintegration und Organisation der Automatisierungslogik.",
        businessValue:
          "Zeigt die Fähigkeit, physische Prozesse, Daten und Software in Traceability- und IoT-Fällen zu verbinden.",
        caution:
          "Privater Fall. Es sollte nur eine allgemeine Beschreibung ohne Zugangsdaten, IPs, sensible Screenshots oder interne Daten veröffentlicht werden."
      }
    }
  },
  {
    slug: "hotelsol",
    technologies: [".NET", "SQL Server", "XML", "UML", "Layered architecture"],
    capabilities: ["web-development", "database-design", "software-architecture"],
    status: "technical-case",
    evidenceLevel: "public-repository",
    claimLevel: "technical-demonstration",
    featured: true,
    publicLinks: [
      {
        label: "GitHub",
        href: "https://github.com/dadd86/HotelSOL",
        type: "repository",
        external: true
      }
    ],
    copy: {
      es: {
        title: "HotelSOL",
        type: "Sistema de gestión hotelera",
        summary:
          "Aplicación de gestión orientada a reservas, datos, documentación técnica y arquitectura por capas.",
        problem:
          "Modelar una solución de gestión hotelera con persistencia, documentación y separación clara entre datos, lógica y presentación.",
        solution:
          "Aplicación estructurada con base de datos, documentación UML/XML y enfoque de capas para mantener el código comprensible.",
        technicalRole:
          "Diseño de estructura, modelado de datos, documentación técnica y organización del proyecto.",
        businessValue:
          "Demuestra capacidad para construir aplicaciones de gestión con base de datos, documentación y lógica empresarial organizada.",
        caution:
          "Repositorio público usado como evidencia técnica. No se presenta como sistema productivo de un hotel ni como implementación de cliente."
      },
      en: {
        title: "HotelSOL",
        type: "Hotel management system",
        summary:
          "Management application focused on bookings, data, technical documentation and layered architecture.",
        problem:
          "Model a hotel management solution with persistence, documentation and clear separation between data, logic and presentation.",
        solution:
          "Structured application with database, UML/XML documentation and a layered approach to keep the code understandable.",
        technicalRole:
          "Structure design, data modeling, technical documentation and project organization.",
        businessValue:
          "Demonstrates the ability to build management applications with database, documentation and organized business logic.",
        caution:
          "Public repository used as technical evidence. It is not presented as a productive hotel system or client implementation."
      },
      de: {
        title: "HotelSOL",
        type: "Hotelverwaltungssystem",
        summary:
          "Verwaltungsanwendung mit Fokus auf Reservierungen, Daten, technischer Dokumentation und Schichtenarchitektur.",
        problem:
          "Eine Hotelverwaltungslösung mit Persistenz, Dokumentation und klarer Trennung zwischen Daten, Logik und Darstellung modellieren.",
        solution:
          "Strukturierte Anwendung mit Datenbank, UML/XML-Dokumentation und Schichtenansatz zur besseren Wartbarkeit.",
        technicalRole:
          "Strukturentwurf, Datenmodellierung, technische Dokumentation und Projektorganisation.",
        businessValue:
          "Zeigt die Fähigkeit, Verwaltungsanwendungen mit Datenbank, Dokumentation und organisierter Geschäftslogik aufzubauen.",
        caution:
          "Öffentliches Repository als technischer Nachweis. Es wird nicht als produktives Hotelsystem oder Kundenimplementierung dargestellt."
      }
    }
  },
  {
    slug: "odoo-erp-deployment",
    technologies: ["Odoo", "Docker", "PostgreSQL", "Windows Server", "DevOps"],
    capabilities: ["erp-deployment", "devops-docker", "database-design"],
    status: "local-demo",
    evidenceLevel: "local-demo",
    claimLevel: "technical-demonstration",
    featured: true,
    publicLinks: [],
    copy: {
      es: {
        title: "Odoo ERP Deployment",
        type: "Caso técnico ERP local",
        summary:
          "Caso técnico de despliegue ERP con contenedores, servicios dependientes y documentación operativa.",
        problem:
          "Preparar un entorno ERP reproducible para validar instalación, servicios y arranque sin depender de configuración manual frágil.",
        solution:
          "Definición de entorno Docker con Odoo, base de datos y guía de ejecución local.",
        technicalRole:
          "Configuración de contenedores, revisión de dependencias, documentación de ejecución y validación de arranque.",
        businessValue:
          "Demuestra capacidad para preparar entornos ERP reproducibles y documentados antes de una implantación real.",
        caution:
          "Caso técnico local. No se presenta como despliegue productivo ni como implantación realizada para un cliente."
      },
      en: {
        title: "Odoo ERP Deployment",
        type: "Local ERP technical case",
        summary:
          "Technical ERP deployment case with containers, dependent services and operational documentation.",
        problem:
          "Prepare a reproducible ERP environment to validate installation, services and startup without fragile manual configuration.",
        solution:
          "Docker environment definition with Odoo, database and local execution guide.",
        technicalRole:
          "Container configuration, dependency review, execution documentation and startup validation.",
        businessValue:
          "Demonstrates the ability to prepare reproducible and documented ERP environments before a real implementation.",
        caution:
          "Local technical case. It is not presented as a production deployment or client implementation."
      },
      de: {
        title: "Odoo ERP Deployment",
        type: "Lokaler technischer ERP-Fall",
        summary:
          "Technischer ERP-Deployment-Fall mit Containern, abhängigen Diensten und operativer Dokumentation.",
        problem:
          "Eine reproduzierbare ERP-Umgebung vorbereiten, um Installation, Dienste und Start ohne fragile manuelle Konfiguration zu validieren.",
        solution:
          "Docker-Umgebung mit Odoo, Datenbank und lokaler Ausführungsanleitung.",
        technicalRole:
          "Container-Konfiguration, Prüfung von Abhängigkeiten, Ausführungsdokumentation und Startvalidierung.",
        businessValue:
          "Zeigt die Fähigkeit, reproduzierbare und dokumentierte ERP-Umgebungen vor einer realen Einführung vorzubereiten.",
        caution:
          "Lokaler technischer Fall. Es wird nicht als produktives Deployment oder Kundenimplementierung dargestellt."
      }
    }
  },
  {
    slug: "openldap-docker",
    technologies: ["OpenLDAP", "Docker", "Linux", "Authentication", "Infrastructure"],
    capabilities: ["identity-access-management", "devops-docker", "software-architecture"],
    status: "local-demo",
    evidenceLevel: "local-demo",
    claimLevel: "technical-demonstration",
    featured: false,
    publicLinks: [],
    copy: {
      es: {
        title: "OpenLDAP Docker",
        type: "Caso técnico IAM",
        summary:
          "Caso técnico de servicio de directorio en contenedor para validar conceptos de identidad, usuarios y autenticación.",
        problem:
          "Probar una base de identidad reproducible sin depender de infraestructura externa ni exponer datos reales.",
        solution:
          "Entorno local con OpenLDAP y Docker para validar estructura, usuarios de prueba y documentación técnica.",
        technicalRole:
          "Configuración de servicio, documentación de arranque, revisión de estructura de directorio y aislamiento de datos.",
        businessValue:
          "Demuestra capacidad para trabajar con servicios de identidad, autenticación e infraestructura reproducible.",
        caution:
          "Caso técnico local. No contiene usuarios reales, dominios internos, contraseñas ni datos empresariales."
      },
      en: {
        title: "OpenLDAP Docker",
        type: "IAM technical case",
        summary:
          "Technical directory-service case in a container to validate identity, users and authentication concepts.",
        problem:
          "Test a reproducible identity base without depending on external infrastructure or exposing real data.",
        solution:
          "Local environment with OpenLDAP and Docker to validate structure, test users and technical documentation.",
        technicalRole:
          "Service configuration, startup documentation, directory structure review and data isolation.",
        businessValue:
          "Demonstrates the ability to work with identity services, authentication and reproducible infrastructure.",
        caution:
          "Local technical case. It does not contain real users, internal domains, passwords or business data."
      },
      de: {
        title: "OpenLDAP Docker",
        type: "Technischer IAM-Fall",
        summary:
          "Technischer Verzeichnisdienst-Fall im Container zur Validierung von Identität, Benutzern und Authentifizierungskonzepten.",
        problem:
          "Eine reproduzierbare Identitätsbasis testen, ohne externe Infrastruktur oder reale Daten offenzulegen.",
        solution:
          "Lokale Umgebung mit OpenLDAP und Docker zur Validierung von Struktur, Testbenutzern und technischer Dokumentation.",
        technicalRole:
          "Dienstkonfiguration, Startdokumentation, Prüfung der Verzeichnisstruktur und Datenisolation.",
        businessValue:
          "Zeigt die Fähigkeit, mit Identitätsdiensten, Authentifizierung und reproduzierbarer Infrastruktur zu arbeiten.",
        caution:
          "Lokaler technischer Fall. Er enthält keine realen Benutzer, internen Domains, Passwörter oder Geschäftsdaten."
      }
    }
  },
  {
    slug: "ad-wsus",
    technologies: ["Windows Server", "Active Directory", "WSUS", "GPO", "DNS"],
    capabilities: ["windows-server-administration", "identity-access-management", "software-architecture"],
    status: "documentation-only",
    evidenceLevel: "documentation-only",
    claimLevel: "technical-demonstration",
    featured: false,
    publicLinks: [],
    copy: {
      es: {
        title: "AD/WSUS",
        type: "Caso técnico Windows Server",
        summary:
          "Caso de laboratorio técnico sobre Active Directory, políticas, servicios Windows y administración centralizada.",
        problem:
          "Diseñar una estructura controlada para usuarios, equipos, políticas y actualizaciones sin publicar datos internos.",
        solution:
          "Documentación técnica de laboratorio con dominio, DNS, GPO, permisos y criterios de administración.",
        technicalRole:
          "Diseño de dominio de laboratorio, configuración de políticas, documentación y validación de administración.",
        businessValue:
          "Demuestra capacidad para organizar infraestructura Windows, acceso de usuarios y criterios de administración.",
        caution:
          "Caso documentado. No deben publicarse nombres de dominio reales, usuarios reales, IPs internas ni credenciales."
      },
      en: {
        title: "AD/WSUS",
        type: "Windows Server technical case",
        summary:
          "Technical lab case about Active Directory, policies, Windows services and centralized administration.",
        problem:
          "Design a controlled structure for users, computers, policies and updates without publishing internal data.",
        solution:
          "Technical lab documentation with domain, DNS, GPO, permissions and administration criteria.",
        technicalRole:
          "Lab domain design, policy configuration, documentation and administration validation.",
        businessValue:
          "Demonstrates the ability to organize Windows infrastructure, user access and administration criteria.",
        caution:
          "Documented case. Real domain names, real users, internal IPs and credentials must not be published."
      },
      de: {
        title: "AD/WSUS",
        type: "Technischer Windows-Server-Fall",
        summary:
          "Technischer Laborfall zu Active Directory, Richtlinien, Windows-Diensten und zentraler Administration.",
        problem:
          "Eine kontrollierte Struktur für Benutzer, Computer, Richtlinien und Updates entwerfen, ohne interne Daten zu veröffentlichen.",
        solution:
          "Technische Labordokumentation mit Domain, DNS, GPO, Berechtigungen und Administrationskriterien.",
        technicalRole:
          "Labordomain-Design, Richtlinienkonfiguration, Dokumentation und Validierung der Administration.",
        businessValue:
          "Zeigt die Fähigkeit, Windows-Infrastruktur, Benutzerzugriff und Administrationskriterien zu organisieren.",
        caution:
          "Dokumentierter Fall. Reale Domainnamen, reale Benutzer, interne IPs und Zugangsdaten dürfen nicht veröffentlicht werden."
      }
    }
  },
  {
    slug: "java-mvc-dao-javafx",
    technologies: ["Java", "JavaFX", "MVC", "DAO", "SQL"],
    capabilities: ["java-desktop", "database-design", "software-architecture"],
    status: "academic",
    evidenceLevel: "academic-project",
    claimLevel: "technical-demonstration",
    featured: false,
    publicLinks: [],
    copy: {
      es: {
        title: "Java MVC/DAO/JavaFX",
        type: "Caso académico de arquitectura Java",
        summary:
          "Caso académico para demostrar separación MVC, acceso a datos con DAO, interfaz JavaFX y persistencia.",
        problem:
          "Construir una aplicación Java mantenible evitando mezclar interfaz, consultas, lógica y modelo de datos.",
        solution:
          "Estructura MVC con patrón DAO, JavaFX para interfaz y persistencia separada por capas.",
        technicalRole:
          "Diseño de capas, organización de clases, conexión con datos y documentación del patrón usado.",
        businessValue:
          "Demuestra fundamentos de arquitectura de software, aplicaciones de escritorio y persistencia de datos.",
        caution:
          "Caso académico. No se presenta como software comercial ni como solución implantada en producción."
      },
      en: {
        title: "Java MVC/DAO/JavaFX",
        type: "Academic Java architecture case",
        summary:
          "Academic case to demonstrate MVC separation, DAO data access, JavaFX interface and persistence.",
        problem:
          "Build a maintainable Java application without mixing interface, queries, logic and data model.",
        solution:
          "MVC structure with DAO pattern, JavaFX interface and persistence separated by layers.",
        technicalRole:
          "Layer design, class organization, data connection and documentation of the pattern used.",
        businessValue:
          "Demonstrates software architecture fundamentals, desktop applications and data persistence.",
        caution:
          "Academic case. It is not presented as commercial software or as a production implementation."
      },
      de: {
        title: "Java MVC/DAO/JavaFX",
        type: "Akademischer Java-Architekturfall",
        summary:
          "Akademischer Fall zur Demonstration von MVC-Trennung, DAO-Datenzugriff, JavaFX-Oberfläche und Persistenz.",
        problem:
          "Eine wartbare Java-Anwendung bauen, ohne Oberfläche, Abfragen, Logik und Datenmodell zu vermischen.",
        solution:
          "MVC-Struktur mit DAO-Muster, JavaFX-Oberfläche und schichtweise getrennter Persistenz.",
        technicalRole:
          "Schichtendesign, Klassenorganisation, Datenanbindung und Dokumentation des verwendeten Musters.",
        businessValue:
          "Zeigt Grundlagen der Softwarearchitektur, Desktop-Anwendungen und Datenpersistenz.",
        caution:
          "Akademischer Fall. Es wird nicht als kommerzielle Software oder produktive Implementierung dargestellt."
      }
    }
  }
];

export const projects: Record<Locale, Project[]> = {
  es: projectSeeds.map((project) => toProject(project, "es")),
  en: projectSeeds.map((project) => toProject(project, "en")),
  de: projectSeeds.map((project) => toProject(project, "de"))
};