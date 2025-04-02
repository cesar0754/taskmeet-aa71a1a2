
import React from 'react';
import { Invitation } from '@/types/invitation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';

interface InvitationDetailsProps {
  invitation: Invitation;
}

const InvitationDetails: React.FC<InvitationDetailsProps> = ({ invitation }) => {
  const { user } = useAuth();
  
  // Verificar se o email do usuário logado é diferente do email do convite
  const isEmailMismatch = user?.email && 
                          invitation.email && 
                          user.email.toLowerCase() !== invitation.email.toLowerCase();

  return (
    <div className="space-y-4">
      {isEmailMismatch && (
        <Alert variant="warning" className="mb-4">
          <AlertDescription className="text-amber-600">
            O convite foi enviado para <strong>{invitation.email}</strong>, mas você está logado como <strong>{user?.email}</strong>. 
            Você ainda pode aceitar este convite, mas esteja ciente que estará aceitando em nome de outro usuário.
          </AlertDescription>
        </Alert>
      )}
      
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
  );
};

export default InvitationDetails;
