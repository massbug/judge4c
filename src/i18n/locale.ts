"use server";

import {
  defaultLocale,
  Locale,
  LOCALE_COOKIE_NAME,
  locales
} from "@/config/i18n";
import { cookies, headers } from "next/headers";

export async function getUserLocale() {
  const cookieLocale = (await cookies()).get(LOCALE_COOKIE_NAME)?.value;

  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  const acceptLanguage = (await headers()).get("accept-language") || "";
  const firstLang = acceptLanguage.split(",")[0]?.trim().toLowerCase();
  const langPrefix = firstLang?.slice(0, 2);

  if (locales.includes(langPrefix as Locale)) {
    return langPrefix as Locale;
  }

  return defaultLocale;
}

export async function setUserLocale(locale: Locale) {
  (await cookies()).set(LOCALE_COOKIE_NAME, locale);
}
