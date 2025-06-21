"use server";

import { cookies } from "next/headers";
import { Locale } from "@/generated/client";
import { LOCALE_COOKIE_KEY } from "@/config/i18n";

export const setUserLocale = async (locale: Locale) => {
  (await cookies()).set(LOCALE_COOKIE_KEY, locale);
};
