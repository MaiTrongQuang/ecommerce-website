import { createClient } from "@/lib/server"
import { CategoriesContent } from "@/components/categories-content"

export default async function CategoriesPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from("categories").select("*, slug")

  return <CategoriesContent categories={categories || []} />
}
