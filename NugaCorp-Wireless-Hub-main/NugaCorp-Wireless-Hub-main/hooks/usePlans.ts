/**
 * usePlans Hook
 * Fetch and manage network plans from Supabase
 */

import { useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import type { Database } from '../lib/database.types';

type NetworkPlan = Database['public']['Tables']['network_plans']['Row'];

export function usePlans(wispId?: string | null) {
  const [plans, setPlans] = useState<NetworkPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchPlans();
  }, [wispId]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('network_plans')
        .select('*')
        .order('price', { ascending: true });

      // Filter by wispId if provided (for SUPER_ADMIN viewing specific WISP)
      if (wispId) {
        query = query.eq('wisp_id', wispId);
      }
      // Otherwise, RLS will automatically filter by user's wisp_id

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      
      setPlans(data || []);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPlan = async (planData: Database['public']['Tables']['network_plans']['Insert']) => {
    try {
      const { data, error: insertError } = await supabase
        .from('network_plans')
        .insert([planData])
        .select()
        .single();

      if (insertError) throw insertError;

      setPlans(prev => [...prev, data]);
      return { data, error: null };
    } catch (err) {
      console.error('Error creating plan:', err);
      return { data: null, error: err as Error };
    }
  };

  const updatePlan = async (id: string, updates: Database['public']['Tables']['network_plans']['Update']) => {
    try {
      const { data, error: updateError } = await supabase
        .from('network_plans')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      setPlans(prev => prev.map(p => p.id === id ? data : p));
      return { data, error: null };
    } catch (err) {
      console.error('Error updating plan:', err);
      return { data: null, error: err as Error };
    }
  };

  const deletePlan = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('network_plans')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setPlans(prev => prev.filter(p => p.id !== id));
      return { error: null };
    } catch (err) {
      console.error('Error deleting plan:', err);
      return { error: err as Error };
    }
  };

  return {
    plans,
    loading,
    error,
    refetch: fetchPlans,
    createPlan,
    updatePlan,
    deletePlan,
  };
}
