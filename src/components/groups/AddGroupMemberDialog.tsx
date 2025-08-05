import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useGroupMembers } from '@/hooks/useGroupMembers';
import { useOrganization } from '@/context/OrganizationContext';
import { Group } from '@/types/group';
import { Member } from '@/types/organization';

interface AddGroupMemberDialogProps {
  group: Group;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddGroupMemberDialog: React.FC<AddGroupMemberDialogProps> = ({
  group,
  open,
  onOpenChange
}) => {
  const { members: organizationMembers } = useOrganization();
  const { members: groupMembers, addMember } = useGroupMembers(group.id);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('member');
  const [isAdding, setIsAdding] = useState(false);

  // Filtrar membros que já não estão no grupo
  const availableMembers = organizationMembers.filter(orgMember => 
    !groupMembers.some(groupMember => groupMember.member_id === orgMember.id)
  );

  const handleAddMember = async () => {
    if (!selectedMemberId) return;
    
    try {
      setIsAdding(true);
      await addMember({
        group_id: group.id,
        member_id: selectedMemberId,
        role: selectedRole
      });
      
      setSelectedMemberId('');
      setSelectedRole('member');
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Membro ao Grupo</DialogTitle>
          <DialogDescription>
            Selecione um membro da organização para adicionar ao grupo "{group.name}".
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {availableMembers.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Todos os membros da organização já estão neste grupo.
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="member">Selecionar Membro</Label>
                <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha um membro" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name} ({member.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role no Grupo</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Membro</SelectItem>
                    <SelectItem value="moderator">Moderador</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAddMember}
                  disabled={!selectedMemberId || isAdding}
                  className="flex-1"
                >
                  {isAdding ? 'Adicionando...' : 'Adicionar'}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddGroupMemberDialog;