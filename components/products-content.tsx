"use client"

import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { ProductSort } from "@/components/product-sort"
import { Pagination } from "@/components/pagination"
import { useLanguage } from "@/lib/i18n/context"

interface ProductsContentProps {
  products: Array<{
    id: string
    name: string
    slug: string
    price: number
    compare_at_price?: number | null
    images: string[]
    quantity: number
  }>
  categories: Array<{
    id: string
    name: string
  }>
  count: number
  page: number
  totalPages: number
  offset: number
  limit: number
  selectedCategory?: string
  currentSort: string
  searchParams: Record<string, string | undefined>
}

export function ProductsContent({
  products,
  categories,
  count,
  page,
  totalPages,
  offset,
  limit,
  selectedCategory,
  currentSort,
  searchParams,
}: ProductsContentProps) {
  const { t } = useLanguage()

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("products.title")}</h1>
        <p className="text-muted-foreground mt-2">
          {count > 0 ? (
            <>
              {t("common.showing")} {offset + 1}-{Math.min(offset + limit, count)} {t("common.of")} {count} {t("products.items")}
              {totalPages > 1 && (
                <> • {t("products.page")} {page} {t("common.of")} {totalPages}</>
              )}
            </>
          ) : (
            t("products.noProducts")
          )}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <ProductFilters categories={categories} selectedCategory={selectedCategory} />
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <ProductSort currentSort={currentSort} />
            </div>
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
                    quantity={product.quantity || 1}
                  />
                ))}
              </div>

              {totalPages > 0 && (
                <div className="mt-8">
                  <Pagination currentPage={page} totalPages={totalPages} baseUrl="/products" searchParams={searchParams} />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t("products.noProducts")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

