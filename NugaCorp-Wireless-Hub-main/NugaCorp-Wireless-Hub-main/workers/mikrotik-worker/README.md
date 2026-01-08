# MikroTik Worker

Worker Node.js/TypeScript para procesar jobs de sincronización con MikroTik de forma asíncrona.

## Características

- ✅ Procesa jobs en cola (tabla `mikrotik_jobs`)
- ✅ Respeta multi-tenant (wisp_id)
- ✅ Retry automático (máx 2 reintentos)
- ✅ Mock de RouterOS (sin conexión real todavía)
- ✅ Logging completo
- ✅ Manejo de errores robusto

## Instalación

```bash
cd workers/mikrotik-worker
npm install
cp .env.example .env
# Editar .env con tus credenciales de Supabase
```

## Configuración (.env)

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
POLL_INTERVAL_MS=5000
MAX_RETRIES=2
WORKER_ID=worker-1
```

⚠️ **IMPORTANTE**: Usa el `service_role` key (no el anon key) para que el worker pueda acceder a todos los jobs.

## Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

### Watch mode (auto-reload)
```bash
npm run watch
```

## Funcionamiento

1. El worker consulta la tabla `mikrotik_jobs` cada 5 segundos (configurable)
2. Filtra jobs con `status='PENDING'`
3. Por cada job:
   - Marca como `IN_PROGRESS`
   - Ejecuta comando mock RouterOS (1s delay)
   - Si éxito → `DONE`
   - Si falla → `PENDING` (reintento) o `FAILED` (máx reintentos)
4. Respeta límite de 10 jobs por ciclo

## Estados de Jobs

- **PENDING**: Esperando procesamiento
- **IN_PROGRESS**: Siendo procesado por worker
- **DONE**: Completado exitosamente
- **FAILED**: Falló después de max_retries

## Mock vs Producción

### Modo actual (Mock)
```typescript
async function executeMikrotikCommand(job: MikrotikJob) {
  console.log('[MOCK] Ejecutando comando...');
  await new Promise(resolve => setTimeout(resolve, 1000));
}
```

### Futuro (Producción con RouterOS real)
```typescript
import RouterOSAPI from 'node-routeros';

async function executeMikrotikCommand(job: MikrotikJob) {
  const conn = new RouterOSAPI({
    host: mikrotik.host,
    user: mikrotik.username,
    password: decrypt(mikrotik.password_encrypted)
  });
  
  await conn.connect();
  
  switch (job.action) {
    case 'CREATE':
      await conn.write('/ppp/secret/add', [
        '=name=' + payload.username,
        '=password=' + payload.password,
        '=service=pppoe',
        '=profile=' + payload.plan
      ]);
      break;
    // ... otros casos
  }
  
  conn.close();
}
```

## Logging

El worker muestra logs detallados:
```
🚀 MikroTik Worker iniciado
   Worker ID: worker-1
   Poll interval: 5000ms
   Modo: MOCK

📋 Encontrados 2 job(s) pendiente(s)

🔧 Procesando job abc-123...
   WISP: wisp-xyz
   Action: CREATE
   Retry: 0/2
  📡 [MOCK] Ejecutando comando RouterOS...
  ✅ [MOCK] Comando ejecutado exitosamente
✅ Job abc-123 completado exitosamente
```

## Detención

- `Ctrl+C` o `SIGTERM` para detener gracefully
- Jobs en progreso se marcarán como PENDING para reintento

## Próximos pasos (FASE 4B)

1. Integrar librería RouterOS real (`node-routeros`)
2. Implementar encriptación de passwords
3. Agregar health checks
4. Implementar worker pool (múltiples workers)
5. Añadir métricas y monitoring
