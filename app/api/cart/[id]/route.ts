import { createClient } from "@/lib/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { quantity } = await request.json()

    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ item: data })
  } catch (error) {
    console.error("[v0] Error updating cart item:", error)
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase.from("cart_items").delete().eq("id", id).eq("user_id", user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting cart item:", error)
    return NextResponse.json({ error: "Failed to delete cart item" }, { status: 500 })
  }
}
