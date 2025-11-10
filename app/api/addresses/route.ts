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

    // Map only the fields we need, ensuring correct column names
    const addressData = {
      user_id: user.id,
      full_name: body.full_name || body.fullName || "",
      phone: body.phone || "",
      address_line1: body.address_line1 || body.addressLine1 || "",
      address_line2: body.address_line2 || body.addressLine2 || null,
      city: body.city || "",
      state: body.state || "",
      postal_code: body.postal_code || body.postalCode || "",
      country: body.country || "VN",
      is_default: body.is_default || body.isDefault || false,
    }

    const { data, error } = await supabase
      .from("addresses")
      .insert(addressData)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ address: data })
  } catch (error) {
    console.error("[v0] Error creating address:", error)
    return NextResponse.json({ error: "Failed to create address" }, { status: 500 })
  }
}
