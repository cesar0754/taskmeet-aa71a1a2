
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/context/AuthContext';

const RegisterPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/create-organization');
    }
  }, [user, navigate]);

  return (
    <AuthLayout
      title="Criar conta"
      description="Cadastre-se para começar a gerenciar suas organizações"
      footer={
        <div className="text-center text-sm">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Fazer login
          </Link>
        </div>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
