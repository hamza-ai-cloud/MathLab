import { createClient } from '@/lib/supabase/server';

export class SubscriptionService {
  static async getUserSubscription(userId: string) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Subscription fetch error:', error);
      throw error;
    }
  }

  static async createSubscription(userId: string, plan: 'free' | 'pro' | 'premium') {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('subscriptions')
        .insert([
          {
            user_id: userId,
            plan,
            created_at: new Date(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Subscription creation error:', error);
      throw error;
    }
  }

  static async canSolveProblem(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId);
      if (subscription.plan === 'pro' || subscription.plan === 'premium') {
        return true;
      }

      // Check remaining solves for free plan
      const supabase = await createClient();
      const { count } = await supabase
        .from('problems')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      return (count || 0) < 10; // 10 free problems per day
    } catch (error) {
      console.error('Can solve problem check error:', error);
      return false;
    }
  }
}
