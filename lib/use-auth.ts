"use client"

import { createClient } from "@/lib/client"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      router.refresh()
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  const signOut = async () => {
    try {
      // Option 1: Use API route (for server-side logging/monitoring)
      await fetch("/api/auth/logout", { method: "POST" })
      
      // Option 2: Direct client-side sign out (faster, recommended)
      await supabase.auth.signOut()
      
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error signing out:", error)
      // Fallback: try direct sign out
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
