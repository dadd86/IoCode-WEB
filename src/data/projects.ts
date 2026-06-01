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
    { title: "TechWizards", type: "Aplicacion Android", summary: "App Android documentada con arquitectura por capas, persistencia local y separacion de responsabilidades.", value: "Muestra capacidad para estructurar una app movil mantenible con Kotlin, Room, DataStore y Compose.", caution: "Presentar como proyecto tecnico en evolucion, no como producto final validado.", technologies: ["Kotlin", "Android", "Room", "DataStore", "Jetpack Compose"], githubUrl: "https://github.com/dadd86/TechWizards" },
    { title: "NeuronaPrediccion", type: "Caso privado de datos y ML", summary: "Caso privado orientado a arquitectura de datos, YAML, SQL, DAO y componentes de analisis.", value: "Util para explicar modelado, trazabilidad, datos y separacion de capas.", caution: "No enlazar repositorio privado ni prometer precision predictiva sin metricas reproducibles.", technologies: ["Python", "SQL", "YAML", "DAO", "ML"] },
    { title: "MacetaInteligente", type: "Caso privado IoT", summary: "Caso privado de automatizacion e IoT con integracion de sensores y datos fisicos.", value: "Refuerza el perfil hibrido entre automatizacion, datos y software.", caution: "Publicar solo descripcion general o demo controlada.", technologies: ["IoT", "Sensores", "Automatizacion", "Python", "SQL"] },
    { title: "HotelSOL", type: "Sistema .NET", summary: "Sistema con API, MVC, SQL Server, integraciones y documentacion tecnica.", value: "Refuerza backend, datos e integracion de sistemas.", caution: "No destacar sin revisar documentacion sensible y credenciales de ejemplo.", technologies: [".NET", "ASP.NET", "SQL Server", "JWT", "Swagger"], githubUrl: "https://github.com/dadd86/HotelSOL" }
  ],
  en: [
    { title: "TechWizards", type: "Android application", summary: "Documented Android app with layered architecture, local persistence and separation of responsibilities.", value: "Shows ability to structure a maintainable mobile app with Kotlin, Room, DataStore and Compose.", caution: "Present as a technical project in progress, not as a validated final product.", technologies: ["Kotlin", "Android", "Room", "DataStore", "Jetpack Compose"], githubUrl: "https://github.com/dadd86/TechWizards" },
    { title: "NeuronaPrediccion", type: "Private data and ML case", summary: "Private case focused on data architecture, YAML, SQL, DAO and analysis components.", value: "Useful to explain modeling, traceability, data and layered separation.", caution: "Do not link a private repository or promise predictive accuracy without reproducible metrics.", technologies: ["Python", "SQL", "YAML", "DAO", "ML"] },
    { title: "MacetaInteligente", type: "Private IoT case", summary: "Private automation and IoT case with sensor and physical data integration.", value: "Strengthens the hybrid profile between automation, data and software.", caution: "Publish only a general description or controlled demo.", technologies: ["IoT", "Sensors", "Automation", "Python", "SQL"] },
    { title: "HotelSOL", type: ".NET system", summary: "System with API, MVC, SQL Server, integrations and technical documentation.", value: "Strengthens backend, data and system integration.", caution: "Do not highlight without reviewing sensitive documentation and sample credentials.", technologies: [".NET", "ASP.NET", "SQL Server", "JWT", "Swagger"], githubUrl: "https://github.com/dadd86/HotelSOL" }
  ],
  de: [
    { title: "TechWizards", type: "Android-Anwendung", summary: "Dokumentierte Android-App mit Schichtenarchitektur, lokaler Persistenz und klarer Trennung der Verantwortlichkeiten.", value: "Zeigt die Faehigkeit, eine wartbare mobile App mit Kotlin, Room, DataStore und Compose zu strukturieren.", caution: "Als technisches Projekt in Entwicklung darstellen, nicht als validiertes Endprodukt.", technologies: ["Kotlin", "Android", "Room", "DataStore", "Jetpack Compose"], githubUrl: "https://github.com/dadd86/TechWizards" },
    { title: "NeuronaPrediccion", type: "Privater Daten- und ML-Fall", summary: "Privater Fall mit Fokus auf Datenarchitektur, YAML, SQL, DAO und Analysekomponenten.", value: "Nuetzlich zur Erklaerung von Modellierung, Traceability, Daten und Schichtentrennung.", caution: "Kein privates Repository verlinken und keine Prognosegenauigkeit ohne reproduzierbare Metriken versprechen.", technologies: ["Python", "SQL", "YAML", "DAO", "ML"] },
    { title: "MacetaInteligente", type: "Privater IoT-Fall", summary: "Privater Automatisierungs- und IoT-Fall mit Sensor- und Prozessdatenintegration.", value: "Staerkt das hybride Profil zwischen Automatisierung, Daten und Software.", caution: "Nur allgemeine Beschreibung oder kontrollierte Demo veroeffentlichen.", technologies: ["IoT", "Sensoren", "Automatisierung", "Python", "SQL"] },
    { title: "HotelSOL", type: ".NET-System", summary: "System mit API, MVC, SQL Server, Integrationen und technischer Dokumentation.", value: "Staerkt Backend, Daten und Systemintegration.", caution: "Nicht hervorheben, bevor sensible Dokumentation und Beispielzugangsdaten geprueft wurden.", technologies: [".NET", "ASP.NET", "SQL Server", "JWT", "Swagger"], githubUrl: "https://github.com/dadd86/HotelSOL" }
  ]
};
