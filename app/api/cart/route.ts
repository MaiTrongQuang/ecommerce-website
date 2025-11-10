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
      .from("cart_items")
      .select(`
        *,
        products(
          id,
          name,
          slug,
          price,
          images,
          quantity
        )
      `)
      .eq("user_id", user.id)

    if (error) throw error

    return NextResponse.json({ items: data })
  } catch (error) {
    console.error("[v0] Error fetching cart:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
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

    const { product_id, quantity } = await request.json()

    // Check if item already exists in cart
    const { data: existing } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", product_id)
      .single()

    if (existing) {
      // Update quantity
      const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + quantity })
        .eq("id", existing.id)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ item: data })
    } else {
      // Insert new item
      const { data, error } = await supabase
        .from("cart_items")
        .insert({ user_id: user.id, product_id, quantity })
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ item: data })
    }
  } catch (error) {
    console.error("[v0] Error adding to cart:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}
