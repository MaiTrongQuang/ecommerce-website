import enTranslations from "./translations/en.json"
import viTranslations from "./translations/vi.json"

export type Language = "en" | "vi"

export const languages: { code: Language; name: string; flag: string }[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
]

export const translations = {
  en: enTranslations,
  vi: viTranslations,
} as const

export type TranslationKey = keyof typeof enTranslations
export type NestedTranslationKey<T extends TranslationKey> = keyof (typeof enTranslations)[T]

export function getTranslation(lang: Language, key: string): string {
  const keys = key.split(".")
  let value: any = translations[lang]

  for (const k of keys) {
    value = value?.[k]
    if (value === undefined) {
      // Fallback to English if translation not found
      value = translations.en
      for (const k2 of keys) {
        value = value?.[k2]
      }
      break
    }
  }

  return typeof value === "string" ? value : key
}

export function t(lang: Language, key: string): string {
  return getTranslation(lang, key)
}

