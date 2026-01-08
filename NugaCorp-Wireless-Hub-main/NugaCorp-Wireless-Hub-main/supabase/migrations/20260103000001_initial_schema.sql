-- ================================================================
-- NugaCorp Hub - Initial Database Schema
-- Multi-Tenant WISP Management Platform
-- Migration: 20260103000001_initial_schema
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- ENUMS
-- ================================================================

CREATE TYPE user_role AS ENUM (
  'SUPER_ADMIN',
  'WISP_OWNER',
  'WISP_STAFF',
  'WISP_TECH',
  'CLIENT',
  'ADMIN',
  'SUPPORT',
  'TECH',
  'MARKETING'
);

CREATE TYPE wisp_status AS ENUM ('ACTIVE', 'SUSPENDED', 'TRIAL');
CREATE TYPE wisp_plan AS ENUM ('BASIC', 'PRO', 'ENTERPRISE');
CREATE TYPE client_status AS ENUM ('ACTIVE', 'SUSPENDED', 'EXPIRED', 'CANCELLED');
CREATE TYPE client_rank AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM');
CREATE TYPE equipment_type AS ENUM ('ROUTER', 'SWITCH', 'SECTORIAL', 'PTP', 'CPE');
CREATE TYPE equipment_status AS ENUM ('INSTALLED', 'STOCK', 'FAULTY');
CREATE TYPE zone_status AS ENUM ('ONLINE', 'WARNING', 'OFFLINE');
CREATE TYPE invoice_status AS ENUM ('PAID', 'PENDING', 'OVERDUE');
CREATE TYPE ticket_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE ticket_status AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- ================================================================
-- TABLE: wisps (TENANTS)
-- ================================================================
CREATE TABLE wisps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subdomain TEXT NOT NULL UNIQUE,
  logo TEXT,
  primary_color TEXT NOT NULL DEFAULT '#4f46e5',
  status wisp_status NOT NULL DEFAULT 'TRIAL',
  plan wisp_plan NOT NULL DEFAULT 'BASIC',
  max_clients INTEGER NOT NULL DEFAULT 100,
  current_clients INTEGER NOT NULL DEFAULT 0,
  mikrotiks_count INTEGER NOT NULL DEFAULT 0,
  revenue DECIMAL(12, 2) NOT NULL DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT subdomain_format CHECK (subdomain ~* '^[a-z0-9-]+$'),
  CONSTRAINT max_clients_positive CHECK (max_clients > 0)
);

-- Indexes for wisps
CREATE INDEX idx_wisps_subdomain ON wisps(subdomain);
CREATE INDEX idx_wisps_status ON wisps(status);

-- ================================================================
-- TABLE: users (Staff/Admins - NOT clients)
-- ================================================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  wisp_id UUID REFERENCES wisps(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL,
  avatar TEXT,
  points INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT wisp_required_except_super_admin CHECK (
    (role = 'SUPER_ADMIN' AND wisp_id IS NULL) OR
    (role != 'SUPER_ADMIN' AND wisp_id IS NOT NULL)
  )
);

