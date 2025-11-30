"use client"

import { HeroSection } from "@/components/landing/hero-section"
import { TimelineSection } from "@/components/landing/timeline"
import { StatsSection } from "@/components/landing/stats-section"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"
import { motion } from "framer-motion"
import Image from "next/image"

interface LandingPageProps {
  products: Array<{
    id: string
    name: string
    slug: string
    price: number
    compare_at_price?: number | null
    images: string[]
    quantity: number
  }>
  categories: Array<{
    id: string
    name: string
    slug: string
  }>
}

export function LandingPage({ products, categories }: LandingPageProps) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      
      <StatsSection />

      {/* Categories Section */}
      <section className="py-20 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold tracking-tight">{t("home.shopByCategory")}</h2>
              <p className="text-muted-foreground mt-2">{t("home.browseCategoriesDesc")}</p>
            </motion.div>
            <Button variant="ghost" asChild className="group">
              <Link href="/categories">
                {t("common.viewAll")}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/products?category=${category.id}`} className="group block h-full">
                  <div className="aspect-square rounded-2xl bg-muted overflow-hidden relative shadow-sm border group-hover:shadow-md transition-all">
                    <Image
                      src={`/images/categories/${category.slug}.png`}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-center group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <TimelineSection />

      {/* Featured Products Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold tracking-tight">{t("home.featuredProducts")}</h2>
              <p className="text-muted-foreground mt-2">{t("home.featuredProductsDesc")}</p>
            </motion.div>
            <Button variant="ghost" asChild className="group">
              <Link href="/products">
                {t("common.viewAll")}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={product.price}
                  compareAtPrice={product.compare_at_price}
                  image={product.images[0] || "/placeholder.svg?height=400&width=400"}
                  quantity={product.quantity || 1}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
