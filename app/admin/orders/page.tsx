"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { OrderStatusSelect } from "@/components/admin/order-status-select"
import { Badge } from "@/components/ui/badge"
import { Database } from "@/lib/database"
import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/i18n/context"
import { getAdminOrders } from "@/app/actions/admin"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

type OrderWithProfile = Database['public']['Tables']['orders']['Row'] & {
  profiles: { full_name: string | null; email: string } | null
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderWithProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      try {
        const data = await getAdminOrders(searchQuery)
        setOrders(data as unknown as OrderWithProfile[])
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(() => {
      fetchOrders()
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t("admin.orders")}</h1>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("admin.orderNumber")}</TableHead>
              <TableHead>{t("admin.date")}</TableHead>
              <TableHead>{t("admin.customer")}</TableHead>
              <TableHead>{t("admin.paymentStatus")}</TableHead>
              <TableHead>{t("admin.total")}</TableHead>
              <TableHead>{t("admin.status")}</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  {t("common.loading")}
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
               <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow 
                  key={order.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/admin/orders/${order.id}`)}
                >
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{order.profiles?.full_name || "Guest"}</span>
                      <span className="text-xs text-muted-foreground">{order.profiles?.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                      {t(`orders.paymentStatusLabels.${order.payment_status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    <div onClick={(e) => e.stopPropagation()}>
                      <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
