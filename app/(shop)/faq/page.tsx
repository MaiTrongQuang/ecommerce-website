"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/i18n/context"
import { ChevronDown } from "lucide-react"

export default function FAQPage() {
  const { t, language } = useLanguage()

  const faqs = [
    {
      question: language === 'vi' ? "Làm thế nào để tôi đặt hàng?" : "How do I place an order?",
      answer: language === 'vi' 
        ? "Bạn có thể đặt hàng bằng cách chọn sản phẩm, thêm vào giỏ hàng và tiến hành thanh toán. Chúng tôi hỗ trợ nhiều phương thức thanh toán khác nhau."
        : "You can place an order by selecting products, adding them to your cart, and proceeding to checkout. We support various payment methods."
    },
    {
      question: language === 'vi' ? "Tôi có thể hủy đơn hàng không?" : "Can I cancel my order?",
      answer: language === 'vi'
        ? "Bạn có thể hủy đơn hàng khi trạng thái đơn hàng là 'Đang chờ'. Vui lòng liên hệ với bộ phận hỗ trợ nếu đơn hàng đã được xử lý."
        : "You can cancel your order when the status is 'Pending'. Please contact support if the order has already been processed."
    },
    {
      question: language === 'vi' ? "Thời gian giao hàng là bao lâu?" : "How long is the delivery time?",
      answer: language === 'vi'
        ? "Thời gian giao hàng thường từ 2-5 ngày làm việc tùy thuộc vào địa chỉ của bạn."
        : "Delivery time is usually 2-5 business days depending on your location."
    },
    {
      question: language === 'vi' ? "Chính sách đổi trả như thế nào?" : "What is the return policy?",
      answer: language === 'vi'
        ? "Chúng tôi chấp nhận đổi trả trong vòng 7 ngày nếu sản phẩm có lỗi từ nhà sản xuất hoặc hư hỏng trong quá trình vận chuyển."
        : "We accept returns within 7 days if the product has a manufacturer defect or was damaged during shipping."
    },
    {
      question: language === 'vi' ? "Tôi có cần tài khoản để mua hàng không?" : "Do I need an account to shop?",
      answer: language === 'vi'
        ? "Không, bạn có thể mua hàng với tư cách khách. Tuy nhiên, việc tạo tài khoản sẽ giúp bạn theo dõi đơn hàng dễ dàng hơn."
        : "No, you can shop as a guest. However, creating an account will help you track your orders more easily."
    }
  ]

  return (
    <div className="container py-12 md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            {t("faq.title")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("faq.subtitle")}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="overflow-hidden">
              <details className="group">
                <summary className="flex cursor-pointer items-center justify-between p-6 font-medium transition-colors hover:bg-muted/50">
                  {faq.question}
                  <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
                </summary>
                <div className="border-t px-6 py-4 text-muted-foreground bg-muted/20">
                  {faq.answer}
                </div>
              </details>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
