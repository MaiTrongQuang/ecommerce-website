import { createClient } from "@/lib/server"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Package, Truck, CheckCircle } from "lucide-react"
import Image from "next/image"

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(*),
      addresses!orders_shipping_address_id_fkey(*)
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error || !order) {
    notFound()
  }

  const statusConfig = {
    pending: { icon: Package, color: "bg-yellow-500", label: "Pending" },
    processing: { icon: Package, color: "bg-blue-500", label: "Processing" },
    shipped: { icon: Truck, color: "bg-purple-500", label: "Shipped" },
    delivered: { icon: CheckCircle, color: "bg-green-500", label: "Delivered" },
    cancelled: { icon: Package, color: "bg-red-500", label: "Cancelled" },
  }

  const currentStatus = statusConfig[order.status as keyof typeof statusConfig]
  const StatusIcon = currentStatus.icon

  return (
    <div className="container py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/account/orders">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
      </Button>

      <div className="space-y-6">
        {/* Order Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">Order {order.order_number}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Placed on {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <Badge className={currentStatus.color}>
                <StatusIcon className="mr-1 h-3 w-3" />
                {currentStatus.label}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.order_items.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={item.product_image || "/placeholder.svg"}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product_name}</h4>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      <p className="text-sm font-semibold mt-1">${item.total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            {order.addresses && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{order.addresses.full_name}</p>
                    <p className="text-muted-foreground">{order.addresses.address_line1}</p>
                    {order.addresses.address_line2 && (
                      <p className="text-muted-foreground">{order.addresses.address_line2}</p>
                    )}
                    <p className="text-muted-foreground">
                      {order.addresses.city}, {order.addresses.state} {order.addresses.postal_code}
                    </p>
                    <p className="text-muted-foreground">{order.addresses.country}</p>
                    <p className="text-muted-foreground mt-2">{order.addresses.phone}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">${order.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">${order.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-xl">${order.total.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-medium capitalize">{order.payment_method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Status</span>
                    <Badge variant="outline" className="capitalize">
                      {order.payment_status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
