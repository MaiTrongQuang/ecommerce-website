"use client"

import { useCart } from "@/lib/use-cart"
import { useLanguage } from "@/lib/i18n/context"
import { formatPrice } from "@/lib/utils/format-price"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CartItem } from "./cart-item"
import { ShoppingBag } from "lucide-react"
import Link from "next/link"

export function CartDrawer() {
  const { items, total, isOpen, closeCart } = useCart()
  const { t, language } = useLanguage()
  const shipping = total > 500000 ? 0 : 30000 // Free shipping over 500,000 VND
  const tax = total * 0.1
  const finalTotal = total + shipping + tax

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg p-0">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle>{t("cart.title")} ({items.length})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <div className="text-center">
              <h3 className="font-semibold text-lg">{t("cart.empty")}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t("cart.emptyDesc")}</p>
            </div>
            <Button onClick={closeCart} asChild>
              <Link href="/products">{t("cart.continueShopping")}</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-4 pb-4">
                {items.map((item) => (
                  <CartItem key={item.product_id} item={item} />
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 px-6 pt-4 pb-6 border-t">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                  <span className="font-medium">{formatPrice(total, language)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("cart.shipping")}</span>
                  <span className="font-medium">{shipping === 0 ? t("checkout.free") : formatPrice(shipping, language)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("cart.taxPercent")}</span>
                  <span className="font-medium">{formatPrice(tax, language)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{t("cart.total")}</span>
                  <span className="font-bold text-lg">{formatPrice(finalTotal, language)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button className="w-full" size="lg" asChild onClick={closeCart}>
                  <Link href="/checkout">{t("cart.proceedToCheckout")}</Link>
                </Button>
                <Button variant="outline" className="w-full bg-transparent" onClick={closeCart} asChild>
                  <Link href="/cart">{t("cart.title")}</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
