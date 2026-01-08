-- ================================================================
-- NugaCorp Hub - Row Level Security (RLS) Policies
-- Migration: 20260103000002_rls_policies
-- ================================================================

-- ================================================================
-- ENABLE RLS ON ALL TABLES
-- ================================================================
ALTER TABLE wisps ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE mikrotiks ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- RLS POLICIES: wisps
-- ================================================================

-- SUPER_ADMIN can see all WISPs
CREATE POLICY "super_admin_select_wisps"
  ON wisps FOR SELECT
  USING (auth.is_super_admin());

-- SUPER_ADMIN can create WISPs
CREATE POLICY "super_admin_insert_wisps"
  ON wisps FOR INSERT
  WITH CHECK (auth.is_super_admin());

-- SUPER_ADMIN can update any WISP
CREATE POLICY "super_admin_update_wisps"
  ON wisps FOR UPDATE
  USING (auth.is_super_admin());

-- Users can only see their own WISP
CREATE POLICY "users_select_own_wisp"
  ON wisps FOR SELECT
  USING (
    id = auth.get_user_wisp_id()
  );

-- Clients can only see their own WISP
CREATE POLICY "clients_select_own_wisp"
  ON wisps FOR SELECT
  USING (
    id IN (SELECT wisp_id FROM clients WHERE id = auth.uid())
  );

-- ================================================================
-- RLS POLICIES: users (Staff)
-- ================================================================

-- SUPER_ADMIN can see all users
CREATE POLICY "super_admin_select_users"
  ON users FOR SELECT
  USING (auth.is_super_admin());

-- WISP staff can see users from their WISP
CREATE POLICY "wisp_staff_select_users"
  ON users FOR SELECT
  USING (
    wisp_id = auth.get_user_wisp_id()
  );

-- SUPER_ADMIN can create users
CREATE POLICY "super_admin_insert_users"
  ON users FOR INSERT
  WITH CHECK (auth.is_super_admin());

-- WISP_OWNER can create staff for their WISP
CREATE POLICY "wisp_owner_insert_users"
  ON users FOR INSERT
  WITH CHECK (
    wisp_id = auth.get_user_wisp_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('WISP_OWNER', 'ADMIN')
    )
  );

-- Users can update their own profile
CREATE POLICY "users_update_own_profile"
  ON users FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ================================================================
-- RLS POLICIES: clients
-- ================================================================

-- SUPER_ADMIN can see all clients
CREATE POLICY "super_admin_select_clients"
  ON clients FOR SELECT
  USING (auth.is_super_admin());

-- WISP staff can see clients from their WISP
CREATE POLICY "wisp_staff_select_clients"
  ON clients FOR SELECT
  USING (
    wisp_id = auth.get_user_wisp_id()
  );

-- Clients can see their own profile
CREATE POLICY "clients_select_own_profile"
  ON clients FOR SELECT
  USING (id = auth.uid());

-- WISP staff can create clients for their WISP
CREATE POLICY "wisp_staff_insert_clients"
  ON clients FOR INSERT
  WITH CHECK (
    wisp_id = auth.get_user_wisp_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('WISP_OWNER', 'ADMIN', 'WISP_STAFF', 'SUPPORT')
    )
  );

-- WISP staff can update clients from their WISP
CREATE POLICY "wisp_staff_update_clients"
  ON clients FOR UPDATE
  USING (
    wisp_id = auth.get_user_wisp_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('WISP_OWNER', 'ADMIN', 'WISP_STAFF', 'SUPPORT')
    )
  );

-- Clients can update their own profile (limited fields)
CREATE POLICY "clients_update_own_profile"
  ON clients FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ================================================================
-- RLS POLICIES: network_plans
-- ================================================================

-- Everyone can view plans (needed for signup/portal)
CREATE POLICY "anyone_select_plans"
  ON network_plans FOR SELECT
  USING (true);

-- WISP staff can manage plans for their WISP
CREATE POLICY "wisp_staff_insert_plans"
  ON network_plans FOR INSERT
  WITH CHECK (
    wisp_id = auth.get_user_wisp_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('WISP_OWNER', 'ADMIN')
    )
  );

CREATE POLICY "wisp_staff_update_plans"
  ON network_plans FOR UPDATE
  USING (
    wisp_id = auth.get_user_wisp_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('WISP_OWNER', 'ADMIN')
    )
  );

CREATE POLICY "wisp_staff_delete_plans"
  ON network_plans FOR DELETE
  USING (
    wisp_id = auth.get_user_wisp_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('WISP_OWNER', 'ADMIN')
    )
  );

-- ================================================================
-- RLS POLICIES: zones
-- ================================================================

-- SUPER_ADMIN can see all zones
CREATE POLICY "super_admin_select_zones"
  ON zones FOR SELECT
  USING (auth.is_super_admin());

-- WISP users can see zones from their WISP
CREATE POLICY "wisp_users_select_zones"
  ON zones FOR SELECT
  USING (
    wisp_id = auth.get_user_wisp_id()
  );

-- WISP technical staff can manage zones
CREATE POLICY "wisp_tech_insert_zones"
  ON zones FOR INSERT
  WITH CHECK (
    wisp_id = auth.get_user_wisp_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('WISP_OWNER', 'ADMIN', 'WISP_TECH', 'TECH')
    )
  );

CREATE POLICY "wisp_tech_update_zones"
  ON zones FOR UPDATE
  USING (
    wisp_id = auth.get_user_wisp_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('WISP_OWNER', 'ADMIN', 'WISP_TECH', 'TECH')
    )
  );

-- ================================================================
-- RLS POLICIES: equipment
-- ================================================================

