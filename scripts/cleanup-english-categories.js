/**
 * Script to remove English product categories from Supabase database
 * Run with: node scripts/cleanup-english-categories.js
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

const englishCategories = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports & Outdoors",
  "Books",
  "Toys & Games",
  "Health & Beauty",
  "Automotive"
]

async function cleanupCategories() {
  const env = loadEnv()
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials!')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  console.log('🧹 Starting to clean up English categories...\n')

  let deletedCount = 0
  let errorCount = 0

  for (const name of englishCategories) {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('name', name)

      if (error) {
        console.error(`❌ Error deleting "${name}":`, error.message)
        errorCount++
      } else {
        console.log(`✅ Deleted (if existed): ${name}`)
        deletedCount++
      }
    } catch (error) {
      console.error(`❌ Error deleting "${name}":`, error.message)
      errorCount++
    }
  }

  console.log(`\n✨ Cleanup completed!`)
}

cleanupCategories().catch(console.error)
