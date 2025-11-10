"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { ProductReviews } from "@/components/product-reviews"
import { useLanguage } from "@/lib/i18n/context"
import { Star } from "lucide-react"

interface ProductDetailContentProps {
  product: {
    id: string
    name: string
    slug: string
    description: string | null
    price: number
    compare_at_price: number | null
    images: string[]
    quantity: number
    sku: string | null
    categories: {
      id: string
      name: string
      slug: string
    } | null
    reviews: Array<{
      id: string
      rating: number
      title: string | null
      comment: string | null
      created_at: string
      profiles: {
        full_name: string | null
      }
    }>
  }
  averageRating: number
}

export function ProductDetailContent({ product, averageRating }: ProductDetailContentProps) {
  const { t } = useLanguage()
  const ratings = product.reviews?.map((r) => r.rating) || []
  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0

  const inStock = product.quantity > 0

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <Image
              src={product.images[0] || "/placeholder.svg?height=600&width=600"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {discount > 0 && (
              <Badge className="absolute top-4 right-4" variant="destructive">
                -{discount}%
              </Badge>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(1, 5).map((image: string, index: number) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={image || "/placeholder.svg?height=150&width=150"}
                    alt={`${product.name} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            {product.categories && <p className="text-sm text-muted-foreground mb-2">{product.categories.name}</p>}
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          </div>

          {/* Rating */}
          {ratings.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {averageRating.toFixed(1)} ({ratings.length} {t("productDetail.reviews")})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
            {product.compare_at_price && (
              <span className="text-xl text-muted-foreground line-through">${product.compare_at_price.toFixed(2)}</span>
            )}
          </div>

          {/* Stock Status */}
          <div>
            {inStock ? (
              <Badge variant="outline" className="text-green-600">
                {t("common.inStock")} ({product.quantity} {t("productDetail.available")})
              </Badge>
            ) : (
              <Badge variant="outline" className="text-red-600">
                {t("common.outOfStock")}
              </Badge>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="font-semibold mb-2">{t("product.description")}</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
          )}

          <Separator />

          {/* Add to Cart */}
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              images: product.images,
              quantity: product.quantity,
            }}
            className="w-full"
          />

          {/* Product Details */}
          <div className="space-y-2 text-sm">
            {product.sku && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("productDetail.sku")}:</span>
                <span className="font-medium">{product.sku}</span>
              </div>
            )}
            {product.categories && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("productDetail.category")}:</span>
                <span className="font-medium">{product.categories.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <ProductReviews productId={product.id} reviews={product.reviews || []} averageRating={averageRating} />
      </div>
    </div>
  )
}

