import { createBrowserClient } from '@supabase/ssr'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ''
const configured = Boolean(url && key)

export function isSupabaseConfigured() {
  return configured
}

export function createClient() {
  if (!configured) return null
  return createBrowserClient(url, key)
}
