import "server-only";

import { Locale } from "@/generated/client";
import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE, LOCALE_COOKIE_KEY, LOCALES } from "@/config/i18n";

const getUserLocale = async () => {
  const cookieLocale = (await cookies()).get(LOCALE_COOKIE_KEY)?.value;
  if (LOCALES.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  const acceptLanguage = (await headers())
    .get("accept-language")
    ?.split(",")[0]
    ?.trim()
    .toLowerCase();
  const langPrefix = acceptLanguage?.slice(0, 2);
  if (LOCALES.includes(langPrefix as Locale)) {
    return langPrefix as Locale;
  }

  return DEFAULT_LOCALE;
};

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
