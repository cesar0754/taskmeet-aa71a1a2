import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useOrganization } from '@/context/OrganizationContext';
import { useGroups } from '@/hooks/useGroups';
import { useGroupMembers } from '@/hooks/useGroupMembers';
import GroupCard from './GroupCard';
import GroupForm from './GroupForm';
import GroupMembersDialog from './GroupMembersDialog';
import { Group } from '@/types/group';

const GroupsList: React.FC = () => {
  const { organization } = useOrganization();
  const { groups, loading, deleteGroup } = useGroups(organization?.id);
  
  const [editGroup, setEditGroup] = useState<Group | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Group | null>(null);
  const [viewMembersGroup, setViewMembersGroup] = useState<Group | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      setIsDeleting(true);
      await deleteGroup(deleteConfirm.id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Erro ao deletar grupo:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && groups.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Grupos</CardTitle>
          <CardDescription>
            Carregando grupos...
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
          <CardTitle>Grupos da Organização</CardTitle>
          <CardDescription>
            {groups.length === 0 
              ? 'Nenhum grupo encontrado. Crie seu primeiro grupo!' 
              : `${groups.length} ${groups.length === 1 ? 'grupo encontrado' : 'grupos encontrados'}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {groups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum grupo criado ainda
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {groups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onEdit={() => setEditGroup(group)}
                  onDelete={() => setDeleteConfirm(group)}
                  onViewMembers={() => setViewMembersGroup(group)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para editar grupo */}
      <Dialog open={!!editGroup} onOpenChange={() => setEditGroup(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Grupo</DialogTitle>
            <DialogDescription>
              Atualize as informações do grupo.
            </DialogDescription>
          </DialogHeader>
          {editGroup && (
            <GroupForm 
              group={editGroup}
              onSuccess={() => setEditGroup(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para confirmar exclusão */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o grupo "{deleteConfirm?.name}"? 
              Esta ação não pode ser desfeita e todos os membros serão removidos do grupo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog para ver membros do grupo */}
      {viewMembersGroup && (
        <GroupMembersDialog
          group={viewMembersGroup}
          open={!!viewMembersGroup}
          onOpenChange={() => setViewMembersGroup(null)}
        />
      )}
    </>
  );
};

export default GroupsList;