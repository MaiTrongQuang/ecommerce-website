import { createClient } from "@/lib/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
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
        order_items(
          *,
          products(name, images)
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ orders: data })
  } catch (error) {
    console.error("[v0] Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { items, shipping_address_id, billing_address_id, payment_method } = body

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
    const tax = subtotal * 0.1 // 10% tax
    const shipping = subtotal > 50 ? 0 : 10 // Free shipping over $50
    const total = subtotal + tax + shipping

    // Generate order number
    const { data: orderNumberData } = await supabase.rpc("generate_order_number")

    const order_number = orderNumberData || `ORD-${Date.now()}`

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        order_number,
        subtotal,
        tax,
        shipping,
        total,
        shipping_address_id,
        billing_address_id,
        payment_method,
        status: "pending",
        payment_status: "pending",
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.name,
      product_image: item.images?.[0] || null,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) throw itemsError

    // Clear cart
    await supabase.from("cart_items").delete().eq("user_id", user.id)

    return NextResponse.json({ order })
  } catch (error) {
    console.error("[v0] Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
