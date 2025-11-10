import { createClient } from "@/lib/server"
import { NextResponse } from "next/server"

// Vietnamese products with Unsplash images
const vietnameseProducts = [
  // Áo Dài (Traditional Vietnamese Dress)
  {
    name: "Áo Dài Truyền Thống",
    slug: "ao-dai-truyen-thong",
    description: "Áo dài truyền thống Việt Nam với chất liệu lụa cao cấp, thiết kế tinh tế và thanh lịch. Phù hợp cho các dịp lễ tết, cưới hỏi và sự kiện quan trọng.",
    price: 850000,
    compare_at_price: 1200000,
    quantity: 50,
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop"
    ],
    sku: "AD-TT-001",
    status: "active" as const
  },
  {
    name: "Áo Dài Cách Tân",
    slug: "ao-dai-cach-tan",
    description: "Áo dài cách tân hiện đại, kết hợp giữa truyền thống và phong cách thời trang hiện đại. Thoải mái và phong cách cho mọi dịp.",
    price: 650000,
    compare_at_price: 950000,
    quantity: 75,
    images: [
      "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop"
    ],
    sku: "AD-CT-002",
    status: "active" as const
  },

  // Nón Lá (Vietnamese Conical Hat)
  {
    name: "Nón Lá Việt Nam",
    slug: "non-la-viet-nam",
    description: "Nón lá truyền thống Việt Nam được làm thủ công từ lá cọ, bền đẹp và mát mẻ. Biểu tượng văn hóa Việt Nam.",
    price: 150000,
    compare_at_price: 200000,
    quantity: 200,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop"
    ],
    sku: "NL-VN-003",
    status: "active" as const
  },

  // Cà Phê (Coffee)
  {
    name: "Cà Phê Robusta Đắk Lắk",
    slug: "ca-phe-robusta-dak-lak",
    description: "Cà phê Robusta nguyên chất từ Đắk Lắk, hương vị đậm đà đặc trưng. Đóng gói 500g, rang xay thủ công.",
    price: 180000,
    compare_at_price: 250000,
    quantity: 150,
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=800&fit=crop"
    ],
    sku: "CP-RB-004",
    status: "active" as const
  },
  {
    name: "Cà Phê Arabica Cầu Đất",
    slug: "ca-phe-arabica-cau-dat",
    description: "Cà phê Arabica cao cấp từ Cầu Đất, Đà Lạt. Hương vị thơm ngon, chua thanh đặc trưng. Đóng gói 500g.",
    price: 320000,
    compare_at_price: 420000,
    quantity: 100,
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=800&fit=crop"
    ],
    sku: "CP-AR-005",
    status: "active" as const
  },
  {
    name: "Cà Phê Phin Truyền Thống",
    slug: "ca-phe-phin-truyen-thong",
    description: "Bộ cà phê phin truyền thống Việt Nam gồm phin inox và cốc thủy tinh. Pha cà phê đậm đà theo cách Việt Nam.",
    price: 120000,
    compare_at_price: 180000,
    quantity: 300,
    images: [
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop"
    ],
    sku: "CP-PHIN-006",
    status: "active" as const
  },

  // Trà (Tea)
  {
    name: "Trà Shan Tuyết Cổ Thụ",
    slug: "tra-shan-tuyet-co-thu",
    description: "Trà Shan Tuyết cổ thụ từ vùng núi Tây Bắc, hương vị đặc biệt, tốt cho sức khỏe. Đóng gói 200g.",
    price: 450000,
    compare_at_price: 600000,
    quantity: 80,
    images: [
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=800&fit=crop"
    ],
    sku: "TRA-ST-007",
    status: "active" as const
  },
  {
    name: "Trà Ô Long Mộc Châu",
    slug: "tra-o-long-moc-chau",
    description: "Trà Ô Long cao cấp từ Mộc Châu, hương thơm tự nhiên, vị ngọt thanh. Đóng gói 250g.",
    price: 280000,
    compare_at_price: 380000,
    quantity: 120,
    images: [
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=800&fit=crop"
    ],
    sku: "TRA-OL-008",
    status: "active" as const
  },

  // Gốm Sứ (Ceramics)
  {
    name: "Bộ Ấm Chén Gốm Bát Tràng",
    slug: "bo-am-chen-gom-bat-trang",
    description: "Bộ ấm chén gốm Bát Tràng truyền thống, được làm thủ công tinh xảo. Thiết kế cổ điển, chất lượng cao.",
    price: 550000,
    compare_at_price: 750000,
    quantity: 60,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop"
    ],
    sku: "GS-BT-009",
    status: "active" as const
  },
  {
    name: "Lọ Hoa Gốm Sứ Bát Tràng",
    slug: "lo-hoa-gom-su-bat-trang",
    description: "Lọ hoa gốm sứ Bát Tràng với hoa văn tinh xảo, phù hợp trang trí nội thất. Kích thước 30cm.",
    price: 380000,
    compare_at_price: 520000,
    quantity: 90,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop"
    ],
    sku: "GS-LH-010",
    status: "active" as const
  },

  // Đồ Thủ Công Mỹ Nghệ (Handicrafts)
  {
    name: "Tranh Thêu Tay Hà Đông",
    slug: "tranh-theu-tay-ha-dong",
    description: "Tranh thêu tay truyền thống Hà Đông, tinh xảo và đẹp mắt. Kích thước 40x50cm, khung gỗ tự nhiên.",
    price: 1200000,
    compare_at_price: 1800000,
    quantity: 25,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop"
    ],
    sku: "TCM-TT-011",
    status: "active" as const
  },
  {
    name: "Túi Xách Lá Cọ",
    slug: "tui-xach-la-co",
    description: "Túi xách được đan từ lá cọ tự nhiên, thân thiện môi trường và độc đáo. Kích thước vừa, phù hợp đi chợ, đi biển.",
    price: 250000,
    compare_at_price: 350000,
    quantity: 150,
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop"
    ],
    sku: "TCM-TX-012",
    status: "active" as const
  },

  // Đồ Ăn Vặt (Snacks)
  {
    name: "Bánh Tráng Nướng Đà Lạt",
    slug: "banh-trang-nuong-da-lat",
    description: "Bánh tráng nướng Đà Lạt đặc sản, giòn tan, thơm ngon. Gói 10 cái, bảo quản tốt.",
    price: 45000,
    compare_at_price: 60000,
    quantity: 500,
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=800&fit=crop"
    ],
    sku: "DA-BT-013",
    status: "active" as const
  },
  {
    name: "Kẹo Dừa Bến Tre",
    slug: "keo-dua-ben-tre",
    description: "Kẹo dừa Bến Tre truyền thống, ngọt thanh tự nhiên từ dừa tươi. Hộp 500g.",
    price: 85000,
    compare_at_price: 120000,
    quantity: 400,
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=800&fit=crop"
    ],
    sku: "DA-KD-014",
    status: "active" as const
  },
  {
    name: "Mứt Dừa Bến Tre",
    slug: "mut-dua-ben-tre",
    description: "Mứt dừa Bến Tre thơm ngon, được làm từ dừa tươi nguyên chất. Hộp 400g.",
    price: 95000,
    compare_at_price: 130000,
    quantity: 350,
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=800&fit=crop"
    ],
    sku: "DA-MD-015",
    status: "active" as const
  },

  // Đồ Lưu Niệm (Souvenirs)
  {
    name: "Tượng Gỗ Tâm Linh",
    slug: "tuong-go-tam-linh",
    description: "Tượng gỗ tâm linh được chạm khắc thủ công, mang ý nghĩa phong thủy. Kích thước 20cm.",
    price: 680000,
    compare_at_price: 950000,
    quantity: 40,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop"
    ],
    sku: "DLN-TG-016",
    status: "active" as const
  },
  {
    name: "Vòng Tay Tre Nứa",
    slug: "vong-tay-tre-nua",
    description: "Vòng tay được làm từ tre nứa tự nhiên, thiết kế đơn giản và thanh lịch. Phù hợp mọi lứa tuổi.",
    price: 120000,
    compare_at_price: 180000,
    quantity: 200,
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop"
    ],
    sku: "DLN-VT-017",
    status: "active" as const
  },

  // Đồ Gia Dụng (Household Items)
  {
    name: "Chiếu Cói Truyền Thống",
    slug: "chieu-coi-truyen-thong",
    description: "Chiếu cói truyền thống Việt Nam, mát mẻ và thoáng khí. Kích thước 1.2x2m, phù hợp giường đôi.",
    price: 420000,
    compare_at_price: 580000,
    quantity: 100,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop"
    ],
    sku: "DGD-CC-018",
    status: "active" as const
  },
  {
    name: "Rổ Tre Đan Thủ Công",
    slug: "ro-tre-dan-thu-cong",
    description: "Rổ tre được đan thủ công, bền đẹp và thân thiện môi trường. Kích thước vừa, đa dụng.",
    price: 180000,
    compare_at_price: 250000,
    quantity: 180,
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop"
    ],
    sku: "DGD-RT-019",
    status: "active" as const
  },

  // Đồ Uống (Beverages)
  {
    name: "Nước Mắm Phú Quốc",
    slug: "nuoc-mam-phu-quoc",
    description: "Nước mắm Phú Quốc nguyên chất, đậm đà hương vị biển. Chai 500ml, chất lượng cao cấp.",
    price: 125000,
    compare_at_price: 180000,
    quantity: 300,
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=800&fit=crop"
    ],
    sku: "DU-NM-020",
    status: "active" as const
  },
  {
    name: "Rượu Nếp Cẩm",
    slug: "ruou-nep-cam",
    description: "Rượu nếp cẩm truyền thống, ngọt thanh và thơm ngon. Chai 500ml, phù hợp làm quà.",
    price: 180000,
    compare_at_price: 250000,
    quantity: 150,
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=800&fit=crop"
    ],
    sku: "DU-RN-021",
    status: "active" as const
  }
]

export async function POST() {
  try {
    const supabase = await createClient()

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    let successCount = 0
    let errorCount = 0
    const errors: string[] = []

    for (const product of vietnameseProducts) {
      try {
        // Check if product already exists
        const { data: existing } = await supabase
          .from("products")
          .select("id")
          .eq("slug", product.slug)
          .single()

        if (existing) {
          continue // Skip if exists
        }

        // Insert product
        const { error } = await supabase.from("products").insert(product)

        if (error) {
          errorCount++
          errors.push(`${product.name}: ${error.message}`)
        } else {
          successCount++
        }
      } catch (error) {
        errorCount++
        errors.push(`${product.name}: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${successCount} products successfully`,
      successCount,
      errorCount,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error("[Admin] Error seeding products:", error)
    return NextResponse.json(
      { error: "Failed to seed products", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

