/**
 * useProfile Hook
 * Obtiene el perfil completo del usuario autenticado
 * Busca en la tabla 'users' o 'clients' según corresponda
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../useAuth';
import { supabase } from '../../lib/supabase';
import type { User, Client, DataHookState } from '../../types/db';

interface ProfileData {
  type: 'user' | 'client';
  profile: User | Client;
}

interface UseProfileReturn extends DataHookState<ProfileData> {
  refetch: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const { user } = useAuth();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = async () => {
    if (!user) {
      setData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Intentar obtener de la tabla users primero (staff/admins)
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userData && !userError) {
        setData({ type: 'user', profile: userData });
        setLoading(false);
        return;
      }

      // Si no está en users, buscar en clients
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', user.id)
        .single();

      if (clientError) {
        throw new Error(`Error al obtener perfil: ${clientError.message}`);
      }

      if (clientData) {
        setData({ type: 'client', profile: clientData });
      } else {
        throw new Error('Perfil no encontrado en la base de datos');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  return {
    data,
    loading,
    error,
    refetch: fetchProfile,
  };
}
