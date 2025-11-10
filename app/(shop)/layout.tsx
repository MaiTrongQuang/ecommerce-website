"use client"

import type React from "react"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useCartSync } from "@/lib/use-cart-sync"

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useCartSync()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
