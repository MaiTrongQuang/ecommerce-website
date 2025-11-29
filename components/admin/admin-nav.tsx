"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut
} from "lucide-react"
import { useAuth } from "@/lib/use-auth"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/context"
import { LanguageSwitcher } from "@/components/language-switcher"

export function AdminNav() {
  const pathname = usePathname()
  const { signOut } = useAuth()
  const { t } = useLanguage()

  const navItems = [
    {
      title: t("admin.dashboard"),
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: t("admin.products"),
      href: "/admin/products",
      icon: Package,
    },
    {
      title: t("admin.orders"),
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      title: t("admin.customers"),
      href: "/admin/customers",
      icon: Users,
    },
  ]

  return (
    <div className="flex flex-col h-full border-r bg-muted/10">
      <div className="p-6 border-b flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-primary">Admin</span>Panel
        </Link>
        <LanguageSwitcher />
      </div>
      
      <div className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
              pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.title}
          </Link>
        ))}
      </div>

      <div className="p-4 border-t space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Settings className="h-5 w-5" />
          {t("admin.backToStore")}
        </Link>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 px-4 text-muted-foreground hover:text-destructive"
          onClick={() => signOut()}
        >
          <LogOut className="h-5 w-5" />
          {t("admin.signOut")}
        </Button>
      </div>
    </div>
  )
}
