import type { Locale } from "./config";

export const ui = {
  es: {
    requestProposal: "Solicitar propuesta",
    viewProjects: "Ver proyectos",
    professionalValue: "Valor profesional: ",
    caution: "Cautela: ",
    viewCode: "Ver codigo",
    viewDemo: "Ver demo",
    contactName: "Nombre",
    contactEmail: "Correo",
    contactProjectType: "Tipo de proyecto",
    contactMessage: "Mensaje",
    contactSubmit: "Preparar correo",
    contactNote: "No escribas contrasenas, tokens, datos bancarios ni informacion sensible.",
    selectOption: "Selecciona una opcion",
    github: "GitHub publico",
    linkedin: "LinkedIn profesional"
  },
  en: {
    requestProposal: "Request proposal",
    viewProjects: "View projects",
    professionalValue: "Professional value: ",
    caution: "Caution: ",
    viewCode: "View code",
    viewDemo: "View demo",
    contactName: "Name",
    contactEmail: "Email",
    contactProjectType: "Project type",
    contactMessage: "Message",
    contactSubmit: "Prepare email",
    contactNote: "Do not write passwords, tokens, banking data or sensitive information.",
    selectOption: "Select an option",
    github: "Public GitHub",
    linkedin: "Professional LinkedIn"
  },
  de: {
    requestProposal: "Angebot anfragen",
    viewProjects: "Projekte ansehen",
    professionalValue: "Professioneller Wert: ",
    caution: "Hinweis: ",
    viewCode: "Code ansehen",
    viewDemo: "Demo ansehen",
    contactName: "Name",
    contactEmail: "E-Mail",
    contactProjectType: "Projekttyp",
    contactMessage: "Nachricht",
    contactSubmit: "E-Mail vorbereiten",
    contactNote: "Bitte keine Passwoerter, Tokens, Bankdaten oder sensiblen Informationen eingeben.",
    selectOption: "Option auswaehlen",
    github: "Oeffentliches GitHub",
    linkedin: "Professionelles LinkedIn"
  }
} satisfies Record<Locale, Record<string, string>>;
