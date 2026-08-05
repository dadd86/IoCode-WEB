import { deployEnvironment } from "./environment";

const value = (input: string | undefined): string => input?.trim() || "";
const enabled = (input: string | undefined): boolean => input === "true";

const environment = import.meta.env;

export type PublicProviderDisclosure = {
  service: "hosting" | "email" | "dns" | "registrar";
  provider: string;
  processingLocation: string;
  transferSafeguard: string;
};

export const legalConfig = {
  approved: enabled(environment.PUBLIC_LEGAL_APPROVED),
  privacyApproved: enabled(environment.PUBLIC_PRIVACY_APPROVED),
  providerName: value(environment.PUBLIC_LEGAL_NAME) || "Diego Armando Diaz Devia",
  businessName: value(environment.PUBLIC_LEGAL_BUSINESS_NAME) || "IoCode SOLUTIONS",
  legalForm: value(environment.PUBLIC_LEGAL_FORM),
  legalRepresentative:
    value(environment.PUBLIC_LEGAL_REPRESENTATIVE) ||
    value(environment.PUBLIC_LEGAL_NAME) ||
    "Diego Armando Diaz Devia",
  street:
    value(environment.PUBLIC_LEGAL_STREET) ||
    "c/o IP-Management #11289, Ludwig-Erhard-Straße 18",
  postalCode: value(environment.PUBLIC_LEGAL_POSTAL_CODE) || "20459",
  city: value(environment.PUBLIC_LEGAL_CITY) || "Hamburg",
  country: value(environment.PUBLIC_LEGAL_COUNTRY) || "Germany",
  email: value(environment.PUBLIC_LEGAL_EMAIL) || "contact@iocode-solutions.com",
  privacyEmail:
    value(environment.PUBLIC_PRIVACY_EMAIL) ||
    value(environment.PUBLIC_LEGAL_EMAIL) ||
    "contact@iocode-solutions.com",
  phone: value(environment.PUBLIC_LEGAL_PHONE),
  vatId: value(environment.PUBLIC_LEGAL_VAT_ID) || "DE461105535",
  registerName: value(environment.PUBLIC_LEGAL_REGISTER_NAME),
  registerNumber: value(environment.PUBLIC_LEGAL_REGISTER_NUMBER),
  supervisoryAuthorityName:
    value(environment.PUBLIC_PRIVACY_AUTHORITY_NAME) ||
    "Der Hamburgische Beauftragte für Datenschutz und Informationsfreiheit",
  supervisoryAuthorityUrl:
    value(environment.PUBLIC_PRIVACY_AUTHORITY_URL) ||
    "https://datenschutz-hamburg.de/service-information/beschwerde-oder-hinweis-einreichen",
  legalVersion: "2026-08-05.1"
};

export const publicProviderDisclosures: PublicProviderDisclosure[] = [
  {
    service: "hosting",
    provider: value(environment.PUBLIC_HOSTING_PROVIDER) || "Hetzner Online GmbH",
    processingLocation: value(environment.PUBLIC_HOSTING_LOCATION) || "Germany (EEA)",
    transferSafeguard:
      value(environment.PUBLIC_HOSTING_TRANSFER_SAFEGUARD) ||
      "EEA processing; Article 28 DPA verification required"
  },
  {
    service: "email",
    provider: value(environment.PUBLIC_EMAIL_PROVIDER),
    processingLocation: value(environment.PUBLIC_EMAIL_LOCATION),
    transferSafeguard: value(environment.PUBLIC_EMAIL_TRANSFER_SAFEGUARD)
  },
  {
    service: "dns",
    provider: value(environment.PUBLIC_DNS_PROVIDER),
    processingLocation: value(environment.PUBLIC_DNS_LOCATION),
    transferSafeguard: value(environment.PUBLIC_DNS_TRANSFER_SAFEGUARD)
  },
  {
    service: "registrar",
    provider: value(environment.PUBLIC_REGISTRAR_PROVIDER),
    processingLocation: value(environment.PUBLIC_REGISTRAR_LOCATION),
    transferSafeguard: value(environment.PUBLIC_REGISTRAR_TRANSFER_SAFEGUARD)
  }
];

const requiredLegalValues: Array<[string, string]> = [
  ["PUBLIC_LEGAL_APPROVED", legalConfig.approved ? "true" : ""],
  ["PUBLIC_PRIVACY_APPROVED", legalConfig.privacyApproved ? "true" : ""],
  ["PUBLIC_LEGAL_NAME", value(environment.PUBLIC_LEGAL_NAME)],
  ["PUBLIC_LEGAL_BUSINESS_NAME", value(environment.PUBLIC_LEGAL_BUSINESS_NAME)],
  ["PUBLIC_LEGAL_FORM", legalConfig.legalForm],
  ["PUBLIC_LEGAL_REPRESENTATIVE", legalConfig.legalRepresentative],
  ["PUBLIC_LEGAL_STREET", legalConfig.street],
  ["PUBLIC_LEGAL_POSTAL_CODE", legalConfig.postalCode],
  ["PUBLIC_LEGAL_CITY", value(environment.PUBLIC_LEGAL_CITY)],
  ["PUBLIC_LEGAL_COUNTRY", value(environment.PUBLIC_LEGAL_COUNTRY)],
  ["PUBLIC_LEGAL_EMAIL", value(environment.PUBLIC_LEGAL_EMAIL)],
  ["PUBLIC_PRIVACY_EMAIL", legalConfig.privacyEmail],
  ["PUBLIC_LEGAL_VAT_ID", legalConfig.vatId]
];

for (const provider of publicProviderDisclosures) {
  const prefix = `PUBLIC_${provider.service.toUpperCase()}`;
  requiredLegalValues.push(
    [`${prefix}_PROVIDER`, provider.provider],
    [`${prefix}_LOCATION`, provider.processingLocation],
    [`${prefix}_TRANSFER_SAFEGUARD`, provider.transferSafeguard]
  );
}

export const missingRequiredLegalFields = requiredLegalValues
  .filter(([, fieldValue]) => !fieldValue)
  .map(([fieldName]) => fieldName);

export const legalProfileComplete = missingRequiredLegalFields.length === 0;
export const legalProfileProductionReady =
  deployEnvironment === "production" && legalProfileComplete;
