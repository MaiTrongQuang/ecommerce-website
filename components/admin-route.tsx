"use client"

import type React from "react"

import { useProfile } from "@/lib/use-profile"
import { useLanguage } from "@/lib/i18n/context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useProfile()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!profile || profile.role !== "admin")) {
      router.push("/")
    }
  }, [profile, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  if (!profile || profile.role !== "admin") {
    return null
  }

  return <>{children}</>
}
