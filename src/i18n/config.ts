export const localesArray = ['en', 'zh'] as const;
export const locales = new Set(localesArray);
export type Locale = (typeof localesArray)[number];

export const defaultLocale: Locale = 'en';
