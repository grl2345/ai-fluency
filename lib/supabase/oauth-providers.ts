import type { Provider } from '@supabase/supabase-js'

const OAUTH_PROVIDERS = ['github', 'google'] as const satisfies readonly Provider[]

export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number]

export function parseOAuthProvider(value: string | null): OAuthProvider {
  if (value && OAUTH_PROVIDERS.includes(value as OAuthProvider)) {
    return value as OAuthProvider
  }
  return 'google'
}
