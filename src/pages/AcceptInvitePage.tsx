
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getInvitationByToken, acceptInvitation, Invitation } from '@/services/invitation';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Esquema de validação para o formulário de senha
const passwordSchema = z.object({
  password: z.string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const AcceptInvitePage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Inicializar o formulário de senha
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const inviteToken = params.get('token');
        
        if (!inviteToken) {
          setError('Token de convite não fornecido');
          setLoading(false);
          return;
        }
        
        setToken(inviteToken);
        console.log('[AcceptInvitePage] Buscando convite com token:', inviteToken);
        const invitationData = await getInvitationByToken(inviteToken);
        
        if (!invitationData) {
          console.error('[AcceptInvitePage] Convite não encontrado ou expirado');
          setError('Convite inválido ou expirado');
          setLoading(false);
          return;
        }
        
        console.log('[AcceptInvitePage] Convite encontrado:', invitationData);
        setInvitation(invitationData);
      } catch (error) {
        console.error('[AcceptInvitePage] Erro ao buscar convite:', error);
        setError('Erro ao buscar detalhes do convite');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [location.search]);

  const handleShowPasswordForm = () => {
    setShowPasswordForm(true);
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    if (!user || !invitation || !token) return;

    try {
      setAccepting(true);
      
      console.log('[AcceptInvitePage] Aceitando convite com token e definindo senha');
      
      const result = await acceptInvitation(token, user.id, data.password);
      
      if (!result) {
        console.error('[AcceptInvitePage] Resultado da aceitação é nulo');
        throw new Error('Erro ao aceitar convite');
      }
      
      console.log('[AcceptInvitePage] Convite aceito com sucesso:', result);
      
      toast({
        title: 'Convite aceito',
        description: 'Você agora é membro da organização com sua senha definida!',
      });
      
      // Redirecionar para o dashboard após sucesso
      navigate('/dashboard');
    } catch (error) {
      console.error('[AcceptInvitePage] Erro detalhado ao aceitar convite:', error);
      toast({
        title: 'Erro ao aceitar convite',
        description: 'Houve um problema ao processar seu convite.',
        variant: 'destructive',
      });
      setError('Houve um problema ao processar seu convite. Por favor, tente novamente mais tarde.');
    } finally {
      setAccepting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    const params = new URLSearchParams(location.search);
    const inviteToken = params.get('token');
    const redirectPath = `/accept-invite?token=${inviteToken}`;
    console.log('[AcceptInvitePage] Redirecionando para login com retorno para:', redirectPath);
    navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`);
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md px-4">
        <Card>
          <CardHeader>
            <CardTitle>Convite para Organização</CardTitle>
            <CardDescription>
              {error ? 'Houve um problema com o convite' : 'Você foi convidado para participar de uma organização'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : invitation ? (
              <>
                {!showPasswordForm ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium">Nome</h3>
                      <p className="text-sm">{invitation.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Email</h3>
                      <p className="text-sm">{invitation.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Função</h3>
                      <p className="text-sm">{invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}</p>
                    </div>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onPasswordSubmit)} className="space-y-4">
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
                      <Button type="submit" className="w-full" disabled={accepting}>
                        {accepting ? 'Processando...' : 'Definir senha e aceitar convite'}
                      </Button>
                    </form>
                  </Form>
                )}
              </>
            ) : null}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/')}>
              Cancelar
            </Button>
            {invitation && !error && !showPasswordForm && (
              <Button onClick={handleShowPasswordForm}>
                Continuar
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AcceptInvitePage;
