"use client";

import Flag from "react-world-flags";
import { Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { Locale, locales } from "@/config/i18n";
import { useState, useMemo, useEffect } from "react";
import { getUserLocale, setUserLocale } from "@/i18n/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function LanguageSettings() {
  const t = useTranslations();
  const [selectedOption, setSelectedOption] = useState<Locale>();

  useEffect(() => {
    const fetchLocale = async () => {
      const userLocale = await getUserLocale();
      if (!userLocale) return;
      setSelectedOption(userLocale);
    };
    fetchLocale();
  }, []);

  const localeOptions = useMemo(() => {
    const options = locales.map((locale) => ({
      value: locale,
      label: `${t(`LanguageSettings.${locale}.name`)}`,
    }));
    return options.sort((a, b) => a.value.localeCompare(b.value));
  }, [t]);

  const handleValueChange = async (value: Locale) => {
    setSelectedOption(value);
    await setUserLocale(value);
  };

  const getIconForLocale = (locale: Locale) => {
    switch (locale) {
      case "en":
        return <Flag code="US" className="h-4 w-4 mr-2" />;
      case "zh":
        return <Flag code="CN" className="h-4 w-4 mr-2" />;
      default:
        return <Globe size={16} className="mr-2" />;
    }
  };

  return (
    <Select value={selectedOption} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[200px] shadow-none focus:ring-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="w-[200px]">
        {localeOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex items-center">
              {getIconForLocale(option.value)}
              <span className="truncate">{option.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
