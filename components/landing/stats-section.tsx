"use client"

import { motion } from "framer-motion"
import { Users, ShoppingBag, Star, Award } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: "10k+",
    label: "Khách hàng tin dùng",
    description: "Trên khắp 63 tỉnh thành",
  },
  {
    icon: ShoppingBag,
    value: "500+",
    label: "Sản phẩm đa dạng",
    description: "Từ đặc sản đến thủ công",
  },
  {
    icon: Star,
    value: "4.9",
    label: "Đánh giá trung bình",
    description: "Dựa trên 5000+ lượt vote",
  },
  {
    icon: Award,
    value: "50+",
    label: "Đối tác làng nghề",
    description: "Hợp tác trực tiếp",
  },
]

export function StatsSection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="p-4 bg-primary-foreground/10 rounded-full">
                <stat.icon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-4xl font-bold tracking-tighter">{stat.value}</h3>
                <p className="font-medium mt-1">{stat.label}</p>
                <p className="text-sm text-primary-foreground/70 mt-1">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
