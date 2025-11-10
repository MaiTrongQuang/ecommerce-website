"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { Language, languages, translations } from "./index"
import { useRouter } from "next/navigation"

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const LANGUAGE_COOKIE_NAME = "NEXT_LOCALE"
const DEFAULT_LANGUAGE: Language = "vi"

function getLanguageFromCookie(): Language {
  if (typeof document === "undefined") return DEFAULT_LANGUAGE

  const cookies = document.cookie.split(";")
  const langCookie = cookies.find((c) => c.trim().startsWith(`${LANGUAGE_COOKIE_NAME}=`))
  
  if (langCookie) {
    const lang = langCookie.split("=")[1]?.trim() as Language
    if (languages.some((l) => l.code === lang)) {
      return lang
    }
  }

  // Try to detect from browser
  if (typeof navigator !== "undefined") {
    const browserLang = navigator.language.split("-")[0]
    if (browserLang === "vi") return "vi"
    if (browserLang === "en") return "en"
  }

  return DEFAULT_LANGUAGE
}

function setLanguageCookie(lang: Language) {
  if (typeof document === "undefined") return
  document.cookie = `${LANGUAGE_COOKIE_NAME}=${lang}; path=/; max-age=31536000; SameSite=Lax`
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE)
  const router = useRouter()

  useEffect(() => {
    const lang = getLanguageFromCookie()
    setLanguageState(lang)
    // Update HTML lang attribute on mount
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang
    }
  }, [])

  const setLanguage = useCallback(
    (lang: Language) => {
      setLanguageState(lang)
      setLanguageCookie(lang)
      // Update HTML lang attribute
      if (typeof document !== "undefined") {
        document.documentElement.lang = lang
      }
      // Refresh the page to apply language changes
      router.refresh()
    },
    [router]
  )

  const t = useCallback(
    (key: string): string => {
      const keys = key.split(".")
      const langTranslations = translations[language] || translations.en
      
      let value: unknown = langTranslations

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = (value as Record<string, unknown>)[k]
        } else {
          // Fallback to English
          value = translations.en
          for (const k2 of keys) {
            if (value && typeof value === "object" && k2 in value) {
              value = (value as Record<string, unknown>)[k2]
            } else {
              return key
            }
          }
          break
        }
      }

      return typeof value === "string" ? value : key
    },
    [language]
  )

  // Always provide context, even before mount, to prevent errors
  // Use default language until mounted
  const contextValue = {
    language,
    setLanguage,
    t,
  }

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    // Fallback to default language if context is not available
    // This can happen during SSR or if component is rendered outside provider
    const fallbackT = (key: string): string => {
      const keys = key.split(".")
      const langTranslations = translations[DEFAULT_LANGUAGE]
      let value: unknown = langTranslations

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = (value as Record<string, unknown>)[k]
        } else {
          return key
        }
      }

      return typeof value === "string" ? value : key
    }

    return {
      language: DEFAULT_LANGUAGE,
      setLanguage: () => {
        console.warn("setLanguage called outside LanguageProvider")
      },
      t: fallbackT,
    }
  }
  return context
}

