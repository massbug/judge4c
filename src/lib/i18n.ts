import { Locale } from "@/config/i18n";
import { enUS, zhCN } from "date-fns/locale";

export const getLocale = (locale: Locale) => {
  switch (locale) {
    case "zh":
      return zhCN;
    case "en":
    default:
      return enUS;
  }
}
