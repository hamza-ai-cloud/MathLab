import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Successful login → redirect to dashboard (or wherever `next` points)
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If something went wrong, redirect to auth page with an error hint
  return NextResponse.redirect(`${origin}/auth?error=auth_callback_failed`);
}
