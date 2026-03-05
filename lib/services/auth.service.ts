import { createClient } from '@/lib/supabase/client';

export class AuthService {
  private static get supabase() {
    return createClient();
  }

  static async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  }

  static async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }

  static async signOut() {
    const { error } = await this.supabase.auth.signOut();
    return { error };
  }

  static async getSession() {
    const { data, error } = await this.supabase.auth.getSession();
    return { data, error };
  }
}
