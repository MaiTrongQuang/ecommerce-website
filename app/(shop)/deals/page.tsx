import { createClient } from "@/lib/server"
import { DealsContent } from "@/components/deals-content"

export default async function DealsPage() {
  const supabase = await createClient()
  const now = new Date().toISOString()

  // Fetch active deals
  const { data: deals, error } = await supabase
    .from("deals")
    .select("*")
    .eq("status", "active")
    .lte("start_date", now)
    .gte("end_date", now)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[Deals] Error fetching deals:", error)
  }

  // Fetch products that are part of deals
  const productIds = deals?.flatMap((deal) => deal.product_ids || []) || []
  let products: any[] = []

  if (productIds.length > 0) {
    // Remove duplicates
    const uniqueProductIds = [...new Set(productIds)]
    
    const { data: productsData } = await supabase
      .from("products")
      .select("*, categories(name, slug)")
      .in("id", uniqueProductIds)
      .eq("status", "active")

    products = productsData || []
  }

  return <DealsContent deals={deals || []} products={products} />
}

