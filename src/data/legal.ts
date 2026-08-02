import type { Locale } from "../i18n/config";

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
};

type LegalCopy = {
  incompleteTitle: string;
  incompleteText: string;
  providerTitle: string;
  representedBy: string;
  address: string;
  contact: string;
  optionalRegistration: string;
  contentResponsibleTitle: string;
  contentResponsibleText: string;
  disputeTitle: string;
  disputeText: string;
  privacySections: LegalSection[];
  lastUpdated: string;
};

export const legalCopy: Record<Locale, LegalCopy> = {
  es: {
    incompleteTitle: "Datos legales pendientes de aprobación",
    incompleteText:
      "Esta ruta está implementada pero no debe publicarse como aviso legal definitivo hasta completar y revisar la dirección postal del responsable.",
    providerTitle: "Identificación del proveedor (§ 5 DDG)",
    representedBy: "Responsable",
    address: "Dirección postal",
    contact: "Contacto directo",
    optionalRegistration: "Datos registrales y fiscales, cuando sean aplicables",
    contentResponsibleTitle: "Responsable editorial",
    contentResponsibleText: "Responsable del contenido conforme al § 18(2) MStV: el proveedor indicado anteriormente.",
    disputeTitle: "Resolución de litigios de consumo",
    disputeText:
      "Salvo obligación legal específica, el proveedor no participa en procedimientos de resolución de litigios ante una junta arbitral de consumo.",
    lastUpdated: "Última actualización: 1 de agosto de 2026.",
    privacySections: [
      {
        title: "1. Responsable del tratamiento",
        paragraphs: ["El responsable y sus datos de contacto figuran en el bloque de identificación de esta página."]
      },
      {
        title: "2. Acceso al sitio y registros técnicos",
        paragraphs: [
          "Al acceder al sitio, el proveedor de hosting puede procesar dirección IP, fecha y hora, URL solicitada, código de respuesta, volumen transferido, referente y agente de usuario para entregar el contenido, garantizar estabilidad y detectar abuso.",
          "La base jurídica es el interés legítimo en una entrega segura y estable (art. 6.1.f RGPD). Los registros ordinarios se eliminan o anonimizan como máximo tras 14 días, salvo que un incidente exija conservarlos durante más tiempo."
        ]
      },
      {
        title: "3. Contacto por correo electrónico",
        paragraphs: [
          "El formulario no envía datos a un backend de IoCode SOLUTIONS: prepara un enlace mailto y la transmisión solo comienza cuando la persona utiliza su cliente de correo.",
          "Los datos recibidos se tratan para responder consultas y preparar o ejecutar una relación contractual (art. 6.1.b RGPD) o por interés legítimo en responder comunicaciones empresariales (art. 6.1.f RGPD)."
        ]
      },
      {
        title: "4. Cookies, analítica y enlaces externos",
        paragraphs: [
          "El sitio no instala cookies de aplicación ni integra analítica, publicidad o perfiles de seguimiento.",
          "Los enlaces a GitHub y LinkedIn solo transmiten datos a esos terceros cuando se activan. Sus propias políticas son aplicables desde ese momento."
        ]
      },
      {
        title: "5. Derechos",
        items: [
          "Acceso, rectificación, supresión y limitación del tratamiento.",
          "Portabilidad y oposición cuando proceda.",
          "Retirada del consentimiento sin afectar tratamientos anteriores, cuando la base sea el consentimiento.",
          "Reclamación ante una autoridad de control, en particular la LDI Nordrhein-Westfalen."
        ]
      }
    ]
  },
  en: {
    incompleteTitle: "Legal details awaiting approval",
    incompleteText:
      "This route is implemented but must not be published as the final legal notice until the controller's postal address is completed and reviewed.",
    providerTitle: "Provider identification (section 5 DDG)",
    representedBy: "Responsible person",
    address: "Postal address",
    contact: "Direct contact",
    optionalRegistration: "Register and tax details, where applicable",
    contentResponsibleTitle: "Editorial responsibility",
    contentResponsibleText: "Person responsible for content under section 18(2) MStV: the provider identified above.",
    disputeTitle: "Consumer dispute resolution",
    disputeText:
      "Unless a specific legal obligation applies, the provider does not participate in dispute-resolution proceedings before a consumer arbitration board.",
    lastUpdated: "Last updated: 1 August 2026.",
    privacySections: [
      {
        title: "1. Controller",
        paragraphs: ["The controller and contact details are stated in the identification block on this page."]
      },
      {
        title: "2. Website access and technical logs",
        paragraphs: [
          "When the website is accessed, the hosting provider may process the IP address, timestamp, requested URL, response code, transferred volume, referrer and user agent to deliver content, maintain stability and detect abuse.",
          "The legal basis is the legitimate interest in secure and reliable delivery (Article 6(1)(f) GDPR). Routine logs are deleted or anonymised within 14 days unless a security incident requires longer retention."
        ]
      },
      {
        title: "3. Email contact",
        paragraphs: [
          "The form does not send data to an IoCode SOLUTIONS backend. It prepares a mailto link, and transmission begins only when the visitor uses their email client.",
          "Received data is processed to answer enquiries and prepare or perform a contract (Article 6(1)(b) GDPR), or under the legitimate interest in responding to business communications (Article 6(1)(f) GDPR)."
        ]
      },
      {
        title: "4. Cookies, analytics and external links",
        paragraphs: [
          "The website sets no application cookies and integrates no analytics, advertising or tracking profiles.",
          "Links to GitHub and LinkedIn transfer data to those third parties only when activated. Their own privacy terms apply from that point."
        ]
      },
      {
        title: "5. Data-subject rights",
        items: [
          "Access, rectification, erasure and restriction of processing.",
          "Data portability and objection where applicable.",
          "Withdrawal of consent without affecting prior processing where consent is the legal basis.",
          "A complaint to a supervisory authority, in particular LDI Nordrhein-Westfalen."
        ]
      }
    ]
  },
  de: {
    incompleteTitle: "Rechtliche Angaben noch nicht freigegeben",
    incompleteText:
      "Diese Route ist technisch umgesetzt, darf aber erst nach Ergänzung und Prüfung der vollständigen ladungsfähigen Anschrift als endgültiges Impressum veröffentlicht werden.",
    providerTitle: "Anbieterkennzeichnung gemäß § 5 DDG",
    representedBy: "Verantwortliche Person",
    address: "Ladungsfähige Anschrift",
    contact: "Unmittelbarer Kontakt",
    optionalRegistration: "Register- und Steuerangaben, soweit anwendbar",
    contentResponsibleTitle: "Inhaltlich verantwortlich",
    contentResponsibleText: "Verantwortlich für den Inhalt gemäß § 18 Abs. 2 MStV: der oben genannte Anbieter.",
    disputeTitle: "Verbraucherstreitbeilegung",
    disputeText:
      "Soweit keine besondere gesetzliche Verpflichtung besteht, nimmt der Anbieter nicht an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teil.",
    lastUpdated: "Stand: 1. August 2026.",
    privacySections: [
      {
        title: "1. Verantwortlicher",
        paragraphs: ["Verantwortlicher und Kontaktdaten sind im Anbieterblock dieser Seite angegeben."]
      },
      {
        title: "2. Website-Aufruf und technische Protokolle",
        paragraphs: [
          "Beim Aufruf kann der Hosting-Anbieter IP-Adresse, Zeitpunkt, angeforderte URL, Statuscode, Datenmenge, Referrer und User-Agent verarbeiten, um Inhalte auszuliefern, Stabilität sicherzustellen und Missbrauch zu erkennen.",
          "Rechtsgrundlage ist das berechtigte Interesse an einer sicheren und stabilen Bereitstellung (Art. 6 Abs. 1 lit. f DSGVO). Reguläre Protokolle werden spätestens nach 14 Tagen gelöscht oder anonymisiert, sofern kein Sicherheitsvorfall eine längere Aufbewahrung erfordert."
        ]
      },
      {
        title: "3. Kontakt per E-Mail",
        paragraphs: [
          "Das Formular sendet keine Daten an ein Backend von IoCode SOLUTIONS. Es erstellt einen mailto-Link; eine Übermittlung beginnt erst, wenn die betroffene Person ihr E-Mail-Programm verwendet.",
          "Eingehende Angaben werden zur Beantwortung sowie zur Anbahnung oder Durchführung eines Vertrags (Art. 6 Abs. 1 lit. b DSGVO) oder aufgrund des berechtigten Interesses an geschäftlicher Kommunikation (Art. 6 Abs. 1 lit. f DSGVO) verarbeitet."
        ]
      },
      {
        title: "4. Cookies, Analyse und externe Links",
        paragraphs: [
          "Die Website setzt keine Anwendungs-Cookies ein und bindet keine Analyse-, Werbe- oder Tracking-Profile ein.",
          "Links zu GitHub und LinkedIn übertragen erst beim Aktivieren Daten an diese Dritten. Ab dann gelten deren eigene Datenschutzbestimmungen."
        ]
      },
      {
        title: "5. Betroffenenrechte",
        items: [
          "Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung.",
          "Datenübertragbarkeit und Widerspruch, soweit anwendbar.",
          "Widerruf einer Einwilligung ohne Auswirkung auf frühere Verarbeitungen, sofern Einwilligung die Rechtsgrundlage ist.",
          "Beschwerde bei einer Aufsichtsbehörde, insbesondere der LDI Nordrhein-Westfalen."
        ]
      }
    ]
  }
};
