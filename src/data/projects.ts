import type { Locale } from "../i18n/config";

const projectBasePaths: Record<Locale, string> = {
  es: "/es/proyectos/",
  en: "/en/projects/",
  de: "/de/projekte/"
};

export type ProjectKey =
  | "iocode-web"
  | "techwizards"
  | "hotelsol"
  | "woodshops"
  | "vehicle-rental"
  | "the-javengers"
  | "coworking-database"
  | "break-boxes-game";

export type ProjectCapability =
  | "industrial-web"
  | "mobile-development"
  | "devsecops-docker"
  | "database-design"
  | "software-architecture"
  | "java-oop"
  | "quality-assurance"
  | "erp-integration"
  | "python-development";

export type ProjectLink = {
  label: string;
  href: string;
  type: "repository" | "documentation";
  external: true;
};

export type Project = {
  key: ProjectKey;
  slug: string;
  path: string;
  title: string;
  type: string;
  summary: string;
  problem: string;
  solution: string;
  technicalRole: string;
  businessValue: string;
  evidenceSummary: string;
  technologies: string[];
  capabilities: ProjectCapability[];
  evidenceLevel: "public-repository";
  claimLevel: "verified" | "technical-demonstration";
  caution: string;
  publicLinks: ProjectLink[];
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  schemaType: "SoftwareSourceCode";
  imageAlt: string;
};

export type PortfolioPageCopy = {
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  intro: string;
  imageAlt: string;
};

type LocalizedProjectCopy = Record<
  Locale,
  Omit<
    Project,
    | "key"
    | "path"
    | "technologies"
    | "capabilities"
    | "evidenceLevel"
    | "claimLevel"
    | "publicLinks"
    | "featured"
  >
>;

type ProjectSeed = {
  key: ProjectKey;
  repository: string;
  technologies: string[];
  capabilities: ProjectCapability[];
  claimLevel: Project["claimLevel"];
  featured: boolean;
  copy: LocalizedProjectCopy;
};

export const portfolioPageCopy: Record<Locale, PortfolioPageCopy> = {
  es: {
    title: "Proyectos de software industrial | IoCode",
    description:
      "Casos verificables en Astro, Docker, Android, .NET, Odoo, Java, Python y SQL, con arquitectura, código público y trazabilidad técnica.",
    eyebrow: "Portfolio técnico verificable",
    heading: "Código público convertido en casos técnicos comprensibles.",
    intro:
      "Cada ficha separa problema, solución, resultado observable y límites de la evidencia. No se publican métricas comerciales ni experiencia industrial que GitHub no pueda demostrar.",
    imageAlt: "Portfolio técnico de software industrial y automatización de IoCode SOLUTIONS"
  },
  en: {
    title: "Industrial software projects | IoCode",
    description:
      "Verifiable Astro, Docker, Android, .NET, Odoo, Java, Python and SQL projects with public code, architecture and technical traceability.",
    eyebrow: "Verifiable technical portfolio",
    heading: "Public code translated into clear technical case studies.",
    intro:
      "Each case separates the problem, implementation, observable result and evidence limits. No commercial metric or industrial claim is inferred from GitHub.",
    imageAlt: "IoCode SOLUTIONS industrial software and automation engineering portfolio"
  },
  de: {
    title: "Industriesoftware-Projekte | IoCode",
    description:
      "Nachprüfbare Projekte mit Astro, Docker, Android, .NET, Odoo, Java, Python und SQL: öffentlicher Code und technische Traceability.",
    eyebrow: "Nachprüfbares technisches Portfolio",
    heading: "Öffentlicher Code als nachvollziehbare technische Fallstudie.",
    intro:
      "Jede Fallstudie trennt Problem, Umsetzung, sichtbares Ergebnis und Evidenzgrenzen. Geschäftliche Kennzahlen oder Industrieerfolge werden nicht aus GitHub abgeleitet.",
    imageAlt: "IoCode SOLUTIONS Portfolio für Industriesoftware und Automatisierungstechnik"
  }
};

