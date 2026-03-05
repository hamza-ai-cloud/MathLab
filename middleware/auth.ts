import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function verifyAuth(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return null;
    }

    return {
      id: data.user.id,
      email: data.user.email,
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}
