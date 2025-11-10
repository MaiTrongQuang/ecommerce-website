import { createClient } from "@/lib/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams

    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "created_at"
    const order = searchParams.get("order") || "desc"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const offset = (page - 1) * limit

    let query = supabase.from("products").select("*, categories(name, slug)", { count: "exact" }).eq("status", "active")

    // Apply filters
    if (category) {
      query = query.eq("category_id", category)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply sorting
    query = query.order(sort, { ascending: order === "asc" })

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      products: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
