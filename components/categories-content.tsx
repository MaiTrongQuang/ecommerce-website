"use client"

import { useLanguage } from "@/lib/i18n/context"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

import Image from "next/image"

interface CategoriesContentProps {
  categories: Array<{
    id: string
    name: string
    slug: string
  }>
}

export function CategoriesContent({ categories }: CategoriesContentProps) {
  const { t } = useLanguage()

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.back")}
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{t("common.categories")}</h1>
        <p className="text-muted-foreground mt-2">{t("home.browseCategoriesDesc")}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link 
            key={category.id} 
            href={`/products?category=${category.id}`}
            className="group relative overflow-hidden rounded-lg border bg-background p-4 hover:shadow-lg transition-all"
          >
            <div className="aspect-square mb-4 rounded-md bg-muted overflow-hidden relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/images/categories/${category.slug}.png`}
                alt={category.name}
                className="object-cover w-full h-full transition-transform group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                  e.currentTarget.parentElement!.innerHTML = '<span class="text-4xl">📦</span>';
                }}
              />
            </div>
            <h3 className="font-semibold text-center group-hover:text-primary transition-colors">
              {category.name}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  )
}
