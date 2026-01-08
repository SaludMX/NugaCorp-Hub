-- =====================================================
-- FASE 4A: Sistema de Jobs para MikroTik
-- =====================================================
-- Tabla para encolar tareas de sincronización con MikroTik
-- Multi-tenant seguro con RLS estricto

-- Crear tabla mikrotik_jobs
CREATE TABLE IF NOT EXISTS public.mikrotik_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wisp_id uuid NOT NULL REFERENCES public.wisps(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'SUSPEND', 'DELETE')),
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'DONE', 'FAILED')),
  payload jsonb DEFAULT '{}'::jsonb,
  error_message text,
  retry_count integer DEFAULT 0,
  max_retries integer DEFAULT 2,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_mikrotik_jobs_wisp_id ON public.mikrotik_jobs(wisp_id);
CREATE INDEX IF NOT EXISTS idx_mikrotik_jobs_client_id ON public.mikrotik_jobs(client_id);
CREATE INDEX IF NOT EXISTS idx_mikrotik_jobs_status ON public.mikrotik_jobs(status);
CREATE INDEX IF NOT EXISTS idx_mikrotik_jobs_created_at ON public.mikrotik_jobs(created_at DESC);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.update_mikrotik_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_mikrotik_jobs_updated_at
  BEFORE UPDATE ON public.mikrotik_jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_mikrotik_jobs_updated_at();

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Habilitar RLS
ALTER TABLE public.mikrotik_jobs ENABLE ROW LEVEL SECURITY;

-- SUPER_ADMIN: Acceso total
CREATE POLICY "SUPER_ADMIN can manage all mikrotik_jobs"
  ON public.mikrotik_jobs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'SUPER_ADMIN'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'SUPER_ADMIN'
    )
  );

-- WISP_OWNER / ADMIN / WISP_STAFF: Solo su WISP
CREATE POLICY "WISP staff can manage their WISP mikrotik_jobs"
  ON public.mikrotik_jobs
  FOR ALL
  TO authenticated
  USING (
    wisp_id IN (
      SELECT users.wisp_id FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('WISP_OWNER', 'ADMIN', 'WISP_STAFF')
    )
  )
  WITH CHECK (
    wisp_id IN (
      SELECT users.wisp_id FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('WISP_OWNER', 'ADMIN', 'WISP_STAFF')
    )
  );

-- Clients: NO tienen acceso a jobs (por seguridad)
-- No policy needed - default deny

-- =====================================================
-- COMENTARIOS
-- =====================================================
COMMENT ON TABLE public.mikrotik_jobs IS 'Sistema de jobs para sincronización asíncrona con MikroTik. Multi-tenant seguro con RLS.';
COMMENT ON COLUMN public.mikrotik_jobs.action IS 'Acción a ejecutar: CREATE, UPDATE, SUSPEND, DELETE';
COMMENT ON COLUMN public.mikrotik_jobs.status IS 'Estado del job: PENDING, IN_PROGRESS, DONE, FAILED';
COMMENT ON COLUMN public.mikrotik_jobs.payload IS 'Datos JSON para la operación (ej: username, password, ip, plan)';
COMMENT ON COLUMN public.mikrotik_jobs.retry_count IS 'Número de reintentos realizados';
COMMENT ON COLUMN public.mikrotik_jobs.max_retries IS 'Máximo de reintentos permitidos (default 2)';
