
import React from 'react';
import { Invitation } from '@/types/invitation';

interface InvitationDetailsProps {
  invitation: Invitation;
}

const InvitationDetails: React.FC<InvitationDetailsProps> = ({ invitation }) => {
  return (
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
  );
};

export default InvitationDetails;
