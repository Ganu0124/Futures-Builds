import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type ProjectRequest = {
  id: string
  full_name: string
  email: string
  phone_number: string
  project_title: string
  project_description: string
  status: string
  created_at: string
}

export const PROJECT_STATUSES = [
  'New Request',
  'Under Review',
  'Contacted',
  'In Progress',
  'Completed',
  'Rejected',
] as const

export type ProjectStatus = typeof PROJECT_STATUSES[number]
