"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/lib/i18n/context"

interface ProductSortProps {
  currentSort: string
}

export function ProductSort({ currentSort }: ProductSortProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", value)
    params.delete("page") // Reset to first page
    router.push(`/products?${params.toString()}`)
  }

  return (
    <Select value={currentSort} onValueChange={handleSortChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={t("products.sortBy")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="created_at-desc">{t("sort.newest")}</SelectItem>
        <SelectItem value="created_at-asc">{t("sort.oldest")}</SelectItem>
        <SelectItem value="price-asc">{t("sort.priceLowToHigh")}</SelectItem>
        <SelectItem value="price-desc">{t("sort.priceHighToLow")}</SelectItem>
        <SelectItem value="name-asc">{t("sort.nameAToZ")}</SelectItem>
        <SelectItem value="name-desc">{t("sort.nameZToA")}</SelectItem>
      </SelectContent>
    </Select>
  )
}
