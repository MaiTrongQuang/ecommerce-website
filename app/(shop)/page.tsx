import { createClient } from "@/lib/server"
import { getServerLanguage, getProductOriginFilter } from "@/lib/i18n/server"
import { HomeContent } from "@/components/home-content"

export default async function HomePage() {
  const supabase = await createClient()

  // Get language for filtering products by origin
  const language = await getServerLanguage()
  const originFilter = getProductOriginFilter(language)

  // Build query for featured products
  let productsQuery = supabase
    .from("products")
    .select("*")
    .eq("status", "active")
    .limit(8)
    .order("created_at", { ascending: false })

  // Filter by product origin based on language
  // Note: This requires adding an 'origin' field to products table: 'domestic' | 'foreign' | null
  // For now, this filter is disabled (getProductOriginFilter returns null)
  // When origin field is added, uncomment the following:
  // if (originFilter) {
  //   productsQuery = productsQuery.eq("origin", originFilter)
  // }

  const { data: products } = await productsQuery

  // Fetch categories
  const { data: categories } = await supabase.from("categories").select("*").limit(6)

  return <HomeContent products={products || []} categories={categories || []} />
}
