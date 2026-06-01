import type { Locale } from "../i18n/config";

export type SkillGroup = {
  title: string;
  text: string;
  items: string[];
};

export const skillGroups: Record<Locale, SkillGroup[]> = {
  es: [
    { title: "Programacion PLC y automatizacion", text: "Desarrollo, modificacion, diagnostico y optimizacion de logica de control industrial.", items: ["Siemens TIA Portal", "Step7", "WinCC", "Omron Sysmac Studio", "CX-One", "Rockwell Studio 5000", "Beckhoff TwinCAT", "Motion Control"] },
    { title: "Robotica industrial", text: "Programacion, ajuste, calibracion y diagnostico de robots y sistemas de manipulacion.", items: ["Fanuc", "OMRON", "Staubli", "BRINK", "Wittmann", "Robots de 3 ejes", "Robots de 6 ejes"] },
    { title: "Comunicaciones industriales", text: "Integracion de sistemas industriales y conexion de equipos, datos y software.", items: ["OPC UA", "EtherCAT", "Profinet", "Modbus", "TCP/IP", "Integracion IoT"] },
    { title: "Desarrollo software", text: "Desarrollo de aplicaciones y herramientas con arquitectura mantenible.", items: ["C++", "C#", "Python", "Java", "Kotlin", ".NET", "OOP"] },
    { title: "Bases de datos y arquitectura", text: "Modelado, integracion y organizacion de software por capas.", items: ["MySQL", "PostgreSQL", "MVC", "MVVM", "Arquitectura en capas", "DAO"] },
    { title: "Herramientas", text: "Entornos tecnicos usados en software, automatizacion y mantenimiento.", items: ["Visual Studio", "VS Code", "Android Studio", "Eclipse", "IntelliJ IDEA", "GitHub", "Linux", "Docker basico"] }
  ],
  en: [
    { title: "PLC programming and automation", text: "Development, modification, diagnostics and optimization of industrial control logic.", items: ["Siemens TIA Portal", "Step7", "WinCC", "Omron Sysmac Studio", "CX-One", "Rockwell Studio 5000", "Beckhoff TwinCAT", "Motion Control"] },
    { title: "Industrial robotics", text: "Programming, adjustment, calibration and diagnostics of robots and handling systems.", items: ["Fanuc", "OMRON", "Staubli", "BRINK", "Wittmann", "3-axis robots", "6-axis robots"] },
    { title: "Industrial communications", text: "Integration of industrial systems and connection between equipment, data and software.", items: ["OPC UA", "EtherCAT", "Profinet", "Modbus", "TCP/IP", "IoT integration"] },
    { title: "Software development", text: "Application and tool development with maintainable architecture.", items: ["C++", "C#", "Python", "Java", "Kotlin", ".NET", "OOP"] },
    { title: "Databases and architecture", text: "Modeling, integration and organization of layered software.", items: ["MySQL", "PostgreSQL", "MVC", "MVVM", "Layered architecture", "DAO"] },
    { title: "Tools", text: "Technical environments used in software, automation and maintenance.", items: ["Visual Studio", "VS Code", "Android Studio", "Eclipse", "IntelliJ IDEA", "GitHub", "Linux", "Basic Docker"] }
  ],
  de: [
    { title: "SPS-Programmierung und Automatisierung", text: "Entwicklung, Aenderung, Diagnose und Optimierung industrieller Steuerungslogik.", items: ["Siemens TIA Portal", "Step7", "WinCC", "Omron Sysmac Studio", "CX-One", "Rockwell Studio 5000", "Beckhoff TwinCAT", "Motion Control"] },
    { title: "Industrierobotik", text: "Programmierung, Einstellung, Kalibrierung und Diagnose von Robotern und Handlingsystemen.", items: ["Fanuc", "OMRON", "Staubli", "BRINK", "Wittmann", "3-Achs-Roboter", "6-Achs-Roboter"] },
    { title: "Industrielle Kommunikation", text: "Integration industrieller Systeme und Verbindung zwischen Anlagen, Daten und Software.", items: ["OPC UA", "EtherCAT", "Profinet", "Modbus", "TCP/IP", "IoT-Integration"] },
    { title: "Softwareentwicklung", text: "Entwicklung von Anwendungen und Werkzeugen mit wartbarer Architektur.", items: ["C++", "C#", "Python", "Java", "Kotlin", ".NET", "OOP"] },
    { title: "Datenbanken und Architektur", text: "Modellierung, Integration und Organisation von Software in Schichten.", items: ["MySQL", "PostgreSQL", "MVC", "MVVM", "Schichtenarchitektur", "DAO"] },
    { title: "Werkzeuge", text: "Technische Umgebungen fuer Software, Automatisierung und Wartung.", items: ["Visual Studio", "VS Code", "Android Studio", "Eclipse", "IntelliJ IDEA", "GitHub", "Linux", "Docker Basis"] }
  ]
};
