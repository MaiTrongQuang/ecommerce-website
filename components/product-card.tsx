"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/use-cart"
import { useLanguage } from "@/lib/i18n/context"
import type { CartItem } from "@/lib/cart-slice"

interface ProductCardProps {
  id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number | null
  image: string
  quantity?: number
}

export function ProductCard({ id, name, slug, price, compareAtPrice, image, quantity = 1 }: ProductCardProps) {
  const { addToCart } = useCart()
  const { t } = useLanguage()
  const discount = compareAtPrice ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const cartItem: CartItem = {
      id,
      product_id: id,
      name,
      slug,
      price,
      quantity,
      image: image || "/placeholder.svg?height=400&width=400",
      stock: quantity, // You might want to fetch actual stock from product data
    }

    addToCart(cartItem)
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/products/${slug}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 rounded-md text-xs font-semibold">
              -{discount}%
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${slug}`}>
          <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">{name}</h3>
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold">${price.toFixed(2)}</span>
          {compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">${compareAtPrice.toFixed(2)}</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {t("common.addToCart")}
        </Button>
      </CardFooter>
    </Card>
  )
}
