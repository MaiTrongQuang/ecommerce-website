import { createClient } from "@/lib/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const supabase = await createClient()

    const { data: product, error } = await supabase
      .from("products")
      .select(`
        *,
        categories(id, name, slug),
        reviews(
          id,
          rating,
          title,
          comment,
          created_at,
          profiles(full_name)
        )
      `)
      .eq("slug", slug)
      .eq("status", "active")
      .single()

    if (error) throw error

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Calculate average rating
    const ratings = product.reviews?.map((r: any) => r.rating) || []
    const averageRating = ratings.length > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length : 0

    return NextResponse.json({
      ...product,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: ratings.length,
    })
  } catch (error) {
    console.error("[v0] Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}
