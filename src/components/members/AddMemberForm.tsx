
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrganization } from '@/context/OrganizationContext';
import { useToast } from '@/hooks/use-toast';
import { createInvitation } from '@/services/invitationService';

const formSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'E-mail inválido' }),
  role: z.enum(['admin', 'editor', 'viewer'], { required_error: 'Selecione uma função' }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddMemberFormProps {
  onSuccess?: () => void;
}

const AddMemberForm: React.FC<AddMemberFormProps> = ({ onSuccess }) => {
  const { organization } = useOrganization();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'creating' | 'sending'>('idle');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'viewer',
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!organization) {
      toast({
        title: 'Erro ao adicionar membro',
        description: 'Nenhuma organização selecionada.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setFormStatus('creating');
      
      const { emailSent } = await createInvitation(
        organization.id,
        values.email,
        values.name,
        values.role
      );
      
      if (emailSent) {
        toast({
          title: 'Convite enviado',
          description: `Um convite foi enviado para ${values.email}`,
        });
      } else {
        toast({
          title: 'Convite criado, mas e-mail não foi entregue',
          description: 'Use a lista de convites para reenviar ou copiar o link manualmente.',
          variant: 'destructive',
        });
      }
      
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Erro ao enviar convite:', error);
      toast({
        title: 'Erro ao enviar convite',
        description: 'Houve um problema ao enviar o convite.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      setFormStatus('idle');
    }
  };

  const getSubmitButtonText = () => {
    if (formStatus === 'creating') return 'Criando convite...';
    if (formStatus === 'sending') return 'Enviando e-mail...';
    return 'Enviar Convite';
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do membro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="email@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Função</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Visualizador</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {getSubmitButtonText()}
        </Button>
      </form>
    </Form>
  );
};

export default AddMemberForm;
