"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/user-menu"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useCart } from "@/lib/use-cart"
import { Badge } from "@/components/ui/badge"
import { CartDrawer } from "@/components/cart-drawer"
import { useLanguage } from "@/lib/i18n/context"
import { SiteSearch } from "@/components/site-search"

export function SiteHeader() {
  const { itemCount, toggleCart } = useCart()
  const { t } = useLanguage()

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative h-8 w-8">
                <Image src="/logo.png" alt="Quang Store Logo" fill className="object-contain" />
              </div>
              <span className="font-bold text-xl">Quang Store</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/products" className="text-sm font-medium transition-colors hover:text-primary">
                {t("common.products")}
              </Link>
              <Link href="/categories" className="text-sm font-medium transition-colors hover:text-primary">
                {t("common.categories")}
              </Link>
              <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
                {t("common.about")}
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <SiteSearch />
            </div>

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
              <div className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <CartDrawer />
    </>
  )
}
