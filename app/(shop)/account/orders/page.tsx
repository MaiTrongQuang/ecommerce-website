import { createClient } from "@/lib/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Package } from "lucide-react"
import { getServerLanguage } from "@/lib/i18n/server"
import { t } from "@/lib/i18n"

export default async function OrdersPage() {
  const supabase = await createClient()
  const lang = await getServerLanguage()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(*)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t(lang, "orders.title")}</h1>
        <p className="text-muted-foreground mt-2">{t(lang, "orders.viewAndTrack")}</p>
      </div>

      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/account/orders/${order.id}`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{order.order_number}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()} • {order.order_items.length} {t(lang, "orders.items")}
                      </p>
                      <p className="text-lg font-bold">${order.total.toFixed(2)}</p>
                    </div>
                    <Badge className="capitalize">
                      {t(lang, `orders.status.${order.status}`) || order.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t(lang, "account.noOrders")}</h2>
            <p className="text-muted-foreground">{t(lang, "orders.startShopping")}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
