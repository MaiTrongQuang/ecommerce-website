import { createClient } from "@/lib/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { User, ShoppingBag, MapPin } from "lucide-react"

export default async function AccountPage() {
  const supabase = await createClient()

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
        <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and view your orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{profile?.full_name || "No name set"}</p>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
              <Link href="/account/profile">Edit Profile</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{orderCount || 0}</p>
            <p className="text-sm text-muted-foreground mt-1">Total orders</p>
            <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
              <Link href="/account/orders">View Orders</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Addresses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Manage your saved addresses</p>
            <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
              <Link href="/account/addresses">Manage Addresses</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
