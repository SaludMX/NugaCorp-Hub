/**
 * useTickets Hook
 * CRUD completo para tickets de soporte
 * RLS aplica filtros automáticamente:
 * - Clientes: solo ven sus propios tickets
 * - Staff WISP: ven tickets de su wisp_id
 * - SUPER_ADMIN: ve todos los tickets
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../useAuth';
import { supabase } from '../../lib/supabase';
import type { SupportTicket, SupportTicketInsert, SupportTicketUpdate, DataListHookState } from '../../types/db';

interface UseTicketsReturn extends DataListHookState<SupportTicket> {
  refetch: () => Promise<void>;
  createTicket: (ticket: SupportTicketInsert) => Promise<{ data: SupportTicket | null; error: Error | null }>;
  updateTicket: (id: string, updates: SupportTicketUpdate) => Promise<{ data: SupportTicket | null; error: Error | null }>;
  deleteTicket: (id: string) => Promise<{ error: Error | null }>;
}

export function useTickets(): UseTicketsReturn {
  const { user } = useAuth();
  const [data, setData] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTickets = useCallback(async () => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // RLS filtra automáticamente según el rol del usuario:
      // - CLIENT: solo sus tickets (client_id = auth.uid())
      // - WISP staff: tickets de su wisp_id
      // - SUPER_ADMIN: todos los tickets
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (ticketsError) {
        throw new Error(`Error al obtener tickets: ${ticketsError.message}`);
      }

      setData(ticketsData || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const createTicket = async (ticket: SupportTicketInsert) => {
    try {
      const { data: newTicket, error: insertError } = await supabase
        .from('support_tickets')
        .insert(ticket)
        .select()
        .single();

      if (insertError) {
        throw new Error(`Error al crear ticket: ${insertError.message}`);
      }

      // Refrescar lista después de crear
      await fetchTickets();

      return { data: newTicket, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Error desconocido'),
      };
    }
  };

  const updateTicket = async (id: string, updates: SupportTicketUpdate) => {
    try {
      const { data: updatedTicket, error: updateError } = await supabase
        .from('support_tickets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw new Error(`Error al actualizar ticket: ${updateError.message}`);
      }

      // Refrescar lista después de actualizar
      await fetchTickets();

      return { data: updatedTicket, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Error desconocido'),
      };
    }
  };

  const deleteTicket = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('support_tickets')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw new Error(`Error al eliminar ticket: ${deleteError.message}`);
      }

      // Refrescar lista después de eliminar
      await fetchTickets();

      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error ? err : new Error('Error desconocido'),
      };
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return {
    data,
    loading,
    error,
    refetch: fetchTickets,
    createTicket,
    updateTicket,
    deleteTicket,
  };
}
