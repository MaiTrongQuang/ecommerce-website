import { createClient } from "@/lib/server"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { ProductSort } from "@/components/product-sort"
import { Pagination } from "@/components/ui/pagination"

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

  // Build query
  let query = supabase.from("products").select("*, categories(name, slug)", { count: "exact" }).eq("status", "active")

  if (category) {
    query = query.eq("category_id", category)
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }

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
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground mt-2">Browse our collection of {count || 0} products</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <ProductFilters categories={categories || []} selectedCategory={category} />
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {offset + 1}-{Math.min(offset + limit, count || 0)} of {count || 0} products
            </p>
            <ProductSort currentSort={sort} />
          </div>

          {products && products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    slug={product.slug}
                    price={product.price}
                    compareAtPrice={product.compare_at_price}
                    image={product.images[0] || "/placeholder.svg?height=400&width=400"}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination currentPage={page} totalPages={totalPages} baseUrl="/products" searchParams={params} />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
