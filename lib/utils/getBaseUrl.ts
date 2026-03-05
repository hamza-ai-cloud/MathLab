/**
 * Returns the absolute base URL for the current environment.
 * Works on both server and client, local dev and Vercel production.
 *
 * Priority:
 *  1. NEXT_PUBLIC_SITE_URL  — set by you in Vercel env vars
 *  2. NEXT_PUBLIC_VERCEL_URL — auto-set by Vercel on every deploy
 *  3. localhost:3000 fallback for local dev
 */
export function getBaseUrl(): string {
  // Client-side: always use the current browser origin
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // Server-side: check env vars
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '');
  }

  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  return 'http://localhost:3000';
}
