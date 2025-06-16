import { Locale } from "@/generated/client";
import { enUS } from "date-fns/locale/en-US";
import { zhCN } from "date-fns/locale/zh-CN";
import { formatDistanceToNow, isBefore, subDays, format } from "date-fns";

export const getDateFunctionForLocale = (locale: Locale) => {
  switch (locale) {
    case Locale.en:
      return enUS;
    case Locale.zh:
      return zhCN;
  }
};

export const formatSubmissionDate = (date: Date, locale: Locale) => {
  const localeInstance = getDateFunctionForLocale(locale);
  return isBefore(date, subDays(new Date(), 1))
    ? format(date, "yyyy-MM-dd")
    : formatDistanceToNow(date, { addSuffix: true, locale: localeInstance });
};
