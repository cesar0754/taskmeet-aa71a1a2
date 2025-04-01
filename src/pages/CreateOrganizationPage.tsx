
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateOrganization from '@/components/organizations/CreateOrganization';
import { useAuth } from '@/context/AuthContext';
import { useOrganization } from '@/context/OrganizationContext';
import { fetchUserOrganizations } from '@/services/organizationService';

const CreateOrganizationPage: React.FC = () => {
  const { user } = useAuth();
  const { organization, loading, createOrganization } = useOrganization();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkExistingOrganization = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const existingOrg = await fetchUserOrganizations(user.id);
        if (existingOrg) {
          console.log('Usuário já possui organização, redirecionando para dashboard');
          navigate('/dashboard');
        } else {
          console.log('Usuário não possui organização, permanecendo na página de criação');
        }
      } catch (error) {
        console.error('Erro ao verificar organizações existentes:', error);
      } finally {
        setChecking(false);
      }
    };

    checkExistingOrganization();
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  if (checking || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return <CreateOrganization />;
};

export default CreateOrganizationPage;
