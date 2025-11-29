import { createClient } from "@/lib/server"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"

export default async function CustomersPage() {
  const supabase = await createClient()

  // Fetch customers
  const { data: customers } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "customer")
    .order("created_at", { ascending: false })

  // Fetch order stats for each customer manually since we can't do complex joins easily
  const customersWithStats = await Promise.all(
    (customers || []).map(async (customer) => {
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Orders</TableHead>
              <TableHead className="text-right">Total Spent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customersWithStats.map((customer) => (
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
