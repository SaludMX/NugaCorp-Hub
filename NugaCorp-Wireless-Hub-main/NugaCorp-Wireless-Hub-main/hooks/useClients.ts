/**
 * useClients Hook
 * Fetch and manage clients from Supabase with RLS
 */

import { useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Client = Database['public']['Tables']['clients']['Row'];

export function useClients(wispId?: string | null) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchClients();
  }, [wispId]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      // If wispId is provided, filter by it (for SUPER_ADMIN)
      if (wispId) {
        query = query.eq('wisp_id', wispId);
      }
      // Otherwise, RLS will automatically filter by user's wisp_id

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      
      setClients(data || []);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (clientData: Database['public']['Tables']['clients']['Insert']) => {
    try {
      const { data, error: insertError } = await supabase
        .from('clients')
        .insert([clientData])
        .select()
        .single();

      if (insertError) throw insertError;

      setClients(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      console.error('Error creating client:', err);
      return { data: null, error: err as Error };
    }
  };

  const updateClient = async (id: string, updates: Database['public']['Tables']['clients']['Update']) => {
    try {
      const { data, error: updateError } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      setClients(prev => prev.map(c => c.id === id ? data : c));
      return { data, error: null };
    } catch (err) {
      console.error('Error updating client:', err);
      return { data: null, error: err as Error };
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setClients(prev => prev.filter(c => c.id !== id));
      return { error: null };
    } catch (err) {
      console.error('Error deleting client:', err);
      return { error: err as Error };
    }
  };

  return {
    clients,
    loading,
    error,
    refetch: fetchClients,
    createClient,
    updateClient,
    deleteClient,
  };
}
