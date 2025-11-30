"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const timelineItems = [
  {
    year: "2020",
    title: "Khởi nguồn đam mê",
    description: "Bắt đầu từ niềm đam mê với nông sản và thủ công mỹ nghệ Việt Nam, chúng tôi rong ruổi khắp các vùng miền để tìm kiếm những sản phẩm chất lượng nhất.",
    image: "/images/categories/ca-phe-tra.png",
  },
  {
    year: "2021",
    title: "Kết nối nghệ nhân",
    description: "Xây dựng mạng lưới với hơn 50 làng nghề và hợp tác xã, đảm bảo nguồn gốc xuất xứ và hỗ trợ cộng đồng địa phương phát triển bền vững.",
    image: "/images/categories/thu-cong-my-nghe.png",
  },
  {
    year: "2022",
    title: "Mở rộng thị trường",
    description: "Ra mắt cửa hàng trực tuyến đầu tiên, đưa sản phẩm Việt đến gần hơn với người tiêu dùng trong nước và quốc tế.",
    image: "/images/categories/do-an-vat-dac-san.png",
  },
  {
    year: "2023",
    title: "Nâng tầm thương hiệu",
    description: "Chính thức đổi tên thành Quang Store, cam kết mang lại trải nghiệm mua sắm đẳng cấp và dịch vụ khách hàng tận tâm.",
    image: "/images/categories/trang-phuc-truyen-thong.png",
  },
]

export function TimelineSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
          >
            Hành trình phát triển
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl"
          >
            Từ những bước chân đầu tiên đến thương hiệu được tin dùng
          </motion.p>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border hidden md:block" />

          <div className="space-y-12 md:space-y-24">
            {timelineItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex flex-col md:flex-row items-center gap-8 ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Image Side */}
                <div className="w-full md:w-1/2 flex justify-center">
                  <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden shadow-lg border bg-background">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Timeline Dot (Desktop) */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background shadow-sm hidden md:block" />

                {/* Content Side */}
                <div className="w-full md:w-1/2 text-center md:text-left">
                  <div className={`p-6 bg-background rounded-xl border shadow-sm ${
                    index % 2 === 0 ? "md:mr-12" : "md:ml-12"
                  }`}>
                    <span className="inline-block px-3 py-1 mb-2 text-sm font-bold text-primary bg-primary/10 rounded-full">
                      {item.year}
                    </span>
                    <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
