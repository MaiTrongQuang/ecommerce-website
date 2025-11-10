import { createClient } from "@/lib/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { product_id, rating, title, comment } = await request.json()

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        product_id,
        user_id: user.id,
        rating,
        title,
        comment,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ review: data })
  } catch (error) {
    console.error("[v0] Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
