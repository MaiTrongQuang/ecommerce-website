"use server"

import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/server"
import { Database } from "@/lib/database"

type Order = Database['public']['Tables']['orders']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

export async function getAdminStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    throw new Error("Unauthorized")
  }

  const adminClient = createAdminClient()

  // 1. Calculate Total Revenue
  // We consider all orders that are NOT cancelled, failed, or refunded as "Revenue" (GMV)
  const { data: validOrders, error: revenueError } = await adminClient
    .from("orders")
    .select("total")
    .neq("status", "cancelled")
    .neq("payment_status", "failed")
    .neq("payment_status", "refunded")

  if (revenueError) throw revenueError

  const revenue = (validOrders as { total: number }[]).reduce((acc, order) => acc + order.total, 0)

  // 2. Count Total Orders
  const { count: ordersCount, error: ordersError } = await adminClient
    .from("orders")
    .select("*", { count: "exact", head: true })

  if (ordersError) throw ordersError

  // 3. Count Products
  const { count: productsCount, error: productsError } = await adminClient
    .from("products")
    .select("*", { count: "exact", head: true })

  if (productsError) throw productsError

  // 4. Count Customers
  const { count: customersCount, error: customersError } = await adminClient
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "customer")

  if (customersError) throw customersError

  // 5. Prepare Chart Data (Last 6 months)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
  sixMonthsAgo.setDate(1) // Start from the 1st of that month
  sixMonthsAgo.setHours(0, 0, 0, 0)

  const { data: chartOrders, error: chartError } = await adminClient
    .from("orders")
    .select("total, created_at")
    .neq("status", "cancelled")
    .neq("payment_status", "failed")
    .neq("payment_status", "refunded")
    .gte("created_at", sixMonthsAgo.toISOString())
    .order("created_at", { ascending: true })

  if (chartError) throw chartError

  const chartData = getRevenueChartData(chartOrders || [])

  return {
    revenue,
    orders: ordersCount || 0,
    products: productsCount || 0,
    customers: customersCount || 0,
    chartData,
  }
}

function getRevenueChartData(orders: Pick<Order, 'total' | 'created_at'>[]) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const currentDate = new Date()
  const last6Months: { name: string; total: number; monthIndex: number; year: number }[] = []

  // Initialize last 6 months buckets
  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
    last6Months.push({
      name: months[d.getMonth()],
      total: 0,
      monthIndex: d.getMonth(),
      year: d.getFullYear()
    })
  }

  orders.forEach(order => {
    const date = new Date(order.created_at)
    const monthIndex = date.getMonth()
    const year = date.getFullYear()

    const monthData = last6Months.find(m => m.monthIndex === monthIndex && m.year === year)
    if (monthData) {
      monthData.total += order.total
    }
  })

  return last6Months.map(({ name, total }) => ({ name, total }))
}

export async function getRecentOrders() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const adminClient = createAdminClient()

  const { data: ordersData, error } = await adminClient
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  if (error) throw error
  
  const orders = ordersData as Order[]

  // Manual join with profiles
  const userIds = Array.from(new Set(orders.map(o => o.user_id)))
  
  let profiles: Pick<Profile, 'id' | 'full_name' | 'email'>[] = []
  
  if (userIds.length > 0) {
    const { data: profilesData } = await adminClient
      .from("profiles")
      .select("id, full_name, email")
      .in("id", userIds)
      
    if (profilesData) {
      profiles = profilesData
    }
  }

  const ordersWithProfiles = orders.map(order => ({
    ...order,
    profiles: profiles.find(p => p.id === order.user_id) || null
  }))

  return ordersWithProfiles
}

export async function getAdminOrders() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const adminClient = createAdminClient()

  const { data: ordersData, error } = await adminClient
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  
  const orders = ordersData as Order[]

  // Manual join with profiles
  const userIds = Array.from(new Set(orders.map(o => o.user_id)))
  
  let profiles: Pick<Profile, 'id' | 'full_name' | 'email'>[] = []
  
  if (userIds.length > 0) {
    const { data: profilesData } = await adminClient
      .from("profiles")
      .select("id, full_name, email")
      .in("id", userIds)
      
    if (profilesData) {
      profiles = profilesData
    }
  }

  const ordersWithProfiles = orders.map(order => ({
    ...order,
    profiles: profiles.find(p => p.id === order.user_id) || null
  }))

  return ordersWithProfiles
}

export async function getAdminCustomers() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const adminClient = createAdminClient()

  // Fetch customers
  const { data: customersData, error: customersError } = await adminClient
    .from("profiles")
    .select("*")
    .eq("role", "customer")
    .order("created_at", { ascending: false })

  if (customersError) throw customersError
  
  const customers = customersData as Profile[]

  // Fetch all orders to calculate stats in memory (more efficient than N+1 queries)
  const { data: allOrdersData, error: ordersError } = await adminClient
    .from("orders")
    .select("user_id, total, payment_status")

  if (ordersError) throw ordersError
  
  const allOrders = allOrdersData as Pick<Order, 'user_id' | 'total' | 'payment_status'>[]

  const customersWithStats = customers.map(customer => {
    const customerOrders = allOrders?.filter(o => o.user_id === customer.id) || []
    const totalSpent = customerOrders
      .filter(o => o.payment_status?.toLowerCase() === 'paid')
      .reduce((sum, o) => sum + o.total, 0)

    return {
      ...customer,
      ordersCount: customerOrders.length,
      totalSpent
    }
  })

  return customersWithStats
}
