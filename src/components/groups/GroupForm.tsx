import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useOrganization } from '@/context/OrganizationContext';
import { useGroups } from '@/hooks/useGroups';
import { Group } from '@/types/group';

const formSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface GroupFormProps {
  group?: Group;
  onSuccess?: () => void;
}

const GroupForm: React.FC<GroupFormProps> = ({ group, onSuccess }) => {
  const { organization } = useOrganization();
  const { createGroup, updateGroup } = useGroups(organization?.id);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: group?.name || '',
      description: group?.description || '',
    }
  });

  const onSubmit = async (data: FormValues) => {
    if (!organization) return;

    try {
      if (group) {
        await updateGroup(group.id, data);
      } else {
        await createGroup({
          name: data.name,
          description: data.description,
          organization_id: organization.id
        });
      }
      
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao salvar grupo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Grupo</Label>
        <Input
          id="name"
          placeholder="Digite o nome do grupo"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          placeholder="Descreva o propósito do grupo (opcional)"
          rows={3}
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Salvando...' : group ? 'Atualizar Grupo' : 'Criar Grupo'}
      </Button>
    </form>
  );
};

export default GroupForm;