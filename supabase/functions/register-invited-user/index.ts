import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RegisterInvitedUserRequest {
  token: string; // usamos o email como token
  organizationId?: string;
  email: string;
  password: string;
  name?: string;
  avatar_url?: string;
}

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { token, organizationId, email, password, name, avatar_url }: RegisterInvitedUserRequest = await req.json();

    if (!token || !email || !password) {
      return new Response(
        JSON.stringify({ success: false, error: "Parâmetros inválidos" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    // Validar se há um convite pendente para este token/email
    const baseQuery = supabase
      .from("organization_members")
      .select("id, organization_id, email, name, role")
      .eq("email", token)
      .is("user_id", null)
      .limit(1);

    const { data: invitations, error: inviteErr } = organizationId
      ? await baseQuery.eq("organization_id", organizationId)
      : await baseQuery;

    if (inviteErr) {
      console.error("[register-invited-user] Erro ao buscar convite:", inviteErr);
      return new Response(
        JSON.stringify({ success: false, error: "Erro ao validar convite" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    if (!invitations || invitations.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Convite inválido ou expirado" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    // Checar se usuário já existe
    const { data: existingUser } = await supabase.auth.admin.getUserByEmail(email);

    if (existingUser?.user) {
      // Não alteramos senha por segurança; apenas informamos que existe
      return new Response(
        JSON.stringify({ success: true, userExists: true, userId: existingUser.user.id }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    // Criar usuário já confirmado
    const { data: created, error: createErr } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, avatar_url },
    });

    if (createErr || !created?.user) {
      console.error("[register-invited-user] Erro ao criar usuário:", createErr);
      return new Response(
        JSON.stringify({ success: false, error: "Não foi possível criar o usuário" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    return new Response(
      JSON.stringify({ success: true, userExists: false, userId: created.user.id }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (err) {
    console.error("[register-invited-user] Erro inesperado:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Erro interno do servidor" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }
});
