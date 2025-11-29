"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/i18n/context"
import { Truck, Clock, Globe, ShieldCheck } from "lucide-react"

export default function ShippingPage() {
  const { t, language } = useLanguage()

  return (
    <div className="container py-12 md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            {t("shipping.title")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("shipping.subtitle")}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-primary/10 rounded-full">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">
                {language === 'vi' ? "Vận Chuyển Toàn Quốc" : "Nationwide Shipping"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {language === 'vi' 
                  ? "Chúng tôi hỗ trợ giao hàng đến tất cả các tỉnh thành trên toàn quốc. Đối tác vận chuyển uy tín đảm bảo hàng hóa đến tay bạn an toàn."
                  : "We support shipping to all provinces nationwide. Reputable shipping partners ensure your goods arrive safely."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-primary/10 rounded-full">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">
                {language === 'vi' ? "Thời Gian Giao Hàng" : "Delivery Time"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {language === 'vi'
                  ? "Nội thành: 1-2 ngày. Ngoại thành và các tỉnh khác: 3-5 ngày. Thời gian có thể thay đổi tùy thuộc vào điều kiện thời tiết và vận chuyển."
                  : "Inner city: 1-2 days. Outer city and other provinces: 3-5 days. Time may vary depending on weather and shipping conditions."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-primary/10 rounded-full">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">
                {language === 'vi' ? "Phí Vận Chuyển" : "Shipping Fees"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {language === 'vi'
                  ? "Miễn phí vận chuyển cho đơn hàng trên 500.000đ. Phí vận chuyển tiêu chuẩn là 30.000đ cho các đơn hàng dưới mức này."
                  : "Free shipping for orders over 500,000 VND. Standard shipping fee is 30,000 VND for orders below this amount."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-2 bg-primary/10 rounded-full">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">
                {language === 'vi' ? "Bảo Hiểm Hàng Hóa" : "Cargo Insurance"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {language === 'vi'
                  ? "Tất cả đơn hàng đều được bảo hiểm 100% giá trị. Nếu có sự cố mất mát hoặc hư hỏng, chúng tôi sẽ hoàn tiền hoặc gửi lại sản phẩm mới."
                  : "All orders are insured for 100% value. If there is loss or damage, we will refund or resend a new product."}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="prose max-w-none dark:prose-invert">
          <h3>{language === 'vi' ? "Lưu ý quan trọng" : "Important Note"}</h3>
          <p>
            {language === 'vi'
              ? "Vui lòng kiểm tra kỹ thông tin địa chỉ và số điện thoại khi đặt hàng để tránh thất lạc. Nếu bạn cần thay đổi thông tin giao hàng, hãy liên hệ với chúng tôi ngay lập tức."
              : "Please check your address and phone number carefully when ordering to avoid loss. If you need to change shipping information, please contact us immediately."}
          </p>
        </div>
      </div>
    </div>
  )
}
