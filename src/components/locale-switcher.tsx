"use client";

import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "next-intl";
import { useTransition } from "react";
import { LOCALES } from "@/config/i18n";
import { Locale } from "@/generated/client";
import { setUserLocale } from "@/i18n/locale";

const getIconForLocale = (locale: Locale) => {
  switch (locale) {
    case Locale.en:
      return (
        <Image
          src="/flags/us.svg"
          alt="English"
          className="mr-2 h-4 w-4"
          width={16}
          height={16}
        />
      );
    case Locale.zh:
      return (
        <Image
          src="/flags/cn.svg"
          alt="中文"
          className="mr-2 h-4 w-4"
          width={16}
          height={16}
        />
      );
  }
};

const getLabelForLocale = (locale: Locale) => {
  switch (locale) {
    case Locale.en:
      return "English";
    case Locale.zh:
      return "中文";
  }
};

export const LocaleSwitcher = () => {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleValueChange = (value: Locale) => {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  };

  return (
    <Select
      value={locale}
      onValueChange={handleValueChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-[150px] focus:ring-0 shadow-none">
        <SelectValue placeholder="Select Locale" />
      </SelectTrigger>
      <SelectContent>
        {LOCALES.map((locale) => (
          <SelectItem key={locale} value={locale}>
            <div className="flex items-center">
              {getIconForLocale(locale)}
              <span className="truncate">{getLabelForLocale(locale)}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
