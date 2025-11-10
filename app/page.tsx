import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShoppingCart } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <ShoppingCart className="h-6 w-6" />
            <span className="font-bold text-xl">Store</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-sm font-medium transition-colors hover:text-primary">
              Products
            </Link>
            <Link href="/categories" className="text-sm font-medium transition-colors hover:text-primary">
              Categories
            </Link>
            <Link href="/deals" className="text-sm font-medium transition-colors hover:text-primary">
              Deals
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="container py-24 md:py-32">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Welcome to Your Favorite Store
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Discover amazing products at unbeatable prices. Shop the latest trends and find everything you need in one place.
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
        <section className="container py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
              <p className="text-muted-foreground mt-2">Browse our wide selection of categories</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Electronics", icon: "📱" },
              { name: "Fashion", icon: "👕" },
              { name: "Home", icon: "🏠" },
              { name: "Books", icon: "📚" },
              { name: "Sports", icon: "⚽" },
              { name: "Toys", icon: "🎮" },
            ].map((category) => (
              <Link key={category.name} href={`/products?category=${category.name}`} className="group">
                <div className="aspect-square rounded-lg bg-muted flex items-center justify-center transition-colors group-hover:bg-muted/80">
                  <span className="text-4xl">{category.icon}</span>
                </div>
                <h3 className="mt-2 text-sm font-medium text-center group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products Section */}
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
            {[
              { name: "Product 1", price: "$99.99" },
              { name: "Product 2", price: "$149.99" },
              { name: "Product 3", price: "$79.99" },
              { name: "Product 4", price: "$199.99" },
            ].map((product) => (
              <div key={product.name} className="rounded-lg border bg-card p-4">
                <div className="aspect-square rounded-md bg-muted mb-4 flex items-center justify-center">
                  <span className="text-4xl">📦</span>
                </div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground mt-2">{product.price}</p>
                <Button size="sm" className="mt-4 w-full">
                  Add to Cart
                </Button>
              </div>
            ))}
          </div>
        </section>

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
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">About Us</h3>
              <p className="text-sm text-muted-foreground">Your one-stop shop for everything you need.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/products" className="hover:text-primary">Products</Link></li>
                <li><Link href="/categories" className="hover:text-primary">Categories</Link></li>
                <li><Link href="/deals" className="hover:text-primary">Deals</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/help" className="hover:text-primary">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8">
            <p className="text-sm text-muted-foreground text-center">
              © 2024 Store. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
