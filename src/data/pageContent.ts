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
      title: "IoCode SOLUTIONS | Software, automatizacion y robotica",
      description: "IoCode SOLUTIONS desarrolla soluciones de software, automatizacion PLC, robotica industrial e Industria 4.0.",
      eyebrow: "IoCode SOLUTIONS · Ingenieria digital",
      heading: "Software, automatizacion y robotica para procesos industriales mas inteligentes.",
      intro: "Automatizacion industrial, robotica, PLC, comunicaciones industriales y desarrollo software unidos en soluciones para Industria 4.0, datos y aplicaciones profesionales.",
      cards: [
        { title: "PLC y control industrial", text: "Programacion, diagnostico y optimizacion de sistemas PLC y HMI." },
        { title: "Robotica industrial", text: "Integracion, ajuste y diagnostico de robots y sistemas de manipulacion." },
        { title: "Software y datos", text: "Aplicaciones, bases de datos e interfaces para conectar maquinas, datos y usuarios." }
      ]
    },
    services: {
      title: "Servicios | IoCode SOLUTIONS",
      description: "Servicios de desarrollo web, automatizacion PLC, robotica industrial, backend, datos e Industria 4.0.",
      eyebrow: "Servicios",
      heading: "Soluciones digitales para negocios y proyectos tecnicos.",
      intro: "Construccion de software modular, mantenible y orientado a resolver problemas concretos.",
      cards: [
        { title: "Automatizacion PLC", text: "Programacion, diagnostico y optimizacion de sistemas PLC, HMI y comunicaciones industriales.", items: ["Siemens", "Omron", "Rockwell", "Beckhoff", "OPC UA", "EtherCAT", "Profinet"] },
        { title: "Robotica industrial", text: "Diagnostico, ajuste, calibracion e integracion de robots industriales y sistemas de manipulacion.", items: ["Fanuc", "OMRON", "Staubli", "BRINK", "Wittmann"] },
        { title: "Desarrollo software", text: "Aplicaciones web, backend, bases de datos y herramientas tecnicas para entornos industriales.", items: ["C++", "C#", "Python", "Java", "Kotlin", ".NET", "MySQL"] },
        { title: "Industria 4.0 e IoT", text: "Conexion entre sensores, actuadores, datos y aplicaciones para monitorizacion y trazabilidad.", items: ["IoT", "Datos industriales", "Monitorizacion", "Trazabilidad"] }
      ]
    },
    plc: {
      title: "Automatizacion PLC | IoCode SOLUTIONS",
      description: "Programacion PLC, HMI, comunicaciones industriales e Industria 4.0.",
      eyebrow: "Automatizacion PLC",
      heading: "Control industrial, diagnostico, HMI y comunicacion entre sistemas.",
      intro: "Experiencia en programacion y optimizacion de sistemas PLC para entornos industriales.",
      cards: [
        { title: "Programacion PLC", text: "Desarrollo, modificacion y depuracion de logica de control industrial.", items: ["TIA Portal", "Step7", "WinCC", "Sysmac Studio", "CX-One", "Studio 5000", "TwinCAT"] },
        { title: "HMI y diagnostico", text: "Pantallas y logicas de diagnostico para mejorar visibilidad y reducir paradas.", items: ["Alarmas", "Estados", "Diagnostico", "SCADA", "WinCC"] },
        { title: "Comunicaciones industriales", text: "Integracion de sistemas mediante protocolos industriales.", items: ["OPC UA", "EtherCAT", "Profinet", "Modbus", "TCP/IP"] }
      ]
    },
    robotics: {
      title: "Robotica industrial | IoCode SOLUTIONS",
      description: "Robotica industrial, sistemas de manipulacion, paletizacion y diagnostico.",
      eyebrow: "Robotica industrial",
      heading: "Programacion, ajuste, diagnostico y optimizacion de sistemas roboticos.",
      intro: "Experiencia en robots industriales, manipulacion, paletizacion, diagnostico y ajuste de movimiento.",
      cards: [
        { title: "Robots industriales", text: "Trabajo con robots y sistemas de manipulacion en produccion.", items: ["Fanuc", "OMRON", "Staubli", "BRINK", "Wittmann"] },
        { title: "Diagnostico y recuperacion", text: "Analisis de fallos y recuperacion operativa para reducir paradas.", items: ["Averias", "Puesta en marcha", "Soporte tecnico", "Mantenimiento"] },
        { title: "Movimiento y calibracion", text: "Ajuste de parametros para mejorar precision, repetibilidad y calidad.", items: ["Paletizacion", "Manipulacion", "Robots de 3 ejes", "Robots de 6 ejes"] }
      ]
    },
    projects: {
      title: "Proyectos | IoCode SOLUTIONS",
      description: "Proyectos seleccionados de IoCode SOLUTIONS.",
      eyebrow: "Proyectos",
      heading: "Proyectos seleccionados por valor profesional, no por cantidad.",
      intro: "El portafolio prioriza evidencia tecnica, claridad, madurez y posibilidad de explicacion publica."
    },
    skills: {
      title: "Habilidades | IoCode SOLUTIONS",
      description: "Habilidades tecnicas en PLC, robotica, Industria 4.0, software y datos.",
      eyebrow: "Habilidades tecnicas",
      heading: "Automatizacion industrial, robotica y desarrollo software en un mismo perfil.",
      intro: "Experiencia real en PLC, HMI, robotica, comunicaciones industriales e Industria 4.0 con desarrollo de aplicaciones y bases de datos."
    },
    process: {
      title: "Proceso | IoCode SOLUTIONS",
      description: "Proceso de trabajo para proyectos tecnicos.",
      eyebrow: "Proceso",
      heading: "Trabajo por etapas, con claridad tecnica y control del alcance.",
      intro: "Un buen proyecto empieza entendiendo el problema, los riesgos y los criterios de aceptacion.",
      cards: [
        { title: "Diagnostico", text: "Objetivos, usuarios, datos, restricciones, riesgos y alcance real." },
        { title: "Propuesta tecnica", text: "Arquitectura, entregables, tecnologias, fases y criterios de aceptacion." },
        { title: "Desarrollo modular", text: "Construccion por partes pequenas, mantenibles y revisables." },
        { title: "Validacion", text: "Pruebas manuales, responsive, accesibilidad basica, enlaces y errores." }
      ]
    },
    contact: {
      title: "Contacto | IoCode SOLUTIONS",
      description: "Contacto profesional con IoCode SOLUTIONS.",
      eyebrow: "Contacto",
      heading: "Hablemos de tu proyecto.",
      intro: "El sitio actual es estatico. El formulario prepara un correo en tu cliente de email; no envia datos a un servidor."
    }
  },
  en: {
    home: { title: "IoCode SOLUTIONS | Software, automation and robotics", description: "IoCode SOLUTIONS builds software, PLC automation, industrial robotics and Industry 4.0 solutions.", eyebrow: "IoCode SOLUTIONS · Digital engineering", heading: "Software, automation and robotics for smarter industrial processes.", intro: "Industrial automation, robotics, PLC, industrial communications and software development combined into professional Industry 4.0, data and application solutions.", cards: [ { title: "PLC and industrial control", text: "Programming, diagnostics and optimization of PLC and HMI systems." }, { title: "Industrial robotics", text: "Integration, adjustment and diagnostics of robots and handling systems." }, { title: "Software and data", text: "Applications, databases and interfaces that connect machines, data and users." } ] },
    services: { title: "Services | IoCode SOLUTIONS", description: "Web development, PLC automation, industrial robotics, backend, data and Industry 4.0 services.", eyebrow: "Services", heading: "Digital solutions for businesses and technical projects.", intro: "Modular and maintainable software focused on solving real problems.", cards: [ { title: "PLC automation", text: "Programming, diagnostics and optimization of PLC, HMI and industrial communication systems.", items: ["Siemens", "Omron", "Rockwell", "Beckhoff", "OPC UA", "EtherCAT", "Profinet"] }, { title: "Industrial robotics", text: "Diagnostics, adjustment, calibration and integration of industrial robots and handling systems.", items: ["Fanuc", "OMRON", "Staubli", "BRINK", "Wittmann"] }, { title: "Software development", text: "Web applications, backend, databases and technical tools for industrial environments.", items: ["C++", "C#", "Python", "Java", "Kotlin", ".NET", "MySQL"] }, { title: "Industry 4.0 and IoT", text: "Connection between sensors, actuators, data and applications for monitoring and traceability.", items: ["IoT", "Industrial data", "Monitoring", "Traceability"] } ] },
    plc: { title: "PLC Automation | IoCode SOLUTIONS", description: "PLC programming, HMI, industrial communications and Industry 4.0.", eyebrow: "PLC automation", heading: "Industrial control, diagnostics, HMI and communication between systems.", intro: "Experience programming and optimizing PLC systems for industrial environments.", cards: [ { title: "PLC programming", text: "Development, modification and debugging of industrial control logic.", items: ["TIA Portal", "Step7", "WinCC", "Sysmac Studio", "CX-One", "Studio 5000", "TwinCAT"] }, { title: "HMI and diagnostics", text: "Screens and diagnostic logic to improve visibility and reduce downtime.", items: ["Alarms", "States", "Diagnostics", "SCADA", "WinCC"] }, { title: "Industrial communications", text: "Integration of systems through industrial protocols.", items: ["OPC UA", "EtherCAT", "Profinet", "Modbus", "TCP/IP"] } ] },
    robotics: { title: "Industrial Robotics | IoCode SOLUTIONS", description: "Industrial robotics, handling systems, palletizing and diagnostics.", eyebrow: "Industrial robotics", heading: "Programming, adjustment, diagnostics and optimization of robotic systems.", intro: "Experience with industrial robots, handling, palletizing, diagnostics and motion adjustment.", cards: [ { title: "Industrial robots", text: "Work with robots and handling systems in production.", items: ["Fanuc", "OMRON", "Staubli", "BRINK", "Wittmann"] }, { title: "Diagnostics and recovery", text: "Fault analysis and operational recovery to reduce downtime.", items: ["Faults", "Commissioning", "Technical support", "Maintenance"] }, { title: "Motion and calibration", text: "Parameter adjustment to improve precision, repeatability and quality.", items: ["Palletizing", "Handling", "3-axis robots", "6-axis robots"] } ] },
    projects: { title: "Projects | IoCode SOLUTIONS", description: "Selected IoCode SOLUTIONS projects.", eyebrow: "Projects", heading: "Projects selected for professional value, not quantity.", intro: "The portfolio prioritizes technical evidence, clarity, maturity and public explainability." },
    skills: { title: "Skills | IoCode SOLUTIONS", description: "Technical skills in PLC, robotics, Industry 4.0, software and data.", eyebrow: "Technical skills", heading: "Industrial automation, robotics and software development in one profile.", intro: "Real experience in PLC, HMI, robotics, industrial communications and Industry 4.0 with application and database development." },
    process: { title: "Process | IoCode SOLUTIONS", description: "Work process for technical projects.", eyebrow: "Process", heading: "Work in stages, with technical clarity and scope control.", intro: "A good project starts by understanding the problem, risks and acceptance criteria.", cards: [ { title: "Diagnosis", text: "Objectives, users, data, constraints, risks and real scope." }, { title: "Technical proposal", text: "Architecture, deliverables, technologies, phases and acceptance criteria." }, { title: "Modular development", text: "Construction in small, maintainable and reviewable parts." }, { title: "Validation", text: "Manual tests, responsive review, basic accessibility, links and errors." } ] },
    contact: { title: "Contact | IoCode SOLUTIONS", description: "Professional contact with IoCode SOLUTIONS.", eyebrow: "Contact", heading: "Let's talk about your project.", intro: "The current site is static. The form prepares an email in your email client; it does not send data to a server." }
  },
  de: {
    home: { title: "IoCode SOLUTIONS | Software, Automatisierung und Robotik", description: "IoCode SOLUTIONS entwickelt Software, SPS-Automatisierung, Industrierobotik und Industrie-4.0-Loesungen.", eyebrow: "IoCode SOLUTIONS · Digitale Technik", heading: "Software, Automatisierung und Robotik fuer intelligentere Industrieprozesse.", intro: "Industrielle Automatisierung, Robotik, SPS, industrielle Kommunikation und Softwareentwicklung kombiniert in professionellen Loesungen fuer Industrie 4.0, Daten und Anwendungen.", cards: [ { title: "SPS und industrielle Steuerung", text: "Programmierung, Diagnose und Optimierung von SPS- und HMI-Systemen." }, { title: "Industrierobotik", text: "Integration, Einstellung und Diagnose von Robotern und Handlingsystemen." }, { title: "Software und Daten", text: "Anwendungen, Datenbanken und Schnittstellen, die Maschinen, Daten und Benutzer verbinden." } ] },
    services: { title: "Leistungen | IoCode SOLUTIONS", description: "Webentwicklung, SPS-Automatisierung, Industrierobotik, Backend, Daten und Industrie 4.0.", eyebrow: "Leistungen", heading: "Digitale Loesungen fuer Unternehmen und technische Projekte.", intro: "Modulare und wartbare Software zur Loesung konkreter Probleme.", cards: [ { title: "SPS-Automatisierung", text: "Programmierung, Diagnose und Optimierung von SPS-, HMI- und industriellen Kommunikationssystemen.", items: ["Siemens", "Omron", "Rockwell", "Beckhoff", "OPC UA", "EtherCAT", "Profinet"] }, { title: "Industrierobotik", text: "Diagnose, Einstellung, Kalibrierung und Integration von Industrierobotern und Handlingsystemen.", items: ["Fanuc", "OMRON", "Staubli", "BRINK", "Wittmann"] }, { title: "Softwareentwicklung", text: "Webanwendungen, Backend, Datenbanken und technische Werkzeuge fuer industrielle Umgebungen.", items: ["C++", "C#", "Python", "Java", "Kotlin", ".NET", "MySQL"] }, { title: "Industrie 4.0 und IoT", text: "Verbindung von Sensoren, Aktoren, Daten und Anwendungen fuer Monitoring und Rueckverfolgbarkeit.", items: ["IoT", "Industriedaten", "Monitoring", "Traceability"] } ] },
    plc: { title: "SPS-Automatisierung | IoCode SOLUTIONS", description: "SPS-Programmierung, HMI, industrielle Kommunikation und Industrie 4.0.", eyebrow: "SPS-Automatisierung", heading: "Industrielle Steuerung, Diagnose, HMI und Kommunikation zwischen Systemen.", intro: "Erfahrung in der Programmierung und Optimierung von SPS-Systemen fuer industrielle Umgebungen.", cards: [ { title: "SPS-Programmierung", text: "Entwicklung, Aenderung und Fehlersuche von industrieller Steuerungslogik.", items: ["TIA Portal", "Step7", "WinCC", "Sysmac Studio", "CX-One", "Studio 5000", "TwinCAT"] }, { title: "HMI und Diagnose", text: "Bedienoberflaechen und Diagnoselogik fuer bessere Sichtbarkeit und weniger Stillstand.", items: ["Alarme", "Zustaende", "Diagnose", "SCADA", "WinCC"] }, { title: "Industrielle Kommunikation", text: "Integration von Systemen ueber industrielle Protokolle.", items: ["OPC UA", "EtherCAT", "Profinet", "Modbus", "TCP/IP"] } ] },
    robotics: { title: "Industrierobotik | IoCode SOLUTIONS", description: "Industrierobotik, Handlingsysteme, Palettierung und Diagnose.", eyebrow: "Industrierobotik", heading: "Programmierung, Einstellung, Diagnose und Optimierung von Robotersystemen.", intro: "Erfahrung mit Industrierobotern, Handling, Palettierung, Diagnose und Bewegungseinstellung.", cards: [ { title: "Industrieroboter", text: "Arbeit mit Robotern und Handlingsystemen in der Produktion.", items: ["Fanuc", "OMRON", "Staubli", "BRINK", "Wittmann"] }, { title: "Diagnose und Wiederherstellung", text: "Fehleranalyse und operative Wiederherstellung zur Reduzierung von Stillstand.", items: ["Fehler", "Inbetriebnahme", "Technischer Support", "Wartung"] }, { title: "Motion und Kalibrierung", text: "Parametereinstellung fuer Praezision, Wiederholbarkeit und Qualitaet.", items: ["Palettierung", "Handling", "3-Achs-Roboter", "6-Achs-Roboter"] } ] },
    projects: { title: "Projekte | IoCode SOLUTIONS", description: "Ausgewaehlte Projekte von IoCode SOLUTIONS.", eyebrow: "Projekte", heading: "Projekte nach professionellem Wert ausgewaehlt, nicht nach Menge.", intro: "Das Portfolio priorisiert technische Nachweise, Klarheit, Reife und oeffentliche Erklaerbarkeit." },
    skills: { title: "Faehigkeiten | IoCode SOLUTIONS", description: "Technische Faehigkeiten in SPS, Robotik, Industrie 4.0, Software und Daten.", eyebrow: "Technische Faehigkeiten", heading: "Industrielle Automatisierung, Robotik und Softwareentwicklung in einem Profil.", intro: "Praktische Erfahrung in SPS, HMI, Robotik, industrieller Kommunikation und Industrie 4.0 mit Anwendungs- und Datenbankentwicklung." },
    process: { title: "Prozess | IoCode SOLUTIONS", description: "Arbeitsprozess fuer technische Projekte.", eyebrow: "Prozess", heading: "Arbeiten in Etappen, mit technischer Klarheit und kontrolliertem Umfang.", intro: "Ein gutes Projekt beginnt mit dem Verstaendnis des Problems, der Risiken und der Akzeptanzkriterien.", cards: [ { title: "Analyse", text: "Ziele, Benutzer, Daten, Einschraenkungen, Risiken und realer Umfang." }, { title: "Technischer Vorschlag", text: "Architektur, Ergebnisse, Technologien, Phasen und Akzeptanzkriterien." }, { title: "Modulare Entwicklung", text: "Entwicklung in kleinen, wartbaren und pruefbaren Teilen." }, { title: "Validierung", text: "Manuelle Tests, responsive Pruefung, grundlegende Barrierefreiheit, Links und Fehler." } ] },
    contact: { title: "Kontakt | IoCode SOLUTIONS", description: "Professioneller Kontakt mit IoCode SOLUTIONS.", eyebrow: "Kontakt", heading: "Sprechen wir ueber dein Projekt.", intro: "Die aktuelle Website ist statisch. Das Formular erstellt eine E-Mail im E-Mail-Client; es sendet keine Daten an einen Server." }
  }
};
