"use client"

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
import { getAdminCustomers } from "@/app/actions/admin"

type Customer = Database['public']['Tables']['profiles']['Row'] & {
  ordersCount: number
  totalSpent: number
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getAdminCustomers()
        setCustomers(data)
      } catch (error) {
        console.error("Error fetching customers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomers()
  }, [])

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
