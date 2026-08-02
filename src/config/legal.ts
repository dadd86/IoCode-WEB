import { deployEnvironment } from "./environment";

const value = (input: string | undefined): string => input?.trim() || "";

export const legalConfig = {
  approved: import.meta.env.PUBLIC_LEGAL_APPROVED === "true",
  providerName: value(import.meta.env.PUBLIC_LEGAL_NAME) || "Diego Armando Diaz Devia",
  businessName: value(import.meta.env.PUBLIC_LEGAL_BUSINESS_NAME) || "IoCode SOLUTIONS",
  street: value(import.meta.env.PUBLIC_LEGAL_STREET),
  postalCode: value(import.meta.env.PUBLIC_LEGAL_POSTAL_CODE),
  city: value(import.meta.env.PUBLIC_LEGAL_CITY) || "Aachen",
  country: value(import.meta.env.PUBLIC_LEGAL_COUNTRY) || "Germany",
  email: value(import.meta.env.PUBLIC_LEGAL_EMAIL) || "contact@iocode-solutions.com",
  phone: value(import.meta.env.PUBLIC_LEGAL_PHONE),
  vatId: value(import.meta.env.PUBLIC_LEGAL_VAT_ID),
  registerName: value(import.meta.env.PUBLIC_LEGAL_REGISTER_NAME),
  registerNumber: value(import.meta.env.PUBLIC_LEGAL_REGISTER_NUMBER)
};

export const missingRequiredLegalFields = [
  ["PUBLIC_LEGAL_APPROVED", legalConfig.approved ? "true" : ""],
  ["PUBLIC_LEGAL_NAME", legalConfig.providerName],
  ["PUBLIC_LEGAL_STREET", legalConfig.street],
  ["PUBLIC_LEGAL_POSTAL_CODE", legalConfig.postalCode],
  ["PUBLIC_LEGAL_CITY", legalConfig.city],
  ["PUBLIC_LEGAL_COUNTRY", legalConfig.country],
  ["PUBLIC_LEGAL_EMAIL", legalConfig.email]
]
  .filter(([, fieldValue]) => !fieldValue)
  .map(([fieldName]) => fieldName);

export const legalProfileComplete = missingRequiredLegalFields.length === 0;
export const legalProfileProductionReady =
  deployEnvironment === "production" ? legalProfileComplete : false;