const projectSeeds: ProjectSeed[] = [
  {
    key: "iocode-web",
    repository: "IoCode-WEB",
    technologies: ["Astro", "TypeScript", "Three.js", "WebGL", "Docker", "Nginx", "Playwright", "Axe", "GitHub Actions"],
    capabilities: ["industrial-web", "devsecops-docker", "quality-assurance", "software-architecture"],
    claimLevel: "verified",
    featured: true,
    copy: {
      es: {
        slug: "plataforma-web-industrial-iocode",
        title: "IoCode-WEB: plataforma industrial trilingüe",
        type: "Astro, WebGL y DevSecOps",
        summary: "Sitio estático ES/EN/DE con Hero3D progresivo, SEO técnico, pruebas accesibles y entrega endurecida en contenedores.",
        problem: "Publicar una propuesta industrial multilingüe sin sacrificar rendimiento, accesibilidad, trazabilidad del release ni seguridad HTTP.",
        solution: "Arquitectura Astro estática con TypeScript, Three.js bajo carga progresiva, CSP con hashes, Nginx, imágenes OCI por digest y gates Playwright/Axe.",
        technicalRole: "Arquitectura frontend, i18n, runtime WebGL, hardening Docker/Nginx, automatización CI/CD y contratos QA.",
        businessValue: "El build genera 66 páginas desde una base tipada para tres idiomas, con controles reproducibles de compilación, seguridad y accesibilidad.",
        evidenceSummary: "Código fuente, Compose, Nginx, workflows, 17 especificaciones E2E y nueve suites unitarias visibles en GitHub.",
        caution: "La existencia de los gates no equivale a un despliegue productivo aprobado ni a métricas reales de usuarios.",
        seoTitle: "Astro, Docker y WebGL industrial | IoCode",
        seoDescription: "Caso técnico Astro ES/EN/DE con Three.js, Docker, Nginx, CSP, Playwright, Axe y CI/CD inmutable para una web industrial rápida.",
        keywords: ["Astro industrial", "Docker hardening", "Three.js WebGL", "Playwright", "SEO multilingüe"],
        schemaType: "SoftwareSourceCode",
        imageAlt: "Arquitectura Astro, Docker y WebGL de la plataforma industrial IoCode"
      },
      en: {
        slug: "iocode-industrial-web-platform",
        title: "IoCode-WEB: trilingual industrial platform",
        type: "Astro, WebGL and DevSecOps",
        summary: "ES/EN/DE static site with a progressive 3D hero, technical SEO, accessible testing and hardened container delivery.",
        problem: "Publish a multilingual industrial proposition without trading away performance, accessibility, release traceability or HTTP security.",
        solution: "Static Astro architecture with TypeScript, progressively loaded Three.js, hash-based CSP, Nginx, digest-pinned OCI images and Playwright/Axe gates.",
        technicalRole: "Frontend architecture, i18n, WebGL runtime, Docker/Nginx hardening, CI/CD automation and QA contracts.",
        businessValue: "The build generates 66 pages from one typed codebase for three languages, with reproducible build, security and accessibility controls.",
        evidenceSummary: "Source, Compose, Nginx, workflows, 17 E2E specifications and nine unit suites are publicly inspectable on GitHub.",
        caution: "Implemented gates do not prove an approved production deployment or real-user performance metrics.",
        seoTitle: "Industrial Astro, Docker and WebGL | IoCode",
        seoDescription: "Astro ES/EN/DE case with Three.js, Docker, Nginx, CSP, Playwright, Axe and immutable CI/CD for a fast industrial website.",
        keywords: ["industrial Astro", "Docker hardening", "Three.js WebGL", "Playwright", "multilingual SEO"],
        schemaType: "SoftwareSourceCode",
        imageAlt: "Astro, Docker and WebGL architecture of the IoCode industrial platform"
      },
      de: {
        slug: "iocode-industrie-webplattform",
        title: "IoCode-WEB: dreisprachige Industrieplattform",
        type: "Astro, WebGL und DevSecOps",
        summary: "Statische ES/EN/DE-Website mit progressivem 3D-Hero, technischem SEO, Accessibility-Tests und gehärteter Container-Auslieferung.",
        problem: "Eine mehrsprachige Industriepräsenz veröffentlichen, ohne Performance, Barrierefreiheit, Release-Traceability oder HTTP-Sicherheit zu verlieren.",
        solution: "Statische Astro-Architektur mit TypeScript, progressiv geladenem Three.js, Hash-CSP, Nginx, OCI-Digests und Playwright/Axe-Gates.",
        technicalRole: "Frontend-Architektur, i18n, WebGL-Runtime, Docker/Nginx-Hardening, CI/CD-Automatisierung und QA-Verträge.",
        businessValue: "Der Build erzeugt 66 Seiten aus einer typisierten Codebasis für drei Sprachen mit reproduzierbaren Build-, Security- und Accessibility-Kontrollen.",
        evidenceSummary: "Quellcode, Compose, Nginx, Workflows, 17 E2E-Spezifikationen und neun Unit-Suiten sind öffentlich prüfbar.",
        caution: "Implementierte Gates belegen weder ein freigegebenes Produktiv-Deployment noch reale Nutzermetriken.",
        seoTitle: "Astro, Docker und WebGL für Industrie | IoCode",
        seoDescription: "Astro-Fallstudie ES/EN/DE mit Three.js, Docker, Nginx, CSP, Playwright, Axe und unveränderlicher CI/CD für schnelle Industriewebsites.",
        keywords: ["Astro Industrie", "Docker Hardening", "Three.js WebGL", "Playwright", "mehrsprachiges SEO"],
        schemaType: "SoftwareSourceCode",
        imageAlt: "Astro-, Docker- und WebGL-Architektur der IoCode-Industrieplattform"
      }
    }
  },
  {
    key: "techwizards",
    repository: "TechWizards",
    technologies: ["Kotlin", "Android", "Jetpack Compose", "Firebase", "EncryptedSharedPreferences", "SQL", "TypeScript"],
    capabilities: ["mobile-development", "database-design", "software-architecture"],
    claimLevel: "verified",
    featured: true,
    copy: {
      es: {
        slug: "app-android-techwizards",
        title: "TechWizards: aplicación Android por capas",
        type: "Kotlin y arquitectura móvil",
        summary: "Aplicación Android con casos de uso, autenticación, credenciales cifradas, persistencia y separación explícita de capas.",
        problem: "Evitar que autenticación, interfaz, preferencias, historial y reglas de juego queden acoplados en una aplicación móvil creciente.",
        solution: "Código Kotlin organizado por núcleo, casos de uso, datos y UI, con Firebase, Jetpack Compose y almacenamiento cifrado de credenciales.",
        technicalRole: "Diseño de arquitectura, implementación Kotlin, integración de identidad y persistencia, y documentación dentro del código.",
        businessValue: "La estructura pública permite localizar responsabilidades, sustituir dependencias y probar flujos sin concentrar toda la lógica en la actividad principal.",
        evidenceSummary: "El árbol público contiene casos de uso, ServiceLocator, SessionManager, EncryptedCredentialsStore, SQL y pruebas instrumentadas.",
        caution: "Es evidencia de ingeniería académica; no se presenta como producto móvil publicado ni como sistema industrial.",
        seoTitle: "App Android con Kotlin y Firebase | IoCode",
        seoDescription: "Caso Android con Kotlin, Jetpack Compose, Firebase, credenciales cifradas, casos de uso y arquitectura por capas verificable en GitHub.",
        keywords: ["Kotlin Android", "Jetpack Compose", "Firebase", "arquitectura por capas", "credenciales cifradas"],
        schemaType: "SoftwareSourceCode",
        imageAlt: "Arquitectura Kotlin por capas de la aplicación Android TechWizards"
      },
      en: {
        slug: "techwizards-layered-android-app",
        title: "TechWizards: layered Android application",
        type: "Kotlin and mobile architecture",
        summary: "Android app with use cases, authentication, encrypted credentials, persistence and explicit layer boundaries.",
        problem: "Prevent authentication, UI, preferences, match history and game rules from becoming coupled as the mobile app grows.",
        solution: "Kotlin code organized into core, use-case, data and UI layers with Firebase, Jetpack Compose and encrypted credential storage.",
        technicalRole: "Architecture design, Kotlin implementation, identity and persistence integration, plus in-code documentation.",
        businessValue: "The public structure makes responsibilities traceable, dependencies replaceable and workflows testable without centralizing logic in one activity.",
        evidenceSummary: "The public tree includes use cases, ServiceLocator, SessionManager, EncryptedCredentialsStore, SQL and instrumented tests.",
        caution: "This is academic engineering evidence, not a published mobile product or industrial system.",
        seoTitle: "Kotlin and Firebase Android app | IoCode",
        seoDescription: "Android case with Kotlin, Jetpack Compose, Firebase, encrypted credentials, use cases and a verifiable layered architecture on GitHub.",
        keywords: ["Kotlin Android", "Jetpack Compose", "Firebase", "layered architecture", "encrypted credentials"],
        schemaType: "SoftwareSourceCode",
        imageAlt: "Layered Kotlin architecture of the TechWizards Android application"
      },
      de: {
        slug: "techwizards-android-app-schichtenarchitektur",
        title: "TechWizards: Android-App mit Schichtenarchitektur",
        type: "Kotlin und Mobile-Architektur",
        summary: "Android-App mit Use Cases, Authentifizierung, verschlüsselten Zugangsdaten, Persistenz und klaren Schichtgrenzen.",
        problem: "Authentifizierung, UI, Einstellungen, Spielhistorie und Regeln bei wachsendem Funktionsumfang entkoppelt halten.",
        solution: "Kotlin-Code in Core-, Use-Case-, Daten- und UI-Schichten mit Firebase, Jetpack Compose und verschlüsseltem Credential Store.",
        technicalRole: "Architekturentwurf, Kotlin-Implementierung, Identity- und Persistenzintegration sowie Code-Dokumentation.",
        businessValue: "Die öffentliche Struktur macht Verantwortlichkeiten auffindbar, Abhängigkeiten austauschbar und Abläufe testbar.",
        evidenceSummary: "Der öffentliche Baum enthält Use Cases, ServiceLocator, SessionManager, EncryptedCredentialsStore, SQL und instrumentierte Tests.",
        caution: "Dies ist akademische Engineering-Evidenz, kein veröffentlichtes Mobile-Produkt und kein Industriesystem.",
        seoTitle: "Android-App mit Kotlin und Firebase | IoCode",
        seoDescription: "Android-Fallstudie mit Kotlin, Jetpack Compose, Firebase, verschlüsselten Zugangsdaten, Use Cases und prüfbarer Schichtenarchitektur.",
        keywords: ["Kotlin Android", "Jetpack Compose", "Firebase", "Schichtenarchitektur", "verschlüsselte Zugangsdaten"],
        schemaType: "SoftwareSourceCode",
        imageAlt: "Kotlin-Schichtenarchitektur der Android-Anwendung TechWizards"
      }
    }
  },
  {
    key: "hotelsol",
    repository: "HotelSOL",
    technologies: ["C#", ".NET", "Python", "Odoo 19", "SQL Server 2022", "PostgreSQL 16", "Docker Compose", "XML"],
    capabilities: ["erp-integration", "devsecops-docker", "database-design", "software-architecture"],
    claimLevel: "verified",
    featured: true,
    copy: {
      es: {
        slug: "hotelsol-integracion-odoo-dotnet",
        title: "HotelSOL: integración .NET, Odoo y datos",
        type: "ERP y arquitectura de integración",
        summary: "Entorno académico que conecta una API .NET, un módulo Odoo, SQL Server y PostgreSQL mediante Docker Compose.",
        problem: "Coordinar reservas, clientes, consumos y sincronización entre una aplicación de gestión y un ERP con persistencias diferentes.",
        solution: "Stack reproducible con SQL Server, PostgreSQL, Odoo 19, módulo Python, API C#, healthcheck y scripts de inicialización.",
        technicalRole: "Modelado, integración entre servicios, configuración de contenedores, exportación XML y pruebas del módulo Odoo.",
        businessValue: "El Compose público documenta cinco servicios coordinados y separa inicialización, persistencia y ejecución para reproducir el laboratorio.",
        evidenceSummary: "Repositorio con C#, Python, T-SQL, módulo Odoo, pruebas, XML, Dockerfiles y Compose público.",
        caution: "Caso académico; no representa operación hotelera real, datos de clientes ni un despliegue productivo.",
        seoTitle: "Integración .NET, Odoo y Docker | HotelSOL",
        seoDescription: "Caso ERP con API .NET, Odoo 19, Python, SQL Server, PostgreSQL, XML y Docker Compose para integración de datos hoteleros.",
        keywords: ["Odoo 19", ".NET API", "SQL Server", "PostgreSQL", "Docker Compose", "integración ERP"],
        schemaType: "SoftwareSourceCode",
        imageAlt: "Servicios Docker de HotelSOL con .NET, Odoo, SQL Server y PostgreSQL"
      },
      en: {
        slug: "hotelsol-odoo-dotnet-integration",
        title: "HotelSOL: .NET, Odoo and data integration",
        type: "ERP and integration architecture",
        summary: "Academic environment connecting a .NET API, an Odoo module, SQL Server and PostgreSQL through Docker Compose.",
        problem: "Coordinate bookings, guests, charges and synchronization between a management application and an ERP with separate data stores.",
        solution: "Reproducible stack with SQL Server, PostgreSQL, Odoo 19, a Python module, C# API, healthcheck and initialization scripts.",
        technicalRole: "Data modelling, service integration, container configuration, XML export and Odoo module testing.",
        businessValue: "The public Compose file coordinates five services and separates initialization, persistence and runtime for reproducible labs.",
        evidenceSummary: "Repository with C#, Python, T-SQL, an Odoo module, tests, XML, Dockerfiles and public Compose configuration.",
        caution: "Academic case; it does not represent real hotel operations, guest data or a production deployment.",
        seoTitle: ".NET, Odoo and Docker integration | HotelSOL",
        seoDescription: "ERP case with a .NET API, Odoo 19, Python, SQL Server, PostgreSQL, XML and Docker Compose for hotel data integration.",
        keywords: ["Odoo 19", ".NET API", "SQL Server", "PostgreSQL", "Docker Compose", "ERP integration"],
        schemaType: "SoftwareSourceCode",
        imageAlt: "HotelSOL Docker services with .NET, Odoo, SQL Server and PostgreSQL"
      },
      de: {
        slug: "hotelsol-odoo-dotnet-integration",
        title: "HotelSOL: .NET-, Odoo- und Datenintegration",
        type: "ERP- und Integrationsarchitektur",
        summary: "Akademische Umgebung mit .NET-API, Odoo-Modul, SQL Server und PostgreSQL unter Docker Compose.",
        problem: "Reservierungen, Gäste, Leistungen und Synchronisation zwischen Verwaltungsanwendung und ERP mit getrennten Datenspeichern koordinieren.",
        solution: "Reproduzierbarer Stack mit SQL Server, PostgreSQL, Odoo 19, Python-Modul, C#-API, Healthcheck und Initialisierungsskripten.",
        technicalRole: "Datenmodellierung, Service-Integration, Container-Konfiguration, XML-Export und Tests des Odoo-Moduls.",
        businessValue: "Die öffentliche Compose-Datei koordiniert fünf Services und trennt Initialisierung, Persistenz und Laufzeit.",
        evidenceSummary: "Repository mit C#, Python, T-SQL, Odoo-Modul, Tests, XML, Dockerfiles und Compose.",
        caution: "Akademische Fallstudie; keine reale Hoteloperation, keine Gästedaten und kein Produktiv-Deployment.",
        seoTitle: ".NET-, Odoo- und Docker-Integration | HotelSOL",
        seoDescription: "ERP-Fallstudie mit .NET-API, Odoo 19, Python, SQL Server, PostgreSQL, XML und Docker Compose für Hoteldatenintegration.",
        keywords: ["Odoo 19", ".NET API", "SQL Server", "PostgreSQL", "Docker Compose", "ERP-Integration"],
        schemaType: "SoftwareSourceCode",
        imageAlt: "HotelSOL-Docker-Services mit .NET, Odoo, SQL Server und PostgreSQL"
      }
    }
  },
  {
    key: "woodshops",
    repository: "AA5-FP056-_WoodShops",
    technologies: ["Java", "OOP", "HTML", "CSS", "JavaScript", "NetBeans"],
    capabilities: ["java-oop", "software-architecture"],
    claimLevel: "technical-demonstration",
    featured: false,
    copy: {
      es: {
        slug: "woodshops-modelo-dominio-java",
        title: "WoodShops: modelo de dominio comercial en Java",
        type: "Java y programación orientada a objetos",
        summary: "Modelo académico de tiendas, almacenes, productos, proveedores, clientes y ventas mediante clases Java especializadas.",
        problem: "Representar reglas y entidades de un comercio de madera sin concentrar inventario, clientes, proveedores y ventas en una única clase.",
        solution: "Dominio orientado a objetos con jerarquías para artículos y clientes, detalles de venta y gestores separados.",
        technicalRole: "Modelado de entidades, relaciones, herencia y operaciones de negocio en Java.",
        businessValue: "El árbol público contiene más de quince clases de dominio que hacen explícitas las responsabilidades del sistema.",
        evidenceSummary: "Código Java visible para Tienda, Almacén, Artículo, Producto, Proveedor, Cliente, Venta y DetalleVenta.",
        caution: "Ejercicio académico sin persistencia productiva ni métricas comerciales verificadas.",
        seoTitle: "Modelo de dominio Java OOP | WoodShops",
        seoDescription: "Caso Java OOP para tiendas, almacenes, productos, proveedores, clientes y ventas con responsabilidades de dominio separadas.",
        keywords: ["Java OOP", "modelo de dominio", "inventario", "ventas", "NetBeans"],
        schemaType: "SoftwareSourceCode",
        imageAlt: "Modelo de dominio Java de tiendas, productos, proveedores y ventas WoodShops"
      },
      en: {
        slug: "woodshops-java-domain-model",
        title: "WoodShops: Java commercial domain model",
        type: "Java and object-oriented programming",
        summary: "Academic model for stores, warehouses, products, suppliers, customers and sales using specialized Java classes.",
        problem: "Represent timber retail rules and entities without concentrating inventory, customers, suppliers and sales in one class.",
        solution: "Object-oriented domain with article and customer hierarchies, sales details and separate manager classes.",
        technicalRole: "Entity, relationship, inheritance and business-operation modelling in Java.",
        businessValue: "The public tree contains more than fifteen domain classes that make system responsibilities explicit.",
        evidenceSummary: "Visible Java code for Store, Warehouse, Article, Product, Supplier, Customer, Sale and SaleDetail entities.",
        caution: "Academic exercise without production persistence or verified commercial metrics.",
        seoTitle: "Java OOP domain model | WoodShops",
        seoDescription: "Java OOP case for stores, warehouses, products, suppliers, customers and sales with separated domain responsibilities.",
        keywords: ["Java OOP", "domain model", "inventory", "sales", "NetBeans"],
        schemaType: "SoftwareSourceCode",
        imageAlt: "WoodShops Java domain model for stores, products, suppliers and sales"
      },
      de: {
        slug: "woodshops-java-domaenenmodell",
        title: "WoodShops: Java-Domänenmodell für Handel",
        type: "Java und objektorientierte Programmierung",
        summary: "Akademisches Modell für Filialen, Lager, Produkte, Lieferanten, Kunden und Verkäufe mit spezialisierten Java-Klassen.",
        problem: "Regeln und Entitäten eines Holzhandels abbilden, ohne Bestand, Kunden, Lieferanten und Verkäufe in einer Klasse zu bündeln.",
        solution: "Objektorientierte Domäne mit Artikel- und Kundenhierarchien, Verkaufspositionen und getrennten Manager-Klassen.",
        technicalRole: "Modellierung von Entitäten, Beziehungen, Vererbung und Geschäftsoperationen in Java.",
        businessValue: "Der öffentliche Baum enthält mehr als fünfzehn Domänenklassen mit klar erkennbaren Verantwortlichkeiten.",
        evidenceSummary: "Java-Code für Filiale, Lager, Artikel, Produkt, Lieferant, Kunde, Verkauf und Verkaufsposition.",
        caution: "Akademische Übung ohne produktive Persistenz oder verifizierte Geschäftszahlen.",
        seoTitle: "Java-OOP-Domänenmodell | WoodShops",
        seoDescription: "Java-OOP-Fallstudie für Filialen, Lager, Produkte, Lieferanten, Kunden und Verkäufe mit getrennten Domänenverantwortungen.",
        keywords: ["Java OOP", "Domänenmodell", "Lagerbestand", "Verkauf", "NetBeans"],
        schemaType: "SoftwareSourceCode",
        imageAlt: "WoodShops Java-Domänenmodell für Filialen, Produkte, Lieferanten und Verkäufe"
      }
    }
  },
  {
    key: "vehicle-rental",
    repository: "AA2-FP056-_AlquilerVehiculos",
    technologies: ["Java", "OOP", "Inheritance", "Contracts", "NetBeans"],
    capabilities: ["java-oop", "software-architecture"],
    claimLevel: "technical-demonstration",
    featured: false,
    copy: {
      es: { slug: "alquiler-vehiculos-java-oop", title: "Alquiler de vehículos: Java OOP", type: "Modelado de flota y contratos", summary: "Aplicación académica que modela agencia, flota, clientes, contratos y varios tipos de vehículo.", problem: "Gestionar coches, motos y camiones con reglas comunes sin duplicar estructura ni lógica contractual.", solution: "Jerarquía Java de vehículos, clases de agencia, flota, cliente y contrato de alquiler.", technicalRole: "Diseño orientado a objetos, herencia, encapsulación y operaciones sobre flota y contratos.", businessValue: "El código público separa vehículos, clientes, flota y contratación en nueve clases identificables.", evidenceSummary: "Fuentes Java públicas para Agencia, Flota, Vehículo, Coche, Moto, Camión, Cliente y ContratoAlquiler.", caution: "Ejercicio académico; no es una plataforma operativa de alquiler.", seoTitle: "Gestión de flota con Java OOP | IoCode", seoDescription: "Caso Java OOP para agencia, flota, clientes, contratos, coches, motos y camiones mediante herencia y responsabilidades separadas.", keywords: ["Java OOP", "gestión de flota", "herencia", "contratos", "NetBeans"], schemaType: "SoftwareSourceCode", imageAlt: "Jerarquía Java de vehículos, flota y contratos de alquiler" },
      en: { slug: "vehicle-rental-java-oop", title: "Vehicle rental: Java OOP", type: "Fleet and contract modelling", summary: "Academic application modelling an agency, fleet, customers, rental contracts and several vehicle types.", problem: "Manage cars, motorcycles and trucks with shared rules without duplicating structure or contract logic.", solution: "Java vehicle hierarchy plus agency, fleet, customer and rental-contract classes.", technicalRole: "Object-oriented design, inheritance, encapsulation and fleet/contract operations.", businessValue: "The public code separates vehicles, customers, fleet and contracting into nine identifiable classes.", evidenceSummary: "Public Java sources for Agency, Fleet, Vehicle, Car, Motorcycle, Truck, Customer and RentalContract.", caution: "Academic exercise, not an operational vehicle-rental platform.", seoTitle: "Fleet management with Java OOP | IoCode", seoDescription: "Java OOP case for agencies, fleets, customers, contracts, cars, motorcycles and trucks using inheritance and separated responsibilities.", keywords: ["Java OOP", "fleet management", "inheritance", "contracts", "NetBeans"], schemaType: "SoftwareSourceCode", imageAlt: "Java hierarchy for vehicles, fleets and rental contracts" },
      de: { slug: "fahrzeugvermietung-java-oop", title: "Fahrzeugvermietung: Java OOP", type: "Flotten- und Vertragsmodellierung", summary: "Akademische Anwendung für Agentur, Flotte, Kunden, Mietverträge und unterschiedliche Fahrzeugtypen.", problem: "Pkw, Motorräder und Lkw mit gemeinsamen Regeln verwalten, ohne Struktur oder Vertragslogik zu duplizieren.", solution: "Java-Fahrzeughierarchie sowie Klassen für Agentur, Flotte, Kunde und Mietvertrag.", technicalRole: "Objektorientierter Entwurf, Vererbung, Kapselung und Operationen für Flotte und Verträge.", businessValue: "Der öffentliche Code trennt Fahrzeuge, Kunden, Flotte und Vermietung in neun erkennbare Klassen.", evidenceSummary: "Öffentliche Java-Quellen für Agentur, Flotte, Fahrzeug, Pkw, Motorrad, Lkw, Kunde und Mietvertrag.", caution: "Akademische Übung, keine operative Vermietungsplattform.", seoTitle: "Flottenverwaltung mit Java OOP | IoCode", seoDescription: "Java-OOP-Fallstudie für Agentur, Flotte, Kunden, Verträge, Pkw, Motorräder und Lkw mit Vererbung und klaren Verantwortungen.", keywords: ["Java OOP", "Flottenverwaltung", "Vererbung", "Mietverträge", "NetBeans"], schemaType: "SoftwareSourceCode", imageAlt: "Java-Hierarchie für Fahrzeuge, Flotte und Mietverträge" }
    }
  },
  {
    key: "the-javengers",
    repository: "The-Javengers---IntellJ",
    technologies: ["Java", "JavaFX", "JDBC", "DAO", "SQL", "JUnit", "Maven"],
    capabilities: ["java-oop", "database-design", "software-architecture"],
    claimLevel: "verified",
    featured: false,
    copy: {
      es: { slug: "the-javengers-javafx-dao", title: "The Javengers: JavaFX, JDBC y DAO", type: "Aplicación de escritorio con datos", summary: "Proyecto Java para socios, federaciones, excursiones e inscripciones con UI JavaFX y acceso DAO.", problem: "Mantener interfaz, reglas de dominio y persistencia SQL separadas en una aplicación de gestión de asociaciones.", solution: "Capas JavaFX, modelos, DAO/DAOImpl, JDBC, excepciones específicas, SQL y pruebas JUnit.", technicalRole: "Modelado, persistencia, controladores, gestión de escenas, validaciones y excepciones de dominio.", businessValue: "El repositorio permite rastrear operaciones desde controladores y escenas hasta interfaces DAO e implementaciones SQL.", evidenceSummary: "Árbol público con DAOFactory, cinco pares DAO/DAOImpl, excepciones de dominio, scripts SQL y fuentes JavaFX.", caution: "Proyecto académico colaborativo; no se atribuye autoría exclusiva ni uso productivo.", seoTitle: "JavaFX, JDBC y patrón DAO | The Javengers", seoDescription: "Caso Java de escritorio con JavaFX, JDBC, DAO, SQL, Maven, JUnit y excepciones de dominio para socios, excursiones e inscripciones.", keywords: ["JavaFX", "JDBC", "patrón DAO", "SQL", "Maven", "JUnit"], schemaType: "SoftwareSourceCode", imageAlt: "Arquitectura JavaFX, JDBC y DAO del proyecto The Javengers" },
      en: { slug: "the-javengers-javafx-dao", title: "The Javengers: JavaFX, JDBC and DAO", type: "Data-driven desktop application", summary: "Java project for members, federations, trips and registrations with a JavaFX UI and DAO persistence.", problem: "Keep UI, domain rules and SQL persistence separate in an association-management desktop application.", solution: "JavaFX, model, DAO/DAOImpl, JDBC, domain-exception, SQL and JUnit test layers.", technicalRole: "Modelling, persistence, controllers, scene management, validation and domain exceptions.", businessValue: "The repository makes operations traceable from controllers and scenes to DAO interfaces and SQL implementations.", evidenceSummary: "Public tree with DAOFactory, five DAO/DAOImpl pairs, domain exceptions, SQL scripts and JavaFX sources.", caution: "Collaborative academic project; exclusive authorship and production use are not claimed.", seoTitle: "JavaFX, JDBC and DAO pattern | The Javengers", seoDescription: "Java desktop case with JavaFX, JDBC, DAO, SQL, Maven, JUnit and domain exceptions for members, trips and registrations.", keywords: ["JavaFX", "JDBC", "DAO pattern", "SQL", "Maven", "JUnit"], schemaType: "SoftwareSourceCode", imageAlt: "JavaFX, JDBC and DAO architecture of The Javengers project" },
      de: { slug: "the-javengers-javafx-dao", title: "The Javengers: JavaFX, JDBC und DAO", type: "Datenbasierte Desktop-Anwendung", summary: "Java-Projekt für Mitglieder, Verbände, Ausflüge und Anmeldungen mit JavaFX-Oberfläche und DAO-Persistenz.", problem: "UI, Domänenregeln und SQL-Persistenz in einer Vereinsverwaltung voneinander trennen.", solution: "Schichten für JavaFX, Modelle, DAO/DAOImpl, JDBC, Domänenausnahmen, SQL und JUnit-Tests.", technicalRole: "Modellierung, Persistenz, Controller, Szenenverwaltung, Validierung und Domänenausnahmen.", businessValue: "Operationen sind vom Controller und der Szene bis zu DAO-Schnittstellen und SQL-Implementierungen nachvollziehbar.", evidenceSummary: "Öffentlicher Baum mit DAOFactory, fünf DAO/DAOImpl-Paaren, Domänenausnahmen, SQL-Skripten und JavaFX-Quellen.", caution: "Kollaboratives akademisches Projekt; keine Behauptung exklusiver Urheberschaft oder produktiver Nutzung.", seoTitle: "JavaFX, JDBC und DAO-Muster | The Javengers", seoDescription: "Java-Desktop-Fallstudie mit JavaFX, JDBC, DAO, SQL, Maven, JUnit und Domänenausnahmen für Mitglieder, Ausflüge und Anmeldungen.", keywords: ["JavaFX", "JDBC", "DAO-Muster", "SQL", "Maven", "JUnit"], schemaType: "SoftwareSourceCode", imageAlt: "JavaFX-, JDBC- und DAO-Architektur des Projekts The Javengers" }
    }
  },
  {
    key: "coworking-database",
    repository: "MySQL-Workbench-Forward-Engineering",
    technologies: ["MySQL Workbench", "SQL", "PL/SQL", "ER modelling", "Forward engineering"],
    capabilities: ["database-design"],
    claimLevel: "verified",
    featured: false,
    copy: {
      es: { slug: "base-datos-coworking-mysql", title: "Base de datos de coworking con MySQL", type: "Modelado relacional y forward engineering", summary: "Esquema académico para gestionar entidades y relaciones de un espacio de coworking mediante diseño relacional.", problem: "Convertir requisitos de gestión de coworking en tablas, claves y relaciones consistentes antes de implementar aplicaciones.", solution: "Diagrama entidad-relación, modelo físico y scripts generados mediante forward engineering.", technicalRole: "Normalización, diseño ER, definición de claves y generación del esquema físico.", businessValue: "El repositorio conserva el modelo, relaciones, claves foráneas y SQL para revisar la trazabilidad entre diseño lógico y físico.", evidenceSummary: "Descripción pública y artefactos de MySQL Workbench con SQL, tablas, claves foráneas y modelo relacional.", caution: "Ejercicio académico sin carga, volumen ni rendimiento productivo validados.", seoTitle: "MySQL Workbench y diseño relacional | IoCode", seoDescription: "Caso de modelado ER, claves, relaciones, SQL y forward engineering en MySQL Workbench para la gestión de un espacio de coworking.", keywords: ["MySQL Workbench", "modelo entidad-relación", "SQL", "claves foráneas", "forward engineering"], schemaType: "SoftwareSourceCode", imageAlt: "Modelo entidad-relación de una base de datos MySQL para coworking" },
      en: { slug: "mysql-coworking-database", title: "Coworking database with MySQL", type: "Relational modelling and forward engineering", summary: "Academic schema for managing coworking entities and relationships through relational design.", problem: "Translate coworking-management requirements into consistent tables, keys and relationships before application implementation.", solution: "Entity-relationship diagram, physical model and scripts generated through forward engineering.", technicalRole: "Normalization, ER design, key definition and physical-schema generation.", businessValue: "The repository preserves models, relationships, foreign keys and SQL for tracing logical design into a physical schema.", evidenceSummary: "Public description and MySQL Workbench artefacts with SQL, tables, foreign keys and relational models.", caution: "Academic exercise with no validated production load, volume or performance.", seoTitle: "MySQL Workbench relational design | IoCode", seoDescription: "ER modelling, keys, relationships, SQL and MySQL Workbench forward engineering case for coworking-space management.", keywords: ["MySQL Workbench", "entity relationship model", "SQL", "foreign keys", "forward engineering"], schemaType: "SoftwareSourceCode", imageAlt: "Entity-relationship model for a MySQL coworking database" },
      de: { slug: "mysql-coworking-datenbank", title: "Coworking-Datenbank mit MySQL", type: "Relationale Modellierung und Forward Engineering", summary: "Akademisches Schema für Entitäten und Beziehungen eines Coworking-Spaces mit relationalem Design.", problem: "Anforderungen der Coworking-Verwaltung vor der Applikationsentwicklung in konsistente Tabellen, Schlüssel und Beziehungen überführen.", solution: "Entity-Relationship-Diagramm, physisches Modell und per Forward Engineering erzeugte Skripte.", technicalRole: "Normalisierung, ER-Entwurf, Schlüsseldefinition und Generierung des physischen Schemas.", businessValue: "Repository mit Modellen, Beziehungen, Fremdschlüsseln und SQL zur Traceability vom logischen zum physischen Design.", evidenceSummary: "Öffentliche Beschreibung und MySQL-Workbench-Artefakte mit SQL, Tabellen, Fremdschlüsseln und relationalem Modell.", caution: "Akademische Übung ohne validierte Produktivlast, Datenmenge oder Performance.", seoTitle: "Relationales Design mit MySQL Workbench | IoCode", seoDescription: "ER-Modellierung, Schlüssel, Beziehungen, SQL und Forward Engineering in MySQL Workbench für die Verwaltung eines Coworking-Spaces.", keywords: ["MySQL Workbench", "Entity-Relationship-Modell", "SQL", "Fremdschlüssel", "Forward Engineering"], schemaType: "SoftwareSourceCode", imageAlt: "Entity-Relationship-Modell einer MySQL-Datenbank für Coworking" }
    }
  },
  {
    key: "break-boxes-game",
    repository: "JuegoRompeCajas",
    technologies: ["Python", "Pygame", "OOP", "Animation", "Scene management"],
    capabilities: ["python-development", "software-architecture"],
    claimLevel: "technical-demonstration",
    featured: false,
    copy: {
      es: { slug: "juego-python-rompecajas", title: "RompeCajas: juego modular en Python", type: "Python, escenas y animación", summary: "Juego pequeño estructurado con módulos separados para jugador, escenas, animaciones y gestión de color.", problem: "Evitar que bucle, estado del jugador, animaciones y representación visual queden mezclados en un único script.", solution: "Separación en módulos Python para Player, Scene, Animation y ColorManager coordinados desde el punto de entrada.", technicalRole: "Organización modular, lógica de interacción, escenas y animación con Python.", businessValue: "El repositorio demuestra descomposición funcional en seis fuentes Python en lugar de un script monolítico.", evidenceSummary: "Código público con main.py, Player.py, Scene.py, Animation.py y ColorManager.py.", caution: "Demostración formativa; no se presenta como videojuego publicado ni como aplicación móvil.", seoTitle: "Juego modular con Python y Pygame | IoCode", seoDescription: "Caso Python con Pygame, escenas, jugador, animaciones y gestión de color organizado en módulos pequeños y verificables.", keywords: ["Python", "Pygame", "scene management", "animación", "programación modular"], schemaType: "SoftwareSourceCode", imageAlt: "Módulos Python de escenas, jugador y animación del juego RompeCajas" },
      en: { slug: "python-break-boxes-game", title: "Break Boxes: modular Python game", type: "Python, scenes and animation", summary: "Small game structured into separate modules for player state, scenes, animations and colour management.", problem: "Avoid mixing the game loop, player state, animation and visual representation inside one script.", solution: "Separate Python modules for Player, Scene, Animation and ColorManager coordinated by the entry point.", technicalRole: "Modular organization, interaction logic, scenes and animation with Python.", businessValue: "The repository demonstrates functional decomposition across six Python sources instead of one monolithic script.", evidenceSummary: "Public code with main.py, Player.py, Scene.py, Animation.py and ColorManager.py.", caution: "Learning demonstration, not a published game or mobile application.", seoTitle: "Modular game with Python and Pygame | IoCode", seoDescription: "Python case with Pygame, scenes, player state, animations and colour management organized into small, verifiable modules.", keywords: ["Python", "Pygame", "scene management", "animation", "modular programming"], schemaType: "SoftwareSourceCode", imageAlt: "Python scene, player and animation modules in the Break Boxes game" },
      de: { slug: "python-spiel-kistenbrechen", title: "Kistenbrechen: modulares Python-Spiel", type: "Python, Szenen und Animation", summary: "Kleines Spiel mit getrennten Modulen für Spielerzustand, Szenen, Animationen und Farbverwaltung.", problem: "Game Loop, Spielerzustand, Animation und visuelle Darstellung nicht in einem Skript vermischen.", solution: "Getrennte Python-Module für Player, Scene, Animation und ColorManager, koordiniert durch den Einstiegspunkt.", technicalRole: "Modulare Organisation, Interaktionslogik, Szenen und Animation mit Python.", businessValue: "Das Repository belegt funktionale Zerlegung in sechs Python-Quellen statt eines monolithischen Skripts.", evidenceSummary: "Öffentlicher Code mit main.py, Player.py, Scene.py, Animation.py und ColorManager.py.", caution: "Lerndemonstration, kein veröffentlichtes Spiel und keine Mobile-Anwendung.", seoTitle: "Modulares Spiel mit Python und Pygame | IoCode", seoDescription: "Python-Fallstudie mit Pygame, Szenen, Spielerzustand, Animationen und Farbverwaltung in kleinen, prüfbaren Modulen.", keywords: ["Python", "Pygame", "Szenenverwaltung", "Animation", "modulare Programmierung"], schemaType: "SoftwareSourceCode", imageAlt: "Python-Module für Szenen, Spieler und Animation im Spiel Kistenbrechen" }
    }
  }
];

