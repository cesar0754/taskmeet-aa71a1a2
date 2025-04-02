
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AcceptInvitationRequest {
  token: string;
  userId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { token, userId } = await req.json() as AcceptInvitationRequest;

    if (!token || !userId) {
      return new Response(
        JSON.stringify({ error: "Token e ID do usuário são obrigatórios" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Processando aceitação de convite. Token: ${token}, userId: ${userId}`);

    // 1. Buscar o convite
    const { data: invitation, error: invitationError } = await supabase
      .from("member_invitations")
      .select("*")
      .eq("token", token)
      .is("used_at", null)
      .single();

    if (invitationError || !invitation) {
      console.error("Erro ao buscar convite:", invitationError);
      return new Response(
        JSON.stringify({ error: "Convite não encontrado ou já utilizado" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 2. Verificar se o usuário já é membro
    const { data: existingMember, error: memberError } = await supabase
      .from("organization_members")
      .select("*")
      .eq("organization_id", invitation.organization_id)
      .eq("user_id", userId)
      .single();

    if (existingMember) {
      // Se já é membro, apenas marcar o convite como utilizado
      await supabase
        .from("member_invitations")
        .update({ used_at: new Date().toISOString() })
        .eq("id", invitation.id);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Usuário já é membro desta organização",
          member: existingMember 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 3. Adicionar usuário como membro
    const { data: member, error: addError } = await supabase
      .from("organization_members")
      .insert({
        organization_id: invitation.organization_id,
        user_id: userId,
        role: invitation.role,
        email: invitation.email,
        name: invitation.name,
        is_first_login: false,
        pending: false
      })
      .select()
      .single();

    if (addError) {
      console.error("Erro ao adicionar membro:", addError);
      return new Response(
        JSON.stringify({ error: "Erro ao adicionar usuário como membro" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 4. Marcar convite como utilizado
    const { error: updateError } = await supabase
      .from("member_invitations")
      .update({ used_at: new Date().toISOString() })
      .eq("id", invitation.id);

    if (updateError) {
      console.error("Erro ao atualizar convite:", updateError);
      // Não falhar a operação se esta parte falhar
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Convite aceito com sucesso",
        member 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Erro ao processar convite:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao processar convite" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
