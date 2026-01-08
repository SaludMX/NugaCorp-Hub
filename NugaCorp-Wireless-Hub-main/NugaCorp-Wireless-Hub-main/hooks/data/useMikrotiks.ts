import { useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../useAuth';
import type { Database } from '../../lib/database.types';
import type { DataListHookState } from '../../types/db';

export type Mikrotik = Database['public']['Tables']['mikrotiks']['Row'];
export type MikrotikInsert = Database['public']['Tables']['mikrotiks']['Insert'];
export type MikrotikUpdate = Database['public']['Tables']['mikrotiks']['Update'];

interface UseMikrotiksState extends DataListHookState {
  data: Mikrotik[] | null;
}

export const useMikrotiks = (): UseMikrotiksState & {
  createMikrotik: (mikrotik: MikrotikInsert) => Promise<Mikrotik>;
  updateMikrotik: (id: string, updates: MikrotikUpdate) => Promise<void>;
  deleteMikrotik: (id: string) => Promise<void>;
} => {
  const [data, setData] = useState<Mikrotik[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const refetch = useCallback(async () => {
    if (!user) {
      setError(new Error('No authenticated user'));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: mikrotiks, error: err } = await supabase
        .from('mikrotiks')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) throw err;
      setData(mikrotiks);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch mikrotiks'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createMikrotik = async (mikrotik: MikrotikInsert): Promise<Mikrotik> => {
    try {
      const { data: newMikrotik, error: err } = await supabase
        .from('mikrotiks')
        .insert([mikrotik])
        .select()
        .single();

      if (err) throw err;
      await refetch();
      return newMikrotik;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create mikrotik');
    }
  };

  const updateMikrotik = async (id: string, updates: MikrotikUpdate): Promise<void> => {
    try {
      const { error: err } = await supabase
        .from('mikrotiks')
        .update(updates)
        .eq('id', id);

      if (err) throw err;
      await refetch();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update mikrotik');
    }
  };

  const deleteMikrotik = async (id: string): Promise<void> => {
    try {
      const { error: err } = await supabase
        .from('mikrotiks')
        .delete()
        .eq('id', id);

      if (err) throw err;
      await refetch();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete mikrotik');
    }
  };

  // Fetch on mount if user exists
  if (user && data === null) {
    refetch();
  }

  return { data, loading, error, refetch, createMikrotik, updateMikrotik, deleteMikrotik };
};
