"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/use-cart"
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
  quantity?: number
  className?: string
}

export function AddToCartButton({ product, quantity = 1, className }: AddToCartButtonProps) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: product.id,
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity,
      image: product.images[0] || "/placeholder.svg?height=400&width=400",
      stock: product.quantity,
    }

    addToCart(cartItem)
  }

  return (
    <Button onClick={handleAddToCart} className={className}>
      <ShoppingCart className="mr-2 h-4 w-4" />
      Add to Cart
    </Button>
  )
}
