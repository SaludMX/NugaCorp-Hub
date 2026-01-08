import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Types
interface MikrotikJob {
  id: string;
  wisp_id: string;
  client_id: string | null;
  action: 'CREATE' | 'UPDATE' | 'SUSPEND' | 'DELETE';
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'FAILED';
  payload: Record<string, unknown>;
  error_message: string | null;
  retry_count: number;
  max_retries: number;
  created_at: string;
  updated_at: string;
}

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const POLL_INTERVAL_MS = parseInt(process.env.POLL_INTERVAL_MS || '5000', 10);
const WORKER_ID = process.env.WORKER_ID || 'worker-1';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: SUPABASE_URL y SUPABASE_SERVICE_KEY son requeridos');
  process.exit(1);
}

// Initialize Supabase client with service role key (bypasses RLS for worker)
const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * Mock de ejecución de comando RouterOS
 * En producción, aquí se conectaría vía SSH/API a MikroTik real
 */
async function executeMikrotikCommand(job: MikrotikJob): Promise<void> {
  console.log(`  📡 [MOCK] Ejecutando comando RouterOS...`);
  console.log(`     Action: ${job.action}`);
  console.log(`     Client: ${job.client_id || 'N/A'}`);
  console.log(`     Payload:`, JSON.stringify(job.payload, null, 2));

  // Simular latencia de red
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simular falla aleatoria (10% de probabilidad para testing)
  if (Math.random() < 0.1) {
    throw new Error('Simulación de falla de conexión MikroTik');
  }

  console.log(`  ✅ [MOCK] Comando ejecutado exitosamente`);
}

/**
 * Actualiza el estado de un job en la base de datos
 */
async function updateJobStatus(
  jobId: string,
  status: MikrotikJob['status'],
  errorMessage: string | null = null,
  incrementRetry: boolean = false
): Promise<void> {
  const updateData: Record<string, unknown> = {
    status,
    error_message: errorMessage,
  };

  if (incrementRetry) {
    // Usar raw SQL para incrementar contador
    const { error } = await supabase.rpc('increment_job_retry', {
      job_id: jobId,
    });

    if (error) {
      console.error(`     ⚠️  Error incrementando retry_count:`, error.message);
    }
  }

  const { error } = await supabase
    .from('mikrotik_jobs')
    .update(updateData)
    .eq('id', jobId);

  if (error) {
    console.error(`     ⚠️  Error actualizando job ${jobId}:`, error.message);
  }
}

/**
 * Procesa un job individual
 */
async function processJob(job: MikrotikJob): Promise<void> {
  console.log(`\n🔧 Procesando job ${job.id}...`);
  console.log(`   WISP: ${job.wisp_id}`);
  console.log(`   Action: ${job.action}`);
  console.log(`   Retry: ${job.retry_count}/${job.max_retries}`);

  try {
    // Marcar como IN_PROGRESS
    await updateJobStatus(job.id, 'IN_PROGRESS');

    // Ejecutar comando (mock)
    await executeMikrotikCommand(job);

    // Marcar como DONE
    await updateJobStatus(job.id, 'DONE');
    console.log(`✅ Job ${job.id} completado exitosamente`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error(`❌ Error procesando job ${job.id}:`, errorMessage);

    // Verificar si se pueden hacer más reintentos
    if (job.retry_count < job.max_retries) {
      console.log(`   🔄 Reintentando... (${job.retry_count + 1}/${job.max_retries})`);
      await updateJobStatus(job.id, 'PENDING', errorMessage, true);
    } else {
      console.log(`   ⛔ Máximo de reintentos alcanzado. Marcando como FAILED.`);
      await updateJobStatus(job.id, 'FAILED', errorMessage);
    }
  }
}

/**
 * Busca y procesa jobs pendientes
 */
async function pollJobs(): Promise<void> {
  try {
    // Buscar jobs PENDING
    const { data: jobs, error } = await supabase
      .from('mikrotik_jobs')
      .select('*')
      .eq('status', 'PENDING')
      .order('created_at', { ascending: true })
      .limit(10); // Procesar máximo 10 jobs por ciclo

    if (error) {
      console.error('❌ Error consultando jobs:', error.message);
      return;
    }

    if (!jobs || jobs.length === 0) {
      // No hay jobs pendientes
      return;
    }

    console.log(`\n📋 Encontrados ${jobs.length} job(s) pendiente(s)`);

    // Procesar jobs secuencialmente
    for (const job of jobs) {
      await processJob(job as MikrotikJob);
    }
  } catch (error) {
    console.error('❌ Error en pollJobs:', error);
  }
}

/**
 * Función principal del worker
 */
async function main(): Promise<void> {
  console.log('🚀 MikroTik Worker iniciado');
  console.log(`   Worker ID: ${WORKER_ID}`);
  console.log(`   Poll interval: ${POLL_INTERVAL_MS}ms`);
  console.log(`   Supabase URL: ${SUPABASE_URL}`);
  console.log('   Modo: MOCK (sin conexión real a MikroTik)\n');

  // Verificar conexión a Supabase
  const { error } = await supabase.from('mikrotik_jobs').select('id').limit(1);
  if (error) {
    console.error('❌ Error conectando a Supabase:', error.message);
    process.exit(1);
  }

  console.log('✅ Conexión a Supabase establecida\n');
  console.log('👀 Esperando jobs...\n');

  // Loop principal
  while (true) {
    await pollJobs();
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
}

// Manejo de señales de terminación
process.on('SIGINT', () => {
  console.log('\n\n⏸️  Worker detenido por usuario');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n⏸️  Worker detenido (SIGTERM)');
  process.exit(0);
});

// Iniciar worker
main().catch((error) => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
