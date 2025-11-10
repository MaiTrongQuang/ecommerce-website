/**
 * Script to check detailed structure of existing tables in Supabase
 * 
 * Usage: node scripts/check-table-structure.js
 */

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

const env = loadEnv()
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Function to get table structure by querying a sample row
async function getTableStructureFromSample(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1)

    if (error) {
      return { error: error.message, columns: null }
    }

    if (data && data.length > 0) {
      const columns = Object.keys(data[0])
      const columnTypes = {}
      
      columns.forEach(col => {
        const value = data[0][col]
        if (value === null) {
          columnTypes[col] = 'nullable'
        } else if (Array.isArray(value)) {
          columnTypes[col] = 'array'
        } else if (typeof value === 'object') {
          columnTypes[col] = 'json/jsonb'
        } else {
          columnTypes[col] = typeof value
        }
      })
      
      return { columns, columnTypes, sampleData: data[0] }
    } else {
      // Table is empty, try to get structure from information_schema via SQL
      return { columns: null, columnTypes: null, sampleData: null }
    }
  } catch (err) {
    return { error: err.message, columns: null }
  }
}

// Function to get table structure using SQL query
async function getTableStructureSQL(tableName) {
  try {
    // Try to get structure from a sample row first
    return await getTableStructureFromSample(tableName)
  } catch (err) {
    return { error: err.message, columns: null }
  }
}

