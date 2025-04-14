// Supported locales
export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];

// Default locale
export const defaultLocale: Locale = "en";

// Cookie key for storing selected locale
export const LOCALE_COOKIE_NAME = "LOCALE";
