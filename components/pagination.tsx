"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams?: Record<string, string | undefined>
}

export function Pagination({ currentPage, totalPages, baseUrl, searchParams = {} }: PaginationProps) {
  const { t } = useLanguage()
  
  const buildUrl = (page: number) => {
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== "page") {
        params.set(key, value)
      }
    })
    params.set("page", page.toString())
    return `${baseUrl}?${params.toString()}`
  }

  const pages = []
  const maxVisible = 7
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  const endPage = Math.min(totalPages, startPage + maxVisible - 1)

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Page Info - Always show */}
      <div className="text-sm text-muted-foreground">
        {t("products.page")} <span className="font-medium text-foreground">{currentPage}</span> {t("common.of")} <span className="font-medium text-foreground">{totalPages}</span>
      </div>

      {/* Pagination Controls - Only show if more than 1 page */}
      {totalPages > 1 && (
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <Button 
          variant="outline" 
          size="sm"
          asChild 
          disabled={currentPage === 1}
          className="gap-1"
        >
          <Link href={buildUrl(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{t("common.previous")}</span>
          </Link>
        </Button>

        {startPage > 1 && (
          <>
            <Button variant="outline" size="sm" asChild>
              <Link href={buildUrl(1)}>1</Link>
            </Button>
            {startPage > 2 && (
              <span className="px-2 text-muted-foreground">...</span>
            )}
          </>
        )}

        {pages.map((page) => (
          <Button 
            key={page} 
            variant={page === currentPage ? "default" : "outline"} 
            size="sm"
            asChild={page !== currentPage}
            className={page === currentPage ? "min-w-[2.5rem]" : ""}
          >
            {page === currentPage ? (
              <span>{page}</span>
            ) : (
              <Link href={buildUrl(page)}>{page}</Link>
            )}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-2 text-muted-foreground">...</span>
            )}
            <Button variant="outline" size="sm" asChild>
              <Link href={buildUrl(totalPages)}>{totalPages}</Link>
            </Button>
          </>
        )}

        <Button 
          variant="outline" 
          size="sm"
          asChild 
          disabled={currentPage === totalPages}
          className="gap-1"
        >
          <Link href={buildUrl(currentPage + 1)}>
            <span className="hidden sm:inline">{t("common.next")}</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      )}
    </div>
  )
}
