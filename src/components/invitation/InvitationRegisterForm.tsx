
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Invitation } from '@/types/invitation';
import { profileService } from '@/services/profileService';

const registerSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface InvitationRegisterFormProps {
  invitation: Invitation;
  token: string;
}

const InvitationRegisterForm: React.FC<InvitationRegisterFormProps> = ({ invitation, token }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: invitation.email || '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setIsProcessing(true);
      setError(null);
      console.log('[InvitationRegisterForm] Registrando membro convidado via Edge Function');
      const { data: registerData, error: registerError } = await supabase.functions.invoke('register-invited-user', {
        body: {
          token,
          organizationId: invitation.organization_id,
          email: values.email,
          password: values.password,
          name: invitation.name,
        },
      });
      
      if (registerError) {
        console.error('[InvitationRegisterForm] Erro na Edge Function de registro:', registerError);
        setError(registerError.message || 'Erro ao registrar usuário convidado.');
        return;
      }
      
      if (!registerData?.success) {
        console.error('[InvitationRegisterForm] Registro falhou:', registerData?.error);
        setError(registerData?.error || 'Não foi possível registrar o usuário.');
        return;
      }
      
      console.log('[InvitationRegisterForm] Registro processado:', registerData);

      // Login automático (sem confirmação de e-mail)
const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (signInError) {
        console.error('[InvitationRegisterForm] Erro ao fazer login automático:', signInError);
        setError(
          signInError.message?.includes('confirm')
            ? 'O login exige confirmação de e-mail no projeto Supabase. Desative "Confirm email" nas configurações para fluxo imediato.'
            : signInError.message || 'Erro ao fazer login automático.'
        );
        return;
      }

      // Aceitar o convite usando o serviço (requer sessão ativa)
      const { acceptInvitation } = await import('@/services/invitation');
      const result = await acceptInvitation(token, invitation.organization_id);
      
      if (!result.success) {
        console.error('[InvitationRegisterForm] Erro ao aceitar convite:', result.message);
        setError(result.message || 'Erro ao aceitar convite.');
        return;
      }

      // Atualizar/crear perfil com dados do convite
      const userId = signInData?.user?.id;
      if (userId) {
        try {
          const existing = await profileService.getProfile(userId);
          if (!existing) {
            await profileService.createProfile(userId, { name: invitation.name, email: values.email });
          } else {
            await profileService.updateProfile(userId, { name: invitation.name, email: values.email });
          }
        } catch (profileErr) {
          console.warn('[InvitationRegisterForm] Não foi possível sincronizar perfil agora:', profileErr);
        }
      }

      toast({
        title: 'Conta criada com sucesso',
        description: 'Você agora é membro da organização!',
      });
      
      // Redirecionar para o dashboard
      navigate(`/dashboard?org=${invitation.organization_id}`);
    } catch (error: any) {
      console.error('[InvitationRegisterForm] Erro ao processar registro:', error);
      setError(error.message || 'Ocorreu um erro ao processar sua solicitação.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seu e-mail</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Digite seu e-mail" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Defina sua senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Digite sua senha" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirme sua senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirme sua senha" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={() => navigate('/')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? 'Processando...' : 'Registrar e aceitar convite'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default InvitationRegisterForm;
