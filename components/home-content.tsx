"use client"

import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"

interface HomeContentProps {
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
}

export function HomeContent({ products, categories }: HomeContentProps) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-balance">
              {t("home.welcome")}
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty">
              {t("home.subtitle")}
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/products">
                  {t("home.shopNow")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/categories">{t("home.browseCategories")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories && categories.length > 0 && (
        <section className="container py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{t("home.shopByCategory")}</h2>
              <p className="text-muted-foreground mt-2">{t("home.browseCategoriesDesc")}</p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/categories">
                {t("common.viewAll")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/products?category=${category.id}`} className="group">
                <div className="aspect-square rounded-lg bg-muted flex items-center justify-center transition-colors group-hover:bg-muted/80">
                  <span className="text-4xl">📦</span>
                </div>
                <h3 className="mt-2 text-sm font-medium text-center group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {products && products.length > 0 && (
        <section className="container py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{t("home.featuredProducts")}</h2>
              <p className="text-muted-foreground mt-2">{t("home.featuredProductsDesc")}</p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/products">
                {t("common.viewAll")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-muted">
        <div className="container py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">{t("home.readyToShop")}</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t("home.readyToShopDesc")}
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/auth/signup">{t("home.createAccount")}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/products">{t("home.browseProducts")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

