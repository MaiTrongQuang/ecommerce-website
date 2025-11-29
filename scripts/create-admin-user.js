/**
 * Script to promote a user to admin role
 * Run with: node scripts/create-admin-user.js <email>
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

async function promoteToAdmin() {
  // Get email from command line arguments
  const email = process.argv[2]
  
  if (!email) {
    console.error('❌ Error: Please provide an email address')
    console.error('Usage: node scripts/create-admin-user.js <email>')
    process.exit(1)
  }

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

  console.log(`🔍 Looking for user with email: ${email}...`)

  // 1. Check if user exists in auth.users (optional, but good for verification)
  // Note: We can't query auth.users directly easily without admin API, but we can check profiles table
  
  // 2. Check profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single()

  if (profileError) {
    console.error('❌ Error finding user profile:', profileError.message)
    console.error('   Make sure the user has signed up first!')
    process.exit(1)
  }

  if (!profile) {
    console.error('❌ User profile not found. Please sign up first.')
    process.exit(1)
  }

  console.log(`✅ Found user: ${profile.full_name || email} (ID: ${profile.id})`)
  console.log(`   Current Role: ${profile.role}`)

  if (profile.role === 'admin') {
    console.log('✨ User is already an admin!')
    return
  }

  // 3. Update role to admin
  console.log('🔄 Promoting user to admin...')
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', profile.id)

  if (updateError) {
    console.error('❌ Error updating role:', updateError.message)
    process.exit(1)
  }

  console.log('🎉 Success! User has been promoted to admin.')
  console.log('👉 You can now access the admin dashboard at /admin')
}

promoteToAdmin().catch(console.error)
