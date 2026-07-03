import type { Locale } from "../i18n/config";

export type EmailVerificationStatus =
  | "needs-manual-verification"
  | "verified";

export type ContactTopic =
  | "automation"
  | "robotics"
  | "industrial-software"
  | "data-erp"
  | "devops-systems"
  | "documentation-qa"
  | "other";

export type ContactContent = {
  acceptedProjectsTitle: string;
  acceptedProjects: string[];
  whatToSendTitle: string;
  whatToSend: string[];
  doNotSendTitle: string;
  doNotSend: string[];
  responseExpectationTitle: string;
  responseExpectation: string;
  fallbackTitle: string;
  fallbackText: string;
  copyEmailLabel: string;
  copyEmailSuccess: string;
  mailtoSubjectPrefix: string;
  mailtoBodyLabels: {
    name: string;
    email: string;
    projectType: string;
    message: string;
    language: string;
  };
};

export const contactEmailVerification = {
  address: "contact@iocode-solutions.com",
  status: "verified" as EmailVerificationStatus,
  evidence:
    "Mailbox contact@iocode-solutions.com created and manual external send/receive test completed successfully.",
  verifiedAt: "2026-07-01"
};

export const contactTopics: Record<Locale, Array<{ value: ContactTopic; label: string }>> = {
  es: [
    { value: "automation", label: "Automatización PLC / HMI" },
    { value: "robotics", label: "Robótica industrial" },
    { value: "industrial-software", label: "Software industrial" },
    { value: "data-erp", label: "ERP / bases de datos / datos industriales" },
    { value: "devops-systems", label: "DevOps / sistemas / infraestructura" },
    { value: "documentation-qa", label: "Documentación técnica / QA" },
    { value: "other", label: "Otro" }
  ],
  en: [
    { value: "automation", label: "PLC / HMI automation" },
    { value: "robotics", label: "Industrial robotics" },
    { value: "industrial-software", label: "Industrial software" },
    { value: "data-erp", label: "ERP / databases / industrial data" },
    { value: "devops-systems", label: "DevOps / systems / infrastructure" },
    { value: "documentation-qa", label: "Technical documentation / QA" },
    { value: "other", label: "Other" }
  ],
  de: [
    { value: "automation", label: "SPS / HMI-Automatisierung" },
    { value: "robotics", label: "Industrierobotik" },
    { value: "industrial-software", label: "Industriesoftware" },
    { value: "data-erp", label: "ERP / Datenbanken / Industriedaten" },
    { value: "devops-systems", label: "DevOps / Systeme / Infrastruktur" },
    { value: "documentation-qa", label: "Technische Dokumentation / QA" },
    { value: "other", label: "Andere" }
  ]
};

