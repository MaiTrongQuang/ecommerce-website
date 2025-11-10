import { createClient } from "@/lib/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, full_name, phone, role, created_at, updated_at")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("[Profile] Error fetching profile:", profileError)
      return NextResponse.json(
        { error: "Failed to fetch profile" },
        { status: 500 }
      )
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("[Profile] Error:", error)
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { full_name, phone } = body

    // Validate input
    if (full_name !== undefined && typeof full_name !== "string") {
      return NextResponse.json(
        { error: "Invalid full_name" },
        { status: 400 }
      )
    }

    if (phone !== undefined && phone !== null && typeof phone !== "string") {
      return NextResponse.json(
        { error: "Invalid phone" },
        { status: 400 }
      )
    }

    // Update profile
    const { data: profile, error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: full_name !== undefined ? full_name : null,
        phone: phone !== undefined ? phone : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single()

    if (updateError) {
      console.error("[Profile] Error updating profile:", updateError)
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      )
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("[Profile] Error:", error)
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}

