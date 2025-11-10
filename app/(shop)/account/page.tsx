import { createClient } from "@/lib/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { User, ShoppingBag, MapPin } from "lucide-react"
import { getServerLanguage } from "@/lib/i18n/server"
import { t } from "@/lib/i18n"

export default async function AccountPage() {
  const supabase = await createClient()
  const lang = await getServerLanguage()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: orders, count: orderCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t(lang, "account.title")}</h1>
        <p className="text-muted-foreground mt-2">{t(lang, "account.manageAccountDesc")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t(lang, "account.profile")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{profile?.full_name || t(lang, "account.noNameSet")}</p>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
              <Link href="/account/profile">{t(lang, "account.editProfile")}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              {t(lang, "account.orders")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{orderCount || 0}</p>
            <p className="text-sm text-muted-foreground mt-1">{t(lang, "account.totalOrders")}</p>
            <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
              <Link href="/account/orders">{t(lang, "account.viewOrders")}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {t(lang, "account.addresses")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t(lang, "account.manageAddressesDesc")}</p>
            <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
              <Link href="/account/addresses">{t(lang, "account.manageAddresses")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
