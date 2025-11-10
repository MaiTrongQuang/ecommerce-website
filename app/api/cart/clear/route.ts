import { createClient } from "@/lib/server"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id)

    if (error) throw error

    return NextResponse.json({ success: true, message: "Cart cleared successfully" })
  } catch (error) {
    console.error("[Cart] Error clearing cart:", error)
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 })
  }
}

