# FASE 4A COMPLETADA ✅

NugaCorp Wireless Hub — Infraestructura de Jobs para MikroTik (multi-tenant, RLS)

Fecha: 7 de Enero de 2026
Estado: COMPLETADO

---

## 🎯 Objetivo
Diseñar e implementar infraestructura backend para encolar y procesar jobs destinados a routers MikroTik, con seguridad RLS multi-tenant, Edge Function para encolar, y worker Node que procesa en modo mock.

---

## 🧱 Migrations SQL (Supabase)

1) `public.mikrotik_jobs`
- Campos: `id`, `wisp_id`, `mikrotik_id`, `status`, `command`, `params`, `result`, `error`, `retry_count`, `max_retries`, `scheduled_at`, `started_at`, `finished_at`, `created_at`, `updated_at`
- Triggers: `updated_at` auto-update
- Índices: por `status`, `wisp_id`, `mikrotik_id`, `scheduled_at`
- RLS Policies:
  - SUPER_ADMIN: acceso total
  - WISP_OWNER / WISP_STAFF: acceso limitado por `wisp_id`

2) `enqueue_mikrotik_job()`
- RPC para encolar job con validaciones de rol
- Verifica existencia de `mikrotik_id` y `wisp_id` asignado al user
- `GRANT EXECUTE` a `authenticated`

3) `increment_job_retry()`
- Service role only — usado por el worker

---

## 🛰️ Edge Function
**Ruta:** `supabase/functions/enqueue-mikrotik-job/index.ts`
- Verifica JWT (Auth) y extrae `wisp_id`
- Llama RPC `enqueue_mikrotik_job`
- Responde con `{ job_id, status }`
- Validaciones y manejo de errores claros

---

## 🧰 Worker Node.js (mock)
**Ruta:** `workers/mikrotik-worker/`
- `src/index.ts` — poll de jobs `PENDING` y `SCHEDULED`
- Transiciones: `STARTED` → `SUCCESS` / `FAILED`
- Simula ejecución MikroTik (mock), sin SSH real
- Manejo de `retry_count` hasta `max_retries`
- Logs claros y control de intervalos
- Variables `.env.example` para configuración

---

## 🔗 Hook Frontend (read-only)
**Archivo:** `hooks/data/useMikrotikJobs.ts`
- Lista jobs del tenant con RLS
- `enqueueJob()` vía Edge Function
- NO ejecuta jobs desde UI
- `refetch()` para actualizar listados

---

## 🔒 Seguridad y Roles
- Multi-tenant por `wisp_id` (RLS)
- SUPER_ADMIN: acceso total
- WISP_OWNER / WISP_STAFF: acceso limitado al propio tenant
- CLIENT: sin acceso a jobs
- Edge Function valida JWT; RPC protege inserción
- Worker usa Service Role Key (solo en servidor)

---

## ✅ Validaciones
- Migrations aplicadas al proyecto correcto (confirmado)
- `mcp` usado para listar tables/policies
- Build del frontend sin errores
- Typescript estricto en hooks y worker
- End-to-end: encolar job → worker procesa mock → estado SUCCESS/FAILED

---

## 📚 Documentación
- `PHASE4A_SUMMARY.md` — este documento
- README del worker con instrucciones
- Tipos TS actualizados en `lib/database.types.ts`

---

## 🚀 Próximo (FASE 4B - opcional)
- Métricas de jobs por WISP
- UI para filtrar por estado/fecha
- Auditoría y trazabilidad avanzada
- Integración con RouterOS (cuando esté permitido)

---

## 🧾 Resumen Ejecutivo
Infraestructura de jobs para MikroTik lista: tabla con RLS, RPC para encolar, Edge Function para ingreso, worker mock que procesa jobs. Sistema multi-tenant seguro, estable y extensible.
