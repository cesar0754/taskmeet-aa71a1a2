
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Headers CORS para permitir acesso da aplicação front-end
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Interface para a requisição de e-mail
interface InvitationEmailRequest {
  email: string;
  name: string;
  organization: string;
  inviteLink: string;
  role: string;
}

// Handler da função
const handler = async (req: Request): Promise<Response> => {
  // Lidar com requisições OPTIONS (CORS preflight)
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extrair dados do corpo da requisição
    const { email, name, organization, inviteLink, role }: InvitationEmailRequest = await req.json();

    console.log("Enviando e-mail de convite para:", email);
    console.log("Link do convite:", inviteLink);

    // Formatar papel em português e primeira letra maiúscula
    let roleName = "Visualizador";
    if (role === "admin") roleName = "Administrador";
    if (role === "editor") roleName = "Editor";

    const fromEmail = Deno.env.get("INVITE_FROM_EMAIL") || "onboarding@resend.dev";
    const fromName = Deno.env.get("INVITE_FROM_NAME") || "Convites";

    if (!Deno.env.get("RESEND_API_KEY")) {
      console.error("RESEND_API_KEY não configurada nas Secrets da Edge Function");
      return new Response(
        JSON.stringify({ success: false, error: "RESEND_API_KEY não configurada" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const emailResponse = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [email],
      subject: `Convite para ${organization}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Você foi convidado para ${organization}</h1>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; font-size: 16px;">Olá ${name},</p>
            <p style="margin: 0 0 10px 0;">Você foi convidado para participar da organização <strong>${organization}</strong> como <strong>${roleName}</strong>.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}" 
               style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Aceitar Convite
            </a>
          </div>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #856404;">
              <strong>O que acontece agora?</strong><br>
              1. Clique no botão "Aceitar Convite" acima<br>
              2. Faça seu cadastro ou login se já tiver uma conta<br>
              3. Tenha acesso completo à organização
            </p>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
            <p style="font-size: 12px; color: #666; text-align: center;">
              Se você não solicitou este convite, pode ignorar este email com segurança.
            </p>
          </div>
        </div>
      `,
    });

    // Se a Resend retornou erro, não considerar como sucesso
    if ((emailResponse as any)?.error) {
      console.error("Erro ao enviar e-mail via Resend:", (emailResponse as any).error);
      return new Response(
        JSON.stringify({ success: false, error: (emailResponse as any).error }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    console.log("Email enviado com sucesso:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Erro ao processar requisição:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
