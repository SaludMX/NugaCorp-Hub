-- =====================================================
-- Función auxiliar para incrementar retry_count
-- =====================================================

CREATE OR REPLACE FUNCTION public.increment_job_retry(job_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.mikrotik_jobs
  SET retry_count = retry_count + 1
  WHERE id = job_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_job_retry TO service_role;

COMMENT ON FUNCTION public.increment_job_retry IS 
  'Incrementa el contador de reintentos para un job. Solo accesible por service_role (worker).';
