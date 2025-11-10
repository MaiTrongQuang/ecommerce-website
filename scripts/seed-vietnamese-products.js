/**
 * Script to seed Vietnamese products into Supabase database
 * Run with: node scripts/seed-vietnamese-products.js
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

// Vietnamese products with Unsplash images
const vietnameseProducts = [
  // Áo Dài (Traditional Vietnamese Dress)
  {
    name: "Áo Dài Truyền Thống",
    slug: "ao-dai-truyen-thong",
    category_slug: "trang-phuc-truyen-thong",
    description: "Áo dài truyền thống Việt Nam với chất liệu lụa cao cấp, thiết kế tinh tế và thanh lịch. Phù hợp cho các dịp lễ tết, cưới hỏi và sự kiện quan trọng.",
    price: 850000,
    compare_at_price: 1200000,
    quantity: 50,
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop"
    ],
    sku: "AD-TT-001",
    status: "active"
  },
  {
    name: "Áo Dài Cách Tân",
    slug: "ao-dai-cach-tan",
    category_slug: "trang-phuc-truyen-thong",
    description: "Áo dài cách tân hiện đại, kết hợp giữa truyền thống và phong cách thời trang hiện đại. Thoải mái và phong cách cho mọi dịp.",
    price: 650000,
    compare_at_price: 950000,
    quantity: 75,
    images: [
      "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop"
    ],
    sku: "AD-CT-002",
    status: "active"
  },

  // Nón Lá (Vietnamese Conical Hat)
  {
    name: "Nón Lá Việt Nam",
    slug: "non-la-viet-nam",
    category_slug: "trang-phuc-truyen-thong",
    description: "Nón lá truyền thống Việt Nam được làm thủ công từ lá cọ, bền đẹp và mát mẻ. Biểu tượng văn hóa Việt Nam.",
    price: 150000,
    compare_at_price: 200000,
    quantity: 200,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop"
    ],
    sku: "NL-VN-003",
    status: "active"
  },

  // Cà Phê (Coffee)
  {
    name: "Cà Phê Robusta Đắk Lắk",
    slug: "ca-phe-robusta-dak-lak",
    category_slug: "ca-phe-tra",
    description: "Cà phê Robusta nguyên chất từ Đắk Lắk, hương vị đậm đà đặc trưng. Đóng gói 500g, rang xay thủ công.",
    price: 180000,
    compare_at_price: 250000,
    quantity: 150,
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=800&fit=crop"
    ],
    sku: "CP-RB-004",
    status: "active"
  },
  {
    name: "Cà Phê Arabica Cầu Đất",
    slug: "ca-phe-arabica-cau-dat",
    category_slug: "ca-phe-tra",
    description: "Cà phê Arabica cao cấp từ Cầu Đất, Đà Lạt. Hương vị thơm ngon, chua thanh đặc trưng. Đóng gói 500g.",
    price: 320000,
    compare_at_price: 420000,
    quantity: 100,
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=800&fit=crop"
    ],
    sku: "CP-AR-005",
    status: "active"
  },
  {
    name: "Cà Phê Phin Truyền Thống",
    slug: "ca-phe-phin-truyen-thong",
    category_slug: "ca-phe-tra",
    description: "Bộ cà phê phin truyền thống Việt Nam gồm phin inox và cốc thủy tinh. Pha cà phê đậm đà theo cách Việt Nam.",
    price: 120000,
    compare_at_price: 180000,
    quantity: 300,
    images: [
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop"
    ],
    sku: "CP-PHIN-006",
    status: "active"
  },

  // Trà (Tea)
  {
    name: "Trà Shan Tuyết Cổ Thụ",
    slug: "tra-shan-tuyet-co-thu",
    category_slug: "ca-phe-tra",
    description: "Trà Shan Tuyết cổ thụ từ vùng núi Tây Bắc, hương vị đặc biệt, tốt cho sức khỏe. Đóng gói 200g.",
    price: 450000,
    compare_at_price: 600000,
    quantity: 80,
    images: [
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=800&fit=crop"
    ],
    sku: "TRA-ST-007",
    status: "active"
  },
  {
    name: "Trà Ô Long Mộc Châu",
    slug: "tra-o-long-moc-chau",
    category_slug: "ca-phe-tra",
    description: "Trà Ô Long cao cấp từ Mộc Châu, hương thơm tự nhiên, vị ngọt thanh. Đóng gói 250g.",
    price: 280000,
    compare_at_price: 380000,
    quantity: 120,
    images: [
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=800&fit=crop"
    ],
    sku: "TRA-OL-008",
    status: "active"
  },

  // Gốm Sứ (Ceramics)
  {
    name: "Bộ Ấm Chén Gốm Bát Tràng",
    slug: "bo-am-chen-gom-bat-trang",
    category_slug: "gom-su-do-gia-dung",
    description: "Bộ ấm chén gốm Bát Tràng truyền thống, được làm thủ công tinh xảo. Thiết kế cổ điển, chất lượng cao.",
    price: 550000,
    compare_at_price: 750000,
    quantity: 60,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop"
    ],
    sku: "GS-BT-009",
    status: "active"
  },
  {
    name: "Lọ Hoa Gốm Sứ Bát Tràng",
    slug: "lo-hoa-gom-su-bat-trang",
    category_slug: "gom-su-do-gia-dung",
    description: "Lọ hoa gốm sứ Bát Tràng với hoa văn tinh xảo, phù hợp trang trí nội thất. Kích thước 30cm.",
    price: 380000,
    compare_at_price: 520000,
    quantity: 90,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop"
    ],
    sku: "GS-LH-010",
    status: "active"
  },

  // Đồ Thủ Công Mỹ Nghệ (Handicrafts)
  {
    name: "Tranh Thêu Tay Hà Đông",
    slug: "tranh-theu-tay-ha-dong",
    category_slug: "thu-cong-my-nghe",
    description: "Tranh thêu tay truyền thống Hà Đông, tinh xảo và đẹp mắt. Kích thước 40x50cm, khung gỗ tự nhiên.",
    price: 1200000,
    compare_at_price: 1800000,
    quantity: 25,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop"
    ],
    sku: "TCM-TT-011",
    status: "active"
  },
  {
    name: "Túi Xách Lá Cọ",
    slug: "tui-xach-la-co",
    category_slug: "thu-cong-my-nghe",
    description: "Túi xách được đan từ lá cọ tự nhiên, thân thiện môi trường và độc đáo. Kích thước vừa, phù hợp đi chợ, đi biển.",
    price: 250000,
    compare_at_price: 350000,
    quantity: 150,
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop"
    ],
    sku: "TCM-TX-012",
    status: "active"
  },

  // Đồ Ăn Vặt (Snacks)
  {
    name: "Bánh Tráng Nướng Đà Lạt",
    slug: "banh-trang-nuong-da-lat",
    category_slug: "do-an-vat-dac-san",
    description: "Bánh tráng nướng Đà Lạt đặc sản, giòn tan, thơm ngon. Gói 10 cái, bảo quản tốt.",
    price: 45000,
    compare_at_price: 60000,
    quantity: 500,
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=800&fit=crop"
    ],
    sku: "DA-BT-013",
    status: "active"
  },
  {
    name: "Kẹo Dừa Bến Tre",
    slug: "keo-dua-ben-tre",
    category_slug: "do-an-vat-dac-san",
    description: "Kẹo dừa Bến Tre truyền thống, ngọt thanh tự nhiên từ dừa tươi. Hộp 500g.",
    price: 85000,
    compare_at_price: 120000,
    quantity: 400,
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=800&fit=crop"
    ],
    sku: "DA-KD-014",
    status: "active"
  },
  {
    name: "Mứt Dừa Bến Tre",
    slug: "mut-dua-ben-tre",
    category_slug: "do-an-vat-dac-san",
    description: "Mứt dừa Bến Tre thơm ngon, được làm từ dừa tươi nguyên chất. Hộp 400g.",
    price: 95000,
    compare_at_price: 130000,
    quantity: 350,
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=800&fit=crop"
    ],
    sku: "DA-MD-015",
    status: "active"
  },

  // Đồ Lưu Niệm (Souvenirs)
  {
    name: "Tượng Gỗ Tâm Linh",
    slug: "tuong-go-tam-linh",
    category_slug: "do-luu-niem",
    description: "Tượng gỗ tâm linh được chạm khắc thủ công, mang ý nghĩa phong thủy. Kích thước 20cm.",
    price: 680000,
    compare_at_price: 950000,
    quantity: 40,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop"
    ],
    sku: "DLN-TG-016",
    status: "active"
  },
  {
    name: "Vòng Tay Tre Nứa",
    slug: "vong-tay-tre-nua",
    category_slug: "do-luu-niem",
    description: "Vòng tay được làm từ tre nứa tự nhiên, thiết kế đơn giản và thanh lịch. Phù hợp mọi lứa tuổi.",
    price: 120000,
    compare_at_price: 180000,
    quantity: 200,
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop"
    ],
    sku: "DLN-VT-017",
    status: "active"
  },

  // Đồ Gia Dụng (Household Items)
  {
    name: "Chiếu Cói Truyền Thống",
    slug: "chieu-coi-truyen-thong",
    category_slug: "gom-su-do-gia-dung",
    description: "Chiếu cói truyền thống Việt Nam, mát mẻ và thoáng khí. Kích thước 1.2x2m, phù hợp giường đôi.",
    price: 420000,
    compare_at_price: 580000,
    quantity: 100,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop"
    ],
    sku: "DGD-CC-018",
    status: "active"
  },
  {
    name: "Rổ Tre Đan Thủ Công",
    slug: "ro-tre-dan-thu-cong",
    category_slug: "gom-su-do-gia-dung",
    description: "Rổ tre được đan thủ công, bền đẹp và thân thiện môi trường. Kích thước vừa, đa dụng.",
    price: 180000,
    compare_at_price: 250000,
    quantity: 180,
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop"
    ],
    sku: "DGD-RT-019",
    status: "active"
  },

  // Đồ Uống (Beverages)
  {
    name: "Nước Mắm Phú Quốc",
    slug: "nuoc-mam-phu-quoc",
    category_slug: "do-uong",
    description: "Nước mắm Phú Quốc nguyên chất, đậm đà hương vị biển. Chai 500ml, chất lượng cao cấp.",
    price: 125000,
    compare_at_price: 180000,
    quantity: 300,
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=800&fit=crop"
    ],
    sku: "DU-NM-020",
    status: "active"
  },
  {
    name: "Rượu Nếp Cẩm",
    slug: "ruou-nep-cam",
    category_slug: "do-uong",
    description: "Rượu nếp cẩm truyền thống, ngọt thanh và thơm ngon. Chai 500ml, phù hợp làm quà.",
    price: 180000,
    compare_at_price: 250000,
    quantity: 150,
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=800&fit=crop"
    ],
    sku: "DU-RN-021",
    status: "active"
  }
]

async function seedProducts() {
  // Load environment variables
  const env = loadEnv()
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials!')
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
    console.error('\nExample .env.local:')
    console.error('NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co')
    console.error('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key')
    console.error('\n⚠️  IMPORTANT: You MUST use SUPABASE_SERVICE_ROLE_KEY (not ANON_KEY)')
    console.error('   Service Role Key bypasses Row Level Security (RLS)')
    console.error('   Find it in: Supabase Dashboard > Settings > API > Service Role Key')
    process.exit(1)
  }

  // Validate that it's a Service Role Key (starts with 'eyJ' and is longer than anon key)
  if (supabaseKey.length < 200) {
    console.error('⚠️  WARNING: The key seems too short. Make sure you are using SERVICE_ROLE_KEY, not ANON_KEY')
    console.error('   Service Role Key is much longer than Anon Key')
  }

  // Create Supabase client with Service Role Key
  // Service Role Key automatically bypasses Row Level Security (RLS)
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  console.log('🌱 Starting to seed Vietnamese products...\n')
  console.log(`📋 Using Supabase URL: ${supabaseUrl}`)
  console.log(`🔑 Using Service Role Key: ${supabaseKey.substring(0, 20)}...\n`)

  // Test connection first
  try {
    const { error: testError } = await supabase
      .from('products')
      .select('id')
      .limit(1)

    if (testError) {
      console.error('❌ Connection test failed:', testError.message)
      if (testError.message.includes('row-level security')) {
        console.error('\n⚠️  RLS Error detected!')
        console.error('   This means you are NOT using Service Role Key')
        console.error('   Please check your SUPABASE_SERVICE_ROLE_KEY in .env.local')
        console.error('   Service Role Key can be found in:')
        console.error('   Supabase Dashboard > Settings > API > Service Role Key')
      }
      process.exit(1)
    }
    console.log('✅ Connection test passed - Service Role Key is working\n')
  } catch (error) {
    console.error('❌ Connection test error:', error.message)
    process.exit(1)
  }

  // Fetch all categories to map category slugs to IDs
  console.log('📂 Fetching categories...')
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('id, slug')

  if (categoriesError) {
    console.error('⚠️  Warning: Could not fetch categories:', categoriesError.message)
    console.error('   Products will be created without category assignment')
  } else {
    console.log(`✅ Found ${categories?.length || 0} categories\n`)
  }

  const categoryMap = {}
  if (categories) {
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat.id
    })
  }

  let successCount = 0
  let errorCount = 0

  for (const product of vietnameseProducts) {
    try {
      // Check if product already exists
      const { data: existing, error: checkError } = await supabase
        .from('products')
        .select('id')
        .eq('slug', product.slug)
        .maybeSingle()

      // If error is not "not found" error, log it
      if (checkError && checkError.code !== 'PGRST116') {
        console.error(`⚠️  Error checking "${product.name}":`, checkError.message)
      }

      if (existing) {
        console.log(`⏭️  Skipping "${product.name}" - already exists`)
        continue
      }

      // Map category_slug to category_id
      const productData = { ...product }
      if (product.category_slug && categoryMap[product.category_slug]) {
        productData.category_id = categoryMap[product.category_slug]
        delete productData.category_slug
      } else if (product.category_slug) {
        console.log(`⚠️  Category "${product.category_slug}" not found for "${product.name}"`)
      }

      // Insert product
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single()

      if (error) {
        console.error(`❌ Error inserting "${product.name}":`, error.message)
        if (error.details) {
          console.error(`   Details:`, error.details)
        }
        if (error.message.includes('row-level security')) {
          console.error(`   ⚠️  RLS Error: Make sure you are using SERVICE_ROLE_KEY, not ANON_KEY`)
        }
        errorCount++
      } else {
        console.log(`✅ Inserted: ${product.name} (ID: ${data.id})`)
        successCount++
      }
    } catch (error) {
      console.error(`❌ Error inserting "${product.name}":`, error.message)
      errorCount++
    }
  }

  console.log(`\n✨ Seeding completed!`)
  console.log(`✅ Success: ${successCount}`)
  console.log(`❌ Errors: ${errorCount}`)
  console.log(`📦 Total products: ${vietnameseProducts.length}`)
}

// Run the seed function
seedProducts().catch(console.error)

