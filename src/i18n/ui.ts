import type { Locale } from "./config";

export const ui = {
  es: {
    requestProposal: "Solicitar propuesta",
    viewProjects: "Ver proyectos",
    professionalValue: "Valor profesional: ",
    caution: "Cautela: ",
    viewCode: "Ver código",
    viewDemo: "Ver demo",
    contactName: "Nombre",
    contactEmail: "Correo",
    contactProjectType: "Tipo de proyecto",
    contactMessage: "Mensaje",
    contactSubmit: "Preparar correo",
    contactNote: "No escribas contraseñas, tokens, datos bancarios ni información sensible.",
    selectOption: "Selecciona una opción",
    github: "GitHub público",
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
    contactNote: "Bitte keine Passwörter, Tokens, Bankdaten oder sensiblen Informationen eingeben.",
    selectOption: "Option auswählen",
    github: "Öffentliches GitHub",
    linkedin: "Professionelles LinkedIn"
  }
} satisfies Record<Locale, Record<string, string>>;