export const contactContent: Record<Locale, ContactContent> = {
  es: {
    acceptedProjectsTitle: "Proyectos que encajan",
    acceptedProjects: [
      "Automatización PLC/HMI, diagnóstico y modificación de lógica industrial.",
      "Robótica industrial, integración de señales y estaciones automatizadas.",
      "Software industrial, herramientas internas y conexión entre máquinas y datos.",
      "Bases de datos, ERP/Odoo, trazabilidad, documentación técnica y QA."
    ],
    whatToSendTitle: "Qué enviar en el primer mensaje",
    whatToSend: [
      "Objetivo del proyecto o problema técnico.",
      "Sistema o tecnología involucrada.",
      "Estado actual: idea, bloqueo, mejora, mantenimiento o integración.",
      "Idioma preferido y plazo aproximado."
    ],
    doNotSendTitle: "Qué no enviar todavía",
    doNotSend: [
        "No envíes contraseñas, tokens, claves privadas o credenciales.",
        "No envíes IPs internas, VPN, usuarios, capturas sensibles o datos de clientes.",
        "No envíes documentación confidencial, contratos o archivos privados.",
        "No envíes datos médicos, financieros o personales de terceros."
    ],
    responseExpectationTitle: "Qué pasa después",
    responseExpectation:
      "Revisaré el alcance técnico y responderé con los siguientes pasos si el proyecto encaja con los servicios de IoCode. Normalmente la respuesta inicial puede tardar 1–3 días laborables.",
    fallbackTitle: "Si no se abre tu cliente de correo",
    fallbackText:
      "Copia el email y envía el mensaje desde tu cliente de correo preferido.",
    copyEmailLabel: "Copiar email",
    copyEmailSuccess: "Email copiado.",
    mailtoSubjectPrefix: "IoCode SOLUTIONS - Consulta técnica",
    mailtoBodyLabels: {
      name: "Nombre",
      email: "Correo",
      projectType: "Tipo de proyecto",
      message: "Mensaje",
      language: "Idioma"
    }
  },
  en: {
    acceptedProjectsTitle: "Projects that fit",
    acceptedProjects: [
      "PLC/HMI automation, diagnostics and industrial logic changes.",
      "Industrial robotics, signal integration and automated stations.",
      "Industrial software, internal tools and machine-to-data integration.",
      "Databases, ERP/Odoo, traceability, technical documentation and QA."
    ],
    whatToSendTitle: "What to include in the first message",
    whatToSend: [
      "Project goal or technical problem.",
      "System or technology involved.",
      "Current status: idea, blocker, improvement, maintenance or integration.",
      "Preferred language and approximate timeline."
    ],
    doNotSendTitle: "What not to send yet",
    doNotSend: [
      "Passwords, tokens, private keys or credentials.",
      "Internal IPs, VPN details, users, sensitive screenshots or client data.",
      "Confidential documentation, contracts or private files.",
      "Medical, financial or personal data from third parties."
    ],
    responseExpectationTitle: "What happens next",
    responseExpectation:
      "I will review the technical scope and reply with next steps if the project fits IoCode services. The initial response may usually take 1–3 business days.",
    fallbackTitle: "If your email client does not open",
    fallbackText:
      "Copy the email address and send the message from your preferred email client.",
    copyEmailLabel: "Copy email",
    copyEmailSuccess: "Email copied.",
    mailtoSubjectPrefix: "IoCode SOLUTIONS - Technical enquiry",
    mailtoBodyLabels: {
      name: "Name",
      email: "Email",
      projectType: "Project type",
      message: "Message",
      language: "Language"
    }
  },
  de: {
    acceptedProjectsTitle: "Passende Projekte",
    acceptedProjects: [
      "SPS/HMI-Automatisierung, Diagnose und Änderungen an industrieller Logik.",
      "Industrierobotik, Signalintegration und automatisierte Stationen.",
      "Industriesoftware, interne Werkzeuge und Verbindung von Maschinen mit Daten.",
      "Datenbanken, ERP/Odoo, Traceability, technische Dokumentation und QA."
    ],
    whatToSendTitle: "Was in die erste Nachricht gehört",
    whatToSend: [
      "Projektziel oder technisches Problem.",
      "Beteiligtes System oder verwendete Technologie.",
      "Aktueller Stand: Idee, Blocker, Verbesserung, Wartung oder Integration.",
      "Bevorzugte Sprache und grober Zeitrahmen."
    ],
    doNotSendTitle: "Was noch nicht gesendet werden sollte",
    doNotSend: [
      "Passwörter, Tokens, private Schlüssel oder Zugangsdaten.",
      "Interne IPs, VPN-Daten, Benutzer, sensible Screenshots oder Kundendaten.",
      "Vertrauliche Dokumentation, Verträge oder private Dateien.",
      "Medizinische, finanzielle oder personenbezogene Daten Dritter."
    ],
    responseExpectationTitle: "Was danach passiert",
    responseExpectation:
      "Ich prüfe den technischen Umfang und antworte mit den nächsten Schritten, wenn das Projekt zu den IoCode-Leistungen passt. Eine erste Antwort kann normalerweise 1–3 Werktage dauern.",
    fallbackTitle: "Falls sich kein E-Mail-Programm öffnet",
    fallbackText:
      "Kopiere die E-Mail-Adresse und sende die Nachricht über dein bevorzugtes E-Mail-Programm.",
    copyEmailLabel: "E-Mail kopieren",
    copyEmailSuccess: "E-Mail kopiert.",
    mailtoSubjectPrefix: "IoCode SOLUTIONS - Technische Anfrage",
    mailtoBodyLabels: {
      name: "Name",
      email: "E-Mail",
      projectType: "Projekttyp",
      message: "Nachricht",
      language: "Sprache"
    }
  }
};

export const contactApiContractDraft = {
  status: "draft-not-implemented",
  method: "POST",
  path: "/api/contact",
  contentType: "application/json",
  implemented: false,
  requestBody: {
    name: "string, required, 2-120 characters",
    email: "string, required, valid email, max 160 characters",
    company: "string, optional, max 160 characters",
    topic: "automation | robotics | industrial-software | data-erp | devops-systems | documentation-qa | other",
    message: "string, required, 20-4000 characters",
    language: "es | en | de",
    consent: "boolean, required true",
    website: "string, optional honeypot field, must remain empty"
  },
  securityNotes: [
    "No endpoint is implemented in the static phase.",
    "Future implementation must validate input server-side.",
    "Future implementation must rate-limit requests.",
    "Future implementation must use honeypot or equivalent antispam.",
    "Future implementation must avoid logging full message bodies by default.",
    "Future implementation must not accept file uploads in the first contact step.",
    "Future implementation must not store secrets, credentials or sensitive third-party data."
  ]
};