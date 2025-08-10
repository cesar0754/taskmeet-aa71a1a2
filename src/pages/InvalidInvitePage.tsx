import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
});

type Values = z.infer<typeof schema>;

const InvalidInvitePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const params = new URLSearchParams(location.search);
  const token = params.get('token') || '';

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  React.useEffect(() => {
    document.title = 'Convite inválido | App';
  }, []);

  const onSubmit = async (values: Values) => {
    // Aqui poderíamos chamar uma Edge Function para notificar o owner
    toast({
      title: 'Solicitação enviada',
      description: 'Seus dados foram enviados para o responsável pela organização.',
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <header>
          <h1 className="text-2xl font-semibold">Convite inválido ou expirado</h1>
          <p className="text-muted-foreground">
            O link de convite fornecido não é válido ou expirou. Você pode solicitar um novo convite abaixo.
          </p>
          {token && (
            <p className="text-xs text-muted-foreground mt-2">Token: {token}</p>
          )}
        </header>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu e-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => navigate('/')}>Voltar</Button>
              <Button type="submit">Solicitar novo convite</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default InvalidInvitePage;
