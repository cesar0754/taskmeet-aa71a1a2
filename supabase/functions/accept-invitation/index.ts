import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AcceptInvitationRequest {
  token: string;
  userId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      // Use service role to bypass RLS securely inside the Edge Function
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { token }: AcceptInvitationRequest = await req.json();
    
    console.log("Processando aceitação de convite:", { token });

    let currentUserId: string | undefined = undefined;

    // Extrair do JWT obrigatoriamente
    if (!currentUserId) {
      const authHeader = req.headers.get("Authorization");
      if (authHeader) {
        const jwt = authHeader.replace("Bearer ", "");
        const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);
        
        if (userError || !user) {
          console.error("Erro ao obter usuário:", userError);
          return new Response(
            JSON.stringify({ error: "Usuário não autenticado" }),
            { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
        currentUserId = user.id;
      } else {
        return new Response(
          JSON.stringify({ error: "Token de autorização não fornecido" }),
          { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // Buscar convite pendente usando email como token
    const { data: invitations, error: fetchError } = await supabase
      .from("organization_members")
      .select("*")
      .eq("email", token)
      .is("user_id", null)
      .limit(1);

    if (fetchError) {
      console.error("Erro ao buscar convite:", fetchError);
      return new Response(
        JSON.stringify({ error: "Erro interno ao buscar convite" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!invitations || invitations.length === 0) {
      console.log("Convite não encontrado para token:", token);
      return new Response(
        JSON.stringify({ error: "Convite não encontrado ou já foi usado" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const invitation = invitations[0];

    // Verificar se o usuário já é membro da organização
    const { data: existingMember } = await supabase
      .from("organization_members")
      .select("id")
      .eq("organization_id", invitation.organization_id)
      .eq("user_id", currentUserId)
      .not("user_id", "is", null)
      .single();

    if (existingMember) {
      // Usuário já é membro, apenas marcar convite como usado
      await supabase
        .from("organization_members")
        .delete()
        .eq("id", invitation.id);

      console.log("Usuário já era membro, convite removido");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Você já é membro desta organização",
          member: existingMember 
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Atualizar o convite pendente com o user_id
    const { data: updatedMember, error: updateError } = await supabase
      .from("organization_members")
      .update({ 
        user_id: currentUserId,
        updated_at: new Date().toISOString()
      })
      .eq("id", invitation.id)
      .select()
      .single();

    if (updateError) {
      console.error("Erro ao atualizar membro:", updateError);
      return new Response(
        JSON.stringify({ error: "Erro ao aceitar convite" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Convite aceito com sucesso:", updatedMember);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Convite aceito com sucesso",
        member: updatedMember 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error) {
    console.error("Erro completo na função accept-invitation:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});