import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseEnvConfigured } from '@/lib/supabase/env'

export function isSupabaseConfigured() {
  return isSupabaseEnvConfigured()
}

export function createClient() {
  if (!isSupabaseEnvConfigured()) return null
  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey())
}
