import { createClient } from '@/lib/supabase/client';

/* ═══════════════════════════════════════════════════
   Solve History — Supabase CRUD helpers (client-side)
   ═══════════════════════════════════════════════════ */

export interface HistoryEntry {
  id: string;
  user_id: string;
  title: string;
  problem: string;
  answer: string | null;
  summary: string | null;
  steps: { description: string; math: string; explanation: string; concept?: string; conceptUrdu?: string }[];
  topic: string;
  has_file: boolean;
  file_name: string | null;
  created_at: string;
}

export type InsertHistory = Omit<HistoryEntry, 'id' | 'created_at'>;

const supabase = createClient();

/** Save a solved problem to history */
export async function saveToHistory(entry: InsertHistory) {
  const { error } = await supabase.from('solve_history').insert(entry);
  if (error) {
    console.error('Failed to save history:', error.message);
  }
  return { error: error?.message };
}

/** Fetch all history for the current user (newest first) */
export async function fetchHistory(): Promise<HistoryEntry[]> {
  const { data, error } = await supabase
    .from('solve_history')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch history:', error.message);
    return [];
  }
  return (data as HistoryEntry[]) || [];
}

/** Delete a single history entry */
export async function deleteHistoryEntry(id: string) {
  const { error } = await supabase.from('solve_history').delete().eq('id', id);
  if (error) {
    console.error('Failed to delete history entry:', error.message);
  }
  return { error: error?.message };
}

/** Delete all history for current user */
export async function clearHistory() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { error } = await supabase
    .from('solve_history')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    console.error('Failed to clear history:', error.message);
  }
  return { error: error?.message };
}
