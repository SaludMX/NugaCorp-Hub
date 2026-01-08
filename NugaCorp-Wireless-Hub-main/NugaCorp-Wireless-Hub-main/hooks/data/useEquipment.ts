import { useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../useAuth';
import type { Database } from '../../lib/database.types';
import type { DataListHookState } from '../../types/db';

export type Equipment = Database['public']['Tables']['equipment']['Row'];
export type EquipmentInsert = Database['public']['Tables']['equipment']['Insert'];
export type EquipmentUpdate = Database['public']['Tables']['equipment']['Update'];

interface UseEquipmentState extends DataListHookState {
  data: Equipment[] | null;
}

export const useEquipment = (): UseEquipmentState & {
  createEquipment: (equipment: EquipmentInsert) => Promise<Equipment>;
  updateEquipment: (id: string, updates: EquipmentUpdate) => Promise<void>;
  deleteEquipment: (id: string) => Promise<void>;
} => {
  const [data, setData] = useState<Equipment[] | null>(null);
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

      const { data: equipment, error: err } = await supabase
        .from('equipment')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) throw err;
      setData(equipment);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch equipment'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createEquipment = async (equipment: EquipmentInsert): Promise<Equipment> => {
    try {
      const { data: newEquipment, error: err } = await supabase
        .from('equipment')
        .insert([equipment])
        .select()
        .single();

      if (err) throw err;
      await refetch();
      return newEquipment;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create equipment');
    }
  };

  const updateEquipment = async (id: string, updates: EquipmentUpdate): Promise<void> => {
    try {
      const { error: err } = await supabase
        .from('equipment')
        .update(updates)
        .eq('id', id);

      if (err) throw err;
      await refetch();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update equipment');
    }
  };

  const deleteEquipment = async (id: string): Promise<void> => {
    try {
      const { error: err } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id);

      if (err) throw err;
      await refetch();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete equipment');
    }
  };

  // Fetch on mount if user exists
  if (user && data === null) {
    refetch();
  }

  return { data, loading, error, refetch, createEquipment, updateEquipment, deleteEquipment };
};
