import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GetInvitationRequest {
  token: string; // email usado como token
  organizationId?: string;
}

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      // service role para ler ignorando RLS com segurança no backend
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { token, organizationId }: GetInvitationRequest = await req.json();

    if (!token) {
      return new Response(JSON.stringify({ error: "Token não fornecido" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log("[get-invitation] Buscando convite", { token, organizationId });

    const baseQuery = supabase
      .from("organization_members")
      .select("id, organization_id, email, name, role, created_at")
      .eq("email", token)
      .is("user_id", null)
      .limit(1);

    const { data, error } = organizationId
      ? await baseQuery.eq("organization_id", organizationId)
      : await baseQuery;

    if (error) {
      console.error("[get-invitation] Erro ao buscar convite:", error);
      return new Response(JSON.stringify({ error: "Erro ao buscar convite" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!data || data.length === 0) {
      return new Response(JSON.stringify({ success: false, invitation: null }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const invitation = data[0];
    return new Response(
      JSON.stringify({ success: true, invitation }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (err) {
    console.error("[get-invitation] Erro inesperado:", err);
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});