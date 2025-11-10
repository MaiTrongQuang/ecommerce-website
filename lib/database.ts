export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          price: number
          compare_at_price: number | null
          cost_per_item: number | null
          sku: string | null
          barcode: string | null
          quantity: number
          category_id: string | null
          images: string[]
          status: "draft" | "active" | "archived"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          price: number
          compare_at_price?: number | null
          cost_per_item?: number | null
          sku?: string | null
          barcode?: string | null
          quantity?: number
          category_id?: string | null
          images?: string[]
          status?: "draft" | "active" | "archived"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          price?: number
          compare_at_price?: number | null
          cost_per_item?: number | null
          sku?: string | null
          barcode?: string | null
          quantity?: number
          category_id?: string | null
          images?: string[]
          status?: "draft" | "active" | "archived"
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          role: "customer" | "admin"
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          role?: "customer" | "admin"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          role?: "customer" | "admin"
          created_at?: string
          updated_at?: string
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          full_name: string
          phone: string
          address_line1: string
          address_line2: string | null
          city: string
          state: string
          postal_code: string
          country: string
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          phone: string
          address_line1: string
          address_line2?: string | null
          city: string
          state: string
          postal_code: string
          country?: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          phone?: string
          address_line1?: string
          address_line2?: string | null
          city?: string
          state?: string
          postal_code?: string
          country?: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          order_number: string
          status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
          subtotal: number
          tax: number
          shipping: number
          total: number
          shipping_address_id: string | null
          billing_address_id: string | null
          payment_method: string | null
          payment_status: "pending" | "paid" | "failed" | "refunded"
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          order_number: string
          status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
          subtotal: number
          tax: number
          shipping: number
          total: number
          shipping_address_id?: string | null
          billing_address_id?: string | null
          payment_method?: string | null
          payment_status?: "pending" | "paid" | "failed" | "refunded"
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          order_number?: string
          status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
          subtotal?: number
          tax?: number
          shipping?: number
          total?: number
          shipping_address_id?: string | null
          billing_address_id?: string | null
          payment_method?: string | null
          payment_status?: "pending" | "paid" | "failed" | "refunded"
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_name: string
          product_image: string | null
          quantity: number
          price: number
          total: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          product_name: string
          product_image?: string | null
          quantity: number
          price: number
          total: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          product_name?: string
          product_image?: string | null
          quantity?: number
          price?: number
          total?: number
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          rating: number
          title: string | null
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          rating: number
          title?: string | null
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          rating?: number
          title?: string | null
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
