
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateOrganization from '@/components/organizations/CreateOrganization';
import { useAuth } from '@/context/AuthContext';
import { useOrganization } from '@/context/OrganizationContext';

const CreateOrganizationPage: React.FC = () => {
  const { user } = useAuth();
  const { organization } = useOrganization();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (organization) {
      navigate('/dashboard');
    }
  }, [user, organization, navigate]);

  return <CreateOrganization />;
};

export default CreateOrganizationPage;
