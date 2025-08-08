import React, { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const email = useMemo(() => searchParams.get('email') ?? '', [searchParams]);

  const handleResend = async () => {
    try {
      setIsSending(true);
      if (!email) {
        toast({
          title: 'E-mail não informado',
          description: 'Retorne ao cadastro e preencha seu e-mail novamente.',
          variant: 'destructive',
        });
        return;
      }
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      if (error) throw error;
      toast({
        title: 'E-mail reenviado',
        description: 'Verifique sua caixa de entrada e a pasta de spam.',
      });
    } catch (err: any) {
      toast({
        title: 'Não foi possível reenviar',
        description: err?.message ?? 'Tente novamente em instantes.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <article className="w-full max-w-md space-y-6 text-center">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Verifique seu e-mail</h1>
          <p className="text-sm text-muted-foreground">
            Enviamos um link de confirmação para
            {email ? (
              <> <span className="font-medium">{` ${email} `}</span></>
            ) : (
              ' o e-mail informado.'
            )}
            Clique no link para confirmar sua conta.
          </p>
        </header>

        <div className="space-y-3">
          <Button className="w-full" onClick={handleResend} disabled={isSending}>
            {isSending ? 'Reenviando…' : 'Reenviar e-mail de confirmação'}
          </Button>
          <p className="text-xs text-muted-foreground">
            Não recebeu? Verifique também a pasta de spam ou promoções.
          </p>
        </div>

        <footer className="text-sm text-muted-foreground">
          Digitou o e-mail errado? <Link to="/register" className="text-primary hover:underline">Voltar ao cadastro</Link>
        </footer>
      </article>
    </main>
  );
};

export default VerifyEmailPage;
