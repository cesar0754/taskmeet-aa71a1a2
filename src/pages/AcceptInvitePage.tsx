
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import InvitationDetails from '@/components/invitation/InvitationDetails';
import InvitationProcessingForm from '@/components/invitation/InvitationProcessingForm';
import InvitationRegisterForm from '@/components/invitation/InvitationRegisterForm';
import { useInvitation } from '@/hooks/useInvitation';

const AcceptInvitePage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  
  // Extrair token da URL
  const params = new URLSearchParams(location.search);
  const token = params.get('token');
  
  // Usar o hook personalizado para buscar os detalhes do convite
  const { invitation, loading, error } = useInvitation(token);

  // Determinar qual formulário mostrar com base no estado do usuário
  const shouldShowRegistrationForm = !user && invitation && showRegistrationForm;
  const shouldShowProcessingForm = user && invitation && showRegistrationForm;

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md px-4">
        <Card>
          <CardHeader>
            <CardTitle>Convite para Organização</CardTitle>
            <CardDescription>
              {error ? 'Houve um problema com o convite' : 'Você foi convidado para participar de uma organização'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : invitation ? (
              <>
                {!showRegistrationForm ? (
                  <InvitationDetails invitation={invitation} />
                ) : (
                  <>
                    {shouldShowRegistrationForm && token && (
                      <InvitationRegisterForm invitation={invitation} token={token} />
                    )}
                    
                    {shouldShowProcessingForm && token && (
                      <InvitationProcessingForm invitation={invitation} token={token} />
                    )}
                  </>
                )}
              </>
            ) : null}
          </CardContent>
          {invitation && !error && !showRegistrationForm && (
            <CardFooter className="flex justify-between">
              <div className="flex justify-end w-full space-x-2">
                <button
                  className="px-4 py-2 border border-gray-300 rounded text-sm font-medium bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => navigate('/')}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 bg-primary text-white rounded text-sm font-medium hover:bg-primary/90"
                  onClick={() => setShowRegistrationForm(true)}
                >
                  Continuar
                </button>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AcceptInvitePage;
