import { createClient } from "@/lib/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { ProductReviews } from "@/components/product-reviews"
import { Star } from "lucide-react"

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      *,
      categories(id, name, slug),
      reviews(
        id,
        rating,
        title,
        comment,
        created_at,
        profiles(full_name)
      )
    `,
    )
    .eq("slug", slug)
    .eq("status", "active")
    .single()

  if (error || !product) {
    notFound()
  }

  // Calculate average rating
  const ratings = product.reviews?.map((r: any) => r.rating) || []
  const averageRating = ratings.length > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length : 0

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
                {averageRating.toFixed(1)} ({ratings.length} reviews)
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
                In Stock ({product.quantity} available)
              </Badge>
            ) : (
              <Badge variant="outline" className="text-red-600">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
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
                <span className="text-muted-foreground">SKU:</span>
                <span className="font-medium">{product.sku}</span>
              </div>
            )}
            {product.categories && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
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