async function checkTableStructure() {
  console.log('🔍 Checking detailed table structure...\n')
  console.log(`📡 Connecting to: ${supabaseUrl}\n`)

  // List of all tables
  const allTables = [
    'categories',
    'products',
    'profiles',
    'addresses',
    'orders',
    'order_items',
    'reviews',
    'cart_items',
    'coupons',
    'wishlists',
    'product_variants',
    'product_attributes',
    'inventory_logs',
    'shipping_methods',
    'notifications',
    'product_tags',
    'product_tag_mappings',
    'order_status_history',
    'refunds',
    'order_coupons',
  ]

  const existingTables = []
  const missingTables = []
  const tableStructures = {}

  console.log('📊 Checking table existence and structure:\n')
  console.log('═'.repeat(100))

  for (const table of allTables) {
    try {
      // Try to get table info by querying with limit 0
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })

      if (error) {
        if (error.code === '42P01') {
          missingTables.push(table)
          console.log(`❌ ${table.padEnd(30)} - Table does not exist`)
        } else {
          // Table exists but might have RLS issues
          existingTables.push({ table, exists: true, error: error.message, count: 0 })
          console.log(`⚠️  ${table.padEnd(30)} - Exists but has error: ${error.message}`)
          
          // Try to get structure anyway
          const structure = await getTableStructureSQL(table)
          if (structure.columns || structure.error) {
            tableStructures[table] = structure
          }
        }
      } else {
        existingTables.push({ table, exists: true, count: count || 0, error: null })
        const status = count && count > 0 ? `✅ (${count} rows)` : '✅ (empty)'
        console.log(`${status.padEnd(15)} ${table}`)
        
        // Get table structure
        const structure = await getTableStructureSQL(table)
        tableStructures[table] = structure
      }
    } catch (err) {
      console.log(`❌ ${table.padEnd(30)} - Error: ${err.message}`)
      missingTables.push(table)
    }
  }

  console.log('═'.repeat(100))
  console.log('\n📈 Summary:\n')

  const tablesWithData = existingTables.filter((t) => t.count > 0)
  const tablesWithErrors = existingTables.filter((t) => t.error)

  console.log(`✅ Existing tables: ${existingTables.length}/${allTables.length}`)
  console.log(`❌ Missing tables: ${missingTables.length}/${allTables.length}`)
  console.log(`📦 Tables with data: ${tablesWithData.length}/${existingTables.length}`)
  
  if (tablesWithErrors.length > 0) {
    console.log(`⚠️  Tables with access errors: ${tablesWithErrors.length}`)
  }

  // Show tables with data
  if (tablesWithData.length > 0) {
    console.log('\n📦 Tables with data:')
    tablesWithData.forEach(({ table, count }) => {
      console.log(`   - ${table}: ${count} rows`)
    })
  }

  // Show tables with errors (might be RLS issues)
  if (tablesWithErrors.length > 0) {
    console.log('\n⚠️  Tables with access errors (might be RLS policies):')
    tablesWithErrors.forEach(({ table, error }) => {
      console.log(`   - ${table}: ${error}`)
    })
    console.log('\n💡 These tables exist but might have Row Level Security policies')
    console.log('   that prevent anonymous access. This is normal for protected tables.')
  }

  // Show missing tables
  if (missingTables.length > 0) {
    console.log('\n❌ Missing tables:')
    missingTables.forEach((table) => {
      console.log(`   - ${table}`)
    })
    console.log('\n💡 To create missing tables, run these SQL scripts in Supabase:')
    
    const basicMissing = ['products', 'profiles', 'orders', 'order_items'].filter(t => missingTables.includes(t))
    if (basicMissing.length > 0) {
      console.log('   1. scripts/001_create_tables.sql (creates basic tables)')
    }
    
    const additionalMissing = missingTables.filter(t => !['products', 'profiles', 'orders', 'order_items'].includes(t))
    if (additionalMissing.length > 0) {
      console.log('   2. scripts/006_create_additional_tables.sql (creates additional tables)')
    }
  }

  // Display detailed structure for each table
  console.log('\n\n📋 Detailed Table Structures:\n')
  console.log('═'.repeat(100))

  for (const table of allTables) {
    if (tableStructures[table]) {
      const structure = tableStructures[table]
      
      if (structure.error) {
        console.log(`\n❌ ${table.toUpperCase()}`)
        console.log(`   Error: ${structure.error}`)
        continue
      }

      if (structure.columns && structure.columns.length > 0) {
        const tableInfo = existingTables.find(t => t.table === table)
        const rowCount = tableInfo ? tableInfo.count : 0
        
        console.log(`\n📊 ${table.toUpperCase()} ${rowCount > 0 ? `(${rowCount} rows)` : '(empty)'}`)
        console.log('─'.repeat(100))
        
        structure.columns.forEach((col, index) => {
          const colType = structure.columnTypes ? structure.columnTypes[col] : 'unknown'
          const sampleValue = structure.sampleData ? structure.sampleData[col] : null
          
          let typeDisplay = colType
          if (sampleValue !== null && sampleValue !== undefined) {
            if (Array.isArray(sampleValue)) {
              typeDisplay = `array[${sampleValue.length > 0 ? typeof sampleValue[0] : 'any'}]`
            } else if (typeof sampleValue === 'object' && sampleValue !== null) {
              typeDisplay = 'json/jsonb'
            } else if (typeof sampleValue === 'string') {
              // Detect UUID format
              if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sampleValue)) {
                typeDisplay = 'uuid'
              } else if (sampleValue.length > 50) {
                typeDisplay = `string(${sampleValue.length} chars)`
              } else {
                typeDisplay = 'string'
              }
            } else if (typeof sampleValue === 'number') {
              // Check if it's integer or decimal
              typeDisplay = Number.isInteger(sampleValue) ? 'integer' : 'decimal'
            } else if (typeof sampleValue === 'boolean') {
              typeDisplay = 'boolean'
            }
          } else {
            // Null value - try to infer from column name
            if (col.includes('_at') || col.includes('date') || col.includes('time')) {
              typeDisplay = 'timestamp'
            } else if (col.includes('_id') || col === 'id') {
              typeDisplay = 'uuid (nullable)'
            } else if (col.includes('is_') || col.includes('has_')) {
              typeDisplay = 'boolean (nullable)'
            } else {
              typeDisplay = 'nullable'
            }
          }
          
          const nullable = sampleValue === null ? '(nullable)' : ''
          const defaultVal = sampleValue !== null && sampleValue !== undefined 
            ? ` → ${String(sampleValue).substring(0, 40)}${String(sampleValue).length > 40 ? '...' : ''}`
            : ''
          
          console.log(`   ${(index + 1).toString().padStart(2)}. ${col.padEnd(30)} ${typeDisplay.padEnd(20)} ${nullable}${defaultVal}`)
        })
      } else if (structure.error) {
        // Error already handled above
      } else {
        const tableInfo = existingTables.find(t => t.table === table)
        const rowCount = tableInfo ? tableInfo.count : 0
        console.log(`\n⚠️  ${table.toUpperCase()} ${rowCount > 0 ? `(${rowCount} rows)` : '(empty)'}`)
        console.log(`   Could not determine structure (table is empty or has RLS restrictions)`)
        console.log(`   Try querying this table directly in Supabase SQL Editor to see its structure`)
      }
    } else if (!missingTables.includes(table)) {
      console.log(`\n⚠️  ${table.toUpperCase()}`)
      console.log(`   Structure information not available`)
    }
  }

  console.log('\n' + '═'.repeat(100))
  
  // Summary of structures found
  const structuresFound = Object.keys(tableStructures).length
  console.log(`\n📈 Structure Analysis Summary:`)
  console.log(`   ✅ Tables with structure info: ${structuresFound}/${existingTables.length}`)
  console.log(`   ❌ Tables without structure info: ${existingTables.length - structuresFound}`)
  
  // Show sample data from categories if available
  if (tableStructures['categories'] && tableStructures['categories'].sampleData) {
    console.log('\n🔍 Sample data from categories table:')
    try {
      const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .limit(3)

      if (!error && categories && categories.length > 0) {
        console.log(`   Found ${categories.length} sample categories:`)
        categories.forEach((cat, index) => {
          console.log(`   ${index + 1}. ${cat.name || cat.id} (slug: ${cat.slug || 'N/A'})`)
        })
      }
    } catch (err) {
      // Ignore errors
    }
  }

  console.log('\n✨ Structure check completed!')
}

// Run the check
checkTableStructure()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })

