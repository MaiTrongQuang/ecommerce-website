import { createClient } from "@/lib/server"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default async function HomePage() {
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
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-balance">
              Welcome to Your Favorite Store
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty">
              Discover amazing products at unbeatable prices. Shop the latest trends and find everything you need in one
              place.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/categories">Browse Categories</Link>
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
              <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
              <p className="text-muted-foreground mt-2">Browse our wide selection of categories</p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/categories">
                View All
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
              <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
              <p className="text-muted-foreground mt-2">Check out our latest and most popular items</p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/products">
                View All
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
            <h2 className="text-3xl font-bold tracking-tight">Ready to Start Shopping?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of satisfied customers and discover amazing deals today.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/auth/signup">Create Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
