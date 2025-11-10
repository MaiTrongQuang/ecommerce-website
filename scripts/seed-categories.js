/**
 * Script to seed Vietnamese product categories into Supabase database
 * Run with: node scripts/seed-categories.js
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

// Vietnamese product categories
const vietnameseCategories = [
  {
    name: "Trang Phục Truyền Thống",
    slug: "trang-phuc-truyen-thong",
    description: "Áo dài, nón lá và các trang phục truyền thống Việt Nam"
  },
  {
    name: "Cà Phê & Trà",
    slug: "ca-phe-tra",
    description: "Cà phê và trà đặc sản Việt Nam"
  },
  {
    name: "Gốm Sứ & Đồ Gia Dụng",
    slug: "gom-su-do-gia-dung",
    description: "Gốm sứ Bát Tràng và các đồ gia dụng truyền thống"
  },
  {
    name: "Thủ Công Mỹ Nghệ",
    slug: "thu-cong-my-nghe",
    description: "Đồ thủ công mỹ nghệ Việt Nam"
  },
  {
    name: "Đồ Ăn Vặt & Đặc Sản",
    slug: "do-an-vat-dac-san",
    description: "Đồ ăn vặt và đặc sản các vùng miền"
  },
  {
    name: "Đồ Lưu Niệm",
    slug: "do-luu-niem",
    description: "Quà lưu niệm và đồ trang trí"
  },
  {
    name: "Đồ Uống",
    slug: "do-uong",
    description: "Nước mắm, rượu và các đồ uống truyền thống"
  }
]

async function seedCategories() {
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

  console.log('🌱 Starting to seed Vietnamese categories...\n')

  // Test connection first
  try {
    const { error: testError } = await supabase
      .from('categories')
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

  let successCount = 0
  let errorCount = 0

  for (const category of vietnameseCategories) {
    try {
      // Check if category already exists
      const { data: existing, error: checkError } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category.slug)
        .maybeSingle()

      if (checkError && checkError.code !== 'PGRST116') {
        console.error(`⚠️  Error checking "${category.name}":`, checkError.message)
      }

      if (existing) {
        console.log(`⏭️  Skipping "${category.name}" - already exists`)
        continue
      }

      // Insert category
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single()

      if (error) {
        console.error(`❌ Error inserting "${category.name}":`, error.message)
        if (error.details) {
          console.error(`   Details:`, error.details)
        }
        errorCount++
      } else {
        console.log(`✅ Inserted: ${category.name} (ID: ${data.id})`)
        successCount++
      }
    } catch (error) {
      console.error(`❌ Error inserting "${category.name}":`, error.message)
      errorCount++
    }
  }

  console.log(`\n✨ Seeding completed!`)
  console.log(`✅ Success: ${successCount}`)
  console.log(`❌ Errors: ${errorCount}`)
  console.log(`📦 Total categories: ${vietnameseCategories.length}`)
}

// Run the seed function
seedCategories().catch(console.error)

