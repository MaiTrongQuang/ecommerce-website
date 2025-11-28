
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return {}
  const envContent = fs.readFileSync(envPath, 'utf-8')
  const env = {}
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      if (key) env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
    }
  })
  return env
}

async function debugImages() {
  const env = loadEnv()
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase URL or Anon Key')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  console.log('Fetching categories...')
  const { data: categories, error } = await supabase.from('categories').select('id, name, slug')

  if (error) {
    console.error('Error fetching categories:', error.message)
    return
  }

  console.log(`Found ${categories.length} categories. Checking images...`)
  
  const imagesDir = path.join(process.cwd(), 'public', 'images', 'categories')
  if (!fs.existsSync(imagesDir)) {
    console.error(`Images directory not found at: ${imagesDir}`)
    return
  }

  categories.forEach(cat => {
    if (!cat.slug) {
      console.error(`❌ Category "${cat.name}" has no slug!`)
      return
    }

    const filename = `${cat.slug}.png`
    const filePath = path.join(imagesDir, filename)
    
    if (fs.existsSync(filePath)) {
      console.log(`✅ Image exists for "${cat.name}": ${filename}`)
    } else {
      console.error(`❌ Image MISSING for "${cat.name}": ${filename}`)
    }
  })
}

debugImages()
