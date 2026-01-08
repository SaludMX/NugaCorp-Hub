import { useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../useAuth';
import type { Database } from '../../lib/database.types';
import type { DataListHookState } from '../../types/db';

export type NetworkPlan = Database['public']['Tables']['network_plans']['Row'];
export type NetworkPlanInsert = Database['public']['Tables']['network_plans']['Insert'];
export type NetworkPlanUpdate = Database['public']['Tables']['network_plans']['Update'];

interface UseNetworkPlansState extends DataListHookState {
  data: NetworkPlan[] | null;
}

export const useNetworkPlans = (): UseNetworkPlansState & {
  createPlan: (plan: NetworkPlanInsert) => Promise<NetworkPlan>;
  updatePlan: (id: string, updates: NetworkPlanUpdate) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
} => {
  const [data, setData] = useState<NetworkPlan[] | null>(null);
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

      const { data: plans, error: err } = await supabase
        .from('network_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) throw err;
      setData(plans);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch network plans'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createPlan = async (plan: NetworkPlanInsert): Promise<NetworkPlan> => {
    try {
      const { data: newPlan, error: err } = await supabase
        .from('network_plans')
        .insert([plan])
        .select()
        .single();

      if (err) throw err;
      await refetch();
      return newPlan;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create plan');
    }
  };

  const updatePlan = async (id: string, updates: NetworkPlanUpdate): Promise<void> => {
    try {
      const { error: err } = await supabase
        .from('network_plans')
        .update(updates)
        .eq('id', id);

      if (err) throw err;
      await refetch();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update plan');
    }
  };

  const deletePlan = async (id: string): Promise<void> => {
    try {
      const { error: err } = await supabase
        .from('network_plans')
        .delete()
        .eq('id', id);

      if (err) throw err;
      await refetch();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete plan');
    }
  };

  // Fetch on mount if user exists
  if (user && data === null) {
    refetch();
  }

  return { data, loading, error, refetch, createPlan, updatePlan, deletePlan };
};
