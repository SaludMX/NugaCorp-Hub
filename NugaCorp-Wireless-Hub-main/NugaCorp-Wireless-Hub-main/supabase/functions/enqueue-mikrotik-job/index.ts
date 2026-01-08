import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EnqueueJobRequest {
  wisp_id: string;
  client_id?: string;
  action: "CREATE" | "UPDATE" | "SUSPEND" | "DELETE";
  payload?: Record<string, unknown>;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Validar autenticación
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Crear cliente Supabase con el token del usuario
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Verificar que el usuario esté autenticado
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Usuario no autenticado" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parsear request body
    const body: EnqueueJobRequest = await req.json();

    // Validar campos requeridos
    if (!body.wisp_id || !body.action) {
      return new Response(
        JSON.stringify({
          error: "Campos requeridos: wisp_id, action",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validar acción
    const validActions = ["CREATE", "UPDATE", "SUSPEND", "DELETE"];
    if (!validActions.includes(body.action)) {
      return new Response(
        JSON.stringify({
          error: `Acción inválida. Debe ser: ${validActions.join(", ")}`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Llamar a la función helper de Postgres
    const { data, error } = await supabaseClient.rpc("enqueue_mikrotik_job", {
      p_wisp_id: body.wisp_id,
      p_client_id: body.client_id || null,
      p_action: body.action,
      p_payload: body.payload || {},
    });

    if (error) {
      console.error("Error enqueuing job:", error);
      return new Response(
        JSON.stringify({
          error: error.message || "Error al encolar job",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Retornar job_id exitoso
    return new Response(
      JSON.stringify({
        success: true,
        job_id: data,
        message: `Job encolado exitosamente: ${body.action}`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unhandled error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Error desconocido",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
