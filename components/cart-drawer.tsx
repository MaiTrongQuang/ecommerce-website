"use client"

import { useCart } from "@/lib/use-cart"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CartItem } from "./cart-item"
import { ShoppingBag } from "lucide-react"
import Link from "next/link"

export function CartDrawer() {
  const { items, total, isOpen, closeCart } = useCart()

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({items.length})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <div className="text-center">
              <h3 className="font-semibold text-lg">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground mt-1">Add items to get started</p>
            </div>
            <Button onClick={closeCart} asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={item.product_id} item={item} />
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4">
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">{total > 50 ? "FREE" : "$10.00"}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">${(total + (total > 50 ? 0 : 10)).toFixed(2)}</span>
                </div>
              </div>

              <SheetFooter className="flex-col gap-2 sm:flex-col">
                <Button className="w-full" size="lg" asChild onClick={closeCart}>
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button variant="outline" className="w-full bg-transparent" onClick={closeCart} asChild>
                  <Link href="/cart">View Cart</Link>
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
