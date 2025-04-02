
import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/context/AuthContext';
import { fetchUserOrganizations } from '@/services/organizationService';
import { useToast } from '@/hooks/use-toast';

const LoginPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkUserOrganization = async () => {
      if (!user) return;
      
      // Verificar se há um redirect na URL
      const params = new URLSearchParams(location.search);
      const redirectPath = params.get('redirect');
      
      if (redirectPath) {
        console.log('[LoginPage] Redirecionando para:', redirectPath);
        navigate(redirectPath);
        return;
      }
      
      try {
        const org = await fetchUserOrganizations(user.id);
        if (org) {
          navigate('/dashboard');
        } else {
          navigate('/create-organization');
        }
      } catch (error) {
        console.error('Erro ao verificar organizações do usuário:', error);
        toast({
          title: 'Erro ao verificar organizações',
          description: 'Houve um problema ao verificar suas organizações. Você será redirecionado para criar uma nova.',
          variant: 'destructive',
        });
        navigate('/create-organization');
      }
    };

    if (user) {
      checkUserOrganization();
    }
  }, [user, navigate, toast, location.search]);

  return (
    <AuthLayout
      title="Bem-vindo de volta"
      description="Entre com sua conta para continuar"
      footer={
        <div className="text-center text-sm">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Criar conta
          </Link>
        </div>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
