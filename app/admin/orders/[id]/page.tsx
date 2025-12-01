"use client"

import { useEffect, useState } from "react"
import { getAdminOrderDetails } from "@/app/actions/admin"
import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Package, Truck, CreditCard, MapPin } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { useLanguage } from "@/lib/i18n/context"

import { Database } from "@/lib/database"

type Order = Database['public']['Tables']['orders']['Row']
type OrderItem = Database['public']['Tables']['order_items']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']
type Address = Database['public']['Tables']['addresses']['Row']

type OrderDetail = Order & {
  items: OrderItem[]
  profile: Profile | null
  shippingAddress: Address | null
}

export default function OrderDetailPage() {
  const params = useParams()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { t, language } = useLanguage()

  useEffect(() => {
    const fetchOrder = async () => {
      if (!params?.id) return

      try {
        const data = await getAdminOrderDetails(params.id as string)
        setOrder(data)
      } catch (error) {
        console.error("Error fetching order details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [params?.id])

  if (isLoading) {
    return <div className="p-8">{t("common.loading")}</div>
  }

  if (!order) {
    return <div className="p-8">Order not found</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("admin.order")} {order.order_number}
          </h1>
          <p className="text-muted-foreground">
            {new Date(order.created_at).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')} • {new Date(order.created_at).toLocaleTimeString(language === 'vi' ? 'vi-VN' : 'en-US')}
          </p>
        </div>
        <div className="ml-auto">
           <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'} className="text-lg px-4 py-1">
            {t(`orders.statusLabels.${order.status}`)}
          </Badge>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Mặt Hàng Trong Đơn
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                  <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                    {item.product_image ? (
                      <Image
                        src={item.product_image}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Số Lượng: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right font-medium">
                    {formatCurrency(item.total)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Địa Chỉ Giao Hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.shippingAddress ? (
                <div className="space-y-1">
                  <p className="font-medium">{order.shippingAddress.full_name}</p>
                  <p>{order.shippingAddress.address_line1}</p>
                  {order.shippingAddress.address_line2 && <p>{order.shippingAddress.address_line2}</p>}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postal_code}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="mt-2 text-muted-foreground">{order.shippingAddress.phone}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">No shipping address provided</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Chi Tiết Đơn Hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tạm Tính</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vận Chuyển</span>
                <span>{formatCurrency(order.shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Thuế</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Tổng Cộng</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phương Thức Thanh Toán</span>
                  <span className="font-medium capitalize">{order.payment_method || "N/A"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Trạng Thái Thanh Toán</span>
                  <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                    {t(`orders.paymentStatusLabels.${order.payment_status}`)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
             <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Thông Tin Khách Hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.profile ? (
                <div className="space-y-1">
                  <p className="font-medium">{order.profile.full_name}</p>
                  <p className="text-sm text-muted-foreground">{order.profile.email}</p>
                  <p className="text-sm text-muted-foreground">{order.profile.phone}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">Guest Customer</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
