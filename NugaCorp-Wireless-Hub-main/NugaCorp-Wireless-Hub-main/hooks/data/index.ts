/**
 * Data Hooks Barrel Export
 * Exportación centralizada de todos los hooks de datos
 */

export { useProfile } from './useProfile';
export { useClients } from './useClients';
export { useWisps } from './useWisps';
export { useTickets } from './useTickets';
export { useNetworkPlans } from './useNetworkPlans';
export { useZones } from './useZones';
export { useEquipment } from './useEquipment';
export { useMikrotiks } from './useMikrotiks';
export { useMikrotikJobs } from './useMikrotikJobs';

// Re-exportar tipos para conveniencia
export type {
  User,
  Client,
  Wisp,
  SupportTicket,
  ClientInsert,
  ClientUpdate,
  WispInsert,
  WispUpdate,
  NetworkPlan,
  NetworkPlanInsert,
  NetworkPlanUpdate,
  Zone,
  ZoneInsert,
  ZoneUpdate,
  Equipment,
  EquipmentInsert,
  EquipmentUpdate,
  Mikrotik,
  MikrotikInsert,
  MikrotikUpdate,
  SupportTicketInsert,
  SupportTicketUpdate,
  DataHookState,
  DataListHookState,
} from '../../types/db';

// FASE 4A: MikroTik Jobs
export type { MikrotikJob, UseMikrotikJobsResult } from './useMikrotikJobs';

