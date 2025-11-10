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

    const { status, payment_status, notes } = await request.json()

    const updateData: any = {}
    if (status) updateData.status = status
    if (payment_status) updateData.payment_status = payment_status
    if (notes !== undefined) updateData.notes = notes

    const { data, error } = await supabase.from("orders").update(updateData).eq("id", id).select().single()

    if (error) throw error

    return NextResponse.json({ order: data })
  } catch (error) {
    console.error("[v0] Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
