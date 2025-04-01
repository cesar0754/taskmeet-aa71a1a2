
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Users } from 'lucide-react';
import { useOrganization } from '@/context/OrganizationContext';
import { useNavigate } from 'react-router-dom';

interface Organization {
  id: string;
  name: string;
  created_at: string;
  owner_id: string;
  logo_url?: string;
}

interface OrganizationCardProps {
  organization: Organization;
  members: number;
}

const OrganizationCard: React.FC<OrganizationCardProps> = ({ organization, members }) => {
  const { setCurrentOrganization } = useOrganization();
  const navigate = useNavigate();

  const handleSelect = () => {
    setCurrentOrganization(organization);
    navigate('/dashboard');
  };

  const createdAt = new Date(organization.created_at).toLocaleDateString('pt-BR');

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Building className="h-5 w-5 text-primary" />
          {organization.name}
        </CardTitle>
        <CardDescription>Criada em {createdAt}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{members} {members === 1 ? 'membro' : 'membros'}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSelect}>
          Selecionar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrganizationCard;
