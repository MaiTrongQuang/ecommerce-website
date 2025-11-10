"use client"

import type React from "react"

import Link from "next/link"
import { ShoppingCart, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserMenu } from "@/components/user-menu"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useCart } from "@/lib/use-cart"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { CartDrawer } from "@/components/cart-drawer"
import { useLanguage } from "@/lib/i18n/context"

export function SiteHeader() {
  const { itemCount, toggleCart } = useCart()
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <ShoppingCart className="h-6 w-6" />
              <span className="font-bold text-xl">{t("common.store")}</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/products" className="text-sm font-medium transition-colors hover:text-primary">
                {t("common.products")}
              </Link>
              <Link href="/categories" className="text-sm font-medium transition-colors hover:text-primary">
                {t("common.categories")}
              </Link>
              <Link href="/deals" className="text-sm font-medium transition-colors hover:text-primary">
                {t("common.deals")}
              </Link>
            </nav>
          </div>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("common.search")}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button variant="ghost" size="icon" className="relative" onClick={toggleCart}>
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>
            <UserMenu />
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      <CartDrawer />
    </>
  )
}
