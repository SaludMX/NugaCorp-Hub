import { useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../useAuth';
import type { Database } from '../../lib/database.types';
import type { DataListHookState } from '../../types/db';

export type Zone = Database['public']['Tables']['zones']['Row'];
export type ZoneInsert = Database['public']['Tables']['zones']['Insert'];
export type ZoneUpdate = Database['public']['Tables']['zones']['Update'];

interface UseZonesState extends DataListHookState {
  data: Zone[] | null;
}

export const useZones = (): UseZonesState & {
  createZone: (zone: ZoneInsert) => Promise<Zone>;
  updateZone: (id: string, updates: ZoneUpdate) => Promise<void>;
  deleteZone: (id: string) => Promise<void>;
} => {
  const [data, setData] = useState<Zone[] | null>(null);
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

      const { data: zones, error: err } = await supabase
        .from('zones')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) throw err;
      setData(zones);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch zones'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createZone = async (zone: ZoneInsert): Promise<Zone> => {
    try {
      const { data: newZone, error: err } = await supabase
        .from('zones')
        .insert([zone])
        .select()
        .single();

      if (err) throw err;
      await refetch();
      return newZone;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create zone');
    }
  };

  const updateZone = async (id: string, updates: ZoneUpdate): Promise<void> => {
    try {
      const { error: err } = await supabase
        .from('zones')
        .update(updates)
        .eq('id', id);

      if (err) throw err;
      await refetch();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update zone');
    }
  };

  const deleteZone = async (id: string): Promise<void> => {
    try {
      const { error: err } = await supabase
        .from('zones')
        .delete()
        .eq('id', id);

      if (err) throw err;
      await refetch();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete zone');
    }
  };

  // Fetch on mount if user exists
  if (user && data === null) {
    refetch();
  }

  return { data, loading, error, refetch, createZone, updateZone, deleteZone };
};
