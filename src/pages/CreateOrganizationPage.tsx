
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateOrganization from '@/components/organizations/CreateOrganization';
import { useAuth } from '@/context/AuthContext';
import { useOrganization } from '@/context/OrganizationContext';

const CreateOrganizationPage: React.FC = () => {
  const { user } = useAuth();
  const { organization, loading, createOrganization } = useOrganization();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (organization) {
      navigate('/dashboard');
    }
  }, [user, organization, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return <CreateOrganization />;
};

export default CreateOrganizationPage;
