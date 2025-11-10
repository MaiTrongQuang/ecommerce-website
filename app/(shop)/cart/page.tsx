"use client"

import { useCart } from "@/lib/use-cart"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CartItem } from "@/components/cart-item"
import { ShoppingBag, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
  const { items, total, clearCart } = useCart()

  const subtotal = total
  const shipping = total > 50 ? 0 : 10
  const tax = subtotal * 0.1
  const finalTotal = subtotal + shipping + tax

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
        <p className="text-muted-foreground mt-2">
          {items.length} {items.length === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add items to get started</p>
            <Button asChild>
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                {items.map((item) => (
                  <div key={item.product_id}>
                    <CartItem item={item} />
                    <Separator className="mt-4" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <Button variant="outline" asChild>
                <Link href="/products">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
              <Button variant="ghost" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold">Order Summary</h2>
                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-xl">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="bg-muted p-3 rounded-md text-sm">
                    <p className="text-muted-foreground">Add ${(50 - subtotal).toFixed(2)} more for free shipping!</p>
                  </div>
                )}

                <Button className="w-full" size="lg" asChild>
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>

                <div className="text-center text-xs text-muted-foreground">Secure checkout powered by Stripe</div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
