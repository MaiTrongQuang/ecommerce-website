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

type OrderWithProfile = Database['public']['Tables']['orders']['Row'] & {
  profiles: { full_name: string | null; email: string } | null
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderWithProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAdminOrders()
        setOrders(data as unknown as OrderWithProfile[])
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (isLoading) {
    return <div>{t("common.loading")}</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t("admin.orders")}</h1>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
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
                  <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
