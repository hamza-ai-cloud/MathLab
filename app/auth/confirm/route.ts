import { type EmailOtpType } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getBaseUrl } from '@/lib/utils/getBaseUrl';

/**
 * Email confirmation handler — processes links from Supabase emails.
 *
 * Supports TWO verification methods:
 *  1. token_hash + type  →  verifyOtp()  (email template uses {{ .TokenHash }})
 *  2. code               →  exchangeCodeForSession()  (PKCE flow)
 *
 * After verification:
 *  - type=recovery  →  /auth/reset-password  (let user set a new password)
 *  - anything else  →  /dashboard
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const code = searchParams.get('code');
  const next = searchParams.get('next');

  // Resolve base URL — prefer NEXT_PUBLIC_SITE_URL on localhost for consistent redirects
  const baseUrl =
    origin.includes('localhost') && process.env.NEXT_PUBLIC_SITE_URL
      ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '')
      : origin || getBaseUrl();

  const supabase = await createClient();
  let verified = false;

  // ── Method 1: Verify OTP with token_hash ──
  // Used when the Supabase email template contains:
  //   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) {
      verified = true;
      console.log('[MathLab Auth Confirm] OTP verified successfully, type:', type);
    } else {
      console.error('[MathLab Auth Confirm] verifyOtp error:', error.message);
    }
  }

  // ── Method 2: Exchange authorization code for session (PKCE flow) ──
  // Used when Supabase redirects with ?code=… after processing the email link
  if (!verified && code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      verified = true;
      console.log('[MathLab Auth Confirm] Code exchanged successfully');
    } else {
      console.error('[MathLab Auth Confirm] exchangeCodeForSession error:', error.message);
    }
  }

  if (verified) {
    // Password recovery → dedicated reset page
    if (type === 'recovery') {
      return NextResponse.redirect(`${baseUrl}/auth/reset-password`);
    }
    // Signup confirmation or anything else → dashboard
    return NextResponse.redirect(`${baseUrl}${next || '/dashboard'}`);
  }

  // Verification failed — link may be expired or already used
  const errorType =
    type === 'recovery' ? 'recovery_link_expired' : 'confirmation_link_expired';
  return NextResponse.redirect(`${baseUrl}/auth?error=${errorType}`);
}
