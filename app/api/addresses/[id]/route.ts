import { createClient } from "@/lib/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // If setting as default, unset other defaults first
    if (body.is_default === true) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id)
        .neq("id", id)
    }

    // Map only the fields we need, ensuring correct column names
    const addressData: Record<string, unknown> = {}
    
    if (body.full_name !== undefined) addressData.full_name = body.full_name
    if (body.phone !== undefined) addressData.phone = body.phone
    if (body.address_line1 !== undefined) addressData.address_line1 = body.address_line1
    if (body.address_line2 !== undefined) addressData.address_line2 = body.address_line2 || null
    if (body.city !== undefined) addressData.city = body.city
    if (body.state !== undefined) addressData.state = body.state
    if (body.postal_code !== undefined) addressData.postal_code = body.postal_code
    if (body.country !== undefined) addressData.country = body.country
    if (body.is_default !== undefined) addressData.is_default = body.is_default

    const { data, error } = await supabase
      .from("addresses")
      .update(addressData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ address: data })
  } catch (error) {
    console.error("[v0] Error updating address:", error)
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting address:", error)
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 })
  }
}

