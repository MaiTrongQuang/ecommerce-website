/**
 * Script to update category_id for existing Vietnamese products
 * Run with: node scripts/update-product-categories.js
 * 
 * This script will update category_id for products that already exist in the database
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

// Product slug to category slug mapping
const productCategoryMap = {
  // Trang Phục Truyền Thống
  "ao-dai-truyen-thong": "trang-phuc-truyen-thong",
  "ao-dai-cach-tan": "trang-phuc-truyen-thong",
  "non-la-viet-nam": "trang-phuc-truyen-thong",
  
  // Cà Phê & Trà
  "ca-phe-robusta-dak-lak": "ca-phe-tra",
  "ca-phe-arabica-cau-dat": "ca-phe-tra",
  "ca-phe-phin-truyen-thong": "ca-phe-tra",
  "tra-shan-tuyet-co-thu": "ca-phe-tra",
  "tra-o-long-moc-chau": "ca-phe-tra",
  
  // Gốm Sứ & Đồ Gia Dụng
  "bo-am-chen-gom-bat-trang": "gom-su-do-gia-dung",
  "lo-hoa-gom-su-bat-trang": "gom-su-do-gia-dung",
  "chieu-coi-truyen-thong": "gom-su-do-gia-dung",
  "ro-tre-dan-thu-cong": "gom-su-do-gia-dung",
  
  // Thủ Công Mỹ Nghệ
  "tranh-theu-tay-ha-dong": "thu-cong-my-nghe",
  "tui-xach-la-co": "thu-cong-my-nghe",
  
  // Đồ Ăn Vặt & Đặc Sản
  "banh-trang-nuong-da-lat": "do-an-vat-dac-san",
  "keo-dua-ben-tre": "do-an-vat-dac-san",
  "mut-dua-ben-tre": "do-an-vat-dac-san",
  
  // Đồ Lưu Niệm
  "tuong-go-tam-linh": "do-luu-niem",
  "vong-tay-tre-nua": "do-luu-niem",
  
  // Đồ Uống
  "nuoc-mam-phu-quoc": "do-uong",
  "ruou-nep-cam": "do-uong"
}

async function updateProductCategories() {
  // Load environment variables
  const env = loadEnv()
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials!')
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
    process.exit(1)
  }

  // Create Supabase client with Service Role Key
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  console.log('🔄 Starting to update product categories...\n')

  // Fetch all categories
  console.log('📂 Fetching categories...')
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('id, slug')

  if (categoriesError) {
    console.error('❌ Error fetching categories:', categoriesError.message)
    process.exit(1)
  }

  const categoryMap = {}
  categories.forEach(cat => {
    categoryMap[cat.slug] = cat.id
  })
  console.log(`✅ Found ${categories.length} categories\n`)

  // Fetch all products
  console.log('📦 Fetching products...')
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, slug, category_id, name')

  if (productsError) {
    console.error('❌ Error fetching products:', productsError.message)
    process.exit(1)
  }

  console.log(`✅ Found ${products.length} products\n`)

  let updatedCount = 0
  let skippedCount = 0
  let errorCount = 0

  for (const product of products) {
    const categorySlug = productCategoryMap[product.slug]
    
    if (!categorySlug) {
      console.log(`⏭️  Skipping "${product.name}" - no category mapping found`)
      skippedCount++
      continue
    }

    const categoryId = categoryMap[categorySlug]
    if (!categoryId) {
      console.log(`⚠️  Category "${categorySlug}" not found for "${product.name}"`)
      skippedCount++
      continue
    }

    // Skip if category already set correctly
    if (product.category_id === categoryId) {
      console.log(`✓ "${product.name}" already has correct category`)
      skippedCount++
      continue
    }

    // Update product category
    const { error: updateError } = await supabase
      .from('products')
      .update({ category_id: categoryId })
      .eq('id', product.id)

    if (updateError) {
      console.error(`❌ Error updating "${product.name}":`, updateError.message)
      errorCount++
    } else {
      console.log(`✅ Updated "${product.name}" -> ${categorySlug}`)
      updatedCount++
    }
  }

  console.log(`\n✨ Update completed!`)
  console.log(`✅ Updated: ${updatedCount}`)
  console.log(`⏭️  Skipped: ${skippedCount}`)
  console.log(`❌ Errors: ${errorCount}`)
}

// Run the update function
updateProductCategories().catch(console.error)

