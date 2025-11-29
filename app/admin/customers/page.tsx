"use client"

import { createClient } from "@/lib/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Database } from "@/lib/database"
import { useLanguage } from "@/lib/i18n/context"

type Customer = Database['public']['Tables']['profiles']['Row'] & {
  ordersCount: number
  totalSpent: number
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const { t } = useLanguage()

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // Fetch customers
        const { data: customersData, error: customersError } = await supabase
          .from("profiles")
          .select("*")
          .eq("role", "customer")
          .order("created_at", { ascending: false })

        if (customersError) throw customersError

        // Fetch order stats for each customer manually since we can't do complex joins easily
        const customersWithStats = await Promise.all(
          (customersData || []).map(async (customer) => {
            const { count } = await supabase
              .from("orders")
              .select("*", { count: "exact", head: true })
              .eq("user_id", customer.id)

            const { data: orders } = await supabase
              .from("orders")
              .select("total")
              .eq("user_id", customer.id)
              .eq("payment_status", "paid")

            const totalSpent = orders?.reduce((sum, order) => sum + order.total, 0) || 0

            return {
              ...customer,
              ordersCount: count || 0,
              totalSpent,
            }
          })
        )

        setCustomers(customersWithStats)
      } catch (error) {
        console.error("Error fetching customers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomers()
  }, [supabase])

  if (isLoading) {
    return <div>{t("common.loading")}</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t("admin.customers")}</h1>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("admin.form.name")}</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>{t("admin.joinDate")}</TableHead>
              <TableHead className="text-right">{t("admin.ordersCount")}</TableHead>
              <TableHead className="text-right">{t("admin.spent")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.full_name || "N/A"}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone || "N/A"}</TableCell>
                <TableCell>
                  {new Date(customer.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">{customer.ordersCount}</TableCell>
                <TableCell className="text-right">{formatCurrency(customer.totalSpent)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
