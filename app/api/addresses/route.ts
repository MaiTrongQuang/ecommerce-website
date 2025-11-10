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

    const body = await request.json()

    const { data, error } = await supabase
      .from("addresses")
      .insert({
        user_id: user.id,
        ...body,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ address: data })
  } catch (error) {
    console.error("[v0] Error creating address:", error)
    return NextResponse.json({ error: "Failed to create address" }, { status: 500 })
  }
}
