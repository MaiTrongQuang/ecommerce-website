import { createClient } from "@/lib/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get user before signing out to clear their cart
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Clear cart items from database if user exists
    if (user) {
      try {
        await supabase.from("cart_items").delete().eq("user_id", user.id)
      } catch (cartError) {
        console.error("[Auth] Error clearing cart during logout:", cartError)
        // Continue with logout even if cart clearing fails
      }
    }

    // Sign out user
    const { error } = await supabase.auth.signOut()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: "Logged out successfully",
    })
  } catch (error) {
    console.error("[Auth] Error during logout:", error)
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    )
  }
}

