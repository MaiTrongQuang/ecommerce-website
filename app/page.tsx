import { createClient } from "@/lib/server"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Sparkles, Shield, Truck, Headphones } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default async function Home() {
  const supabase = await createClient()

  // Fetch featured products
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("status", "active")
    .limit(8)
    .order("created_at", { ascending: false })

  // Fetch categories
  const { data: categories } = await supabase.from("categories").select("*").limit(6)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="container relative py-24 md:py-32 lg:py-40">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/50 px-4 py-2 text-sm backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">New arrivals every week</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-balance">
                Welcome to Your{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Favorite Store
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty sm:text-xl md:max-w-2xl md:mx-auto">
                Discover amazing products at unbeatable prices. Shop the latest trends and find everything you need in one
                place.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="group" asChild>
                  <Link href="/products">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/categories">Browse Categories</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-b bg-muted/30">
          <div className="container py-12">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Free Shipping</h3>
                <p className="text-sm text-muted-foreground">On orders over $50</p>
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Secure Payment</h3>
                <p className="text-sm text-muted-foreground">100% secure checkout</p>
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <Headphones className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">We're here to help</p>
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Best Quality</h3>
                <p className="text-sm text-muted-foreground">Premium products</p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        {categories && categories.length > 0 && (
          <section className="container py-16 md:py-24">
            <div className="flex flex-col items-center justify-between gap-4 mb-12 sm:flex-row">
              <div className="text-center sm:text-left">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Shop by Category</h2>
                <p className="text-muted-foreground mt-2">Browse our wide selection of categories</p>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/categories">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.id}`}
                  className="group relative overflow-hidden rounded-lg transition-all hover:scale-105"
                >
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center transition-all duration-300 group-hover:from-primary/10 group-hover:to-primary/5 group-hover:shadow-lg">
                    <span className="text-4xl transition-transform duration-300 group-hover:scale-110">
                      📦
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-medium text-center group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured Products Section */}
        {products && products.length > 0 && (
          <section className="container py-16 md:py-24">
            <div className="flex flex-col items-center justify-between gap-4 mb-12 sm:flex-row">
              <div className="text-center sm:text-left">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Products</h2>
                <p className="text-muted-foreground mt-2">Check out our latest and most popular items</p>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/products">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={product.price}
                  compareAtPrice={product.compare_at_price}
                  image={product.images?.[0] || "/placeholder.svg?height=400&width=400"}
                  onAddToCart={() => {}}
                />
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-muted/50 to-background">
          <div className="container py-16 md:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Start Shopping?</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join thousands of satisfied customers and discover amazing deals today.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="group" asChild>
                  <Link href="/auth/signup">
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/products">Browse Products</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
