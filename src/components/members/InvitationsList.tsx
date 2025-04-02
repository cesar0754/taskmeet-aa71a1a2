
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Copy, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useOrganization } from '@/context/OrganizationContext';
import { Invitation, getInvitationsByOrganization, deleteInvitation } from '@/services/invitationService';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const InvitationsList: React.FC = () => {
  const { organization } = useOrganization();
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<Invitation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Chave para forçar a atualização

  // Refatorando o carregamento para usar useCallback
  const loadInvitations = useCallback(async () => {
    if (!organization) return;
    
    try {
      setLoading(true);
      console.log('Carregando convites para organização:', organization.id);
      const invitationsList = await getInvitationsByOrganization(organization.id);
      console.log('Convites carregados:', invitationsList?.length || 0);
      if (invitationsList) {
        setInvitations(invitationsList);
      } else {
        setInvitations([]);
      }
    } catch (error) {
      console.error('Erro ao carregar convites:', error);
      toast({
        title: 'Erro ao carregar convites',
        description: 'Não foi possível carregar a lista de convites.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [organization, toast]);

  useEffect(() => {
    if (organization) {
      loadInvitations();
    }
  }, [organization, loadInvitations, refreshKey]);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      setIsDeleting(true);
      console.log('Removendo convite com ID:', deleteConfirm.id);
      
      const success = await deleteInvitation(deleteConfirm.id);
      
      if (success) {
        // Atualiza o estado local imediatamente
        setInvitations(prev => prev.filter(inv => inv.id !== deleteConfirm.id));
        
        toast({
          title: 'Convite removido',
          description: 'O convite foi removido com sucesso.',
        });
      } else {
        toast({
          title: 'Erro ao remover convite',
          description: 'Houve um problema ao remover o convite.',
          variant: 'destructive',
        });
        
        // Recarrega a lista de convites em caso de falha
        setRefreshKey(prev => prev + 1);
      }
    } catch (error) {
      console.error('Erro ao remover convite:', error);
      toast({
        title: 'Erro ao remover convite',
        description: 'Houve um problema ao remover o convite.',
        variant: 'destructive',
      });
      
      // Recarrega a lista de convites em caso de erro
      setRefreshKey(prev => prev + 1);
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  const copyInviteLink = (invitation: Invitation) => {
    // URL base da aplicação
    const baseUrl = window.location.origin;
    // Link de convite com o token
    const inviteLink = `${baseUrl}/accept-invite?token=${invitation.token}`;
    
    navigator.clipboard.writeText(inviteLink).then(
      () => {
        toast({
          title: 'Link copiado',
          description: 'Link de convite copiado para a área de transferência.',
        });
      },
      () => {
        toast({
          title: 'Falha ao copiar',
          description: 'Não foi possível copiar o link para a área de transferência.',
          variant: 'destructive',
        });
      }
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Convites Pendentes</CardTitle>
          <CardDescription>
            Carregando convites...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Convites Pendentes</CardTitle>
          <CardDescription>
            Convites enviados que ainda não foram aceitos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Enviado</TableHead>
                <TableHead>Expira</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    Nenhum convite pendente encontrado
                  </TableCell>
                </TableRow>
              ) : (
                invitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-medium">{invitation.name}</TableCell>
                    <TableCell>{invitation.email}</TableCell>
                    <TableCell>
                      <Badge className={
                        invitation.role === 'admin' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          : invitation.role === 'editor'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      }>
                        {invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(invitation.created_at), { 
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(invitation.expires_at), { 
                        addSuffix: true,
                        locale: ptBR 
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => copyInviteLink(invitation)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copiar Link
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setDeleteConfirm(invitation)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog 
        open={!!deleteConfirm} 
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setDeleteConfirm(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O convite será removido permanentemente e o usuário não poderá mais utilizá-lo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Removendo...' : 'Sim, remover convite'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default InvitationsList;
