import type { Locale } from "../i18n/config";
import { publicLegalProfile } from "./legal-profile";

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
};

type ProviderLabels = {
  provider: string;
  businessDesignation: string;
  legalForm: string;
  address: string;
  contact: string;
  vatId: string;
};

type LegalCopy = {
  providerTitle: string;
  labels: ProviderLabels;
  businessDesignationText: string;
  disputeTitle: string;
  disputeText: string;
  privacyIntro: string;
  privacySections: LegalSection[];
  authorityTitle: string;
  authorityIntro: string;
  versionTitle: string;
  versionSummary: string;
  lastUpdated: string;
};

export const legalCopy: Record<Locale, LegalCopy> = {
  es: {
    providerTitle: "Identificación del prestador conforme al § 5 DDG",
    labels: {
      provider: "Titular",
      businessDesignation: "Nombre comercial",
      legalForm: "Forma jurídica",
      address: "Dirección postal",
      contact: "Contacto",
      vatId: "Número de identificación fiscal (IVA)"
    },
    businessDesignationText:
      `${publicLegalProfile.providerName}, operando bajo el nombre comercial «${publicLegalProfile.businessName}» (no inscrito en el Registro Mercantil)`,
    disputeTitle: "Resolución de litigios de consumo",
    disputeText:
      "El prestador no está obligado ni dispuesto a participar en un procedimiento de resolución de litigios ante una junta arbitral de consumo en el sentido del § 36 VSBG.",
    privacyIntro:
      "El responsable del tratamiento de los datos personales relacionados con este sitio web es el prestador identificado a continuación.",
    privacySections: [
      {
        title: "1. Responsable del tratamiento y ámbito de aplicación",
        paragraphs: [
          "El responsable del tratamiento de los datos personales relacionados con este sitio web es el prestador identificado más arriba bajo «Identificación del prestador». Este aviso cubre el acceso al sitio web estático, el contacto por correo electrónico y los enlaces externos mencionados a continuación."
        ]
      },
      {
        title: "2. Alojamiento y registros técnicos del servidor",
        paragraphs: [
          "Este sitio web está alojado por Hetzner Online GmbH, Alemania. Para entregar cada página, la conexión TCP/HTTP procesa de forma transitoria la dirección IP de origen, la fecha y hora, el recurso solicitado y los encabezados del navegador (protocolo, agente de usuario); es el mínimo técnico necesario para transmitir una respuesta por internet. De ese tráfico, la aplicación conserva únicamente marca de tiempo, código de estado HTTP, bytes transferidos y duración de la solicitud, sin registrar la dirección IP, la ruta completa, parámetros, referer, agente de usuario ni cabeceras de autorización.",
          "La base jurídica es el interés legítimo en un funcionamiento seguro y estable del sitio web (art. 6.1.f RGPD). Con Hetzner Online GmbH existe un contrato de encargo del tratamiento conforme al art. 28 RGPD; el alojamiento se realiza exclusivamente en centros de datos situados en Alemania (UE). Los registros de aplicación descritos arriba se rotan y eliminan como máximo a los 14 días; no se afirman aquí plazos de retención propios de Hetzner que no consten expresamente en su DPA."
        ]
      },
      {
        title: "3. Contacto por correo electrónico",
        paragraphs: [
          "El formulario de contacto de este sitio web no transmite datos a ningún servidor de IoCode SOLUTIONS. Genera localmente, en el navegador de la persona, un enlace mailto prerrellenado; el envío solo se produce cuando la persona lo confirma desde su propio cliente de correo.",
          "Cuando se produce un contacto por correo electrónico, el nombre, la dirección de correo, el tipo de proyecto y el mensaje se tratan exclusivamente para gestionar la consulta. La base jurídica es el art. 6.1.b RGPD cuando la consulta sirve para la preparación o ejecución de un contrato, o el art. 6.1.f RGPD (interés legítimo en responder a consultas empresariales) en el resto de los casos. Los datos se eliminan en cuanto dejan de ser necesarios y, como máximo, al finalizar los plazos legales de conservación aplicables.",
          "El buzón de correo empresarial se gestiona a través de Zoho Mail (Zoho Corporation B.V., Países Bajos/UE). Con Zoho existe un contrato de encargo del tratamiento conforme al art. 28 RGPD; los datos de correo se almacenan en centros de datos del Espacio Económico Europeo. Para tareas de soporte técnico, entidades del grupo Zoho en India pueden acceder de forma limitada a dichos datos; este acceso está amparado por cláusulas contractuales tipo (art. 46.2.c RGPD)."
        ]
      },
      {
        title: "4. Ausencia de cookies y de rastreo",
        paragraphs: [
          "Este sitio web no utiliza cookies ni servicios de analítica, marketing o seguimiento (como Google Analytics u otras herramientas equivalentes). No se elaboran perfiles de uso ni se comparte información con terceros con fines publicitarios. Dado que no se produce ningún almacenamiento ni lectura de información en el dispositivo de la persona usuaria que requiera consentimiento conforme al § 25 TDDDG, no es necesario mostrar un banner de consentimiento."
        ]
      },
      {
        title: "5. Enlaces externos",
        paragraphs: [
          "Este sitio web incluye enlaces a las plataformas GitHub y LinkedIn. No se incorpora ningún contenido, botón ni píxel de seguimiento de estos proveedores; la conexión con el proveedor correspondiente solo se produce cuando la persona activa voluntariamente el enlace mediante un clic. A partir de ese momento se aplican las políticas de privacidad propias de cada proveedor."
        ]
      },
      {
        title: "6. Derechos de las personas interesadas",
        items: [
          "Acceso a los datos personales tratados (art. 15 RGPD).",
          "Rectificación de datos inexactos (art. 16 RGPD).",
          "Supresión de los datos, salvo que exista una obligación legal de conservación (art. 17 RGPD).",
          "Limitación del tratamiento (art. 18 RGPD).",
          "Portabilidad de los datos, cuando el tratamiento se base en el consentimiento o en un contrato (art. 20 RGPD).",
          "Oposición al tratamiento basado en el art. 6.1.f RGPD (art. 21 RGPD)."
        ]
      }
    ],
    authorityTitle: "Derecho de reclamación ante una autoridad de control",
    authorityIntro:
      "Sin perjuicio de cualquier otro recurso administrativo o judicial, las personas interesadas tienen derecho a presentar una reclamación ante una autoridad de control en materia de protección de datos. La autoridad competente para el responsable del tratamiento es:",
    versionTitle: "Versión del documento",
    versionSummary:
      "Versión 2026-09-05.3 — versión revisada y aprobada en su totalidad del aviso legal y la política de privacidad.",
    lastUpdated: "Última actualización: 5 de septiembre de 2026."
  },
  en: {
    providerTitle: "Provider identification pursuant to section 5 DDG",
    labels: {
      provider: "Provider",
      businessDesignation: "Trading name",
      legalForm: "Legal form",
      address: "Postal address",
      contact: "Contact",
      vatId: "VAT identification number"
    },
    businessDesignationText:
      `${publicLegalProfile.providerName}, trading as "${publicLegalProfile.businessName}" (not entered in the German commercial register)`,
    disputeTitle: "Consumer dispute resolution",
    disputeText:
      "The provider is neither obliged nor willing to participate in dispute-resolution proceedings before a consumer arbitration board within the meaning of section 36 VSBG.",
    privacyIntro:
      "The controller for the processing of personal data in connection with this website is the provider identified below.",
    privacySections: [
      {
        title: "1. Controller and scope",
        paragraphs: [
          "The controller for the processing of personal data in connection with this website is the provider identified above under \"Provider identification\". This notice covers access to the static website, contact by email and the external links named below."
        ]
      },
      {
        title: "2. Hosting and server logs",
        paragraphs: [
          "This website is hosted by Hetzner Online GmbH, Germany. To deliver each page, the TCP/HTTP connection transiently processes the originating IP address, date and time, the resource requested, and the browser's request headers (protocol, user agent) — the technical minimum needed to transmit a response over the internet. Of that traffic, the application retains only the timestamp, HTTP status code, bytes transferred and request duration; it does not log the IP address, full path, query parameters, referrer, user agent or authorization headers.",
          "The legal basis is the legitimate interest in a secure and functional website (Article 6(1)(f) GDPR). A data processing agreement under Article 28 GDPR is in place with Hetzner Online GmbH; hosting takes place exclusively in data centres within Germany (EU). The application logs described above are rotated and deleted within 14 days at most; no Hetzner-specific retention period is claimed here beyond what is expressly stated in its DPA."
        ]
      },
      {
        title: "3. Contact by email",
        paragraphs: [
          "The contact form on this website sends no data to an IoCode SOLUTIONS server. It generates a pre-filled mailto link locally in the visitor's browser; the message is only sent once the person confirms it in their own email client.",
          "Where contact is made by email, the name, email address, project type and message are processed solely to handle the enquiry. The legal basis is Article 6(1)(b) GDPR where the enquiry serves to prepare or perform a contract, or Article 6(1)(f) GDPR (legitimate interest in responding to business enquiries) in all other cases. Data is deleted once it is no longer required, and at the latest after statutory retention periods expire.",
          "The business email mailbox is operated through Zoho Mail (Zoho Corporation B.V., Netherlands/EU). A data processing agreement under Article 28 GDPR is in place with Zoho; email data is stored in data centres within the European Economic Area. For technical support purposes, limited access may occur from Zoho group entities in India; this access is safeguarded by Standard Contractual Clauses (Article 46(2)(c) GDPR)."
        ]
      },
      {
        title: "4. No cookies and no tracking",
        paragraphs: [
          "This website sets no cookies and uses no analytics, marketing or tracking services (such as Google Analytics or comparable tools). No usage profiles are created and no information is shared with third parties for advertising purposes. Because no consent-requiring storage of, or access to, information on the visitor's device takes place under section 25 TDDDG, no consent banner is required."
        ]
      },
      {
        title: "5. External links",
        paragraphs: [
          "This website links to the GitHub and LinkedIn platforms. No content, buttons or tracking pixels from these providers are embedded; a connection to the respective provider is established only once the linked page is opened through an active click. Their own privacy notices apply to any processing that follows the click."
        ]
      },
      {
        title: "6. Data subject rights",
        items: [
          "Access to the personal data processed (Article 15 GDPR).",
          "Rectification of inaccurate data (Article 16 GDPR).",
          "Erasure of data, unless a statutory retention obligation applies (Article 17 GDPR).",
          "Restriction of processing (Article 18 GDPR).",
          "Data portability, where processing is based on consent or on a contract (Article 20 GDPR).",
          "Objection to processing based on Article 6(1)(f) GDPR (Article 21 GDPR)."
        ]
      }
    ],
    authorityTitle: "Right to lodge a complaint with a supervisory authority",
    authorityIntro:
      "Without prejudice to any other administrative or judicial remedy, data subjects have the right to lodge a complaint with a data protection supervisory authority. The authority competent for the controller is:",
    versionTitle: "Document version",
    versionSummary:
      "Version 2026-09-05.3 — fully reviewed and approved version of the imprint and privacy notice.",
    lastUpdated: "Last updated: 5 September 2026."
  },
  de: {
    providerTitle: "Anbieterkennzeichnung gemäß § 5 DDG",
    labels: {
      provider: "Diensteanbieter",
      businessDesignation: "Geschäftsbezeichnung",
      legalForm: "Rechtsform",
      address: "Ladungsfähige Anschrift",
      contact: "Kontakt",
      vatId: "Umsatzsteuer-Identifikationsnummer"
    },
    businessDesignationText:
      `${publicLegalProfile.providerName} handelnd unter „${publicLegalProfile.businessName}“ (nicht im Handelsregister eingetragen)`,
    disputeTitle: "Verbraucherstreitbeilegung",
    disputeText:
      "Der Anbieter ist nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle im Sinne des § 36 VSBG teilzunehmen.",
    privacyIntro:
      "Verantwortlicher für die Verarbeitung personenbezogener Daten im Zusammenhang mit dieser Website ist der nachfolgend genannte Diensteanbieter.",
    privacySections: [
      {
        title: "1. Verantwortlicher und Geltungsbereich",
        paragraphs: [
          "Verantwortlicher für die Verarbeitung personenbezogener Daten im Zusammenhang mit dieser Website ist der oben unter „Anbieterkennzeichnung“ genannte Diensteanbieter. Diese Erklärung gilt für den Aufruf der statischen Website, den Kontakt per E-Mail und die nachfolgend genannten externen Verlinkungen."
        ]
      },
      {
        title: "2. Hosting und Server-Protokolle",
        paragraphs: [
          "Diese Website wird bei Hetzner Online GmbH, Deutschland, gehostet. Zur Auslieferung jeder Seite verarbeitet die TCP/HTTP-Verbindung vorübergehend die anfragende IP-Adresse, Datum und Uhrzeit, die abgerufene Ressource sowie die Anfrage-Header des Browsers (Protokoll, User-Agent) – das technisch notwendige Minimum zur Übertragung einer Antwort über das Internet. Von diesem Datenverkehr speichert die Anwendung ausschließlich Zeitstempel, HTTP-Statuscode, übertragene Bytes und Anfragedauer; IP-Adresse, vollständiger Pfad, Query-Parameter, Referrer, User-Agent und Autorisierungs-Header werden nicht protokolliert.",
          "Rechtsgrundlage ist das berechtigte Interesse an einem sicheren und funktionsfähigen Betrieb der Website (Art. 6 Abs. 1 lit. f DSGVO). Mit Hetzner Online GmbH besteht ein Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO; das Hosting erfolgt ausschließlich in Rechenzentren in Deutschland (EU). Die oben beschriebenen Anwendungs-Logs werden spätestens nach 14 Tagen rotiert und gelöscht; es werden keine über den DPA von Hetzner hinausgehenden Aufbewahrungsfristen des Anbieters behauptet."
        ]
      },
      {
        title: "3. Kontaktaufnahme per E-Mail",
        paragraphs: [
          "Das Kontaktformular dieser Website übermittelt keine Daten an einen Server von IoCode SOLUTIONS. Es erzeugt lokal im Browser der Person einen vorausgefüllten mailto-Link; der eigentliche Versand erfolgt erst, wenn die Person diesen im eigenen E-Mail-Programm bestätigt.",
          "Bei einer Kontaktaufnahme per E-Mail werden Name, E-Mail-Adresse, Projektart und Nachricht ausschließlich zur Bearbeitung der Anfrage verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, sofern die Anfrage der Anbahnung oder Durchführung eines Vertrags dient, oder Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Beantwortung geschäftlicher Anfragen) in allen übrigen Fällen. Die Daten werden gelöscht, sobald sie zur Bearbeitung nicht mehr erforderlich sind, spätestens jedoch nach Ablauf gesetzlicher Aufbewahrungsfristen.",
          "Der geschäftliche E-Mail-Posteingang wird über Zoho Mail (Zoho Corporation B.V., Niederlande/EU) betrieben. Mit Zoho besteht ein Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO; die E-Mail-Daten werden in Rechenzentren innerhalb des Europäischen Wirtschaftsraums gespeichert. Im Rahmen des technischen Supports kann in begrenztem Umfang ein Zugriff durch Zoho-Konzerngesellschaften in Indien erfolgen; dieser Zugriff ist über Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO) abgesichert."
        ]
      },
      {
        title: "4. Keine Cookies und kein Tracking",
        paragraphs: [
          "Diese Website setzt keine Cookies und verwendet keine Analyse-, Marketing- oder Tracking-Dienste (z. B. Google Analytics oder vergleichbare Werkzeuge). Es findet keine Erstellung von Nutzungsprofilen statt und es werden keine Informationen zu Werbezwecken an Dritte weitergegeben. Da keine einwilligungspflichtige Speicherung oder Auslesung von Informationen auf dem Endgerät der Nutzenden nach § 25 TDDDG erfolgt, ist kein Consent-Banner erforderlich."
        ]
      },
      {
        title: "5. Externe Links",
        paragraphs: [
          "Diese Website enthält Verlinkungen zu den Plattformen GitHub und LinkedIn. Es werden keine Inhalte, Schaltflächen oder Zählpixel dieser Anbieter eingebunden; eine Verbindung zum jeweiligen Anbieter kommt ausschließlich zustande, wenn die verlinkte Seite durch einen aktiven Klick geöffnet wird. Für die Datenverarbeitung nach dem Klick gelten die Datenschutzhinweise des jeweiligen Anbieters."
        ]
      },
      {
        title: "6. Rechte der betroffenen Person",
        items: [
          "Auskunft über die verarbeiteten personenbezogenen Daten (Art. 15 DSGVO).",
          "Berichtigung unrichtiger Daten (Art. 16 DSGVO).",
          "Löschung der Daten, soweit keine gesetzlichen Aufbewahrungspflichten entgegenstehen (Art. 17 DSGVO).",
          "Einschränkung der Verarbeitung (Art. 18 DSGVO).",
          "Datenübertragbarkeit, soweit die Verarbeitung auf einer Einwilligung oder einem Vertrag beruht (Art. 20 DSGVO).",
          "Widerspruch gegen eine auf Art. 6 Abs. 1 lit. f DSGVO gestützte Verarbeitung (Art. 21 DSGVO)."
        ]
      }
    ],
    authorityTitle: "Beschwerderecht bei einer Aufsichtsbehörde",
    authorityIntro:
      "Unbeschadet eines anderweitigen verwaltungsrechtlichen oder gerichtlichen Rechtsbehelfs steht betroffenen Personen das Recht auf Beschwerde bei einer Datenschutzaufsichtsbehörde zu. Zuständig für den Verantwortlichen ist:",
    versionTitle: "Version des Dokuments",
    versionSummary:
      "Version 2026-09-05.3 — vollständig geprüfte und freigegebene Fassung des Impressums und der Datenschutzerklärung.",
    lastUpdated: "Stand: 5. September 2026."
  }
};
