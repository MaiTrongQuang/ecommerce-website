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

  // Fetch orders
  const { data: ordersData, error: ordersError } = await adminClient
    .from("orders")
    .select("total, payment_status, created_at")
    .order("created_at", { ascending: true })

  if (ordersError) throw ordersError
  
  const orders = ordersData as Pick<Order, 'total' | 'payment_status' | 'created_at'>[]

  // Calculate revenue (only paid orders)
  const revenue = orders
    ?.filter((order) => order.payment_status === "paid")
    .reduce((acc, order) => acc + order.total, 0) || 0

  // Fetch products count
  const { count: productsCount, error: productsError } = await adminClient
    .from("products")
    .select("*", { count: "exact", head: true })

  if (productsError) throw productsError

  // Fetch customers count
  const { count: customersCount, error: customersError } = await adminClient
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "customer")

  if (customersError) throw customersError

  // Prepare chart data (revenue by month for the last 6 months)
  const chartData = getRevenueChartData(orders || [])

  return {
    revenue,
    orders: orders?.length || 0,
    products: productsCount || 0,
    customers: customersCount || 0,
    chartData,
  }
}

function getRevenueChartData(orders: Pick<Order, 'total' | 'payment_status' | 'created_at'>[]) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const currentMonth = new Date().getMonth()
  const last6Months: { name: string; total: number; monthIndex: number; year: number }[] = []

  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(currentMonth - i)
    last6Months.push({
      name: months[d.getMonth()],
      total: 0,
      monthIndex: d.getMonth(),
      year: d.getFullYear()
    })
  }

  orders.forEach(order => {
    if (order.payment_status !== 'paid') return
    
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
      .filter(o => o.payment_status === 'paid')
      .reduce((sum, o) => sum + o.total, 0)

    return {
      ...customer,
      ordersCount: customerOrders.length,
      totalSpent
    }
  })

  return customersWithStats
}
