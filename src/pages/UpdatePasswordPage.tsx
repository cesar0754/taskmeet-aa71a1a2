
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';

// Schema para o formulário de atualização de senha
const updatePasswordSchema = z.object({
  password: z.string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;

const UpdatePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { updatePassword, session } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  const form = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    // Verificar se há uma sessão válida ou hash na URL 
    // (para identificar se é um acesso via link de recuperação)
    const verifySession = async () => {
      try {
        // Se temos uma sessão, o token é válido
        if (session) {
          setIsTokenValid(true);
          return;
        }
        
        // Se não houver sessão ativa, verificamos se este é um link de recuperação de senha
        const hash = window.location.hash;
        if (!hash) {
          setIsTokenValid(false);
          setError('Acesso inválido. Por favor, solicite um link de recuperação de senha.');
        } else {
          // Se houver um hash, assumimos que é um link válido de redefinição de senha
          setIsTokenValid(true);
        }
      } catch (err) {
        console.error('[UpdatePasswordPage] Erro inesperado ao verificar sessão:', err);
        setIsTokenValid(false);
        setError('Ocorreu um erro ao verificar o link de recuperação. Por favor, tente novamente.');
      }
    };

    verifySession();
  }, [session]);

  const onSubmit = async (values: UpdatePasswordFormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      console.log('[UpdatePasswordPage] Atualizando senha');
      
      const result = await updatePassword(values.password);

      if (!result) {
        setError('Erro ao atualizar a senha. Por favor, tente novamente.');
        return;
      }
      
      console.log('[UpdatePasswordPage] Senha atualizada com sucesso');
      setSuccess(true);
      
      // Redirecionar para o login após 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('[UpdatePasswordPage] Erro inesperado:', err);
      setError('Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isTokenValid === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md px-4">
        <Card>
          <CardHeader>
            <CardTitle>Definir nova senha</CardTitle>
            <CardDescription>
              Digite e confirme sua nova senha
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success ? (
              <Alert className="mb-4">
                <AlertTitle>Senha atualizada</AlertTitle>
                <AlertDescription>
                  Sua senha foi atualizada com sucesso. Você será redirecionado para a página de login.
                </AlertDescription>
              </Alert>
            ) : isTokenValid ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nova senha</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Digite sua nova senha" {...field} />
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
                          <Input type="password" placeholder="Confirme sua nova senha" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Atualizando...' : 'Atualizar senha'}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="text-center">
                <Button onClick={() => navigate('/reset-password')} className="mt-4">
                  Solicitar novo link
                </Button>
              </div>
            )}
          </CardContent>
          {!success && (
            <CardFooter className="flex justify-start">
              <Button variant="outline" onClick={() => navigate('/login')}>
                Voltar para o login
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;
