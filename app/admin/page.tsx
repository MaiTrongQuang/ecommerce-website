"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/client"
import { useEffect, useState } from "react"
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react"
import { Database } from "@/lib/database"
import { useLanguage } from "@/lib/i18n/context"
import { formatCurrency } from "@/lib/utils"

type OrderWithProfile = Database['public']['Tables']['orders']['Row'] & {
  profiles: { full_name: string | null } | null
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0,
  })
  const [recentOrders, setRecentOrders] = useState<OrderWithProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const { t } = useLanguage()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch orders
        const { data: orders, error: ordersError } = await supabase
          .from("orders")
          .select("*, profiles(full_name)")
          .order("created_at", { ascending: false })

        if (ordersError) throw ordersError

        // Calculate revenue (only paid orders)
        const revenue = orders
          ?.filter((order) => order.payment_status === "paid")
          .reduce((acc, order) => acc + order.total, 0) || 0

        // Fetch products count
        const { count: productsCount, error: productsError } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })

        if (productsError) throw productsError

        // Fetch customers count
        const { count: customersCount, error: customersError } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "customer")

        if (customersError) throw customersError

        setStats({
          revenue,
          orders: orders?.length || 0,
          products: productsCount || 0,
          customers: customersCount || 0,
        })

        setRecentOrders((orders as unknown as OrderWithProfile[])?.slice(0, 5) || [])
      } catch (error) {
        console.error("Error fetching admin stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [supabase])

  if (isLoading) {
    return <div>{t("common.loading")}</div>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">{t("admin.dashboard")}</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.totalRevenue")}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.revenue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.totalOrders")}
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.totalProducts")}
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.products}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("admin.totalCustomers")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customers}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t("admin.recentOrders")}</h2>
        <div className="rounded-md border">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    {t("admin.orderNumber")}
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    {t("admin.customer")}
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    {t("admin.status")}
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    {t("admin.total")}
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle font-medium">{order.order_number}</td>
                    <td className="p-4 align-middle">{order.profiles?.full_name || "Guest"}</td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {t(`orders.status.${order.status}`)}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-right">{formatCurrency(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
