export type Locale = "es" | "en" | "de";

export const locales: Locale[] = ["es", "en", "de"];
export const defaultLocale: Locale = "es";

export const localeNames: Record<Locale, string> = {
  es: "Espanol",
  en: "English",
  de: "Deutsch"
};
