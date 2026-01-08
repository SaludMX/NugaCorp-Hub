# Supabase Setup — NugaCorp Wireless Hub

Este documento describe la configuración necesaria para integrar Supabase en el frontend del Hub.

## Variables de Entorno

Crear `.env` (no versionado) con:

```
VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=<tu-clave-anon>
```

Asegúrate de NO exponer `SERVICE_ROLE_KEY` en el frontend.

## Cliente Supabase (lib/supabase.ts)

Inicializa el cliente con persistencia de sesión:
- `persistSession: true`
- `autoRefreshToken: true`

## Tipos (lib/database.types.ts)

Genera tipos con `supabase gen types typescript --project-id <id>` y exporta `Database` para tipar hooks.

## AuthContext

Usar `contexts/AuthContext.tsx` para exponer `user`, `session`, `loading`, `signIn`, `signOut` y escuchar `onAuthStateChange`.

## RLS

Todas las consultas deben estar protegidas por RLS. Evitar lógica de roles en frontend. Los hooks consumen datos ya filtrados.

## ProtectedRoute

Proteger rutas usando el componente `ProtectedRoute` que verifica sesión y redirige a `/login` si no hay autenticación.

## Pruebas Locales

- `npm run dev`
- Login con usuarios de prueba
- Confirmar persistencia de sesión
- Build sin errores

## Notas de Seguridad

- Nunca incluir `SERVICE_ROLE_KEY` en el frontend
- ANON_KEY es segura (publishable) porque RLS protege todo
- Mantener `.env` fuera de control de versiones
