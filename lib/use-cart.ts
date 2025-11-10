"use client"

import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateQuantity as updateQuantityAction,
  clearCart as clearCartAction,
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
  type CartItem,
  openCart,
  closeCart,
  toggleCart,
  selectIsCartOpen,
} from "@/lib/cart-slice"
import { createClient } from "@/lib/client"
import { useAuth } from "./use-auth"
import { useCallback } from "react"
import { toast } from "sonner"

export function useCart() {
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectCartItems)
  const total = useAppSelector(selectCartTotal)
  const itemCount = useAppSelector(selectCartItemCount)
  const isOpen = useAppSelector(selectIsCartOpen)
  const { user } = useAuth()
  const supabase = createClient()

  const addToCart = useCallback(
    async (item: CartItem) => {
      dispatch(addToCartAction(item))
      dispatch(openCart())

      if (user) {
        try {
          await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              product_id: item.product_id,
              quantity: item.quantity,
            }),
          })
        } catch (error) {
          console.error("[v0] Error syncing cart:", error)
        }
      }

      toast.success("Added to cart", {
        description: `${item.name} has been added to your cart`,
      })
    },
    [dispatch, user],
  )

  const removeFromCart = useCallback(
    async (productId: string) => {
      const item = items.find((i) => i.product_id === productId)
      dispatch(removeFromCartAction(productId))

      if (user && item) {
        try {
          await fetch(`/api/cart/${item.id}`, {
            method: "DELETE",
          })
        } catch (error) {
          console.error("[v0] Error removing from cart:", error)
        }
      }

      toast.success("Removed from cart")
    },
    [dispatch, user, items],
  )

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId)
        return
      }

      const item = items.find((i) => i.product_id === productId)
      dispatch(updateQuantityAction({ product_id: productId, quantity }))

      if (user && item) {
        try {
          await fetch(`/api/cart/${item.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity }),
          })
        } catch (error) {
          console.error("[v0] Error updating cart:", error)
        }
      }
    },
    [dispatch, user, items, removeFromCart],
  )

  const clearCart = useCallback(() => {
    dispatch(clearCartAction())
  }, [dispatch])

  const toggleCartDrawer = useCallback(() => {
    dispatch(toggleCart())
  }, [dispatch])

  const openCartDrawer = useCallback(() => {
    dispatch(openCart())
  }, [dispatch])

  const closeCartDrawer = useCallback(() => {
    dispatch(closeCart())
  }, [dispatch])

  return {
    items,
    total,
    itemCount,
    isOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart: toggleCartDrawer,
    openCart: openCartDrawer,
    closeCart: closeCartDrawer,
  }
}
