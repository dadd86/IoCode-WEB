import type { Locale } from "../i18n/config";

export type Project = {
  title: string;
  type: string;
  summary: string;
  value: string;
  caution?: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
};

export const projects: Record<Locale, Project[]> = {
  es: [
    {
      title: "TechWizards",
      type: "Aplicación Android",
      summary: "Aplicación Android documentada con arquitectura por capas, persistencia local y separación de responsabilidades.",
      value: "Muestra capacidad para estructurar una aplicación móvil mantenible con Kotlin, Firebase, Compose y arquitectura modular.",
      caution: "Proyecto técnico presentado como caso de aprendizaje aplicado, no como producto comercial validado.",
      technologies: ["Kotlin", "Android", "Firebase", "Jetpack Compose", "Arquitectura por capas"]
    },
    {
      title: "NeuronaPrediccion",
      type: "Caso privado de datos y ML",
      summary: "Caso privado orientado a arquitectura de datos, YAML, SQL, DAO y componentes de análisis.",
      value: "Útil para explicar modelado, trazabilidad, datos y separación de capas.",
      caution: "No enlazar repositorio privado ni prometer precisión predictiva sin métricas reproducibles.",
      technologies: ["Python", "SQL", "YAML", "DAO", "ML"]
    },
    {
      title: "MacetaInteligente",
      type: "Caso privado IoT",
      summary: "Caso privado de automatización e IoT con integración de sensores y datos físicos.",
      value: "Refuerza el perfil híbrido entre automatización, datos y software.",
      caution: "Publicar solo descripción general o demo controlada.",
      technologies: ["IoT", "Sensores", "Automatización", "Python", "SQL"]
    },
    {
      title: "HotelSOL",
      type: "Sistema .NET / ERP",
      summary: "Aplicación de gestión con .NET, SQL Server, XML, documentación técnica e integración ERP.",
      value: "Refuerza backend, datos, ERP, documentación e integración de sistemas.",
      caution: "No publicar código ni documentación sensible sin revisión previa.",
      technologies: [".NET", "SQL Server", "XML", "Odoo ERP", "Python", "UML"]
    }
  ],
  en: [
    {
      title: "TechWizards",
      type: "Android application",
      summary: "Documented Android application with layered architecture, local persistence and separation of responsibilities.",
      value: "Shows the ability to structure a maintainable mobile application with Kotlin, Firebase, Compose and modular architecture.",
      caution: "Technical project presented as applied learning, not as a validated commercial product.",
      technologies: ["Kotlin", "Android", "Firebase", "Jetpack Compose", "Layered architecture"]
    },
    {
      title: "NeuronaPrediccion",
      type: "Private data and ML case",
      summary: "Private case focused on data architecture, YAML, SQL, DAO and analysis components.",
      value: "Useful to explain modeling, traceability, data and layered separation.",
      caution: "Do not link a private repository or promise predictive accuracy without reproducible metrics.",
      technologies: ["Python", "SQL", "YAML", "DAO", "ML"]
    },
    {
      title: "MacetaInteligente",
      type: "Private IoT case",
      summary: "Private automation and IoT case with sensor and physical data integration.",
      value: "Strengthens the hybrid profile between automation, data and software.",
      caution: "Publish only a general description or controlled demo.",
      technologies: ["IoT", "Sensors", "Automation", "Python", "SQL"]
    },
    {
      title: "HotelSOL",
      type: ".NET / ERP system",
      summary: "Management application with .NET, SQL Server, XML, technical documentation and ERP integration.",
      value: "Strengthens backend, data, ERP, documentation and system integration.",
      caution: "Do not publish code or sensitive documentation without prior review.",
      technologies: [".NET", "SQL Server", "XML", "Odoo ERP", "Python", "UML"]
    }
  ],
  de: [
    {
      title: "TechWizards",
      type: "Android-Anwendung",
      summary: "Dokumentierte Android-Anwendung mit Schichtenarchitektur, lokaler Persistenz und klarer Trennung der Verantwortlichkeiten.",
      value: "Zeigt die Fähigkeit, eine wartbare mobile Anwendung mit Kotlin, Firebase, Compose und modularer Architektur zu strukturieren.",
      caution: "Technisches Projekt als angewandtes Lernen, nicht als validiertes kommerzielles Produkt.",
      technologies: ["Kotlin", "Android", "Firebase", "Jetpack Compose", "Schichtenarchitektur"]
    },
    {
      title: "NeuronaPrediccion",
      type: "Privater Daten- und ML-Fall",
      summary: "Privater Fall mit Fokus auf Datenarchitektur, YAML, SQL, DAO und Analysekomponenten.",
      value: "Nützlich zur Erklärung von Modellierung, Traceability, Daten und Schichtentrennung.",
      caution: "Kein privates Repository verlinken und keine Prognosegenauigkeit ohne reproduzierbare Metriken versprechen.",
      technologies: ["Python", "SQL", "YAML", "DAO", "ML"]
    },
    {
      title: "MacetaInteligente",
      type: "Privater IoT-Fall",
      summary: "Privater Automatisierungs- und IoT-Fall mit Sensor- und Prozessdatenintegration.",
      value: "Stärkt das hybride Profil zwischen Automatisierung, Daten und Software.",
      caution: "Nur allgemeine Beschreibung oder kontrollierte Demo veröffentlichen.",
      technologies: ["IoT", "Sensoren", "Automatisierung", "Python", "SQL"]
    },
    {
      title: "HotelSOL",
      type: ".NET / ERP-System",
      summary: "Management-Anwendung mit .NET, SQL Server, XML, technischer Dokumentation und ERP-Integration.",
      value: "Stärkt Backend, Daten, ERP, Dokumentation und Systemintegration.",
      caution: "Code oder sensible Dokumentation nicht ohne vorherige Prüfung veröffentlichen.",
      technologies: [".NET", "SQL Server", "XML", "Odoo ERP", "Python", "UML"]
    }
  ]
};