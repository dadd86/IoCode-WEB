import { deployEnvironment } from "./environment";
import { publicLegalProfile } from "../data/legal-profile";

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
  ...publicLegalProfile,
  privacyEmail: publicLegalProfile.email,
  supervisoryAuthorityName: value(environment.PUBLIC_PRIVACY_AUTHORITY_NAME),
  supervisoryAuthorityUrl: value(environment.PUBLIC_PRIVACY_AUTHORITY_URL),
  legalVersion: "2026-08-23.1"
};

export const publicProviderDisclosures: PublicProviderDisclosure[] = [
  {
    service: "hosting",
    provider: value(environment.PUBLIC_HOSTING_PROVIDER),
    processingLocation: value(environment.PUBLIC_HOSTING_LOCATION),
    transferSafeguard: value(environment.PUBLIC_HOSTING_TRANSFER_SAFEGUARD)
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
  ["PUBLIC_PRIVACY_AUTHORITY_NAME", legalConfig.supervisoryAuthorityName],
  ["PUBLIC_PRIVACY_AUTHORITY_URL", legalConfig.supervisoryAuthorityUrl]
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
