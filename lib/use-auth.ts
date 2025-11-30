"use client"

import { createClient } from "@/lib/client"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAppDispatch } from "@/lib/hooks"
import { clearCart } from "@/lib/cart-slice"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      
      // Only refresh on sign in or sign out to avoid infinite loops
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        router.refresh()
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  const signOut = async () => {
    try {
      // Clear cart from Redux store first
      dispatch(clearCart())
      
      // Use API route to clear cart from database and sign out
      await fetch("/api/auth/logout", { method: "POST" })
      
      // Direct client-side sign out as fallback
      await supabase.auth.signOut()
      
      // Redirect to home page
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error signing out:", error)
      // Fallback: clear cart and try direct sign out
      dispatch(clearCart())
      await supabase.auth.signOut()
      router.push("/")
      router.refresh()
    }
  }

  return {
    user,
    loading,
    signOut,
  }
}
