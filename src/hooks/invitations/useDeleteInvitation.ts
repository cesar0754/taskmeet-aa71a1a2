
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { deleteInvitation } from '@/services/invitation';
import { Invitation } from '@/types/invitation';

/**
 * Hook dedicado para gerenciar a remoção de convites
 * @param refreshCallback Função para atualizar a lista de convites após a remoção
 * @returns Estado e handlers para o processo de remoção de convites
 */
export const useDeleteInvitation = (refreshCallback: () => void) => {
  const { toast } = useToast();
  const [deleteConfirm, setDeleteConfirm] = useState<Invitation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      setIsDeleting(true);
      console.log('[handleDelete] Removendo convite com ID:', deleteConfirm.id);
      
      const success = await deleteInvitation(deleteConfirm.id);
      
      if (success) {
        console.log('[handleDelete] Convite removido com sucesso, chamando refreshCallback');
        toast({
          title: 'Convite removido',
          description: 'O convite foi removido com sucesso.',
        });
        
        refreshCallback();
      } else {
        console.error('[handleDelete] Falha ao remover convite, chamando refreshCallback mesmo assim');
        toast({
          title: 'Erro ao remover convite',
          description: 'Houve um problema ao remover o convite. A lista será atualizada.',
          variant: 'destructive',
        });
        
        refreshCallback();
      }
    } catch (error) {
      console.error('[handleDelete] Erro completo ao remover convite:', error);
      toast({
        title: 'Erro ao remover convite',
        description: 'Houve um problema ao remover o convite.',
        variant: 'destructive',
      });
      
      refreshCallback();
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  return {
    deleteConfirm,
    isDeleting,
    setDeleteConfirm,
    handleDelete
  };
};
