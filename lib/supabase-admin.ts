import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mqfpiifujobarbhzivvc.supabase.co'
const rawServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Ysymq47U45zMpDU5NCkrUw_6PtWComF'

// Use service role key if available; otherwise fallback to anon key for server requests
const apiKey = (rawServiceKey && !rawServiceKey.includes('REPLACE_WITH')) ? rawServiceKey : anonKey

export const supabaseAdmin = createClient(supabaseUrl, apiKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
