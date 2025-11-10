"use client"

import { useCart } from "@/lib/use-cart"
import { useLanguage } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CartItem } from "@/components/cart-item"
import { ShoppingBag, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
  const { items, total, clearCart } = useCart()
  const { t } = useLanguage()

  const subtotal = total
  const shipping = total > 50 ? 0 : 10
  const tax = subtotal * 0.1
  const finalTotal = subtotal + shipping + tax

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("cart.title")}</h1>
        <p className="text-muted-foreground mt-2">
          {items.length} {items.length === 1 ? t("cart.item") : t("cart.items")} {t("cart.itemsInCart")}
        </p>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t("cart.empty")}</h2>
            <p className="text-muted-foreground mb-6">{t("cart.emptyDesc")}</p>
            <Button asChild>
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("cart.continueShopping")}
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
                  {t("cart.continueShopping")}
                </Link>
              </Button>
              <Button variant="ghost" onClick={clearCart}>
                {t("cart.clearCart")}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold">{t("cart.orderSummary")}</h2>
                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t("cart.shipping")}</span>
                    <span className="font-medium">{shipping === 0 ? t("checkout.free") : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t("cart.taxPercent")}</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{t("cart.total")}</span>
                    <span className="font-bold text-xl">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="bg-muted p-3 rounded-md text-sm">
                    <p className="text-muted-foreground">{t("cart.addMoreForFreeShipping").replace("{{amount}}", (50 - subtotal).toFixed(2))}</p>
                  </div>
                )}

                <Button className="w-full" size="lg" asChild>
                  <Link href="/checkout">{t("cart.proceedToCheckout")}</Link>
                </Button>

                <div className="text-center text-xs text-muted-foreground">{t("cart.secureCheckout")}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
