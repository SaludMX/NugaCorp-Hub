import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../useAuth';

// Types
export interface MikrotikJob {
  id: string;
  wisp_id: string;
  client_id: string | null;
  action: 'CREATE' | 'UPDATE' | 'SUSPEND' | 'DELETE';
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'FAILED';
  payload: Record<string, unknown>;
  error_message: string | null;
  retry_count: number;
  max_retries: number;
  created_at: string;
  updated_at: string;
}

export interface UseMikrotikJobsResult {
  jobs: MikrotikJob[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getJobById: (id: string) => MikrotikJob | undefined;
  getJobsByStatus: (status: MikrotikJob['status']) => MikrotikJob[];
  enqueueJob: (
    wisp_id: string,
    action: MikrotikJob['action'],
    client_id?: string,
    payload?: Record<string, unknown>
  ) => Promise<{ success: boolean; job_id?: string; error?: string }>;
}

/**
 * Hook para consultar jobs de MikroTik (solo lectura + enqueue vía Edge Function)
 * 
 * IMPORTANTE: Este hook NO ejecuta jobs. Solo muestra estado y permite encolar.
 * Los jobs son procesados por el worker externo.
 * 
 * Respeta RLS:
 * - SUPER_ADMIN: ve todos los jobs
 * - WISP_OWNER/ADMIN/STAFF: ve solo jobs de su WISP
 * - Clients: no ven jobs (por seguridad)
 */
export const useMikrotikJobs = (): UseMikrotikJobsResult => {
  const [jobs, setJobs] = useState<MikrotikJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchJobs = useCallback(async () => {
    if (!user) {
      setError('Usuario no autenticado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // RLS automático filtra por wisp_id según rol
      const { data, error: fetchError } = await supabase
        .from('mikrotik_jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setJobs(data || []);
    } catch (err) {
      console.error('Error fetching mikrotik jobs:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar jobs');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const refetch = useCallback(async () => {
    await fetchJobs();
  }, [fetchJobs]);

  const getJobById = useCallback(
    (id: string): MikrotikJob | undefined => {
      return jobs.find((job) => job.id === id);
    },
    [jobs]
  );

  const getJobsByStatus = useCallback(
    (status: MikrotikJob['status']): MikrotikJob[] => {
      return jobs.filter((job) => job.status === status);
    },
    [jobs]
  );

  /**
   * Encola un nuevo job llamando a la Edge Function
   * La Edge Function valida permisos y llama a enqueue_mikrotik_job
   */
  const enqueueJob = useCallback(
    async (
      wisp_id: string,
      action: MikrotikJob['action'],
      client_id?: string,
      payload?: Record<string, unknown>
    ): Promise<{ success: boolean; job_id?: string; error?: string }> => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;

        if (!token) {
          return { success: false, error: 'No hay sesión activa' };
        }

        // Llamar a Edge Function
        const response = await fetch(
          `${supabase.supabaseUrl}/functions/v1/enqueue-mikrotik-job`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              wisp_id,
              client_id,
              action,
              payload: payload || {},
            }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          return { success: false, error: result.error || 'Error al encolar job' };
        }

        // Refrescar lista de jobs
        await refetch();

        return { success: true, job_id: result.job_id };
      } catch (err) {
        console.error('Error enqueuing job:', err);
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Error desconocido',
        };
      }
    },
    [refetch]
  );

  return {
    jobs,
    loading,
    error,
    refetch,
    getJobById,
    getJobsByStatus,
    enqueueJob,
  };
};
