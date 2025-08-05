import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TaskCreateRequest, TaskPriority } from '@/types/task';
import { Member } from '@/types/organization';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useOrganization } from '@/context/OrganizationContext';
import { fetchOrganizationMembers } from '@/services/organization/organizationService';

const taskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  due_date: z.date().optional(),
  assigned_to: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onSubmit: (data: TaskCreateRequest) => void;
  loading?: boolean;
  onCancel?: () => void;
}

export default function TaskForm({ onSubmit, loading, onCancel }: TaskFormProps) {
  const { organization } = useOrganization();
  const [members, setMembers] = useState<Member[]>([]);
  
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
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

  const handleSubmit = (data: TaskFormData) => {
    const taskData: TaskCreateRequest = {
      title: data.title,
      description: data.description,
      priority: data.priority,
      due_date: data.due_date?.toISOString(),
      assigned_to: data.assigned_to,
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

        <FormField
          control={form.control}
          name="assigned_to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsável</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um responsável (opcional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Nenhum responsável</SelectItem>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.user_id!}>
                      {member.name} ({member.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Criando...' : 'Criar Tarefa'}
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