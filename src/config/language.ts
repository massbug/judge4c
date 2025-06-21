import { Language } from "@/generated/client";
import COriginal from "devicons-react/icons/COriginal";
import CplusplusOriginal from "devicons-react/icons/CplusplusOriginal";

export const LANGUAGES = Object.values(Language);

export const getIconForLanguage = (language: Language) => {
  switch (language) {
    case Language.c:
      return COriginal;
    case Language.cpp:
      return CplusplusOriginal;
  }
};

export const getLabelForLanguage = (language: Language) => {
  switch (language) {
    case Language.c:
      return "C";
    case Language.cpp:
      return "C++";
  }
};
