import { useState, useCallback } from 'react';
import type { MathProblem, Solution } from '@/types';

export function useMathSolver() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [solution, setSolution] = useState<Solution | null>(null);

  const solve = useCallback(async (problem: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ problem }),
      });

      if (!response.ok) {
        throw new Error('Failed to solve problem');
      }

      const data = await response.json();
      setSolution(data.data);
      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setSolution(null);
    setError(null);
  }, []);

  return { solve, loading, error, solution, reset };
}
