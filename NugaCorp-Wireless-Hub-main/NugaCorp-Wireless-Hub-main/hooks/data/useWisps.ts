/**
 * useWisps Hook
 * Lista de WISPs con control de acceso por RLS
 * - SUPER_ADMIN: ve todos los WISPs
 * - Otros roles: solo ven su propio WISP
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../useAuth';
import { supabase } from '../../lib/supabase';
import type { Wisp, WispInsert, WispUpdate, DataListHookState } from '../../types/db';

interface UseWispsReturn extends DataListHookState<Wisp> {
  refetch: () => Promise<void>;
  createWisp: (wisp: WispInsert) => Promise<{ data: Wisp | null; error: Error | null }>;
  updateWisp: (id: string, updates: WispUpdate) => Promise<{ data: Wisp | null; error: Error | null }>;
  deleteWisp: (id: string) => Promise<{ error: Error | null }>;
}

export function useWisps(): UseWispsReturn {
  const { user } = useAuth();
  const [data, setData] = useState<Wisp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWisps = useCallback(async () => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // RLS determina qué WISPs puede ver el usuario:
      // - SUPER_ADMIN: todos
      // - Otros: solo su wisp_id
      const { data: wispsData, error: wispsError } = await supabase
        .from('wisps')
        .select('*')
        .order('created_at', { ascending: false });

      if (wispsError) {
        throw new Error(`Error al obtener WISPs: ${wispsError.message}`);
      }

      setData(wispsData || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const createWisp = async (wisp: WispInsert) => {
    try {
      const { data: newWisp, error: insertError } = await supabase
        .from('wisps')
        .insert(wisp)
        .select()
        .single();

      if (insertError) {
        throw new Error(`Error al crear WISP: ${insertError.message}`);
      }

      // Refrescar lista después de crear
      await fetchWisps();

      return { data: newWisp, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Error desconocido'),
      };
    }
  };

  const updateWisp = async (id: string, updates: WispUpdate) => {
    try {
      const { data: updatedWisp, error: updateError } = await supabase
        .from('wisps')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw new Error(`Error al actualizar WISP: ${updateError.message}`);
      }

      // Refrescar lista después de actualizar
      await fetchWisps();

      return { data: updatedWisp, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Error desconocido'),
      };
    }
  };

  const deleteWisp = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('wisps')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw new Error(`Error al eliminar WISP: ${deleteError.message}`);
      }

      // Refrescar lista después de eliminar
      await fetchWisps();

      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error ? err : new Error('Error desconocido'),
      };
    }
  };

  useEffect(() => {
    fetchWisps();
  }, [fetchWisps]);

  return {
    data,
    loading,
    error,
    refetch: fetchWisps,
    createWisp,
    updateWisp,
    deleteWisp,
  };
}
