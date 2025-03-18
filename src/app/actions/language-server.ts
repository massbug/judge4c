"use server";

import prisma from "@/lib/prisma";
import { EditorLanguage } from "@prisma/client";
import { SettingsLanguageServerFormValues } from "@/app/(app)/dashboard/@admin/settings/language-server/form";

export const getLanguageServerConfig = async (language: EditorLanguage) => {
  return await prisma.languageServerConfig.findUnique({
    where: { language },
  });
};

export const handleLanguageServerConfigSubmit = async (
  language: EditorLanguage,
  data: SettingsLanguageServerFormValues
) => {
  const existing = await getLanguageServerConfig(language);

  if (existing) {
    await prisma.languageServerConfig.update({
      where: { language },
      data,
    });
  } else {
    await prisma.languageServerConfig.create({
      data: { ...data, language },
    });
  }
};
