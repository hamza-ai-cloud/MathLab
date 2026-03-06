import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getBaseUrl } from '@/lib/utils/getBaseUrl';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  const type = searchParams.get('type'); // 'recovery', 'signup', 'email_change', etc.

  // Use the request origin if valid, otherwise fall back to env-based base URL
  const baseUrl = origin.includes('localhost') && process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '')
    : origin || getBaseUrl();

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // For password recovery, redirect to settings so the user can set a new password
      if (type === 'recovery') {
        return NextResponse.redirect(`${baseUrl}/dashboard/settings?password_reset=true`);
      }
      return NextResponse.redirect(`${baseUrl}${next}`);
    }

    console.error('[MathLab Auth Callback] exchangeCodeForSession error:', error.message);
  }

  return NextResponse.redirect(`${baseUrl}/auth?error=auth_callback_failed`);
}
