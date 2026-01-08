/**
 * useClients Hook
 * CRUD completo para clientes
 * RLS aplica filtros automáticamente según wisp_id del usuario
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../useAuth';
import { supabase } from '../../lib/supabase';
import type { Client, ClientInsert, ClientUpdate, DataListHookState } from '../../types/db';

interface UseClientsReturn extends DataListHookState<Client> {
  refetch: () => Promise<void>;
  createClient: (client: ClientInsert) => Promise<{ data: Client | null; error: Error | null }>;
  updateClient: (id: string, updates: ClientUpdate) => Promise<{ data: Client | null; error: Error | null }>;
  deleteClient: (id: string) => Promise<{ error: Error | null }>;
}

export function useClients(): UseClientsReturn {
  const { user } = useAuth();
  const [data, setData] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchClients = useCallback(async () => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // RLS filtra automáticamente por wisp_id
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (clientsError) {
        throw new Error(`Error al obtener clientes: ${clientsError.message}`);
      }

      setData(clientsData || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const createClient = async (client: ClientInsert) => {
    try {
      const { data: newClient, error: insertError } = await supabase
        .from('clients')
        .insert(client)
        .select()
        .single();

      if (insertError) {
        throw new Error(`Error al crear cliente: ${insertError.message}`);
      }

      // Refrescar lista después de crear
      await fetchClients();

      return { data: newClient, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Error desconocido'),
      };
    }
  };

  const updateClient = async (id: string, updates: ClientUpdate) => {
    try {
      const { data: updatedClient, error: updateError } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw new Error(`Error al actualizar cliente: ${updateError.message}`);
      }

      // Refrescar lista después de actualizar
      await fetchClients();

      return { data: updatedClient, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Error desconocido'),
      };
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw new Error(`Error al eliminar cliente: ${deleteError.message}`);
      }

      // Refrescar lista después de eliminar
      await fetchClients();

      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error ? err : new Error('Error desconocido'),
      };
    }
  };

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    data,
    loading,
    error,
    refetch: fetchClients,
    createClient,
    updateClient,
    deleteClient,
  };
}
