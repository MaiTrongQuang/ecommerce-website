import { createClient } from "@/lib/server"
import { notFound } from "next/navigation"
import { ProductDetailContent } from "@/components/product-detail-content"

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
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
    `,
    )
    .eq("slug", slug)
    .eq("status", "active")
    .single()

  if (error || !product) {
    notFound()
  }

  // Calculate average rating
  const ratings = product.reviews?.map((r: any) => r.rating) || []
  const averageRating = ratings.length > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length : 0

  return <ProductDetailContent product={product} averageRating={averageRating} />
}
