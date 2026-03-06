import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getBaseUrl } from '@/lib/utils/getBaseUrl';

/**
 * OAuth callback handler — exchanges authorization code for a session.
 * Used primarily by Google OAuth. Email confirmations go through /auth/confirm.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  // Use the request origin if valid, otherwise fall back to env-based base URL
  const baseUrl = origin.includes('localhost') && process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '')
    : origin || getBaseUrl();

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${baseUrl}${next}`);
    }

    console.error('[MathLab Auth Callback] exchangeCodeForSession error:', error.message);
  }

  return NextResponse.redirect(`${baseUrl}/auth?error=auth_callback_failed`);
}
