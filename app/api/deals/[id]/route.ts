import { createClient } from "@/lib/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: deal, error } = await supabase
      .from("deals")
      .select(`
        *,
        products:product_ids (
          id,
          name,
          slug,
          price,
          compare_at_price,
          images,
          quantity,
          status
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Deal not found" },
          { status: 404 }
        )
      }
      console.error("[Deals] Error fetching deal:", error)
      return NextResponse.json(
        { error: "Failed to fetch deal" },
        { status: 500 }
      )
    }

    return NextResponse.json({ deal })
  } catch (error) {
    console.error("[Deals] Error:", error)
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}

