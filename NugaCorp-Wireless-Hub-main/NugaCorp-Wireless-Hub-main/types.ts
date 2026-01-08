
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN', // Dueño de NugaCorp Hub
  WISP_OWNER = 'WISP_OWNER',   // Dueño de una empresa WISP
  WISP_STAFF = 'WISP_STAFF',   // Soporte/Admin del WISP
  WISP_TECH = 'WISP_TECH',     // Técnico de campo del WISP
  CLIENT = 'CLIENT',
  // Mantener roles anteriores para compatibilidad de vistas existentes
  ADMIN = 'ADMIN',
  SUPPORT = 'SUPPORT',
  TECH = 'TECH',
  MARKETING = 'MARKETING'
}

export interface Wisp {
  id: string;
  name: string;
  subdomain: string;
  logo?: string;
  primaryColor: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL';
  plan: 'BASIC' | 'PRO' | 'ENTERPRISE';
  maxClients: number;
  currentClients: number;
  mikrotiksCount: number;
  revenue: number;
}

export interface User {
  id: string;
  wispId?: string; // ID de la empresa a la que pertenece
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  points?: number;
}

// Todas las entidades ahora deben llevar wispId
export interface Client extends User {
  wispId: string;
  address: string;
  phone: string;
  planId: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'CANCELLED';
  currentUsage: number;
  limitUsage: number;
  balance: number;
  mikrotikIp?: string;
  zoneId: string;
  rank: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  nextRankProgress: number;
}

export interface Zone {
  id: string;
  wispId: string;
  name: string;
  location: { lat: number; lng: number };
  status: 'ONLINE' | 'WARNING' | 'OFFLINE';
  clientsCount: number;
  ipRange: string;
  devices: Equipment[];
}

export interface Equipment {
  id: string;
  wispId: string;
  model: string;
  type: 'ROUTER' | 'SWITCH' | 'SECTORIAL' | 'PTP' | 'CPE';
  mac: string;
  status: 'INSTALLED' | 'STOCK' | 'FAULTY';
  zoneId?: string;
  clientId?: string;
  ip?: string;
}

export interface NetworkPlan {
  id: string;
  wispId: string;
  name: string;
  download: number;
  upload: number;
  price: number;
}

export interface Invoice {
  id: string;
  wispId: string;
  clientId: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  items: { description: string; price: number }[];
  isStamped?: boolean;
  uuid?: string;
}

// Fix: Add missing Staff interface
export interface Staff {
  id: string;
  name: string;
  role: UserRole;
  tasksCompleted: number;
  status: string;
  lastLocation?: string;
}

// Fix: Add missing SupportTicket interface
export interface SupportTicket {
  id: string;
  clientId: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
  assignedTo?: string;
}
