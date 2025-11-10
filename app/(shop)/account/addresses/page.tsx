import { createClient } from "@/lib/server"
import { redirect } from "next/navigation"
import { AddressesContent } from "@/components/addresses-content"
import { getServerLanguage } from "@/lib/i18n/server"

export default async function AddressesPage() {
  const supabase = await createClient()
  const lang = await getServerLanguage()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch addresses
  const { data: addresses, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false })

  return <AddressesContent addresses={addresses || []} initialLanguage={lang} />
}

