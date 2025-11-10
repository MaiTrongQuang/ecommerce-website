"use client"

import { useLanguage } from "@/lib/i18n/context"
import { DealCard } from "@/components/deal-card"
import { Badge } from "@/components/ui/badge"
import { Clock, Sparkles } from "lucide-react"
import { formatPrice } from "@/lib/utils/format-price"

interface Deal {
  id: string
  title: string
  description: string | null
  discount_percentage: number
  discount_amount: number | null
  start_date: string
  end_date: string
  status: string
  image_url: string | null
  banner_image_url: string | null
  product_ids: string[] | null
  category_ids: string[] | null
  min_purchase_amount: number | null
  max_discount_amount: number | null
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compare_at_price: number | null
  images: string[]
  quantity: number
  categories?: {
    name: string
    slug: string
  } | null
}

interface DealsContentProps {
  deals: Deal[]
  products: Product[]
}

export function DealsContent({ deals, products }: DealsContentProps) {
  const { t, language } = useLanguage()

  const getRemainingTime = (endDate: string) => {
    const now = new Date()
    const end = new Date(endDate)
    const diff = end.getTime() - now.getTime()

    if (diff <= 0) return null

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const getDealProducts = (deal: Deal) => {
    if (!deal.product_ids || deal.product_ids.length === 0) return []
    return products.filter((p) => deal.product_ids?.includes(p.id))
  }

  if (deals.length === 0) {
    return (
      <div className="container py-12">
        <div className="text-center py-16">
          <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">{t("deals.noDeals")}</h2>
          <p className="text-muted-foreground">{t("deals.noDealsDesc")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
        <div className="container py-12">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">{t("deals.title")}</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {t("deals.subtitle")}
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Active Deals Count */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {deals.length} {t("deals.activeDeals")}
            </Badge>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="space-y-8">
          {deals.map((deal) => {
            const dealProducts = getDealProducts(deal)
            const remainingTime = getRemainingTime(deal.end_date)

            return (
              <div key={deal.id} className="relative">
                <DealCard
                  deal={deal}
                  products={dealProducts}
                  remainingTime={remainingTime}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

