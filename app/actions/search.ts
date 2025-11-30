"use server"

import { createClient } from "@/lib/server"

export interface SearchResult {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  category: {
    name: string
    slug: string
  }
}

export async function searchProducts(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return []

  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      images,
      category:categories(name, slug)
    `)
    .eq("status", "active")
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(5)

  if (!products) return []

  // Transform data to match SearchResult interface
  return products.map((product: any) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    images: product.images,
    category: product.category,
  }))
}
