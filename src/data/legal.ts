import type { Locale } from "../i18n/config";

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
};

type ProviderLabels = {
  title: string;
  service: string;
  provider: string;
  location: string;
  safeguard: string;
  pending: string;
  services: Record<"hosting" | "email" | "dns" | "registrar", string>;
};

type LegalCopy = {
  incompleteTitle: string;
  incompleteText: string;
  providerTitle: string;
  providerName: string;
  businessName: string;
  legalForm: string;
  address: string;
  contact: string;
  privacyContact: string;
  optionalRegistration: string;
  disputeTitle: string;
  disputeText: string;
  providerLabels: ProviderLabels;
  privacySections: LegalSection[];
  authorityTitle: string;
  authorityText: string;
  versionTitle: string;
  versionSummary: string;
  lastUpdated: string;
};

export const legalCopy: Record<Locale, LegalCopy> = {
  es: {
    incompleteTitle: "Datos legales pendientes de aprobación",
    incompleteText:
      "La estructura legal está implementada, pero esta versión permanece como borrador y no debe publicarse como declaración definitiva hasta completar los campos indicados, verificar proveedores y obtener aprobación del responsable.",
    providerTitle: "Identificación del proveedor (§ 5 DDG)",
    providerName: "Titular",
    businessName: "Nombre comercial",
    legalForm: "Forma jurídica",
    address: "Dirección postal",
    contact: "Contacto electrónico rápido",
    privacyContact: "Canal para derechos de protección de datos",
    optionalRegistration: "Datos registrales y fiscales, cuando sean aplicables",
    disputeTitle: "Resolución de litigios de consumo",
    disputeText:
      "Salvo obligación legal específica, el proveedor no participa en procedimientos de resolución de litigios ante una junta arbitral de consumo.",
    providerLabels: {
      title: "Destinatarios y proveedores técnicos",
      service: "Servicio",
      provider: "Proveedor",
      location: "Lugar de tratamiento",
      safeguard: "Garantía de transferencia",
      pending: "Pendiente de verificación antes de producción",
      services: {
        hosting: "Hosting/servidor",
        email: "Correo electrónico",
        dns: "DNS/CDN",
        registrar: "Registrador de dominio"
      }
    },
    privacySections: [
      {
        title: "1. Responsable y alcance",
        paragraphs: [
          "El responsable del tratamiento es el titular identificado anteriormente. Esta información cubre el sitio web estático, sus registros técnicos, el contacto por correo y la administración de Search Console."
        ]
      },
      {
        title: "2. Acceso al sitio y seguridad técnica",
        paragraphs: [
          "Para entregar una página, la infraestructura de red procesa temporalmente la dirección IP, fecha y hora, recurso solicitado, protocolo y datos de conexión. IoCode SOLUTIONS configura Nginx para conservar únicamente timestamp, código HTTP, bytes y duración, sin IP, ruta, query, referer, user-agent, cookies, autorización ni cuerpo.",
          "La finalidad es entregar el sitio, mantener disponibilidad y seguridad y diagnosticar incidentes. La base jurídica es el interés legítimo en una operación segura y estable (art. 6.1.f RGPD). Los logs mínimos se rotan y eliminan como máximo a los 14 días; una evidencia de incidente sólo se conserva mientras sea necesaria y quede documentada."
        ]
      },
      {
        title: "3. Contacto por correo electrónico",
        paragraphs: [
          "El formulario no transmite datos a un backend de IoCode SOLUTIONS. Genera localmente un enlace mailto; el envío comienza únicamente cuando la persona confirma la acción en su cliente de correo.",
          "Tras la recepción del correo se tratan nombre, dirección de correo, tipo de proyecto, mensaje y metadatos del correo para responder consultas y, cuando proceda, preparar o ejecutar un contrato (art. 6.1.b RGPD) o atender comunicaciones empresariales legítimas (art. 6.1.f RGPD). El responsable elimina u organiza los mensajes en su buzón según dejen de ser necesarios; la documentación contractual o legal se conserva durante los plazos obligatorios aplicables. Tras una eliminación activa, el ciclo ordinario del encargado puede tardar hasta seis meses y las copias de seguridad hasta tres meses adicionales."
        ]
      },
      {
        title: "4. Search Console y medición",
        paragraphs: [
          "Google Search Console puede utilizarse tras verificar el dominio para consultar información agregada sobre indexación, búsquedas y Core Web Vitals. El sitio no carga scripts de Google Analytics, Tag Manager ni RUM de terceros, y Search Console no instala cookies desde estas páginas.",
          "La finalidad es mantener visibilidad técnica y calidad del sitio sobre la base del interés legítimo (art. 6.1.f RGPD). El responsable recibe informes agregados y aplica la retención disponible en la cuenta del proveedor."
        ]
      },
      {
        title: "5. Cookies y almacenamiento del terminal",
        paragraphs: [
          "El sitio no establece cookies, no usa localStorage, sessionStorage, IndexedDB, service workers persistentes, fingerprinting ni identificadores publicitarios. Por ello no se presenta banner de consentimiento. Esta evaluación debe repetirse antes de añadir cualquier tecnología que almacene o lea información del dispositivo.",
          "El botón para copiar la dirección pública ejecuta navigator.clipboard.writeText únicamente después de una acción explícita. No lee el portapapeles, no conserva el resultado y no transmite esa interacción a IoCode SOLUTIONS."
        ]
      },
      {
        title: "6. Enlaces externos",
        paragraphs: [
          "GitHub y LinkedIn sólo reciben una solicitud cuando la persona activa voluntariamente el enlace. No se cargan widgets, píxeles ni recursos de esos proveedores antes del clic. Desde ese momento se aplican sus propias condiciones y políticas."
        ]
      },
      {
        title: "7. Destinatarios, encargados y transferencias",
        paragraphs: [
          "Los datos sólo se comunican a proveedores necesarios para hosting, correo, DNS/CDN, registro de dominio y soporte técnico bajo instrucciones y contratos aplicables. Zoho Corporation GmbH, II. Hagen 7, 45127 Essen, Alemania, presta el buzón corporativo como encargado conforme al artículo 28 RGPD; el DPA se firmó el 19 de agosto de 2026. Los datos se almacenan en centros del EEE. El Schedule 2 prevé acceso por entidades del grupo en India para soporte y depuración, y la sección 5.2 del DPA obliga a Zoho a garantizar una base válida para la transferencia.",
          "Hetzner Online GmbH aloja el sitio como encargado conforme al artículo 28 RGPD con DPA ejecutado. La evidencia contractual refiere certificación ISO 27001, § 8a BSI-KritisV y BSI C5 Type 2; son evidencias del proveedor y no certificaciones de IoCode SOLUTIONS."
        ]
      },
      {
        title: "8. Datos obtenidos indirectamente (art. 14 RGPD)",
        paragraphs: [
          "Si una consulta empresarial contiene datos de una persona obtenidos de su empresa, un contacto profesional o una fuente pública, se documentarán la fuente y las categorías. La información exigible se facilitará como máximo en un mes, en la primera comunicación o antes de comunicar los datos a otro destinatario, según qué ocurra primero y salvo excepción legal."
        ]
      },
      {
        title: "9. Derechos de las personas",
        items: [
          "Acceso, rectificación, supresión y limitación del tratamiento.",
          "Portabilidad cuando el tratamiento automatizado se base en consentimiento o contrato.",
          "Oposición al tratamiento basado en interés legítimo.",
          "Retirada del consentimiento sin afectar el tratamiento anterior, cuando esa sea la base.",
          "Reclamación ante una autoridad de control. La autoridad competente está pendiente de determinación jurídica por la diferencia entre residencia y dirección de servicio."
        ]
      },
      {
        title: "10. Obligación de facilitar datos y decisiones automatizadas",
        paragraphs: [
          "La visita técnica requiere los datos de conexión necesarios para transmitir la página. Facilitar datos por correo es voluntario, aunque puede ser necesario para responder o contratar. No se realizan decisiones automatizadas ni perfiles con efectos jurídicos o similares."
        ]
      }
    ],
    authorityTitle: "Autoridad de control",
    authorityText: "La autoridad competente está pendiente de determinación jurídica (X1). Este dato permanece bloqueado y no se infiere de la dirección de servicio.",
    versionTitle: "Versión e historial legal",
    versionSummary:
      "Versión 2026-08-23.1 — IoCode SOLUTIONS — forma unipersonal, DPA de Hetzner y Zoho documentados; autoridad competente pendiente de X1.",
    lastUpdated: "Última actualización: 23 de agosto de 2026."
  },
  en: {
    incompleteTitle: "Legal information awaiting approval",
    incompleteText:
      "The legal structure is implemented, but this version remains a draft and must not be published as the final statement until all listed fields and providers are verified and the controller approves it.",
    providerTitle: "Provider identification (section 5 DDG)",
    providerName: "Provider",
    businessName: "Trading name",
    legalForm: "Legal form",
    address: "Postal address",
    contact: "Rapid electronic contact",
    privacyContact: "Data-subject rights channel",
    optionalRegistration: "Register and tax information, where applicable",
    disputeTitle: "Consumer dispute resolution",
    disputeText:
      "Unless a specific legal obligation applies, the provider does not participate in dispute-resolution proceedings before a consumer arbitration board.",
    providerLabels: {
      title: "Recipients and technical providers",
      service: "Service",
      provider: "Provider",
      location: "Processing location",
      safeguard: "Transfer safeguard",
      pending: "Pending verification before production",
      services: {
        hosting: "Hosting/server",
        email: "Email",
        dns: "DNS/CDN",
        registrar: "Domain registrar"
      }
    },
    privacySections: [
      {
        title: "1. Controller and scope",
        paragraphs: [
          "The controller is the provider identified above. This notice covers the static website, technical logs, email contact and administration of Search Console."
        ]
      },
      {
        title: "2. Website access and technical security",
        paragraphs: [
          "To deliver a page, the network infrastructure temporarily processes the IP address, timestamp, requested resource, protocol and connection data. IoCode SOLUTIONS configures Nginx to retain only timestamp, HTTP status, bytes and duration, without IP, path, query, referrer, user-agent, cookies, authorisation or body.",
          "The purposes are delivery, availability, security and incident diagnosis. The legal basis is the legitimate interest in secure and stable operation (Article 6(1)(f) GDPR). Minimal logs are rotated and erased within 14 days; incident evidence is retained only while necessary and documented."
        ]
      },
      {
        title: "3. Contact by email",
        paragraphs: [
          "The form sends nothing to an IoCode SOLUTIONS backend. It generates a mailto link locally; transmission begins only after the person confirms the action in their email client.",
          "After an email is received, name, email address, project type, message and email metadata are processed to answer enquiries and, where applicable, take steps before or perform a contract (Article 6(1)(b) GDPR), or under the legitimate interest in business communication (Article 6(1)(f) GDPR). The controller deletes or organises messages when they are no longer necessary; contractual or legally required records follow the applicable statutory periods. After active deletion, the processor's routine cycle may take up to six months and backup deletion up to three additional months."
        ]
      },
      {
        title: "4. Search Console and measurement",
        paragraphs: [
          "Google Search Console may be used after domain verification to view aggregated indexing, search and Core Web Vitals data. The site loads no Google Analytics, Tag Manager or third-party RUM script, and Search Console sets no cookie from these pages.",
          "The purpose is technical visibility and website quality under the legitimate interest basis (Article 6(1)(f) GDPR). The controller sees aggregated reports and applies the retention available in the provider account."
        ]
      },
      {
        title: "5. Cookies and terminal storage",
        paragraphs: [
          "The site sets no cookies and uses no localStorage, sessionStorage, IndexedDB, persistent service worker, fingerprinting or advertising identifier. No consent banner is therefore displayed. This assessment must be repeated before adding technology that stores or reads information on a device.",
          "The public-email copy button runs navigator.clipboard.writeText only after an explicit action. It does not read the clipboard, retain the result or transmit that interaction to IoCode SOLUTIONS."
        ]
      },
      {
        title: "6. External links",
        paragraphs: [
          "GitHub and LinkedIn receive a request only when a person voluntarily activates the link. No widget, pixel or resource from those providers loads before that click. Their own terms and notices apply from that point."
        ]
      },
      {
        title: "7. Recipients, processors and transfers",
        paragraphs: [
          "Data is disclosed only to providers necessary for hosting, email, DNS/CDN, domain registration and technical support under applicable instructions and contracts. Zoho Corporation GmbH, II. Hagen 7, 45127 Essen, Germany, supplies the corporate mailbox as an Article 28 GDPR processor under a DPA signed on 19 August 2026. Data is stored in EEA data centres. Schedule 2 allows Zoho group entities in India to access data for support and debugging, and DPA section 5.2 requires Zoho to ensure a valid transfer basis.",
          "Hetzner Online GmbH hosts the site as an Article 28 GDPR processor under an executed DPA. The contractual evidence refers to ISO 27001 certification, section 8a BSI-KritisV and BSI C5 Type 2; these are provider evidence, not IoCode SOLUTIONS certifications."
        ]
      },
      {
        title: "8. Indirectly obtained data (Article 14 GDPR)",
        paragraphs: [
          "If a business enquiry contains personal data obtained from an employer, professional contact or public source, the source and categories are documented. Required information is supplied within one month, at the first communication or before the first disclosure, whichever occurs first, unless a legal exception applies."
        ]
      },
      {
        title: "9. Data-subject rights",
        items: [
          "Access, rectification, erasure and restriction of processing.",
          "Data portability where automated processing is based on consent or contract.",
          "Objection to processing based on legitimate interests.",
          "Withdrawal of consent without affecting earlier processing, where consent is the basis.",
          "A complaint to a supervisory authority. The competent authority awaits legal determination because residence and service address differ."
        ]
      },
      {
        title: "10. Requirement to provide data and automated decisions",
        paragraphs: [
          "Technical access requires connection data needed to transmit the page. Supplying email data is voluntary but may be necessary to answer or contract. No automated decision-making or profiling with legal or similarly significant effects takes place."
        ]
      }
    ],
    authorityTitle: "Supervisory authority",
    authorityText: "The competent authority awaits legal determination (X1). It is not inferred from the service address.",
    versionTitle: "Version and legal history",
    versionSummary:
      "Version 2026-08-23.1 — IoCode SOLUTIONS — sole proprietorship and executed Hetzner and Zoho DPAs documented; competent authority pending X1.",
    lastUpdated: "Last updated: 23 August 2026."
  },
  de: {
    incompleteTitle: "Rechtliche Angaben noch nicht freigegeben",
    incompleteText:
      "Die rechtliche Struktur ist umgesetzt. Diese Fassung bleibt jedoch ein Entwurf und darf erst nach Prüfung aller aufgeführten Felder und Anbieter sowie Freigabe durch den Verantwortlichen als endgültige Erklärung veröffentlicht werden.",
    providerTitle: "Anbieterkennzeichnung gemäß § 5 DDG",
    providerName: "Diensteanbieter",
    businessName: "Geschäftsbezeichnung",
    legalForm: "Rechtsform",
    address: "Ladungsfähige Anschrift",
    contact: "Schnelle elektronische Kontaktaufnahme",
    privacyContact: "Kanal für Betroffenenrechte",
    optionalRegistration: "Register- und Steuerangaben, soweit anwendbar",
    disputeTitle: "Verbraucherstreitbeilegung",
    disputeText:
      "Soweit keine besondere gesetzliche Verpflichtung besteht, nimmt der Anbieter nicht an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teil.",
    providerLabels: {
      title: "Empfänger und technische Anbieter",
      service: "Dienst",
      provider: "Anbieter",
      location: "Verarbeitungsort",
      safeguard: "Transfergarantie",
      pending: "Prüfung vor Produktion ausstehend",
      services: {
        hosting: "Hosting/Server",
        email: "E-Mail",
        dns: "DNS/CDN",
        registrar: "Domain-Registrar"
      }
    },
    privacySections: [
      {
        title: "1. Verantwortlicher und Geltungsbereich",
        paragraphs: [
          "Verantwortlicher ist der oben bezeichnete Diensteanbieter. Diese Erklärung umfasst die statische Website, technische Protokolle, E-Mail-Kontakt und die Verwaltung der Search Console."
        ]
      },
      {
        title: "2. Website-Aufruf und technische Sicherheit",
        paragraphs: [
          "Zur Auslieferung einer Seite verarbeitet die Netzinfrastruktur vorübergehend IP-Adresse, Zeitpunkt, angeforderte Ressource, Protokoll und Verbindungsdaten. IoCode SOLUTIONS konfiguriert Nginx so, dass nur Zeitpunkt, HTTP-Status, Bytes und Dauer gespeichert werden – ohne IP, Pfad, Query, Referrer, User-Agent, Cookies, Autorisierung oder Inhalt.",
          "Zwecke sind Auslieferung, Verfügbarkeit, Sicherheit und Störungsdiagnose. Rechtsgrundlage ist das berechtigte Interesse an einem sicheren und stabilen Betrieb (Art. 6 Abs. 1 lit. f DSGVO). Minimale Logs werden spätestens nach 14 Tagen gelöscht; Vorfallsnachweise nur solange wie erforderlich und dokumentiert aufbewahrt."
        ]
      },
      {
        title: "3. Kontakt per E-Mail",
        paragraphs: [
          "Das Formular übermittelt nichts an ein Backend von IoCode SOLUTIONS. Es erzeugt lokal einen mailto-Link; die Übermittlung beginnt erst nach Bestätigung im E-Mail-Programm der Person.",
          "Nach Eingang der E-Mail werden Name, E-Mail-Adresse, Projekttyp, Nachricht und E-Mail-Metadaten zur Beantwortung und gegebenenfalls zur Vertragsanbahnung oder -durchführung (Art. 6 Abs. 1 lit. b DSGVO) oder aufgrund des berechtigten Interesses an geschäftlicher Kommunikation (Art. 6 Abs. 1 lit. f DSGVO) verarbeitet. Der Verantwortliche löscht oder ordnet Nachrichten im Postfach, sobald sie nicht mehr erforderlich sind; Vertragsunterlagen und gesetzliche Nachweise folgen den einschlägigen Fristen. Nach aktiver Löschung kann der reguläre Bereinigungszyklus des Auftragsverarbeiters bis zu sechs Monate und die Löschung von Backups bis zu drei weitere Monate dauern."
        ]
      },
      {
        title: "4. Search Console und Messung",
        paragraphs: [
          "Nach Domain-Verifizierung kann Google Search Console für aggregierte Angaben zu Indexierung, Suche und Core Web Vitals eingesetzt werden. Die Website lädt weder Google Analytics noch Tag Manager oder fremde RUM-Skripte; Search Console setzt über diese Seiten kein Cookie.",
          "Zweck ist technische Sichtbarkeit und Qualität auf Grundlage des berechtigten Interesses (Art. 6 Abs. 1 lit. f DSGVO). Der Verantwortliche sieht aggregierte Berichte und verwendet die im Anbieterkonto verfügbare Aufbewahrung."
        ]
      },
      {
        title: "5. Cookies und Endgerätespeicher",
        paragraphs: [
          "Die Website setzt keine Cookies und nutzt weder localStorage, sessionStorage, IndexedDB, persistente Service Worker, Fingerprinting noch Werbe-IDs. Deshalb wird kein Einwilligungsbanner angezeigt. Vor jeder Technik, die Informationen im Endgerät speichert oder ausliest, ist diese Bewertung erneut durchzuführen.",
          "Die Schaltfläche zum Kopieren der öffentlichen E-Mail-Adresse führt navigator.clipboard.writeText nur nach einer ausdrücklichen Aktion aus. Sie liest die Zwischenablage nicht, speichert das Ergebnis nicht und übermittelt diese Interaktion nicht an IoCode SOLUTIONS."
        ]
      },
      {
        title: "6. Externe Links",
        paragraphs: [
          "GitHub und LinkedIn erhalten erst dann eine Anfrage, wenn die Person den Link freiwillig aktiviert. Widgets, Pixel oder Ressourcen dieser Anbieter werden vorher nicht geladen. Ab dem Klick gelten deren eigene Bedingungen und Hinweise."
        ]
      },
      {
        title: "7. Empfänger, Auftragsverarbeiter und Übermittlungen",
        paragraphs: [
          "Daten werden nur an notwendige Anbieter für Hosting, E-Mail, DNS/CDN, Domain-Registrierung und technischen Support unter den anwendbaren Weisungen und Verträgen übermittelt. Zoho Corporation GmbH, II. Hagen 7, 45127 Essen, Deutschland, stellt das geschäftliche Postfach als Auftragsverarbeiter gemäß Art. 28 DSGVO auf Grundlage eines am 19. August 2026 unterzeichneten DPA bereit. Die Speicherung erfolgt in Rechenzentren im EWR. Schedule 2 erlaubt Gruppengesellschaften in Indien Zugriff für Support und Fehlerbehebung; Abschnitt 5.2 des DPA verpflichtet Zoho, eine gültige Übermittlungsgrundlage sicherzustellen.",
          "Hetzner Online GmbH hostet die Website als Auftragsverarbeiter gemäß Art. 28 DSGVO auf Grundlage eines abgeschlossenen DPA. Die Vertragsnachweise nennen ISO-27001-Zertifizierung, § 8a BSI-KritisV und BSI C5 Typ 2; dies sind Nachweise des Anbieters und keine Zertifizierungen von IoCode SOLUTIONS."
        ]
      },
      {
        title: "8. Indirekt erhobene Daten (Art. 14 DSGVO)",
        paragraphs: [
          "Enthält eine geschäftliche Anfrage personenbezogene Daten aus dem Unternehmen, von einem beruflichen Kontakt oder aus einer öffentlichen Quelle, werden Quelle und Kategorien dokumentiert. Die erforderliche Information erfolgt spätestens innerhalb eines Monats, bei der ersten Kommunikation oder vor der ersten Offenlegung – je nachdem, was zuerst eintritt – sofern keine gesetzliche Ausnahme gilt."
        ]
      },
      {
        title: "9. Betroffenenrechte",
        items: [
          "Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung.",
          "Datenübertragbarkeit bei automatisierter Verarbeitung auf Grundlage von Einwilligung oder Vertrag.",
          "Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen.",
          "Widerruf einer Einwilligung ohne Auswirkung auf frühere Verarbeitungen, soweit Einwilligung die Grundlage ist.",
          "Beschwerde bei einer Aufsichtsbehörde. Wegen der Abweichung zwischen Wohnsitz und Serviceanschrift ist die zuständige Behörde rechtlich noch zu bestimmen."
        ]
      },
      {
        title: "10. Bereitstellungspflicht und automatisierte Entscheidungen",
        paragraphs: [
          "Der technische Abruf benötigt die zur Übertragung erforderlichen Verbindungsdaten. Angaben per E-Mail sind freiwillig, können aber für Antwort oder Vertrag erforderlich sein. Es finden keine automatisierten Entscheidungen oder Profile mit rechtlicher oder ähnlich erheblicher Wirkung statt."
        ]
      }
    ],
    authorityTitle: "Aufsichtsbehörde",
    authorityText: "Die zuständige Aufsichtsbehörde ist rechtlich noch zu bestimmen (X1). Sie wird nicht aus der Serviceanschrift abgeleitet.",
    versionTitle: "Version und rechtliche Änderungshistorie",
    versionSummary:
      "Version 2026-08-23.1 — IoCode SOLUTIONS — Einzelunternehmen sowie abgeschlossene DPA mit Hetzner und Zoho dokumentiert; zuständige Behörde gemäß X1 offen.",
    lastUpdated: "Stand: 23. August 2026."
  }
};
