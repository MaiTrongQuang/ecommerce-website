/**
 * Script to seed sample deals into Supabase database
 * Run with: node scripts/seed-deals.js
 * 
 * Make sure to set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables from .env.local
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local')
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ Error: .env.local file not found')
    console.error('Please create .env.local file with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  const envContent = fs.readFileSync(envPath, 'utf-8')
  const env = {}
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
      }
    }
  })
  
  return env
}

// Helper function to get dates
function getDates() {
  const now = new Date()
  const startDate = new Date(now)
  startDate.setHours(0, 0, 0, 0) // Start of today
  
  // End date: 7 days from now
  const endDate = new Date(now)
  endDate.setDate(endDate.getDate() + 7)
  endDate.setHours(23, 59, 59, 999) // End of day
  
  return {
    start: startDate.toISOString(),
    end: endDate.toISOString()
  }
}

// Helper function to get future dates (for coming soon deals)
function getFutureDates() {
  const now = new Date()
  const startDate = new Date(now)
  startDate.setDate(startDate.getDate() + 3) // Start in 3 days
  startDate.setHours(0, 0, 0, 0)
  
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 5) // End 5 days after start
  endDate.setHours(23, 59, 59, 999)
  
  return {
    start: startDate.toISOString(),
    end: endDate.toISOString()
  }
}

async function seedDeals() {
  // Load environment variables
  const env = loadEnv()
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials!')
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
    console.error('\n⚠️  IMPORTANT: You MUST use SUPABASE_SERVICE_ROLE_KEY (not ANON_KEY)')
    process.exit(1)
  }

  // Create Supabase client with Service Role Key
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  console.log('🌱 Starting to seed deals...\n')

  // Test connection first
  try {
    const { error: testError } = await supabase
      .from('deals')
      .select('id')
      .limit(1)

    if (testError) {
      console.error('❌ Connection test failed:', testError.message)
      if (testError.message.includes('row-level security')) {
        console.error('\n⚠️  RLS Error detected!')
        console.error('   Please check your SUPABASE_SERVICE_ROLE_KEY in .env.local')
      }
      process.exit(1)
    }
    console.log('✅ Connection test passed\n')
  } catch (error) {
    console.error('❌ Connection test error:', error.message)
    process.exit(1)
  }

  // Fetch products to get product IDs
  console.log('📦 Fetching products...')
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, category_id')
    .eq('status', 'active')
    .limit(20) // Get first 20 products

  if (productsError) {
    console.error('❌ Error fetching products:', productsError.message)
    process.exit(1)
  }

  if (!products || products.length === 0) {
    console.error('❌ No products found! Please seed products first.')
    process.exit(1)
  }

  console.log(`✅ Found ${products.length} products\n`)

  // Fetch categories to get category IDs
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('id, name')
    .limit(10)

  if (categoriesError) {
    console.error('⚠️  Warning: Could not fetch categories:', categoriesError.message)
  }

  // Prepare product IDs arrays
  const allProductIds = products.map(p => p.id)
  const first5ProductIds = allProductIds.slice(0, 5)
  const next5ProductIds = allProductIds.slice(5, 10)
  const categoryIds = categories ? [categories[0]?.id, categories[1]?.id].filter(Boolean) : []

  const dates = getDates()
  const futureDates = getFutureDates()

  // Sample deals data
  const sampleDeals = [
    {
      title: "Flash Sale - Giảm Giá 30% Tất Cả Sản Phẩm",
      description: "Ưu đãi đặc biệt! Giảm giá 30% cho tất cả sản phẩm được chọn. Áp dụng cho đơn hàng tối thiểu 500,000đ.",
      discount_percentage: 30,
      discount_amount: null,
      start_date: dates.start,
      end_date: dates.end,
      status: "active",
      banner_image_url: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&h=400&fit=crop",
      product_ids: first5ProductIds,
      category_ids: null,
      min_purchase_amount: 500000,
      max_discount_amount: 200000,
    },
    {
      title: "Ưu Đãi Cà Phê & Trà - Giảm 25%",
      description: "Khám phá bộ sưu tập cà phê và trà đặc sản với mức giảm giá 25%. Chỉ trong thời gian có hạn!",
      discount_percentage: 25,
      discount_amount: null,
      start_date: dates.start,
      end_date: dates.end,
      status: "active",
      banner_image_url: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200&h=400&fit=crop",
      product_ids: next5ProductIds,
      category_ids: categoryIds.length > 0 ? [categoryIds[0]] : null,
      min_purchase_amount: null,
      max_discount_amount: 150000,
    },
    {
      title: "Mua 2 Tặng 1 - Áo Dài Truyền Thống",
      description: "Mua 2 áo dài truyền thống, tặng ngay 1 áo dài. Chương trình áp dụng cho các sản phẩm được chọn.",
      discount_percentage: 33.33, // Equivalent to buy 2 get 1
      discount_amount: null,
      start_date: dates.start,
      end_date: dates.end,
      status: "active",
      image_url: "https://images.unsplash.com/photo-1594633312681-425a7b9568e2?w=800&h=600&fit=crop",
      product_ids: allProductIds.filter((_, idx) => idx < 3), // First 3 products
      category_ids: null,
      min_purchase_amount: 1000000,
      max_discount_amount: 500000,
    },
    {
      title: "Giảm Giá Cố Định 50,000đ - Đơn Hàng Từ 300,000đ",
      description: "Giảm ngay 50,000đ cho mọi đơn hàng từ 300,000đ trở lên. Áp dụng cho tất cả sản phẩm.",
      discount_percentage: 0,
      discount_amount: 50000,
      start_date: dates.start,
      end_date: dates.end,
      status: "active",
      banner_image_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop",
      product_ids: allProductIds,
      category_ids: null,
      min_purchase_amount: 300000,
      max_discount_amount: 50000,
    },
    {
      title: "Siêu Sale Cuối Tuần - Giảm 40%",
      description: "Chương trình siêu sale cuối tuần với mức giảm giá lên đến 40%. Nhanh tay đặt hàng để nhận ưu đãi!",
      discount_percentage: 40,
      discount_amount: null,
      start_date: dates.start,
      end_date: dates.end,
      status: "active",
      banner_image_url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop",
      product_ids: allProductIds.slice(0, 8),
      category_ids: categoryIds,
      min_purchase_amount: 800000,
      max_discount_amount: 300000,
    },
    {
      title: "Ưu Đãi Sắp Diễn Ra - Giảm 35%",
      description: "Chương trình ưu đãi đặc biệt sắp diễn ra! Giảm giá 35% cho các sản phẩm được chọn.",
      discount_percentage: 35,
      discount_amount: null,
      start_date: futureDates.start,
      end_date: futureDates.end,
      status: "active",
      banner_image_url: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&h=400&fit=crop",
      product_ids: allProductIds.slice(10, 15),
      category_ids: null,
      min_purchase_amount: 600000,
      max_discount_amount: 250000,
    },
  ]

  let successCount = 0
  let errorCount = 0

  for (const deal of sampleDeals) {
    try {
      // Check if deal already exists (by title)
      const { data: existing, error: checkError } = await supabase
        .from('deals')
        .select('id')
        .eq('title', deal.title)
        .maybeSingle()

      if (checkError && checkError.code !== 'PGRST116') {
        console.error(`⚠️  Error checking "${deal.title}":`, checkError.message)
      }

      if (existing) {
        console.log(`⏭️  Skipping "${deal.title}" - already exists`)
        continue
      }

      // Insert deal
      const { data, error } = await supabase
        .from('deals')
        .insert(deal)
        .select()
        .single()

      if (error) {
        console.error(`❌ Error inserting "${deal.title}":`, error.message)
        if (error.details) {
          console.error(`   Details:`, error.details)
        }
        if (error.message.includes('row-level security')) {
          console.error(`   ⚠️  RLS Error: Make sure you are using SERVICE_ROLE_KEY, not ANON_KEY`)
        }
        errorCount++
      } else {
        console.log(`✅ Inserted: ${deal.title}`)
        console.log(`   Discount: ${deal.discount_percentage > 0 ? deal.discount_percentage + '%' : deal.discount_amount + 'đ'}`)
        console.log(`   Products: ${deal.product_ids?.length || 0} products`)
        console.log(`   Status: ${deal.status}`)
        console.log(`   ID: ${data.id}\n`)
        successCount++
      }
    } catch (error) {
      console.error(`❌ Error inserting "${deal.title}":`, error.message)
      errorCount++
    }
  }

  console.log(`\n✨ Seeding completed!`)
  console.log(`✅ Success: ${successCount}`)
  console.log(`❌ Errors: ${errorCount}`)
  console.log(`📦 Total deals: ${sampleDeals.length}`)
  console.log(`\n💡 Tip: Check your deals at /deals page`)
}

// Run the seed function
seedDeals().catch(console.error)

