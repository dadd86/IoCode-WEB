export type LegalProfile = {
  providerName: string;
  businessName: string;
  legalForm: string;
  street: string;
  postalCode: string;
  city: string;
  region: string;
  country: string;
  phone: string;
  email: string;
  vatId: string;
  supervisoryAuthority: {
    name: string;
    street: string;
    postalCode: string;
    city: string;
    country: string;
    url: string;
  };
};

export const publicLegalProfile = {
  providerName: "Diego Armando Diaz Devia",
  businessName: "IoCode SOLUTIONS",
  legalForm: "Einzelunternehmen",

  street: "c/o IP-Management #11289, Ludwig-Erhard-Straße 18",
  postalCode: "20459",
  city: "Hamburg",
  region: "Hamburg",
  country: "Deutschland",

  phone: "+49 1573 4353705",
  email: "contact@iocode-solutions.com",
  vatId: "DE461105535",

  supervisoryAuthority: {
    name:
      "Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen (LDI NRW)",
    street: "Kavalleriestraße 2–4",
    postalCode: "40213",
    city: "Düsseldorf",
    country: "Deutschland",
    url: "https://www.ldi.nrw.de"
  }
} satisfies LegalProfile;
