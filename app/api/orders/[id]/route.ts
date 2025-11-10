import { createClient } from "@/lib/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items(*),
        addresses!orders_shipping_address_id_fkey(*)
      `)
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (error) throw error

    return NextResponse.json({ order: data })
  } catch (error) {
    console.error("[v0] Error fetching order:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}
