
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useOrganization } from '@/context/OrganizationContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(3, { message: 'O nome da organização deve ter pelo menos 3 caracteres' }),
});

type FormValues = z.infer<typeof formSchema>;

const CreateOrganization: React.FC = () => {
  const { createOrganization, loading } = useOrganization();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const result = await createOrganization(values.name);
      if (result) {
        toast({
          title: "Organização criada com sucesso",
          description: `A organização "${values.name}" foi criada e você foi adicionado como membro.`,
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error creating organization:', error);
      toast({
        title: "Erro ao criar organização",
        description: "Ocorreu um erro ao criar a organização. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Criar Organização</CardTitle>
          <CardDescription className="text-center">Crie sua primeira organização para começar</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Organização</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da sua empresa ou equipe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Criando...' : 'Criar Organização'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateOrganization;
