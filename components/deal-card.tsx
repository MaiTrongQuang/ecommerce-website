"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, ArrowRight, Percent } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"
import { formatPrice } from "@/lib/utils/format-price"
import { useCart } from "@/lib/use-cart"

interface Deal {
  id: string
  title: string
  description: string | null
  discount_percentage: number
  discount_amount: number | null
  start_date: string
  end_date: string
  status: string
  image_url: string | null
  banner_image_url: string | null
  product_ids: string[] | null
  category_ids: string[] | null
  min_purchase_amount: number | null
  max_discount_amount: number | null
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compare_at_price: number | null
  images: string[]
  quantity: number
  categories?: {
    name: string
    slug: string
  } | null
}

interface DealCardProps {
  deal: Deal
  products: Product[]
  remainingTime: string | null
}

export function DealCard({ deal, products, remainingTime }: DealCardProps) {
  const { t, language } = useLanguage()
  const { addToCart } = useCart()

  const calculateDealPrice = (product: Product) => {
    if (deal.discount_percentage > 0) {
      const discount = (product.price * deal.discount_percentage) / 100
      const finalDiscount = deal.max_discount_amount
        ? Math.min(discount, deal.max_discount_amount)
        : discount
      return product.price - finalDiscount
    }
    if (deal.discount_amount) {
      return Math.max(0, product.price - deal.discount_amount)
    }
    return product.price
  }

  return (
    <Card className="overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all">
      {/* Banner Image or Discount Badge */}
      {deal.banner_image_url ? (
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-r from-primary/20 to-primary/10">
          <Image
            src={deal.banner_image_url}
            alt={deal.title}
            fill
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="absolute top-4 right-4">
            <Badge className="bg-primary text-primary-foreground text-lg px-4 py-2">
              <Percent className="h-4 w-4 mr-1" />
              {deal.discount_percentage}% {t("deals.off")}
            </Badge>
          </div>
        </div>
      ) : (
        <div className="relative h-32 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-background p-6 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">{deal.title}</h3>
            {deal.description && (
              <p className="text-muted-foreground text-sm">{deal.description}</p>
            )}
          </div>
          <Badge className="bg-primary text-primary-foreground text-xl px-6 py-3">
            <Percent className="h-5 w-5 mr-2" />
            {deal.discount_percentage}% {t("deals.off")}
          </Badge>
        </div>
      )}

      <CardContent className="p-6">
        {/* Deal Info */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {remainingTime && (
              <Badge variant="outline" className="text-sm">
                <Clock className="h-4 w-4 mr-2" />
                {t("deals.endsIn")} {remainingTime}
              </Badge>
            )}
            {deal.min_purchase_amount && (
              <Badge variant="secondary" className="text-sm">
                {t("deals.minPurchase")} {formatPrice(deal.min_purchase_amount, language)}
              </Badge>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <>
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-4">
                {t("deals.productsInDeal")} ({products.length})
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => {
                const dealPrice = calculateDealPrice(product)
                const originalPrice = product.compare_at_price || product.price

                return (
                  <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all">
                    <Link href={`/products/${product.slug}`}>
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
                          {deal.discount_percentage}% {t("product.discount")}
                        </Badge>
                      </div>
                    </Link>
                    <div className="p-4">
                      <Link href={`/products/${product.slug}`}>
                        <h5 className="font-semibold line-clamp-2 hover:text-primary transition-colors mb-2">
                          {product.name}
                        </h5>
                      </Link>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(dealPrice, language)}
                        </span>
                        {originalPrice > dealPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(originalPrice, language)}
                          </span>
                        )}
                      </div>
                      <Button
                        className="w-full"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          addToCart({
                            id: product.id,
                            product_id: product.id,
                            name: product.name,
                            slug: product.slug,
                            price: dealPrice,
                            quantity: 1,
                            image: product.images[0] || "/placeholder.svg?height=400&width=400",
                            stock: product.quantity,
                          })
                        }}
                      >
                        {t("common.addToCart")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>{t("deals.noProducts")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

