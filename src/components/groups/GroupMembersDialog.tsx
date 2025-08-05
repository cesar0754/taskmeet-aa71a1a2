import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { UserPlus, Trash2 } from 'lucide-react';
import { useGroupMembers } from '@/hooks/useGroupMembers';
import { useOrganization } from '@/context/OrganizationContext';
import { Group, GroupMember } from '@/types/group';
import AddGroupMemberDialog from './AddGroupMemberDialog';

interface GroupMembersDialogProps {
  group: Group;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GroupMembersDialog: React.FC<GroupMembersDialogProps> = ({
  group,
  open,
  onOpenChange
}) => {
  const { members, loading, removeMember, updateMemberRole } = useGroupMembers(group.id);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<GroupMember | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;
    
    try {
      setIsRemoving(true);
      await removeMember(memberToRemove.id);
      setMemberToRemove(null);
    } catch (error) {
      console.error('Erro ao remover membro:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleRoleChange = async (groupMemberId: string, newRole: string) => {
    try {
      await updateMemberRole(groupMemberId, newRole);
    } catch (error) {
      console.error('Erro ao atualizar role:', error);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'moderator':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Membros do Grupo: {group.name}</DialogTitle>
            <DialogDescription>
              Gerencie os membros e suas permissões neste grupo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {members.length} {members.length === 1 ? 'membro' : 'membros'} no grupo
              </div>
              <Button onClick={() => setShowAddMember(true)} size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar Membro
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center p-6">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role na Organização</TableHead>
                    <TableHead>Role no Grupo</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        Nenhum membro no grupo
                      </TableCell>
                    </TableRow>
                  ) : (
                    members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">
                          {member.member?.name}
                        </TableCell>
                        <TableCell>{member.member?.email}</TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(member.member?.role || 'member')}>
                            {member.member?.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={member.role}
                            onValueChange={(value) => handleRoleChange(member.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="member">Membro</SelectItem>
                              <SelectItem value="moderator">Moderador</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setMemberToRemove(member)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para adicionar membro */}
      {showAddMember && (
        <AddGroupMemberDialog
          group={group}
          open={showAddMember}
          onOpenChange={setShowAddMember}
        />
      )}

      {/* Dialog para confirmar remoção */}
      <AlertDialog open={!!memberToRemove} onOpenChange={() => setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Membro</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover "{memberToRemove?.member?.name}" do grupo "{group.name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRemoveMember}
              disabled={isRemoving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRemoving ? 'Removendo...' : 'Remover'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default GroupMembersDialog;