/**
 * useWisps Hook
 * Fetch and manage WISPs (tenants) from Supabase
 * Only accessible by SUPER_ADMIN
 */

import { useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Wisp = Database['public']['Tables']['wisps']['Row'];

export function useWisps() {
  const [wisps, setWisps] = useState<Wisp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchWisps();
  }, []);

  const fetchWisps = async () => {
    try {
      setLoading(true);
      
      const { data, error: fetchError } = await supabase
        .from('wisps')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setWisps(data || []);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching wisps:', err);
    } finally {
      setLoading(false);
    }
  };

  const createWisp = async (wispData: Database['public']['Tables']['wisps']['Insert']) => {
    try {
      const { data, error: insertError } = await supabase
        .from('wisps')
        .insert([wispData])
        .select()
        .single();

      if (insertError) throw insertError;

      setWisps(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      console.error('Error creating wisp:', err);
      return { data: null, error: err as Error };
    }
  };

  const updateWisp = async (id: string, updates: Database['public']['Tables']['wisps']['Update']) => {
    try {
      const { data, error: updateError } = await supabase
        .from('wisps')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      setWisps(prev => prev.map(w => w.id === id ? data : w));
      return { data, error: null };
    } catch (err) {
      console.error('Error updating wisp:', err);
      return { data: null, error: err as Error };
    }
  };

  return {
    wisps,
    loading,
    error,
    refetch: fetchWisps,
    createWisp,
    updateWisp,
  };
}
