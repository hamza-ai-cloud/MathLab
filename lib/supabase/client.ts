import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Runtime validation — catch misconfigured env vars IMMEDIATELY
  if (!url || !key) {
    console.error(
      '[MathLab FATAL] Supabase env vars are MISSING!\n' +
      `  NEXT_PUBLIC_SUPABASE_URL = ${url ? '✅ set' : '❌ UNDEFINED'}\n` +
      `  NEXT_PUBLIC_SUPABASE_ANON_KEY = ${key ? '✅ set' : '❌ UNDEFINED'}\n` +
      'The auth system WILL hang. Check .env.local and Vercel env vars.'
    );
  } else {
    console.log(
      '[MathLab Supabase] Client created:\n' +
      `  URL = ${url.substring(0, 30)}...\n` +
      `  KEY = ${key.substring(0, 15)}...`
    );
  }

  return createBrowserClient(url!, key!);
}
