import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mqfpiifujobarbhzivvc.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Ysymq47U45zMpDU5NCkrUw_6PtWComF'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type ProjectRequest = {
  id: string
  email: string
  phone_number: string
  project_title: string
  project_description: string
  created_at: string
}
