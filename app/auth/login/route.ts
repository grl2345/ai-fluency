import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { parseOAuthProvider } from '@/lib/supabase/oauth-providers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const next = searchParams.get('next') ?? '/'
  const provider = parseOAuthProvider(searchParams.get('provider'))

  const supabase = await createClient()
  if (!supabase) return NextResponse.redirect(`${origin}/auth/auth-code-error`)
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  })

  if (error || !data.url) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
  }

  return NextResponse.redirect(data.url)
}
