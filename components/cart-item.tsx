"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "@/lib/use-cart"
import type { CartItem as CartItemType } from "@/lib/cart-slice"

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart()

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= item.stock) {
      updateQuantity(item.product_id, newQuantity)
    }
  }

  return (
    <div className="flex gap-4">
      <Link
        href={`/products/${item.slug}`}
        className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted"
      >
        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
      </Link>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/products/${item.slug}`}
            className="font-medium text-sm hover:text-primary transition-colors line-clamp-2"
          >
            {item.name}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex-shrink-0"
            onClick={() => removeFromCart(item.product_id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input
              type="number"
              min="1"
              max={item.stock}
              value={item.quantity}
              onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
              className="h-8 w-16 text-center"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= item.stock}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
