-- =====================================================
-- FASE 4A: Helper function para encolar jobs
-- =====================================================

-- Función para encolar un job de MikroTik
-- Valida permisos RLS, existencia de cliente/WISP y crea el job
CREATE OR REPLACE FUNCTION public.enqueue_mikrotik_job(
  p_wisp_id uuid,
  p_client_id uuid,
  p_action text,
  p_payload jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER -- Ejecuta con permisos de owner de la función
SET search_path = public
AS $$
DECLARE
  v_job_id uuid;
  v_user_role text;
  v_user_wisp_id uuid;
BEGIN
  -- Validar que el usuario esté autenticado
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Usuario no autenticado';
  END IF;

  -- Obtener rol y WISP del usuario actual
  SELECT role, wisp_id INTO v_user_role, v_user_wisp_id
  FROM public.users
  WHERE id = auth.uid();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuario no encontrado en la base de datos';
  END IF;

  -- Validar acción
  IF p_action NOT IN ('CREATE', 'UPDATE', 'SUSPEND', 'DELETE') THEN
    RAISE EXCEPTION 'Acción inválida: %. Debe ser CREATE, UPDATE, SUSPEND o DELETE', p_action;
  END IF;

  -- Validar permisos según rol
  IF v_user_role = 'SUPER_ADMIN' THEN
    -- SUPER_ADMIN puede encolar jobs para cualquier WISP
    NULL;
  ELSIF v_user_role IN ('WISP_OWNER', 'ADMIN', 'WISP_STAFF') THEN
    -- Staff solo puede encolar jobs para su propio WISP
    IF p_wisp_id != v_user_wisp_id THEN
      RAISE EXCEPTION 'No tienes permisos para encolar jobs para este WISP';
    END IF;
  ELSE
    -- Otros roles no tienen permisos
    RAISE EXCEPTION 'Tu rol (%) no tiene permisos para encolar jobs', v_user_role;
  END IF;

  -- Validar que el WISP exista
  IF NOT EXISTS (SELECT 1 FROM public.wisps WHERE id = p_wisp_id) THEN
    RAISE EXCEPTION 'WISP no encontrado: %', p_wisp_id;
  END IF;

  -- Validar que el cliente exista y pertenezca al WISP (si se proporciona)
  IF p_client_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.clients 
      WHERE id = p_client_id 
      AND wisp_id = p_wisp_id
    ) THEN
      RAISE EXCEPTION 'Cliente no encontrado o no pertenece al WISP especificado';
    END IF;
  END IF;

  -- Crear el job
  INSERT INTO public.mikrotik_jobs (
    wisp_id,
    client_id,
    action,
    status,
    payload,
    retry_count,
    max_retries
  )
  VALUES (
    p_wisp_id,
    p_client_id,
    p_action,
    'PENDING',
    p_payload,
    0,
    2
  )
  RETURNING id INTO v_job_id;

  -- Log opcional (comentar en producción si no se necesita)
  RAISE NOTICE 'Job creado: % (action: %, wisp: %, client: %)', 
    v_job_id, p_action, p_wisp_id, p_client_id;

  RETURN v_job_id;
END;
$$;

-- Dar permisos de ejecución a usuarios autenticados
GRANT EXECUTE ON FUNCTION public.enqueue_mikrotik_job TO authenticated;

-- Comentario
COMMENT ON FUNCTION public.enqueue_mikrotik_job IS 
  'Encola un job de sincronización con MikroTik. Valida permisos RLS, rol del usuario y existencia de cliente/WISP. Retorna job_id.';
