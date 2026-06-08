import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { parseOAuthProvider } from '@/lib/supabase/oauth-providers'

function redirectToError(origin: string, reason: string) {
  const url = new URL(`${origin}/auth/auth-code-error`)
  url.searchParams.set('reason', reason)
  return NextResponse.redirect(url)
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const next = searchParams.get('next') ?? '/'
  const provider = parseOAuthProvider(searchParams.get('provider'))

  const supabase = await createClient()
  if (!supabase) return redirectToError(origin, 'missing_env')

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  })

  if (error || !data.url) {
    return redirectToError(origin, error?.message ?? 'oauth_start_failed')
  }

  return NextResponse.redirect(data.url)
}
