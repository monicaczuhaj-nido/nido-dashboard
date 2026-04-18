import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
if (listError) throw listError

const user = users[0]
console.log('Found user:', user.email, '| current name:', user.user_metadata?.full_name)

const { error } = await supabase.auth.admin.updateUserById(user.id, {
  user_metadata: { ...user.user_metadata, full_name: 'Lic. Monica Czuhaj' }
})

if (error) throw error
console.log('Updated successfully to: Lic. Monica Czuhaj')
