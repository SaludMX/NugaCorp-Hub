/**
 * Supabase Client Configuration
 * Centralized Supabase instance with TypeScript types
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Environment variables validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Missing VITE_SUPABASE_URL environment variable. Please add it to your .env file.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_ANON_KEY environment variable. Please add it to your .env file.'
  );
}

/**
 * Supabase client instance with full TypeScript support
 * Automatically handles:
 * - JWT token storage and refresh
 * - Row Level Security (RLS) enforcement
 * - Real-time subscriptions
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application': 'nugacorp-hub',
    },
  },
});

export type SupabaseClient = typeof supabase;

/**
 * NOTA: Funciones para obtener roles y wisp_id se implementan en FASE 2B
 * usando hooks de datos que leen de la base de datos con RLS
 */

export default supabase;
