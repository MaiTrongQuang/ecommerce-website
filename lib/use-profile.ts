"use client"

import { createClient } from "@/lib/client"
import { useEffect, useState } from "react"
import { useAuth } from "./use-auth"

interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: "customer" | "admin"
  created_at: string
  updated_at: string
}

export function useProfile() {
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (authLoading) {
      return
    }

    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    // Reset loading to true when we have a user but are about to fetch profile
    setLoading(true)

    const fetchProfile = async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (!error && data) {
        setProfile(data)
      }
      setLoading(false)
    }

    fetchProfile()
  }, [user, authLoading, supabase])

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error("Not authenticated") }

    const { data, error } = await supabase.from("profiles").update(updates).eq("id", user.id).select().single()

    if (!error && data) {
      setProfile(data)
    }

    return { data, error }
  }

  return {
    profile,
    loading,
    updateProfile,
    isAdmin: profile?.role === "admin",
  }
}
