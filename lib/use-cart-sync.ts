"use client"

import { useEffect } from "react"
import { useAuth } from "./use-auth"
import { useAppDispatch } from "@/lib/hooks"
import { setCartItems, type CartItem } from "@/lib/cart-slice"

export function useCartSync() {
  const { user } = useAuth()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!user) return

    const syncCart = async () => {
      try {
        const response = await fetch("/api/cart")
        if (!response.ok) return

        const data = await response.json()
        const cartItems: CartItem[] = data.items.map((item: any) => ({
          id: item.id,
          product_id: item.product_id,
          name: item.products.name,
          slug: item.products.slug,
          price: item.products.price,
          quantity: item.quantity,
          image: item.products.images[0] || "/placeholder.svg?height=400&width=400",
          stock: item.products.stock,
        }))

        dispatch(setCartItems(cartItems))
      } catch (error) {
        console.error("[v0] Error syncing cart:", error)
      }
    }

    syncCart()
  }, [user, dispatch])
}
