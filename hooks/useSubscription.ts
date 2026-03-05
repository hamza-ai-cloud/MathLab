import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import type { Subscription } from '@/types';

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return;

      try {
        const response = await fetch('/api/subscription/check');
        const data = await response.json();
        setSubscription(data.subscription);
      } catch (error) {
        console.error('Subscription fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  return { subscription, loading };
}
