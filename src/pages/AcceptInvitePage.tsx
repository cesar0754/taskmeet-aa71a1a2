import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getInvitationByToken, acceptInvitation, Invitation } from '@/services/invitation';

const AcceptInvitePage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        if (!token) {
          setError('Token de convite não fornecido');
          setLoading(false);
          return;
        }
        
        const invitationData = await getInvitationByToken(token);
        if (!invitationData) {
          setError('Convite inválido ou expirado');
          setLoading(false);
          return;
        }
        
        setInvitation(invitationData);
      } catch (error) {
        console.error('Erro ao buscar convite:', error);
        setError('Erro ao buscar detalhes do convite');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [location.search]);

  const handleAcceptInvite = async () => {
    if (!user || !invitation) return;

    try {
      setAccepting(true);
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      
      if (!token) {
        throw new Error('Token de convite não fornecido');
      }
      
      const result = await acceptInvitation(token, user.id);
      
      if (!result) {
        throw new Error('Erro ao aceitar convite');
      }
      
      toast({
        title: 'Convite aceito',
        description: 'Você agora é membro da organização!',
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao aceitar convite:', error);
      toast({
        title: 'Erro ao aceitar convite',
        description: 'Houve um problema ao processar seu convite.',
        variant: 'destructive',
      });
    } finally {
      setAccepting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    navigate(`/login?redirect=${encodeURIComponent(`/accept-invite?token=${token}`)}`);
    return null;
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
              <div className="text-center p-4 text-red-500">
                <p>{error}</p>
              </div>
            ) : invitation ? (
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
            ) : null}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/')}>
              Cancelar
            </Button>
            {invitation && !error && (
              <Button onClick={handleAcceptInvite} disabled={accepting}>
                {accepting ? 'Processando...' : 'Aceitar Convite'}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AcceptInvitePage;
