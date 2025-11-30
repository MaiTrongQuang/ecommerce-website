"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShoppingBag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-background to-muted/30">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm text-primary font-medium">
              Chào mừng đến với Quang Store
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Khám phá Tinh hoa <br />
              <span className="text-primary">Văn hóa Việt Nam</span>
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Nơi hội tụ những sản phẩm đặc sản, thủ công mỹ nghệ và quà tặng độc đáo từ khắp mọi miền đất nước. Chất lượng tuyệt hảo, đậm đà bản sắc.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/products">
                <Button size="lg" className="gap-2 group">
                  Mua sắm ngay
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">
                  Tìm hiểu thêm
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold">
                    {i}k+
                  </div>
                ))}
              </div>
              <p>Hơn 10,000 khách hàng tin dùng</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative mx-auto aspect-square w-full max-w-[500px] lg:order-last"
          >
            <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-2xl border bg-background/50 backdrop-blur-sm p-2">
               {/* Placeholder for a hero image, using a grid of product categories or a featured image */}
               <div className="grid grid-cols-2 gap-2 h-full w-full">
                  <div className="relative h-full w-full rounded-xl overflow-hidden bg-muted">
                    <Image src="/images/categories/ca-phe-tra.png" alt="Cà phê" fill className="object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="grid grid-rows-2 gap-2 h-full w-full">
                    <div className="relative h-full w-full rounded-xl overflow-hidden bg-muted">
                        <Image src="/images/categories/thu-cong-my-nghe.png" alt="Thủ công" fill className="object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="relative h-full w-full rounded-xl overflow-hidden bg-muted">
                        <Image src="/images/categories/do-an-vat-dac-san.png" alt="Đặc sản" fill className="object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  </div>
               </div>
            </div>
            
            {/* Floating Badge */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-background border shadow-lg rounded-xl p-4 flex items-center gap-3"
            >
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold">Sản phẩm mới</p>
                <p className="text-xs text-muted-foreground">Cập nhật mỗi ngày</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
