import { cookies } from "next/headers"
import { Language } from "./index"

const LANGUAGE_COOKIE_NAME = "NEXT_LOCALE"
const DEFAULT_LANGUAGE: Language = "vi"

export async function getServerLanguage(): Promise<Language> {
  const cookieStore = await cookies()
  const langCookie = cookieStore.get(LANGUAGE_COOKIE_NAME)
  
  if (langCookie?.value && (langCookie.value === "en" || langCookie.value === "vi")) {
    return langCookie.value as Language
  }

  return DEFAULT_LANGUAGE
}

export function getProductOriginFilter(language: Language): string | null {
  // For Vietnamese: show domestic products (origin = 'domestic' or null)
  // For English: show foreign products (origin = 'foreign')
  // If origin field doesn't exist, return null to show all products
  // This assumes products table will have an 'origin' field: 'domestic' | 'foreign' | null
  
  // For now, return null to show all products
  // When origin field is added to products table, uncomment below:
  // return language === "vi" ? "domestic" : "foreign"
  
  return null
}

