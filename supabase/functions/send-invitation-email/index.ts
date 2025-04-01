
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Inicialize o cliente Resend com a chave API
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

    // Enviando o e-mail usando o Resend
    const emailResponse = await resend.emails.send({
      from: "TaskMeet <noreply@taskmeet.com.br>", // Altere para seu domínio verificado no Resend
      to: [email],
      subject: `Convite para se juntar à ${organization} no TaskMeet`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h1 style="color: #3b82f6; margin-bottom: 20px;">Você foi convidado para o TaskMeet!</h1>
          
          <p>Olá ${name},</p>
          
          <p>Você foi convidado para se juntar à organização <strong>${organization}</strong> no TaskMeet com o papel de <strong>${roleName}</strong>.</p>
          
          <div style="margin: 30px 0;">
            <a href="${inviteLink}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Aceitar Convite
            </a>
          </div>
          
          <p>Ou você pode copiar e colar o link abaixo no seu navegador:</p>
          <p style="margin-bottom: 30px; word-break: break-all; color: #666;">${inviteLink}</p>
          
          <p>Este convite expirará em 7 dias.</p>
          
          <p>Se você não estava esperando este convite, pode ignorar este e-mail com segurança.</p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eaeaea; color: #666; font-size: 12px;">
            <p>TaskMeet - Gerencie suas tarefas e colabore com sua equipe de forma eficiente.</p>
          </div>
        </div>
      `,
    });

    console.log("Resposta do envio de e-mail:", emailResponse);

    // Retornando sucesso
    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Erro ao enviar e-mail de convite:", error);
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
