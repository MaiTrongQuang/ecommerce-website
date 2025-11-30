import { AboutPage } from "@/components/about-page"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Về Chúng Tôi | Quang Store",
  description: "Tìm hiểu về câu chuyện, sứ mệnh và giá trị cốt lõi của Quang Store - Nơi kết nối tinh hoa văn hóa Việt.",
}

export default function AboutRoute() {
  return <AboutPage />
}
