import { createClient } from "@/lib/server"
import { getServerLanguage, getProductOriginFilter } from "@/lib/i18n/server"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { ProductSort } from "@/components/product-sort"
import { Pagination } from "@/components/ui/pagination"
import { ProductsContent } from "@/components/products-content"

interface SearchParams {
  category?: string
  search?: string
  sort?: string
  page?: string
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const category = params.category
  const search = params.search
  const sort = params.sort || "created_at"
  const page = Number.parseInt(params.page || "1")
  const limit = 12
  const offset = (page - 1) * limit

  // Get language for filtering products by origin
  const language = await getServerLanguage()
  const originFilter = getProductOriginFilter(language)

  // Build query
  let query = supabase.from("products").select("*, categories(name, slug)", { count: "exact" }).eq("status", "active")

  if (category) {
    query = query.eq("category_id", category)
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }

  // Filter by product origin based on language
  // Note: This requires adding an 'origin' field to products table: 'domestic' | 'foreign' | null
  // For now, this filter is disabled (getProductOriginFilter returns null)
  // When origin field is added, uncomment the following:
  // if (originFilter) {
  //   query = query.eq("origin", originFilter)
  // }

  // Apply sorting
  const [sortField, sortOrder] = sort.split("-")
  query = query.order(sortField, { ascending: sortOrder === "asc" })

  // Apply pagination
  query = query.range(offset, offset + limit - 1)

  const { data: products, count } = await query

  // Fetch categories for filter
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  const totalPages = Math.ceil((count || 0) / limit)

  return (
    <ProductsContent
      products={products || []}
      categories={categories || []}
      count={count || 0}
      page={page}
      totalPages={totalPages}
      offset={offset}
      limit={limit}
      selectedCategory={category}
      currentSort={sort}
      searchParams={params}
    />
  )
}
