"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams?: Record<string, string | undefined>
}

export function Pagination({ currentPage, totalPages, baseUrl, searchParams = {} }: PaginationProps) {
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
  const maxVisible = 5
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  const endPage = Math.min(totalPages, startPage + maxVisible - 1)

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Button variant="outline" size="icon" asChild disabled={currentPage === 1}>
        <Link href={buildUrl(currentPage - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>

      {startPage > 1 && (
        <>
          <Button variant="outline" asChild>
            <Link href={buildUrl(1)}>1</Link>
          </Button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pages.map((page) => (
        <Button key={page} variant={page === currentPage ? "default" : "outline"} asChild={page !== currentPage}>
          {page === currentPage ? <span>{page}</span> : <Link href={buildUrl(page)}>{page}</Link>}
        </Button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <Button variant="outline" asChild>
            <Link href={buildUrl(totalPages)}>{totalPages}</Link>
          </Button>
        </>
      )}

      <Button variant="outline" size="icon" asChild disabled={currentPage === totalPages}>
        <Link href={buildUrl(currentPage + 1)}>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}
