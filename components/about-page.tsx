"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Heart, ShieldCheck, Users, Globe } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"

export function AboutPage() {
  const { t } = useLanguage()

  const values = [
    {
      icon: ShieldCheck,
      title: "Chất Lượng Hàng Đầu",
      description: "Cam kết cung cấp sản phẩm chính hãng, nguồn gốc rõ ràng và chất lượng tốt nhất.",
    },
    {
      icon: Heart,
      title: "Tận Tâm Phục Vụ",
      description: "Luôn lắng nghe và đặt sự hài lòng của khách hàng lên hàng đầu.",
    },
    {
      icon: Globe,
      title: "Bảo Tồn Văn Hóa",
      description: "Gìn giữ và phát huy giá trị văn hóa Việt qua từng sản phẩm thủ công.",
    },
    {
      icon: Users,
      title: "Kết Nối Cộng Đồng",
      description: "Hỗ trợ các làng nghề và nghệ nhân địa phương phát triển bền vững.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/categories/trang-phuc-truyen-thong.png"
            alt="About Hero"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
        </div>
        
        <div className="container relative z-10 px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Câu Chuyện Của Chúng Tôi
            </h1>
            <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
              Hành trình mang tinh hoa văn hóa Việt đến với mọi nhà
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square rounded-2xl overflow-hidden shadow-xl"
            >
              <Image
                src="/images/categories/thu-cong-my-nghe.png"
                alt="Our Story"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Khởi Nguồn</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Quang Store được thành lập với một sứ mệnh đơn giản nhưng đầy ý nghĩa: kết nối những giá trị truyền thống với cuộc sống hiện đại. Chúng tôi tin rằng mỗi sản phẩm Việt đều mang trong mình một câu chuyện, một nét đẹp văn hóa cần được trân trọng và lan tỏa.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Từ những hạt cà phê Tây Nguyên đậm đà, những bộ gốm sứ Bát Tràng tinh xảo, đến những chiếc áo dài thướt tha... tất cả đều được chúng tôi tuyển chọn kỹ lưỡng để mang đến trải nghiệm tốt nhất cho khách hàng.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Giá Trị Cốt Lõi</h2>
            <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground">
              Những nguyên tắc định hình nên thương hiệu của chúng tôi
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow"
              >
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-6">
              Đồng Hành Cùng Chúng Tôi
            </h2>
            <p className="mx-auto max-w-[600px] text-primary-foreground/80 text-lg mb-8">
              Khám phá ngay bộ sưu tập sản phẩm độc đáo và trở thành một phần của cộng đồng yêu văn hóa Việt.
            </p>
            <Link href="/products">
              <Button size="lg" variant="secondary" className="gap-2 group">
                Mua Sắm Ngay
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
