import { createClient } from "@/lib/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "active"
    const now = new Date().toISOString()

    let query = supabase
      .from("deals")
      .select("*")
      .order("created_at", { ascending: false })

    // Filter by status
    if (status === "active") {
      query = query
        .eq("status", "active")
        .lte("start_date", now)
        .gte("end_date", now)
    } else {
      query = query.eq("status", status)
    }

    const { data: deals, error } = await query

    if (error) {
      console.error("[Deals] Error fetching deals:", error)
      return NextResponse.json(
        { error: "Failed to fetch deals" },
        { status: 500 }
      )
    }

    return NextResponse.json({ deals: deals || [] })
  } catch (error) {
    console.error("[Deals] Error:", error)
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}

