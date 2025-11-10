"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/use-cart"
import { useLanguage } from "@/lib/i18n/context"
import type { CartItem } from "@/lib/cart-slice"

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    images: string[]
    quantity: number
  }
  className?: string
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const { t } = useLanguage()

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: product.id,
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity: 1, // Always add 1 item at a time
      image: product.images[0] || "/placeholder.svg?height=400&width=400",
      stock: product.quantity,
    }

    addToCart(cartItem)
  }

  return (
    <Button onClick={handleAddToCart} className={className}>
      <ShoppingCart className="mr-2 h-4 w-4" />
      {t("common.addToCart")}
    </Button>
  )
}
