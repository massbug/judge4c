import "server-only";

import { Locale } from "@/generated/client";
import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE_KEY } from "@/config/i18n";

const validLocales = Object.values(Locale);

export const getUserLocale = async () => {
  const cookieLocale = (await cookies()).get(LOCALE_COOKIE_KEY)?.value;
  if (validLocales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  const acceptLanguage = (await headers())
    .get("accept-language")
    ?.split(",")[0]
    ?.trim()
    .toLowerCase();
  const langPrefix = acceptLanguage?.slice(0, 2);
  if (validLocales.includes(langPrefix as Locale)) {
    return langPrefix as Locale;
  }

  return DEFAULT_LOCALE;
};

export const setUserLocale = async (locale: Locale) => {
  (await cookies()).set(LOCALE_COOKIE_KEY, locale);
};