-- SUPER_ADMIN can see all equipment
CREATE POLICY "super_admin_select_equipment"
  ON equipment FOR SELECT
  USING (auth.is_super_admin());

-- WISP users can see equipment from their WISP
CREATE POLICY "wisp_users_select_equipment"
  ON equipment FOR SELECT
  USING (
    wisp_id = auth.get_user_wisp_id()
  );

-- WISP technical staff can manage equipment
CREATE POLICY "wisp_tech_manage_equipment"
  ON equipment FOR ALL
  USING (
    wisp_id = auth.get_user_wisp_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('WISP_OWNER', 'ADMIN', 'WISP_TECH', 'TECH')
    )
  );

-- ================================================================
-- RLS POLICIES: mikrotiks
-- ================================================================

-- SUPER_ADMIN can see all MikroTiks
CREATE POLICY "super_admin_select_mikrotiks"
  ON mikrotiks FOR SELECT
  USING (auth.is_super_admin());

-- WISP technical staff can see MikroTiks from their WISP
CREATE POLICY "wisp_tech_select_mikrotiks"
  ON mikrotiks FOR SELECT
  USING (
    wisp_id = auth.get_user_wisp_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('WISP_OWNER', 'ADMIN', 'WISP_TECH', 'TECH')
    )
  );

-- WISP technical staff can manage MikroTiks
CREATE POLICY "wisp_tech_manage_mikrotiks"
  ON mikrotiks FOR ALL
  USING (
    wisp_id = auth.get_user_wisp_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('WISP_OWNER', 'ADMIN', 'WISP_TECH', 'TECH')
    )
  );

-- ================================================================
-- RLS POLICIES: invoices
-- ================================================================

-- SUPER_ADMIN can see all invoices
CREATE POLICY "super_admin_select_invoices"
  ON invoices FOR SELECT
  USING (auth.is_super_admin());

-- WISP staff can see invoices from their WISP
CREATE POLICY "wisp_staff_select_invoices"
  ON invoices FOR SELECT
  USING (
    wisp_id = auth.get_user_wisp_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('WISP_OWNER', 'ADMIN', 'WISP_STAFF', 'SUPPORT')
    )
  );

-- Clients can see their own invoices
CREATE POLICY "clients_select_own_invoices"
  ON invoices FOR SELECT
  USING (client_id = auth.uid());

-- WISP staff can create/update invoices for their WISP
CREATE POLICY "wisp_staff_manage_invoices"
  ON invoices FOR ALL
  USING (
    wisp_id = auth.get_user_wisp_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('WISP_OWNER', 'ADMIN', 'SUPPORT')
    )
  );

-- ================================================================
-- RLS POLICIES: support_tickets
-- ================================================================

-- SUPER_ADMIN can see all tickets
CREATE POLICY "super_admin_select_tickets"
  ON support_tickets FOR SELECT
  USING (auth.is_super_admin());

-- WISP staff can see tickets from their WISP
CREATE POLICY "wisp_staff_select_tickets"
  ON support_tickets FOR SELECT
  USING (
    wisp_id = auth.get_user_wisp_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('WISP_OWNER', 'ADMIN', 'WISP_STAFF', 'SUPPORT', 'WISP_TECH', 'TECH')
    )
  );

-- Clients can see their own tickets
CREATE POLICY "clients_select_own_tickets"
  ON support_tickets FOR SELECT
  USING (client_id = auth.uid());

-- Clients can create tickets
CREATE POLICY "clients_create_tickets"
  ON support_tickets FOR INSERT
  WITH CHECK (
    client_id = auth.uid()
    AND wisp_id IN (SELECT wisp_id FROM clients WHERE id = auth.uid())
  );

-- WISP staff can manage tickets from their WISP
CREATE POLICY "wisp_staff_manage_tickets"
  ON support_tickets FOR ALL
  USING (
    wisp_id = auth.get_user_wisp_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('WISP_OWNER', 'ADMIN', 'WISP_STAFF', 'SUPPORT', 'TECH')
    )
  );

-- ================================================================
-- RLS POLICIES: audit_logs
-- ================================================================

-- SUPER_ADMIN can see all audit logs
CREATE POLICY "super_admin_select_audit_logs"
  ON audit_logs FOR SELECT
  USING (auth.is_super_admin());

-- WISP owners/admins can see audit logs from their WISP
CREATE POLICY "wisp_admin_select_audit_logs"
  ON audit_logs FOR SELECT
  USING (
    wisp_id = auth.get_user_wisp_id()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('WISP_OWNER', 'ADMIN')
    )
  );

-- System can insert audit logs (SECURITY DEFINER functions)
CREATE POLICY "system_insert_audit_logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);

-- No one can update or delete audit logs (immutable)
-- (No UPDATE or DELETE policies = denied by default)

-- ================================================================
-- VALIDATION: Test RLS is working
-- ================================================================

-- This should be run in a test environment to verify RLS
-- Example test queries (run as different users):
-- 
-- As SUPER_ADMIN:
--   SELECT COUNT(*) FROM wisps; -- Should see all
--   SELECT COUNT(*) FROM clients; -- Should see all
--
-- As WISP_OWNER (wisp_1):
--   SELECT COUNT(*) FROM clients WHERE wisp_id = 'wisp_1'; -- Should see only wisp_1
--   SELECT COUNT(*) FROM clients WHERE wisp_id = 'wisp_2'; -- Should see 0
--
-- As CLIENT:
--   SELECT * FROM clients WHERE id = auth.uid(); -- Should see own profile only
--   SELECT * FROM clients WHERE id != auth.uid(); -- Should see 0
