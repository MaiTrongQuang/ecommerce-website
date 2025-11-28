
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

async function checkProduct() {
  const env = loadEnv()
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase URL or Anon Key')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const slug = 'tra-o-long-moc-chau'
  
  console.log(`Checking product with slug: ${slug}`)

  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, status')
    .eq('slug', slug)
  
  if (error) {
    console.error('Error fetching product:', error)
  } else {
    console.log('Product found:', data)
  }
}

checkProduct()
