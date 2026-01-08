/**
 * Database Helper Types
 * Tipos auxiliares para hooks de datos y queries a Supabase
 */

import { Database } from '../lib/database.types';

// Tipos base de las tablas
export type User = Database['public']['Tables']['users']['Row'];
export type Client = Database['public']['Tables']['clients']['Row'];
export type Wisp = Database['public']['Tables']['wisps']['Row'];
export type NetworkPlan = Database['public']['Tables']['network_plans']['Row'];
export type Zone = Database['public']['Tables']['zones']['Row'];
export type Equipment = Database['public']['Tables']['equipment']['Row'];
export type Mikrotik = Database['public']['Tables']['mikrotiks']['Row'];
export type Invoice = Database['public']['Tables']['invoices']['Row'];
export type SupportTicket = Database['public']['Tables']['support_tickets']['Row'];
export type AuditLog = Database['public']['Tables']['audit_logs']['Row'];

// Tipos para inserts
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type ClientInsert = Database['public']['Tables']['clients']['Insert'];
export type WispInsert = Database['public']['Tables']['wisps']['Insert'];
export type NetworkPlanInsert = Database['public']['Tables']['network_plans']['Insert'];
export type ZoneInsert = Database['public']['Tables']['zones']['Insert'];
export type EquipmentInsert = Database['public']['Tables']['equipment']['Insert'];
export type MikrotikInsert = Database['public']['Tables']['mikrotiks']['Insert'];
export type InvoiceInsert = Database['public']['Tables']['invoices']['Insert'];
export type SupportTicketInsert = Database['public']['Tables']['support_tickets']['Insert'];
export type AuditLogInsert = Database['public']['Tables']['audit_logs']['Insert'];

// Tipos para updates
export type UserUpdate = Database['public']['Tables']['users']['Update'];
export type ClientUpdate = Database['public']['Tables']['clients']['Update'];
export type WispUpdate = Database['public']['Tables']['wisps']['Update'];
export type NetworkPlanUpdate = Database['public']['Tables']['network_plans']['Update'];
export type ZoneUpdate = Database['public']['Tables']['zones']['Update'];
export type EquipmentUpdate = Database['public']['Tables']['equipment']['Update'];
export type MikrotikUpdate = Database['public']['Tables']['mikrotiks']['Update'];
export type InvoiceUpdate = Database['public']['Tables']['invoices']['Update'];
export type SupportTicketUpdate = Database['public']['Tables']['support_tickets']['Update'];
export type AuditLogUpdate = Database['public']['Tables']['audit_logs']['Update'];

// Estado estándar de un hook de datos
export interface DataHookState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// Estado estándar de un hook de datos con lista
export interface DataListHookState<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
}