function createProject(seed: ProjectSeed, locale: Locale): Project {
  const copy = seed.copy[locale];
  return {
    ...copy,
    key: seed.key,
    path: `${projectBasePaths[locale]}${copy.slug}/`,
    technologies: seed.technologies,
    capabilities: seed.capabilities,
    evidenceLevel: "public-repository",
    claimLevel: seed.claimLevel,
    publicLinks: [{ label: "GitHub", href: `https://github.com/dadd86/${seed.repository}`, type: "repository", external: true }],
    featured: seed.featured,
    schemaType: "SoftwareSourceCode"
  };
}

export const projects: Record<Locale, Project[]> = {
  es: projectSeeds.map((seed) => createProject(seed, "es")),
  en: projectSeeds.map((seed) => createProject(seed, "en")),
  de: projectSeeds.map((seed) => createProject(seed, "de"))
};

export function getProjectByKey(key: ProjectKey, locale: Locale): Project {
  const project = projects[locale].find((candidate) => candidate.key === key);
  if (!project) throw new Error(`Unknown project key: ${key}`);
  return project;
}

export function getProjectAlternatePaths(key: ProjectKey): Record<Locale, string> {
  return {
    es: getProjectByKey(key, "es").path,
    en: getProjectByKey(key, "en").path,
    de: getProjectByKey(key, "de").path
  };
}

export function getProjectStaticPaths() {
  return projectSeeds.flatMap((seed) =>
    (["es", "en", "de"] as Locale[]).map((locale) => {
      const project = getProjectByKey(seed.key, locale);
      return {
        params: {
          locale,
          section: projectBasePaths[locale].split("/").filter(Boolean)[1],
          project: project.slug
        },
        props: { locale, project }
      };
    })
  );
}
