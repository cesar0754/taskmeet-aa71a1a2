import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TaskCreateRequest, TaskPriority, TaskStatus } from '@/types/task';
import { Member } from '@/types/organization';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useOrganization } from '@/context/OrganizationContext';
import { fetchOrganizationMembers } from '@/services/organization/organizationService';

const taskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed']).optional(),
  priority: z.enum(['low', 'medium', 'high']),
  due_date: z.date().optional(),
  assigned_to: z.string().optional(), // Deprecated
  assignee_ids: z.array(z.string()).optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onSubmit: (data: TaskCreateRequest) => void;
  loading?: boolean;
  onCancel?: () => void;
  initialData?: {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority: TaskPriority;
    due_date?: string;
    assigned_to?: string; // Deprecated
    assignee_ids?: string[];
  };
}

export default function TaskForm({ onSubmit, loading, onCancel, initialData }: TaskFormProps) {
  const { organization } = useOrganization();
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>(
    initialData?.assignee_ids || (initialData?.assigned_to ? [initialData.assigned_to] : [])
  );
  
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      status: initialData?.status || 'pending',
      priority: initialData?.priority || 'medium',
      due_date: initialData?.due_date ? new Date(initialData.due_date) : undefined,
      assigned_to: initialData?.assigned_to || undefined,
      assignee_ids: initialData?.assignee_ids || (initialData?.assigned_to ? [initialData.assigned_to] : []),
    },
  });

  useEffect(() => {
    const loadMembers = async () => {
      if (organization?.id) {
        try {
          const membersData = await fetchOrganizationMembers(organization.id);
          // Filtrar apenas membros que têm user_id (estão ativos)
          const activeMembers = membersData.filter(member => member.user_id);
          setMembers(activeMembers);
        } catch (error) {
          console.error('Erro ao carregar membros:', error);
        }
      }
    };
    
    loadMembers();
  }, [organization?.id]);

  const handleAssigneeChange = (userId: string, checked: boolean) => {
    let newAssignees;
    if (checked) {
      newAssignees = [...selectedAssignees, userId];
    } else {
      newAssignees = selectedAssignees.filter(id => id !== userId);
    }
    setSelectedAssignees(newAssignees);
    form.setValue('assignee_ids', newAssignees);
  };

  const handleSubmit = (data: TaskFormData) => {
    const taskData: TaskCreateRequest & { status?: TaskStatus } = {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      due_date: data.due_date?.toISOString(),
      assignee_ids: selectedAssignees.length > 0 ? selectedAssignees : undefined,
      // Manter assigned_to para compatibilidade
      assigned_to: selectedAssignees.length > 0 ? selectedAssignees[0] : undefined,
    };
    onSubmit(taskData);
  };

  const getPriorityLabel = (priority: TaskPriority) => {
    const labels = {
      low: 'Baixa',
      medium: 'Média',
      high: 'Alta',
    };
    return labels[priority];
  };

  const getStatusLabel = (status: TaskStatus) => {
    const labels = {
      pending: 'Pendente',
      in_progress: 'Em Progresso',
      completed: 'Concluída',
    };
    return labels[status];
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Digite o título da tarefa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Digite a descrição da tarefa (opcional)" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {initialData && (
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">{getStatusLabel('pending')}</SelectItem>
                    <SelectItem value="in_progress">{getStatusLabel('in_progress')}</SelectItem>
                    <SelectItem value="completed">{getStatusLabel('completed')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prioridade</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">{getPriorityLabel('low')}</SelectItem>
                  <SelectItem value="medium">{getPriorityLabel('medium')}</SelectItem>
                  <SelectItem value="high">{getPriorityLabel('high')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data de Vencimento</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className="w-full pl-3 text-left font-normal"
                    >
                      {field.value ? (
                        format(field.value, 'PPP', { locale: ptBR })
                      ) : (
                        <span>Selecione uma data (opcional)</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Responsáveis</FormLabel>
          <div className="mt-2 space-y-2 max-h-32 overflow-y-auto border rounded-md p-3">
            {members.map((member) => (
              <div key={member.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`assignee-${member.user_id}`}
                  checked={selectedAssignees.includes(member.user_id!)}
                  onCheckedChange={(checked) => 
                    handleAssigneeChange(member.user_id!, checked as boolean)
                  }
                />
                <Label htmlFor={`assignee-${member.user_id}`} className="text-sm">
                  {member.name} ({member.role})
                </Label>
              </div>
            ))}
            {members.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhum membro encontrado na organização
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Salvando...' : (initialData ? 'Atualizar Tarefa' : 'Criar Tarefa')}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}