import Link from "next/link"
import { ShoppingCart } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-6 w-6" />
              <span className="font-bold text-xl">Store</span>
            </div>
            <p className="text-sm text-muted-foreground">Your one-stop shop for everything you need.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-muted-foreground hover:text-foreground transition-colors">
                  Deals
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/account" className="text-muted-foreground hover:text-foreground transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="text-muted-foreground hover:text-foreground transition-colors">
                  Orders
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-foreground transition-colors">
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
