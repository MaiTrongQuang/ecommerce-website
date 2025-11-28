"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { ProductReviews } from "@/components/product-reviews"
import { useLanguage } from "@/lib/i18n/context"
import { formatPrice } from "@/lib/utils/format-price"
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
      profiles?: {
        full_name: string | null
      }
    }>
  }
  averageRating: number
}

export function ProductDetailContent({ product, averageRating }: ProductDetailContentProps) {
  const { t, language } = useLanguage()
  const [selectedImage, setSelectedImage] = useState(product.images[0] || "/placeholder.svg?height=600&width=600")
  const [quantity, setQuantity] = useState(1)

  const ratings = product.reviews?.map((r) => r.rating) || []
  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0

  const inStock = product.quantity > 0

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= product.quantity) {
      setQuantity(newQuantity)
    }
  }

  return (
    <div className="container py-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-muted border shadow-sm">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-cover transition-all duration-300 hover:scale-105"
              priority
            />
            {discount > 0 && (
              <Badge className="absolute top-4 right-4 text-lg px-3 py-1" variant="destructive">
                -{discount}%
              </Badge>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`relative aspect-square overflow-hidden rounded-lg bg-muted border-2 transition-all ${
                    selectedImage === image ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-muted-foreground/25"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg?height=150&width=150"}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div className="space-y-2">
            {product.categories && (
              <p className="text-sm font-medium text-primary uppercase tracking-wide">{product.categories.name}</p>
            )}
            <h1 className="text-4xl font-bold tracking-tight text-foreground">{product.name}</h1>
            
            {/* Rating */}
            {ratings.length > 0 ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground font-medium">
                  {averageRating.toFixed(1)} ({ratings.length} {t("productDetail.reviews")})
                </span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t("productDetail.noReviews")}</p>
            )}
          </div>

          <div className="space-y-4">
             {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-foreground">{formatPrice(product.price, language)}</span>
              {product.compare_at_price && (
                <span className="text-xl text-muted-foreground line-through decoration-2 decoration-muted-foreground/50">
                  {formatPrice(product.compare_at_price, language)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div>
              {inStock ? (
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  {t("common.inStock")} ({product.quantity} {t("productDetail.available")})
                </div>
              ) : (
                <Badge variant="destructive" className="text-base px-3 py-1">
                  {t("common.outOfStock")}
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Description */}
          {product.description && (
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <h3 className="text-lg font-semibold mb-2">{t("product.description")}</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Quantity Selector */}
            {inStock && (
              <div className="flex items-center gap-4">
                <span className="font-medium">{t("productDetail.quantity")}:</span>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-none rounded-l-md"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <div className="h-10 w-12 flex items-center justify-center border-x font-medium">
                    {quantity}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-none rounded-r-md"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.quantity}
                  >
                    +
                  </Button>
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="flex gap-4">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  images: product.images,
                  quantity: product.quantity,
                }}
                quantity={quantity}
                className="flex-1 h-12 text-lg"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-muted/30 p-4 rounded-lg space-y-3 text-sm border">
            {product.sku && (
              <div className="flex justify-between border-b pb-2 last:border-0 last:pb-0 border-border/50">
                <span className="text-muted-foreground">{t("productDetail.sku")}</span>
                <span className="font-medium">{product.sku}</span>
              </div>
            )}
            {product.categories && (
              <div className="flex justify-between border-b pb-2 last:border-0 last:pb-0 border-border/50">
                <span className="text-muted-foreground">{t("productDetail.category")}</span>
                <span className="font-medium">{product.categories.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 pt-16 border-t">
        <ProductReviews productId={product.id} reviews={product.reviews || []} averageRating={averageRating} />
      </div>
    </div>
  )
}

