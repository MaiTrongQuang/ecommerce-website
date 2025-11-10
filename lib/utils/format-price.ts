/**
 * Format price based on language
 * For Vietnamese: 10.000.000đ
 * For English: $10,000.00
 */

export function formatPrice(price: number, language: "en" | "vi" = "vi"): string {
  if (language === "vi") {
    // Vietnamese format: 10.000.000đ
    return `${price.toLocaleString("vi-VN")}đ`
  } else {
    // English format: $10,000.00
    return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
}

/**
 * Format price with compare price (for showing discounts)
 */
export function formatPriceWithCompare(
  price: number,
  comparePrice: number | null | undefined,
  language: "en" | "vi" = "vi"
): { current: string; original: string | null; discount: number } {
  const current = formatPrice(price, language)
  const original = comparePrice ? formatPrice(comparePrice, language) : null
  const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0

  return { current, original, discount }
}

