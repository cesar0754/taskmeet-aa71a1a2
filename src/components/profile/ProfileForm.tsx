import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Profile, UpdateProfileData } from '@/types/profile';

const profileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  avatar_url: z.string().url('URL inválida').optional().or(z.literal(''))
});

interface ProfileFormProps {
  profile: Profile;
  onUpdate: (data: UpdateProfileData) => Promise<boolean>;
  updating: boolean;
}

export const ProfileForm = ({ profile, onUpdate, updating }: ProfileFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      email: profile.email,
      avatar_url: profile.avatar_url || ''
    }
  });

  const onSubmit = async (data: UpdateProfileData) => {
    const success = await onUpdate(data);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    reset({
      name: profile.name,
      email: profile.email,
      avatar_url: profile.avatar_url || ''
    });
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Perfil do Usuário</CardTitle>
        <CardDescription>
          Gerencie suas informações pessoais
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.avatar_url} alt={profile.name} />
            <AvatarFallback className="text-lg">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-medium">{profile.name}</h3>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              {...register('name')}
              disabled={!isEditing}
              className={!isEditing ? 'bg-muted' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              disabled={!isEditing}
              className={!isEditing ? 'bg-muted' : ''}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar_url">URL do Avatar</Label>
            <Input
              id="avatar_url"
              {...register('avatar_url')}
              disabled={!isEditing}
              className={!isEditing ? 'bg-muted' : ''}
              placeholder="https://exemplo.com/avatar.jpg"
            />
            {errors.avatar_url && (
              <p className="text-sm text-destructive">{errors.avatar_url.message}</p>
            )}
          </div>

          <div className="flex space-x-2">
            {!isEditing ? (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                variant="outline"
              >
                Editar Perfil
              </Button>
            ) : (
              <>
                <Button
                  type="submit"
                  disabled={updating}
                >
                  {updating ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={updating}
                >
                  Cancelar
                </Button>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};