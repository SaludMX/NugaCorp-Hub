
import { Wisp, UserRole, NetworkPlan, Client, Invoice, Zone, Equipment, Staff, SupportTicket } from './types';

export const MOCK_WISPS: Wisp[] = [
  { 
    id: 'wisp_1', 
    name: 'NugaCorp Puebla', 
    subdomain: 'puebla', 
    primaryColor: '#4f46e5', 
    status: 'ACTIVE', 
    plan: 'ENTERPRISE', 
    maxClients: 5000, 
    currentClients: 1245, 
    mikrotiksCount: 8,
    revenue: 450000
  },
  { 
    id: 'wisp_2', 
    name: 'Redes del Norte', 
    subdomain: 'norte', 
    primaryColor: '#0ea5e9', 
    status: 'ACTIVE', 
    plan: 'PRO', 
    maxClients: 1000, 
    currentClients: 840, 
    mikrotiksCount: 3,
    revenue: 120000
  },
  { 
    id: 'wisp_3', 
    name: 'Wireless Rural MX', 
    subdomain: 'rural', 
    primaryColor: '#10b981', 
    status: 'TRIAL', 
    // Fix: Added missing plan property to satisfy Wisp interface
    plan: 'BASIC',
    maxClients: 100, 
    currentClients: 12, 
    mikrotiksCount: 1,
    revenue: 5000
  }
];

export const GLOBAL_STATS = {
  totalWisps: 42,
  totalClients: 15400,
  totalMikrotiks: 184,
  systemUptime: '99.99%',
  avgLoad: '14%'
};

// Re-exportar mocks existentes mapeados al wisp_1 por defecto
export const MOCK_PLANS: NetworkPlan[] = [
  { id: '1', wispId: 'wisp_1', name: 'Nuga Basic', download: 10, upload: 5, price: 299 },
  { id: '2', wispId: 'wisp_1', name: 'Nuga Pro', download: 50, upload: 20, price: 599 },
];

export const MOCK_CLIENTS: Client[] = [
  { id: 'usr_1', wispId: 'wisp_1', name: 'Juan Pérez', email: 'juan@perez.com', role: UserRole.CLIENT, points: 1250, address: 'Falsa 123', phone: '5512345678', planId: '2', status: 'ACTIVE', currentUsage: 450, limitUsage: 1000, balance: 0, mikrotikIp: '10.20.1.50', zoneId: 'z1', rank: 'GOLD', nextRankProgress: 75 },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'inv_1', wispId: 'wisp_1', clientId: 'usr_1', amount: 599, date: '2023-11-01', dueDate: '2023-11-10', status: 'PAID', items: [{description: 'Internet Nuga Pro', price: 599}], isStamped: true, uuid: '550e8400-e29b-41d4-a716-446655440000' },
];

export const ADMIN_STATS = {
  totalRevenue: 158400,
  activeClients: 342,
  suspendedClients: 12,
  networkHealth: 98.5,
  mikrotikCpu: 24,
  currentTraffic: 840,
};

// Fix: Applied SupportTicket[] type and added missing assignedTo property
export const MOCK_TICKETS: SupportTicket[] = [
  { 
    id: 'tk_1', 
    clientId: 'usr_1', 
    subject: 'Problema de conexión', 
    description: 'Sin internet', 
    priority: 'HIGH', 
    status: 'OPEN', 
    createdAt: '2023-11-25 10:00',
    assignedTo: 's1'
  }
];

export const MOCK_EQUIPMENT: Equipment[] = [
  { id: 'e1', wispId: 'wisp_1', model: 'MikroTik CCR1036', type: 'ROUTER', mac: 'AC:8D:12:34:56:78', status: 'INSTALLED', zoneId: 'z1', ip: '10.20.1.1' },
];

export const MOCK_ZONES: Zone[] = [
  { id: 'z1', wispId: 'wisp_1', name: 'Nodo Cerro Grande', location: { lat: 19.43, lng: -99.13 }, status: 'ONLINE', clientsCount: 145, ipRange: '10.20.1.0/24', devices: [MOCK_EQUIPMENT[0]] },
];

// Fix: Applied Staff[] type to resolve implicit typing errors in views
export const MOCK_STAFF: Staff[] = [
  { id: 's1', name: 'Carlos Ruiz', role: UserRole.WISP_TECH, tasksCompleted: 45, status: 'ON_FIELD', lastLocation: 'Nodo Cerro Grande' },
];

export const MOCK_CLIENT = MOCK_CLIENTS[0];