-- Indexes for users
CREATE INDEX idx_users_wisp_id ON users(wisp_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ================================================================
-- TABLE: clients (End customers with authentication)
-- ================================================================
CREATE TABLE clients (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  wisp_id UUID NOT NULL REFERENCES wisps(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES network_plans(id) ON DELETE SET NULL,
  zone_id UUID REFERENCES zones(id) ON DELETE SET NULL,
  
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  avatar TEXT,
  
  status client_status NOT NULL DEFAULT 'ACTIVE',
  balance DECIMAL(10, 2) NOT NULL DEFAULT 0,
  
  -- Gamification
  points INTEGER NOT NULL DEFAULT 0,
  rank client_rank NOT NULL DEFAULT 'BRONZE',
  next_rank_progress INTEGER NOT NULL DEFAULT 0,
  
  -- Network info
  mikrotik_ip INET,
  current_usage BIGINT DEFAULT 0, -- MB
  limit_usage BIGINT DEFAULT 0,   -- MB
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT points_non_negative CHECK (points >= 0),
  CONSTRAINT balance_reasonable CHECK (balance >= -10000 AND balance <= 100000),
  CONSTRAINT rank_progress_range CHECK (next_rank_progress >= 0 AND next_rank_progress <= 100)
);

-- Indexes for clients
CREATE INDEX idx_clients_wisp_id ON clients(wisp_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_mikrotik_ip ON clients(mikrotik_ip);
CREATE INDEX idx_clients_plan_id ON clients(plan_id);
CREATE INDEX idx_clients_zone_id ON clients(zone_id);

-- ================================================================
-- TABLE: network_plans (Internet packages)
-- ================================================================
CREATE TABLE network_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wisp_id UUID NOT NULL REFERENCES wisps(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  download INTEGER NOT NULL, -- Mbps
  upload INTEGER NOT NULL,   -- Mbps
  price DECIMAL(10, 2) NOT NULL,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT download_positive CHECK (download > 0),
  CONSTRAINT upload_positive CHECK (upload > 0),
  CONSTRAINT price_positive CHECK (price > 0)
);

-- Indexes for network_plans
CREATE INDEX idx_network_plans_wisp_id ON network_plans(wisp_id);

-- ================================================================
-- TABLE: zones (Network towers/nodes)
-- ================================================================
CREATE TABLE zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wisp_id UUID NOT NULL REFERENCES wisps(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  ip_range CIDR NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  status zone_status NOT NULL DEFAULT 'ONLINE',
  clients_count INTEGER NOT NULL DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT latitude_range CHECK (latitude >= -90 AND latitude <= 90),
  CONSTRAINT longitude_range CHECK (longitude >= -180 AND longitude <= 180),
  CONSTRAINT clients_count_non_negative CHECK (clients_count >= 0)
);

-- Indexes for zones
CREATE INDEX idx_zones_wisp_id ON zones(wisp_id);
CREATE INDEX idx_zones_status ON zones(status);

-- ================================================================
-- TABLE: equipment (MikroTiks and hardware)
-- ================================================================
CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wisp_id UUID NOT NULL REFERENCES wisps(id) ON DELETE CASCADE,
  zone_id UUID REFERENCES zones(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  
  model TEXT NOT NULL,
  type equipment_type NOT NULL,
  mac_address MACADDR NOT NULL UNIQUE,
  ip_address INET,
  status equipment_status NOT NULL DEFAULT 'STOCK',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for equipment
CREATE INDEX idx_equipment_wisp_id ON equipment(wisp_id);
CREATE INDEX idx_equipment_zone_id ON equipment(zone_id);
CREATE INDEX idx_equipment_client_id ON equipment(client_id);
CREATE INDEX idx_equipment_mac_address ON equipment(mac_address);
CREATE INDEX idx_equipment_status ON equipment(status);

-- ================================================================
-- TABLE: mikrotiks (RouterOS devices)
-- ================================================================
CREATE TABLE mikrotiks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wisp_id UUID NOT NULL REFERENCES wisps(id) ON DELETE CASCADE,
  zone_id UUID REFERENCES zones(id) ON DELETE SET NULL,
  
  name TEXT NOT NULL,
  host TEXT NOT NULL, -- IP or hostname
  port INTEGER NOT NULL DEFAULT 8728,
  username TEXT NOT NULL,
  password_encrypted TEXT NOT NULL, -- Encrypted, never plain text
  
  model TEXT,
  routeros_version TEXT,
  cpu_usage INTEGER DEFAULT 0,
  ram_usage BIGINT DEFAULT 0,
  uptime BIGINT DEFAULT 0, -- seconds
  
  status zone_status NOT NULL DEFAULT 'OFFLINE',
  last_seen TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT port_range CHECK (port > 0 AND port <= 65535),
  CONSTRAINT cpu_usage_range CHECK (cpu_usage >= 0 AND cpu_usage <= 100)
);

-- Indexes for mikrotiks
CREATE INDEX idx_mikrotiks_wisp_id ON mikrotiks(wisp_id);
CREATE INDEX idx_mikrotiks_zone_id ON mikrotiks(zone_id);
CREATE INDEX idx_mikrotiks_status ON mikrotiks(status);

-- ================================================================
-- TABLE: invoices
-- ================================================================
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wisp_id UUID NOT NULL REFERENCES wisps(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  
  amount DECIMAL(10, 2) NOT NULL,
  due_date DATE NOT NULL,
  status invoice_status NOT NULL DEFAULT 'PENDING',
  
  -- CFDI 4.0 Mexico
  is_stamped BOOLEAN DEFAULT FALSE,
  cfdi_uuid UUID,
  
  -- Line items as JSONB
  items JSONB NOT NULL DEFAULT '[]',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT amount_positive CHECK (amount > 0)
);

-- Indexes for invoices
CREATE INDEX idx_invoices_wisp_id ON invoices(wisp_id);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_cfdi_uuid ON invoices(cfdi_uuid);

-- ================================================================
-- TABLE: support_tickets
-- ================================================================
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wisp_id UUID NOT NULL REFERENCES wisps(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  priority ticket_priority NOT NULL DEFAULT 'MEDIUM',
  status ticket_status NOT NULL DEFAULT 'OPEN',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Indexes for support_tickets
CREATE INDEX idx_support_tickets_wisp_id ON support_tickets(wisp_id);
CREATE INDEX idx_support_tickets_client_id ON support_tickets(client_id);
CREATE INDEX idx_support_tickets_assigned_to ON support_tickets(assigned_to);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_priority ON support_tickets(priority);

-- ================================================================
-- TABLE: audit_logs (Security and compliance)
-- ================================================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wisp_id UUID REFERENCES wisps(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for audit_logs
CREATE INDEX idx_audit_logs_wisp_id ON audit_logs(wisp_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ================================================================
-- FUNCTIONS: Auto-update timestamps
-- ================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER set_timestamp_wisps BEFORE UPDATE ON wisps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_timestamp_users BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_timestamp_clients BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_timestamp_network_plans BEFORE UPDATE ON network_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_timestamp_zones BEFORE UPDATE ON zones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_timestamp_equipment BEFORE UPDATE ON equipment FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_timestamp_mikrotiks BEFORE UPDATE ON mikrotiks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_timestamp_invoices BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_timestamp_support_tickets BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- FUNCTIONS: Helper for getting user's WISP ID
-- ================================================================
CREATE OR REPLACE FUNCTION auth.get_user_wisp_id()
RETURNS UUID AS $$
DECLARE
  user_wisp_id UUID;
  user_role TEXT;
BEGIN
  -- Get wisp_id from users table
  SELECT u.wisp_id, u.role::TEXT INTO user_wisp_id, user_role
  FROM users u
  WHERE u.id = auth.uid();
  
  -- If not found in users, try clients table
  IF user_wisp_id IS NULL THEN
    SELECT c.wisp_id INTO user_wisp_id
    FROM clients c
    WHERE c.id = auth.uid();
  END IF;
  
  RETURN user_wisp_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- FUNCTIONS: Check if user is SUPER_ADMIN
-- ================================================================
CREATE OR REPLACE FUNCTION auth.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'SUPER_ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- COMMENTS (Documentation)
-- ================================================================
COMMENT ON TABLE wisps IS 'Multi-tenant organizations (WISP companies)';
COMMENT ON TABLE users IS 'Staff/admins who manage WISPs (NOT end clients)';
COMMENT ON TABLE clients IS 'End customers who consume internet services';
COMMENT ON TABLE network_plans IS 'Internet service packages/plans';
COMMENT ON TABLE zones IS 'Physical network towers/nodes';
COMMENT ON TABLE equipment IS 'Hardware inventory (routers, switches, CPEs)';
COMMENT ON TABLE mikrotiks IS 'MikroTik RouterOS devices with credentials';
COMMENT ON TABLE invoices IS 'Billing and CFDI invoices';
COMMENT ON TABLE support_tickets IS 'Customer support ticket system';
COMMENT ON TABLE audit_logs IS 'Security audit trail for compliance';

COMMENT ON FUNCTION auth.get_user_wisp_id() IS 'Returns the wisp_id of the authenticated user (NULL for SUPER_ADMIN)';
COMMENT ON FUNCTION auth.is_super_admin() IS 'Returns TRUE if authenticated user is SUPER_ADMIN';
